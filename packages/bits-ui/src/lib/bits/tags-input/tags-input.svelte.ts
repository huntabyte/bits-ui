import {
	type ReadableBoxedValues,
	type WritableBoxedValues,
	afterSleep,
	afterTick,
	box,
	srOnlyStyles,
	useRefById,
} from "svelte-toolbelt";
import type {
	ClipboardEventHandler,
	FocusEventHandler,
	HTMLButtonAttributes,
	KeyboardEventHandler,
	MouseEventHandler,
} from "svelte/elements";
import { IsFocusWithin } from "runed";
import type { TagsInputBlurBehavior, TagsInputPasteBehavior } from "./types.js";
import type { WithRefProps } from "$lib/internal/types.js";
import { createContext } from "$lib/internal/create-context.js";
import { getAriaHidden, getDataInvalid, getRequired } from "$lib/internal/attrs.js";
import { kbd } from "$lib/internal/kbd.js";
import { RovingFocusGroup } from "$lib/internal/use-roving-focus.svelte.js";
import { isOrContainsTarget } from "$lib/internal/elements.js";

const ROOT_ATTR = "data-tags-input-root";
const LIST_ATTR = "data-tags-input-list";
const INPUT_ATTR = "data-tags-input-input";
const CLEAR_ATTR = "data-tags-input-clear";
const TAG_ATTR = "data-tags-input-tag";
const TAG_TEXT_ATTR = "data-tags-input-tag-text";
const TAG_CONTENT_ATTR = "data-tags-input-tag-content";
const TAG_REMOVE_ATTR = "data-tags-input-tag-remove";
const TAG_EDIT_INPUT_ATTR = "data-tags-input-tag-edit-input";
const TAG_EDIT_ATTR = "data-tags-input-tag-edit";

type TagsInputRootStateProps = WithRefProps &
	WritableBoxedValues<{
		value: string[];
	}> &
	ReadableBoxedValues<{
		delimiters: string[];
		name: string;
		required: boolean;
		validate: (value: string) => boolean;
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
	required: TagsInputRootStateProps["required"];
	name: TagsInputRootStateProps["name"];
	validate: TagsInputRootStateProps["validate"];
	inputNode = $state<HTMLElement | null>(null);
	listRovingFocusGroup: RovingFocusGroup | null = null;
	delimitersRegex = $derived.by(() => new RegExp(this.delimiters.current.join("|"), "g"));
	editDescriptionNode = $state<HTMLElement | null>(null);
	message = $state<string | null>(null);
	messageTimeout: number | null = null;
	/**
	 * Whether the tags input is invalid or not. It enters an invalid state when the
	 * `validate` prop returns `false` for any of the tags.
	 */
	isInvalid = $state(false);
	hasValue = $derived.by(() => this.value.current.length > 0);

	constructor(props: TagsInputRootStateProps) {
		this.#ref = props.ref;
		this.#id = props.id;
		this.value = props.value;
		this.delimiters = props.delimiters;
		this.name = props.name;
		this.required = props.required;
		this.validate = props.validate;

		useRefById({
			id: this.#id,
			ref: this.#ref,
		});
	}

	includesValue = (value: string) => {
		return this.value.current.includes(value);
	};

	addValue = (value: string): boolean => {
		if (value === "") return true;
		const isValid = this.validate.current?.(value) ?? true;
		if (!isValid) {
			this.isInvalid = true;
			return false;
		}
		this.isInvalid = false;
		this.value.current.push(value);
		this.announceAdd(value);
		return true;
	};

	addValues = (values: string[]) => {
		const newValues = values.filter((value) => value !== "");
		const anyInvalid = newValues.some((value) => this.validate.current?.(value) === false);
		if (anyInvalid) {
			this.isInvalid = true;
			return;
		}
		this.isInvalid = false;
		this.value.current.push(...newValues);
		this.announceAddMultiple(newValues);
	};

	removeValueByIndex = (index: number, value: string) => {
		this.value.current.splice(index, 1);
		this.announceRemove(value);
	};

	updateValueByIndex = (index: number, value: string) => {
		const curr = this.value.current[index];
		this.value.current[index] = value;
		if (curr) {
			this.announceEdit(curr, value);
		}
	};

	clearValue = () => {
		this.isInvalid = false;
		this.value.current = [];
	};

	recomputeTabIndex = () => {
		this.listRovingFocusGroup?.recomputeActiveTabNode();
	};

	#announce = (message: string) => {
		if (this.messageTimeout) {
			window.clearTimeout(this.messageTimeout);
		}
		this.message = message;
		this.messageTimeout = window.setTimeout(() => {
			this.message = null;
		});
	};

	announceEdit = (from: string, to: string) => {
		this.#announce(`${from} has been change to ${to}`);
	};

	announceRemove = (value: string) => {
		this.#announce(`${value} has been removed`);
	};

	announceAdd = (value: string) => {
		this.#announce(`${value} has been added`);
	};

	announceAddMultiple = (values: string[]) => {
		this.#announce(`${values.join(", ")} has been added`);
	};

	props = $derived.by(
		() =>
			({
				id: this.#id.current,
				[ROOT_ATTR]: "",
				"data-invalid": getDataInvalid(this.isInvalid),
			}) as const
	);
}

type TagsInputListStateProps = WithRefProps;

class TagsInputListState {
	#ref: TagsInputListStateProps["ref"];
	#id: TagsInputListStateProps["id"];
	root: TagsInputRootState;
	rovingFocusGroup: RovingFocusGroup;

	constructor(props: TagsInputListStateProps, root: TagsInputRootState) {
		this.#ref = props.ref;
		this.#id = props.id;
		this.root = root;

		this.rovingFocusGroup = new RovingFocusGroup({
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
				role: this.root.hasValue ? "grid" : undefined,
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
				role: this.root.hasValue ? "row" : undefined,
				"data-invalid": getDataInvalid(this.root.isInvalid),
			}) as const
	);
}

type TagsInputTagStateProps = WithRefProps &
	ReadableBoxedValues<{
		index: number;
		removable: boolean;
		editMode: "input" | "contenteditable" | "none";
	}> &
	WritableBoxedValues<{
		value: string;
	}>;

class TagsInputTagState {
	#ref: TagsInputTagStateProps["ref"];
	#id: TagsInputTagStateProps["id"];
	value: TagsInputTagStateProps["value"];
	index: TagsInputTagStateProps["index"];
	removable: TagsInputTagStateProps["removable"];
	editMode: TagsInputTagStateProps["editMode"];
	root: TagsInputRootState;
	list: TagsInputListState;
	textNode = $state<HTMLElement | null>(null);
	removeNode = $state<HTMLElement | null>(null);
	editCell = $state<HTMLElement | null>(null);
	editInput = $state<HTMLInputElement | null>(null);
	isEditable = $derived.by(() => this.editMode.current !== "none");
	isEditing = $state(false);
	#tabIndex = $state(0);
	#focusWithin: IsFocusWithin;
	isFocusWithin = $derived.by(() => this.#focusWithin.current);

	constructor(props: TagsInputTagStateProps, list: TagsInputListState) {
		this.#ref = props.ref;
		this.#id = props.id;
		this.root = list.root;
		this.list = list;
		this.value = props.value;
		this.index = props.index;
		this.removable = props.removable;
		this.editMode = props.editMode;

		useRefById({
			id: this.#id,
			ref: this.#ref,
			deps: () => this.index.current,
		});

		this.#focusWithin = new IsFocusWithin(() => this.#ref.current ?? undefined);

		$effect(() => {
			// we want to track the value here so when we remove the actively focused
			// tag, we ensure the other ones get the correct tab index
			this.root.valueSnapshot;
			this.#ref.current;
			this.#tabIndex = this.list.rovingFocusGroup.getTabIndex(this.#ref.current);
		});
	}

	setValue = (value: string) => {
		this.root.updateValueByIndex(this.index.current, value);
	};

	startEditing = () => {
		if (this.isEditable === false) return;
		this.isEditing = true;

		if (this.editMode.current === "input") {
			this.editInput?.focus();
			this.editInput?.select();
		} else if (this.editMode.current === "contenteditable") {
			this.textNode?.focus();
		}
	};

	stopEditing = (focusTag = true) => {
		this.isEditing = false;

		if (focusTag) {
			this.#ref.current?.focus();
		}
	};

	remove = () => {
		if (this.removable.current === false) return;
		this.root.removeValueByIndex(this.index.current, this.value.current);
		this.root.recomputeTabIndex();
	};

	#onkeydown: KeyboardEventHandler<HTMLElement> = (e) => {
		if (e.target !== this.#ref.current) return;
		if (HORIZONTAL_NAV_KEYS.includes(e.key)) {
			e.preventDefault();
			this.list.rovingFocusGroup.handleKeydown({ node: this.#ref.current, event: e });
		} else if (VERTICAL_NAV_KEYS.includes(e.key)) {
			e.preventDefault();
			this.list.rovingFocusGroup.handleKeydown({
				node: this.#ref.current,
				event: e,
				orientation: "vertical",
				invert: true,
			});
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
				"data-editable": this.isEditable ? "" : undefined,
				"data-removable": this.removable.current ? "" : undefined,
				"data-invalid": getDataInvalid(this.root.isInvalid),
				tabindex: this.#tabIndex,
				[TAG_ATTR]: "",
				onkeydown: this.#onkeydown,
			}) as const
	);
}

type TagsInputTagTextStateProps = WithRefProps;

class TagsInputTagTextState {
	#ref: TagsInputTagTextStateProps["ref"];
	#id: TagsInputTagTextStateProps["id"];
	#tag: TagsInputTagState;
	root: TagsInputRootState;

	constructor(props: TagsInputTagTextStateProps, tag: TagsInputTagState) {
		this.#ref = props.ref;
		this.#id = props.id;
		this.#tag = tag;
		this.root = tag.root;

		useRefById({
			id: this.#id,
			ref: this.#ref,
			onRefChange: (node) => {
				this.#tag.textNode = node;
			},
		});
	}

	#onkeydown: KeyboardEventHandler<HTMLElement> = (e) => {
		if (this.#tag.editMode.current !== "contenteditable" || !this.#tag.isEditing) {
			return;
		}
		if (e.key === kbd.ESCAPE) {
			this.#tag.stopEditing();
			e.currentTarget.innerText = this.#tag.value.current;
		} else if (e.key === kbd.TAB) {
			this.#tag.stopEditing(false);
			e.currentTarget.innerText = this.#tag.value.current;
		} else if (e.key === kbd.ENTER) {
			e.preventDefault();
			const value = e.currentTarget.innerText;
			if (value === "") {
				this.#tag.stopEditing();
				this.#tag.remove();
			} else {
				this.#tag.setValue(value);
				this.#tag.stopEditing();
			}
		}
	};

	#onblur: FocusEventHandler<HTMLElement> = () => {
		if (this.#tag.editMode.current !== "contenteditable") return;
		if (this.#tag.isEditing) {
			this.#tag.stopEditing(false);
		}
	};

	#onfocus: FocusEventHandler<HTMLElement> = (e) => {
		if (this.#tag.editMode.current !== "contenteditable" || !this.#tag.isEditing) return;
		afterSleep(0, () => {
			if (!this.#ref.current) return;
			const selection = window.getSelection();
			const range = document.createRange();

			range.selectNodeContents(this.#ref.current);
			selection?.removeAllRanges();
			selection?.addRange(range);
		});
	};

	props = $derived.by(
		() =>
			({
				id: this.#id.current,
				[TAG_TEXT_ATTR]: "",
				tabindex: -1,
				"data-editable": this.#tag.isEditable ? "" : undefined,
				"data-removable": this.#tag.removable.current ? "" : undefined,
				contenteditable:
					this.#tag.editMode.current === "contenteditable" && this.#tag.isEditing
						? "true"
						: undefined,
				onkeydown: this.#onkeydown,
				onblur: this.#onblur,
				onfocus: this.#onfocus,
			}) as const
	);
}

type TagsInputTagEditInputStateProps = WithRefProps;

class TagsInputTagEditInputState {
	#ref: TagsInputTagEditInputStateProps["ref"];
	#id: TagsInputTagEditInputStateProps["id"];
	tag: TagsInputTagState;

	constructor(props: TagsInputTagEditInputStateProps, tag: TagsInputTagState) {
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
		if (this.tag.isEditing && this.tag.editMode.current === "input") return undefined;
		return srOnlyStyles;
	});

	#onkeydown: KeyboardEventHandler<HTMLInputElement> = (e) => {
		if (e.key === kbd.ESCAPE) {
			this.tag.stopEditing();
			e.currentTarget.value = this.tag.value.current;
		} else if (e.key === kbd.TAB) {
			this.tag.stopEditing(false);
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

	#onblur: FocusEventHandler<HTMLInputElement> = () => {
		if (this.tag.isEditing) {
			this.tag.stopEditing(false);
		}
	};

	props = $derived.by(
		() =>
			({
				id: this.#id.current,
				[TAG_EDIT_INPUT_ATTR]: "",
				tabindex: -1,
				"data-editing": this.tag.isEditing ? "" : undefined,
				"data-invalid": getDataInvalid(this.tag.root.isInvalid),
				"data-editable": this.tag.isEditable ? "" : undefined,
				"data-removable": this.tag.removable.current ? "" : undefined,
				value: this.tag.value.current,
				style: this.#style,
				onkeydown: this.#onkeydown,
				onblur: this.#onblur,
				"aria-label": `Edit ${this.tag.value.current}`,
				"aria-describedby": this.tag.root.editDescriptionNode?.id,
				"aria-hidden": getAriaHidden(!this.tag.isEditing),
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
			onRefChange: (node) => {
				this.#tag.removeNode = node;
			},
		});
	}

	#onclick: MouseEventHandler<HTMLButtonElement> = () => {
		this.#tag.remove();
	};

	#onkeydown: KeyboardEventHandler<HTMLButtonElement> = (e) => {
		if (e.key === kbd.ENTER || e.key === kbd.SPACE) {
			e.preventDefault();
			this.#tag.remove();
			afterTick(() => {
				const success = this.root.listRovingFocusGroup?.focusLastCandidate();
				if (!success) {
					this.root.inputNode?.focus();
				}
			});
		}
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
				"data-editable": this.#tag.isEditable ? "" : undefined,
				"data-removable": this.#tag.removable.current ? "" : undefined,
				tabindex: this.#tag.isFocusWithin ? 0 : -1,
				onclick: this.#onclick,
				onkeydown: this.#onkeydown,
			}) as const
	);
}

type TagsInputTagEditStateProps = WithRefProps &
	ReadableBoxedValues<{
		disabled: HTMLButtonAttributes["disabled"];
	}>;

class TagsInputTagEditState {
	#ref: TagsInputTagEditStateProps["ref"];
	#id: TagsInputTagEditStateProps["id"];
	#tag: TagsInputTagState;
	#disabled: TagsInputTagEditStateProps["disabled"];
	root: TagsInputRootState;
	#ariaLabelledBy = $derived.by(() => {
		if (this.#tag.textNode && this.#tag.textNode.id) {
			return `${this.#id.current} ${this.#tag.textNode.id}`;
		}
		return this.#id.current;
	});

	constructor(props: TagsInputTagEditStateProps, tag: TagsInputTagState) {
		this.#ref = props.ref;
		this.#id = props.id;
		this.#tag = tag;
		this.root = tag.root;
		this.#disabled = props.disabled;

		useRefById({
			id: this.#id,
			ref: this.#ref,
			onRefChange: (node) => {
				this.#tag.removeNode = node;
			},
		});
	}

	#onclick: MouseEventHandler<HTMLButtonElement> = () => {
		if (this.#disabled.current) return;
		this.#tag.startEditing();
	};

	#onkeydown: KeyboardEventHandler<HTMLButtonElement> = (e) => {
		if (this.#disabled.current) return;
		if (e.key === kbd.ENTER || e.key === kbd.SPACE) {
			e.preventDefault();
			this.#tag.startEditing();
		}
	};

	props = $derived.by(
		() =>
			({
				id: this.#id.current,
				[TAG_EDIT_ATTR]: "",
				role: "button",
				"aria-label": "Remove",
				"aria-labelledby": this.#ariaLabelledBy,
				"data-editing": this.#tag.isEditing ? "" : undefined,
				"data-editable": this.#tag.isEditable ? "" : undefined,
				"data-removable": this.#tag.removable.current ? "" : undefined,
				tabindex: this.#tag.isFocusWithin ? 0 : -1,
				onclick: this.#onclick,
				onkeydown: this.#onkeydown,
			}) as const
	);
}

type TagsInputInputStateProps = WithRefProps &
	ReadableBoxedValues<{
		blurBehavior: TagsInputBlurBehavior;
		pasteBehavior: TagsInputPasteBehavior;
	}> &
	WritableBoxedValues<{ value: string }>;

class TagsInputInputState {
	#ref: TagsInputInputStateProps["ref"];
	#id: TagsInputInputStateProps["id"];
	#root: TagsInputRootState;
	value: TagsInputInputStateProps["value"];
	#blurBehavior: TagsInputInputStateProps["blurBehavior"];
	#pasteBehavior: TagsInputInputStateProps["pasteBehavior"];

	constructor(props: TagsInputInputStateProps, root: TagsInputRootState) {
		this.#ref = props.ref;
		this.#id = props.id;
		this.#root = root;
		this.value = props.value;
		this.#blurBehavior = props.blurBehavior;
		this.#pasteBehavior = props.pasteBehavior;

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

	#onkeydown: KeyboardEventHandler<HTMLInputElement> = (e) => {
		if (e.key === kbd.ENTER) {
			const valid = this.#root.addValue(e.currentTarget.value);
			if (valid) this.#resetValue();
		} else if (this.#root.delimiters.current.includes(e.key) && e.currentTarget.value) {
			e.preventDefault();
			const valid = this.#root.addValue(e.currentTarget.value);
			if (valid) this.#resetValue();
		} else if (e.key === kbd.BACKSPACE && e.currentTarget.value === "") {
			e.preventDefault();
			const success = this.#root.listRovingFocusGroup?.focusLastCandidate();
			if (!success) {
				this.#root.inputNode?.focus();
			}
		}
	};

	#onpaste: ClipboardEventHandler<HTMLInputElement> = (e) => {
		if (!e.clipboardData || this.#pasteBehavior.current === "none") return;
		const rawClipboardData = e.clipboardData.getData("text/plain");
		// we're splitting this by the delimiters
		const pastedValues = rawClipboardData.split(this.#root.delimitersRegex);
		this.#root.addValues(pastedValues);
		e.preventDefault();
	};

	#onblur: FocusEventHandler<HTMLInputElement> = (e) => {
		const blurBehavior = this.#blurBehavior.current;
		const currTarget = e.currentTarget as HTMLInputElement;
		if (blurBehavior === "add" && currTarget.value !== "") {
			const valid = this.#root.addValue(currTarget.value);
			if (valid) this.#resetValue();
		} else if (blurBehavior === "clear") {
			this.#resetValue();
		}
		this.#root.isInvalid = false;
	};

	props = $derived.by(
		() =>
			({
				id: this.#id.current,
				[INPUT_ATTR]: "",
				"data-invalid": getDataInvalid(this.#root.isInvalid),
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

	#onclick: MouseEventHandler<HTMLButtonElement> = () => {
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
		if (this.tag.isEditing && this.tag.editMode.current === "input") return srOnlyStyles;
		return undefined;
	});

	#ondblclick: MouseEventHandler<HTMLElement> = (e) => {
		if (!this.tag.isEditable) return;
		const target = e.target as HTMLElement;
		if (this.tag.removeNode && isOrContainsTarget(this.tag.removeNode, target)) {
			return;
		}
		this.tag.startEditing();
	};

	props = $derived.by(
		() =>
			({
				id: this.#id.current,
				[TAG_CONTENT_ATTR]: "",
				style: this.#style,
				ondblclick: this.#ondblclick,
			}) as const
	);
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

type TagsInputTagEditDescriptionStateProps = WithRefProps;

class TagsInputTagEditDescriptionState {
	#ref: TagsInputTagEditDescriptionStateProps["ref"];
	#id: TagsInputTagEditDescriptionStateProps["id"];
	root: TagsInputRootState;

	constructor(props: TagsInputTagEditDescriptionStateProps, root: TagsInputRootState) {
		this.#ref = props.ref;
		this.#id = props.id;
		this.root = root;

		useRefById({
			id: this.#id,
			ref: this.#ref,
			onRefChange: (node) => {
				this.root.editDescriptionNode = node;
			},
		});
	}

	description = "Edit tag. Press enter to save or escape to cancel.";

	props = $derived.by(
		() =>
			({
				id: this.#id.current,
				style: srOnlyStyles,
			}) as const
	);
}

type TagsInputAnnouncerStateProps = WithRefProps;

class TagsInputAnnouncerState {
	#ref: TagsInputAnnouncerStateProps["ref"];
	#id: TagsInputAnnouncerStateProps["id"];
	root: TagsInputRootState;

	constructor(props: TagsInputAnnouncerStateProps, root: TagsInputRootState) {
		this.#ref = props.ref;
		this.#id = props.id;
		this.root = root;

		useRefById({
			id: this.#id,
			ref: this.#ref,
		});
	}

	props = $derived.by(
		() =>
			({
				id: this.#id.current,
				"aria-live": "polite",
				style: srOnlyStyles,
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
	return setTagsInputListContext(new TagsInputListState(props, getTagsInputRootContext()));
}

export function useTagsInputTag(props: TagsInputTagStateProps) {
	return setTagsInputTagContext(new TagsInputTagState(props, getTagsInputListContext()));
}

export function useTagsInputTagText(props: TagsInputTagTextStateProps) {
	return new TagsInputTagTextState(props, getTagsInputTagContext());
}

export function useTagsInputTagEditInput(props: TagsInputTagEditInputStateProps) {
	return new TagsInputTagEditInputState(props, getTagsInputTagContext());
}

export function useTagsInputTagEdit(props: TagsInputTagEditStateProps) {
	return new TagsInputTagEditState(props, getTagsInputTagContext());
}

export function useTagsInputTagRemove(props: TagsInputTagRemoveStateProps) {
	return new TagsInputTagRemoveState(props, getTagsInputTagContext());
}

export function useTagsInputTagHiddenInput() {
	return new TagsInputTagHiddenInputState(getTagsInputTagContext());
}

export function useTagsInputInput(props: TagsInputInputStateProps) {
	return new TagsInputInputState(props, getTagsInputRootContext());
}

export function useTagsInputClear(props: TagsInputClearStateProps) {
	return new TagsInputClearState(props, getTagsInputRootContext());
}

export function useTagsInputContent(props: TagsInputTagContentStateProps) {
	return new TagsInputTagContentState(props, getTagsInputTagContext());
}

export function useTagsInputTagEditDescription(props: TagsInputTagEditDescriptionStateProps) {
	return new TagsInputTagEditDescriptionState(props, getTagsInputRootContext());
}

export function useTagsInputAnnouncer(props: TagsInputAnnouncerStateProps) {
	return new TagsInputAnnouncerState(props, getTagsInputRootContext());
}
