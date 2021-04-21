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
  href: string | Expression;
  parameters: readonly Expression[];
  node: Node;
};

export function anchorExpression(
  node: Node,
  href: string | Expression,
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
 * Expression that retrieves value of variable
 */
export type VarExpression = {
  type: "VarExpression";
  name: Expression;
  node: Node;
};

export function varExpression(node: Node, name: Expression): VarExpression {
  return {
    type: "VarExpression",
    name,
    node,
  };
}

export type MathBuiltInType =
  | "plus"
  | "minus"
  | "times"
  | "divide"
  | "rem"
  | "power"
  | "gcd"
  | "min"
  | "max";

/**
 * Expression that represents a built-in math function.
 */
export type MathBuiltInExpression = {
  type: "MathBuiltInExpression";
  name: MathBuiltInType;
  node: Node;
};

export function mathBuiltInExpression(
  node: Node,
  name: MathBuiltInType
): MathBuiltInExpression {
  return {
    type: "MathBuiltInExpression",
    name,
    node,
  };
}

export type InputExpression = {
  type: "InputExpression";
  name?: string;
  pattern?: string;
  node: Node;
};

export function inputExpression(
  node: Node,
  name: string | undefined,
  pattern: string | undefined
): InputExpression {
  return {
    type: "InputExpression",
    name,
    pattern,
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
  | VarExpression
  | MathBuiltInExpression
  | InputExpression
  | ConcatExpression;
