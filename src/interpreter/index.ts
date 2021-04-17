import { Program } from "../ast/index";
import { createEnvironment } from "./context/environment";
import { InterpreterContext } from "./context/index";
import { enterBlock } from "./enterBlock";
import { IO } from "./io";
import { runStatement } from "./runStatement";

export type Interpreter = {
  run: (program: Program) => Promise<void>;
};

export function createInterpreter(io: IO): Interpreter {
  return {
    async run(program) {
      const environment = enterBlock(program.statements, createEnvironment());
      const context: InterpreterContext = {
        io,
        environment,
      };
      for (const statement of program.statements) {
        await runStatement(statement, context);
      }
    },
  };
}
