import {
  anchorExpression,
  concatExpression,
  Expression,
  outputExpression,
  slotExpression,
  textExpression,
  varExpression,
} from "../ast/expression";
import { SyntaxError } from "../errorObject";
import { expectExpression, expectNothing } from "./expect";
import { parseExpressionList } from "./parseExpressionList";
import { parseMathExpression } from "./parseMathExpression";
import { skipTrivia } from "./skipTrivia";
import { isElement, isText } from "./util";

export function parseExpression(
  program: readonly Node[]
): [expression: Expression, next: Node[]] | undefined {
  const res1 = parseOneExpression(program);
  if (res1 === undefined) {
    return undefined;
  }
  const [expression1, rest] = res1;
  const seq: Expression[] = [expression1];
  let nodes: Node[] = rest;
  // if there is more expressions, generate a ConcatExpression
  while (true) {
    const res = parseOneExpression(nodes);
    if (res === undefined) {
      break;
    }
    const [expression, rest] = res;
    seq.push(expression);
    nodes = rest;
  }
  if (seq.length === 1) {
    return [expression1, rest];
  }
  return [concatExpression(expression1.node, seq), nodes];
}

function parseOneExpression(
  program: readonly Node[]
): [expression: Expression, next: Node[]] | undefined {
  const prog = skipTrivia(program);
  const firstChild = prog[0];
  if (!firstChild) {
    return undefined;
  }

  if (isElement(firstChild)) {
    switch (firstChild.tagName) {
      case "WBR": {
        // Wbr is treated as a "\n" text
        return [textExpression(firstChild, "\n"), prog.slice(1)];
      }
      case "OUTPUT": {
        // OutputExpression
        const [exp, next] = expectExpression(
          Array.from(firstChild.childNodes),
          firstChild
        );
        return [outputExpression(firstChild, exp), next];
      }
      case "A": {
        // AnchorExpression
        const parameters = parseExpressionList(
          Array.from(firstChild.childNodes)
        );
        const href = firstChild.getAttribute("href");
        if (href === null) {
          // <a>...</a>: first expression in a is target of function call
          const [target, ...rest] = parameters;
          if (target === undefined) {
            throw new SyntaxError(
              "Expected at least one expressions as children",
              firstChild
            );
          }
          return [anchorExpression(firstChild, target, rest), prog.slice(1)];
        }
        // <a href="...">
        return [anchorExpression(firstChild, href, parameters), prog.slice(1)];
      }
      case "SLOT": {
        // SlotExpression
        const name = firstChild.getAttribute("name") ?? "0";
        return [slotExpression(firstChild, name), prog.slice(1)];
      }
      case "VAR": {
        // VarExpression
        const [nameExp, next] = expectExpression(
          Array.from(firstChild.childNodes),
          firstChild
        );
        expectNothing(next);

        return [varExpression(firstChild, nameExp), prog.slice(1)];
      }
      case "math": {
        // MathBuiltInExpression
        return [parseMathExpression(firstChild), prog.slice(1)];
      }
    }
  } else if (isText(firstChild)) {
    return [
      textExpression(firstChild, firstChild.nodeValue || ""),
      prog.slice(1),
    ];
  }

  return undefined;
}
