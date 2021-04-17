export async function asyncMap<T, U>(
  arr: readonly T[],
  mapper: (value: T) => Promise<U>
): Promise<U[]> {
  const result: U[] = [];
  for (const elm of arr) {
    result.push(await mapper(elm));
  }
  return result;
}
