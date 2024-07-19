import { afterTick } from "$lib/internal/afterTick.js";
import { backward, forward, next, prev } from "$lib/internal/arrays.js";
import {
	getAriaExpanded,
	getAriaHidden,
	getDataDisabled,
	getDataOpenClosed,
	getDisabled,
	getRequired,
} from "$lib/internal/attrs.js";
import type { Box, ReadableBoxedValues, WritableBoxedValues } from "$lib/internal/box.svelte.js";
import { createContext } from "$lib/internal/createContext.js";
import { kbd } from "$lib/internal/kbd.js";
import type { WithRefProps } from "$lib/internal/types.js";
import { useRefById } from "$lib/internal/useRefById.svelte.js";
import { onDestroy, tick } from "svelte";

// prettier-ignore
export const INTERACTION_KEYS = [kbd.ARROW_LEFT, kbd.ESCAPE, kbd.ARROW_RIGHT, kbd.SHIFT, kbd.CAPS_LOCK, kbd.CONTROL, kbd.ALT, kbd.META, kbd.ENTER, kbd.F1, kbd.F2, kbd.F3, kbd.F4, kbd.F5, kbd.F6, kbd.F7, kbd.F8, kbd.F9, kbd.F10, kbd.F11, kbd.F12];

export const FIRST_KEYS = [kbd.ARROW_DOWN, kbd.PAGE_UP, kbd.HOME];
export const LAST_KEYS = [kbd.ARROW_UP, kbd.PAGE_DOWN, kbd.END];
export const FIRST_LAST_KEYS = [...FIRST_KEYS, ...LAST_KEYS];
export const SELECTION_KEYS = [kbd.ENTER, kbd.SPACE];

const COMBOBOX_ITEM_ATTR = "data-combobox-item";
const COMBOBOX_CONTENT_ATTR = "data-combobox-content";
const COMBOBOX_INPUT_ATTR = "data-combobox-input";
const COMBOBOX_TRIGGER_ATTR = "data-combobox-trigger";
const COMBOBOX_GROUP_ATTR = "data-combobox-group";
const COMBOBOX_GROUP_LABEL_ATTR = "data-combobox-group-label";

type ComboboxBaseRootStateProps = ReadableBoxedValues<{
	disabled: boolean;
	required: boolean;
	name: string;
	loop: boolean;
	scrollAlignment: "nearest" | "center";
}> &
	WritableBoxedValues<{
		open: boolean;
	}>;

class ComboboxBaseRootState {
	disabled: ComboboxBaseRootStateProps["disabled"];
	required: ComboboxBaseRootStateProps["required"];
	name: ComboboxBaseRootStateProps["name"];
	loop: ComboboxBaseRootStateProps["loop"];
	open: ComboboxBaseRootStateProps["open"];
	scrollAlignment: ComboboxBaseRootStateProps["scrollAlignment"];
	touchedInput = $state(false);
	inputValue = $state<string>("");
	inputNode = $state<HTMLElement | null>(null);
	contentNode = $state<HTMLElement | null>(null);
	triggerNode = $state<HTMLElement | null>(null);
	highlightedNode = $state<HTMLElement | null>(null);
	highlightedValue = $derived.by(() => {
		if (!this.highlightedNode) return null;
		return this.highlightedNode.getAttribute("data-value");
	});
	highlightedId = $derived.by(() => {
		if (!this.highlightedNode) return undefined;
		return this.highlightedNode.id;
	});
	highlightedLabel = $derived.by(() => {
		if (!this.highlightedNode) return null;
		return this.highlightedNode.getAttribute("data-label");
	});

	constructor(props: ComboboxBaseRootStateProps) {
		this.disabled = props.disabled;
		this.required = props.required;
		this.name = props.name;
		this.loop = props.loop;
		this.open = props.open;
		this.scrollAlignment = props.scrollAlignment;

		$effect(() => {
			if (!this.open.value) {
				this.highlightedNode = null;
			}
		});
	}

	setHighlightedNode = (node: HTMLElement | null) => {
		this.highlightedNode = node;
	};

	getCandidateNodes = (): HTMLElement[] => {
		const node = this.contentNode;
		if (!node) return [];
		const nodes = Array.from(
			node.querySelectorAll<HTMLElement>(`[${COMBOBOX_ITEM_ATTR}]:not([data-disabled])`)
		);
		return nodes;
	};

	setHighlightedToFirstCandidate = () => {
		afterTick(() => {
			const candidateNodes = this.getCandidateNodes();
			if (!candidateNodes.length) return;
			this.highlightedNode = candidateNodes[0]!;
		});
	};

	getNodeByValue = (value: string): HTMLElement | null => {
		const candidateNodes = this.getCandidateNodes();
		return candidateNodes.find((node) => node.dataset.value === value) ?? null;
	};

	setOpen = (open: boolean) => {
		this.open.value = open;
	};

	toggleOpen = () => {
		this.open.value = !this.open.value;
	};

	openMenu = () => {
		this.setOpen(true);
	};

	closeMenu = () => {
		this.setOpen(false);
		this.highlightedNode = null;
	};

	toggleMenu = () => {
		this.toggleOpen();
	};
}

type ComboboxSingleRootStateProps = ComboboxBaseRootStateProps &
	WritableBoxedValues<{
		value: string;
	}>;

class ComboboxSingleRootState extends ComboboxBaseRootState {
	value: ComboboxSingleRootStateProps["value"];
	isMulti = false as const;
	hasValue = $derived.by(() => this.value.value !== "");

	constructor(props: ComboboxSingleRootStateProps) {
		super(props);
		this.value = props.value;

		$effect(() => {
			if (!this.open.value) return;
			afterTick(() => {
				this.#setInitialHighlightedNode();
			});
		});
	}

	includesItem = (itemValue: string) => {
		return this.value.value === itemValue;
	};

	toggleItem = (itemValue: string, itemLabel: string = itemValue) => {
		this.value.value = this.includesItem(itemValue) ? "" : itemValue;
		this.inputValue = itemLabel;
	};

	#setInitialHighlightedNode = () => {
		if (this.highlightedNode) return;
		if (this.value.value !== "") {
			const node = this.getNodeByValue(this.value.value);
			if (node) {
				this.highlightedNode = node;
				return;
			}
		}
		// if no value is set, we want to highlight the first item
		const firstCandidate = this.getCandidateNodes()[0];
		if (!firstCandidate) return;
		this.highlightedNode = firstCandidate;
	};

	createInput(props: ComboboxInputStateProps) {
		return new ComboboxInputState(props, this);
	}

	createContent(props: ComboboxContentStateProps) {
		return new ComboboxContentState(props, this);
	}

	createTrigger(props: ComboboxTriggerStateProps) {
		return new ComboboxTriggerState(props, this);
	}

	createItem(props: ComboboxItemStateProps) {
		return new ComboboxItemState(props, this);
	}

	createGroup(props: ComboboxGroupStateProps) {
		return new ComboboxGroupState(props);
	}

	createHiddenInput(props: ComboboxHiddenInputStateProps) {
		return new ComboboxHiddenInputState(props, this);
	}
}

type ComboboxMultipleRootStateProps = ComboboxBaseRootStateProps &
	WritableBoxedValues<{
		value: string[];
	}>;

class ComboboxMultipleRootState extends ComboboxBaseRootState {
	value: ComboboxMultipleRootStateProps["value"];
	isMulti = true as const;
	hasValue = $derived.by(() => this.value.value.length > 0);

	constructor(props: ComboboxMultipleRootStateProps) {
		super(props);
		this.value = props.value;

		$effect(() => {
			if (!this.open.value) return;
			afterTick(() => {
				this.#setInitialHighlightedNode();
			});
		});
	}

	includesItem = (itemValue: string) => {
		return this.value.value.includes(itemValue);
	};

	toggleItem = (itemValue: string, itemLabel: string = itemValue) => {
		if (this.includesItem(itemValue)) {
			this.value.value = this.value.value.filter((v) => v !== itemValue);
		} else {
			this.value.value = [...this.value.value, itemValue];
		}
		this.inputValue = itemLabel;
	};

	#setInitialHighlightedNode = () => {
		if (this.highlightedNode) return;
		if (this.value.value.length && this.value.value[0] !== "") {
			const node = this.getNodeByValue(this.value.value[0]!);
			if (node) {
				this.highlightedNode = node;
				return;
			}
		}
		// if no value is set, we want to highlight the first item
		const firstCandidate = this.getCandidateNodes()[0];
		if (!firstCandidate) return;
		this.highlightedNode = firstCandidate;
	};

	createInput(props: ComboboxInputStateProps) {
		return new ComboboxInputState(props, this);
	}

	createContent(props: ComboboxContentStateProps) {
		return new ComboboxContentState(props, this);
	}

	createTrigger(props: ComboboxTriggerStateProps) {
		return new ComboboxTriggerState(props, this);
	}

	createItem(props: ComboboxItemStateProps) {
		return new ComboboxItemState(props, this);
	}

	createGroup(props: ComboboxGroupStateProps) {
		return new ComboboxGroupState(props);
	}

	createHiddenInput(props: ComboboxHiddenInputStateProps) {
		return new ComboboxHiddenInputState(props, this);
	}
}

type ComboboxRootState = ComboboxSingleRootState | ComboboxMultipleRootState;

type ComboboxInputStateProps = WithRefProps;

class ComboboxInputState {
	#id: ComboboxInputStateProps["id"];
	#ref: ComboboxInputStateProps["ref"];
	root: ComboboxRootState;

	constructor(props: ComboboxInputStateProps, root: ComboboxRootState) {
		this.root = root;
		this.#id = props.id;
		this.#ref = props.ref;

		useRefById({
			id: this.#id,
			ref: this.#ref,
			onRefChange: (node) => {
				this.root.inputNode = node;
			},
		});
	}

	#onkeydown = async (e: KeyboardEvent) => {
		const open = this.root.open.value;
		const inputValue = this.root.inputValue;

		// prevent arrow up/down from moving the position of the cursor in the input
		if (e.key === kbd.ARROW_UP || e.key === kbd.ARROW_DOWN) e.preventDefault();
		if (!open) {
			if (INTERACTION_KEYS.includes(e.key)) return;
			if (e.key === kbd.TAB) return;
			if (e.key === kbd.BACKSPACE && inputValue === "") return;
			this.root.openMenu();

			if (this.root.hasValue) return;
			await tick();

			const candidateNodes = this.root.getCandidateNodes();
			if (!candidateNodes.length) return;

			if (e.key === kbd.ARROW_DOWN) {
				const firstCandidate = candidateNodes[0]!;
				this.root.setHighlightedNode(firstCandidate);
				firstCandidate.scrollIntoView({ block: this.root.scrollAlignment.value });
			} else if (e.key === kbd.ARROW_UP) {
				const lastCandidate = candidateNodes[candidateNodes.length - 1]!;
				this.root.setHighlightedNode(lastCandidate);
				lastCandidate.scrollIntoView({ block: this.root.scrollAlignment.value });
			}
			return;
		}

		if (e.key === kbd.TAB) {
			this.root.closeMenu();
			return;
		}

		if (e.key === kbd.ENTER && !e.isComposing) {
			e.preventDefault();
			const highlightedValue = this.root.highlightedValue;
			if (highlightedValue) {
				this.root.toggleItem(highlightedValue, this.root.highlightedLabel ?? undefined);
			}
			if (!this.root.isMulti) {
				this.root.closeMenu();
			}
		}

		if (e.key === kbd.ARROW_UP && e.altKey) {
			this.root.closeMenu();
		}

		if (FIRST_LAST_KEYS.includes(e.key)) {
			e.preventDefault();
			const candidateNodes = this.root.getCandidateNodes();
			const currHighlightedNode = this.root.highlightedNode;
			const currIndex = currHighlightedNode
				? candidateNodes.indexOf(currHighlightedNode)
				: -1;

			const loop = this.root.loop.value;
			const scrollAlignment = this.root.scrollAlignment.value;
			let nextItem: HTMLElement | undefined;

			if (e.key === kbd.ARROW_DOWN) {
				nextItem = next(candidateNodes, currIndex, loop);
			} else if (e.key == kbd.ARROW_UP) {
				nextItem = prev(candidateNodes, currIndex, loop);
			} else if (e.key === kbd.PAGE_DOWN) {
				nextItem = forward(candidateNodes, currIndex, 10, loop);
			} else if (e.key === kbd.PAGE_UP) {
				nextItem = backward(candidateNodes, currIndex, 10, loop);
			} else if (e.key === kbd.HOME) {
				nextItem = candidateNodes[0];
			} else if (e.key === kbd.END) {
				nextItem = candidateNodes[candidateNodes.length - 1];
			}
			if (!nextItem) return;
			this.root.setHighlightedNode(nextItem);
			nextItem.scrollIntoView({ block: scrollAlignment });
			return;
		}

		if (INTERACTION_KEYS.includes(e.key)) return;
		// this.root.setHighlightedToFirstCandidate();
	};

	#oninput = (e: Event & { currentTarget: HTMLInputElement }) => {
		this.root.inputValue = e.currentTarget.value;
		this.root.setHighlightedToFirstCandidate();
	};

	props = $derived.by(
		() =>
			({
				id: this.#id.value,
				role: "combobox",
				"aria-activedescendant": this.root.highlightedId,
				"aria-autocomplete": "list",
				"aria-expanded": getAriaExpanded(this.root.open.value),
				"data-state": getDataOpenClosed(this.root.open.value),
				"data-disabled": getDataDisabled(this.root.disabled.value),
				disabled: this.root.disabled.value ? true : undefined,
				onkeydown: this.#onkeydown,
				oninput: this.#oninput,
				[COMBOBOX_INPUT_ATTR]: "",
			}) as const
	);
}

type ComboboxTriggerStateProps = WithRefProps;

class ComboboxTriggerState {
	#id: ComboboxTriggerStateProps["id"];
	#ref: ComboboxTriggerStateProps["ref"];
	root: ComboboxBaseRootState;

	constructor(props: ComboboxTriggerStateProps, root: ComboboxBaseRootState) {
		this.root = root;
		this.#id = props.id;
		this.#ref = props.ref;

		useRefById({
			id: this.#id,
			ref: this.#ref,
			onRefChange: (node) => {
				this.root.triggerNode = node;
			},
		});
	}

	/**
	 * `pointerdown` fires before the `focus` event, so we can prevent the default
	 * behavior of focusing the button and keep focus on the input.
	 */
	#onpointerdown = (e: MouseEvent) => {
		if (this.root.disabled.value) return;
		e.preventDefault();
		if (document.activeElement !== this.root.inputNode) {
			this.root.inputNode?.focus();
		}
		this.root.toggleMenu();
	};

	props = $derived.by(() => ({
		id: this.#id.value,
		"aria-haspopup": "listbox",
		"data-state": getDataOpenClosed(this.root.open.value),
		"data-disabled": getDataDisabled(this.root.disabled.value),
		disabled: this.root.disabled.value ? true : undefined,
		onpointerdown: this.#onpointerdown,
		[COMBOBOX_TRIGGER_ATTR]: "",
	}));
}

type ComboboxContentStateProps = WithRefProps;

class ComboboxContentState {
	#id: ComboboxContentStateProps["id"];
	#ref: ComboboxContentStateProps["ref"];
	root: ComboboxRootState;

	constructor(props: ComboboxContentStateProps, root: ComboboxRootState) {
		this.root = root;
		this.#id = props.id;
		this.#ref = props.ref;

		useRefById({
			id: this.#id,
			ref: this.#ref,
			onRefChange: (node) => {
				this.root.contentNode = node;
			},
			condition: () => this.root.open.value,
		});

		onDestroy(() => {
			this.root.contentNode = null;
		});
	}

	props = $derived.by(
		() =>
			({
				id: this.#id.value,
				role: "listbox",
				"data-state": getDataOpenClosed(this.root.open.value),
				[COMBOBOX_CONTENT_ATTR]: "",
			}) as const
	);
}

type ComboboxItemStateProps = WithRefProps<
	ReadableBoxedValues<{ value: string; disabled: boolean; label: string }>
>;

class ComboboxItemState {
	#id: ComboboxItemStateProps["id"];
	#ref: ComboboxItemStateProps["ref"];
	root: ComboboxRootState;
	value: ComboboxItemStateProps["value"];
	label: ComboboxItemStateProps["label"];
	disabled: ComboboxItemStateProps["disabled"];
	isSelected = $derived.by(() => this.root.includesItem(this.value.value));
	isHighlighted = $derived.by(() => this.root.highlightedValue === this.value.value);

	constructor(props: ComboboxItemStateProps, root: ComboboxRootState) {
		this.root = root;
		this.value = props.value;
		this.disabled = props.disabled;
		this.label = props.label;
		this.#id = props.id;
		this.#ref = props.ref;

		useRefById({
			id: this.#id,
			ref: this.#ref,
		});
	}

	snippetProps = $derived.by(() => ({
		selected: this.isSelected,
		highlighted: this.isHighlighted,
	}));

	/**
	 * Using `pointerup` instead of `click` allows power users to pointerdown
	 * the trigger, then release pointerup on an item to select it vs having to do
	 * multiple clicks.
	 */
	#onpointerup = (e: PointerEvent) => {
		// prevent any default behavior
		e.preventDefault();
		if (this.disabled.value) return;
		this.root.toggleItem(this.value.value, this.label.value);
		if (!this.root.isMulti) {
			this.root.closeMenu();
		}
	};

	#onpointermove = (_: PointerEvent) => {
		this.root.setHighlightedNode(this.#ref.value);
	};

	#onpointerleave = (_: PointerEvent) => {
		if (this.root.highlightedNode === this.#ref.value) {
			this.root.setHighlightedNode(null);
		}
	};

	props = $derived.by(
		() =>
			({
				id: this.#id.value,
				"data-value": this.value.value,
				"data-disabled": getDataDisabled(this.disabled.value),
				"data-highlighted":
					this.root.highlightedValue === this.value.value ? "" : undefined,
				"data-selected": this.root.includesItem(this.value.value) ? "" : undefined,
				"aria-selected": this.root.includesItem(this.value.value) ? "true" : undefined,
				"data-label": this.label.value,
				[COMBOBOX_ITEM_ATTR]: "",
				onpointermove: this.#onpointermove,
				onpointerleave: this.#onpointerleave,
				onpointerup: this.#onpointerup,
			}) as const
	);
}

type ComboboxGroupStateProps = WithRefProps;

class ComboboxGroupState {
	#id: ComboboxGroupStateProps["id"];
	#ref: ComboboxGroupStateProps["ref"];
	labelNode = $state<HTMLElement | null>(null);

	constructor(props: ComboboxGroupStateProps) {
		this.#id = props.id;
		this.#ref = props.ref;

		useRefById({
			id: this.#id,
			ref: this.#ref,
		});
	}

	props = $derived.by(
		() =>
			({
				id: this.#id.value,
				role: "group",
				[COMBOBOX_GROUP_ATTR]: "",
				"aria-labelledby": this.labelNode?.id ?? undefined,
			}) as const
	);

	createGroupLabel(props: ComboboxGroupLabelStateProps) {
		return new ComboboxGroupLabelState(props, this);
	}
}

type ComboboxGroupLabelStateProps = WithRefProps;

class ComboboxGroupLabelState {
	#id: ComboboxGroupLabelStateProps["id"];
	#ref: ComboboxGroupLabelStateProps["ref"];

	constructor(props: ComboboxGroupLabelStateProps, group: ComboboxGroupState) {
		this.#id = props.id;
		this.#ref = props.ref;

		useRefById({
			id: this.#id,
			ref: this.#ref,
			onRefChange: (node) => {
				group.labelNode = node;
			},
		});
	}

	props = $derived.by(
		() =>
			({
				id: this.#id.value,
				[COMBOBOX_GROUP_LABEL_ATTR]: "",
			}) as const
	);
}

type ComboboxHiddenInputStateProps = ReadableBoxedValues<{
	value: string;
}>;

class ComboboxHiddenInputState {
	#value: ComboboxHiddenInputStateProps["value"];
	root: ComboboxRootState;
	shouldRender = $derived.by(() => this.root.name.value !== "");

	constructor(props: ComboboxHiddenInputStateProps, root: ComboboxRootState) {
		this.root = root;
		this.#value = props.value;
	}

	props = $derived.by(
		() =>
			({
				disabled: getDisabled(this.root.disabled.value),
				required: getRequired(this.root.required.value),
				name: this.root.name.value,
				value: this.#value.value,
				"aria-hidden": getAriaHidden(true),
			}) as const
	);
}

type InitComboboxProps = {
	type: "single" | "multiple";
	value: Box<string> | Box<string[]>;
} & ReadableBoxedValues<{
	disabled: boolean;
	required: boolean;
	loop: boolean;
	scrollAlignment: "nearest" | "center";
	name: string;
}> &
	WritableBoxedValues<{
		open: boolean;
	}>;

const [setComboboxRootContext, getComboboxRootContext] =
	createContext<ComboboxRootState>("Combobox.Root");

const [setComboboxGroupContext, getComboboxGroupContext] =
	createContext<ComboboxGroupState>("Combobox.Group");

export function useComboboxRoot(props: InitComboboxProps) {
	const { type, ...rest } = props;

	const rootState =
		type === "single"
			? new ComboboxSingleRootState(rest as ComboboxSingleRootStateProps)
			: new ComboboxMultipleRootState(rest as ComboboxMultipleRootStateProps);

	return setComboboxRootContext(rootState);
}

export function useComboboxInput(props: ComboboxInputStateProps) {
	return getComboboxRootContext().createInput(props);
}

export function useComboboxContent(props: ComboboxContentStateProps) {
	return getComboboxRootContext().createContent(props);
}

export function useComboboxTrigger(props: ComboboxTriggerStateProps) {
	return getComboboxRootContext().createTrigger(props);
}

export function useComboboxItem(props: ComboboxItemStateProps) {
	return getComboboxRootContext().createItem(props);
}

export function useComboboxGroup(props: ComboboxGroupStateProps) {
	return setComboboxGroupContext(getComboboxRootContext().createGroup(props));
}

export function useComboboxGroupLabel(props: ComboboxGroupLabelStateProps) {
	return getComboboxGroupContext().createGroupLabel(props);
}

export function useComboboxHiddenInput(props: ComboboxHiddenInputStateProps) {
	return getComboboxRootContext().createHiddenInput(props);
}
