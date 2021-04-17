import { Statement } from "../ast/statement";
import { assertNever } from "../util/assertNever";
import { InterpreterContext } from "./context/index";
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
    case "SectionDeclaration": {
      return;
    }
    default: {
      assertNever(statement);
    }
  }
}
