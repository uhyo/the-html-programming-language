import { Expression } from "../ast/expression";
import { parseExpression } from "./parseExpression";
import { skipTrivia } from "./skipTrivia";
import {
  throwExpectAttributeError,
  throwExpectError,
  throwUnexpectedNodeError,
} from "./syntaxError";

export function expectExpression(
  program: readonly Node[],
  containerNode: Node
): [expression: Expression, next: Node[]] {
  const res = parseExpression(program);
  if (res === undefined) {
    throwExpectError("expression", program[0] || containerNode);
  }
  return res;
}

/**
 * Throw a SyntaxError if there is non-trivia node in given program.
 */
export function expectNothing(program: readonly Node[]) {
  const prog = skipTrivia(program);
  if (prog.length > 0) {
    throwUnexpectedNodeError(prog[0]);
  }
}

/**
 * Throw a SyntaxError if there is no attribute of given name.
 */
export function expectAttribute(element: Element, name: string): string {
  const attr = element.getAttribute(name);
  if (attr === null) {
    throwExpectAttributeError(name, element);
  }
  return attr;
}
