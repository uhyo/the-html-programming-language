import { throwVariableNotFoundError } from "../runtimeError";
import { Value } from "../value";

export type Scope = {
  bindings: Map<string, Value>;
};

export type Environment = {
  scopes: readonly Scope[];
};

export function createEnvironment(): Environment {
  return {
    scopes: [],
  };
}

export function createScope(): Scope {
  return {
    bindings: new Map(),
  };
}

export function lookupBinding(
  environment: Environment,
  name: string
): Value | undefined {
  const { scopes } = environment;
  for (let i = scopes.length - 1; i >= 0; i--) {
    const res = scopes[i].bindings.get(name);
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
