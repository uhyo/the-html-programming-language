export class SyntaxError extends Error {
  readonly node: Node;
  constructor(message: string, node: Node) {
    super(message);
    this.node = node;
  }
}

export class RuntimeError extends Error {
  readonly node: Node;
  constructor(message: string, node: Node) {
    super(message);
    this.node = node;
  }
}
