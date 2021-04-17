import { Expression } from "../ast/expression";
import { assertNever } from "../util/assertNever";
import { expectBinding } from "./context/environment";
import { InterpreterContext } from "./context/index";
import { runBlock } from "./runBlock";
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
      const targetFunc = expectBinding(
        context.environment,
        expression.href,
        expression.node
      );
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
  const result = await runBlock(func.body, context);
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
