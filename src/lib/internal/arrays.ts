// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function arraysAreEqual(arr1: any[], arr2: any[]): boolean {
	if (arr1.length !== arr2.length) {
		return false;
	}

	return arr1.every((value, index) => value === arr2[index]);
}
