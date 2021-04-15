import { createInterpreter } from "./interpreter/index";
import { parseProgram } from "./parser/index";

export async function runProgram(container: HTMLElement) {
  const program = parseProgram(container);
  console.debug("parsed", program);

  const interpreter = createInterpreter({
    output: console.log,
  });
  await interpreter.run(program);
}
