import { Statement } from "../ast/statement";
import { assertNever } from "../util/assertNever";
import { createBinding } from "./context/environment";
import { InterpreterContext } from "./context/index";
import { runExpression } from "./runExpression";
import { Value, valueToString } from "./value";

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
    case "DefinitionListStatement": {
      for (const { name, value } of statement.definitions) {
        const namev = valueToString(await runExpression(name, context));
        const valuev = await runExpression(value, context);
        createBinding(context.environment, namev, valuev, statement.node);
      }
      return normalResult;
    }
    case "SectionDeclaration": {
      return normalResult;
    }
    default: {
      assertNever(statement);
    }
  }
}
