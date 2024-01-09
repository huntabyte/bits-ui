export function arraysAreEqual<T extends Array<unknown>>(arr1: T, arr2: T): boolean {
	if (arr1.length !== arr2.length) {
		return false;
	}

	return arr1.every((value, index) => value === arr2[index]);
}
