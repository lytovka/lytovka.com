export function replaceAt<T>(array: Array<T>, index: number, value: T) {
  const ret = array.slice(0);
  ret[index] = value;

  return ret;
}

export function splitIntoChunks<T>(
  data: Array<T>,
  capacity: number,
): Array<Array<T>> {
  const chunkCount = Math.ceil(data.length / capacity);
  console.log(data.length, capacity);
  const result = Array(chunkCount)
    .fill(null)
    .map(() => []);

  return data.reduce<Array<typeof data>>((res, item, index) => {
    const chunkIndex = Math.floor(index / capacity);
    res[chunkIndex].push(item);

    return res;
  }, result);
}
