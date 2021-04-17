import { Program } from "../ast/index";
import { parseStatementList } from "./parseStatementList";

export function parseProgram(program: HTMLElement): Program {
  const statements = parseStatementList(Array.from(program.childNodes));

  return {
    statements,
  };
}
