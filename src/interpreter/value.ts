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

export type NativeFunctionValue = {
  type: "native-function";
  body: (...args: readonly Value[]) => Value | Promise<Value>;
};

export function createNativeFunctionValue(
  body: (...args: readonly Value[]) => Value | Promise<Value>
): NativeFunctionValue {
  return {
    type: "native-function",
    body,
  };
}

export type Value =
  | string
  | number
  | FunctionValue
  | NativeFunctionValue
  | null;

export function isFunctionValue(value: Value): value is FunctionValue {
  return (
    value !== null && typeof value === "object" && value.type === "function"
  );
}

export function isNativeFunctionValue(
  value: Value
): value is NativeFunctionValue {
  return (
    value !== null &&
    typeof value === "object" &&
    value.type === "native-function"
  );
}

export function valueToString(value: Value): string {
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
    case "native-function": {
      return "[Native Function]";
    }
  }
}
