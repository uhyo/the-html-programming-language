import { Expression } from "../ast/expression";
import { expectNothing } from "./expect";
import { parseExpression } from "./parseExpression";
import { isElement } from "./util";

/**
 * Parses expression list.
 */
export function parseExpressionList(program: readonly Node[]): Expression[] {
  const expressions: Expression[] = [];

  let nodes: Node[] = program.concat([]);
  while (nodes.length > 0) {
    const res = parseExpression(nodes);
    if (!res) {
      break;
    }
    const [expr, next] = res;
    expressions.push(expr);
    nodes = next;
    // parse separator
    const first = nodes[0];
    if (first && isElement(first) && first.tagName === "HR") {
      nodes = next.slice(1);
    }
  }

  expectNothing(nodes);
  return expressions;
}
