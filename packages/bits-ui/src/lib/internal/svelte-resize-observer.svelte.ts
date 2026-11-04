import { getWindow, type Getter } from "svelte-toolbelt";

type ResizeCallback = () => void;

type ObserverPool = {
	observer: ResizeObserver;
	callbacksByNode: WeakMap<Element, Set<ResizeCallback>>;
	targetCount: number;
};

/**
 * One `ResizeObserver` per window, shared by every observed element in that window. Components
 * like `ScrollArea` create a handful of observers each, and multiple of them frequently watch the
 * same node, so allocating one observer per call site adds up quickly on pages with many
 * instances. Pools are per window so nodes rendered into another window (an iframe or a Document
 * Picture-in-Picture window) are observed by that window's `ResizeObserver`.
 */
const pools = new WeakMap<Window, ObserverPool>();

function getPool(targetWindow: Window & typeof globalThis): ObserverPool {
	let pool = pools.get(targetWindow);
	if (pool) return pool;
	const callbacksByNode = new WeakMap<Element, Set<ResizeCallback>>();
	const observer = new targetWindow.ResizeObserver((entries) => {
		for (const entry of entries) {
			const callbacks = callbacksByNode.get(entry.target);
			if (!callbacks) continue;
			// copy so a callback that unsubscribes doesn't mutate the set mid-iteration
			for (const callback of [...callbacks]) callback();
		}
	});
	pool = { observer, callbacksByNode, targetCount: 0 };
	pools.set(targetWindow, pool);
	return pool;
}

/**
 * Observes `node` for size changes, returning a function that stops observing.
 *
 * Like a dedicated `ResizeObserver`, the callback fires once shortly after subscribing.
 */
function observeResize(node: Element, callback: ResizeCallback): () => void {
	const targetWindow = getWindow(node);
	const pool = getPool(targetWindow);
	let callbacks = pool.callbacksByNode.get(node);

	if (callbacks === undefined) {
		callbacks = new Set();
		pool.callbacksByNode.set(node, callbacks);
		pool.targetCount++;
	} else {
		// `observe` only delivers its initial entry for newly observed targets, so re-observe
		// to get one for this subscriber. Calling back now would measure mid-render. Re-observing
		// notifies the node's existing subscribers too; they just re-measure an unchanged size.
		pool.observer.unobserve(node);
	}
	callbacks.add(callback);
	pool.observer.observe(node);

	return () => {
		const current = pool.callbacksByNode.get(node);
		if (!current) return;
		current.delete(callback);
		if (current.size) return;
		pool.callbacksByNode.delete(node);
		pool.observer.unobserve(node);
		if (--pool.targetCount > 0) return;
		pool.observer.disconnect();
		pools.delete(targetWindow);
	};
}

export class SvelteResizeObserver {
	#node: Getter<HTMLElement | null>;
	#onResize: () => void;
	#measure: (() => void) | undefined;
	/**
	 * `onResize` runs a frame after the report, so its state writes can't resize observed nodes
	 * mid-delivery. Layout reads belong in `measure`, which runs in the report while layout is
	 * clean; in the frame, the DOM may have changed again and reading forces a layout.
	 * `measure` runs inside the shared delivery loop, so it must not throw: a throw would stop
	 * delivery to every later subscriber in that window.
	 */
	constructor(node: Getter<HTMLElement | null>, onResize: () => void, measure?: () => void) {
		this.#node = node;
		this.#onResize = onResize;
		this.#measure = measure;
		this.handler = this.handler.bind(this);
		$effect(this.handler);
	}

	handler() {
		let rAF = 0;
		const _node = this.#node();
		if (!_node) return;
		const targetWindow = getWindow(_node);
		const unobserve = observeResize(_node, () => {
			this.#measure?.();
			targetWindow.cancelAnimationFrame(rAF);
			rAF = targetWindow.requestAnimationFrame(this.#onResize);
		});

		return () => {
			targetWindow.cancelAnimationFrame(rAF);
			unobserve();
		};
	}
}
