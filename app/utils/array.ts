export function replaceAt<T>(array: Array<T>, index: number, value: T) {
  const ret = array.slice(0);
  ret[index] = value;

  return ret;
}
