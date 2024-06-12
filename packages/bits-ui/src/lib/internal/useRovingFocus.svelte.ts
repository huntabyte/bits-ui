import { type ReadableBox, type WritableBox, box } from "svelte-toolbelt";
import { getElemDirection } from "./locale.js";
import { getDirectionalKeys } from "./getDirectionalKeys.js";
import { kbd } from "./kbd.js";
import type { ElementRef } from "./types.js";
import { isBrowser } from "./is.js";
import type { Orientation } from "$lib/shared/index.js";

type UseRovingFocusProps = {
	/**
	 * The selector used to find the focusable candidates.
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

	function getCandidateNodes() {
		if (!isBrowser) return [];
		const node = document.getElementById(props.rootNodeId.value);
		if (!node) return [];
		return Array.from(
			node.querySelectorAll<HTMLElement>(`[${props.candidateSelector}]:not([data-disabled])`)
		);
	}

	function focusFirstCandidate() {
		const items = getCandidateNodes();
		if (items.length) {
			items[0]?.focus();
		}
	}

	function handleKeydown(node: HTMLElement | null | undefined, e: KeyboardEvent) {
		const rootNode = document.getElementById(props.rootNodeId.value);
		if (!rootNode || !node) return;

		const items = getCandidateNodes();
		if (!items.length) return;

		const currentIndex = items.indexOf(node);
		const dir = getElemDirection(rootNode);
		const { nextKey, prevKey } = getDirectionalKeys(dir, props.orientation.value);

		const loop = props.loop.value;

		const keyToIndex = {
			[nextKey]: currentIndex + 1,
			[prevKey]: currentIndex - 1,
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
		itemToFocus.focus();
		currentTabStopId.value = itemToFocus.id;
		props.onCandidateFocus?.(itemToFocus);
		return itemToFocus;
	}

	function getTabIndex(node: HTMLElement | null | undefined) {
		const items = getCandidateNodes();
		const anyActive = currentTabStopId.value !== null;
		if (node && !anyActive && items[0] === node) {
			currentTabStopId.value = node.id;
			return 0;
		} else if (node?.id === currentTabStopId.value) {
			return 0;
		}

		return -1;
	}

	return {
		setCurrentTabStopId(id: string) {
			currentTabStopId.value = id;
		},
		getTabIndex,
		handleKeydown,
		focusFirstCandidate,
	};
}
