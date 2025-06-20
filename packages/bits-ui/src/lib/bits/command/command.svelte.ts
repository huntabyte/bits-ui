import {
	afterSleep,
	afterTick,
	srOnlyStyles,
	attachRef,
	type WritableBoxedValues,
	type ReadableBoxedValues,
} from "svelte-toolbelt";
import { Context, watch } from "runed";
import { findNextSibling, findPreviousSibling } from "./utils.js";
import type { CommandState } from "./types.js";
import type {
	BitsKeyboardEvent,
	BitsMouseEvent,
	BitsPointerEvent,
	RefAttachment,
	WithRefOpts,
} from "$lib/internal/types.js";
import { kbd } from "$lib/internal/kbd.js";
import {
	createBitsAttrs,
	getAriaDisabled,
	getAriaExpanded,
	getAriaSelected,
	getDataDisabled,
	getDataSelected,
} from "$lib/internal/attrs.js";
import { getFirstNonCommentChild } from "$lib/internal/dom.js";
import { computeCommandScore } from "./index.js";
import { cssEscape } from "$lib/internal/css-escape.js";

const COMMAND_VALUE_ATTR = "data-value";

const commandAttrs = createBitsAttrs({
	component: "command",
	parts: [
		"root",
		"list",
		"input",
		"separator",
		"loading",
		"empty",
		"group",
		"group-items",
		"group-heading",
		"item",
		"viewport",
		"input-label",
	],
});

// selectors
const COMMAND_GROUP_SELECTOR = commandAttrs.selector("group");
const COMMAND_GROUP_ITEMS_SELECTOR = commandAttrs.selector("group-items");
const COMMAND_GROUP_HEADING_SELECTOR = commandAttrs.selector("group-heading");
const COMMAND_ITEM_SELECTOR = commandAttrs.selector("item");
const COMMAND_VALID_ITEM_SELECTOR = `${commandAttrs.selector("item")}:not([aria-disabled="true"])`;

const CommandRootContext = new Context<CommandRootState>("Command.Root");
const CommandListContext = new Context<CommandListState>("Command.List");
const CommandGroupContainerContext = new Context<CommandGroupContainerState>("Command.Group");

interface GridItem {
	index: number;
	firstRowOfGroup: boolean;
	ref: HTMLElement;
}

type ItemsGrid = GridItem[][];

interface CommandRootStateOpts
	extends WithRefOpts,
		ReadableBoxedValues<{
			filter: (value: string, search: string, keywords?: string[]) => number;
			shouldFilter: boolean;
			loop: boolean;
			vimBindings: boolean;
			columns: number | null;
			disablePointerSelection: boolean;
			disableInitialScroll: boolean;
			onStateChange?: (state: Readonly<CommandState>) => void;
		}>,
		WritableBoxedValues<{
			value: string;
		}> {}

const defaultState = {
	/** Value of the search query */
	search: "",
	/** Currently selected item value */
	value: "",
	filtered: {
		/** The count of all visible items. */
		count: 0,
		/** Map from visible item id to its search store. */
		items: new Map<string, number>(),
		/** Set of groups with at least one visible item. */
		groups: new Set<string>(),
	},
};

export class CommandRootState {
	static create(opts: CommandRootStateOpts) {
		return CommandRootContext.set(new CommandRootState(opts));
	}
	readonly opts: CommandRootStateOpts;
	readonly attachment: RefAttachment;
	#updateScheduled = false;
	#isInitialMount = true;
	sortAfterTick = false;
	sortAndFilterAfterTick = false;
	allItems = new Set<string>();
	allGroups = new Map<string, Set<string>>();
	allIds = new Map<string, { value: string; keywords?: string[] }>();
	// attempt to prevent the harsh delay when user is typing fast
	key = $state(0);
	viewportNode = $state<HTMLElement | null>(null);
	inputNode = $state<HTMLElement | null>(null);
	labelNode = $state<HTMLElement | null>(null);
	// published state that the components and other things can react to
	commandState = $state.raw<CommandState>(defaultState);
	// internal state that we mutate in batches and publish to the `state` at once
	_commandState = $state<CommandState>(defaultState);

	#snapshot() {
		return $state.snapshot(this._commandState);
	}

	#scheduleUpdate() {
		if (this.#updateScheduled) return;
		this.#updateScheduled = true;

		afterTick(() => {
			this.#updateScheduled = false;

			const currentState = this.#snapshot();
			const hasStateChanged = !Object.is(this.commandState, currentState);

			if (hasStateChanged) {
				this.commandState = currentState;
				this.opts.onStateChange?.current?.(currentState);
			}
		});
	}

	setState<K extends keyof CommandState>(
		key: K,
		value: CommandState[K],
		preventScroll?: boolean
	) {
		if (Object.is(this._commandState[key], value)) return;

		this._commandState[key] = value;

		if (key === "search") {
			// Filter synchronously before emitting back to children
			this.#filterItems();
			this.#sort();
		} else if (key === "value") {
			if (!preventScroll) this.#scrollSelectedIntoView();
		}

		this.#scheduleUpdate();
	}

	constructor(opts: CommandRootStateOpts) {
		this.opts = opts;
		this.attachment = attachRef(this.opts.ref);

		const defaults = { ...this._commandState, value: this.opts.value.current ?? "" };

		this._commandState = defaults;
		this.commandState = defaults;

		this.onkeydown = this.onkeydown.bind(this);
	}

	/**
	 * Calculates score for an item based on search text and keywords.
	 * Higher score = better match.
	 *
	 * @param value - Item's display text
	 * @param keywords - Optional keywords to boost scoring
	 * @returns Score from 0-1, where 0 = no match
	 */
	#score(value: string, keywords?: string[]) {
		const filter = this.opts.filter.current ?? computeCommandScore;
		const score = value ? filter(value, this._commandState.search, keywords) : 0;
		return score;
	}

	/**
	 * Sorts items and groups based on search scores.
	 * Groups are sorted by their highest scoring item.
	 * When no search active, selects first item.
	 */
	#sort(): void {
		if (!this._commandState.search || this.opts.shouldFilter.current === false) {
			// If no search and no selection yet, select first item
			this.#selectFirstItem();
			return;
		}

		const scores = this._commandState.filtered.items;

		// sort the groups
		const groups: [string, number][] = [];
		for (const value of this._commandState.filtered.groups) {
			const items = this.allGroups.get(value);
			let max = 0;
			if (!items) {
				groups.push([value, max]);
				continue;
			}

			// get the max score of the group's items
			for (const item of items!) {
				const score = scores.get(item);
				max = Math.max(score ?? 0, max);
			}
			groups.push([value, max]);
		}

		// Sort items within groups to bottom
		// Sort items outside of groups
		// Sort groups to bottom (pushes all non-grouped items to the top)
		const listInsertionElement = this.viewportNode;

		const sorted = this.getValidItems().sort((a, b) => {
			const valueA = a.getAttribute("data-value");
			const valueB = b.getAttribute("data-value");
			const scoresA = scores.get(valueA!) ?? 0;
			const scoresB = scores.get(valueB!) ?? 0;
			return scoresB - scoresA;
		});

		for (const item of sorted) {
			const group = item.closest(COMMAND_GROUP_ITEMS_SELECTOR);

			if (group) {
				const itemToAppend =
					item.parentElement === group
						? item
						: item.closest(`${COMMAND_GROUP_ITEMS_SELECTOR} > *`);

				if (itemToAppend) {
					group.appendChild(itemToAppend);
				}
			} else {
				const itemToAppend =
					item.parentElement === listInsertionElement
						? item
						: item.closest(`${COMMAND_GROUP_ITEMS_SELECTOR} > *`);

				if (itemToAppend) {
					listInsertionElement?.appendChild(itemToAppend);
				}
			}
		}

		const sortedGroups = groups.sort((a, b) => b[1] - a[1]);

		for (const group of sortedGroups) {
			const element = listInsertionElement?.querySelector(
				`${COMMAND_GROUP_SELECTOR}[${COMMAND_VALUE_ATTR}="${cssEscape(group[0])}"]`
			);
			element?.parentElement?.appendChild(element);
		}

		this.#selectFirstItem();
	}

	/**
	 * Sets current value and triggers re-render if cleared.
	 *
	 * @param value - New value to set
	 */
	setValue(value: string, opts?: boolean) {
		if (value !== this.opts.value.current && value === "") {
			afterTick(() => {
				this.key++;
			});
		}
		this.setState("value", value, opts);
		this.opts.value.current = value;
	}

	/**
	 * Selects first non-disabled item on next tick.
	 */
	#selectFirstItem(): void {
		afterTick(() => {
			const item = this.getValidItems().find(
				(item) => item.getAttribute("aria-disabled") !== "true"
			);
			const value = item?.getAttribute(COMMAND_VALUE_ATTR);
			const shouldPreventScroll =
				this.#isInitialMount && this.opts.disableInitialScroll.current;
			this.setValue(value ?? "", shouldPreventScroll);
			this.#isInitialMount = false;
		});
	}

	/**
	 * Updates filtered items/groups based on search.
	 * Recalculates scores and filtered count.
	 */
	#filterItems(): void {
		if (!this._commandState.search || this.opts.shouldFilter.current === false) {
			this._commandState.filtered.count = this.allItems.size;
			return;
		}

		// reset the groups
		this._commandState.filtered.groups = new Set();
		let itemCount = 0;

		// Check which items should be included
		for (const id of this.allItems) {
			const value = this.allIds.get(id)?.value ?? "";
			const keywords = this.allIds.get(id)?.keywords ?? [];
			const rank = this.#score(value, keywords);
			this._commandState.filtered.items.set(id, rank);
			if (rank > 0) itemCount++;
		}

		// Check which groups have at least 1 item shown
		for (const [groupId, group] of this.allGroups) {
			for (const itemId of group) {
				const currItem = this._commandState.filtered.items.get(itemId);

				if (currItem && currItem > 0) {
					this._commandState.filtered.groups.add(groupId);
					break;
				}
			}
		}

		this._commandState.filtered.count = itemCount;
	}

	/**
	 * Gets all non-disabled, visible command items.
	 *
	 * @returns Array of valid item elements
	 * @remarks Exposed for direct item access and bound checking
	 */
	getValidItems(): HTMLElement[] {
		const node = this.opts.ref.current;
		if (!node) return [];
		const validItems = Array.from(
			node.querySelectorAll<HTMLElement>(COMMAND_VALID_ITEM_SELECTOR)
		).filter((el): el is HTMLElement => !!el);
		return validItems;
	}

	/**
	 * Gets all visible command items.
	 *
	 * @returns Array of valid item elements
	 * @remarks Exposed for direct item access and bound checking
	 */
	getVisibleItems(): HTMLElement[] {
		const node = this.opts.ref.current;
		if (!node) return [];
		const visibleItems = Array.from(
			node.querySelectorAll<HTMLElement>(COMMAND_ITEM_SELECTOR)
		).filter((el): el is HTMLElement => !!el);
		return visibleItems;
	}

	/** Returns all visible items in a matrix structure
	 *
	 * @remarks Returns empty if the command isn't configured as a grid
	 *
	 * @returns
	 */
	get itemsGrid(): ItemsGrid {
		if (!this.isGrid) return [];

		const columns = this.opts.columns.current ?? 1;

		const items = this.getVisibleItems();

		const grid: ItemsGrid = [[]];

		let currentGroup = items[0]?.getAttribute("data-group");
		let column = 0;
		let row = 0;

		for (let i = 0; i < items.length; i++) {
			const item = items[i];
			const itemGroup = item?.getAttribute("data-group");

			if (currentGroup !== itemGroup) {
				currentGroup = itemGroup;
				column = 1;
				row++;
				grid.push([{ index: i, firstRowOfGroup: true, ref: item! }]);
			} else {
				column++;

				if (column > columns) {
					row++;
					column = 1;
					grid.push([]);
				}

				grid[row]?.push({
					index: i,
					firstRowOfGroup: grid[row]?.[0]?.firstRowOfGroup ?? i === 0,
					ref: item!,
				});
			}
		}

		return grid;
	}

	/**
	 * Gets currently selected command item.
	 *
	 * @returns Selected element or undefined
	 */
	#getSelectedItem(): HTMLElement | undefined {
		const node = this.opts.ref.current;
		if (!node) return;
		const selectedNode = node.querySelector<HTMLElement>(
			`${COMMAND_VALID_ITEM_SELECTOR}[data-selected]`
		);
		if (!selectedNode) return;
		return selectedNode;
	}

	/**
	 * Scrolls selected item into view.
	 * Special handling for first items in groups.
	 */
	#scrollSelectedIntoView(): void {
		afterTick(() => {
			const item = this.#getSelectedItem();
			if (!item) return;
			const grandparent = item.parentElement?.parentElement;
			if (!grandparent) return;

			if (this.isGrid) {
				const isFirstRowOfGroup = this.#itemIsFirstRowOfGroup(item);

				// ensure item is visible
				item.scrollIntoView({ block: "nearest" });

				if (isFirstRowOfGroup) {
					const closestGroupHeader = item
						?.closest(COMMAND_GROUP_SELECTOR)
						?.querySelector(COMMAND_GROUP_HEADING_SELECTOR);
					closestGroupHeader?.scrollIntoView({ block: "nearest" });

					return;
				}
			} else {
				const firstChildOfParent = getFirstNonCommentChild(
					grandparent
				) as HTMLElement | null;

				if (
					firstChildOfParent &&
					firstChildOfParent.dataset?.value === item.dataset?.value
				) {
					const closestGroupHeader = item
						?.closest(COMMAND_GROUP_SELECTOR)
						?.querySelector(COMMAND_GROUP_HEADING_SELECTOR);
					closestGroupHeader?.scrollIntoView({ block: "nearest" });

					return;
				}
			}

			item.scrollIntoView({ block: "nearest" });
		});
	}

	#itemIsFirstRowOfGroup(item: HTMLElement) {
		const grid = this.itemsGrid;

		if (grid.length === 0) return false;

		for (let r = 0; r < grid.length; r++) {
			const row = grid[r];
			if (row === undefined) continue;

			for (let c = 0; c < row.length; c++) {
				const column = row[c];
				if (column === undefined || column.ref !== item) continue;

				return column.firstRowOfGroup;
			}
		}

		return false;
	}

	/**
	 * Sets selection to item at specified index in valid items array.
	 * If index is out of bounds, does nothing.
	 *
	 * @param index - Zero-based index of item to select
	 * @remarks
	 * Uses `getValidItems()` to get selectable items, filtering out disabled/hidden ones.
	 * Access valid items directly via `getValidItems()` to check bounds before calling.
	 *
	 * @example
	 * // get valid items length for bounds check
	 * const items = getValidItems()
	 * if (index < items.length) {
	 *   updateSelectedToIndex(index)
	 * }
	 */
	updateSelectedToIndex(index: number) {
		const item = this.getValidItems()[index];
		if (!item) return;
		this.setValue(item.getAttribute(COMMAND_VALUE_ATTR) ?? "");
	}

	/**
	 * Updates selected item by moving up/down relative to current selection.
	 * Handles wrapping when loop option is enabled.
	 *
	 * @param change - Direction to move: 1 for next item, -1 for previous item
	 * @remarks
	 * The loop behavior wraps:
	 * - From last item to first when moving next
	 * - From first item to last when moving previous
	 *
	 * Uses `getValidItems()` to get all selectable items, which filters out disabled/hidden items.
	 * You can call `getValidItems()` directly to get the current valid items array.
	 *
	 * @example
	 * // select next item
	 * updateSelectedByItem(1)
	 *
	 * // get all valid items
	 * const items = getValidItems()
	 */
	updateSelectedByItem(change: number): void {
		const selected = this.#getSelectedItem();
		const items = this.getValidItems();
		const index = items.findIndex((item) => item === selected);

		// Get item at this index
		let newSelected = items[index + change];

		if (this.opts.loop.current) {
			newSelected =
				index + change < 0
					? items[items.length - 1]
					: index + change === items.length
						? items[0]
						: items[index + change];
		}

		if (newSelected) {
			this.setValue(newSelected.getAttribute(COMMAND_VALUE_ATTR) ?? "");
		}
	}

	/**
	 * Moves selection to the first valid item in the next/previous group.
	 * If no group is found, falls back to selecting the next/previous item globally.
	 *
	 * @param change - Direction to move: 1 for next group, -1 for previous group
	 * @example
	 * // move to first item in next group
	 * updateSelectedByGroup(1)
	 *
	 * // move to first item in previous group
	 * updateSelectedByGroup(-1)
	 */
	updateSelectedByGroup(change: 1 | -1): void {
		const selected = this.#getSelectedItem();
		let group = selected?.closest(COMMAND_GROUP_SELECTOR);
		let item: HTMLElement | null | undefined;

		while (group && !item) {
			group =
				change > 0
					? findNextSibling(group, COMMAND_GROUP_SELECTOR)
					: findPreviousSibling(group, COMMAND_GROUP_SELECTOR);
			item = group?.querySelector(COMMAND_VALID_ITEM_SELECTOR);
		}

		if (item) {
			this.setValue(item.getAttribute(COMMAND_VALUE_ATTR) ?? "");
		} else {
			this.updateSelectedByItem(change);
		}
	}

	/**
	 * Maps item id to display value and search keywords.
	 * Returns cleanup function to remove mapping.
	 *
	 * @param id - Unique item identifier
	 * @param value - Display text
	 * @param keywords - Optional search boost terms
	 * @returns Cleanup function
	 */
	registerValue(value: string, keywords?: string[]): () => void {
		if (!(value && value === this.allIds.get(value)?.value)) {
			this.allIds.set(value, { value, keywords });
		}
		this._commandState.filtered.items.set(value, this.#score(value, keywords));

		// Schedule sorting to run after this tick when all items are added not each time an item is added
		if (!this.sortAfterTick) {
			this.sortAfterTick = true;
			afterTick(() => {
				this.#sort();
				this.sortAfterTick = false;
			});
		}

		return () => {
			this.allIds.delete(value);
		};
	}

	/**
	 * Registers item in command list and its group.
	 * Handles filtering, sorting and selection updates.
	 *
	 * @param id - Item identifier
	 * @param groupId - Optional group to add item to
	 * @returns Cleanup function that handles selection
	 */
	registerItem(id: string, groupId: string | undefined): () => void {
		this.allItems.add(id);

		// Track this item within the group
		if (groupId) {
			if (!this.allGroups.has(groupId)) {
				this.allGroups.set(groupId, new Set([id]));
			} else {
				this.allGroups.get(groupId)!.add(id);
			}
		}

		// Schedule sorting and filtering to run after this tick when all items are added not each time an item is added
		if (!this.sortAndFilterAfterTick) {
			this.sortAndFilterAfterTick = true;
			afterTick(() => {
				this.#filterItems();
				this.#sort();
				this.sortAndFilterAfterTick = false;
			});
		}

		this.#scheduleUpdate();
		return () => {
			const selectedItem = this.#getSelectedItem();
			this.allIds.delete(id);
			this.allItems.delete(id);
			this.commandState.filtered.items.delete(id);

			this.#filterItems();

			// The item removed have been the selected one,
			// so selection should be moved to the first
			if (selectedItem?.getAttribute("id") === id) {
				this.#selectFirstItem();
			}

			this.#scheduleUpdate();
		};
	}

	/**
	 * Creates empty group if not exists.
	 *
	 * @param id - Group identifier
	 * @returns Cleanup function
	 */
	registerGroup(id: string): () => void {
		if (!this.allGroups.has(id)) {
			this.allGroups.set(id, new Set());
		}

		return () => {
			this.allIds.delete(id);
			this.allGroups.delete(id);
		};
	}

	get isGrid() {
		return this.opts.columns.current !== null;
	}

	/**
	 * Selects last valid item.
	 */
	#last() {
		return this.updateSelectedToIndex(this.getValidItems().length - 1);
	}

	/**
	 * Handles next item selection:
	 * - Meta: Jump to last
	 * - Alt: Next group
	 * - Default: Next item
	 *
	 * @param e - Keyboard event
	 */
	#next(e: BitsKeyboardEvent) {
		e.preventDefault();

		if (e.metaKey) {
			this.#last();
		} else if (e.altKey) {
			this.updateSelectedByGroup(1);
		} else {
			this.updateSelectedByItem(1);
		}
	}

	#down(e: BitsKeyboardEvent) {
		if (this.opts.columns.current === null) return;

		e.preventDefault();

		if (e.metaKey) {
			this.updateSelectedByGroup(1);
		} else {
			this.updateSelectedByItem(this.#nextRowColumnOffset(e));
		}
	}

	#getColumn(
		item: HTMLElement,
		grid: ItemsGrid
	): { columnIndex: number; rowIndex: number } | null {
		if (grid.length === 0) return null;

		for (let r = 0; r < grid.length; r++) {
			const row = grid[r];
			if (row === undefined) continue;

			for (let c = 0; c < row.length; c++) {
				const column = row[c];
				if (column === undefined || column.ref !== item) continue;

				return { columnIndex: c, rowIndex: r };
			}
		}

		return null;
	}

	#nextRowColumnOffset(e: BitsKeyboardEvent): number {
		const grid = this.itemsGrid;
		const selected = this.#getSelectedItem();
		if (!selected) return 0;
		const column = this.#getColumn(selected, grid);
		if (!column) return 0;

		let newItem: HTMLElement | null = null;

		const skipRows = e.altKey ? 1 : 0;

		// if this is the second to last row then we need to go to the last row when skipping and not in loop mode
		if (e.altKey && column.rowIndex === grid.length - 2 && !this.opts.loop.current) {
			newItem = this.#findNextNonDisabledItem({
				start: grid.length - 1,
				end: grid.length,
				expectedColumnIndex: column.columnIndex,
				grid,
			});
		} else if (column.rowIndex === grid.length - 1) {
			// if this is the last row we apply the loop logic
			if (!this.opts.loop.current) return 0;

			newItem = this.#findNextNonDisabledItem({
				start: 0 + skipRows,
				end: column.rowIndex,
				expectedColumnIndex: column.columnIndex,
				grid,
			});
		} else {
			newItem = this.#findNextNonDisabledItem({
				start: column.rowIndex + 1 + skipRows,
				end: grid.length,
				expectedColumnIndex: column.columnIndex,
				grid,
			});

			// this happens if there were no non-disabled columns below the current column
			// we can now try starting from the beginning to find the right column
			if (newItem === null && this.opts.loop.current) {
				newItem = this.#findNextNonDisabledItem({
					start: 0,
					end: column.rowIndex,
					expectedColumnIndex: column.columnIndex,
					grid,
				});
			}
		}

		return this.#calculateOffset(selected, newItem);
	}

	/** Attempts to find the next non-disabled column that matches the expected column.
	 *
	 * @remarks
	 * - Skips over disabled columns
	 * - When a row is shorter than the expected column it defaults to the last item in the row
	 *
	 * @param param0
	 * @returns
	 */
	#findNextNonDisabledItem({
		start,
		end,
		grid,
		expectedColumnIndex,
	}: {
		start: number;
		end: number;
		grid: ItemsGrid;
		expectedColumnIndex: number;
	}) {
		let newItem: HTMLElement | null = null;

		for (let r = start; r < end; r++) {
			const row = grid[r]!;

			// try to get the next column
			newItem = row[expectedColumnIndex]?.ref ?? null;

			// skip over disabled items
			if (newItem !== null && itemIsDisabled(newItem)) {
				newItem = null;
				continue;
			}

			// if that column doesn't exist default to the next highest column
			if (newItem === null) {
				// try and find the next highest non-disabled item in the row
				// if there aren't any non-disabled items we just give up and return null
				for (let i = row.length - 1; i >= 0; i--) {
					const item = row[row.length - 1];
					if (item === undefined || itemIsDisabled(item.ref)) continue;

					newItem = item.ref;
					break;
				}
			}
			break;
		}

		return newItem;
	}

	#calculateOffset(selected: HTMLElement, newSelected: HTMLElement | null): number {
		if (newSelected === null) return 0;

		const items = this.getValidItems();

		const ogIndex = items.findIndex((item) => item === selected);
		const newIndex = items.findIndex((item) => item === newSelected);

		return newIndex - ogIndex;
	}

	#up(e: BitsKeyboardEvent) {
		if (this.opts.columns.current === null) return;

		e.preventDefault();

		if (e.metaKey) {
			this.updateSelectedByGroup(-1);
		} else {
			this.updateSelectedByItem(this.#previousRowColumnOffset(e));
		}
	}

	#previousRowColumnOffset(e: BitsKeyboardEvent) {
		const grid = this.itemsGrid;
		const selected = this.#getSelectedItem();
		if (selected === undefined) return 0;
		const column = this.#getColumn(selected, grid);
		if (column === null) return 0;

		let newItem: HTMLElement | null = null;

		const skipRows = e.altKey ? 1 : 0;

		// if this is the second row then we need to go to the top when skipping and not in loop mode
		if (e.altKey && column.rowIndex === 1 && this.opts.loop.current === false) {
			newItem = this.#findNextNonDisabledItemDesc({
				start: 0,
				end: 0,
				expectedColumnIndex: column.columnIndex,
				grid,
			});
		} else if (column.rowIndex === 0) {
			// if this is the last row we apply the loop logic
			if (this.opts.loop.current === false) return 0;

			newItem = this.#findNextNonDisabledItemDesc({
				start: grid.length - 1 - skipRows,
				end: column.rowIndex + 1,
				expectedColumnIndex: column.columnIndex,
				grid,
			});
		} else {
			newItem = this.#findNextNonDisabledItemDesc({
				start: column.rowIndex - 1 - skipRows,
				end: 0,
				expectedColumnIndex: column.columnIndex,
				grid,
			});

			// this happens if there were no non-disabled columns below the current column
			// we can now try starting from the beginning to find the right column
			if (newItem === null && this.opts.loop.current) {
				newItem = this.#findNextNonDisabledItemDesc({
					start: grid.length - 1,
					end: column.rowIndex + 1,
					expectedColumnIndex: column.columnIndex,
					grid,
				});
			}
		}

		return this.#calculateOffset(selected, newItem);
	}

	/**
	 * Attempts to find the next non-disabled column that matches the expected column.
	 *
	 * @remarks
	 * - Skips over disabled columns
	 * - When a row is shorter than the expected column it defaults to the last item in the row
	 */
	#findNextNonDisabledItemDesc({
		start,
		end,
		grid,
		expectedColumnIndex,
	}: {
		start: number;
		end: number;
		grid: ItemsGrid;
		expectedColumnIndex: number;
	}) {
		let newItem: HTMLElement | null = null;

		for (let r = start; r >= end; r--) {
			const row = grid[r];
			if (row === undefined) continue;

			// try to get the next column
			newItem = row[expectedColumnIndex]?.ref ?? null;

			// skip over disabled items
			if (newItem !== null && itemIsDisabled(newItem)) {
				newItem = null;
				continue;
			}

			// if that column doesn't exist default to the next highest column
			if (newItem === null) {
				// try and find the next highest non-disabled item in the row
				// if there aren't any non-disabled items we just give up and return null
				for (let i = row.length - 1; i >= 0; i--) {
					const item = row[row.length - 1];
					if (item === undefined || itemIsDisabled(item.ref)) continue;

					newItem = item.ref;
					break;
				}
			}
			break;
		}

		return newItem;
	}

	/**
	 * Handles previous item selection:
	 * - Meta: Jump to first
	 * - Alt: Previous group
	 * - Default: Previous item
	 *
	 * @param e - Keyboard event
	 */
	#prev(e: BitsKeyboardEvent) {
		e.preventDefault();

		if (e.metaKey) {
			// First item
			this.updateSelectedToIndex(0);
		} else if (e.altKey) {
			// Previous group
			this.updateSelectedByGroup(-1);
		} else {
			// Previous item
			this.updateSelectedByItem(-1);
		}
	}

	onkeydown(e: BitsKeyboardEvent) {
		const isVim = this.opts.vimBindings.current && e.ctrlKey;
		switch (e.key) {
			case kbd.n:
			case kbd.j: {
				// vim down
				if (isVim) {
					if (this.isGrid) {
						this.#down(e);
					} else {
						this.#next(e);
					}
				}
				break;
			}
			case kbd.l: {
				// vim right
				if (isVim) {
					if (this.isGrid) {
						this.#next(e);
					}
				}
				break;
			}
			case kbd.ARROW_DOWN:
				if (this.isGrid) {
					this.#down(e);
				} else {
					this.#next(e);
				}
				break;
			case kbd.ARROW_RIGHT:
				if (!this.isGrid) break;

				this.#next(e);

				break;
			case kbd.p:
			case kbd.k: {
				// vim up
				if (isVim) {
					if (this.isGrid) {
						this.#up(e);
					} else {
						this.#prev(e);
					}
				}
				break;
			}
			case kbd.h: {
				// vim left
				if (isVim && this.isGrid) {
					this.#prev(e);
				}
				break;
			}
			case kbd.ARROW_UP:
				if (this.isGrid) {
					this.#up(e);
				} else {
					this.#prev(e);
				}
				break;
			case kbd.ARROW_LEFT:
				if (!this.isGrid) break;
				this.#prev(e);
				break;
			case kbd.HOME:
				// first item
				e.preventDefault();
				this.updateSelectedToIndex(0);
				break;
			case kbd.END:
				// last item
				e.preventDefault();
				this.#last();
				break;
			case kbd.ENTER: {
				/**
				 * Check if IME composition is finished before triggering the select event.
				 * This prevents unwanted triggering while user is still inputting text with IME.
				 * e.keyCode === 229 is for the Japanese IME && Safari as `isComposing` does not
				 * work with Japanese IME and Safari in combination.
				 */
				if (!e.isComposing && e.keyCode !== 229) {
					e.preventDefault();
					const item = this.#getSelectedItem();
					if (item) {
						item?.click();
					}
				}
			}
		}
	}

	props = $derived.by(
		() =>
			({
				id: this.opts.id.current,
				role: "application",
				[commandAttrs.root]: "",
				tabindex: -1,
				onkeydown: this.onkeydown,
				...this.attachment,
			}) as const
	);
}

function itemIsDisabled(item: HTMLElement) {
	return item.getAttribute("aria-disabled") === "true";
}

interface CommandEmptyStateOpts
	extends WithRefOpts,
		ReadableBoxedValues<{
			forceMount: boolean;
		}> {}

export class CommandEmptyState {
	static create(opts: CommandEmptyStateOpts) {
		return new CommandEmptyState(opts, CommandRootContext.get());
	}

	readonly opts: CommandEmptyStateOpts;
	readonly root: CommandRootState;
	readonly attachment: RefAttachment;
	readonly shouldRender = $derived.by(() => {
		return (
			(this.root._commandState.filtered.count === 0 && this.#isInitialRender === false) ||
			this.opts.forceMount.current
		);
	});
	#isInitialRender = true;

	constructor(opts: CommandEmptyStateOpts, root: CommandRootState) {
		this.opts = opts;
		this.root = root;
		this.attachment = attachRef(this.opts.ref);

		$effect.pre(() => {
			this.#isInitialRender = false;
		});
	}

	readonly props = $derived.by(
		() =>
			({
				id: this.opts.id.current,
				role: "presentation",
				[commandAttrs.empty]: "",
				...this.attachment,
			}) as const
	);
}

interface CommandGroupContainerStateOpts
	extends WithRefOpts,
		ReadableBoxedValues<{
			value: string;
			forceMount: boolean;
		}> {}

export class CommandGroupContainerState {
	static create(opts: CommandGroupContainerStateOpts) {
		return CommandGroupContainerContext.set(
			new CommandGroupContainerState(opts, CommandRootContext.get())
		);
	}

	readonly opts: CommandGroupContainerStateOpts;
	readonly root: CommandRootState;
	readonly attachment: RefAttachment;
	readonly shouldRender = $derived.by(() => {
		if (this.opts.forceMount.current) return true;
		if (this.root.opts.shouldFilter.current === false) return true;
		if (!this.root.commandState.search) return true;
		return this.root._commandState.filtered.groups.has(this.trueValue);
	});

	headingNode = $state<HTMLElement | null>(null);
	trueValue = $state("");

	constructor(opts: CommandGroupContainerStateOpts, root: CommandRootState) {
		this.opts = opts;
		this.root = root;
		this.attachment = attachRef(this.opts.ref);
		this.trueValue = opts.value.current ?? opts.id.current;

		watch(
			() => this.trueValue,
			() => {
				return this.root.registerGroup(this.trueValue);
			}
		);

		$effect(() => {
			if (this.opts.value.current) {
				this.trueValue = this.opts.value.current;
				return this.root.registerValue(this.opts.value.current);
			} else if (this.headingNode && this.headingNode.textContent) {
				this.trueValue = this.headingNode.textContent.trim().toLowerCase();
				return this.root.registerValue(this.trueValue);
			} else {
				this.trueValue = `-----${this.opts.id.current}`;
				return this.root.registerValue(this.trueValue);
			}
		});
	}

	readonly props = $derived.by(
		() =>
			({
				id: this.opts.id.current,
				role: "presentation",
				hidden: this.shouldRender ? undefined : true,
				"data-value": this.trueValue,
				[commandAttrs.group]: "",
				...this.attachment,
			}) as const
	);
}

interface CommandGroupHeadingStateOpts extends WithRefOpts {}

export class CommandGroupHeadingState {
	static create(opts: CommandGroupHeadingStateOpts) {
		return new CommandGroupHeadingState(opts, CommandGroupContainerContext.get());
	}

	readonly opts: CommandGroupHeadingStateOpts;
	readonly group: CommandGroupContainerState;
	readonly attachment: RefAttachment;

	constructor(opts: CommandGroupHeadingStateOpts, group: CommandGroupContainerState) {
		this.opts = opts;
		this.group = group;
		this.attachment = attachRef(this.opts.ref, (v) => (this.group.headingNode = v));
	}

	readonly props = $derived.by(
		() =>
			({
				id: this.opts.id.current,
				[commandAttrs["group-heading"]]: "",
				...this.attachment,
			}) as const
	);
}

interface CommandGroupItemsStateOpts extends WithRefOpts {}

export class CommandGroupItemsState {
	static create(opts: CommandGroupItemsStateOpts) {
		return new CommandGroupItemsState(opts, CommandGroupContainerContext.get());
	}

	readonly opts: CommandGroupItemsStateOpts;
	readonly group: CommandGroupContainerState;
	readonly attachment: RefAttachment;

	constructor(opts: CommandGroupItemsStateOpts, group: CommandGroupContainerState) {
		this.opts = opts;
		this.group = group;
		this.attachment = attachRef(this.opts.ref);
	}

	readonly props = $derived.by(
		() =>
			({
				id: this.opts.id.current,
				role: "group",
				[commandAttrs["group-items"]]: "",
				"aria-labelledby": this.group.headingNode?.id ?? undefined,
				...this.attachment,
			}) as const
	);
}

interface CommandInputStateOpts
	extends WithRefOpts,
		WritableBoxedValues<{
			value: string;
		}>,
		ReadableBoxedValues<{
			autofocus: boolean;
		}> {}

export class CommandInputState {
	static create(opts: CommandInputStateOpts) {
		return new CommandInputState(opts, CommandRootContext.get());
	}

	readonly opts: CommandInputStateOpts;
	readonly root: CommandRootState;
	readonly attachment: RefAttachment;
	readonly #selectedItemId = $derived.by(() => {
		const item = this.root.viewportNode?.querySelector<HTMLElement>(
			`${COMMAND_ITEM_SELECTOR}[${COMMAND_VALUE_ATTR}="${cssEscape(this.root.opts.value.current)}"]`
		);
		if (item === undefined || item === null) return;
		return item.getAttribute("id") ?? undefined;
	});

	constructor(opts: CommandInputStateOpts, root: CommandRootState) {
		this.opts = opts;
		this.root = root;
		this.attachment = attachRef(this.opts.ref, (v) => (this.root.inputNode = v));
		watch(
			() => this.opts.ref.current,
			() => {
				const node = this.opts.ref.current;
				if (node && this.opts.autofocus.current) {
					afterSleep(10, () => node.focus());
				}
			}
		);

		watch(
			() => this.opts.value.current,
			() => {
				if (this.root.commandState.search !== this.opts.value.current) {
					this.root.setState("search", this.opts.value.current);
				}
			}
		);
	}

	readonly props = $derived.by(
		() =>
			({
				id: this.opts.id.current,
				type: "text",
				[commandAttrs.input]: "",
				autocomplete: "off",
				autocorrect: "off",
				spellcheck: false,
				"aria-autocomplete": "list",
				role: "combobox",
				"aria-expanded": getAriaExpanded(true),
				"aria-controls": this.root.viewportNode?.id ?? undefined,
				"aria-labelledby": this.root.labelNode?.id ?? undefined,
				"aria-activedescendant": this.#selectedItemId,
				...this.attachment,
			}) as const
	);
}

interface CommandItemStateOpts
	extends WithRefOpts,
		ReadableBoxedValues<{
			value: string;
			disabled: boolean;
			onSelect: () => void;
			forceMount: boolean;
			keywords: string[];
		}> {
	group: CommandGroupContainerState | null;
}

export class CommandItemState {
	static create(opts: Omit<CommandItemStateOpts, "group">) {
		const group = CommandGroupContainerContext.getOr(null);
		return new CommandItemState({ ...opts, group }, CommandRootContext.get());
	}
	readonly opts: CommandItemStateOpts;
	readonly root: CommandRootState;
	readonly attachment: RefAttachment;
	readonly #group: CommandGroupContainerState | null = null;
	readonly #trueForceMount = $derived.by(() => {
		return this.opts.forceMount.current || this.#group?.opts.forceMount.current === true;
	});
	readonly shouldRender = $derived.by(() => {
		this.opts.ref.current;
		if (
			this.#trueForceMount ||
			this.root.opts.shouldFilter.current === false ||
			!this.root.commandState.search
		) {
			return true;
		}
		const currentScore = this.root.commandState.filtered.items.get(this.trueValue);
		if (currentScore === undefined) return false;
		return currentScore > 0;
	});

	readonly isSelected = $derived.by(
		() => this.root.opts.value.current === this.trueValue && this.trueValue !== ""
	);
	trueValue = $state("");

	constructor(opts: CommandItemStateOpts, root: CommandRootState) {
		this.opts = opts;
		this.root = root;
		this.#group = CommandGroupContainerContext.getOr(null);
		this.trueValue = opts.value.current;
		this.attachment = attachRef(this.opts.ref);

		watch(
			[
				() => this.trueValue,
				() => this.#group?.trueValue,
				() => this.opts.forceMount.current,
			],
			() => {
				if (this.opts.forceMount.current) return;
				return this.root.registerItem(this.trueValue, this.#group?.trueValue);
			}
		);

		watch([() => this.opts.value.current, () => this.opts.ref.current], () => {
			if (!this.opts.value.current && this.opts.ref.current?.textContent) {
				this.trueValue = this.opts.ref.current.textContent.trim();
			}

			this.root.registerValue(
				this.trueValue,
				opts.keywords.current.map((kw) => kw.trim())
			);
			this.opts.ref.current?.setAttribute(COMMAND_VALUE_ATTR, this.trueValue);
		});

		// bindings
		this.onclick = this.onclick.bind(this);
		this.onpointermove = this.onpointermove.bind(this);
	}

	#onSelect() {
		if (this.opts.disabled.current) return;
		this.#select();
		this.opts.onSelect?.current();
	}

	#select() {
		if (this.opts.disabled.current) return;
		this.root.setValue(this.trueValue, true);
	}

	onpointermove(_: BitsPointerEvent) {
		if (this.opts.disabled.current || this.root.opts.disablePointerSelection.current) return;
		this.#select();
	}

	onclick(_: BitsMouseEvent) {
		if (this.opts.disabled.current) return;
		this.#onSelect();
	}

	readonly props = $derived.by(
		() =>
			({
				id: this.opts.id.current,
				"aria-disabled": getAriaDisabled(this.opts.disabled.current),
				"aria-selected": getAriaSelected(this.isSelected),
				"data-disabled": getDataDisabled(this.opts.disabled.current),
				"data-selected": getDataSelected(this.isSelected),
				"data-value": this.trueValue,
				"data-group": this.#group?.trueValue,
				[commandAttrs.item]: "",
				role: "option",
				onpointermove: this.onpointermove,
				onclick: this.onclick,
				...this.attachment,
			}) as const
	);
}

interface CommandLoadingStateOpts
	extends WithRefOpts,
		ReadableBoxedValues<{
			progress: number;
		}> {}

export class CommandLoadingState {
	static create(opts: CommandLoadingStateOpts) {
		return new CommandLoadingState(opts);
	}

	readonly opts: CommandLoadingStateOpts;
	readonly attachment: RefAttachment;
	constructor(opts: CommandLoadingStateOpts) {
		this.opts = opts;
		this.attachment = attachRef(this.opts.ref);
	}

	readonly props = $derived.by(
		() =>
			({
				id: this.opts.id.current,
				role: "progressbar",
				"aria-valuenow": this.opts.progress.current,
				"aria-valuemin": 0,
				"aria-valuemax": 100,
				"aria-label": "Loading...",
				[commandAttrs.loading]: "",
				...this.attachment,
			}) as const
	);
}

interface CommandSeparatorStateOpts
	extends WithRefOpts,
		ReadableBoxedValues<{
			forceMount: boolean;
		}> {}

export class CommandSeparatorState {
	static create(opts: CommandSeparatorStateOpts) {
		return new CommandSeparatorState(opts, CommandRootContext.get());
	}

	readonly opts: CommandSeparatorStateOpts;
	readonly root: CommandRootState;
	readonly attachment: RefAttachment;
	readonly shouldRender = $derived.by(
		() => !this.root._commandState.search || this.opts.forceMount.current
	);

	constructor(opts: CommandSeparatorStateOpts, root: CommandRootState) {
		this.opts = opts;
		this.root = root;
		this.attachment = attachRef(this.opts.ref);
	}

	readonly props = $derived.by(
		() =>
			({
				id: this.opts.id.current,
				// role="separator" cannot belong to a role="listbox"
				"aria-hidden": "true",
				[commandAttrs.separator]: "",
				...this.attachment,
			}) as const
	);
}

interface CommandListStateOpts
	extends WithRefOpts,
		ReadableBoxedValues<{
			ariaLabel: string;
		}> {}

export class CommandListState {
	static create(opts: CommandListStateOpts) {
		return CommandListContext.set(new CommandListState(opts, CommandRootContext.get()));
	}

	readonly opts: CommandListStateOpts;
	readonly root: CommandRootState;
	readonly attachment: RefAttachment;

	constructor(opts: CommandListStateOpts, root: CommandRootState) {
		this.opts = opts;
		this.root = root;
		this.attachment = attachRef(this.opts.ref);
	}

	readonly props = $derived.by(
		() =>
			({
				id: this.opts.id.current,
				role: "listbox",
				"aria-label": this.opts.ariaLabel.current,
				[commandAttrs.list]: "",
				...this.attachment,
			}) as const
	);
}

interface CommandLabelStateOpts
	extends WithRefOpts,
		ReadableBoxedValues<{
			for?: string;
		}> {}

export class CommandLabelState {
	static create(opts: CommandLabelStateOpts) {
		return new CommandLabelState(opts, CommandRootContext.get());
	}
	readonly opts: CommandLabelStateOpts;
	readonly root: CommandRootState;
	readonly attachment: RefAttachment;
	constructor(opts: CommandLabelStateOpts, root: CommandRootState) {
		this.opts = opts;
		this.root = root;
		this.attachment = attachRef(this.opts.ref, (v) => (this.root.labelNode = v));
	}

	readonly props = $derived.by(
		() =>
			({
				id: this.opts.id.current,
				[commandAttrs["input-label"]]: "",
				for: this.opts.for?.current,
				style: srOnlyStyles,
				...this.attachment,
			}) as const
	);
}

interface CommandViewportStateOpts extends WithRefOpts {}

export class CommandViewportState {
	static create(opts: CommandViewportStateOpts) {
		return new CommandViewportState(opts, CommandListContext.get());
	}

	readonly opts: CommandViewportStateOpts;
	readonly list: CommandListState;
	readonly attachment: RefAttachment;
	constructor(opts: CommandViewportStateOpts, list: CommandListState) {
		this.opts = opts;
		this.list = list;
		this.attachment = attachRef(this.opts.ref, (v) => (this.list.root.viewportNode = v));
		watch(
			[() => this.opts.ref.current, () => this.list.opts.ref.current],
			([node, listNode]) => {
				if (node === null || listNode === null) return;
				let aF: number;

				const observer = new ResizeObserver(() => {
					aF = requestAnimationFrame(() => {
						const height = node.offsetHeight;
						listNode.style.setProperty(
							"--bits-command-list-height",
							`${height.toFixed(1)}px`
						);
					});
				});

				observer.observe(node);

				return () => {
					cancelAnimationFrame(aF);
					observer.unobserve(node);
				};
			}
		);
	}

	readonly props = $derived.by(
		() =>
			({
				id: this.opts.id.current,
				[commandAttrs.viewport]: "",
				...this.attachment,
			}) as const
	);
}
