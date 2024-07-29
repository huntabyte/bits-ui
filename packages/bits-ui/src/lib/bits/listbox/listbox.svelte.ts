import { onMount } from "svelte";
import { SvelteSet } from "svelte/reactivity";
import { IsFocusWithin } from "runed";
import { focusFirst } from "$lib/internal/focus.js";
import {
	getAriaDisabled,
	getAriaSelected,
	getDataDisabled,
	getDataOrientation,
	getDataSelected,
} from "$lib/internal/attrs.js";
import type { Box, ReadableBoxedValues, WritableBoxedValues } from "$lib/internal/box.svelte.js";
import { createContext } from "$lib/internal/createContext.js";
import { isHTMLElement } from "$lib/internal/is.js";
import { kbd } from "$lib/internal/kbd.js";
import type { WithRefProps } from "$lib/internal/types.js";
import { useRefById } from "$lib/internal/useRefById.svelte.js";
import { type UseRovingFocusReturn, useRovingFocus } from "$lib/internal/useRovingFocus.svelte.js";
import { useTypeahead } from "$lib/internal/useTypeahead.svelte.js";
import type { Orientation } from "$lib/shared/index.js";
import { afterTick } from "$lib/internal/afterTick.js";
import { onDestroyEffect } from "$lib/internal/onDestroyEffect.svelte.js";

const LISTBOX_ITEM_ATTR = "data-listbox-item";
const LISTBOX_CONTENT_ATTR = "data-listbox-content";
const LISTOX_LABEL_ATTR = "data-listbox-label";
const LISTBOX_GROUP_ATTR = "data-listbox-group";
const LISTBOX_GROUP_LABEL_ATTR = "data-listbox-group-label";

export const SELECTION_KEYS = [kbd.ENTER, kbd.SPACE];
export const FIRST_KEYS = [kbd.ARROW_DOWN, kbd.PAGE_UP, kbd.HOME];
export const LAST_KEYS = [kbd.ARROW_UP, kbd.PAGE_DOWN, kbd.END];
export const FIRST_LAST_KEYS = [...FIRST_KEYS, ...LAST_KEYS];

type ListboxRootBaseStateProps = ReadableBoxedValues<{
	loop: boolean;
	orientation: Orientation;
	autoFocus: boolean | "first" | "last";
}>;

class ListboxRootBaseState {
	loop: ListboxRootBaseStateProps["loop"];
	orientation: ListboxRootBaseStateProps["orientation"];
	autoFocus: ListboxRootBaseStateProps["autoFocus"];
	labelNode = $state<HTMLElement | null>(null);
	contentNode = $state<HTMLElement | null>(null);
	valueOptions = new SvelteSet<string>();

	constructor(props: ListboxRootBaseStateProps) {
		this.loop = props.loop;
		this.orientation = props.orientation;
		this.autoFocus = props.autoFocus;
	}
}

type ListboxRootSingleStateProps = ListboxRootBaseStateProps &
	WritableBoxedValues<{
		value: string;
	}>;

export class ListboxRootSingleState extends ListboxRootBaseState {
	value: ListboxRootSingleStateProps["value"];
	isMulti = false as const;

	constructor(props: ListboxRootSingleStateProps) {
		super(props);
		this.value = props.value;
	}

	includesItem = (itemValue: string) => {
		return this.value.current === itemValue;
	};

	toggleItem = (itemValue: string) => {
		this.value.current = this.includesItem(itemValue) ? "" : itemValue;
	};

	createContent = (props: ListboxContentStateProps) => {
		return new ListboxContentState(props, this);
	};

	createGroup = (props: ListboxGroupStateProps) => {
		return new ListboxGroupState(props, this);
	};

	createLabel = (props: ListboxLabelStateProps) => {
		return new ListboxLabelState(props, this);
	};
}

type ListboxRootMultipleStateProps = ListboxRootBaseStateProps &
	WritableBoxedValues<{
		value: string[];
	}>;

export class ListboxRootMultipleState extends ListboxRootBaseState {
	value: ListboxRootMultipleStateProps["value"];
	isMulti = true as const;

	constructor(props: ListboxRootMultipleStateProps) {
		super(props);
		this.value = props.value;
	}

	includesItem = (itemValue: string) => {
		return this.value.current.includes(itemValue);
	};

	toggleItem = (itemValue: string) => {
		if (this.includesItem(itemValue)) {
			this.value.current = this.value.current.filter((v) => v !== itemValue);
		} else {
			this.value.current = [...this.value.current, itemValue];
		}
	};

	selectAll = () => {
		this.value.current = [...this.valueOptions];
	};

	createContent = (props: ListboxContentStateProps) => {
		return new ListboxContentState(props, this);
	};

	createGroup = (props: ListboxGroupStateProps) => {
		return new ListboxGroupState(props, this);
	};

	createLabel = (props: ListboxLabelStateProps) => {
		return new ListboxLabelState(props, this);
	};
}

type ListboxRootState = ListboxRootSingleState | ListboxRootMultipleState;

type ListboxContentStateProps = WithRefProps;

export class ListboxContentState {
	id: ListboxContentStateProps["id"];
	ref: ListboxContentStateProps["ref"];
	root: ListboxRootState;
	rovingFocusGroup: UseRovingFocusReturn;
	#handleTypeaheadSearch: ReturnType<typeof useTypeahead>["handleTypeaheadSearch"];
	focusedItemId = $state("");
	focusWithin = new IsFocusWithin(() => this.ref.current ?? undefined);
	#labelledBy = $derived.by(() => this.root.labelNode?.id ?? undefined);

	constructor(props: ListboxContentStateProps, root: ListboxRootState) {
		this.id = props.id;
		this.ref = props.ref;
		this.root = root;

		useRefById({
			id: this.id,
			ref: this.ref,
			onRefChange: (node) => {
				this.root.contentNode = node;
			},
		});

		this.rovingFocusGroup = useRovingFocus({
			rootNodeId: this.id,
			candidateSelector: "data-listbox-item",
			loop: this.root.loop,
			orientation: this.root.orientation,
			onCandidateFocus: (node) => {
				if (node) {
					this.focusedItemId = node.id;
				} else {
					this.focusedItemId = "";
				}
			},
		});

		this.#handleTypeaheadSearch = useTypeahead().handleTypeaheadSearch;

		onMount(() => {
			if (!this.focusedItemId) {
				const candidateNodes = this.getCandidateNodes();
				if (this.root.isMulti && this.root.value.current.length) {
					const firstValue = this.root.value.current[0];
					if (firstValue) {
						const candidateNode = candidateNodes.find(
							(node) => node.dataset.value === firstValue
						);
						if (candidateNode) {
							this.focusedItemId = candidateNode.id;
							return;
						}
					}
				} else if (!this.root.isMulti && this.root.value.current) {
					const candidateNode = candidateNodes.find(
						(node) => node.dataset.value === this.root.value.current
					);
					if (candidateNode) {
						this.focusedItemId = candidateNode.id;
						return;
					}
				}
				const firstCandidate = candidateNodes[0];
				if (firstCandidate) {
					this.focusedItemId = firstCandidate.id;
				}
			}
		});

		$effect(() => {
			if (!this.focusWithin.current) {
				this.focusedItemId = this.getNodeIdToFocus() ?? "";
			}
		});
	}

	/**
	 * Get the node to focus when the listbox loses focus and then
	 * regains focus. In the case of a single-select listbox, if an item is
	 * selected, we want to focus that item. If no item is selected, we want to
	 * focus the first item in the list.
	 *
	 * In the case of a multi-select listbox, if at least one or more items are
	 * selected, we want to focus the first selected item. If no items are selected,
	 * we want to focus the first item in the list.
	 */
	getNodeIdToFocus = () => {
		const candidateNodes = this.getCandidateNodes();
		if (this.root.isMulti && this.root.value.current.length) {
			const firstValue = this.root.value.current[0];
			if (firstValue !== undefined) {
				const candidateNode = candidateNodes.find(
					(node) => node.dataset.value === firstValue
				);
				if (candidateNode) {
					return candidateNode.id;
				}
			}
		} else if (!this.root.isMulti && this.root.value.current) {
			const candidateNode = candidateNodes.find(
				(node) => node.dataset.value === this.root.value.current
			);
			if (candidateNode) {
				return candidateNode.id;
			}
		}
		const firstCandidate = candidateNodes[0];
		return firstCandidate?.id;
	};

	isFocusedItem = (id: string) => {
		return this.focusedItemId === id;
	};

	getCandidateNodes = () => {
		const node = this.ref.current;
		if (!node) return [];
		const candidates = Array.from(node.querySelectorAll<HTMLElement>(`[${LISTBOX_ITEM_ATTR}]`));
		return candidates;
	};

	#onkeydown = (e: KeyboardEvent) => {
		if (e.defaultPrevented) return;
		const target = e.target;
		const currentTarget = e.currentTarget;
		if (!isHTMLElement(target) || !isHTMLElement(currentTarget)) return;

		const isKeydownInside = target.closest(`[${LISTBOX_CONTENT_ATTR}]`)?.id === this.id.current;

		const isModifierKey = e.ctrlKey || e.altKey || e.metaKey;
		const isCharacterKey = e.key.length === 1;

		const kbdFocusedEl = this.rovingFocusGroup.handleKeydown(target, e);
		if (kbdFocusedEl) return;

		// prevent space from being considered with typeahead
		if (e.code === "Space") return;

		const candidateNodes = this.getCandidateNodes();

		if (isKeydownInside) {
			// listboxes do not respect the tab key
			if (e.key === kbd.TAB) return;
			if (!isModifierKey && isCharacterKey) {
				this.#handleTypeaheadSearch(e.key, candidateNodes);
			}
		}

		if (e.key === "a" && (e.ctrlKey || e.metaKey) && this.root.isMulti) {
			this.root.selectAll();
			e.preventDefault();
			return;
		}

		if (e.key === kbd.ESCAPE) {
			if (this.root.isMulti) {
				this.root.value.current = [];
			} else {
				this.root.value.current = "";
			}
		}

		// focus first/last based on key pressed;
		if (target.id !== this.id.current) return;

		if (!FIRST_LAST_KEYS.includes(e.key)) return;
		e.preventDefault();

		if (LAST_KEYS.includes(e.key)) {
			candidateNodes.reverse();
		}
		focusFirst(candidateNodes);
	};

	props = $derived.by(
		() =>
			({
				id: this.id.current,
				"data-orientation": getDataOrientation(this.root.orientation.current),
				"aria-labelledby": this.#labelledBy,
				role: "listbox",
				[LISTBOX_CONTENT_ATTR]: "",
				onkeydown: this.#onkeydown,
			}) as const
	);

	createItem = (props: ListboxItemStateProps) => {
		return new ListboxItemState(props, this);
	};
}

type ListboxLabelStateProps = WithRefProps;

export class ListboxLabelState {
	id: ListboxLabelStateProps["id"];
	ref: ListboxLabelStateProps["ref"];
	root: ListboxRootState;

	constructor(props: ListboxLabelStateProps, root: ListboxRootState) {
		this.id = props.id;
		this.ref = props.ref;
		this.root = root;

		useRefById({
			id: this.id,
			ref: this.ref,
			onRefChange: (node) => {
				this.root.labelNode = node;
			},
		});
	}

	props = $derived.by(
		() =>
			({
				id: this.id.current,
				"data-orientation": getDataOrientation(this.root.orientation.current),
				[LISTOX_LABEL_ATTR]: "",
			}) as const
	);
}

type ListboxItemStateProps = WithRefProps<
	ReadableBoxedValues<{
		value: string;
		label: string;
		disabled: boolean;
	}>
>;

export class ListboxItemState {
	id: ListboxItemStateProps["id"];
	ref: ListboxItemStateProps["ref"];
	value: ListboxItemStateProps["value"];
	label: ListboxItemStateProps["label"];
	disabled: ListboxItemStateProps["disabled"];
	content: ListboxContentState;
	isSelected = $derived.by(() => this.content.root.includesItem(this.value.current));
	isTabIndexTarget = $derived.by(() => this.content.isFocusedItem(this.id.current));
	#isFocused = $state(false);

	constructor(props: ListboxItemStateProps, content: ListboxContentState) {
		this.id = props.id;
		this.ref = props.ref;
		this.value = props.value;
		this.label = props.label;
		this.disabled = props.disabled;
		this.content = content;

		$effect(() => {
			this.content.root.valueOptions.add(this.value.current);

			return () => {
				this.content.root.valueOptions.delete(this.value.current);
			};
		});

		onDestroyEffect(() => {
			this.content.root.valueOptions.delete(this.value.current);
		});

		useRefById({
			id: this.id,
			ref: this.ref,
		});
	}

	handleSelect = () => {
		if (this.disabled.current) return;
		this.content.root.toggleItem(this.value.current);
	};

	#onpointerup = () => {
		this.handleSelect();
	};

	#onkeydown = (e: KeyboardEvent) => {
		if (SELECTION_KEYS.includes(e.key)) {
			e.preventDefault();
			this.handleSelect();
		}
	};

	#onfocus = async (e: FocusEvent) => {
		afterTick(() => {
			if (e.defaultPrevented || this.disabled.current) return;
			this.#isFocused = true;
		});
	};

	#onblur = async (e: FocusEvent) => {
		afterTick(() => {
			if (e.defaultPrevented) return;
			this.#isFocused = false;
		});
	};

	#onpointermove = () => {
		if (this.#isFocused) return;
		this.#isFocused = true;
		this.ref.current?.focus();
	};

	props = $derived.by(
		() =>
			({
				id: this.id.current,
				role: "option",
				"data-value": this.value.current,
				"aria-disabled": getAriaDisabled(this.disabled.current),
				"data-disabled": getDataDisabled(this.disabled.current),
				"aria-selected": getAriaSelected(this.isSelected),
				"data-selected": getDataSelected(this.isSelected),
				"data-highlighted": this.#isFocused ? "" : undefined,
				tabindex: this.isTabIndexTarget ? 0 : -1,
				[LISTBOX_ITEM_ATTR]: "",
				//
				onpointerup: this.#onpointerup,
				onkeydown: this.#onkeydown,
				onfocus: this.#onfocus,
				onblur: this.#onblur,
				onpointermove: this.#onpointermove,
			}) as const
	);
}

type ListboxGroupStateProps = WithRefProps;

export class ListboxGroupState {
	id: ListboxGroupStateProps["id"];
	ref: ListboxGroupStateProps["ref"];
	root: ListboxRootState;
	groupLabelNode = $state<HTMLElement | null>(null);

	constructor(props: ListboxGroupStateProps, root: ListboxRootState) {
		this.id = props.id;
		this.ref = props.ref;
		this.root = root;

		useRefById({
			id: this.id,
			ref: this.ref,
		});
	}

	#ariaLabelledBy = $derived.by(() => {
		if (!this.groupLabelNode) return undefined;
		return this.groupLabelNode.id;
	});

	props = $derived.by(
		() =>
			({
				id: this.id.current,
				"data-orientation": getDataOrientation(this.root.orientation.current),
				role: "group",
				"aria-labelledby": this.#ariaLabelledBy,
				[LISTBOX_GROUP_ATTR]: "",
			}) as const
	);

	createGroupLabel(props: ListboxGroupLabelStateProps) {
		return new ListboxGroupLabelState(props, this);
	}
}

type ListboxGroupLabelStateProps = WithRefProps;

export class ListboxGroupLabelState {
	id: ListboxGroupLabelStateProps["id"];
	ref: ListboxGroupLabelStateProps["ref"];

	constructor(
		props: ListboxGroupLabelStateProps,
		readonly group: ListboxGroupState
	) {
		this.id = props.id;
		this.ref = props.ref;

		useRefById({
			id: this.id,
			ref: this.ref,
			onRefChange: (node) => {
				this.group.groupLabelNode = node;
			},
		});
	}

	props = $derived.by(
		() =>
			({
				id: this.id.current,
				"data-orientation": getDataOrientation(this.group.root.orientation.current),
				[LISTBOX_GROUP_LABEL_ATTR]: "",
			}) as const
	);
}

type InitListboxProps = {
	type: "single" | "multiple";
	value: Box<string> | Box<string[]>;
} & ReadableBoxedValues<{
	disabled: boolean;
	orientation: Orientation;
	loop: boolean;
	autoFocus: boolean | "first" | "last";
}>;

const [setListboxRootContext, getListboxRootContext] =
	createContext<ListboxRootState>("Listbox.Root");

const [setListboxContentContext, getListboxContentContext] =
	createContext<ListboxContentState>("Listbox.Content");

const [setListboxGroupContext, getListboxGroupContext] =
	createContext<ListboxGroupState>("Listbox.Group");

export function useListboxRoot(props: InitListboxProps) {
	const { type, ...rest } = props;

	const rootState =
		type === "single"
			? new ListboxRootSingleState(rest as ListboxRootSingleStateProps)
			: new ListboxRootMultipleState(rest as ListboxRootMultipleStateProps);
	return setListboxRootContext(rootState);
}

export function useListboxContent(props: ListboxContentStateProps) {
	return setListboxContentContext(getListboxRootContext().createContent(props));
}

export function useListboxItem(props: ListboxItemStateProps) {
	return getListboxContentContext().createItem(props);
}

export function useListboxLabel(props: ListboxLabelStateProps) {
	return getListboxRootContext().createLabel(props);
}

export function useListboxGroup(props: ListboxGroupStateProps) {
	return setListboxGroupContext(getListboxRootContext().createGroup(props));
}

export function useListboxGroupLabel(props: ListboxGroupLabelStateProps) {
	return getListboxGroupContext().createGroupLabel(props);
}
