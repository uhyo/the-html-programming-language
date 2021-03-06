import { InternalError } from "../../errorObject";
import {
  throwSlotNotFoundError,
  throwVariableNotFoundError,
} from "../runtimeError";
import { Value } from "../value";

export type Scope = {
  bindings: Map<string, Value>;
  functionParameters: readonly Value[];
};

export type Environment = {
  scopes: readonly Scope[];
};

export function createEnvironment(): Environment {
  return {
    scopes: [],
  };
}

export function createScope(functionParameters: readonly Value[]): Scope {
  return {
    bindings: new Map(),
    functionParameters,
  };
}

export function lookupBinding(
  environment: Environment,
  name: string
): Value | undefined {
  const { scopes } = environment;
  for (let i = scopes.length - 1; i >= 0; i--) {
    const res = scopes[i]?.bindings.get(name);
    if (res !== undefined) {
      return res;
    }
  }
  return undefined;
}

export function expectBinding(
  environment: Environment,
  name: string,
  node: Node
): Value {
  const res = lookupBinding(environment, name);
  if (res === undefined) {
    throwVariableNotFoundError(name, node);
  }
  return res;
}

/**
 * Create a binding on the innermost scope.
 */
export function createBinding(
  environment: Environment,
  name: string,
  value: Value,
  node: Node
): void {
  const scope = environment.scopes[environment.scopes.length - 1];
  if (!scope) {
    throw new InternalError("No scope", node);
  }
  scope.bindings.set(name, value);
}

/**
 * Update existing binding.
 */
export function updateBinding(
  environment: Environment,
  name: string,
  value: Value,
  node: Node
): void {
  const { scopes } = environment;
  for (let i = scopes.length - 1; i >= 0; i--) {
    const s = scopes[i];
    if (s?.bindings.has(name)) {
      s.bindings.set(name, value);
      return;
    }
  }
  throw new InternalError(`No binding of name '${name}'`, node);
}

export function lookupSlot(
  environment: Environment,
  name: string
): Value | undefined {
  const { scopes } = environment;
  const scope = scopes[scopes.length - 1];
  if (!scope) {
    return undefined;
  }
  const param = scope.functionParameters[Number(name)];
  return param;
}

export function expectSlot(
  environment: Environment,
  name: string,
  node: Node
): Value {
  const res = lookupSlot(environment, name);
  if (res === undefined) {
    throwSlotNotFoundError(name, node);
  }
  return res;
}
