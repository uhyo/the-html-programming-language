import { parseProgram } from "./parser/index";

export function runProgram(container: HTMLElement) {
  const program = parseProgram(container);
  console.log(program);
}
