import { Statement } from "../ast/statement";
import { createScope, Environment } from "./context/environment";
import { InterpreterContext } from "./context/index";
import { runStatement } from "./runStatement";
import { createFunctionValue, Value } from "./value";

export type RunBlockResult =
  | {
      readonly type: "normal";
    }
  | {
      readonly type: "footer";
      readonly value: Value;
    };

export async function runBlock(
  block: readonly Statement[],
  context: InterpreterContext
): Promise<RunBlockResult> {
  const newEnvironment = enterBlock(block, context.environment);
  const newContext = {
    ...context,
    environment: newEnvironment,
  };
  for (const statement of block) {
    const res = await runStatement(statement, newContext);
    if (res.type === "footer") {
      return {
        type: "footer",
        value: res.value,
      };
    }
  }
  return {
    type: "normal",
  };
}

/**
 * Enter a block.
 * @returns a new environment
 */
function enterBlock(
  block: readonly Statement[],
  environment: Environment
): Environment {
  const newScope = createScope();
  const newEnvironment: Environment = {
    scopes: [...environment.scopes, newScope],
  };
  // hoist declarations
  for (const statement of block) {
    switch (statement.type) {
      case "SectionDeclaration": {
        const func = createFunctionValue(newEnvironment, statement.body);
        newScope.bindings.set(statement.title, func);
        break;
      }
    }
  }
  return newEnvironment;
}
