import { runProgram } from "./run";

if (document.readyState !== "loading") {
  runProgram(document.body);
} else {
  document.addEventListener("DOMContentLoaded", () => {
    runProgram(document.body);
  });
}
