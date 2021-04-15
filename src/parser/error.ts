import { SyntaxError } from "./SyntaxError";

export function throwUnexpectedNodeError(node: Node): never {
  throw new SyntaxError("Unexpected node", node);
}

export function throwExpectError(expectedThing: string, node: Node): never {
  throw new SyntaxError(`Expected ${expectedThing}.`, node);
}
