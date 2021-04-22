import { hasElement } from "../../parser/util";
import { IO } from "../io";

export type Input = {
  /**
   * Get input that matches given regexp.
   * undefined is returned if there is no more input that matches.
   * pattern is assumed to always match from the beginning of given string.
   */
  get(pattern: RegExp): Promise<RegExpMatchArray | undefined>;
};

export function createInput(io: IO): Input {
  let buffer = "";

  const get = async (pattern: RegExp) => {
    let match: readonly string[] | null = buffer.match(pattern);
    while (match === null || !hasElement(match)) {
      const readResult = await io.input();
      if (readResult === undefined) {
        // cannot read anymore
        return undefined;
      }
      buffer += readResult;
      match = buffer.match(pattern);
    }
    buffer = buffer.slice(match[0].length);
    return match;
  };
  return {
    get,
  };
}
