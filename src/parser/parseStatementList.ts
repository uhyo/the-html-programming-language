import { Statement } from "../ast/statement";
import { expectNothing } from "./expect";
import { parseStatement } from "./parseStatement";

/**
 * Parses statement list.
 * Error if there is extra node.
 */
export function parseStatementList(program: readonly Node[]): Statement[] {
  const statements: Statement[] = [];

  let nodes: Node[] = program.concat([]);
  while (nodes.length > 0) {
    const res = parseStatement(nodes);
    if (!res) {
      break;
    }
    const [stmt, next] = res;
    statements.push(stmt);
    nodes = next;
  }
  expectNothing(nodes);

  return statements;
}
