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

export type DefinitionListStatement = {
  type: "DefinitionListStatement";
  definitions: {
    name: Expression;
    value: Expression;
  }[];
  node: Node;
};

export function definitionListStatement(
  node: Node,
  definitions: {
    name: Expression;
    value: Expression;
  }[]
): DefinitionListStatement {
  return {
    type: "DefinitionListStatement",
    definitions,
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
  | DefinitionListStatement
  | SectionDeclaration;
