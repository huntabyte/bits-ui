import { type ReadableBox, type WritableBox, box } from "svelte-toolbelt";
import { getElemDirection } from "./locale.js";
import { getDirectionalKeys } from "./get-directional-keys.js";
import { kbd } from "./kbd.js";
import { isBrowser } from "./is.js";
import type { Orientation } from "$lib/shared/index.js";

type UseRovingFocusProps = {
	/**
	 * The selector used to find the focusable candidates.
	 */
	candidateAttr: string;

	/**
	 * Custom candidate selector
	 */
	candidateSelector?: string;

	/**
	 * The id of the root node
	 */
	rootNodeId: ReadableBox<string>;

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

export type UseRovingFocusReturn = ReturnType<typeof useRovingFocus>;

export function useRovingFocus(props: UseRovingFocusProps) {
	const currentTabStopId = box<string | null>(null);

	function getCandidateNodes() {
		if (!isBrowser) return [];
		const node = document.getElementById(props.rootNodeId.current);
		if (!node) return [];

		if (props.candidateSelector) {
			const candidates = Array.from(
				node.querySelectorAll<HTMLElement>(props.candidateSelector)
			);
			return candidates;
		} else {
			const candidates = Array.from(
				node.querySelectorAll<HTMLElement>(`[${props.candidateAttr}]:not([data-disabled])`)
			);
			return candidates;
		}
	}

	function focusFirstCandidate() {
		const items = getCandidateNodes();
		if (!items.length) return;
		items[0]?.focus();
	}

	function handleKeydown(
		node: HTMLElement | null | undefined,
		e: KeyboardEvent,
		both: boolean = false
	) {
		const rootNode = document.getElementById(props.rootNodeId.current);
		if (!rootNode || !node) return;

		const items = getCandidateNodes();
		if (!items.length) return;

		const currentIndex = items.indexOf(node);
		const dir = getElemDirection(rootNode);
		const { nextKey, prevKey } = getDirectionalKeys(dir, props.orientation.current);
		const loop = props.loop.current;

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
		currentTabStopId.current = itemToFocus.id;
		props.onCandidateFocus?.(itemToFocus);
		return itemToFocus;
	}

	function getTabIndex(node: HTMLElement | null | undefined) {
		const items = getCandidateNodes();
		const anyActive = currentTabStopId.current !== null;

		if (node && !anyActive && items[0] === node) {
			currentTabStopId.current = node.id;
			return 0;
		} else if (node?.id === currentTabStopId.current) {
			return 0;
		}

		return -1;
	}

	return {
		setCurrentTabStopId(id: string) {
			currentTabStopId.current = id;
		},
		getTabIndex,
		handleKeydown,
		focusFirstCandidate,
		currentTabStopId,
	};
}

type RovingFocusGroupOptions = {
	/**
	 * Custom candidate selector
	 */
	candidateSelector: string;

	/**
	 * The id of the root node
	 */
	rootNodeId: ReadableBox<string>;

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

	/**
	 * The current tab stop id.
	 */
	currentTabStopId?: WritableBox<string | null>;
};

export class RovingFocusGroup {
	currentTabStopId = box<string | null>(null);
	#recomputeDep = $state(false);

	constructor(readonly opts: RovingFocusGroupOptions) {
		this.currentTabStopId = opts.currentTabStopId
			? opts.currentTabStopId
			: box<string | null>(null);
	}

	#anyActive = $derived.by(() => {
		this.#recomputeDep;
		if (!this.currentTabStopId.current) return false;
		if (!isBrowser) return false;
		return Boolean(document.getElementById(this.currentTabStopId.current));
	});

	#handleFocus = (node: HTMLElement) => {
		if (!node) return;
		this.currentTabStopId.current = node.id;
		node?.focus();
		this.opts.onCandidateFocus?.(node);
	};

	#getCandidateNodes = () => {
		if (!isBrowser) return [];
		const node = document.getElementById(this.opts.rootNodeId.current);
		if (!node) return [];
		return Array.from(node.querySelectorAll<HTMLElement>(this.opts.candidateSelector));
	};

	navigateBackward = (node: HTMLElement | null | undefined, fallback?: HTMLElement | null) => {
		const rootNode = document.getElementById(this.opts.rootNodeId.current);
		if (!rootNode || !node) return;
		const items = this.#getCandidateNodes();
		if (!items.length) return;
		const currentIndex = items.indexOf(node);
		const prevIndex = currentIndex - 1;
		const prevItem = items[prevIndex];
		if (!prevItem) {
			if (fallback) {
				fallback?.focus();
			}
			return;
		}
		this.#handleFocus(prevItem);
	};

	handleKeydown = ({
		node,
		event: e,
		orientation = this.opts.orientation.current,
		invert = false,
		both = false,
	}: {
		node: HTMLElement | null | undefined;
		event: KeyboardEvent;
		orientation?: Orientation;
		invert?: boolean;
		both?: boolean;
	}) => {
		const rootNode = document.getElementById(this.opts.rootNodeId.current);
		if (!rootNode || !node) return;

		const items = this.#getCandidateNodes();
		if (!items.length) return;

		const currentIndex = items.indexOf(node);
		const dir = getElemDirection(rootNode);
		const { nextKey, prevKey } = getDirectionalKeys(dir, orientation);

		const trueNextKey = invert ? prevKey : nextKey;
		const truePrevKey = invert ? nextKey : prevKey;

		const loop = this.opts.loop.current;

		const keyToIndex = {
			[trueNextKey]: currentIndex + 1,
			[truePrevKey]: currentIndex - 1,
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
		this.#handleFocus(itemToFocus);
		return itemToFocus;
	};

	getTabIndex = (node: HTMLElement | null | undefined) => {
		const items = this.#getCandidateNodes();

		if (node && !this.#anyActive && items[0] === node) {
			this.currentTabStopId.current = node.id;
			return 0;
		} else if (node?.id === this.currentTabStopId.current) {
			return 0;
		}

		return -1;
	};

	focusFirstCandidate = () => {
		const items = this.#getCandidateNodes();
		if (!items.length) return;
		items[0]?.focus();
	};

	focusLastCandidate = () => {
		const items = this.#getCandidateNodes();
		if (!items.length) return false;
		const lastItem = items[items.length - 1];
		if (!lastItem) return false;
		this.#handleFocus(lastItem);
		return true;
	};

	recomputeActiveTabNode = () => {
		this.#recomputeDep = !this.#recomputeDep;
	};

	setCurrentTabStopId = (id: string) => {
		this.currentTabStopId.current = id;
	};
}
