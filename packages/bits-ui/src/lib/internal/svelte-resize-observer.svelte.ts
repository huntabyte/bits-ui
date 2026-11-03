import type { Getter } from "svelte-toolbelt";

type ResizeCallback = () => void;

/**
 * A single `ResizeObserver` shared by every observed element in the app. Components like
 * `ScrollArea` create a handful of observers each, and multiple of them frequently watch the
 * same node, so allocating one observer per call site adds up quickly on pages with many
 * instances.
 */
let sharedObserver: ResizeObserver | null = null;
const observedNodes = new WeakMap<Element, Set<ResizeCallback>>();

function getSharedObserver(): ResizeObserver {
	sharedObserver ??= new ResizeObserver((entries) => {
		for (const entry of entries) {
			const callbacks = observedNodes.get(entry.target);
			if (!callbacks) continue;
			// copy so a callback that unsubscribes doesn't mutate the set mid-iteration
			for (const callback of [...callbacks]) callback();
		}
	});
	return sharedObserver;
}

/**
 * Observes `node` for size changes, returning a function that stops observing.
 *
 * Like a dedicated `ResizeObserver`, the callback fires once shortly after subscribing.
 */
function observeResize(node: Element, callback: ResizeCallback): () => void {
	let callbacks = observedNodes.get(node);

	if (callbacks === undefined) {
		callbacks = new Set();
		observedNodes.set(node, callbacks);
		callbacks.add(callback);
		getSharedObserver().observe(node);
	} else {
		callbacks.add(callback);
		// `observe` only delivers its initial entry for newly observed targets, so a second
		// subscriber to an already-observed node has to be kicked off manually.
		callback();
	}

	return () => {
		const current = observedNodes.get(node);
		if (!current) return;
		current.delete(callback);
		if (current.size) return;
		observedNodes.delete(node);
		sharedObserver?.unobserve(node);
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
		const unobserve = observeResize(_node, () => {
			this.#measure?.();
			cancelAnimationFrame(rAF);
			rAF = window.requestAnimationFrame(this.#onResize);
		});

		return () => {
			window.cancelAnimationFrame(rAF);
			unobserve();
		};
	}
}
