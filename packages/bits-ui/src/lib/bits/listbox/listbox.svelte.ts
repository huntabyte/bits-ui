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
import { useRovingFocus, type UseRovingFocusReturn } from "$lib/internal/useRovingFocus.svelte.js";
import { useTypeahead } from "$lib/internal/useTypeahead.svelte.js";
import type { Orientation } from "$lib/shared/index.js";
import { onMount } from "svelte";
import { focusFirst } from "../utilities/focus-scope/utils.js";
import { afterTick } from "$lib/internal/afterTick.js";

const LISTBOX_ITEM_ATTR = "data-listbox-item";
const LISTBOX_CONTENT_ATTR = "data-listbox-content";
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
	#value: ListboxRootSingleStateProps["value"];
	isMulti = false as const;

	constructor(props: ListboxRootSingleStateProps) {
		super(props);
		this.#value = props.value;
	}

	includesItem = (itemValue: string) => {
		return this.#value.value === itemValue;
	};

	toggleItem = (itemValue: string) => {
		this.#value.value = this.includesItem(itemValue) ? "" : itemValue;
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
	#value: ListboxRootMultipleStateProps["value"];
	isMulti = true as const;

	constructor(props: ListboxRootMultipleStateProps) {
		super(props);
		this.#value = props.value;
	}

	includesItem = (itemValue: string) => {
		return this.#value.value.includes(itemValue);
	};

	toggleItem = (itemValue: string) => {
		if (this.includesItem(itemValue)) {
			this.#value.value = this.#value.value.filter((v) => v !== itemValue);
		} else {
			this.#value.value = [...this.#value.value, itemValue];
		}
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
				const firstCandidate = this.getCandidateNodes()[0];
				if (firstCandidate) [(this.focusedItemId = firstCandidate.id)];
			}
		});
	}

	isFocusedItem = (id: string) => {
		return this.focusedItemId === id;
	};

	getCandidateNodes = () => {
		const node = this.ref.value;
		if (!node) return [];
		const candidates = Array.from(node.querySelectorAll<HTMLElement>(`[${LISTBOX_ITEM_ATTR}]`));
		return candidates;
	};

	#onkeydown = (e: KeyboardEvent) => {
		if (e.defaultPrevented) return;
		const target = e.target;
		const currentTarget = e.currentTarget;
		if (!isHTMLElement(target) || !isHTMLElement(currentTarget)) return;

		const isKeydownInside = target.closest(`[${LISTBOX_CONTENT_ATTR}]`)?.id === this.id.value;

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

		// focus first/last based on key pressed;
		if (target.id !== this.id.value) return;

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
				id: this.id.value,
				"data-orientation": getDataOrientation(this.root.orientation.value),
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
				id: this.id.value,
				"data-orientation": getDataOrientation(this.root.orientation.value),
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
	isSelected = $derived.by(() => this.content.root.includesItem(this.value.value));
	isTabIndexTarget = $derived.by(() => this.content.isFocusedItem(this.id.value));
	#isFocused = $state(false);

	constructor(props: ListboxItemStateProps, content: ListboxContentState) {
		this.id = props.id;
		this.ref = props.ref;
		this.value = props.value;
		this.label = props.label;
		this.disabled = props.disabled;
		this.content = content;

		useRefById({
			id: this.id,
			ref: this.ref,
		});
	}

	handleSelect = () => {
		if (this.disabled.value) return;
		this.content.root.toggleItem(this.value.value);
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
			if (e.defaultPrevented || this.disabled.value) return;
			this.#isFocused = true;
		});
	};

	#onblur = async (e: FocusEvent) => {
		afterTick(() => {
			if (e.defaultPrevented) return;
			this.#isFocused = false;
		});
	};

	props = $derived.by(
		() =>
			({
				id: this.id.value,
				role: "option",
				"data-value": this.value,
				"aria-disabled": getAriaDisabled(this.disabled.value),
				"data-disabled": getDataDisabled(this.disabled.value),
				"aria-selected": getAriaSelected(this.isSelected),
				"data-selected": getDataSelected(this.isSelected),
				"data-highlighted": this.#isFocused ? "" : undefined,
				tabindex: this.isTabIndexTarget ? 0 : -1,
				[LISTBOX_ITEM_ATTR]: "",
				onpointerup: this.#onpointerup,
				onkeydown: this.#onkeydown,
				onfocus: this.#onfocus,
				onblur: this.#onblur,
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
				id: this.id.value,
				"data-orientation": getDataOrientation(this.root.orientation.value),
				role: "group",
				"aria-labelledby": this.#ariaLabelledBy,
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
				id: this.id.value,
				"data-orientation": getDataOrientation(this.group.root.orientation.value),
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
