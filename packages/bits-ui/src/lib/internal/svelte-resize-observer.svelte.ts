import type { Getter } from "svelte-toolbelt";

export class SvelteResizeObserver {
	#node: Getter<HTMLElement | null>;
	#onResize: () => void;
	constructor(node: Getter<HTMLElement | null>, onResize: () => void) {
		this.#node = node;
		this.#onResize = onResize;
		this.handler = this.handler.bind(this);
		$effect(this.handler);
	}

	handler() {
		let rAF = 0;
		const _node = this.#node();
		if (!_node) return;
		const resizeObserver = new ResizeObserver(() => {
			cancelAnimationFrame(rAF);
			rAF = window.requestAnimationFrame(this.#onResize);
		});

		resizeObserver.observe(_node);
		return () => {
			window.cancelAnimationFrame(rAF);
			resizeObserver.unobserve(_node);
		};
	}
}
