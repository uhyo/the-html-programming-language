import { Program } from "../ast/index";
import { Statement } from "../ast/statement";
import { expectNothing } from "./expect";
import { parseStatement } from "./parseStatement";

export function parseProgram(program: HTMLElement): Program {
  const statements: Statement[] = [];

  let nodes: Node[] = Array.from(program.childNodes);
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

  return {
    statements,
  };
}
