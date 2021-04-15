import {
  Expression,
  outputExpression,
  textExpression,
} from "../ast/expression";
import { expectExpression } from "./expect";
import { skipTrivia } from "./skipTrivia";
import { isElement, isText } from "./util";

export function parseExpression(
  program: readonly Node[]
): [expression: Expression, next: Node[]] | undefined {
  const prog = skipTrivia(program);
  const firstChild = prog[0];
  if (!firstChild) {
    return undefined;
  }

  if (isElement(firstChild)) {
    switch (firstChild.tagName) {
      case "OUTPUT": {
        // OutputExpression
        const [exp, next] = expectExpression(
          Array.from(firstChild.childNodes),
          firstChild
        );
        return [outputExpression(firstChild, exp), next];
      }
    }
  } else if (isText(firstChild)) {
    // merge all texts
    let content = String(firstChild.nodeValue);
    let node = firstChild.nextSibling;
    let count = 1;
    while (node !== null && isText(node)) {
      content += node.nodeValue;
      node = node.nextSibling;
      count++;
    }
    return [textExpression(firstChild, content), prog.slice(count)];
  }

  return undefined;
}
