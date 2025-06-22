/**
 * Checks if two arrays are equal by comparing their values.
 */
export function arraysAreEqual<T extends Array<unknown>>(arr1: T, arr2: T): boolean {
	if (arr1.length !== arr2.length) return false;

	return arr1.every((value, index) => isEqual(value, arr2[index]));
}

/**
 * A utility function that compares two values for equality.
 */
function isEqual(a: unknown, b: unknown): boolean {
	if (Number.isNaN(a as number) && Number.isNaN(b as number)) return true;

	if (Array.isArray(a) && Array.isArray(b)) return arraysAreEqual(a as unknown[], b as unknown[]);

	if (typeof a === "object" && typeof b === "object") return isDeepEqual(a, b);

	return Object.is(a, b);
}

/**
 * A utility function that compares two values for deep equality.
 */
function isDeepEqual(a: unknown, b: unknown): boolean {
	if (typeof a !== "object" || typeof b !== "object" || a === null || b === null) return false;

	const aKeys = Object.keys(a);
	const bKeys = Object.keys(b);

	if (aKeys.length !== bKeys.length) return false;

	for (const key of aKeys) {
		if (!bKeys.includes(key)) return false;
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
	if (size <= 0) return [];

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

/**
 * Returns the array element after the given index, or undefined for out-of-bounds or empty arrays.
 * @param array the array.
 * @param index the index of the current element.
 * @param loop loop to the beginning of the array if the next index is out of bounds?
 */
/**
 * Returns the array element after the given index, or undefined for out-of-bounds or empty arrays.
 * For single-element arrays, returns the element if the index is 0.
 * @param array the array.
 * @param index the index of the current element.
 * @param loop loop to the beginning of the array if the next index is out of bounds?
 */
export function next<T>(array: T[], index: number, loop = true): T | undefined {
	if (array.length === 0 || index < 0 || index >= array.length) return;
	if (array.length === 1 && index === 0) return array[0];
	if (index === array.length - 1) return loop ? array[0] : undefined;
	return array[index + 1];
}

/**
 * Returns the array element prior to the given index, or undefined for out-of-bounds or empty arrays.
 * For single-element arrays, returns the element if the index is 0.
 * @param array the array.
 * @param index the index of the current element.
 * @param loop loop to the end of the array if the previous index is out of bounds?
 */
export function prev<T>(array: T[], index: number, loop = true): T | undefined {
	if (array.length === 0 || index < 0 || index >= array.length) return;
	if (array.length === 1 && index === 0) return array[0];
	if (index === 0) return loop ? array[array.length - 1] : undefined;
	return array[index - 1];
}

/**
 * Returns the element some number after the given index. If the target index is out of bounds:
 *   - If looping is disabled, the first or last element will be returned.
 *   - If looping is enabled, it will wrap around the array.
 * Returns undefined for empty arrays or out-of-bounds initial indices.
 * @param array the array.
 * @param index the index of the current element.
 * @param increment the number of elements to move forward (can be negative).
 * @param loop loop around the array if the target index is out of bounds?
 */
export function forward<T>(
	array: T[],
	index: number,
	increment: number,
	loop = true
): T | undefined {
	if (array.length === 0 || index < 0 || index >= array.length) return;

	let targetIndex = index + increment;

	if (loop) {
		// Ensure positive modulus
		targetIndex = ((targetIndex % array.length) + array.length) % array.length;
	} else {
		// Clamp to array bounds when not looping
		targetIndex = Math.max(0, Math.min(targetIndex, array.length - 1));
	}

	return array[targetIndex];
}

/**
 * Returns the element some number before the given index. If the target index is out of bounds:
 *   - If looping is disabled, the first or last element will be returned.
 *   - If looping is enabled, it will wrap around the array.
 * Returns undefined for empty arrays or out-of-bounds initial indices.
 * @param array the array.
 * @param index the index of the current element.
 * @param decrement the number of elements to move backward (can be negative).
 * @param loop loop around the array if the target index is out of bounds?
 */
export function backward<T>(
	array: T[],
	index: number,
	decrement: number,
	loop = true
): T | undefined {
	if (array.length === 0 || index < 0 || index >= array.length) return;

	let targetIndex = index - decrement;

	if (loop) {
		// Ensure positive modulus
		targetIndex = ((targetIndex % array.length) + array.length) % array.length;
	} else {
		// Clamp to array bounds when not looping
		targetIndex = Math.max(0, Math.min(targetIndex, array.length - 1));
	}

	return array[targetIndex];
}

/**
 * Finds the next matching item from a list of values based on a search string.
 *
 * This function handles several special cases in typeahead behavior:
 *
 * 1. Space handling: When a search string ends with a space, it handles it specially:
 *    - If there's only one match for the text before the space, it ignores the space
 *    - If there are multiple matches and the current match already starts with the search prefix
 *      followed by a space, it keeps the current match (doesn't change selection on space)
 *    - Only after typing characters beyond the space will it move to a more specific match
 *
 * 2. Repeated character handling: If a search consists of repeated characters (e.g., "aaa"),
 *    it treats it as a single character for matching purposes
 *
 * 3. Cycling behavior: The function wraps around the values array starting from the current match
 *    to find the next appropriate match, creating a cycling selection behavior
 *
 * @param values - Array of string values to search through (e.g., the text content of menu items)
 * @param search - The current search string typed by the user
 * @param currentMatch - The currently selected/matched item, if any
 * @returns The next matching value that should be selected, or undefined if no match is found
 */
export function getNextMatch(values: string[], search: string, currentMatch?: string) {
	const lowerSearch = search.toLowerCase();

	if (lowerSearch.endsWith(" ")) {
		const searchWithoutSpace = lowerSearch.slice(0, -1);
		const matchesWithoutSpace = values.filter((value) =>
			value.toLowerCase().startsWith(searchWithoutSpace)
		);

		/**
		 * If there's only one match for the prefix without space, we don't
		 * watch to match with space.
		 */
		if (matchesWithoutSpace.length <= 1) {
			return getNextMatch(values, searchWithoutSpace, currentMatch);
		}

		const currentMatchLowercase = currentMatch?.toLowerCase();

		/**
		 * If the current match already starts with the search prefix and has a space afterward,
		 * and the user has only typed up to that space, keep the current match until they
		 * disambiguate.
		 */
		if (
			currentMatchLowercase &&
			currentMatchLowercase.startsWith(searchWithoutSpace) &&
			currentMatchLowercase.charAt(searchWithoutSpace.length) === " " &&
			search.trim() === searchWithoutSpace
		) {
			return currentMatch;
		}

		/**
		 * With multiple matches, find items that match the full search string with space
		 */
		const spacedMatches = values.filter((value) => value.toLowerCase().startsWith(lowerSearch));

		/**
		 * If we found matches with the space, use the first one that's not the current match
		 */
		if (spacedMatches.length > 0) {
			const currentMatchIndex = currentMatch ? values.indexOf(currentMatch) : -1;
			let wrappedMatches = wrapArray(spacedMatches, Math.max(currentMatchIndex, 0));

			// return the first match that is not the current one.
			const nextMatch = wrappedMatches.find((match) => match !== currentMatch);
			// fallback to current if no other is found.
			return nextMatch || currentMatch;
		}
	}

	const isRepeated = search.length > 1 && Array.from(search).every((char) => char === search[0]);
	const normalizedSearch = isRepeated ? search[0]! : search;
	const normalizedLowerSearch = normalizedSearch.toLowerCase();

	const currentMatchIndex = currentMatch ? values.indexOf(currentMatch) : -1;
	let wrappedValues = wrapArray(values, Math.max(currentMatchIndex, 0));
	const excludeCurrentMatch = normalizedSearch.length === 1;
	if (excludeCurrentMatch) wrappedValues = wrappedValues.filter((v) => v !== currentMatch);

	const nextMatch = wrappedValues.find((value) =>
		value?.toLowerCase().startsWith(normalizedLowerSearch)
	);

	return nextMatch !== currentMatch ? nextMatch : undefined;
}

/**
 * Wraps an array around itself at a given start index
 * Example: `wrapArray(['a', 'b', 'c', 'd'], 2) === ['c', 'd', 'a', 'b']`
 */
export function wrapArray<T>(array: T[], startIndex: number) {
	return array.map((_, index) => array[(startIndex + index) % array.length]) as T[];
}
