import {
  abbrExpression,

  concatExpression,
  Expression,
  inputExpression,
  meterExpression,
  outputExpression, qExpression,





  RubyExpression,
  rubyExpression,
  slotExpression,
  spanExpression,
  textExpression,
  varExpression
} from "../ast/expression";
import { SyntaxError } from "../errorObject";
import { expectExpression, expectNothing } from "./expect";
import { parseExpressionList } from "./parseExpressionList";
import { parseMathExpression } from "./parseMathExpression";
import { skipTrivia } from "./skipTrivia";
import { throwExpectError, throwUnexpectedNodeError } from "./SyntaxError";
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
  let nodes: readonly Node[] = rest;
  // if there are more expressions, generate a ConcatExpression
  while (true) {
    const res = parseOneExpression(nodes);
    if (res === undefined) {
      break;
    }
    const [expression, rest] = res;
    seq.push(expression);
    nodes = rest;
  }
  const expr =
    seq.length === 1 ? expression1 : concatExpression(expression1.node, seq);

  nodes = skipTrivia(nodes);
  const nextNode = nodes[0];
  if (
    nextNode !== undefined &&
    isElement(nextNode) &&
    nextNode.tagName === "RUBY"
  ) {
    // postfix Ruby expression
    return [parseRubyContents(nextNode, expr), nodes.slice(1)];
  }
  return [expr, nodes as Node[]];
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
        return [outputExpression(firstChild, exp), prog.slice(1)];
      }
      case "ABBR": {
        // AbbrExpression
        const parameters = parseExpressionList(
          Array.from(firstChild.childNodes)
        );
        const title = firstChild.getAttribute("title");
        if (title === null) {
          // <abbr>...</abbr>: first expression in a is target of function call
          const [target, ...rest] = parameters;
          if (target === undefined) {
            throw new SyntaxError(
              "Expected at least one expressions as children",
              firstChild
            );
          }
          return [abbrExpression(firstChild, target, rest), prog.slice(1)];
        }
        // <a href="...">
        return [abbrExpression(firstChild, title, parameters), prog.slice(1)];
      }
      case "Q": {
        // QExpression
        const parameters = parseExpressionList(
          Array.from(firstChild.childNodes)
        );
        const cite = firstChild.getAttribute("cite");
        if (cite === null) {
          // <q>...</q>: first expression in a is target of function call
          const [target, ...rest] = parameters;
          if (target === undefined) {
            throw new SyntaxError(
              "Expected at least one expressions as children",
              firstChild
            );
          }
          return [qExpression(firstChild, target, rest), prog.slice(1)];
        }
        // <q cite="...">
        return [qExpression(firstChild, cite, parameters), prog.slice(1)];
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
      case "INPUT": {
        // InputExpression
        const type = firstChild.getAttribute("type");
        if (type !== null && type !== "text") {
          throwUnexpectedNodeError(firstChild);
        }
        const name = firstChild.getAttribute("name") ?? undefined;
        const pattern = firstChild.getAttribute("pattern") ?? undefined;
        return [inputExpression(firstChild, name, pattern), prog.slice(1)];
      }
      case "SPAN": {
        // SpanExpression
        const nodes = Array.from(firstChild.childNodes);
        const child = parseExpression(nodes);
        if (child === undefined) {
          expectNothing(nodes);
          // <span></span>
          return [
            spanExpression(firstChild, textExpression(firstChild, "")),
            prog.slice(1),
          ];
        }
        const [childExpr, rest] = child;
        expectNothing(rest);
        return [spanExpression(firstChild, childExpr), prog.slice(1)];
      }
      case "METER": {
        // MeterExpression
        const child = parseExpression(Array.from(firstChild.childNodes));
        if (child === undefined) {
          throwExpectError("some child", firstChild);
        }
        const [childExpr, rest] = child;
        expectNothing(rest);
        return [meterExpression(firstChild, childExpr), prog.slice(1)];
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

function parseRubyContents(
  container: Element,
  baseExpression: Expression
): RubyExpression {
  let nodes = skipTrivia(Array.from(container.childNodes));
  // expr-<rt> pairs
  const branches = [];
  while (nodes.length > 0) {
    const condRes = parseExpression(nodes);
    if (condRes !== undefined) {
      const [condition, nodes1] = condRes;
      const nodes2 = skipTrivia(nodes1);
      const nextNode = nodes2[0];
      if (
        nextNode === undefined ||
        !isElement(nextNode) ||
        nextNode.tagName !== "RT"
      ) {
        throwExpectError("an rt element", nextNode ?? container);
      }
      const [then, nodes3] = expectExpression(
        Array.from(nextNode.childNodes),
        nextNode
      );
      expectNothing(nodes3);
      branches.push({
        condition,
        then,
      });
      nodes = skipTrivia(nodes2.slice(1));
    } else {
      const nextNode = nodes[0];
      if (
        nextNode === undefined ||
        !isElement(nextNode) ||
        nextNode.tagName !== "RT"
      ) {
        throwExpectError(
          "an expression or an rt element",
          nextNode ?? container
        );
      }
      const [branch, nodes2] = expectExpression(
        Array.from(nextNode.childNodes),
        nextNode
      );
      expectNothing(nodes2);
      return rubyExpression(container, baseExpression, branches, branch);
    }
  }
  return rubyExpression(container, baseExpression, branches, undefined);
}
