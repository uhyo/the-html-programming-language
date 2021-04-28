import { Expression } from "../ast/expression";
import {
  definitionListStatement,
  expressionStatement,
  footerStatement,
  sectionDeclaration,
  Statement
} from "../ast/statement";
import { expectAttribute, expectExpression, expectNothing } from "./expect";
import { parseExpression } from "./parseExpression";
import { parseStatementList } from "./parseStatementList";
import { skipTrivia } from "./skipTrivia";
import { throwExpectError, throwUnexpectedNodeError } from "./SyntaxError";
import { isElement } from "./util";

export function parseStatement(
  program: readonly Node[]
): [statement: Statement, next: Node[]] | undefined {
  const prog = skipTrivia(program);
  const firstChild = prog[0];
  if (!firstChild) {
    return undefined;
  }

  if (!isElement(firstChild)) {
    throwUnexpectedNodeError(firstChild);
  }

  switch (firstChild.tagName) {
    case "P": {
      // Expression Statement
      const [exp, next] = expectExpression(
        Array.from(firstChild.childNodes),
        firstChild
      );
      expectNothing(next);
      return [expressionStatement(firstChild, exp), prog.slice(1)];
    }
    case "FOOTER": {
      // Footer Statement
      const [exp, next] = expectExpression(
        Array.from(firstChild.childNodes),
        firstChild
      );
      expectNothing(next);
      return [footerStatement(firstChild, exp), prog.slice(1)];
    }
    case "DL": {
      // DeclarationList Statement
      let nodes: readonly Node[] = skipTrivia(
        Array.from(firstChild.childNodes)
      );
      const definitions: {
        name: Expression;
        value: Expression;
      }[] = [];
      // parse dt-dd pairs
      while (nodes.length > 0) {
        const [dt, ...rest1] = nodes;
        if (dt === undefined || !isElement(dt) || dt.tagName !== "DT") {
          throwExpectError("a dt element", dt ?? firstChild);
        }
        const [dtExp, dtRest] =
          parseExpression(Array.from(dt.childNodes)) ||
          throwExpectError("an element", dt);
        expectNothing(dtRest);

        const [dd, ...rest2] = skipTrivia(rest1);
        if (dd === undefined || !isElement(dd) || dd.tagName !== "DD") {
          throwExpectError("a dd element", dd ?? firstChild);
        }
        const [ddExp, ddRest] =
          parseExpression(Array.from(dd.childNodes)) ||
          throwExpectError("an element", dd);
        expectNothing(ddRest);

        definitions.push({
          name: dtExp,
          value: ddExp,
        });
        nodes = skipTrivia(rest2);
      }
      return [definitionListStatement(firstChild, definitions), prog.slice(1)];
    }
    case "SECTION": {
      // Section Declaration
      const title = expectAttribute(firstChild, "title");
      const body = parseStatementList(Array.from(firstChild.childNodes));
      return [sectionDeclaration(firstChild, title, body), prog.slice(1)];
    }
  }

  return undefined;
}
