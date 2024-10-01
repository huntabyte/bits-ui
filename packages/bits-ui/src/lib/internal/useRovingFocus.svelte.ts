import { type ReadableBox, type WritableBox, box } from "svelte-toolbelt";
import { untrack } from "svelte";
import { getElemDirection } from "./locale.js";
import { getDirectionalKeys } from "./getDirectionalKeys.js";
import { kbd } from "./kbd.js";
import { isBrowser } from "./is.js";
import type { Orientation } from "$lib/shared/index.js";

type UseRovingFocusProps = {
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

export type UseRovingFocusReturn = ReturnType<typeof useRovingFocus>;

export function useRovingFocus(props: UseRovingFocusProps) {
	const currentTabStopId: WritableBox<string | null> = props.currentTabStopId
		? props.currentTabStopId
		: box<string | null>(null);
	let recomputeTracker = $state(false);

	const anyActive = $derived.by(() => {
		recomputeTracker;
		if (!currentTabStopId.current) return false;
		return Boolean(document.getElementById(currentTabStopId.current));
	});

	function getCandidateNodes() {
		if (!isBrowser) return [];
		const node = document.getElementById(props.rootNodeId.current);
		if (!node) return [];

		const candidates = Array.from(
			node.querySelectorAll<HTMLElement>(`${props.candidateSelector}:not([data-disabled])`)
		);
		return candidates;
	}

	function focusFirstCandidate() {
		const items = getCandidateNodes();
		if (!items.length) return;
		items[0]?.focus();
	}

	function focusLastCandidate() {
		const items = getCandidateNodes();
		if (!items.length) return;
		const lastItem = items[items.length - 1];
		if (!lastItem) return;
		handleFocus(lastItem);
	}

	function navigateBackward(node: HTMLElement | null | undefined, fallback?: HTMLElement | null) {
		const rootNode = document.getElementById(props.rootNodeId.current);
		if (!rootNode || !node) return;
		const items = getCandidateNodes();
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
		handleFocus(prevItem);
	}

	function handleKeydown(
		node: HTMLElement | null | undefined,
		e: KeyboardEvent,
		orientation: Orientation = props.orientation.current,
		invert = false
	) {
		const rootNode = document.getElementById(props.rootNodeId.current);
		if (!rootNode || !node) return;

		const items = getCandidateNodes();
		if (!items.length) return;

		const currentIndex = items.indexOf(node);
		const dir = getElemDirection(rootNode);
		const { nextKey, prevKey } = getDirectionalKeys(dir, orientation);

		const trueNextKey = invert ? prevKey : nextKey;
		const truePrevKey = invert ? nextKey : prevKey;

		const loop = props.loop.current;

		const keyToIndex = {
			[trueNextKey]: currentIndex + 1,
			[truePrevKey]: currentIndex - 1,
			[kbd.HOME]: 0,
			[kbd.END]: items.length - 1,
		};

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
		handleFocus(itemToFocus);
		return itemToFocus;
	}

	function handleFocus(node: HTMLElement) {
		if (!node) return;
		currentTabStopId.current = node.id;
		node?.focus();
		props.onCandidateFocus?.(node);
	}

	function getTabIndex(node: HTMLElement | null | undefined) {
		const items = getCandidateNodes();
		if (node && !anyActive && items[0] === node) {
			currentTabStopId.current = node.id;
			return 0;
		} else if (node?.id === currentTabStopId.current) {
			return 0;
		}

		return -1;
	}

	function recomputeActiveTabNode() {
		recomputeTracker = !recomputeTracker;
	}

	return {
		setCurrentTabStopId(id: string) {
			currentTabStopId.current = id;
		},
		getTabIndex,
		handleKeydown,
		focusFirstCandidate,
		navigateBackward,
		currentTabStopId,
		focusLastCandidate,
		recomputeActiveTabNode,
	};
}
