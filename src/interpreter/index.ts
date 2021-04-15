import { Program } from "../ast/index";
import { InterpreterContext } from "./context";
import { IO } from "./io";
import { runStatement } from "./runStatement";

export type Interpreter = {
  run: (program: Program) => Promise<void>;
};

export function createInterpreter(io: IO): Interpreter {
  return {
    async run(program) {
      const context: InterpreterContext = { io };
      for (const statement of program.statements) {
        await runStatement(statement, context);
      }
    },
  };
}
