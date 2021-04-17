import { IO } from "../io";
import { Environment } from "./environment";

export type InterpreterContext = {
  io: IO;
  environment: Environment;
};
