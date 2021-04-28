import {
  mathBuiltInExpression,
  MathBuiltInExpression,
  MathBuiltInType
} from "../ast/expression";
import { skipTrivia } from "./skipTrivia";
import { throwExpectError } from "./SyntaxError";
import { isElement } from "./util";

export function parseMathExpression(element: Element): MathBuiltInExpression {
  const nodes = skipTrivia(Array.from(element.childNodes));
  const firstChild = nodes[0];
  if (firstChild === undefined || !isElement(firstChild)) {
    throwExpectError("an element", element);
  }
  const builtInType = firstChild.tagName.toLowerCase();
  if (!isMathBuiltInType(builtInType)) {
    throwExpectError(
      "one of: " + Array.from(builtInSet.values()).join(", "),
      firstChild
    );
  }
  return mathBuiltInExpression(firstChild, builtInType);
}

const builtInSet: ReadonlySet<string> = new Set<MathBuiltInType>([
  "plus",
  "minus",
  "times",
  "divide",
  "rem",
  "power",
  "gcd",
  "min",
  "max",
  "eq",
  "neq",
  "lt",
  "gt",
  "leq",
  "geq",
  "and",
  "or",
  "xor",
  "implies",
]);

function isMathBuiltInType(value: string): value is MathBuiltInType {
  return builtInSet.has(value);
}
