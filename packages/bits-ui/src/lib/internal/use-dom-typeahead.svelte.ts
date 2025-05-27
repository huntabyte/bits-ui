import { getNextMatch } from "./arrays.js";
import { boxAutoReset } from "./box-auto-reset.svelte.js";

export type DOMTypeahead = ReturnType<typeof useDOMTypeahead>;

type UseDOMTypeaheadOpts = {
	onMatch?: (item: HTMLElement) => void;
	getCurrentItem?: () => HTMLElement | null;
	getActiveElement: () => HTMLElement | null;
	getWindow: () => Window & typeof globalThis;
};

export function useDOMTypeahead(opts: UseDOMTypeaheadOpts) {
	// Reset `search` 1 second after it was last updated
	const search = boxAutoReset("", {
		afterMs: 1000,
		getWindow: opts.getWindow,
	});

	const onMatch = opts?.onMatch ?? ((node) => node.focus());
	const getCurrentItem = opts?.getCurrentItem ?? (() => opts?.getActiveElement());

	function handleTypeaheadSearch(key: string, candidates: HTMLElement[]) {
		if (!candidates.length) return;

		search.current = search.current + key;
		const currentItem = getCurrentItem();

		const currentMatch =
			candidates.find((item) => item === currentItem)?.textContent?.trim() ?? "";

		const values = candidates.map((item) => item.textContent?.trim() ?? "");
		const nextMatch = getNextMatch(values, search.current, currentMatch);
		const newItem = candidates.find((item) => item.textContent?.trim() === nextMatch);
		if (newItem) onMatch(newItem);
		return newItem;
	}

	function resetTypeahead() {
		search.current = "";
	}

	return {
		search,
		handleTypeaheadSearch,
		resetTypeahead,
	};
}
