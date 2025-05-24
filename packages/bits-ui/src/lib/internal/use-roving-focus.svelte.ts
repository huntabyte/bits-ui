import { type Box, type ReadableBox, box } from "svelte-toolbelt";
import { getElemDirection } from "./locale.js";
import { getDirectionalKeys } from "./get-directional-keys.js";
import { kbd } from "./kbd.js";
import { isBrowser } from "./is.js";
import type { Orientation } from "$lib/shared/index.js";

type UseRovingFocusProps = (
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

export type UseRovingFocusReturn = ReturnType<typeof useRovingFocus>;

export function useRovingFocus(opts: UseRovingFocusProps) {
	const currentTabStopId = box<string | null>(null);

	function getCandidateNodes() {
		if (!isBrowser) return [];
		if (!opts.rootNode.current) return [];

		if (opts.candidateSelector) {
			const candidates = Array.from(
				opts.rootNode.current.querySelectorAll<HTMLElement>(opts.candidateSelector)
			);
			return candidates;
		} else if (opts.candidateAttr) {
			const candidates = Array.from(
				opts.rootNode.current.querySelectorAll<HTMLElement>(
					`[${opts.candidateAttr}]:not([data-disabled])`
				)
			);
			return candidates;
		}

		return [];
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
		const rootNode = opts.rootNode.current;
		if (!rootNode || !node) return;

		const items = getCandidateNodes();
		if (!items.length) return;

		const currentIndex = items.indexOf(node);
		const dir = getElemDirection(rootNode);
		const { nextKey, prevKey } = getDirectionalKeys(dir, opts.orientation.current);
		const loop = opts.loop.current;

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
		opts.onCandidateFocus?.(itemToFocus);
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
