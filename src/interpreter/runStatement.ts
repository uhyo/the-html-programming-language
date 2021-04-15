import { Statement } from "../ast/statement";
import { InterpreterContext } from "./context";
import { runExpression } from "./runExpression";

export async function runStatement(
  statement: Statement,
  context: InterpreterContext
) {
  switch (statement.type) {
    case "ExpressionStatement": {
      await runExpression(statement.expression, context);
      return;
    }
    default: {
      // assertNever(statement);
    }
  }
}
