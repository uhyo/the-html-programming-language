import { readdirSync, readFileSync } from "fs";
import path from "path";
import { createInterpreter } from "../../interpreter/index";
import { parseProgram } from "../../parser/index";

describe("program", () => {
  // test to run
  const caseFiles = readdirSync(path.join(__dirname, "cases"));

  for (const file of caseFiles) {
    const filePath = path.resolve(__dirname, "cases", file);
    if (!filePath.endsWith(".html")) {
      continue;
    }
    const testcaseName = path.basename(filePath);
    let content = readFileSync(filePath, "utf8").trim();
    // treat initial `//` lines as input
    let input = "";
    let match;
    while ((match = content.match(/^\/\/(.*)\n/))) {
      input += match[1] + "\n";
      content = content.slice(match[0].length);
    }

    it(testcaseName, async () => {
      document.body.innerHTML = content;
      const program = parseProgram(document.body);
      let output = "";
      const interpreter = createInterpreter({
        output: (text) => {
          output += text;
        },
      });
      await interpreter.run(program);
      expect(output).toMatchSnapshot();
    });
  }
});
