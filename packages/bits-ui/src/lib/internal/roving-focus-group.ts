import { type Box, type ReadableBox, box } from "svelte-toolbelt";
import { getElemDirection } from "./locale.js";
import { getDirectionalKeys } from "./get-directional-keys.js";
import { kbd } from "./kbd.js";
import type { Orientation } from "$lib/shared/index.js";
import { BROWSER } from "esm-env";
import { isHTMLElement } from "./is.js";
import { findAdjacentElement, queryAll } from "./dom.js";

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
	 * The attribute that marks `rootNode`. When provided, candidates that belong to a
	 * nested `rootNode` of the same kind are excluded.
	 */
	rootAttr?: string;

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

	#getCandidateSelector() {
		if (this.#opts.candidateSelector) return this.#opts.candidateSelector;
		if (this.#opts.candidateAttr) return `[${this.#opts.candidateAttr}]:not([data-disabled])`;
		return null;
	}

	getCandidateNodes() {
		const rootNode = this.#opts.rootNode.current;
		if (!BROWSER || !rootNode) return [];
		const selector = this.#getCandidateSelector();
		if (!selector) return [];
		return this.#ownCandidates(rootNode, queryAll(rootNode, selector));
	}

	/**
	 * Excludes candidates whose closest `[rootAttr]` ancestor is a nested root
	 * rather than `rootNode` itself.
	 */
	#ownCandidates(rootNode: HTMLElement, candidates: HTMLElement[]) {
		const rootAttr = this.#opts.rootAttr;
		if (!rootAttr) return candidates;
		const rootSelector = `[${rootAttr}]`;
		// without a nested root every candidate is our own; skip the per-node `closest`
		if (rootNode.matches(rootSelector) && !rootNode.querySelector(rootSelector)) {
			return candidates;
		}
		return candidates.filter((node) => node.closest(rootSelector) === rootNode);
	}

	focusFirstCandidate() {
		const items = this.getCandidateNodes();
		if (!items.length) return;
		items[0]?.focus();
	}

	/**
	 * The own candidate after (`1`) or before (`-1`) `node`, wrapping when `loop`, found by
	 * walking the DOM from `node` rather than collecting every candidate. `null` when `node`
	 * isn't an own candidate.
	 */
	#adjacentCandidate(rootNode: HTMLElement, node: HTMLElement, step: 1 | -1, loop: boolean) {
		if (node === rootNode || !rootNode.contains(node)) return null;
		const selector = this.#getCandidateSelector();
		if (!selector) return null;
		const rootAttr = this.#opts.rootAttr;
		const rootSelector = rootAttr ? `[${rootAttr}]` : null;
		// same shortcut as `#ownCandidates`
		const checkOwner =
			rootSelector !== null &&
			!(rootNode.matches(rootSelector) && !rootNode.querySelector(rootSelector));
		const isOwn = (el: Element) =>
			el.matches(selector) && (!checkOwner || el.closest(rootSelector!) === rootNode);
		if (!isOwn(node)) return null;

		const adjacent = findAdjacentElement(rootNode, node, step, isOwn);
		if (adjacent) return adjacent;
		if (!loop) return undefined;
		if (step === -1) return this.getCandidateNodes().at(-1);
		return findAdjacentElement(rootNode, rootNode, 1, isOwn) ?? undefined;
	}

	handleKeydown(node: HTMLElement | null | undefined, e: KeyboardEvent, both: boolean = false) {
		const rootNode = this.#opts.rootNode.current;
		if (!rootNode || !node) return;

		const dir = getElemDirection(rootNode);
		const { nextKey, prevKey } = getDirectionalKeys(dir, this.#opts.orientation.current);
		const loop = this.#opts.loop.current;

		// none of these keys can coincide, so the order of the checks doesn't matter
		let step: 1 | -1 | 0 = 0;
		if (e.key === nextKey) step = 1;
		else if (e.key === prevKey) step = -1;
		else if (both) {
			if (e.key === (nextKey === kbd.ARROW_DOWN ? kbd.ARROW_RIGHT : kbd.ARROW_DOWN)) step = 1;
			else if (e.key === (prevKey === kbd.ARROW_UP ? kbd.ARROW_LEFT : kbd.ARROW_UP)) step = -1;
		}
		// any other key is ignored, so don't collect the candidates for it (e.g. typeahead)
		if (!step && e.key !== kbd.HOME && e.key !== kbd.END) return;
		// moving to a neighbour of a candidate doesn't need the full candidate list
		const adjacent = step ? this.#adjacentCandidate(rootNode, node, step, loop) : null;
		if (adjacent !== null) {
			e.preventDefault();
			return adjacent ? this.#focusCandidate(adjacent) : undefined;
		}

		const items = this.getCandidateNodes();
		if (!items.length) return;

		const currentIndex = items.indexOf(node);

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
		return this.#focusCandidate(itemToFocus);
	}

	#focusCandidate(itemToFocus: HTMLElement) {
		itemToFocus.focus();
		this.#currentTabStopId.current = itemToFocus.id;
		this.#opts.onCandidateFocus?.(itemToFocus);
		return itemToFocus;
	}

	getTabIndex(node: HTMLElement | null | undefined) {
		// read unconditionally: callers rely on it as a reactive dependency
		const rootNode = this.#opts.rootNode.current;
		const anyActive = this.#currentTabStopId.current !== null;

		// the candidate scan only matters while no tab stop is set, and per item it's O(n²)
		if (rootNode && node && !anyActive && this.getCandidateNodes()[0] === node) {
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

	focusCurrentTabStop() {
		const currentTabStopId = this.#currentTabStopId.current;
		if (!currentTabStopId) return;
		const currentTabStop = this.#opts.rootNode.current?.querySelector(`#${currentTabStopId}`);
		if (!currentTabStop || !isHTMLElement(currentTabStop)) return;
		currentTabStop.focus();
	}
}
