import { Expression } from "../ast/expression";
import { throwExpectError, throwUnexpectedNodeError } from "./error";
import { parseExpression } from "./parseExpression";
import { skipTrivia } from "./skipTrivia";

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
