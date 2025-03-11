import { Context, Previous, watch } from "runed";
import { afterSleep, afterTick, onDestroyEffect, useRefById } from "svelte-toolbelt";
import { on } from "svelte/events";
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
import { kbd } from "$lib/internal/kbd.js";
import type {
	BitsEvent,
	BitsFocusEvent,
	BitsKeyboardEvent,
	BitsMouseEvent,
	BitsPointerEvent,
	WithRefProps,
} from "$lib/internal/types.js";
import { noop } from "$lib/internal/noop.js";
import { type DOMTypeahead, useDOMTypeahead } from "$lib/internal/use-dom-typeahead.svelte.js";
import { type DataTypeahead, useDataTypeahead } from "$lib/internal/use-data-typeahead.svelte.js";
import { isIOS } from "$lib/internal/is.js";

// prettier-ignore
export const INTERACTION_KEYS = [kbd.ARROW_LEFT, kbd.ESCAPE, kbd.ARROW_RIGHT, kbd.SHIFT, kbd.CAPS_LOCK, kbd.CONTROL, kbd.ALT, kbd.META, kbd.ENTER, kbd.F1, kbd.F2, kbd.F3, kbd.F4, kbd.F5, kbd.F6, kbd.F7, kbd.F8, kbd.F9, kbd.F10, kbd.F11, kbd.F12];

export const FIRST_KEYS = [kbd.ARROW_DOWN, kbd.PAGE_UP, kbd.HOME];
export const LAST_KEYS = [kbd.ARROW_UP, kbd.PAGE_DOWN, kbd.END];
export const FIRST_LAST_KEYS = [...FIRST_KEYS, ...LAST_KEYS];
export const SELECTION_KEYS = [kbd.ENTER, kbd.SPACE];

export const CONTENT_MARGIN = 10;

type SelectBaseRootStateProps = ReadableBoxedValues<{
	disabled: boolean;
	required: boolean;
	name: string;
	loop: boolean;
	scrollAlignment: "nearest" | "center";
	items: { value: string; label: string; disabled?: boolean }[];
	allowDeselect: boolean;
}> &
	WritableBoxedValues<{
		open: boolean;
	}> & {
		isCombobox: boolean;
	};

class SelectBaseRootState {
	touchedInput = $state(false);
	inputValue = $state<string>("");
	inputNode = $state<HTMLElement | null>(null);
	contentNode = $state<HTMLElement | null>(null);
	triggerNode = $state<HTMLElement | null>(null);
	valueId = $state("");
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
	isUsingKeyboard = false;
	isCombobox = false;
	bitsAttrs: SelectBitsAttrs;

	constructor(readonly opts: SelectBaseRootStateProps) {
		this.isCombobox = opts.isCombobox;
		this.bitsAttrs = getSelectBitsAttrs(this);
		$effect.pre(() => {
			if (!this.opts.open.current) {
				this.setHighlightedNode(null);
			}
		});
	}

	setHighlightedNode(node: HTMLElement | null, initial = false) {
		this.highlightedNode = node;
		if (node && (this.isUsingKeyboard || initial)) {
			node.scrollIntoView({ block: "nearest" });
		}
	}

	getCandidateNodes(): HTMLElement[] {
		const node = this.contentNode;
		if (!node) return [];
		const nodes = Array.from(
			node.querySelectorAll<HTMLElement>(`[${this.bitsAttrs.item}]:not([data-disabled])`)
		);
		return nodes;
	}

	setHighlightedToFirstCandidate() {
		this.setHighlightedNode(null);
		const candidateNodes = this.getCandidateNodes();
		if (!candidateNodes.length) return;
		this.setHighlightedNode(candidateNodes[0]!);
	}

	getNodeByValue(value: string): HTMLElement | null {
		const candidateNodes = this.getCandidateNodes();
		return candidateNodes.find((node) => node.dataset.value === value) ?? null;
	}

	setOpen(open: boolean) {
		this.opts.open.current = open;
	}

	toggleOpen() {
		this.opts.open.current = !this.opts.open.current;
	}

	handleOpen() {
		this.setOpen(true);
	}

	handleClose() {
		this.setHighlightedNode(null);
		this.setOpen(false);
	}

	toggleMenu() {
		this.toggleOpen();
	}
}

type SelectSingleRootStateProps = SelectBaseRootStateProps &
	WritableBoxedValues<{
		value: string;
	}>;

class SelectSingleRootState extends SelectBaseRootState {
	isMulti = false as const;
	hasValue = $derived.by(() => this.opts.value.current !== "");
	currentLabel = $derived.by(() => {
		if (!this.opts.items.current.length) return "";
		const match = this.opts.items.current.find(
			(item) => item.value === this.opts.value.current
		)?.label;
		return match ?? "";
	});
	candidateLabels: string[] = $derived.by(() => {
		if (!this.opts.items.current.length) return [];
		const filteredItems = this.opts.items.current.filter((item) => !item.disabled);
		return filteredItems.map((item) => item.label);
	});
	dataTypeaheadEnabled = $derived.by(() => {
		if (this.isMulti) return false;
		if (this.opts.items.current.length === 0) return false;
		return true;
	});

	constructor(readonly opts: SelectSingleRootStateProps) {
		super(opts);

		$effect(() => {
			if (!this.opts.open.current && this.highlightedNode) {
				this.setHighlightedNode(null);
			}
		});

		watch(
			() => this.opts.open.current,
			() => {
				if (!this.opts.open.current) return;
				this.setInitialHighlightedNode();
			}
		);
	}

	includesItem(itemValue: string) {
		return this.opts.value.current === itemValue;
	}

	toggleItem(itemValue: string, itemLabel: string = itemValue) {
		this.opts.value.current = this.includesItem(itemValue) ? "" : itemValue;
		this.inputValue = itemLabel;
	}

	setInitialHighlightedNode() {
		afterTick(() => {
			if (this.highlightedNode && document.contains(this.highlightedNode)) return;
			if (this.opts.value.current !== "") {
				const node = this.getNodeByValue(this.opts.value.current);
				if (node) {
					this.setHighlightedNode(node, true);
					return;
				}
			}
			// if no value is set, we want to highlight the first item
			const firstCandidate = this.getCandidateNodes()[0];
			if (!firstCandidate) return;
			this.setHighlightedNode(firstCandidate, true);
		});
	}
}

type SelectMultipleRootStateProps = SelectBaseRootStateProps &
	WritableBoxedValues<{
		value: string[];
	}>;

class SelectMultipleRootState extends SelectBaseRootState {
	isMulti = true as const;
	hasValue = $derived.by(() => this.opts.value.current.length > 0);

	constructor(readonly opts: SelectMultipleRootStateProps) {
		super(opts);

		$effect(() => {
			if (!this.opts.open.current && this.highlightedNode) {
				this.setHighlightedNode(null);
			}
		});

		watch(
			() => this.opts.open.current,
			() => {
				if (!this.opts.open.current) return;
				this.setInitialHighlightedNode();
			}
		);
	}

	includesItem(itemValue: string) {
		return this.opts.value.current.includes(itemValue);
	}

	toggleItem(itemValue: string, itemLabel: string = itemValue) {
		if (this.includesItem(itemValue)) {
			this.opts.value.current = this.opts.value.current.filter((v) => v !== itemValue);
		} else {
			this.opts.value.current = [...this.opts.value.current, itemValue];
		}
		this.inputValue = itemLabel;
	}

	setInitialHighlightedNode() {
		afterTick(() => {
			if (this.highlightedNode && document.contains(this.highlightedNode)) return;
			if (this.opts.value.current.length && this.opts.value.current[0] !== "") {
				const node = this.getNodeByValue(this.opts.value.current[0]!);
				if (node) {
					this.setHighlightedNode(node, true);
					return;
				}
			}
			// if no value is set, we want to highlight the first item
			const firstCandidate = this.getCandidateNodes()[0];
			if (!firstCandidate) return;
			this.setHighlightedNode(firstCandidate, true);
		});
	}
}

type SelectRootState = SelectSingleRootState | SelectMultipleRootState;

type SelectInputStateProps = WithRefProps &
	ReadableBoxedValues<{
		clearOnDeselect: boolean;
	}>;

class SelectInputState {
	constructor(
		readonly opts: SelectInputStateProps,
		readonly root: SelectRootState
	) {
		useRefById({
			...opts,
			onRefChange: (node) => {
				this.root.inputNode = node;
			},
		});

		this.onkeydown = this.onkeydown.bind(this);
		this.oninput = this.oninput.bind(this);

		watch(
			[() => this.root.opts.value.current, () => this.opts.clearOnDeselect.current],
			([value, clearOnDeselect], [prevValue]) => {
				if (!clearOnDeselect) return;
				if (Array.isArray(value) && Array.isArray(prevValue)) {
					if (value.length === 0 && prevValue.length !== 0) {
						this.root.inputValue = "";
					}
				} else if (value === "" && prevValue !== "") {
					this.root.inputValue = "";
				}
			}
		);
	}

	onkeydown(e: BitsKeyboardEvent) {
		this.root.isUsingKeyboard = true;
		if (e.key === kbd.ESCAPE) return;

		// prevent arrow up/down from moving the position of the cursor in the input
		if (e.key === kbd.ARROW_UP || e.key === kbd.ARROW_DOWN) e.preventDefault();
		if (!this.root.opts.open.current) {
			if (INTERACTION_KEYS.includes(e.key)) return;
			if (e.key === kbd.TAB) return;
			if (e.key === kbd.BACKSPACE && this.root.inputValue === "") return;
			this.root.handleOpen();
			// we need to wait for a tick after the menu opens to ensure the highlighted nodes are
			// set correctly.
			if (this.root.hasValue) return;
			const candidateNodes = this.root.getCandidateNodes();
			if (!candidateNodes.length) return;

			if (e.key === kbd.ARROW_DOWN) {
				const firstCandidate = candidateNodes[0]!;
				this.root.setHighlightedNode(firstCandidate);
			} else if (e.key === kbd.ARROW_UP) {
				const lastCandidate = candidateNodes[candidateNodes.length - 1]!;
				this.root.setHighlightedNode(lastCandidate);
			}
			return;
		}

		if (e.key === kbd.TAB) {
			this.root.handleClose();
			return;
		}

		if (e.key === kbd.ENTER && !e.isComposing) {
			e.preventDefault();

			const isCurrentSelectedValue =
				this.root.highlightedValue === this.root.opts.value.current;

			if (
				!this.root.opts.allowDeselect.current &&
				isCurrentSelectedValue &&
				!this.root.isMulti
			) {
				this.root.handleClose();
				return;
			}

			if (this.root.highlightedValue) {
				this.root.toggleItem(
					this.root.highlightedValue,
					this.root.highlightedLabel ?? undefined
				);
			}
			if (!this.root.isMulti && !isCurrentSelectedValue) {
				this.root.handleClose();
			}
		}

		if (e.key === kbd.ARROW_UP && e.altKey) {
			this.root.handleClose();
		}

		if (FIRST_LAST_KEYS.includes(e.key)) {
			e.preventDefault();
			const candidateNodes = this.root.getCandidateNodes();
			const currHighlightedNode = this.root.highlightedNode;
			const currIndex = currHighlightedNode
				? candidateNodes.indexOf(currHighlightedNode)
				: -1;

			const loop = this.root.opts.loop.current;
			let nextItem: HTMLElement | undefined;

			if (e.key === kbd.ARROW_DOWN) {
				nextItem = next(candidateNodes, currIndex, loop);
			} else if (e.key === kbd.ARROW_UP) {
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
			return;
		}

		if (INTERACTION_KEYS.includes(e.key)) return;
		if (!this.root.highlightedNode) {
			this.root.setHighlightedToFirstCandidate();
		}
	}

	oninput(e: BitsEvent<Event, HTMLInputElement>) {
		this.root.inputValue = e.currentTarget.value;
		this.root.setHighlightedToFirstCandidate();
	}

	props = $derived.by(
		() =>
			({
				id: this.opts.id.current,
				role: "combobox",
				disabled: this.root.opts.disabled.current ? true : undefined,
				"aria-activedescendant": this.root.highlightedId,
				"aria-autocomplete": "list",
				"aria-expanded": getAriaExpanded(this.root.opts.open.current),
				"data-state": getDataOpenClosed(this.root.opts.open.current),
				"data-disabled": getDataDisabled(this.root.opts.disabled.current),
				onkeydown: this.onkeydown,
				oninput: this.oninput,
				[this.root.bitsAttrs.input]: "",
			}) as const
	);
}

type SelectComboTriggerStateProps = WithRefProps;

class SelectComboTriggerState {
	constructor(
		readonly opts: SelectComboTriggerStateProps,
		readonly root: SelectBaseRootState
	) {
		useRefById(opts);

		this.onkeydown = this.onkeydown.bind(this);
		this.onpointerdown = this.onpointerdown.bind(this);
	}

	onkeydown(e: BitsKeyboardEvent) {
		if (e.key === kbd.ENTER || e.key === kbd.SPACE) {
			e.preventDefault();
			if (document.activeElement !== this.root.inputNode) {
				this.root.inputNode?.focus();
			}
			this.root.toggleMenu();
		}
	}

	/**
	 * `pointerdown` fires before the `focus` event, so we can prevent the default
	 * behavior of focusing the button and keep focus on the input.
	 */
	onpointerdown(e: BitsPointerEvent) {
		if (this.root.opts.disabled.current) return;
		e.preventDefault();
		if (document.activeElement !== this.root.inputNode) {
			this.root.inputNode?.focus();
		}
		this.root.toggleMenu();
	}

	props = $derived.by(
		() =>
			({
				id: this.opts.id.current,
				disabled: this.root.opts.disabled.current ? true : undefined,
				"aria-haspopup": "listbox",
				"data-state": getDataOpenClosed(this.root.opts.open.current),
				"data-disabled": getDataDisabled(this.root.opts.disabled.current),
				[this.root.bitsAttrs.trigger]: "",
				onpointerdown: this.onpointerdown,
				onkeydown: this.onkeydown,
			}) as const
	);
}

type SelectTriggerStateProps = WithRefProps;

class SelectTriggerState {
	#domTypeahead: DOMTypeahead;
	#dataTypeahead: DataTypeahead;

	constructor(
		readonly opts: SelectTriggerStateProps,
		readonly root: SelectRootState
	) {
		useRefById({
			...opts,
			onRefChange: (node) => {
				this.root.triggerNode = node;
			},
		});

		this.#domTypeahead = useDOMTypeahead({
			getCurrentItem: () => this.root.highlightedNode,
			onMatch: (node) => {
				this.root.setHighlightedNode(node);
			},
		});

		this.#dataTypeahead = useDataTypeahead({
			getCurrentItem: () => {
				if (this.root.isMulti) return "";
				return this.root.currentLabel;
			},
			onMatch: (label: string) => {
				if (this.root.isMulti) return;
				if (!this.root.opts.items.current) return;
				const matchedItem = this.root.opts.items.current.find(
					(item) => item.label === label
				);
				if (!matchedItem) return;
				this.root.opts.value.current = matchedItem.value;
			},
			enabled: !this.root.isMulti && this.root.dataTypeaheadEnabled,
		});

		this.onkeydown = this.onkeydown.bind(this);
		this.onpointerdown = this.onpointerdown.bind(this);
		this.onpointerup = this.onpointerup.bind(this);
		this.onclick = this.onclick.bind(this);
	}

	#handleOpen() {
		this.root.opts.open.current = true;
		this.#dataTypeahead.resetTypeahead();
		this.#domTypeahead.resetTypeahead();
	}

	#handlePointerOpen(_: PointerEvent) {
		this.#handleOpen();
	}

	onkeydown(e: BitsKeyboardEvent) {
		this.root.isUsingKeyboard = true;
		if (e.key === kbd.ARROW_UP || e.key === kbd.ARROW_DOWN) e.preventDefault();

		if (!this.root.opts.open.current) {
			if (
				e.key === kbd.ENTER ||
				e.key === kbd.SPACE ||
				e.key === kbd.ARROW_DOWN ||
				e.key === kbd.ARROW_UP
			) {
				e.preventDefault();
				this.root.handleOpen();
			} else if (!this.root.isMulti && this.root.dataTypeaheadEnabled) {
				this.#dataTypeahead.handleTypeaheadSearch(e.key, this.root.candidateLabels);
				return;
			}

			// we need to wait for a tick after the menu opens to ensure
			// the highlighted nodes are set correctly
			if (this.root.hasValue) return;
			const candidateNodes = this.root.getCandidateNodes();
			if (!candidateNodes.length) return;

			if (e.key === kbd.ARROW_DOWN) {
				const firstCandidate = candidateNodes[0]!;
				this.root.setHighlightedNode(firstCandidate);
			} else if (e.key === kbd.ARROW_UP) {
				const lastCandidate = candidateNodes[candidateNodes.length - 1]!;
				this.root.setHighlightedNode(lastCandidate);
			}
			return;
		}

		if (e.key === kbd.TAB) {
			this.root.handleClose();
			return;
		}

		if ((e.key === kbd.ENTER || e.key === kbd.SPACE) && !e.isComposing) {
			e.preventDefault();

			const isCurrentSelectedValue =
				this.root.highlightedValue === this.root.opts.value.current;

			if (
				!this.root.opts.allowDeselect.current &&
				isCurrentSelectedValue &&
				!this.root.isMulti
			) {
				this.root.handleClose();
				return;
			}

			//"" is a valid value for a select item so we need to check for that
			if (this.root.highlightedValue !== null) {
				this.root.toggleItem(
					this.root.highlightedValue,
					this.root.highlightedLabel ?? undefined
				);
			}

			if (!this.root.isMulti && !isCurrentSelectedValue) {
				this.root.handleClose();
				return;
			}
		}

		if (e.key === kbd.ARROW_UP && e.altKey) {
			this.root.handleClose();
		}

		if (FIRST_LAST_KEYS.includes(e.key)) {
			e.preventDefault();
			const candidateNodes = this.root.getCandidateNodes();
			const currHighlightedNode = this.root.highlightedNode;
			const currIndex = currHighlightedNode
				? candidateNodes.indexOf(currHighlightedNode)
				: -1;

			const loop = this.root.opts.loop.current;
			let nextItem: HTMLElement | undefined;

			if (e.key === kbd.ARROW_DOWN) {
				nextItem = next(candidateNodes, currIndex, loop);
			} else if (e.key === kbd.ARROW_UP) {
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
			return;
		}
		const isModifierKey = e.ctrlKey || e.altKey || e.metaKey;
		const isCharacterKey = e.key.length === 1;

		// prevent space from being considered with typeahead
		if (e.code === "Space") return;

		const candidateNodes = this.root.getCandidateNodes();

		if (e.key === kbd.TAB) return;

		if (!isModifierKey && isCharacterKey) {
			this.#domTypeahead.handleTypeaheadSearch(e.key, candidateNodes);
			return;
		}

		if (!this.root.highlightedNode) {
			this.root.setHighlightedToFirstCandidate();
		}
	}

	onclick(e: BitsMouseEvent) {
		// While browsers generally have no issue focusing the trigger when clicking
		// on a label, Safari seems to struggle with the fact that there's no `onClick`.
		// We force `focus` in this case. Note: this doesn't create any other side-effect
		// because we are preventing default in `onpointerdown` so effectively
		// this only runs for a label 'click'
		const currTarget = e.currentTarget as HTMLElement;
		currTarget.focus();
	}

	onpointerdown(e: BitsPointerEvent) {
		if (this.root.opts.disabled.current) return;
		// prevent opening on touch down which can be triggered when scrolling on touch devices
		if (e.pointerType === "touch") return e.preventDefault();

		// prevent implicit pointer capture
		const target = e.target as HTMLElement;
		if (target?.hasPointerCapture(e.pointerId)) {
			target?.releasePointerCapture(e.pointerId);
		}

		// only call the handle if it's a left click, since pointerdown is triggered
		// by right clicks as well, but not when ctrl is pressed
		if (e.button === 0 && e.ctrlKey === false) {
			if (this.root.opts.open.current === false) {
				this.#handlePointerOpen(e);
			} else {
				this.root.handleClose();
			}
		}
	}

	onpointerup(e: BitsPointerEvent) {
		e.preventDefault();
		if (e.pointerType === "touch") {
			if (this.root.opts.open.current === false) {
				this.#handlePointerOpen(e);
			} else {
				this.root.handleClose();
			}
		}
	}

	props = $derived.by(
		() =>
			({
				id: this.opts.id.current,
				disabled: this.root.opts.disabled.current ? true : undefined,
				"aria-haspopup": "listbox",
				"aria-expanded": getAriaExpanded(this.root.opts.open.current),
				"aria-activedescendant": this.root.highlightedId,
				"data-state": getDataOpenClosed(this.root.opts.open.current),
				"data-disabled": getDataDisabled(this.root.opts.disabled.current),
				"data-placeholder": this.root.hasValue ? undefined : "",
				[this.root.bitsAttrs.trigger]: "",
				onpointerdown: this.onpointerdown,
				onkeydown: this.onkeydown,
				onclick: this.onclick,
				onpointerup: this.onpointerup,
			}) as const
	);
}

type SelectContentStateProps = WithRefProps &
	ReadableBoxedValues<{
		onInteractOutside: (e: PointerEvent) => void;
		onEscapeKeydown: (e: KeyboardEvent) => void;
	}>;

class SelectContentState {
	viewportNode = $state<HTMLElement | null>(null);
	isPositioned = $state(false);

	constructor(
		readonly opts: SelectContentStateProps,
		readonly root: SelectRootState
	) {
		useRefById({
			...opts,
			onRefChange: (node) => {
				this.root.contentNode = node;
			},
			deps: () => this.root.opts.open.current,
		});

		onDestroyEffect(() => {
			this.root.contentNode = null;
			this.isPositioned = false;
		});

		watch(
			() => this.root.opts.open.current,
			() => {
				if (this.root.opts.open.current) return;
				this.isPositioned = false;
			}
		);

		this.onpointermove = this.onpointermove.bind(this);
	}

	onpointermove(_: BitsPointerEvent) {
		this.root.isUsingKeyboard = false;
	}

	#styles = $derived.by(() => {
		const prefix = this.root.isCombobox ? "--bits-combobox" : "--bits-select";
		return {
			[`${prefix}-content-transform-origin`]: "var(--bits-floating-transform-origin)",
			[`${prefix}-content-available-width`]: "var(--bits-floating-available-width)",
			[`${prefix}-content-available-height`]: "var(--bits-floating-available-height)",
			[`${prefix}-anchor-width`]: " var(--bits-floating-anchor-width)",
			[`${prefix}-anchor-height`]: "var(--bits-floating-anchor-height)",
		};
	});

	onInteractOutside = (e: PointerEvent) => {
		if (e.target === this.root.triggerNode || e.target === this.root.inputNode) {
			e.preventDefault();
			return;
		}
		this.opts.onInteractOutside.current(e);
		if (e.defaultPrevented) return;
		this.root.handleClose();
	};

	onEscapeKeydown = (e: KeyboardEvent) => {
		this.opts.onEscapeKeydown.current(e);
		if (e.defaultPrevented) return;
		this.root.handleClose();
	};

	onOpenAutoFocus = (e: Event) => {
		e.preventDefault();
	};

	onCloseAutoFocus = (e: Event) => {
		e.preventDefault();
	};

	snippetProps = $derived.by(() => ({ open: this.root.opts.open.current }));

	props = $derived.by(
		() =>
			({
				id: this.opts.id.current,
				role: "listbox",
				"aria-multiselectable": this.root.isMulti ? "true" : undefined,
				"data-state": getDataOpenClosed(this.root.opts.open.current),
				[this.root.bitsAttrs.content]: "",
				style: {
					display: "flex",
					flexDirection: "column",
					outline: "none",
					boxSizing: "border-box",
					pointerEvents: "auto",
					...this.#styles,
				},
				onpointermove: this.onpointermove,
			}) as const
	);

	popperProps = {
		onInteractOutside: this.onInteractOutside,
		onEscapeKeydown: this.onEscapeKeydown,
		onOpenAutoFocus: this.onOpenAutoFocus,
		onCloseAutoFocus: this.onCloseAutoFocus,
		trapFocus: false,
		loop: false,
		onPlaced: () => {
			this.isPositioned = true;
		},
	};
}

type SelectItemStateProps = WithRefProps<
	ReadableBoxedValues<{
		value: string;
		disabled: boolean;
		label: string;
		onHighlight: () => void;
		onUnhighlight: () => void;
	}>
>;

class SelectItemState {
	isSelected = $derived.by(() => this.root.includesItem(this.opts.value.current));
	isHighlighted = $derived.by(() => this.root.highlightedValue === this.opts.value.current);
	prevHighlighted = new Previous(() => this.isHighlighted);
	mounted = $state(false);

	constructor(
		readonly opts: SelectItemStateProps,
		readonly root: SelectRootState
	) {
		useRefById({
			...opts,
			deps: () => this.mounted,
		});

		watch([() => this.isHighlighted, () => this.prevHighlighted.current], () => {
			if (this.isHighlighted) {
				this.opts.onHighlight.current();
			} else if (this.prevHighlighted.current) {
				this.opts.onUnhighlight.current();
			}
		});

		watch(
			() => this.mounted,
			() => {
				if (!this.mounted) return;
				this.root.setInitialHighlightedNode();
			}
		);

		this.onpointerdown = this.onpointerdown.bind(this);
		this.onpointerup = this.onpointerup.bind(this);
		this.onpointermove = this.onpointermove.bind(this);
	}

	handleSelect() {
		if (this.opts.disabled.current) return;
		const isCurrentSelectedValue = this.opts.value.current === this.root.opts.value.current;

		// if allowDeselect is false and the item is already selected and we're not in a
		// multi select, do nothing and close the menu
		if (!this.root.opts.allowDeselect.current && isCurrentSelectedValue && !this.root.isMulti) {
			this.root.handleClose();
			return;
		}

		// otherwise, toggle the item and if we're not in a multi select, close the menu
		this.root.toggleItem(this.opts.value.current, this.opts.label.current);

		if (!this.root.isMulti && !isCurrentSelectedValue) {
			this.root.handleClose();
		}
	}

	snippetProps = $derived.by(() => ({
		selected: this.isSelected,
		highlighted: this.isHighlighted,
	}));

	onpointerdown(e: BitsPointerEvent) {
		// prevent focus from leaving the input/select trigger
		e.preventDefault();
	}

	/**
	 * Using `pointerup` instead of `click` allows power users to pointerdown
	 * the trigger, then release pointerup on an item to select it vs having to do
	 * multiple clicks.
	 */
	onpointerup(e: BitsPointerEvent) {
		if (e.defaultPrevented || !this.opts.ref.current) return;
		// prevent any default behavior

		/**
		 * For one reason or another, when it's a touch pointer and _not_ on IOS,
		 * we need to listen for the immediate click event to handle the selection,
		 * otherwise a click event will fire on the element _behind_ the item.
		 */
		if (e.pointerType === "touch" && !isIOS) {
			on(
				this.opts.ref.current,
				"click",
				() => {
					this.handleSelect();
					// set highlighted node since we don't do it on `pointermove` events
					// for touch devices
					this.root.setHighlightedNode(this.opts.ref.current);
				},
				{ once: true }
			);
			return;
		}
		e.preventDefault();

		this.handleSelect();
		if (e.pointerType === "touch") {
			// set highlighted node since we don't do it on `pointermove` events
			// for touch devices
			this.root.setHighlightedNode(this.opts.ref.current);
		}
	}

	onpointermove(e: BitsPointerEvent) {
		/**
		 * We don't want to highlight items on touch devices when scrolling,
		 * as this is confusing behavior, so we return here and instead handle
		 * the highlighting on the `pointerup` (or following `click`) event for
		 * touch devices only.
		 */
		if (e.pointerType === "touch") return;
		if (this.root.highlightedNode !== this.opts.ref.current) {
			this.root.setHighlightedNode(this.opts.ref.current);
		}
	}

	props = $derived.by(
		() =>
			({
				id: this.opts.id.current,
				role: "option",
				"aria-selected": this.root.includesItem(this.opts.value.current)
					? "true"
					: undefined,
				"data-value": this.opts.value.current,
				"data-disabled": getDataDisabled(this.opts.disabled.current),
				"data-highlighted":
					this.root.highlightedValue === this.opts.value.current ? "" : undefined,
				"data-selected": this.root.includesItem(this.opts.value.current) ? "" : undefined,
				"data-label": this.opts.label.current,
				[this.root.bitsAttrs.item]: "",
				onpointermove: this.onpointermove,
				onpointerdown: this.onpointerdown,
				onpointerup: this.onpointerup,
			}) as const
	);
}

type SelectGroupStateProps = WithRefProps;

class SelectGroupState {
	labelNode = $state<HTMLElement | null>(null);

	constructor(
		readonly opts: SelectGroupStateProps,
		readonly root: SelectBaseRootState
	) {
		useRefById(opts);
	}

	props = $derived.by(
		() =>
			({
				id: this.opts.id.current,
				role: "group",
				[this.root.bitsAttrs.group]: "",
				"aria-labelledby": this.labelNode?.id ?? undefined,
			}) as const
	);
}

type SelectGroupHeadingStateProps = WithRefProps;

class SelectGroupHeadingState {
	constructor(
		readonly opts: SelectGroupHeadingStateProps,
		readonly group: SelectGroupState
	) {
		useRefById({
			...opts,
			onRefChange: (node) => {
				group.labelNode = node;
			},
		});
	}

	props = $derived.by(
		() =>
			({
				id: this.opts.id.current,
				[this.group.root.bitsAttrs["group-label"]]: "",
			}) as const
	);
}

type SelectHiddenInputStateProps = ReadableBoxedValues<{
	value: string;
}>;

class SelectHiddenInputState {
	shouldRender = $derived.by(() => this.root.opts.name.current !== "");

	constructor(
		readonly opts: SelectHiddenInputStateProps,
		readonly root: SelectBaseRootState
	) {
		this.onfocus = this.onfocus.bind(this);
	}

	onfocus(e: BitsFocusEvent) {
		e.preventDefault();

		if (!this.root.isCombobox) {
			this.root.triggerNode?.focus();
		} else {
			this.root.inputNode?.focus();
		}
	}

	props = $derived.by(
		() =>
			({
				disabled: getDisabled(this.root.opts.disabled.current),
				required: getRequired(this.root.opts.required.current),
				name: this.root.opts.name.current,
				value: this.opts.value.current,
				onfocus: this.onfocus,
			}) as const
	);
}

type SelectViewportStateProps = WithRefProps;

class SelectViewportState {
	root: SelectBaseRootState;
	prevScrollTop = $state(0);

	constructor(
		readonly opts: SelectViewportStateProps,
		readonly content: SelectContentState
	) {
		this.root = content.root;

		useRefById({
			...opts,
			onRefChange: (node) => {
				this.content.viewportNode = node;
			},
			deps: () => this.root.opts.open.current,
		});
	}

	props = $derived.by(
		() =>
			({
				id: this.opts.id.current,
				role: "presentation",
				[this.root.bitsAttrs.viewport]: "",
				style: {
					// we use position: 'relative' here on the `viewport` so that when we call
					// `selectedItem.offsetTop` in calculations, the offset is relative to the viewport
					// (independent of the scrollUpButton).
					position: "relative",
					flex: 1,
					overflow: "auto",
				},
			}) as const
	);
}

type SelectScrollButtonImplStateProps = WithRefProps;

class SelectScrollButtonImplState {
	root: SelectBaseRootState;
	autoScrollInterval: number | null = null;
	userScrollTimer = -1;
	isUserScrolling = false;
	onAutoScroll: () => void = noop;
	mounted = $state(false);

	constructor(
		readonly opts: SelectScrollButtonImplStateProps,
		readonly content: SelectContentState
	) {
		this.root = content.root;

		useRefById({
			...opts,
			deps: () => this.mounted,
		});

		watch([() => this.mounted], () => {
			if (!this.mounted) {
				this.isUserScrolling = false;
				return;
			}
			if (this.isUserScrolling) return;
		});

		$effect(() => {
			if (this.mounted) return;
			this.clearAutoScrollInterval();
		});

		this.onpointerdown = this.onpointerdown.bind(this);
		this.onpointermove = this.onpointermove.bind(this);
		this.onpointerleave = this.onpointerleave.bind(this);
	}

	handleUserScroll() {
		window.clearTimeout(this.userScrollTimer);
		this.isUserScrolling = true;
		this.userScrollTimer = window.setTimeout(() => {
			this.isUserScrolling = false;
		}, 200);
	}

	clearAutoScrollInterval() {
		if (this.autoScrollInterval === null) return;
		window.clearInterval(this.autoScrollInterval);
		this.autoScrollInterval = null;
	}

	onpointerdown(_: BitsPointerEvent) {
		if (this.autoScrollInterval !== null) return;
		this.autoScrollInterval = window.setInterval(() => {
			this.onAutoScroll();
		}, 50);
	}

	onpointermove(_: BitsPointerEvent) {
		if (this.autoScrollInterval !== null) return;
		this.autoScrollInterval = window.setInterval(() => {
			this.onAutoScroll();
		}, 50);
	}

	onpointerleave(_: BitsPointerEvent) {
		this.clearAutoScrollInterval();
	}

	props = $derived.by(
		() =>
			({
				id: this.opts.id.current,
				"aria-hidden": getAriaHidden(true),
				style: {
					flexShrink: 0,
				},
				onpointerdown: this.onpointerdown,
				onpointermove: this.onpointermove,
				onpointerleave: this.onpointerleave,
			}) as const
	);
}

class SelectScrollDownButtonState {
	content: SelectContentState;
	root: SelectBaseRootState;
	canScrollDown = $state(false);
	scrollIntoViewTimer: ReturnType<typeof globalThis.setTimeout> | null = null;

	constructor(readonly state: SelectScrollButtonImplState) {
		this.content = state.content;
		this.root = state.root;
		this.state.onAutoScroll = this.handleAutoScroll;

		watch([() => this.content.viewportNode, () => this.content.isPositioned], () => {
			if (!this.content.viewportNode || !this.content.isPositioned) {
				return;
			}

			this.handleScroll(true);

			return on(this.content.viewportNode, "scroll", () => this.handleScroll());
		});

		watch(
			() => this.state.mounted,
			() => {
				if (!this.state.mounted) return;
				if (this.scrollIntoViewTimer) {
					clearTimeout(this.scrollIntoViewTimer);
				}
				this.scrollIntoViewTimer = afterSleep(5, () => {
					const activeItem = this.root.highlightedNode;
					activeItem?.scrollIntoView({ block: "nearest" });
				});
			}
		);
	}
	/**
	 * @param manual - if true, it means the function was invoked manually outside of an event
	 * listener, so we don't call `handleUserScroll` to prevent the auto scroll from kicking in.
	 */
	handleScroll = (manual = false) => {
		if (!manual) {
			this.state.handleUserScroll();
		}
		if (!this.content.viewportNode) return;
		const maxScroll =
			this.content.viewportNode.scrollHeight - this.content.viewportNode.clientHeight;
		const paddingTop = Number.parseInt(
			getComputedStyle(this.content.viewportNode).paddingTop,
			10
		);

		this.canScrollDown =
			Math.ceil(this.content.viewportNode.scrollTop) < maxScroll - paddingTop;
	};

	handleAutoScroll = () => {
		const viewport = this.content.viewportNode;
		const selectedItem = this.root.highlightedNode;
		if (!viewport || !selectedItem) return;
		viewport.scrollTop = viewport.scrollTop + selectedItem.offsetHeight;
	};

	props = $derived.by(
		() => ({ ...this.state.props, [this.root.bitsAttrs["scroll-down-button"]]: "" }) as const
	);
}

class SelectScrollUpButtonState {
	content: SelectContentState;
	root: SelectBaseRootState;
	canScrollUp = $state(false);

	constructor(readonly state: SelectScrollButtonImplState) {
		this.content = state.content;
		this.root = state.root;
		this.state.onAutoScroll = this.handleAutoScroll;

		watch([() => this.content.viewportNode, () => this.content.isPositioned], () => {
			if (!this.content.viewportNode || !this.content.isPositioned) return;

			this.handleScroll(true);
			return on(this.content.viewportNode, "scroll", () => this.handleScroll());
		});
	}

	/**
	 * @param manual - if true, it means the function was invoked manually outside of an event
	 * listener, so we don't call `handleUserScroll` to prevent the auto scroll from kicking in.
	 */
	handleScroll = (manual = false) => {
		if (!manual) {
			this.state.handleUserScroll();
		}
		if (!this.content.viewportNode) return;
		const paddingTop = Number.parseInt(
			getComputedStyle(this.content.viewportNode).paddingTop,
			10
		);
		this.canScrollUp = this.content.viewportNode.scrollTop - paddingTop > 0.1;
	};

	handleAutoScroll = () => {
		if (!this.content.viewportNode || !this.root.highlightedNode) return;
		this.content.viewportNode.scrollTop =
			this.content.viewportNode.scrollTop - this.root.highlightedNode.offsetHeight;
	};

	props = $derived.by(
		() => ({ ...this.state.props, [this.root.bitsAttrs["scroll-up-button"]]: "" }) as const
	);
}

type InitSelectProps = {
	type: "single" | "multiple";
	value: Box<string> | Box<string[]>;
} & ReadableBoxedValues<{
	disabled: boolean;
	required: boolean;
	loop: boolean;
	scrollAlignment: "nearest" | "center";
	name: string;
	items: { value: string; label: string; disabled?: boolean }[];
	allowDeselect: boolean;
}> &
	WritableBoxedValues<{
		open: boolean;
	}> & {
		isCombobox: boolean;
	};

const SelectRootContext = new Context<SelectRootState>("Select.Root | Combobox.Root");
const SelectGroupContext = new Context<SelectGroupState>("Select.Group | Combobox.Group");
const SelectContentContext = new Context<SelectContentState>("Select.Content | Combobox.Content");

export function useSelectRoot(props: InitSelectProps) {
	const { type, ...rest } = props;

	const rootState =
		type === "single"
			? new SelectSingleRootState(rest as SelectSingleRootStateProps)
			: new SelectMultipleRootState(rest as SelectMultipleRootStateProps);

	return SelectRootContext.set(rootState);
}

export function useSelectInput(props: SelectInputStateProps) {
	return new SelectInputState(props, SelectRootContext.get());
}

export function useSelectContent(props: SelectContentStateProps) {
	return SelectContentContext.set(new SelectContentState(props, SelectRootContext.get()));
}

export function useSelectTrigger(props: SelectTriggerStateProps) {
	return new SelectTriggerState(props, SelectRootContext.get());
}

export function useSelectComboTrigger(props: SelectComboTriggerStateProps) {
	return new SelectComboTriggerState(props, SelectRootContext.get());
}

export function useSelectItem(props: SelectItemStateProps) {
	return new SelectItemState(props, SelectRootContext.get());
}

export function useSelectViewport(props: SelectViewportStateProps) {
	return new SelectViewportState(props, SelectContentContext.get());
}

export function useSelectScrollUpButton(props: SelectScrollButtonImplStateProps) {
	return new SelectScrollUpButtonState(
		new SelectScrollButtonImplState(props, SelectContentContext.get())
	);
}

export function useSelectScrollDownButton(props: SelectScrollButtonImplStateProps) {
	return new SelectScrollDownButtonState(
		new SelectScrollButtonImplState(props, SelectContentContext.get())
	);
}

export function useSelectGroup(props: SelectGroupStateProps) {
	return SelectGroupContext.set(new SelectGroupState(props, SelectRootContext.get()));
}

export function useSelectGroupHeading(props: SelectGroupHeadingStateProps) {
	return new SelectGroupHeadingState(props, SelectGroupContext.get());
}

export function useSelectHiddenInput(props: SelectHiddenInputStateProps) {
	return new SelectHiddenInputState(props, SelectRootContext.get());
}

////////////////////////////////////
// Helpers
////////////////////////////////////

const selectParts = [
	"trigger",
	"content",
	"item",
	"viewport",
	"scroll-up-button",
	"scroll-down-button",
	"group",
	"group-label",
	"separator",
	"arrow",
	"input",
	"content-wrapper",
	"item-text",
	"value",
] as const;

type SelectBitsAttrs = Record<(typeof selectParts)[number], string>;

export function getSelectBitsAttrs(root: SelectBaseRootState): SelectBitsAttrs {
	const isCombobox = root.isCombobox;
	const attrObj = {} as SelectBitsAttrs;
	for (const part of selectParts) {
		attrObj[part] = isCombobox ? `data-combobox-${part}` : `data-select-${part}`;
	}
	return attrObj;
}
