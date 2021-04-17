import { Program } from "../ast/index";
import { createEnvironment } from "./context/environment";
import { InterpreterContext } from "./context/index";
import { IO } from "./io";
import { runBlock } from "./runBlock";

export type Interpreter = {
  run: (program: Program) => Promise<void>;
};

export function createInterpreter(io: IO): Interpreter {
  return {
    async run(program) {
      const context: InterpreterContext = {
        io,
        environment: createEnvironment(),
      };
      await runBlock(program.statements, context);
    },
  };
}
