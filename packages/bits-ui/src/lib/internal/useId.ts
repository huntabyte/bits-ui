class Counter {
	value = 0;

	constructor(initialValue: number = 0) {
		this.value = initialValue;
	}
}

const count = new Counter(0);

/**
 * Generates a unique ID based on a global counter.
 *
 * @param deterministicId - An optional, typically user defined string to use as the id.
 */
export function useId(deterministicId?: string) {
	if (!deterministicId) {
		count.value++;
	}
	return deterministicId || `bits-${count.value}`;
}
