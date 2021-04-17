import { Statement } from "../ast/statement";
import { createScope, Environment } from "./context/environment";
import { createFunctionValue } from "./value";

/**
 * Enter a block.
 * @returns a new environment
 */
export function enterBlock(
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
