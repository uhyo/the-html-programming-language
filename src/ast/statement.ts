import { Expression } from "./expression";

export type ExpressionStatement = {
  type: "ExpressionStatement";
  expression: Expression;
  node: Node;
};

export function expressionStatement(
  node: Node,
  expression: Expression
): ExpressionStatement {
  return {
    type: "ExpressionStatement",
    expression,
    node,
  };
}

export type FooterStatement = {
  type: "FooterStatement";
  expression: Expression;
  node: Node;
};

export function footerStatement(
  node: Node,
  expression: Expression
): FooterStatement {
  return {
    type: "FooterStatement",
    expression,
    node,
  };
}

export type SectionDeclaration = {
  type: "SectionDeclaration";
  title: string;
  body: Statement[];
  node: Node;
};

export function sectionDeclaration(
  node: Node,
  title: string,
  body: Statement[]
): SectionDeclaration {
  return {
    type: "SectionDeclaration",
    title,
    body,
    node,
  };
}

export type Statement =
  | ExpressionStatement
  | FooterStatement
  | SectionDeclaration;
