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
