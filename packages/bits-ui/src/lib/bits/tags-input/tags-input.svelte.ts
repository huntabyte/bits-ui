import { type ReadableBoxedValues, type WritableBoxedValues, box } from "svelte-toolbelt";
import type { TagsInputBlurBehavior, TagsInputPasteBehavior } from "./types.js";
import type { WithRefProps } from "$lib/internal/types.js";
import { useRefById } from "$lib/internal/useRefById.svelte.js";
import { createContext } from "$lib/internal/createContext.js";
import { getAriaHidden, getRequired } from "$lib/internal/attrs.js";
import { srOnlyStyles } from "$lib/internal/style.js";
import { kbd } from "$lib/internal/kbd.js";
import { useRovingFocus } from "$lib/internal/useRovingFocus.svelte.js";

const ROOT_ATTR = "data-tags-input-root";
const LIST_ATTR = "data-tags-input-list";
const INPUT_ATTR = "data-tags-input-input";
const CLEAR_ATTR = "data-tags-input-clear";
const TAG_ATTR = "data-tags-input-tag";
const TAG_TEXT_ATTR = "data-tags-input-tag-text";
const TAG_CONTENT_ATTR = "data-tags-input-tag-content";
const TAG_REMOVE_ATTR = "data-tags-input-tag-remove";
const TAG_EDIT_ATTR = "data-tags-input-tag-edit";

type TagsInputRootStateProps = WithRefProps &
	WritableBoxedValues<{
		value: string[];
	}> &
	ReadableBoxedValues<{
		delimiters: string[];
		blurBehavior: TagsInputBlurBehavior;
		editable: boolean;
		name: string;
		required: boolean;
		pasteBehavior: TagsInputPasteBehavior;
	}>;

// prettier-ignore
const HORIZONTAL_NAV_KEYS = [kbd.ARROW_LEFT, kbd.ARROW_RIGHT, kbd.HOME, kbd.END];
const VERTICAL_NAV_KEYS = [kbd.ARROW_UP, kbd.ARROW_DOWN];
const REMOVAL_KEYS = [kbd.BACKSPACE, kbd.DELETE];

class TagsInputRootState {
	#ref: TagsInputRootStateProps["ref"];
	#id: TagsInputRootStateProps["id"];
	value: TagsInputRootStateProps["value"];
	valueSnapshot = $derived.by(() => $state.snapshot(this.value.current));
	delimiters: TagsInputRootStateProps["delimiters"];
	blurBehavior: TagsInputRootStateProps["blurBehavior"];
	required: TagsInputRootStateProps["required"];
	editable: TagsInputRootStateProps["editable"];
	name: TagsInputRootStateProps["name"];
	pasteBehavior: TagsInputRootStateProps["pasteBehavior"];
	inputNode = $state<HTMLElement | null>(null);
	listRovingFocusGroup: ReturnType<typeof useRovingFocus> | null = null;
	delimitersRegex = $derived.by(() => new RegExp(this.delimiters.current.join("|"), "g"));

	constructor(props: TagsInputRootStateProps) {
		this.#ref = props.ref;
		this.#id = props.id;
		this.value = props.value;
		this.delimiters = props.delimiters;
		this.blurBehavior = props.blurBehavior;
		this.name = props.name;
		this.editable = props.editable;
		this.required = props.required;
		this.pasteBehavior = props.pasteBehavior;

		useRefById({
			id: this.#id,
			ref: this.#ref,
		});
	}

	includesValue = (value: string) => {
		return this.value.current.includes(value);
	};

	addValue = (value: string) => {
		if (value === "") return;
		this.value.current.push(value);
	};

	addValues = (values: string[]) => {
		const newValues = values.filter((value) => value !== "");
		this.value.current.push(...newValues);
	};

	removeValueByIndex = (index: number) => {
		this.value.current.splice(index, 1);
	};

	updateValueByIndex = (index: number, value: string) => {
		this.value.current[index] = value;
	};

	clearValue = () => {
		this.value.current = [];
	};

	recomputeTabIndex = () => {
		this.listRovingFocusGroup?.recomputeActiveTabNode();
	};

	props = $derived.by(
		() =>
			({
				id: this.#id.current,
				[ROOT_ATTR]: "",
			}) as const
	);

	createList(props: TagsInputListStateProps) {
		return new TagsInputListState(props, this);
	}

	createInput(props: TagsInputInputStateProps) {
		return new TagsInputInputState(props, this);
	}

	createClear(props: TagsInputClearStateProps) {
		return new TagsInputClearState(props, this);
	}
}

type TagsInputListStateProps = WithRefProps;

class TagsInputListState {
	#ref: TagsInputListStateProps["ref"];
	#id: TagsInputListStateProps["id"];
	root: TagsInputRootState;
	rovingFocusGroup: ReturnType<typeof useRovingFocus>;

	// TODO: We need to trigger this to turn into `polite` reactively on a timer when
	// an item is removed from/added to the list, so we'll need to hook into the add/remove events
	#ariaLive = $derived.by(() => "off");

	constructor(props: TagsInputListStateProps, root: TagsInputRootState) {
		this.#ref = props.ref;
		this.#id = props.id;
		this.root = root;

		this.rovingFocusGroup = useRovingFocus({
			rootNodeId: this.#id,
			candidateSelector: `[role=gridcell]:not([aria-hidden=true])`,
			loop: box(false),
			orientation: box("horizontal"),
		});
		this.root.listRovingFocusGroup = this.rovingFocusGroup;

		useRefById({
			id: this.#id,
			ref: this.#ref,
		});
	}

	gridWrapperProps = $derived.by(
		() =>
			({
				role: "grid",
				style: {
					display: "contents",
				},
			}) as const
	);

	props = $derived.by(
		() =>
			({
				id: this.#id.current,
				[LIST_ATTR]: "",
				role: "row",
				"aria-atomic": "false",
				"aria-relevant": "additions",
				"aria-live": this.#ariaLive,
			}) as const
	);

	createTag(props: TagsInputTagStateProps) {
		return new TagsInputTagState(props, this);
	}
}

type TagsInputTagStateProps = WithRefProps &
	ReadableBoxedValues<{
		index: number;
	}> &
	WritableBoxedValues<{
		value: string;
	}>;

class TagsInputTagState {
	#ref: TagsInputTagStateProps["ref"];
	#id: TagsInputTagStateProps["id"];
	value: TagsInputTagStateProps["value"];
	index: TagsInputTagStateProps["index"];
	root: TagsInputRootState;
	list: TagsInputListState;
	textNode = $state<HTMLElement | null>(null);
	editCell = $state<HTMLElement | null>(null);
	editInput = $state<HTMLInputElement | null>(null);
	isEditing = $state(false);
	#tabIndex = $state(0);

	constructor(props: TagsInputTagStateProps, list: TagsInputListState) {
		this.#ref = props.ref;
		this.#id = props.id;
		this.root = list.root;
		this.list = list;
		this.value = props.value;
		this.index = props.index;

		useRefById({
			id: this.#id,
			ref: this.#ref,
		});

		$effect(() => {
			// we want to track the value here so when we remove the actively focused
			// tag, we ensure the other ones get the correct tab index
			this.root.valueSnapshot;
			this.#ref.current;
			this.#tabIndex = this.list.rovingFocusGroup.getTabIndex(this.#ref.current);
		});
	}

	setValue = (value: string) => {
		this.value.current = value;
	};

	startEditing = () => {
		this.isEditing = true;
		this.editInput?.focus();
		this.editInput?.select();
	};

	stopEditing = () => {
		this.isEditing = false;
		this.#ref.current?.focus();
	};

	remove = () => {
		this.root.removeValueByIndex(this.index.current);
		this.root.recomputeTabIndex();
	};

	#onkeydown = (e: KeyboardEvent) => {
		if (e.target !== this.#ref.current) return;
		if (HORIZONTAL_NAV_KEYS.includes(e.key)) {
			e.preventDefault();
			this.list.rovingFocusGroup.handleKeydown(this.#ref.current, e);
		} else if (VERTICAL_NAV_KEYS.includes(e.key)) {
			e.preventDefault();
			this.list.rovingFocusGroup.handleKeydown(this.#ref.current, e, "vertical", true);
		} else if (REMOVAL_KEYS.includes(e.key)) {
			e.preventDefault();
			this.remove();
			this.list.rovingFocusGroup.navigateBackward(this.#ref.current, this.root.inputNode);
		} else if (e.key === kbd.ENTER) {
			e.preventDefault();
			this.startEditing();
		}
	};

	props = $derived.by(
		() =>
			({
				id: this.#id.current,
				role: "gridcell",
				"data-editing": this.isEditing ? "" : undefined,
				tabindex: this.#tabIndex,
				[TAG_ATTR]: "",
				onkeydown: this.#onkeydown,
			}) as const
	);

	createTagText(props: TagsInputTagTextStateProps) {
		return new TagsInputTagTextState(props, this);
	}

	createTagEdit(props: TagsInputTagEditStateProps) {
		return new TagsInputTagEditState(props, this);
	}

	createTagRemove(props: TagsInputTagRemoveStateProps) {
		return new TagsInputTagRemoveState(props, this);
	}

	createTagHiddenInput() {
		return new TagsInputTagHiddenInputState(this);
	}

	createContent(props: TagsInputTagContentStateProps) {
		return new TagsInputTagContentState(props, this);
	}
}

type TagsInputTagTextStateProps = WithRefProps;
class TagsInputTagTextState {
	#ref: TagsInputTagTextStateProps["ref"];
	#id: TagsInputTagTextStateProps["id"];
	#tag: TagsInputTagState;
	#list: TagsInputListState;
	root: TagsInputRootState;

	constructor(props: TagsInputTagTextStateProps, tag: TagsInputTagState) {
		this.#ref = props.ref;
		this.#id = props.id;
		this.#tag = tag;
		this.root = tag.root;
		this.#list = tag.list;

		useRefById({
			id: this.#id,
			ref: this.#ref,
			onRefChange: (node) => {
				this.#tag.textNode = node;
			},
		});
	}

	#onkeydown = (e: KeyboardEvent) => {};

	props = $derived.by(
		() =>
			({
				id: this.#id.current,
				[TAG_TEXT_ATTR]: "",
				tabindex: -1,
				onkeydown: this.#onkeydown,
			}) as const
	);
}

type TagsInputTagEditStateProps = WithRefProps;

class TagsInputTagEditState {
	#ref: TagsInputTagEditStateProps["ref"];
	#id: TagsInputTagEditStateProps["id"];
	tag: TagsInputTagState;

	constructor(props: TagsInputTagEditStateProps, tag: TagsInputTagState) {
		this.#ref = props.ref;
		this.#id = props.id;
		this.tag = tag;

		useRefById({
			id: this.#id,
			ref: this.#ref,
			onRefChange: (node) => {
				if (node instanceof HTMLInputElement) this.tag.editInput = node;
			},
		});
	}

	#style = $derived.by(() => {
		if (this.tag.isEditing) return undefined;
		return srOnlyStyles;
	});

	#onkeydown = (e: KeyboardEvent & { currentTarget: HTMLInputElement }) => {
		if (e.key === kbd.ESCAPE || e.key === kbd.TAB) {
			e.preventDefault();
			this.tag.stopEditing();
			e.currentTarget.value = this.tag.value.current;
		} else if (e.key === kbd.ENTER) {
			e.preventDefault();
			const value = e.currentTarget.value;
			if (value === "") {
				this.tag.stopEditing();
				this.tag.remove();
			} else {
				this.tag.setValue(value);
				this.tag.stopEditing();
			}
		}
	};

	props = $derived.by(
		() =>
			({
				id: this.#id.current,
				[TAG_EDIT_ATTR]: "",
				tabindex: -1,
				"data-editing": this.tag.isEditing ? "" : undefined,
				value: this.tag.value.current,
				style: this.#style,
				onkeydown: this.#onkeydown,
			}) as const
	);
}

type TagsInputTagRemoveStateProps = WithRefProps;

class TagsInputTagRemoveState {
	#ref: TagsInputTagRemoveStateProps["ref"];
	#id: TagsInputTagRemoveStateProps["id"];
	#tag: TagsInputTagState;
	root: TagsInputRootState;
	#ariaLabelledBy = $derived.by(() => {
		if (this.#tag.textNode && this.#tag.textNode.id) {
			return `${this.#id.current} ${this.#tag.textNode.id}`;
		}
		return this.#id.current;
	});

	constructor(props: TagsInputTagRemoveStateProps, tag: TagsInputTagState) {
		this.#ref = props.ref;
		this.#id = props.id;
		this.#tag = tag;
		this.root = tag.root;

		useRefById({
			id: this.#id,
			ref: this.#ref,
		});
	}

	#onclick = () => {
		this.#tag.remove();
	};

	props = $derived.by(
		() =>
			({
				id: this.#id.current,
				[TAG_REMOVE_ATTR]: "",
				role: "button",
				"aria-label": "Remove",
				"aria-labelledby": this.#ariaLabelledBy,
				"data-editing": this.#tag.isEditing ? "" : undefined,
				tabindex: -1,
				onclick: this.#onclick,
			}) as const
	);
}

type TagsInputInputStateProps = WithRefProps & WritableBoxedValues<{ value: string }>;

class TagsInputInputState {
	#ref: TagsInputInputStateProps["ref"];
	#id: TagsInputInputStateProps["id"];
	#root: TagsInputRootState;
	value: TagsInputInputStateProps["value"];

	constructor(props: TagsInputInputStateProps, root: TagsInputRootState) {
		this.#ref = props.ref;
		this.#id = props.id;
		this.#root = root;
		this.value = props.value;

		useRefById({
			id: this.#id,
			ref: this.#ref,
			onRefChange: (node) => {
				this.#root.inputNode = node;
			},
		});
	}

	#resetValue = () => {
		this.value.current = "";
	};

	#onkeydown = (e: KeyboardEvent & { currentTarget: HTMLInputElement }) => {
		if (e.key === kbd.ENTER) {
			this.#root.addValue(e.currentTarget.value);
			this.#resetValue();
		} else if (this.#root.delimiters.current.includes(e.key) && e.currentTarget.value) {
			e.preventDefault();
			this.#root.addValue(e.currentTarget.value);
			this.#resetValue();
		} else if (e.key === kbd.BACKSPACE && e.currentTarget.value === "") {
			e.preventDefault();
			this.#root.listRovingFocusGroup?.focusLastCandidate();
		}
	};

	#onpaste = (e: ClipboardEvent & { currentTarget: HTMLInputElement }) => {
		if (!e.clipboardData || this.#root.pasteBehavior.current === "none") return;
		const rawClipboardData = e.clipboardData.getData("text/plain");
		// we're splitting this by the delimiters
		const pastedValues = rawClipboardData.split(this.#root.delimitersRegex);
		this.#root.addValues(pastedValues);
		e.preventDefault();
	};

	#onblur = (e: KeyboardEvent & { currentTarget: HTMLInputElement }) => {
		const blurBehavior = this.#root.blurBehavior.current;
		if (blurBehavior === "add" && e.currentTarget.value !== "") {
			this.#root.addValue(e.currentTarget.value);
			this.#resetValue();
		} else if (blurBehavior === "clear") {
			this.#resetValue();
		}
	};

	props = $derived.by(
		() =>
			({
				id: this.#id.current,
				[INPUT_ATTR]: "",
				onkeydown: this.#onkeydown,
				onblur: this.#onblur,
				onpaste: this.#onpaste,
			}) as const
	);
}

type TagsInputClearStateProps = WithRefProps;

class TagsInputClearState {
	#ref: TagsInputClearStateProps["ref"];
	#id: TagsInputClearStateProps["id"];
	#root: TagsInputRootState;

	constructor(props: TagsInputClearStateProps, root: TagsInputRootState) {
		this.#ref = props.ref;
		this.#id = props.id;
		this.#root = root;

		useRefById({
			id: this.#id,
			ref: this.#ref,
		});
	}

	#onclick = () => {
		this.#root.clearValue();
	};

	props = $derived.by(
		() =>
			({
				id: this.#id.current,
				[CLEAR_ATTR]: "",
				role: "button",
				"aria-label": "Clear",
				onclick: this.#onclick,
			}) as const
	);
}

type TagsInputTagContentStateProps = WithRefProps;

class TagsInputTagContentState {
	#ref: TagsInputTagContentStateProps["ref"];
	#id: TagsInputTagContentStateProps["id"];
	tag: TagsInputTagState;
	root: TagsInputRootState;

	constructor(props: TagsInputTagContentStateProps, tag: TagsInputTagState) {
		this.#ref = props.ref;
		this.#id = props.id;
		this.tag = tag;
		this.root = tag.root;

		useRefById({
			id: this.#id,
			ref: this.#ref,
		});
	}

	#style = $derived.by(() => {
		if (this.tag.isEditing) return srOnlyStyles;
		return undefined;
	});

	props = $derived.by(() => ({
		id: this.#id.current,
		[TAG_CONTENT_ATTR]: "",
		style: this.#style,
	}));
}

class TagsInputTagHiddenInputState {
	#tag: TagsInputTagState;
	#root: TagsInputRootState;
	shouldRender = $derived.by(
		() => this.#root.name.current !== "" && this.#tag.value.current !== ""
	);

	constructor(tag: TagsInputTagState) {
		this.#tag = tag;
		this.#root = tag.root;
	}

	props = $derived.by(
		() =>
			({
				type: "text",
				name: this.#root.name.current,
				value: this.#tag.value.current,
				style: srOnlyStyles,
				required: getRequired(this.#root.required.current),
				"aria-hidden": getAriaHidden(true),
			}) as const
	);
}

const [setTagsInputRootContext, getTagsInputRootContext] =
	createContext<TagsInputRootState>("TagsInput.Root");

const [setTagsInputListContext, getTagsInputListContext] =
	createContext<TagsInputListState>("TagsInput.List");

const [setTagsInputTagContext, getTagsInputTagContext] =
	createContext<TagsInputTagState>("TagsInput.Tag");

export function useTagsInputRoot(props: TagsInputRootStateProps) {
	return setTagsInputRootContext(new TagsInputRootState(props));
}

export function useTagsInputList(props: TagsInputListStateProps) {
	return setTagsInputListContext(getTagsInputRootContext().createList(props));
}

export function useTagsInputTag(props: TagsInputTagStateProps) {
	return setTagsInputTagContext(getTagsInputListContext().createTag(props));
}

export function useTagsInputTagText(props: TagsInputTagTextStateProps) {
	return getTagsInputTagContext().createTagText(props);
}

export function useTagsInputTagEdit(props: TagsInputTagEditStateProps) {
	return getTagsInputTagContext().createTagEdit(props);
}

export function useTagsInputTagRemove(props: TagsInputTagRemoveStateProps) {
	return getTagsInputTagContext().createTagRemove(props);
}

export function useTagsInputTagHiddenInput() {
	return getTagsInputTagContext().createTagHiddenInput();
}

export function useTagsInputInput(props: TagsInputInputStateProps) {
	return getTagsInputRootContext().createInput(props);
}

export function useTagsInputClear(props: TagsInputClearStateProps) {
	return getTagsInputRootContext().createClear(props);
}

export function useTagsInputContent(props: TagsInputTagContentStateProps) {
	return getTagsInputTagContext().createContent(props);
}
