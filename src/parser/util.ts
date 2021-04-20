export function isElement(node: Node): node is Element {
  return node.nodeType === Node.ELEMENT_NODE;
}

export function isText(node: Node): node is Text | CDATASection {
  return (
    node.nodeType === Node.TEXT_NODE ||
    node.nodeType === Node.CDATA_SECTION_NODE
  );
}

export function hasNElement<N extends number, T>(
  n: N,
  array: readonly T[]
): array is readonly T[] & AtLeast<N, T> {
  return array.length >= n;
}

type AtLeast<N extends number, T> = number extends N
  ? T[]
  : AtLeastRec<N, T, []>;
type AtLeastRec<
  N extends number,
  T,
  A extends readonly any[]
> = A["length"] extends N ? T[] : [T, ...AtLeastRec<N, T, [unknown, ...A]>];

export function hasElement<T>(array: readonly T[]): array is AtLeast<1, T> {
  return array.length > 0;
}
