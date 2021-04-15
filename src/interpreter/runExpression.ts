import { Expression } from "../ast/expression";
import { assertNever } from "../util/assertNever";
import { InterpreterContext } from "./context";
import { Value } from "./value";

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
    default: {
      assertNever(expression);
    }
  }
}
