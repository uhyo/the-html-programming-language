import { Expression } from "../ast/expression";
import { hasElement } from "../parser/util";
import { assertNever } from "../util/assertNever";
import { asyncMap } from "../util/asyncMap";
import { mathBuiltIns } from "./context/builtIn/math";
import {
  expectBinding,
  expectSlot,
  updateBinding,
} from "./context/environment";
import { InterpreterContext } from "./context/index";
import { runFunctionBlock } from "./runBlock";
import {
  throwTypeMismatchError,
  throwUnexpectedEndOfInputError,
} from "./runtimeError";
import {
  FunctionValue,
  isFunctionValue,
  isNativeFunctionValue,
  Value,
  valueEquality,
  valueToString,
} from "./value";

export async function runExpression(
  expression: Expression,
  context: InterpreterContext
): Promise<Value> {
  switch (expression.type) {
    case "OutputExpression": {
      const value = await runExpression(expression.expression, context);
      context.io.output(valueToString(value));
      return value;
    }
    case "TextExpression": {
      return expression.text;
    }
    case "ConcatExpression": {
      const strings: string[] = [];
      for (const exp of expression.expressions) {
        strings.push(valueToString(await runExpression(exp, context)));
      }
      return strings.join("");
    }
    case "AnchorExpression": {
      const targetFunc =
        typeof expression.href === "string"
          ? expectBinding(context.environment, expression.href, expression.node)
          : await runExpression(expression.href, context);
      const parameterValues = await asyncMap(expression.parameters, (exp) =>
        runExpression(exp, context)
      );
      if (isFunctionValue(targetFunc)) {
        const returnValue = await callFunction(
          targetFunc,
          parameterValues,
          context
        );
        return returnValue;
      }
      if (isNativeFunctionValue(targetFunc)) {
        const returnValue = await targetFunc.body(
          parameterValues,
          expression.node
        );
        return returnValue;
      }
      throwTypeMismatchError("function", targetFunc, expression.node);
    }
    case "SlotExpression": {
      const value = expectSlot(
        context.environment,
        expression.name,
        expression.node
      );
      return value;
    }
    case "VarExpression": {
      const varName = await runExpression(expression.name, context);
      const value = expectBinding(
        context.environment,
        valueToString(varName),
        expression.node
      );
      return value;
    }
    case "MathBuiltInExpression": {
      return mathBuiltIns[expression.name];
    }
    case "InputExpression": {
      const regexp = new RegExp("^" + (expression.pattern ?? ".*\\n"), "u");
      if (expression.name === undefined) {
        const match = await context.input.get(regexp);
        if (match === undefined) {
          throwUnexpectedEndOfInputError(expression.node);
        }

        return match[1] ?? match[0] ?? null;
      } else {
        // input from variable
        const targetValue = valueToString(
          expectBinding(context.environment, expression.name, expression.node)
        );
        const match: string[] | null = regexp.exec(targetValue);
        if (match === null || !hasElement(match)) {
          return null;
        }
        const returnValue = match[1] ?? match[0];
        updateBinding(
          context.environment,
          expression.name,
          targetValue.slice(match[0].length),
          expression.node
        );
        return returnValue;
      }
    }
    case "RubyExpression": {
      const baseValue = await runExpression(expression.expression, context);
      for (const { condition, then } of expression.branches) {
        const condValue = await runExpression(condition, context);
        if (valueEquality(baseValue, condValue)) {
          return runExpression(then, context);
        }
      }
      return expression.else ? runExpression(expression.else, context) : null;
    }
    case "SpanExpression": {
      return runExpression(expression.expression, context);
    }
    default: {
      assertNever(expression);
    }
  }
}

async function callFunction(
  func: FunctionValue,
  parameterValues: readonly Value[],
  context: InterpreterContext
): Promise<Value> {
  const result = await runFunctionBlock(func.body, context, parameterValues);
  switch (result.type) {
    case "normal": {
      return null;
    }
    case "footer": {
      return result.value;
    }
    default: {
      assertNever(result);
    }
  }
}
