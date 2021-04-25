import { createInterpreter } from "./interpreter/index";
import { parseProgram } from "./parser/index";

if (document.readyState !== "loading") {
  runProgram(document.body);
} else {
  document.addEventListener("DOMContentLoaded", () => {
    runProgram(document.body);
  });
}

export async function runProgram(container: HTMLElement) {
  const programContainer = document.createElement("main");
  extract(container, programContainer);
  const program = parseProgram(programContainer);
  console.debug("parsed", program);

  const { outputContainer } = setupPage();

  const interpreter = createInterpreter({
    input: async () => undefined,
    output: (text) => {
      console.log(text);
      outputContainer.append(text);
    },
  });
  await interpreter.run(program);
}

function extract(fromContainer: HTMLElement, toContainer: HTMLElement) {
  const r = document.createRange();
  r.selectNodeContents(fromContainer);
  toContainer.appendChild(r.extractContents());
}

type SetupResult = {
  outputContainer: HTMLElement;
};
function setupPage(): SetupResult {
  const style = document.createElement("style");
  style.textContent = `
html, body, pre.output {
  height: 100%;
}
`;
  document.head.append(style);
  const pre = document.createElement("pre");
  pre.classList.add("output");
  document.body.appendChild(pre);
  return {
    outputContainer: pre,
  };
}
