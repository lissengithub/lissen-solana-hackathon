export const removeDuplicates = <T extends string | number>(inputArray: Array<T>): Array<T> => Array.from(new Set(inputArray));
