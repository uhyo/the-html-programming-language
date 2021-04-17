import { Statement } from "../ast/statement";
import { assertNever } from "../util/assertNever";
import { InterpreterContext } from "./context/index";
import { runExpression } from "./runExpression";
import { Value } from "./value";

export type RunStatementResult =
  | {
      readonly type: "normal";
    }
  | {
      readonly type: "footer";
      readonly value: Value;
    };

const normalResult: RunStatementResult = {
  type: "normal",
};

export async function runStatement(
  statement: Statement,
  context: InterpreterContext
): Promise<RunStatementResult> {
  switch (statement.type) {
    case "ExpressionStatement": {
      await runExpression(statement.expression, context);
      return normalResult;
    }
    case "FooterStatement": {
      const value = await runExpression(statement.expression, context);
      return {
        type: "footer",
        value,
      };
    }
    case "SectionDeclaration": {
      return normalResult;
    }
    default: {
      assertNever(statement);
    }
  }
}
