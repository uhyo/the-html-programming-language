import { Expression } from "../ast/expression";
import { assertNever } from "../util/assertNever";
import { asyncMap } from "../util/asyncMap";
import { expectBinding, expectSlot } from "./context/environment";
import { InterpreterContext } from "./context/index";
import { runFunctionBlock } from "./runBlock";
import { throwTypeMismatchError } from "./runtimeError";
import { FunctionValue, isFunctionValue, Value, valueToString } from "./value";

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
      if (!isFunctionValue(targetFunc)) {
        throwTypeMismatchError("function", targetFunc, expression.node);
      }
      const returnValue = await callFunction(
        targetFunc,
        expression.parameters,
        context
      );
      return returnValue;
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
    default: {
      assertNever(expression);
    }
  }
}

async function callFunction(
  func: FunctionValue,
  parameters: readonly Expression[],
  context: InterpreterContext
): Promise<Value> {
  const parameterValues = await asyncMap(parameters, (exp) =>
    runExpression(exp, context)
  );
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
