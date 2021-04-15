import { expressionStatement, Statement } from "../ast/statement";
import { throwUnexpectedNodeError } from "./error";
import { expectExpression, expectNothing } from "./expect";
import { skipTrivia } from "./skipTrivia";
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
      return [expressionStatement(exp), prog.slice(1)];
    }
  }

  return undefined;
}
