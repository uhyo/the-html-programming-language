export type OutputExpression = {
  type: "OutputExpression";
  expression: Expression;
  node: Node;
};

export function outputExpression(
  node: Node,
  expression: Expression
): OutputExpression {
  return {
    type: "OutputExpression",
    expression,
    node,
  };
}

export type TextExpression = {
  type: "TextExpression";
  text: string;
  node: Node;
};

export function textExpression(node: Node, text: string): TextExpression {
  return {
    type: "TextExpression",
    text,
    node,
  };
}

export type Expression = OutputExpression | TextExpression;
