/** Returns a factory producing a fresh deeply-reactive props object per run. */
export function props<T extends Record<string, unknown>>(init: T): () => T {
	return () => {
		const p = $state(structuredClone(init));
		return p;
	};
}
