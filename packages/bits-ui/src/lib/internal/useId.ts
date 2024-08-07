class Counter {
	value = 0;

	constructor(initialValue: number = 0) {
		this.value = initialValue;
	}
}

const count = new Counter(0);

/**
 * Generates a unique ID based on a global counter.
 */
export function useId() {
	count.value++;
	return `bits-${count.value}`;
}
