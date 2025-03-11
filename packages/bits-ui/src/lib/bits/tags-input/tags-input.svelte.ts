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
	KeyboardEventHandler,
	MouseEventHandler,
} from "svelte/elements";
import { Context } from "runed";
import type { TagsInputBlurBehavior, TagsInputPasteBehavior } from "./types.js";
import type { WithRefProps } from "$lib/internal/types.js";
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
	valueSnapshot = $derived.by(() => $state.snapshot(this.opts.value.current));
	inputNode = $state<HTMLElement | null>(null);
	listRovingFocusGroup: RovingFocusGroup | null = null;
	delimitersRegex = $derived.by(() => new RegExp(this.opts.delimiters.current.join("|"), "g"));
	editDescriptionNode = $state<HTMLElement | null>(null);
	message = $state<string | null>(null);
	messageTimeout: number | null = null;
	/**
	 * Whether the tags input is invalid or not. It enters an invalid state when the
	 * `validate` prop returns `false` for any of the tags.
	 */
	isInvalid = $state(false);
	hasValue = $derived.by(() => this.opts.value.current.length > 0);

	constructor(readonly opts: TagsInputRootStateProps) {
		useRefById(opts);
	}

	includesValue = (value: string) => {
		return this.opts.value.current.includes(value);
	};

	addValue = (value: string): boolean => {
		if (value === "") return true;
		const isValid = this.opts.validate.current?.(value) ?? true;
		if (!isValid) {
			this.isInvalid = true;
			return false;
		}
		this.isInvalid = false;
		this.opts.value.current.push(value);
		this.announceAdd(value);
		return true;
	};

	addValues = (values: string[]) => {
		const newValues = values.filter((value) => value !== "");
		const anyInvalid = newValues.some((value) => this.opts.validate.current?.(value) === false);
		if (anyInvalid) {
			this.isInvalid = true;
			return;
		}
		this.isInvalid = false;
		this.opts.value.current.push(...newValues);
		this.announceAddMultiple(newValues);
	};

	removeValueByIndex = (index: number, value: string) => {
		this.opts.value.current.splice(index, 1);
		this.announceRemove(value);
	};

	updateValueByIndex = (index: number, value: string) => {
		const curr = this.opts.value.current[index];
		this.opts.value.current[index] = value;
		if (curr) {
			this.announceEdit(curr, value);
		}
	};

	clearValue = () => {
		this.isInvalid = false;
		this.opts.value.current = [];
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
		this.#announce(`${from} has been changed to ${to}`);
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
				id: this.opts.id.current,
				[ROOT_ATTR]: "",
				"data-invalid": getDataInvalid(this.isInvalid),
			}) as const
	);
}

type TagsInputListStateProps = WithRefProps;

class TagsInputListState {
	rovingFocusGroup: RovingFocusGroup;

	constructor(
		readonly opts: TagsInputListStateProps,
		readonly root: TagsInputRootState
	) {
		useRefById(opts);
		this.rovingFocusGroup = new RovingFocusGroup({
			rootNodeId: this.opts.id,
			candidateSelector: `[role=gridcell]:not([aria-hidden=true])`,
			loop: box(false),
			orientation: box("horizontal"),
		});
		this.root.listRovingFocusGroup = this.rovingFocusGroup;
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
				id: this.opts.id.current,
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
	textNode = $state<HTMLElement | null>(null);
	removeNode = $state<HTMLElement | null>(null);
	editCell = $state<HTMLElement | null>(null);
	editInput = $state<HTMLInputElement | null>(null);
	isEditable = $derived.by(() => this.opts.editMode.current !== "none");
	isEditing = $state(false);
	#tabIndex = $state(0);

	constructor(
		readonly opts: TagsInputTagStateProps,
		readonly list: TagsInputListState
	) {
		useRefById({
			...opts,
			deps: () => this.opts.index.current,
		});

		$effect(() => {
			// we want to track the value here so when we remove the actively focused
			// tag, we ensure the other ones get the correct tab index
			this.list.root.valueSnapshot;
			this.opts.ref.current;
			this.#tabIndex = this.list.rovingFocusGroup.getTabIndex(this.opts.ref.current);
		});
	}

	setValue = (value: string) => {
		this.list.root.updateValueByIndex(this.opts.index.current, value);
	};

	startEditing = () => {
		if (this.isEditable === false) return;
		this.isEditing = true;

		if (this.opts.editMode.current === "input") {
			this.editInput?.focus();
			this.editInput?.select();
		} else if (this.opts.editMode.current === "contenteditable") {
			this.textNode?.focus();
		}
	};

	stopEditing = (focusTag = true) => {
		this.isEditing = false;

		if (focusTag) {
			this.opts.ref.current?.focus();
		}
	};

	remove = () => {
		if (this.opts.removable.current === false) return;
		this.list.root.removeValueByIndex(this.opts.index.current, this.opts.value.current);
		this.list.root.recomputeTabIndex();
	};

	#onkeydown: KeyboardEventHandler<HTMLElement> = (e) => {
		if (e.target !== this.opts.ref.current) return;
		if (HORIZONTAL_NAV_KEYS.includes(e.key)) {
			e.preventDefault();
			this.list.rovingFocusGroup.handleKeydown({ node: this.opts.ref.current, event: e });
		} else if (VERTICAL_NAV_KEYS.includes(e.key)) {
			e.preventDefault();
			this.list.rovingFocusGroup.handleKeydown({
				node: this.opts.ref.current,
				event: e,
				orientation: "vertical",
				invert: true,
			});
		} else if (REMOVAL_KEYS.includes(e.key)) {
			e.preventDefault();
			this.remove();
			this.list.rovingFocusGroup.navigateBackward(
				this.opts.ref.current,
				this.list.root.inputNode
			);
		} else if (e.key === kbd.ENTER) {
			e.preventDefault();
			this.startEditing();
		}
	};

	props = $derived.by(
		() =>
			({
				id: this.opts.id.current,
				role: "gridcell",
				"data-editing": this.isEditing ? "" : undefined,
				"data-editable": this.isEditable ? "" : undefined,
				"data-removable": this.opts.removable.current ? "" : undefined,
				"data-invalid": getDataInvalid(this.list.root.isInvalid),
				tabindex: this.#tabIndex,
				[TAG_ATTR]: "",
				onkeydown: this.#onkeydown,
			}) as const
	);
}

type TagsInputTagTextStateProps = WithRefProps;

class TagsInputTagTextState {
	constructor(
		readonly opts: TagsInputTagTextStateProps,
		readonly tag: TagsInputTagState
	) {
		useRefById({
			...opts,
			onRefChange: (node) => {
				this.tag.textNode = node;
			},
		});
	}

	#onkeydown: KeyboardEventHandler<HTMLElement> = (e) => {
		if (this.tag.opts.editMode.current !== "contenteditable" || !this.tag.isEditing) {
			return;
		}
		if (e.key === kbd.ESCAPE) {
			this.tag.stopEditing();
			e.currentTarget.innerText = this.tag.opts.value.current;
		} else if (e.key === kbd.TAB) {
			this.tag.stopEditing(false);
			e.currentTarget.innerText = this.tag.opts.value.current;
		} else if (e.key === kbd.ENTER) {
			e.preventDefault();
			const value = e.currentTarget.innerText;
			if (value === "") {
				this.tag.stopEditing();
				this.tag.remove();
			} else {
				this.tag.setValue(value);
				this.tag.stopEditing();
			}
		}
	};

	#onblur: FocusEventHandler<HTMLElement> = () => {
		if (this.tag.opts.editMode.current !== "contenteditable") return;
		if (this.tag.isEditing) {
			this.tag.stopEditing(false);
		}
	};

	#onfocus: FocusEventHandler<HTMLElement> = (_) => {
		if (this.tag.opts.editMode.current !== "contenteditable" || !this.tag.isEditing) return;
		afterSleep(0, () => {
			if (!this.opts.ref.current) return;
			const selection = window.getSelection();
			const range = document.createRange();

			range.selectNodeContents(this.opts.ref.current);
			selection?.removeAllRanges();
			selection?.addRange(range);
		});
	};

	props = $derived.by(
		() =>
			({
				id: this.opts.id.current,
				[TAG_TEXT_ATTR]: "",
				tabindex: -1,
				"data-editable": this.tag.isEditable ? "" : undefined,
				"data-removable": this.tag.opts.removable.current ? "" : undefined,
				contenteditable:
					this.tag.opts.editMode.current === "contenteditable" && this.tag.isEditing
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
	constructor(
		readonly opts: TagsInputTagEditInputStateProps,
		readonly tag: TagsInputTagState
	) {
		useRefById({
			...opts,
			onRefChange: (node) => {
				if (node instanceof HTMLInputElement) this.tag.editInput = node;
			},
		});
	}

	#style = $derived.by(() => {
		if (this.tag.isEditing && this.tag.opts.editMode.current === "input") return undefined;
		return srOnlyStyles;
	});

	#onkeydown: KeyboardEventHandler<HTMLInputElement> = (e) => {
		if (e.key === kbd.ESCAPE) {
			this.tag.stopEditing();
			e.currentTarget.value = this.tag.opts.value.current;
		} else if (e.key === kbd.TAB) {
			this.tag.stopEditing(false);
			e.currentTarget.value = this.tag.opts.value.current;
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
				id: this.opts.id.current,
				[TAG_EDIT_INPUT_ATTR]: "",
				tabindex: -1,
				"data-editing": this.tag.isEditing ? "" : undefined,
				"data-invalid": getDataInvalid(this.tag.list.root.isInvalid),
				"data-editable": this.tag.isEditable ? "" : undefined,
				"data-removable": this.tag.opts.removable.current ? "" : undefined,
				value: this.tag.opts.value.current,
				style: this.#style,
				onkeydown: this.#onkeydown,
				onblur: this.#onblur,
				"aria-label": `Edit ${this.tag.opts.value.current}`,
				"aria-describedby": this.tag.list.root.editDescriptionNode?.id,
				"aria-hidden": getAriaHidden(!this.tag.isEditing),
			}) as const
	);
}

type TagsInputTagRemoveStateProps = WithRefProps;

class TagsInputTagRemoveState {
	#ariaLabelledBy = $derived.by(() => {
		if (this.tag.textNode && this.tag.textNode.id) {
			return `${this.opts.id.current} ${this.tag.textNode.id}`;
		}
		return this.opts.id.current;
	});

	constructor(
		readonly opts: TagsInputTagRemoveStateProps,
		readonly tag: TagsInputTagState
	) {
		useRefById({
			...opts,
			onRefChange: (node) => {
				this.tag.removeNode = node;
			},
		});
	}

	#onclick: MouseEventHandler<HTMLButtonElement> = () => {
		this.tag.remove();
	};

	#onkeydown: KeyboardEventHandler<HTMLButtonElement> = (e) => {
		if (e.key === kbd.ENTER || e.key === kbd.SPACE) {
			e.preventDefault();
			this.tag.remove();
			afterTick(() => {
				const success = this.tag.list.root.listRovingFocusGroup?.focusLastCandidate();
				if (!success) {
					this.tag.list.root.inputNode?.focus();
				}
			});
		}
	};

	props = $derived.by(
		() =>
			({
				id: this.opts.id.current,
				[TAG_REMOVE_ATTR]: "",
				role: "button",
				"aria-label": "Remove",
				"aria-labelledby": this.#ariaLabelledBy,
				"data-editing": this.tag.isEditing ? "" : undefined,
				"data-editable": this.tag.isEditable ? "" : undefined,
				"data-removable": this.tag.opts.removable.current ? "" : undefined,
				tabindex: -1,
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
	constructor(
		readonly opts: TagsInputInputStateProps,
		readonly root: TagsInputRootState
	) {
		useRefById({
			...opts,
			onRefChange: (node) => {
				this.root.inputNode = node;
			},
		});
	}

	#resetValue = () => {
		this.opts.value.current = "";
	};

	#onkeydown: KeyboardEventHandler<HTMLInputElement> = (e) => {
		if (e.key === kbd.ENTER) {
			const valid = this.root.addValue(e.currentTarget.value);
			if (valid) this.#resetValue();
		} else if (this.root.opts.delimiters.current.includes(e.key) && e.currentTarget.value) {
			e.preventDefault();
			const valid = this.root.addValue(e.currentTarget.value);
			if (valid) this.#resetValue();
		} else if (e.key === kbd.BACKSPACE && e.currentTarget.value === "") {
			e.preventDefault();
			const success = this.root.listRovingFocusGroup?.focusLastCandidate();
			if (!success) {
				this.root.inputNode?.focus();
			}
		}
	};

	#onpaste: ClipboardEventHandler<HTMLInputElement> = (e) => {
		if (!e.clipboardData || this.opts.pasteBehavior.current === "none") return;
		const rawClipboardData = e.clipboardData.getData("text/plain");
		// we're splitting this by the delimiters
		const pastedValues = rawClipboardData.split(this.root.delimitersRegex);
		this.root.addValues(pastedValues);
		e.preventDefault();
	};

	#onblur: FocusEventHandler<HTMLInputElement> = (e) => {
		const blurBehavior = this.opts.blurBehavior.current;
		const currTarget = e.currentTarget as HTMLInputElement;
		if (blurBehavior === "add" && currTarget.value !== "") {
			const valid = this.root.addValue(currTarget.value);
			if (valid) this.#resetValue();
		} else if (blurBehavior === "clear") {
			this.#resetValue();
		}
		this.root.isInvalid = false;
	};

	props = $derived.by(
		() =>
			({
				id: this.opts.id.current,
				[INPUT_ATTR]: "",
				"data-invalid": getDataInvalid(this.root.isInvalid),
				onkeydown: this.#onkeydown,
				onblur: this.#onblur,
				onpaste: this.#onpaste,
			}) as const
	);
}

type TagsInputClearStateProps = WithRefProps;

class TagsInputClearState {
	constructor(
		readonly opts: TagsInputClearStateProps,
		readonly root: TagsInputRootState
	) {
		useRefById(opts);
	}

	#onclick: MouseEventHandler<HTMLButtonElement> = () => {
		this.root.clearValue();
	};

	props = $derived.by(
		() =>
			({
				id: this.opts.id.current,
				[CLEAR_ATTR]: "",
				role: "button",
				"aria-label": "Clear",
				onclick: this.#onclick,
			}) as const
	);
}

type TagsInputTagContentStateProps = WithRefProps;

class TagsInputTagContentState {
	constructor(
		readonly opts: TagsInputTagContentStateProps,
		readonly tag: TagsInputTagState
	) {
		useRefById(opts);
	}

	#style = $derived.by(() => {
		if (this.tag.isEditing && this.tag.opts.editMode.current === "input") return srOnlyStyles;
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
				id: this.opts.id.current,
				[TAG_CONTENT_ATTR]: "",
				style: this.#style,
				ondblclick: this.#ondblclick,
			}) as const
	);
}

class TagsInputTagHiddenInputState {
	shouldRender = $derived.by(
		() => this.tag.list.root.opts.name.current !== "" && this.tag.opts.value.current !== ""
	);

	constructor(readonly tag: TagsInputTagState) {}

	props = $derived.by(
		() =>
			({
				type: "text",
				name: this.tag.list.root.opts.name.current,
				value: this.tag.opts.value.current,
				style: srOnlyStyles,
				required: getRequired(this.tag.list.root.opts.required.current),
				"aria-hidden": getAriaHidden(true),
			}) as const
	);
}

type TagsInputTagEditDescriptionStateProps = WithRefProps;

class TagsInputTagEditDescriptionState {
	constructor(
		readonly opts: TagsInputTagEditDescriptionStateProps,
		readonly root: TagsInputRootState
	) {
		useRefById({
			...opts,
			onRefChange: (node) => {
				this.root.editDescriptionNode = node;
			},
		});
	}

	description = "Edit tag. Press enter to save or escape to cancel.";

	props = $derived.by(
		() =>
			({
				id: this.opts.id.current,
				style: srOnlyStyles,
			}) as const
	);
}

type TagsInputAnnouncerStateProps = WithRefProps;

class TagsInputAnnouncerState {
	constructor(
		readonly opts: TagsInputAnnouncerStateProps,
		readonly root: TagsInputRootState
	) {
		useRefById(opts);
	}

	props = $derived.by(
		() =>
			({
				id: this.opts.id.current,
				"aria-live": "polite",
				style: srOnlyStyles,
			}) as const
	);
}

const TagsInputRootContext = new Context<TagsInputRootState>("TagsInput.Root");
const TagsInputListContext = new Context<TagsInputListState>("TagsInput.List");
const TagsInputTagContext = new Context<TagsInputTagState>("TagsInput.Tag");

export function useTagsInputRoot(props: TagsInputRootStateProps) {
	return TagsInputRootContext.set(new TagsInputRootState(props));
}

export function useTagsInputList(props: TagsInputListStateProps) {
	return TagsInputListContext.set(new TagsInputListState(props, TagsInputRootContext.get()));
}

export function useTagsInputTag(props: TagsInputTagStateProps) {
	return TagsInputTagContext.set(new TagsInputTagState(props, TagsInputListContext.get()));
}

export function useTagsInputTagText(props: TagsInputTagTextStateProps) {
	return new TagsInputTagTextState(props, TagsInputTagContext.get());
}

export function useTagsInputTagEditInput(props: TagsInputTagEditInputStateProps) {
	return new TagsInputTagEditInputState(props, TagsInputTagContext.get());
}

export function useTagsInputTagRemove(props: TagsInputTagRemoveStateProps) {
	return new TagsInputTagRemoveState(props, TagsInputTagContext.get());
}

export function useTagsInputTagHiddenInput() {
	return new TagsInputTagHiddenInputState(TagsInputTagContext.get());
}

export function useTagsInputInput(props: TagsInputInputStateProps) {
	return new TagsInputInputState(props, TagsInputRootContext.get());
}

export function useTagsInputClear(props: TagsInputClearStateProps) {
	return new TagsInputClearState(props, TagsInputRootContext.get());
}

export function useTagsInputContent(props: TagsInputTagContentStateProps) {
	return new TagsInputTagContentState(props, TagsInputTagContext.get());
}

export function useTagsInputTagEditDescription(props: TagsInputTagEditDescriptionStateProps) {
	return new TagsInputTagEditDescriptionState(props, TagsInputRootContext.get());
}

export function useTagsInputAnnouncer(props: TagsInputAnnouncerStateProps) {
	return new TagsInputAnnouncerState(props, TagsInputRootContext.get());
}
