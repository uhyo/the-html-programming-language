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

export type AnchorExpression = {
  type: "AnchorExpression";
  href: string;
  parameters: readonly Expression[];
  node: Node;
};

export function anchorExpression(
  node: Node,
  href: string,
  parameters: readonly Expression[]
): AnchorExpression {
  return {
    type: "AnchorExpression",
    href,
    parameters,
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

export type SlotExpression = {
  type: "SlotExpression";
  name: string;
  node: Node;
};

export function slotExpression(node: Node, name: string): SlotExpression {
  return {
    type: "SlotExpression",
    name,
    node,
  };
}

/**
 * Expression that concats given expressions as string and return a string.
 */
export type ConcatExpression = {
  type: "ConcatExpression";
  expressions: Expression[];
  node: Node;
};

export function concatExpression(
  node: Node,
  expressions: Expression[]
): ConcatExpression {
  return {
    type: "ConcatExpression",
    expressions,
    node,
  };
}

export type Expression =
  | OutputExpression
  | AnchorExpression
  | TextExpression
  | SlotExpression
  | ConcatExpression;
