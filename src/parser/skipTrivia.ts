export function skipTrivia(nodes: readonly Node[]): readonly Node[] {
  for (const [index, node] of nodes.entries()) {
    switch (node.nodeType) {
      case Node.COMMENT_NODE:
      case Node.PROCESSING_INSTRUCTION_NODE:
      case Node.DOCUMENT_TYPE_NODE:
        // ignore
        continue;
      case Node.TEXT_NODE:
        // ignore if it only contains spaces
        if (!node.nodeValue || /^\s*$/.test(node.nodeValue)) {
          continue;
        }
      default:
        // other nodes are not trivia
        return index === 0 ? nodes : nodes.slice(index);
    }
  }
  return [];
}
