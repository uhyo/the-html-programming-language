import { IO } from "../io";
import { Environment } from "./environment";
import { Input } from "./input";

export type InterpreterContext = {
  io: IO;
  input: Input;
  environment: Environment;
};
