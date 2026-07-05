/**
 * Shared in-page measurement helpers. All timings use performance.now() and
 * treat "visible" as: element present, non-zero rect, then two rAFs (the
 * second rAF callback runs right before the frame after the paint we care
 * about is committed).
 */

export interface Scenario {
	/** CDP CPU throttle rate applied while sampling (1 = none). */
	cpuThrottle: number;
	/** Number of samples the runner collects (after warmup). */
	samples: number;
	/** Warmup runs (not recorded). */
	warmup: number;
	/** Mount the scenario app. Resolves when ready to measure. */
	setup: (target: HTMLElement) => Promise<void> | void;
	/** Execute one sample, returns duration in ms. */
	run: () => Promise<number>;
}

export function nextPaint(): Promise<void> {
	return new Promise((resolve) => {
		requestAnimationFrame(() => {
			requestAnimationFrame(() => resolve());
		});
	});
}

export function raf(): Promise<void> {
	return new Promise((resolve) => requestAnimationFrame(() => resolve()));
}

/** rAF-polls until `fn` returns truthy. Throws after `timeout` ms. */
export function waitFor(fn: () => unknown, timeout = 10_000): Promise<void> {
	const start = performance.now();
	return new Promise((resolve, reject) => {
		function check() {
			if (fn()) return resolve();
			if (performance.now() - start > timeout) {
				return reject(new Error("waitFor timed out"));
			}
			requestAnimationFrame(check);
		}
		check();
	});
}

export function isVisible(selector: string): boolean {
	const el = document.querySelector(selector);
	if (!el) return false;
	const rect = el.getBoundingClientRect();
	return rect.height > 0 && rect.width > 0;
}

export function isGone(selector: string): boolean {
	return document.querySelector(selector) === null;
}

export function keydown(el: Element, key: string): void {
	el.dispatchEvent(
		new KeyboardEvent("keydown", { key, bubbles: true, cancelable: true })
	);
}

export function pointerMove(el: Element, opts: { x: number; y: number }): void {
	const init: PointerEventInit = {
		bubbles: true,
		cancelable: true,
		pointerType: "mouse",
		clientX: opts.x,
		clientY: opts.y,
	};
	el.dispatchEvent(new PointerEvent("pointerover", init));
	el.dispatchEvent(new PointerEvent("pointermove", init));
}

/** Force a synchronous style + layout flush. */
export function forceLayout(): number {
	return document.body.offsetHeight;
}

export function makeItems(n: number): { value: string; label: string }[] {
	return Array.from({ length: n }, (_, i) => ({
		value: `item-${i}`,
		label: `Item ${i}`,
	}));
}

/**
 * Measures one open/close cycle:
 * activate() -> content visible -> painted = recorded duration,
 * then closes via `close()` and waits for teardown (not recorded).
 */
export async function measureOpenCycle(opts: {
	activate: () => void;
	contentSelector: string;
	close: () => void;
}): Promise<number> {
	const t0 = performance.now();
	opts.activate();
	await waitFor(() => isVisible(opts.contentSelector));
	await nextPaint();
	const duration = performance.now() - t0;

	opts.close();
	await waitFor(() => isGone(opts.contentSelector));
	await nextPaint();
	return duration;
}

/**
 * Measures mount cost of a component: `iterations` mount/unmount cycles,
 * each forcing style+layout after mount. Returns average ms per mount.
 */
export async function measureMount(opts: {
	target: HTMLElement;
	iterations: number;
	mountOnce: (target: HTMLElement) => () => void;
}): Promise<number> {
	let total = 0;
	for (let i = 0; i < opts.iterations; i++) {
		const t0 = performance.now();
		const destroy = opts.mountOnce(opts.target);
		forceLayout();
		total += performance.now() - t0;
		destroy();
		await raf();
	}
	return total / opts.iterations;
}
