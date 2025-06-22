import type { Getter, WritableBox } from "svelte-toolbelt";
import { getNextMatch } from "./arrays.js";
import { boxAutoReset } from "./box-auto-reset.svelte.js";

interface DataTypeaheadOpts {
	onMatch: (value: string) => void;
	getCurrentItem: () => string;
	candidateValues: Getter<string[]>;
	enabled: Getter<boolean>;
	getWindow: () => Window & typeof globalThis;
}

export class DataTypeahead {
	readonly #opts: DataTypeaheadOpts;
	readonly #candidateValues = $derived.by(() => this.#opts.candidateValues());

	#search: WritableBox<string>;

	constructor(opts: DataTypeaheadOpts) {
		this.#opts = opts;
		this.#search = boxAutoReset("", {
			afterMs: 1000,
			getWindow: this.#opts.getWindow,
		});

		this.handleTypeaheadSearch = this.handleTypeaheadSearch.bind(this);
		this.resetTypeahead = this.resetTypeahead.bind(this);
	}

	handleTypeaheadSearch(key: string) {
		if (!this.#opts.enabled() || !this.#candidateValues.length) return;

		this.#search.current = this.#search.current + key;
		const currentItem = this.#opts.getCurrentItem();
		const currentMatch = this.#candidateValues.find((item) => item === currentItem) ?? "";
		const values = this.#candidateValues.map((item) => item ?? "");
		const nextMatch = getNextMatch(values, this.#search.current, currentMatch);
		const newItem = this.#candidateValues.find((item) => item === nextMatch);
		if (newItem) {
			this.#opts.onMatch(newItem);
		}
		return newItem;
	}

	resetTypeahead() {
		this.#search.current = "";
	}
}
