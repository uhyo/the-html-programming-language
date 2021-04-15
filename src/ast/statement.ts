import { Expression } from "./expression";

export type ExpressionStatement = {
  type: "ExpressionStatement";
  expression: Expression;
};

export function expressionStatement(
  expression: Expression
): ExpressionStatement {
  return {
    type: "ExpressionStatement",
    expression,
  };
}

export type Statement = ExpressionStatement;
