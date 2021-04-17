import { Expression } from "../ast/expression";
import { assertNever } from "../util/assertNever";
import { expectBinding } from "./context/environment";
import { InterpreterContext } from "./context/index";
import { enterBlock } from "./enterBlock";
import { runStatement } from "./runStatement";
import { throwTypeMismatchError } from "./runtimeError";
import { FunctionValue, isFunctionValue, Value } from "./value";

export async function runExpression(
  expression: Expression,
  context: InterpreterContext
): Promise<Value> {
  switch (expression.type) {
    case "OutputExpression": {
      const value = await runExpression(expression.expression, context);
      context.io.output(String(value));
      return value;
    }
    case "TextExpression": {
      return expression.text;
    }
    case "ConcatExpression": {
      const strings: string[] = [];
      for (const exp of expression.expressions) {
        strings.push(String(await runExpression(exp, context)));
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
      const returnValue = callFunction(
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

function callFunction(
  func: FunctionValue,
  parameters: readonly Expression[],
  context: InterpreterContext
): Value {
  const newEnvironment = enterBlock(func.body, context.environment);
  const newContext: InterpreterContext = {
    ...context,
    environment: newEnvironment,
  };
  for (const statement of func.body) {
    runStatement(statement, newContext);
  }
  return null;
}
