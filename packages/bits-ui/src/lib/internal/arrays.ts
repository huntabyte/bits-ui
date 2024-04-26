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
