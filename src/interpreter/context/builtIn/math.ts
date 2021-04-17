import { MathBuiltInType } from "../../../ast/expression";
import {
  createNativeFunctionValue,
  NativeFunctionValue,
  Value,
} from "../../value";

function valueToNumber(value: Value): number {
  if (value === null) {
    return Number.NaN;
  }
  if (typeof value !== "object") {
    return Number(value);
  }
  switch (value.type) {
    case "function":
    case "native-function": {
      return Number.NaN;
    }
  }
}

export const mathBuiltIns: Record<MathBuiltInType, NativeFunctionValue> = {
  plus: createNativeFunctionValue((...args: readonly Value[]) => {
    let result = 0;
    for (const arg of args) {
      result += valueToNumber(arg);
    }
    return result;
  }),
  minus: createNativeFunctionValue((...args: readonly Value[]) => {
    if (args.length === 0) {
      return 0;
    }
    let result = valueToNumber(args[0]);
    for (const arg of args.slice(1)) {
      result -= valueToNumber(arg);
    }
    return result;
  }),
};
