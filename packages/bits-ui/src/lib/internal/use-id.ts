globalThis.bitsIdCounter ??= { current: 0 };

/**
 * Generates a unique ID based on a global counter.
 *
 * @deprecated Use `$props.id()` from Svelte instead. Will be removed in v2.
 */
export function useId(prefix = "bits") {
	globalThis.bitsIdCounter.current++;
	return `${prefix}-${globalThis.bitsIdCounter.current}`;
}
