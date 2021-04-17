import {
  expressionStatement,
  sectionDeclaration,
  Statement,
} from "../ast/statement";
import { expectAttribute, expectExpression, expectNothing } from "./expect";
import { parseStatementList } from "./parseStatementList";
import { skipTrivia } from "./skipTrivia";
import { throwUnexpectedNodeError } from "./syntaxError";
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
    case "SECTION": {
      // Section Declaration
      const title = expectAttribute(firstChild, "title");
      const body = parseStatementList(Array.from(firstChild.childNodes));
      return [sectionDeclaration(firstChild, title, body), prog.slice(1)];
    }
  }

  return undefined;
}
