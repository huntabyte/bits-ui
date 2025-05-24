import type { Box } from "svelte-toolbelt";

export class DOMContext {
	readonly element: Box<HTMLElement | null>;
	readonly root = $derived.by(() => {
		if (!this.element.current) return null;
		return this.element.current.getRootNode() as Document | ShadowRoot;
	});
	constructor(element: Box<HTMLElement | null>) {
		this.element = element;
	}

	querySelector = (selector: string) => {
		if (!this.root) return null;
		return this.root.querySelector(selector);
	};

	querySelectorAll = (selector: string) => {
		if (!this.root) return [] as unknown as NodeListOf<Element>;
		return this.root.querySelectorAll(selector);
	};

	getElementById = (id: string) => {
		if (!this.root) return null;
		return this.root.getElementById(id);
	};
}
