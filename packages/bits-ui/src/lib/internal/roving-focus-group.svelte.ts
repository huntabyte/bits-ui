import { type Box, type ReadableBox, box } from "svelte-toolbelt";
import { getElemDirection } from "./locale.js";
import { getDirectionalKeys } from "./get-directional-keys.js";
import { kbd } from "./kbd.js";
import type { Orientation } from "$lib/shared/index.js";
import { BROWSER } from "esm-env";

type RovingFocusGroupOptions = (
	| {
			/**
			 * The selector used to find the focusable candidates.
			 */
			candidateAttr: string;
			candidateSelector?: undefined;
	  }
	| {
			/**
			 * Custom candidate selector
			 */
			candidateSelector: string;
			candidateAttr?: undefined;
	  }
) & {
	/**
	 * The id of the root node
	 */
	rootNode: Box<HTMLElement | null>;

	/**
	 * Whether to loop through the candidates when reaching the end.
	 */
	loop: ReadableBox<boolean>;

	/**
	 * The orientation of the roving focus group. Used
	 * to determine how keyboard navigation should work.
	 */
	orientation: ReadableBox<Orientation>;

	/**
	 * A callback function called when a candidate is focused.
	 */
	onCandidateFocus?: (node: HTMLElement) => void;
};

export class RovingFocusGroup {
	readonly #opts: RovingFocusGroupOptions;
	readonly #currentTabStopId = box<string | null>(null);

	constructor(opts: RovingFocusGroupOptions) {
		this.#opts = opts;
	}

	getCandidateNodes() {
		if (!BROWSER || !this.#opts.rootNode.current) return [];

		if (this.#opts.candidateSelector) {
			const candidates = Array.from(
				this.#opts.rootNode.current.querySelectorAll<HTMLElement>(
					this.#opts.candidateSelector
				)
			);
			return candidates;
		} else if (this.#opts.candidateAttr) {
			const candidates = Array.from(
				this.#opts.rootNode.current.querySelectorAll<HTMLElement>(
					`[${this.#opts.candidateAttr}]:not([data-disabled])`
				)
			);
			return candidates;
		}

		return [];
	}

	focusFirstCandidate() {
		const items = this.getCandidateNodes();
		if (!items.length) return;
		items[0]?.focus();
	}

	handleKeydown(node: HTMLElement | null | undefined, e: KeyboardEvent, both: boolean = false) {
		const rootNode = this.#opts.rootNode.current;
		if (!rootNode || !node) return;

		const items = this.getCandidateNodes();
		if (!items.length) return;

		const currentIndex = items.indexOf(node);
		const dir = getElemDirection(rootNode);
		const { nextKey, prevKey } = getDirectionalKeys(dir, this.#opts.orientation.current);
		const loop = this.#opts.loop.current;

		const keyToIndex = {
			[nextKey]: currentIndex + 1,
			[prevKey]: currentIndex - 1,
			[kbd.HOME]: 0,
			[kbd.END]: items.length - 1,
		};

		if (both) {
			const altNextKey = nextKey === kbd.ARROW_DOWN ? kbd.ARROW_RIGHT : kbd.ARROW_DOWN;
			const altPrevKey = prevKey === kbd.ARROW_UP ? kbd.ARROW_LEFT : kbd.ARROW_UP;
			keyToIndex[altNextKey] = currentIndex + 1;
			keyToIndex[altPrevKey] = currentIndex - 1;
		}

		let itemIndex = keyToIndex[e.key];
		if (itemIndex === undefined) return;
		e.preventDefault();

		if (itemIndex < 0 && loop) {
			itemIndex = items.length - 1;
		} else if (itemIndex === items.length && loop) {
			itemIndex = 0;
		}

		const itemToFocus = items[itemIndex];
		if (!itemToFocus) return;
		itemToFocus.focus();
		this.#currentTabStopId.current = itemToFocus.id;
		this.#opts.onCandidateFocus?.(itemToFocus);
		return itemToFocus;
	}

	getTabIndex(node: HTMLElement | null | undefined) {
		const items = this.getCandidateNodes();
		const anyActive = this.#currentTabStopId.current !== null;

		if (node && !anyActive && items[0] === node) {
			this.#currentTabStopId.current = node.id;
			return 0;
		} else if (node?.id === this.#currentTabStopId.current) {
			return 0;
		}

		return -1;
	}

	setCurrentTabStopId(id: string) {
		this.#currentTabStopId.current = id;
	}
}
