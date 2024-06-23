export function arraysAreEqual<T extends Array<unknown>>(arr1: T, arr2: T): boolean {
	if (arr1.length !== arr2.length) {
		return false;
	}

	return arr1.every((value, index) => isEqual(value, arr2[index]));
}

function isEqual(a: unknown, b: unknown): boolean {
	if (Number.isNaN(a as number) && Number.isNaN(b as number)) {
		return true;
	}

	if (Array.isArray(a) && Array.isArray(b)) {
		return arraysAreEqual(a as unknown[], b as unknown[]);
	}

	if (typeof a === "object" && typeof b === "object") {
		return isDeepEqual(a, b);
	}

	return Object.is(a, b);
}

function isDeepEqual(a: unknown, b: unknown): boolean {
	if (typeof a !== "object" || typeof b !== "object" || a === null || b === null) {
		return false;
	}

	const aKeys = Object.keys(a);
	const bKeys = Object.keys(b);

	if (aKeys.length !== bKeys.length) {
		return false;
	}

	for (const key of aKeys) {
		if (!bKeys.includes(key)) {
			return false;
		}

		if (!isEqual((a as Record<string, unknown>)[key], (b as Record<string, unknown>)[key])) {
			return false;
		}
	}

	return true;
}

/**
 * Splits an array into chunks of a given size.
 * @param arr The array to split.
 * @param size The size of each chunk.
 * @returns An array of arrays, where each sub-array has `size` elements from the original array.
 * @example ```ts
 * const arr = [1, 2, 3, 4, 5, 6, 7, 8];
 * const chunks = chunk(arr, 3);
 * // chunks = [[1, 2, 3], [4, 5, 6], [7, 8]]
 * ```
 */
export function chunk<T>(arr: T[], size: number): T[][] {
	if (size <= 0) {
		return [];
	}

	const result = [];
	for (let i = 0; i < arr.length; i += size) {
		result.push(arr.slice(i, i + size));
	}
	return result;
}

/**
 * Checks if the given index is valid for the given array.
 *
 * @param index - The index to check
 * @param arr - The array to check
 */

export function isValidIndex(index: number, arr: unknown[]) {
	return index >= 0 && index < arr.length;
}
