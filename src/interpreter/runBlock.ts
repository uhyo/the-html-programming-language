import { Statement } from "../ast/statement";
import { createBinding, createScope, Environment } from "./context/environment";
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

export function runBlock(
  block: readonly Statement[],
  context: InterpreterContext
): Promise<RunBlockResult> {
  const newEnvironment = enterBlock(block, context.environment, []);
  const newContext = {
    ...context,
    environment: newEnvironment,
  };
  return runStatements(block, newContext);
}

export function runFunctionBlock(
  block: readonly Statement[],
  context: InterpreterContext,
  functionParameters: readonly Value[]
): Promise<RunBlockResult> {
  const newEnvironment = enterBlock(
    block,
    context.environment,
    functionParameters
  );
  const newContext = {
    ...context,
    environment: newEnvironment,
  };
  return runStatements(block, newContext);
}

/**
 * Enter a block.
 * @returns a new environment
 */
function enterBlock(
  block: readonly Statement[],
  environment: Environment,
  functionParameters: readonly Value[]
): Environment {
  const newScope = createScope(functionParameters);
  const newEnvironment: Environment = {
    scopes: [...environment.scopes, newScope],
  };
  // hoist declarations
  for (const statement of block) {
    switch (statement.type) {
      case "SectionDeclaration": {
        const func = createFunctionValue(newEnvironment, statement.body);
        createBinding(newEnvironment, statement.title, func, statement.node);
        break;
      }
    }
  }
  return newEnvironment;
}

async function runStatements(
  statements: readonly Statement[],
  context: InterpreterContext
): Promise<RunBlockResult> {
  for (const statement of statements) {
    const res = await runStatement(statement, context);
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
