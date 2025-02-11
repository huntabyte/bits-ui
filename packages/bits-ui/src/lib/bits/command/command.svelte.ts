import { afterSleep, afterTick, srOnlyStyles, useRefById } from "svelte-toolbelt";
import { Context, watch } from "runed";
import { findNextSibling, findPreviousSibling } from "./utils.js";
import type { CommandState } from "./types.js";
import type {
	BitsKeyboardEvent,
	BitsMouseEvent,
	BitsPointerEvent,
	WithRefProps,
} from "$lib/internal/types.js";
import type { ReadableBoxedValues, WritableBoxedValues } from "$lib/internal/box.svelte.js";
import { kbd } from "$lib/internal/kbd.js";
import {
	getAriaDisabled,
	getAriaExpanded,
	getAriaSelected,
	getDataDisabled,
	getDataSelected,
} from "$lib/internal/attrs.js";
import { getFirstNonCommentChild } from "$lib/internal/dom.js";
import { computeCommandScore } from "./index.js";

// attributes
const COMMAND_ROOT_ATTR = "data-command-root";
const COMMAND_LIST_ATTR = "data-command-list";
const COMMAND_INPUT_ATTR = "data-command-input";
const COMMAND_SEPARATOR_ATTR = "data-command-separator";
const COMMAND_LOADING_ATTR = "data-command-loading";
const COMMAND_EMPTY_ATTR = "data-command-empty";
const COMMAND_GROUP_ATTR = "data-command-group";
const COMMAND_GROUP_ITEMS_ATTR = "data-command-group-items";
const COMMAND_GROUP_HEADING_ATTR = "data-command-group-heading";
const COMMAND_ITEM_ATTR = "data-command-item";
const COMMAND_VIEWPORT_ATTR = "data-command-viewport";
const COMMAND_INPUT_LABEL_ATTR = "data-command-input-label";
const COMMAND_VALUE_ATTR = "data-value";

// selectors
const COMMAND_GROUP_SELECTOR = `[${COMMAND_GROUP_ATTR}]`;
const COMMAND_GROUP_ITEMS_SELECTOR = `[${COMMAND_GROUP_ITEMS_ATTR}]`;
const COMMAND_GROUP_HEADING_SELECTOR = `[${COMMAND_GROUP_HEADING_ATTR}]`;
const COMMAND_ITEM_SELECTOR = `[${COMMAND_ITEM_ATTR}]`;
const COMMAND_VALID_ITEM_SELECTOR = `${COMMAND_ITEM_SELECTOR}:not([aria-disabled="true"])`;

const CommandRootContext = new Context<CommandRootState>("Command.Root");
const CommandListContext = new Context<CommandListState>("Command.List");
const CommandGroupContainerContext = new Context<CommandGroupContainerState>("Command.Group");

type CommandRootStateProps = WithRefProps<
	ReadableBoxedValues<{
		filter: (value: string, search: string, keywords?: string[]) => number;
		shouldFilter: boolean;
		loop: boolean;
		vimBindings: boolean;
		disablePointerSelection: boolean;
		onStateChange?: (state: Readonly<CommandState>) => void;
	}> &
		WritableBoxedValues<{
			value: string;
		}>
>;

class CommandRootState {
	#updateScheduled = false;
	allItems = new Set<string>();
	allGroups = new Map<string, Set<string>>();
	allIds = new Map<string, { value: string; keywords?: string[] }>();
	// attempt to prevent the harsh delay when user is typing fast
	key = $state(0);
	viewportNode = $state<HTMLElement | null>(null);
	inputNode = $state<HTMLElement | null>(null);
	labelNode = $state<HTMLElement | null>(null);
	// published state that the components and other things can react to
	commandState = $state.raw<CommandState>(null!);
	// internal state that we mutate in batches and publish to the `state` at once
	_commandState = $state<CommandState>(null!);

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

	setState<K extends keyof CommandState>(key: K, value: CommandState[K], opts?: boolean) {
		if (Object.is(this._commandState[key], value)) return;

		this._commandState[key] = value;

		if (key === "search") {
			// Filter synchronously before emitting back to children
			this.#filterItems();
			this.#sort();
			this.#selectFirstItem();
		} else if (key === "value") {
			// opts is a boolean referring to whether it should NOT be scrolled into view
			if (!opts) {
				// Scroll the selected item into view
				this.#scrollSelectedIntoView();
			}
		}

		this.#scheduleUpdate();
	}

	constructor(readonly opts: CommandRootStateProps) {
		const defaultState = {
			/** Value of the search query */
			search: "",
			/** Currently selected item value */
			value: this.opts.value.current ?? "",
			filtered: {
				/** The count of all visible items. */
				count: 0,
				/** Map from visible item id to its search store. */
				items: new Map<string, number>(),
				/** Set of groups with at least one visible item. */
				groups: new Set<string>(),
			},
		};

		this._commandState = defaultState;
		this.commandState = defaultState;

		useRefById(opts);

		this.onkeydown = this.onkeydown.bind(this);
	}

	#score(value: string, keywords?: string[]) {
		const filter = this.opts.filter.current ?? computeCommandScore;
		const score = value ? filter(value, this._commandState.search, keywords) : 0;
		return score;
	}

	#sort() {
		if (!this._commandState.search || this.opts.shouldFilter.current === false) {
			// If no search and no selection yet, select first item
			if (!this.commandState.value) this.#selectFirstItem();
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

		const sorted = this.#getValidItems().sort((a, b) => {
			const valueA = a.getAttribute("id");
			const valueB = b.getAttribute("id");
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
				`${COMMAND_GROUP_SELECTOR}[${COMMAND_VALUE_ATTR}="${encodeURIComponent(group[0])}"]`
			);
			element?.parentElement?.appendChild(element);
		}
	}

	setValue(value: string, opts?: boolean) {
		if (value !== this.opts.value.current && value === "") {
			afterTick(() => {
				this.key++;
			});
		}
		this.setState("value", value, opts);
		this.opts.value.current = value;
	}

	#selectFirstItem() {
		afterTick(() => {
			const item = this.#getValidItems().find(
				(item) => item.getAttribute("aria-disabled") !== "true"
			);
			const value = item?.getAttribute(COMMAND_VALUE_ATTR);
			this.setValue(value || "");
		});
	}

	#filterItems() {
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

	#getValidItems() {
		const node = this.opts.ref.current;
		if (!node) return [];
		const validItems = Array.from(
			node.querySelectorAll<HTMLElement>(COMMAND_VALID_ITEM_SELECTOR)
		).filter((el): el is HTMLElement => !!el);
		return validItems;
	}

	#getSelectedItem() {
		const node = this.opts.ref.current;
		if (!node) return;
		const selectedNode = node.querySelector<HTMLElement>(
			`${COMMAND_VALID_ITEM_SELECTOR}[aria-selected="true"]`
		);
		if (!selectedNode) return;
		return selectedNode;
	}

	#scrollSelectedIntoView() {
		afterSleep(1, () => {
			const item = this.#getSelectedItem();
			if (!item) return;
			const grandparent = item.parentElement?.parentElement;
			if (!grandparent) return;
			const firstChildOfParent = getFirstNonCommentChild(grandparent) as HTMLElement | null;
			if (firstChildOfParent && firstChildOfParent.dataset?.value === item.dataset?.value) {
				item
					?.closest(COMMAND_GROUP_SELECTOR)
					?.querySelector(COMMAND_GROUP_HEADING_SELECTOR)
					?.scrollIntoView({ block: "nearest" });
				return;
			}
			item.scrollIntoView({ block: "nearest" });
		});
	}

	updateSelectedToIndex(index: number) {
		const items = this.#getValidItems();
		const item = items[index];
		if (item) {
			this.setValue(item.getAttribute(COMMAND_VALUE_ATTR) ?? "");
		}
	}

	updateSelectedByItem(change: 1 | -1) {
		const selected = this.#getSelectedItem();
		const items = this.#getValidItems();
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

	updateSelectedByGroup(change: 1 | -1) {
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

	get numValidItems() {
		return this.#getValidItems().length;
	}

	// keep id -> { value, keywords } mapping up to date
	registerValue(id: string, value: string, keywords?: string[]) {
		if (value === this.allIds.get(id)?.value) return;
		this.allIds.set(id, { value, keywords });
		this._commandState.filtered.items.set(id, this.#score(value, keywords));

		this.#sort();

		return () => {
			this.allIds.delete(id);
		};
	}

	registerItem(id: string, groupId: string | undefined) {
		this.allItems.add(id);

		// Track this item within the group
		if (groupId) {
			if (!this.allGroups.has(groupId)) {
				this.allGroups.set(groupId, new Set([id]));
			} else {
				this.allGroups.get(groupId)!.add(id);
			}
		}

		this.#filterItems();
		this.#sort();

		this.#scheduleUpdate();
		return () => {
			this.allIds.delete(id);
			this.allItems.delete(id);
			this.commandState.filtered.items.delete(id);
			const selectedItem = this.#getSelectedItem();

			this.#filterItems();

			// The item removed have been the selected one,
			// so selection should be moved to the first
			if (selectedItem?.getAttribute("id") === id) this.#selectFirstItem();

			this.#scheduleUpdate();
		};
	}

	registerGroup(id: string) {
		if (!this.allGroups.has(id)) {
			this.allGroups.set(id, new Set());
		}

		return () => {
			this.allIds.delete(id);
			this.allGroups.delete(id);
		};
	}

	#last() {
		return this.updateSelectedToIndex(this.#getValidItems().length - 1);
	}

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
		switch (e.key) {
			case kbd.n:
			case kbd.j: {
				// vim down
				if (this.opts.vimBindings.current && e.ctrlKey) {
					this.#next(e);
				}
				break;
			}
			case kbd.ARROW_DOWN:
				this.#next(e);
				break;
			case kbd.p:
			case kbd.k: {
				// vim up
				if (this.opts.vimBindings.current && e.ctrlKey) {
					this.#prev(e);
				}
				break;
			}
			case kbd.ARROW_UP:
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
				[COMMAND_ROOT_ATTR]: "",
				tabindex: -1,
				onkeydown: this.onkeydown,
			}) as const
	);
}

type CommandEmptyStateProps = WithRefProps &
	ReadableBoxedValues<{
		forceMount: boolean;
	}>;

class CommandEmptyState {
	#isInitialRender = true;

	shouldRender = $derived.by(
		() =>
			(this.root._commandState.filtered.count === 0 && this.#isInitialRender === false) ||
			this.opts.forceMount.current
	);

	constructor(
		readonly opts: CommandEmptyStateProps,
		readonly root: CommandRootState
	) {
		$effect(() => {
			this.#isInitialRender = false;
		});

		useRefById({
			...opts,
			deps: () => this.shouldRender,
		});
	}

	props = $derived.by(
		() =>
			({
				id: this.opts.id.current,
				role: "presentation",
				[COMMAND_EMPTY_ATTR]: "",
			}) as const
	);
}

type CommandGroupContainerStateProps = WithRefProps<
	ReadableBoxedValues<{
		value: string;
		forceMount: boolean;
	}>
>;

class CommandGroupContainerState {
	headingNode = $state<HTMLElement | null>(null);

	shouldRender = $derived.by(() => {
		if (this.opts.forceMount.current) return true;
		if (this.root.opts.shouldFilter.current === false) return true;
		if (!this.root.commandState.search) return true;
		return this.root.commandState.filtered.groups.has(this.opts.id.current);
	});
	trueValue = $state("");

	constructor(
		readonly opts: CommandGroupContainerStateProps,
		readonly root: CommandRootState
	) {
		this.trueValue = opts.value.current;

		useRefById({
			...opts,
			deps: () => this.shouldRender,
		});

		$effect(() => {
			return this.root.registerGroup(this.opts.id.current);
		});

		$effect(() => {
			if (this.opts.value.current) {
				this.trueValue = this.opts.value.current;
				return this.root.registerValue(this.opts.id.current, this.opts.value.current);
			} else if (this.headingNode && this.headingNode.textContent) {
				this.trueValue = this.headingNode.textContent.trim().toLowerCase();
				return this.root.registerValue(this.opts.id.current, this.trueValue);
			} else if (this.opts.ref.current?.textContent) {
				this.trueValue = this.opts.ref.current.textContent.trim().toLowerCase();
				return this.root.registerValue(this.opts.id.current, this.trueValue);
			}
		});
	}

	props = $derived.by(
		() =>
			({
				id: this.opts.id.current,
				role: "presentation",
				hidden: this.shouldRender ? undefined : true,
				"data-value": this.trueValue,
				[COMMAND_GROUP_ATTR]: "",
			}) as const
	);
}

type CommandGroupHeadingStateProps = WithRefProps;

class CommandGroupHeadingState {
	constructor(
		readonly opts: CommandGroupHeadingStateProps,
		readonly group: CommandGroupContainerState
	) {
		useRefById({
			...opts,
			onRefChange: (node) => {
				this.group.headingNode = node;
			},
		});
	}

	props = $derived.by(
		() =>
			({
				id: this.opts.id.current,
				[COMMAND_GROUP_HEADING_ATTR]: "",
			}) as const
	);
}

type CommandGroupItemsStateProps = WithRefProps;

class CommandGroupItemsState {
	constructor(
		readonly opts: CommandGroupItemsStateProps,
		readonly group: CommandGroupContainerState
	) {
		useRefById(opts);
	}

	props = $derived.by(
		() =>
			({
				id: this.opts.id.current,
				role: "group",
				[COMMAND_GROUP_ITEMS_ATTR]: "",
				"aria-labelledby": this.group.headingNode?.id ?? undefined,
			}) as const
	);
}

type CommandInputStateProps = WithRefProps<
	WritableBoxedValues<{
		value: string;
	}> &
		ReadableBoxedValues<{
			autofocus: boolean;
		}>
>;

class CommandInputState {
	#selectedItemId = $derived.by(() => {
		const item = this.root.viewportNode?.querySelector<HTMLElement>(
			`${COMMAND_ITEM_SELECTOR}[${COMMAND_VALUE_ATTR}="${encodeURIComponent(this.opts.value.current)}"]`
		);
		if (!item) return;
		return item?.getAttribute("id") ?? undefined;
	});

	constructor(
		readonly opts: CommandInputStateProps,
		readonly root: CommandRootState
	) {
		useRefById({
			...opts,
			onRefChange: (node) => {
				this.root.inputNode = node;
			},
		});

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

	props = $derived.by(
		() =>
			({
				id: this.opts.id.current,
				type: "text",
				[COMMAND_INPUT_ATTR]: "",
				autocomplete: "off",
				autocorrect: "off",
				spellcheck: false,
				"aria-autocomplete": "list",
				role: "combobox",
				"aria-expanded": getAriaExpanded(true),
				"aria-controls": this.root.viewportNode?.id ?? undefined,
				"aria-labelledby": this.root.labelNode?.id ?? undefined,
				"aria-activedescendant": this.#selectedItemId,
			}) as const
	);
}

type CommandItemStateProps = WithRefProps<
	ReadableBoxedValues<{
		value: string;
		disabled: boolean;
		onSelect: () => void;
		forceMount: boolean;
		keywords: string[];
	}> & {
		group: CommandGroupContainerState | null;
	}
>;

class CommandItemState {
	#group: CommandGroupContainerState | null = null;
	#trueForceMount = $derived.by(() => {
		return this.opts.forceMount.current || this.#group?.opts.forceMount.current === true;
	});
	trueValue = $state("");
	shouldRender = $derived.by(() => {
		if (
			this.#trueForceMount ||
			this.root.opts.shouldFilter.current === false ||
			!this.root.commandState.search
		) {
			return true;
		}
		const currentScore = this.root.commandState.filtered.items.get(this.opts.id.current);
		if (currentScore === undefined) return false;
		return currentScore > 0;
	});

	isSelected = $derived.by(
		() => this.root.opts.value.current === this.trueValue && this.trueValue !== ""
	);

	constructor(
		readonly opts: CommandItemStateProps,
		readonly root: CommandRootState
	) {
		this.#group = CommandGroupContainerContext.getOr(null);
		this.trueValue = opts.value.current;

		useRefById({
			...opts,
			deps: () => Boolean(this.root.commandState.search),
		});

		watch(
			[
				() => this.opts.id.current,
				() => this.#group?.opts.id.current,
				() => this.opts.forceMount.current,
			],
			() => {
				if (this.opts.forceMount.current) return;
				return this.root.registerItem(this.opts.id.current, this.#group?.opts.id.current);
			}
		);

		watch([() => this.opts.value.current, () => this.opts.ref.current], () => {
			if (!this.opts.ref.current) return;
			if (!this.opts.value.current && this.opts.ref.current.textContent) {
				this.trueValue = this.opts.ref.current.textContent.trim();
			}

			this.root.registerValue(
				this.opts.id.current,
				this.trueValue,
				opts.keywords.current.map((kw) => kw.trim())
			);
			this.opts.ref.current.setAttribute(COMMAND_VALUE_ATTR, this.trueValue);
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

	props = $derived.by(
		() =>
			({
				id: this.opts.id.current,
				"aria-disabled": getAriaDisabled(this.opts.disabled.current),
				"aria-selected": getAriaSelected(this.isSelected),
				"data-disabled": getDataDisabled(this.opts.disabled.current),
				"data-selected": getDataSelected(this.isSelected),
				"data-value": this.trueValue,
				[COMMAND_ITEM_ATTR]: "",
				role: "option",
				onpointermove: this.onpointermove,
				onclick: this.onclick,
			}) as const
	);
}

type CommandLoadingStateProps = WithRefProps<
	ReadableBoxedValues<{
		progress: number;
	}>
>;

class CommandLoadingState {
	constructor(readonly opts: CommandLoadingStateProps) {
		useRefById(opts);
	}

	props = $derived.by(
		() =>
			({
				id: this.opts.id.current,
				role: "progressbar",
				"aria-valuenow": this.opts.progress.current,
				"aria-valuemin": 0,
				"aria-valuemax": 100,
				"aria-label": "Loading...",
				[COMMAND_LOADING_ATTR]: "",
			}) as const
	);
}

type CommandSeparatorStateProps = WithRefProps &
	ReadableBoxedValues<{
		forceMount: boolean;
	}>;

class CommandSeparatorState {
	shouldRender = $derived.by(
		() => !this.root.commandState.search || this.opts.forceMount.current
	);

	constructor(
		readonly opts: CommandSeparatorStateProps,
		readonly root: CommandRootState
	) {
		useRefById({
			...opts,
			deps: () => this.shouldRender,
		});
	}

	props = $derived.by(
		() =>
			({
				id: this.opts.id.current,
				role: "separator",
				[COMMAND_SEPARATOR_ATTR]: "",
			}) as const
	);
}

type CommandListStateProps = WithRefProps &
	ReadableBoxedValues<{
		ariaLabel: string;
	}>;

class CommandListState {
	constructor(
		readonly opts: CommandListStateProps,
		readonly root: CommandRootState
	) {
		useRefById(opts);
	}

	props = $derived.by(
		() =>
			({
				id: this.opts.id.current,
				role: "listbox",
				"aria-label": this.opts.ariaLabel.current,
				[COMMAND_LIST_ATTR]: "",
			}) as const
	);
}

type CommandLabelStateProps = WithRefProps<ReadableBoxedValues<{ for?: string }>>;

class CommandLabelState {
	constructor(
		readonly opts: CommandLabelStateProps,
		readonly root: CommandRootState
	) {
		useRefById({
			...opts,
			onRefChange: (node) => {
				this.root.labelNode = node;
			},
		});
	}

	props = $derived.by(
		() =>
			({
				id: this.opts.id.current,
				[COMMAND_INPUT_LABEL_ATTR]: "",
				for: this.opts.for?.current,
				style: srOnlyStyles,
			}) as const
	);
}

type CommandViewportStateProps = WithRefProps;

class CommandViewportState {
	constructor(
		readonly opts: CommandViewportStateProps,
		readonly list: CommandListState
	) {
		useRefById({
			...opts,
			onRefChange: (node) => {
				this.list.root.viewportNode = node;
			},
		});

		$effect(() => {
			const node = this.opts.ref.current;
			const listNode = this.list.opts.ref.current;
			if (!node || !listNode) return;
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
		});
	}

	props = $derived.by(
		() =>
			({
				id: this.opts.id.current,
				[COMMAND_VIEWPORT_ATTR]: "",
			}) as const
	);
}

export function useCommandRoot(props: CommandRootStateProps) {
	return CommandRootContext.set(new CommandRootState(props));
}

export function useCommandEmpty(props: CommandEmptyStateProps) {
	return new CommandEmptyState(props, CommandRootContext.get());
}

export function useCommandItem(props: Omit<CommandItemStateProps, "group">) {
	const group = CommandGroupContainerContext.getOr(null);
	return new CommandItemState({ ...props, group }, CommandRootContext.get());
}

export function useCommandGroupContainer(props: CommandGroupContainerStateProps) {
	return CommandGroupContainerContext.set(
		new CommandGroupContainerState(props, CommandRootContext.get())
	);
}

export function useCommandGroupHeading(props: CommandGroupHeadingStateProps) {
	return new CommandGroupHeadingState(props, CommandGroupContainerContext.get());
}

export function useCommandGroupItems(props: CommandGroupItemsStateProps) {
	return new CommandGroupItemsState(props, CommandGroupContainerContext.get());
}

export function useCommandInput(props: CommandInputStateProps) {
	return new CommandInputState(props, CommandRootContext.get());
}

export function useCommandLoading(props: CommandLoadingStateProps) {
	return new CommandLoadingState(props);
}

export function useCommandSeparator(props: CommandSeparatorStateProps) {
	return new CommandSeparatorState(props, CommandRootContext.get());
}

export function useCommandList(props: CommandListStateProps) {
	return CommandListContext.set(new CommandListState(props, CommandRootContext.get()));
}

export function useCommandViewport(props: CommandViewportStateProps) {
	return new CommandViewportState(props, CommandListContext.get());
}

export function useCommandLabel(props: CommandLabelStateProps) {
	return new CommandLabelState(props, CommandRootContext.get());
}
