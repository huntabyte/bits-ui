import {
	type ReadableBoxedValues,
	type WritableBoxedValues,
	afterSleep,
	afterTick,
	attachRef,
	box,
	srOnlyStyles,
} from "svelte-toolbelt";
import type {
	ClipboardEventHandler,
	FocusEventHandler,
	KeyboardEventHandler,
	MouseEventHandler,
} from "svelte/elements";
import { Context, watch } from "runed";
import type {
	TagsInputAnnounceTransformers,
	TagsInputBlurBehavior,
	TagsInputPasteBehavior,
} from "./types.js";
import type { RefAttachment, WithRefOpts } from "$lib/internal/types.js";
import {
	createBitsAttrs,
	getAriaHidden,
	getDataInvalid,
	getRequired,
} from "$lib/internal/attrs.js";
import { kbd } from "$lib/internal/kbd.js";
import { RovingFocusGroup } from "$lib/internal/use-roving-focus.svelte.js";
import { isOrContainsTarget } from "$lib/internal/elements.js";

const tagsInputAttrs = createBitsAttrs({
	component: "tags-input",
	parts: [
		"root",
		"list",
		"input",
		"clear",
		"tag",
		"tag-text",
		"tag-content",
		"tag-remove",
		"tag-edit-input",
	],
});

const TagsInputRootContext = new Context<TagsInputRootState>("TagsInput.Root");
const TagsInputListContext = new Context<TagsInputListState>("TagsInput.List");
const TagsInputTagContext = new Context<TagsInputTagState>("TagsInput.Tag");

interface TagsInputRootStateOpts
	extends WithRefOpts,
		WritableBoxedValues<{
			value: string[];
		}>,
		ReadableBoxedValues<{
			delimiters: string[];
			name: string;
			required: boolean;
			validate: (value: string) => boolean;
			announceTransformers: TagsInputAnnounceTransformers | undefined;
		}> {}

// prettier-ignore
const HORIZONTAL_NAV_KEYS = [kbd.ARROW_LEFT, kbd.ARROW_RIGHT, kbd.HOME, kbd.END];
const VERTICAL_NAV_KEYS = [kbd.ARROW_UP, kbd.ARROW_DOWN];
const REMOVAL_KEYS = [kbd.BACKSPACE, kbd.DELETE];

export class TagsInputRootState {
	static create(opts: TagsInputRootStateOpts) {
		return TagsInputRootContext.set(new TagsInputRootState(opts));
	}

	readonly opts: TagsInputRootStateOpts;
	readonly attachment: RefAttachment;
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

	constructor(opts: TagsInputRootStateOpts) {
		this.opts = opts;
		this.attachment = attachRef(opts.ref);
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
		const message = this.opts.announceTransformers?.current?.edit
			? this.opts.announceTransformers.current.edit(from, to)
			: `${from} has been changed to ${to}`;
		this.#announce(message);
	};

	announceRemove = (value: string) => {
		const message = this.opts.announceTransformers?.current?.remove
			? this.opts.announceTransformers.current.remove(value)
			: `${value} has been removed`;
		this.#announce(message);
	};

	announceAdd = (value: string) => {
		const message = this.opts.announceTransformers?.current?.add
			? this.opts.announceTransformers.current.add(value)
			: `${value} has been added`;
		this.#announce(message);
	};

	announceAddMultiple = (values: string[]) => {
		const message = this.opts.announceTransformers?.current?.addMultiple
			? this.opts.announceTransformers.current.addMultiple(values)
			: `${values.join(", ")} has been added`;
		this.#announce(message);
	};

	readonly props = $derived.by(
		() =>
			({
				id: this.opts.id.current,
				[tagsInputAttrs.root]: "",
				"data-invalid": getDataInvalid(this.isInvalid),
				...this.attachment,
			}) as const
	);
}

interface TagsInputListStateOpts extends WithRefOpts {}

export class TagsInputListState {
	static create(opts: TagsInputListStateOpts) {
		return TagsInputListContext.set(new TagsInputListState(opts, TagsInputRootContext.get()));
	}

	readonly opts: TagsInputListStateOpts;
	readonly root: TagsInputRootState;
	readonly attachment: RefAttachment;
	rovingFocusGroup: RovingFocusGroup;

	constructor(opts: TagsInputListStateOpts, root: TagsInputRootState) {
		this.opts = opts;
		this.root = root;
		this.attachment = attachRef(opts.ref);
		this.rovingFocusGroup = new RovingFocusGroup({
			rootNodeId: this.opts.id,
			candidateSelector: `[role=gridcell]:not([aria-hidden=true])`,
			loop: box(false),
			orientation: box("horizontal"),
		});
		this.root.listRovingFocusGroup = this.rovingFocusGroup;
	}

	readonly gridWrapperProps = $derived.by(
		() =>
			({
				role: this.root.hasValue ? "grid" : undefined,
				style: {
					display: "contents",
				},
			}) as const
	);

	readonly props = $derived.by(
		() =>
			({
				id: this.opts.id.current,
				[tagsInputAttrs.list]: "",
				role: this.root.hasValue ? "row" : undefined,
				"data-invalid": getDataInvalid(this.root.isInvalid),
				...this.attachment,
			}) as const
	);
}

interface TagsInputTagStateOpts
	extends WithRefOpts,
		ReadableBoxedValues<{
			index: number;
			removable: boolean;
			editMode: "input" | "contenteditable" | "none";
		}>,
		WritableBoxedValues<{
			value: string;
		}> {}

export class TagsInputTagState {
	static create(opts: TagsInputTagStateOpts) {
		return TagsInputTagContext.set(new TagsInputTagState(opts, TagsInputListContext.get()));
	}

	readonly opts: TagsInputTagStateOpts;
	readonly list: TagsInputListState;
	readonly attachment: RefAttachment;
	textNode = $state<HTMLElement | null>(null);
	removeNode = $state<HTMLElement | null>(null);
	editCell = $state<HTMLElement | null>(null);
	editInput = $state<HTMLInputElement | null>(null);
	isEditable = $derived.by(() => this.opts.editMode.current !== "none");
	isEditing = $state(false);
	#tabIndex = $state(0);

	constructor(opts: TagsInputTagStateOpts, list: TagsInputListState) {
		this.opts = opts;
		this.list = list;
		this.attachment = attachRef(opts.ref);

		// we want to track the value here so when we remove the actively focused
		// tag, we ensure the other ones get the correct tab index
		watch([() => this.list.root.valueSnapshot, () => this.opts.ref.current], ([_, ref]) => {
			this.#tabIndex = this.list.rovingFocusGroup.getTabIndex(ref);
		});
	}

	setValue(value: string) {
		this.list.root.updateValueByIndex(this.opts.index.current, value);
	}

	startEditing() {
		if (this.isEditable === false) return;
		this.isEditing = true;

		if (this.opts.editMode.current === "input") {
			this.editInput?.focus();
			this.editInput?.select();
		} else if (this.opts.editMode.current === "contenteditable") {
			this.textNode?.focus();
		}
	}

	stopEditing(focusTag = true) {
		this.isEditing = false;

		if (focusTag) {
			this.opts.ref.current?.focus();
		}
	}

	remove() {
		if (this.opts.removable.current === false) return;
		this.list.root.removeValueByIndex(this.opts.index.current, this.opts.value.current);
		this.list.root.recomputeTabIndex();
	}

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

	readonly props = $derived.by(
		() =>
			({
				id: this.opts.id.current,
				role: "gridcell",
				"data-editing": this.isEditing ? "" : undefined,
				"data-editable": this.isEditable ? "" : undefined,
				"data-removable": this.opts.removable.current ? "" : undefined,
				"data-invalid": getDataInvalid(this.list.root.isInvalid),
				tabindex: this.#tabIndex,
				[tagsInputAttrs.tag]: "",
				onkeydown: this.#onkeydown,
				...this.attachment,
			}) as const
	);
}

interface TagsInputTagTextStateOpts extends WithRefOpts {}

export class TagsInputTagTextState {
	static create(opts: TagsInputTagTextStateOpts) {
		return new TagsInputTagTextState(opts, TagsInputTagContext.get());
	}

	readonly opts: TagsInputTagTextStateOpts;
	readonly tag: TagsInputTagState;
	readonly attachment: RefAttachment;

	constructor(opts: TagsInputTagTextStateOpts, tag: TagsInputTagState) {
		this.opts = opts;
		this.tag = tag;
		this.attachment = attachRef(opts.ref, (v) => {
			this.tag.textNode = v;
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

	readonly props = $derived.by(
		() =>
			({
				id: this.opts.id.current,
				[tagsInputAttrs["tag-text"]]: "",
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
				...this.attachment,
			}) as const
	);
}

interface TagsInputTagEditInputStateOpts extends WithRefOpts {}

export class TagsInputTagEditInputState {
	static create(opts: TagsInputTagEditInputStateOpts) {
		return new TagsInputTagEditInputState(opts, TagsInputTagContext.get());
	}

	readonly opts: TagsInputTagEditInputStateOpts;
	readonly tag: TagsInputTagState;
	readonly attachment: RefAttachment;

	constructor(opts: TagsInputTagEditInputStateOpts, tag: TagsInputTagState) {
		this.opts = opts;
		this.tag = tag;
		this.attachment = attachRef(opts.ref, (v) => {
			if (v instanceof HTMLInputElement) this.tag.editInput = v;
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

	readonly props = $derived.by(
		() =>
			({
				id: this.opts.id.current,
				[tagsInputAttrs["tag-edit-input"]]: "",
				tabindex: -1,
				"data-editing": this.tag.isEditing ? "" : undefined,
				"data-invalid": getDataInvalid(this.tag.list.root.isInvalid),
				"data-editable": this.tag.isEditable ? "" : undefined,
				"data-removable": this.tag.opts.removable.current ? "" : undefined,
				value: this.tag.opts.value.current,
				style: this.#style,
				onkeydown: this.#onkeydown,
				onblur: this.#onblur,
				"aria-describedby": this.tag.list.root.editDescriptionNode?.id,
				"aria-hidden": getAriaHidden(!this.tag.isEditing),
				...this.attachment,
			}) as const
	);
}

interface TagsInputTagRemoveStateOpts extends WithRefOpts {}

export class TagsInputTagRemoveState {
	static create(opts: TagsInputTagRemoveStateOpts) {
		return new TagsInputTagRemoveState(opts, TagsInputTagContext.get());
	}

	readonly opts: TagsInputTagRemoveStateOpts;
	readonly tag: TagsInputTagState;
	readonly attachment: RefAttachment;
	#ariaLabelledBy = $derived.by(() => {
		if (this.tag.textNode && this.tag.textNode.id) {
			return `${this.opts.id.current} ${this.tag.textNode.id}`;
		}
		return this.opts.id.current;
	});

	constructor(opts: TagsInputTagRemoveStateOpts, tag: TagsInputTagState) {
		this.opts = opts;
		this.tag = tag;
		this.attachment = attachRef(opts.ref, (v) => {
			this.tag.removeNode = v;
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

	readonly props = $derived.by(
		() =>
			({
				id: this.opts.id.current,
				[tagsInputAttrs["tag-remove"]]: "",
				role: "button",
				"aria-label": "Remove",
				"aria-labelledby": this.#ariaLabelledBy,
				"data-editing": this.tag.isEditing ? "" : undefined,
				"data-editable": this.tag.isEditable ? "" : undefined,
				"data-removable": this.tag.opts.removable.current ? "" : undefined,
				tabindex: -1,
				onclick: this.#onclick,
				onkeydown: this.#onkeydown,
				...this.attachment,
			}) as const
	);
}

interface TagsInputInputStateOpts
	extends WithRefOpts,
		ReadableBoxedValues<{
			blurBehavior: TagsInputBlurBehavior;
			pasteBehavior: TagsInputPasteBehavior;
		}>,
		WritableBoxedValues<{ value: string }> {}

export class TagsInputInputState {
	static create(opts: TagsInputInputStateOpts) {
		return new TagsInputInputState(opts, TagsInputRootContext.get());
	}

	readonly opts: TagsInputInputStateOpts;
	readonly root: TagsInputRootState;
	readonly attachment: RefAttachment;
	constructor(opts: TagsInputInputStateOpts, root: TagsInputRootState) {
		this.opts = opts;
		this.root = root;
		this.attachment = attachRef(opts.ref, (v) => {
			this.root.inputNode = v;
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

	readonly props = $derived.by(
		() =>
			({
				id: this.opts.id.current,
				[tagsInputAttrs.input]: "",
				"data-invalid": getDataInvalid(this.root.isInvalid),
				onkeydown: this.#onkeydown,
				onblur: this.#onblur,
				onpaste: this.#onpaste,
				...this.attachment,
			}) as const
	);
}

interface TagsInputClearStateOpts extends WithRefOpts {}

export class TagsInputClearState {
	static create(opts: TagsInputClearStateOpts) {
		return new TagsInputClearState(opts, TagsInputRootContext.get());
	}

	readonly opts: TagsInputClearStateOpts;
	readonly root: TagsInputRootState;
	readonly attachment: RefAttachment;

	constructor(opts: TagsInputClearStateOpts, root: TagsInputRootState) {
		this.opts = opts;
		this.root = root;
		this.attachment = attachRef(opts.ref);
	}

	#onclick: MouseEventHandler<HTMLButtonElement> = () => {
		this.root.clearValue();
	};

	readonly props = $derived.by(
		() =>
			({
				id: this.opts.id.current,
				[tagsInputAttrs.clear]: "",
				role: "button",
				"aria-label": "Clear",
				onclick: this.#onclick,
				...this.attachment,
			}) as const
	);
}

interface TagsInputTagContentStateOpts extends WithRefOpts {}

export class TagsInputTagContentState {
	static create(opts: TagsInputTagContentStateOpts) {
		return new TagsInputTagContentState(opts, TagsInputTagContext.get());
	}

	readonly opts: TagsInputTagContentStateOpts;
	readonly tag: TagsInputTagState;
	readonly attachment: RefAttachment;

	constructor(opts: TagsInputTagContentStateOpts, tag: TagsInputTagState) {
		this.opts = opts;
		this.tag = tag;
		this.attachment = attachRef(opts.ref);
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

	readonly props = $derived.by(
		() =>
			({
				id: this.opts.id.current,
				[tagsInputAttrs["tag-content"]]: "",
				style: this.#style,
				ondblclick: this.#ondblclick,
				...this.attachment,
			}) as const
	);
}

export class TagsInputTagHiddenInputState {
	static create() {
		return new TagsInputTagHiddenInputState(TagsInputTagContext.get());
	}

	readonly tag: TagsInputTagState;

	shouldRender = $derived.by(
		() => this.tag.list.root.opts.name.current !== "" && this.tag.opts.value.current !== ""
	);

	constructor(tag: TagsInputTagState) {
		this.tag = tag;
	}

	readonly props = $derived.by(
		() =>
			({
				type: "text",
				name: this.tag.list.root.opts.name.current,
				value: this.tag.opts.value.current,
				style: srOnlyStyles,
				required: getRequired(this.tag.list.root.opts.required.current),
				"aria-hidden": "true",
			}) as const
	);
}

interface TagsInputTagEditDescriptionStateOpts extends WithRefOpts {}

export class TagsInputTagEditDescriptionState {
	static create(opts: TagsInputTagEditDescriptionStateOpts) {
		return new TagsInputTagEditDescriptionState(opts, TagsInputRootContext.get());
	}

	readonly opts: TagsInputTagEditDescriptionStateOpts;
	readonly root: TagsInputRootState;
	readonly attachment: RefAttachment;

	constructor(opts: TagsInputTagEditDescriptionStateOpts, root: TagsInputRootState) {
		this.opts = opts;
		this.root = root;
		this.attachment = attachRef(opts.ref, (v) => {
			this.root.editDescriptionNode = v;
		});
	}

	description = "Edit tag. Press enter to save or escape to cancel.";

	readonly props = $derived.by(
		() =>
			({
				id: this.opts.id.current,
				style: srOnlyStyles,
				...this.attachment,
			}) as const
	);
}

interface TagsInputAnnouncerStateOpts extends WithRefOpts {}

export class TagsInputAnnouncerState {
	static create(opts: TagsInputAnnouncerStateOpts) {
		return new TagsInputAnnouncerState(opts, TagsInputRootContext.get());
	}

	readonly opts: TagsInputAnnouncerStateOpts;
	readonly root: TagsInputRootState;
	readonly attachment: RefAttachment;

	constructor(opts: TagsInputAnnouncerStateOpts, root: TagsInputRootState) {
		this.opts = opts;
		this.root = root;
		this.attachment = attachRef(opts.ref);
	}

	readonly props = $derived.by(
		() =>
			({
				id: this.opts.id.current,
				"aria-live": "polite",
				style: srOnlyStyles,
				...this.attachment,
			}) as const
	);
}
