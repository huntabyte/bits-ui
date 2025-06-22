import type { WritableBox } from "svelte-toolbelt";
import { getNextMatch } from "./arrays.js";
import { boxAutoReset } from "./box-auto-reset.svelte.js";

type DOMTypeaheadOptions = {
	onMatch?: (item: HTMLElement) => void;
	getCurrentItem?: () => HTMLElement | null;
	getActiveElement: () => HTMLElement | null;
	getWindow: () => Window & typeof globalThis;
};

export class DOMTypeahead {
	readonly #opts: DOMTypeaheadOptions;
	readonly #search: WritableBox<string>;
	#onMatch: (item: HTMLElement) => void = $derived.by(() => {
		if (this.#opts.onMatch) return this.#opts.onMatch;
		return (node) => node.focus();
	});
	#getCurrentItem: () => HTMLElement | null = $derived.by(() => {
		if (this.#opts.getCurrentItem) return this.#opts.getCurrentItem;
		return this.#opts.getActiveElement;
	});

	constructor(opts: DOMTypeaheadOptions) {
		this.#opts = opts;
		this.#search = boxAutoReset("", {
			afterMs: 1000,
			getWindow: opts.getWindow,
		});

		this.handleTypeaheadSearch = this.handleTypeaheadSearch.bind(this);
		this.resetTypeahead = this.resetTypeahead.bind(this);
	}

	handleTypeaheadSearch(key: string, candidates: HTMLElement[]) {
		if (!candidates.length) return;

		this.#search.current = this.#search.current + key;
		const currentItem = this.#getCurrentItem();

		const currentMatch =
			candidates.find((item) => item === currentItem)?.textContent?.trim() ?? "";

		const values = candidates.map((item) => item.textContent?.trim() ?? "");
		const nextMatch = getNextMatch(values, this.#search.current, currentMatch);
		const newItem = candidates.find((item) => item.textContent?.trim() === nextMatch);
		if (newItem) this.#onMatch(newItem);
		return newItem;
	}

	resetTypeahead() {
		this.#search.current = "";
	}

	get search() {
		return this.#search.current;
	}
}
