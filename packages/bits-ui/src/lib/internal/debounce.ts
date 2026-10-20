// oxlint-disable-next-line no-explicit-any
export function debounce<T extends (...args: any[]) => any>(fn: T, wait = 500) {
	let timeout: NodeJS.Timeout | null = null;
	let pendingArgs: Parameters<T> | null = null;

	const debounced = (...args: Parameters<T>) => {
		debounced.destroy();
		pendingArgs = args;
		timeout = setTimeout(debounced.flush, wait);
	};

	/** Runs the pending call now, if there is one. */
	debounced.flush = () => {
		if (pendingArgs === null) return;
		const args = pendingArgs;
		debounced.destroy();
		fn(...args);
	};

	debounced.destroy = () => {
		if (timeout !== null) {
			clearTimeout(timeout);
			timeout = null;
		}
		pendingArgs = null;
	};

	return debounced;
}
