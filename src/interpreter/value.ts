import { Statement } from "../ast/statement";
import { Environment } from "./context/environment";

export type FunctionValue = {
  type: "function";
  environment: Environment;
  body: readonly Statement[];
};

export function createFunctionValue(
  environment: Environment,
  body: readonly Statement[]
): FunctionValue {
  return {
    type: "function",
    environment,
    body,
  };
}

export type Value = string | FunctionValue | null;

export function isFunctionValue(value: Value): value is FunctionValue {
  return (
    value !== null && typeof value === "object" && value.type === "function"
  );
}

export function valueToString(value: Value) {
  if (typeof value !== "object") {
    return String(value);
  }
  if (value === null) {
    return "null";
  }

  switch (value.type) {
    case "function": {
      return "[Function]";
    }
  }
}
