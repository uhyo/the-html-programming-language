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

export type AbbrExpression = {
  type: "AbbrExpression";
  title: string | Expression;
  parameters: readonly Expression[];
  node: Node;
};

export function abbrExpression(
  node: Node,
  title: string | Expression,
  parameters: readonly Expression[]
): AbbrExpression {
  return {
    type: "AbbrExpression",
    title,
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
  | "max"
  // relations
  | "eq"
  | "neq"
  | "lt"
  | "gt"
  | "leq"
  | "geq"
  // logical
  | "and"
  | "or"
  | "xor"
  | "implies";

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
 * Expression for branching
 */
export type RubyExpression = {
  type: "RubyExpression";
  expression: Expression;
  branches: {
    condition: Expression;
    then: Expression;
  }[];
  else?: Expression;
  node: Node;
};

export function rubyExpression(
  node: Node,
  expression: Expression,
  branches: {
    condition: Expression;
    then: Expression;
  }[],
  elseExpr: Expression | undefined
): RubyExpression {
  return {
    type: "RubyExpression",
    expression,
    branches,
    else: elseExpr,
    node,
  };
}

export type SpanExpression = {
  type: "SpanExpression";
  expression: Expression;
  node: Node;
};

export function spanExpression(
  node: Node,
  expression: Expression
): SpanExpression {
  return {
    type: "SpanExpression",
    expression,
    node,
  };
}

export type MeterExpression = {
  type: "MeterExpression";
  expression: Expression;
  node: Node;
};

export function meterExpression(
  node: Node,
  expression: Expression
): MeterExpression {
  return {
    type: "MeterExpression",
    expression,
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
  | AbbrExpression
  | TextExpression
  | SlotExpression
  | VarExpression
  | MathBuiltInExpression
  | InputExpression
  | RubyExpression
  | SpanExpression
  | MeterExpression
  | ConcatExpression;
