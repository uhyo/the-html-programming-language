import { SyntaxError } from "../errorObject";

export function throwUnexpectedNodeError(node: Node): never {
  throw new SyntaxError("Unexpected node", node);
}

export function throwExpectError(expectedThing: string, node: Node): never {
  throw new SyntaxError(`Expected ${expectedThing}.`, node);
}

export function throwExpectAttributeError(
  expectedAttribute: string,
  node: Node
): never {
  throw new SyntaxError(
    `Expected an attribute '${expectedAttribute}' to exist.`,
    node
  );
}
