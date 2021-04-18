import { RuntimeError } from "../errorObject";
import { Value, valueToString } from "./value";

export function throwVariableNotFoundError(name: string, node: Node): never {
  throw new RuntimeError(`Variable '${name}' not found`, node);
}

export function throwSlotNotFoundError(name: string, node: Node): never {
  throw new RuntimeError(`Slot '${name}' not found`, node);
}

export function throwTypeMismatchError(
  expectedType: string,
  value: Value,
  node: Node
): never {
  throw new RuntimeError(
    `Value '${valueToString(value)}' is not ${expectedType}`,
    node
  );
}

export function throwExpectedParameterNumberError(
  number: number,
  node: Node
): never {
  throw new RuntimeError(
    `Expected at least ${number} argument${number > 1 ? "s" : ""}.`,
    node
  );
}
