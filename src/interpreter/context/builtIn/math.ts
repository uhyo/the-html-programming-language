import { MathBuiltInType } from "../../../ast/expression";
import { hasElement, hasNElement } from "../../../parser/util";
import { throwExpectedParameterNumberError } from "../../runtimeError";
import {
  createNativeFunctionValue,
  NativeFunctionValue,
  Value,
  valueEquality,
  valueToBoolean
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
  plus: createNativeFunctionValue((args: readonly Value[]) => {
    let result = 0;
    for (const arg of args) {
      result += valueToNumber(arg);
    }
    return result;
  }),
  minus: createNativeFunctionValue((args: readonly Value[]) => {
    if (!hasElement(args)) {
      return 0;
    }
    let result = valueToNumber(args[0]);
    for (const arg of args.slice(1)) {
      result -= valueToNumber(arg);
    }
    return result;
  }),
  times: createNativeFunctionValue((args: readonly Value[]) => {
    let result = 1;
    for (const arg of args) {
      result *= valueToNumber(arg);
    }
    return result;
  }),
  divide: createNativeFunctionValue((args: readonly Value[]) => {
    if (!hasElement(args)) {
      return 1;
    }
    let result = valueToNumber(args[0]);
    for (const arg of args.slice(1)) {
      result /= valueToNumber(arg);
    }
    return result;
  }),
  power: createNativeFunctionValue((args: readonly Value[]) => {
    if (!hasElement(args)) {
      return 1;
    }
    let result = valueToNumber(args[0]);
    for (const arg of args.slice(1)) {
      result **= valueToNumber(arg);
    }
    return result;
  }),
  rem: createNativeFunctionValue((args, node) => {
    if (!hasNElement(2, args)) {
      throwExpectedParameterNumberError(2, node);
    }
    return valueToNumber(args[0]) % valueToNumber(args[1]);
  }),
  gcd: createNativeFunctionValue((args) => {
    if (!hasElement(args)) {
      return 1;
    }

    let result = valueToNumber(args[0]);
    for (const arg of args.slice(1)) {
      result = gcd2(result, valueToNumber(arg));
    }
    return result;

    function gcd2(a: number, b: number): number {
      if (a < b) {
        [a, b] = [b, a];
      }
      while (b !== 0) {
        [a, b] = [b, a % b];
      }
      return a;
    }
  }),
  min: createNativeFunctionValue((args) => {
    return Math.min(...args.map(valueToNumber));
  }),
  max: createNativeFunctionValue((args) => {
    return Math.max(...args.map(valueToNumber));
  }),
  eq: createNativeFunctionValue((args, node) => {
    if (!hasNElement(2, args)) {
      throwExpectedParameterNumberError(2, node);
    }
    return +valueEquality(args[0], args[1]);
  }),
  neq: createNativeFunctionValue((args, node) => {
    if (!hasNElement(2, args)) {
      throwExpectedParameterNumberError(2, node);
    }
    return +!valueEquality(args[0], args[1]);
  }),
  lt: createNativeFunctionValue((args, node) => {
    if (!hasElement(args)) {
      throwExpectedParameterNumberError(1, node);
    }
    const [first, ...rest] = args;
    let cur = valueToNumber(first);
    for (const v of rest) {
      const vn = valueToNumber(v);
      if (!(cur < vn)) {
        return 0;
      }
      cur = vn;
    }
    return 1;
  }),
  gt: createNativeFunctionValue((args, node) => {
    if (!hasElement(args)) {
      throwExpectedParameterNumberError(1, node);
    }
    const [first, ...rest] = args;
    let cur = valueToNumber(first);
    for (const v of rest) {
      const vn = valueToNumber(v);
      if (!(cur > vn)) {
        return 0;
      }
      cur = vn;
    }
    return 1;
  }),
  leq: createNativeFunctionValue((args, node) => {
    if (!hasElement(args)) {
      throwExpectedParameterNumberError(1, node);
    }
    const [first, ...rest] = args;
    let cur = valueToNumber(first);
    for (const v of rest) {
      const vn = valueToNumber(v);
      if (!(cur <= vn)) {
        return 0;
      }
      cur = vn;
    }
    return 1;
  }),
  geq: createNativeFunctionValue((args, node) => {
    if (!hasElement(args)) {
      throwExpectedParameterNumberError(1, node);
    }
    const [first, ...rest] = args;
    let cur = valueToNumber(first);
    for (const v of rest) {
      const vn = valueToNumber(v);
      if (!(cur >= vn)) {
        return 0;
      }
      cur = vn;
    }
    return 1;
  }),
  and: createNativeFunctionValue((args) => {
    return +args.reduce((acc, v) => {
      return acc && valueToBoolean(v);
    }, true);
  }),
  or: createNativeFunctionValue((args) => {
    return +args.reduce((acc, v) => {
      return acc || valueToBoolean(v);
    }, false);
  }),
  xor: createNativeFunctionValue((args) => {
    return +args.reduce((acc, v) => {
      return acc ? !valueToBoolean(v) : valueToBoolean(v);
    }, false);
  }),
  implies: createNativeFunctionValue((args, node) => {
    if (!hasElement(args)) {
      throwExpectedParameterNumberError(1, node);
    }
    return +args.map(valueToBoolean).reduceRight((acc, v) => {
      return !v || acc;
    });
  }),
};
