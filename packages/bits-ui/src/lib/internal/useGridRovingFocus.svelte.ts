import { type ReadableBox, type WritableBox, box } from "svelte-toolbelt";
import { getElemDirection } from "./locale.js";
import { getDirectionalKeys } from "./getDirectionalKeys.js";
import { kbd } from "./kbd.js";
import { isBrowser } from "./is.js";

type UseGridRovingFocusProps = {
	/**
	 * The id of the root node to find candidates within
	 */
	rootNodeId: ReadableBox<string>;

	/**
	 * The selector used to find the row candidates.
	 */
	rowCandidateSelector: string;

	/**
	 * The selector used to find the cell candidates.
	 */
	cellCandidateSelector: string;

	/**
	 * The selector used to find focusable candidates within the cell candidates
	 */
	focusableCandidateSelector: string;

	/**
	 * A callback function called when a candidate is focused.
	 */
	onCandidateFocus?: (node: HTMLElement) => void;

	/**
	 * The current tab stop id.
	 */
	currentTabStopId?: WritableBox<string | null>;
};

const HORIZONTAL_KEYS = [kbd.ARROW_LEFT, kbd.ARROW_RIGHT, kbd.HOME, kbd.END];
const VERTICAL_KEYS = [kbd.ARROW_UP, kbd.ARROW_DOWN];

export type UseGridRovingFocusReturn = ReturnType<typeof useGridRovingFocus>;

export function useGridRovingFocus(props: UseGridRovingFocusProps) {
	const currentTabStopId: WritableBox<string | null> = props.currentTabStopId
		? props.currentTabStopId
		: box<string | null>(null);

	function getRowCandidateNodes() {
		if (!isBrowser) return [];
		const node = document.getElementById(props.rootNodeId.current);
		if (!node) return [];

		const candidates = Array.from(
			node.querySelectorAll<HTMLElement>(props.rowCandidateSelector)
		);
		return candidates;
	}

	function getCellCandidates(rootId: string = props.rootNodeId.current) {
		if (!isBrowser) return [];
		const node = document.getElementById(rootId);
		if (!node) return [];
		const candidates = Array.from(
			node.querySelectorAll<HTMLElement>(props.cellCandidateSelector)
		);
		return candidates;
	}

	function getFirstCellInRow(rowId: string) {
		const candidates = getCellCandidates(rowId);
		if (!candidates.length) return null;
		return candidates[0];
	}

	function focusFirstCandidate() {
		const candidates = getCellCandidates();
		if (!candidates.length) return;
		candidates[0]?.focus();
	}

	function getFocusCandidateByCell(cell: HTMLElement, index = 0) {
		const candidates = Array.from(
			cell.querySelectorAll<HTMLElement>(props.focusableCandidateSelector)
		);

		if (index !== 0) {
			if (candidates[index]) {
				return candidates[index];
			} else if (candidates[0]) {
				return candidates[0];
			} else {
				return cell;
			}
		}

		return candidates[0] ? candidates[0] : cell;
	}

	function getFirstCandidateWithinCell(cell: HTMLElement) {
		const candidates = Array.from(
			cell.querySelectorAll<HTMLElement>(props.focusableCandidateSelector)
		);
		return candidates[0] ? candidates[0] : null;
	}

	/**
	 * Inclusively checks if the node is a gridcell or not. If it is, it returns the node.
	 * If it isn't, it returns the closest gridcell ancestor.
	 */
	function getClosestCell(node: HTMLElement) {
		if (node.getAttribute("role") === "gridcell") return node;
		return node.closest<HTMLElement>("[role=gridcell]");
	}

	function handleFocus(node: HTMLElement) {
		currentTabStopId.current = node.id;
		node?.focus();
		props.onCandidateFocus?.(node);
	}

	function handleKeydown(node: HTMLElement | null | undefined, e: KeyboardEvent) {
		const rootNode = document.getElementById(props.rootNodeId.current);
		if (!rootNode || !node) return;
		const dir = getElemDirection(rootNode);
		// we need to determine if we're already a cell or not as if we don't have a focusable
		// candidate within the cell, focus falls back to the cell. We then handle the logic
		// differently for cells vs candidates within cells.

		if (HORIZONTAL_KEYS.includes(e.key)) {
			const cells = getCellCandidates();
			if (!cells.length) return;
			const currentCellNode = getClosestCell(node);

			if (!currentCellNode) return;

			const currentIndex = cells.indexOf(currentCellNode);

			const { nextKey, prevKey } = getDirectionalKeys(dir, "horizontal");
			const keyToIndex = {
				[nextKey]: currentIndex + 1,
				[prevKey]: currentIndex - 1,
				[kbd.HOME]: 0,
				[kbd.END]: cells.length - 1,
			};

			let itemIndex = keyToIndex[e.key];
			if (itemIndex === undefined) return;
			e.preventDefault();
			const cellToFocus = cells[itemIndex];
			if (!cellToFocus) return;

			const cellFirstCandidate = getFirstCandidateWithinCell(cellToFocus);
			handleFocus(cellFirstCandidate ?? cellToFocus);
			return cellFirstCandidate ?? cellToFocus;
		} else if (VERTICAL_KEYS.includes(e.key)) {
			// find the row that we're currently in
			const rowCandidates = getRowCandidateNodes();
			if (!rowCandidates.length) return;

			// the row this node is in
			const currentRow = rowCandidates.find((row) => row.contains(node));
			if (!currentRow) return;

			// we need to determine the index of the cell within the row, b/c with grids,
			// when we navigate to a different row, we want to remain in the same column/index
			// within the next row if possible
			const currentCell = getClosestCell(node);
			if (!currentCell) return;

			// the index of the cell within the row
			const currentRowCellIndex = getCellCandidates(currentRow.id).indexOf(currentCell);
			if (currentRowCellIndex === -1) return;

			const currentRowIndex = rowCandidates.indexOf(currentRow);

			// we flip the directions here with grid rows
			const { nextKey: prevKey, prevKey: nextKey } = getDirectionalKeys(dir, "vertical");

			const keyToIndex = {
				[nextKey]: currentRowIndex + 1,
				[prevKey]: currentRowIndex - 1,
			};

			let nextRowIndex = keyToIndex[e.key];
			if (nextRowIndex === undefined) return;

			const nextRow = rowCandidates[nextRowIndex];
			if (!nextRow) return;

			const nextRowCellCandidates = getCellCandidates(nextRow.id);
			if (!nextRowCellCandidates.length) return;
			const nextRowCellAtCurrentIndex = nextRowCellCandidates[currentRowCellIndex];

			if (!nextRowCellAtCurrentIndex) {
				// if there isn't a cell at the current index, we'll focus the first cell in the next row
				const nextRowCell = nextRowCellCandidates[0]!; // we checked for length above
				const nextRowCellFirstCandidate = getFirstCandidateWithinCell(nextRowCell);

				handleFocus(nextRowCellFirstCandidate ?? nextRowCell);
				return nextRowCellFirstCandidate ?? nextRowCell;
			}

			const nextRowFocusableCandidate =
				getFirstCandidateWithinCell(nextRowCellAtCurrentIndex);

			handleFocus(nextRowFocusableCandidate ?? nextRowCellAtCurrentIndex);

			return nextRowFocusableCandidate ?? nextRowCellAtCurrentIndex;
		}
	}

	function getTabIndex(node: HTMLElement | null | undefined) {
		const items = getCellCandidates();
		const anyActive = currentTabStopId.current !== null;
		// fallback to just giving everything a tab index of 0 if we can't find any cells
		// to prevent complete focus lockout
		if (!items.length) return 0;

		// now that we have the cells, if we don't have an active tab stop, we'll
		// find the first tabbable candidate within the first cell. If there isn't
		// one, we set the tab stop to the first cell (per the WAI-ARIA spec)
		// otherwise, we set the tab stop to the first tabbable candidate within the
		// first cell.

		if (!anyActive) {
			const firstWithinCell = getFirstCandidateWithinCell(items[0]!);
			if (firstWithinCell) {
				// found the first tabbable candidate within the first cell
				currentTabStopId.current = firstWithinCell.id;
				// if this is the node we're evaluating, we'll return 0
				if (node === firstWithinCell) {
					return 0;
				} else {
					return -1;
				}
			} else {
				// if there isn't a tabbable candidate within the first cell, we'll
				// set the tab stop to the first cell
				currentTabStopId.current = items[0]!.id;
				if (node === items[0]!) {
					return 0;
				} else {
					return -1;
				}
			}
		}
		// if there is already an active tab stop, we'll return 0 if it matches the node
		// or -1 if it doesn't.

		if (node?.id === currentTabStopId.current) {
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
