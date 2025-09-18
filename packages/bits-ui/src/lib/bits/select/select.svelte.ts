import { Context, Previous, watch } from "runed";
import {
	afterSleep,
	afterTick,
	onDestroyEffect,
	attachRef,
	DOMContext,
	type ReadableBoxedValues,
	type WritableBoxedValues,
	type Box,
	box,
} from "svelte-toolbelt";
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
import { kbd } from "$lib/internal/kbd.js";
import type {
	BitsEvent,
	BitsFocusEvent,
	BitsKeyboardEvent,
	BitsMouseEvent,
	BitsPointerEvent,
	OnChangeFn,
	WithRefOpts,
	RefAttachment,
} from "$lib/internal/types.js";
import { noop } from "$lib/internal/noop.js";
import { isIOS } from "$lib/internal/is.js";
import { createBitsAttrs } from "$lib/internal/attrs.js";
import { getFloatingContentCSSVars } from "$lib/internal/floating-svelte/floating-utils.svelte.js";
import { DataTypeahead } from "$lib/internal/data-typeahead.svelte.js";
import { DOMTypeahead } from "$lib/internal/dom-typeahead.svelte.js";
import { OpenChangeComplete } from "$lib/internal/open-change-complete.js";

// prettier-ignore
export const INTERACTION_KEYS = [kbd.ARROW_LEFT, kbd.ESCAPE, kbd.ARROW_RIGHT, kbd.SHIFT, kbd.CAPS_LOCK, kbd.CONTROL, kbd.ALT, kbd.META, kbd.ENTER, kbd.F1, kbd.F2, kbd.F3, kbd.F4, kbd.F5, kbd.F6, kbd.F7, kbd.F8, kbd.F9, kbd.F10, kbd.F11, kbd.F12];

export const FIRST_KEYS = [kbd.ARROW_DOWN, kbd.PAGE_UP, kbd.HOME];
export const LAST_KEYS = [kbd.ARROW_UP, kbd.PAGE_DOWN, kbd.END];
export const FIRST_LAST_KEYS = [...FIRST_KEYS, ...LAST_KEYS];
export const SELECTION_KEYS = [kbd.ENTER, kbd.SPACE];

export const CONTENT_MARGIN = 10;

const selectAttrs = createBitsAttrs({
	component: "select",
	parts: [
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
	],
});

const SelectRootContext = new Context<SelectRoot>("Select.Root | Combobox.Root");
const SelectGroupContext = new Context<SelectGroupState>("Select.Group | Combobox.Group");
const SelectContentContext = new Context<SelectContentState>("Select.Content | Combobox.Content");

interface SelectBaseRootStateOpts
	extends ReadableBoxedValues<{
			disabled: boolean;
			required: boolean;
			name: string;
			loop: boolean;
			scrollAlignment: "nearest" | "center";
			items: { value: string; label: string; disabled?: boolean }[];
			allowDeselect: boolean;
			onOpenChangeComplete: OnChangeFn<boolean>;
		}>,
		WritableBoxedValues<{
			open: boolean;
			inputValue: string;
		}> {
	isCombobox: boolean;
}

abstract class SelectBaseRootState {
	readonly opts: SelectBaseRootStateOpts;
	touchedInput = $state(false);
	inputNode = $state<HTMLElement | null>(null);
	contentNode = $state<HTMLElement | null>(null);
	triggerNode = $state<HTMLElement | null>(null);
	valueId = $state("");
	highlightedNode = $state<HTMLElement | null>(null);
	readonly highlightedValue = $derived.by(() => {
		if (!this.highlightedNode) return null;
		return this.highlightedNode.getAttribute("data-value");
	});
	readonly highlightedId = $derived.by(() => {
		if (!this.highlightedNode) return undefined;
		return this.highlightedNode.id;
	});
	readonly highlightedLabel = $derived.by(() => {
		if (!this.highlightedNode) return null;
		return this.highlightedNode.getAttribute("data-label");
	});
	isUsingKeyboard = false;
	isCombobox = false;
	domContext = new DOMContext(() => null);

	constructor(opts: SelectBaseRootStateOpts) {
		this.opts = opts;
		this.isCombobox = opts.isCombobox;

		new OpenChangeComplete({
			ref: box.with(() => this.contentNode),
			open: this.opts.open,
			onComplete: () => {
				this.opts.onOpenChangeComplete.current(this.opts.open.current);
			},
		});

		$effect.pre(() => {
			if (!this.opts.open.current) {
				this.setHighlightedNode(null);
			}
		});
	}

	setHighlightedNode(node: HTMLElement | null, initial = false) {
		this.highlightedNode = node;
		if (node && (this.isUsingKeyboard || initial)) {
			node.scrollIntoView({ block: this.opts.scrollAlignment.current });
		}
	}

	getCandidateNodes(): HTMLElement[] {
		const node = this.contentNode;
		if (!node) return [];
		return Array.from(
			node.querySelectorAll<HTMLElement>(`[${this.getBitsAttr("item")}]:not([data-disabled])`)
		);
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

	getBitsAttr: typeof selectAttrs.getAttr = (part) => {
		return selectAttrs.getAttr(part, this.isCombobox ? "combobox" : undefined);
	};
}

interface SelectSingleRootStateOpts
	extends SelectBaseRootStateOpts,
		WritableBoxedValues<{
			value: string;
		}> {}

export class SelectSingleRootState extends SelectBaseRootState {
	readonly opts: SelectSingleRootStateOpts;
	readonly isMulti = false as const;
	readonly hasValue = $derived.by(() => this.opts.value.current !== "");
	readonly currentLabel = $derived.by(() => {
		if (!this.opts.items.current.length) return "";
		const match = this.opts.items.current.find(
			(item) => item.value === this.opts.value.current
		)?.label;
		return match ?? "";
	});
	readonly candidateLabels = $derived.by(() => {
		if (!this.opts.items.current.length) return [];
		const filteredItems = this.opts.items.current.filter((item) => !item.disabled);
		return filteredItems.map((item) => item.label);
	});
	readonly dataTypeaheadEnabled = $derived.by(() => {
		if (this.isMulti) return false;
		if (this.opts.items.current.length === 0) return false;
		return true;
	});

	constructor(opts: SelectSingleRootStateOpts) {
		super(opts);

		this.opts = opts;

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
		this.opts.inputValue.current = itemLabel;
	}

	setInitialHighlightedNode() {
		afterTick(() => {
			if (
				this.highlightedNode &&
				this.domContext.getDocument().contains(this.highlightedNode)
			)
				return;
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

interface SelectMultipleRootStateOpts
	extends SelectBaseRootStateOpts,
		WritableBoxedValues<{
			value: string[];
		}> {}

class SelectMultipleRootState extends SelectBaseRootState {
	readonly opts: SelectMultipleRootStateOpts;
	readonly isMulti = true as const;
	readonly hasValue = $derived.by(() => this.opts.value.current.length > 0);

	constructor(opts: SelectMultipleRootStateOpts) {
		super(opts);

		this.opts = opts;

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
		this.opts.inputValue.current = itemLabel;
	}

	setInitialHighlightedNode() {
		afterTick(() => {
			if (!this.domContext) return;
			if (
				this.highlightedNode &&
				this.domContext.getDocument().contains(this.highlightedNode)
			)
				return;
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

interface SelectRootStateOpts
	extends ReadableBoxedValues<{
			disabled: boolean;
			required: boolean;
			loop: boolean;
			scrollAlignment: "nearest" | "center";
			name: string;
			items: { value: string; label: string; disabled?: boolean }[];
			allowDeselect: boolean;
			onOpenChangeComplete: OnChangeFn<boolean>;
		}>,
		WritableBoxedValues<{
			open: boolean;
			inputValue: string;
		}> {
	isCombobox: boolean;
	type: "single" | "multiple";
	value: Box<string> | Box<string[]>;
}

export class SelectRootState {
	static create(props: SelectRootStateOpts): SelectRoot {
		const { type, ...rest } = props;

		const rootState =
			type === "single"
				? new SelectSingleRootState(rest as SelectSingleRootStateOpts)
				: new SelectMultipleRootState(rest as SelectMultipleRootStateOpts);

		return SelectRootContext.set(rootState);
	}
}

type SelectRoot = SelectSingleRootState | SelectMultipleRootState;

interface SelectInputStateOpts
	extends WithRefOpts,
		ReadableBoxedValues<{
			clearOnDeselect: boolean;
		}> {}

export class SelectInputState {
	static create(opts: SelectInputStateOpts) {
		return new SelectInputState(opts, SelectRootContext.get());
	}
	readonly opts: SelectInputStateOpts;
	readonly root: SelectRoot;
	readonly attachment: RefAttachment;

	constructor(opts: SelectInputStateOpts, root: SelectRoot) {
		this.opts = opts;
		this.root = root;
		this.attachment = attachRef(opts.ref, (v) => (this.root.inputNode = v));
		this.root.domContext = new DOMContext(opts.ref);

		this.onkeydown = this.onkeydown.bind(this);
		this.oninput = this.oninput.bind(this);

		watch(
			[() => this.root.opts.value.current, () => this.opts.clearOnDeselect.current],
			([value, clearOnDeselect], [prevValue]) => {
				if (!clearOnDeselect) return;
				if (Array.isArray(value) && Array.isArray(prevValue)) {
					if (value.length === 0 && prevValue.length !== 0) {
						this.root.opts.inputValue.current = "";
					}
				} else if (value === "" && prevValue !== "") {
					this.root.opts.inputValue.current = "";
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
			if (e.key === kbd.BACKSPACE && this.root.opts.inputValue.current === "") return;
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

			if (
				this.root.highlightedValue &&
				this.root.highlightedNode &&
				this.root.highlightedNode.isConnected
			) {
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
		this.root.opts.inputValue.current = e.currentTarget.value;
		this.root.setHighlightedToFirstCandidate();
	}

	readonly props = $derived.by(
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
				[this.root.getBitsAttr("input")]: "",
				...this.attachment,
			}) as const
	);
}

interface SelectComboTriggerStateOpts extends WithRefOpts {}

export class SelectComboTriggerState {
	static create(opts: SelectComboTriggerStateOpts) {
		return new SelectComboTriggerState(opts, SelectRootContext.get());
	}
	readonly opts: SelectComboTriggerStateOpts;
	readonly root: SelectBaseRootState;
	readonly attachment: RefAttachment;

	constructor(opts: SelectComboTriggerStateOpts, root: SelectBaseRootState) {
		this.opts = opts;
		this.root = root;
		this.attachment = attachRef(opts.ref);
		this.onkeydown = this.onkeydown.bind(this);
		this.onpointerdown = this.onpointerdown.bind(this);
	}

	onkeydown(e: BitsKeyboardEvent) {
		if (!this.root.domContext) return;
		if (e.key === kbd.ENTER || e.key === kbd.SPACE) {
			e.preventDefault();
			if (this.root.domContext.getActiveElement() !== this.root.inputNode) {
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
		if (this.root.opts.disabled.current || !this.root.domContext) return;
		e.preventDefault();
		if (this.root.domContext.getActiveElement() !== this.root.inputNode) {
			this.root.inputNode?.focus();
		}
		this.root.toggleMenu();
	}

	readonly props = $derived.by(
		() =>
			({
				id: this.opts.id.current,
				disabled: this.root.opts.disabled.current ? true : undefined,
				"aria-haspopup": "listbox",
				"data-state": getDataOpenClosed(this.root.opts.open.current),
				"data-disabled": getDataDisabled(this.root.opts.disabled.current),
				[this.root.getBitsAttr("trigger")]: "",
				onpointerdown: this.onpointerdown,
				onkeydown: this.onkeydown,
				...this.attachment,
			}) as const
	);
}

interface SelectTriggerStateOpts extends WithRefOpts {}

export class SelectTriggerState {
	static create(opts: SelectTriggerStateOpts) {
		return new SelectTriggerState(opts, SelectRootContext.get());
	}
	readonly opts: SelectTriggerStateOpts;
	readonly root: SelectRoot;
	readonly attachment: RefAttachment;
	readonly #domTypeahead: DOMTypeahead;
	readonly #dataTypeahead: DataTypeahead;

	constructor(opts: SelectTriggerStateOpts, root: SelectRoot) {
		this.opts = opts;
		this.root = root;
		this.attachment = attachRef(opts.ref, (v) => (this.root.triggerNode = v));
		this.root.domContext = new DOMContext(opts.ref);

		this.#domTypeahead = new DOMTypeahead({
			getCurrentItem: () => this.root.highlightedNode,
			onMatch: (node) => {
				this.root.setHighlightedNode(node);
			},
			getActiveElement: () => this.root.domContext.getActiveElement(),
			getWindow: () => this.root.domContext.getWindow(),
		});

		this.#dataTypeahead = new DataTypeahead({
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
			enabled: () => !this.root.isMulti && this.root.dataTypeaheadEnabled,
			candidateValues: () => (this.root.isMulti ? [] : this.root.candidateLabels),
			getWindow: () => this.root.domContext.getWindow(),
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

	/**
	 * Logic used to handle keyboard selection/deselection.
	 *
	 * If it returns true, it means the item was selected and whatever is calling
	 * this function should return early
	 *
	 */
	#handleKeyboardSelection() {
		const isCurrentSelectedValue = this.root.highlightedValue === this.root.opts.value.current;

		if (!this.root.opts.allowDeselect.current && isCurrentSelectedValue && !this.root.isMulti) {
			this.root.handleClose();
			return true;
		}

		// "" is a valid value for a select item so we need to check for that
		if (this.root.highlightedValue !== null) {
			this.root.toggleItem(
				this.root.highlightedValue,
				this.root.highlightedLabel ?? undefined
			);
		}

		if (!this.root.isMulti && !isCurrentSelectedValue) {
			this.root.handleClose();
			return true;
		}

		return false;
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
				this.#dataTypeahead.handleTypeaheadSearch(e.key);
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

		if (
			(e.key === kbd.ENTER ||
				// if we're currently "typing ahead", we don't want to select the item
				// just yet as the item the user is trying to get to may have a space in it,
				// so we defer handling the close for this case until further down
				(e.key === kbd.SPACE && this.#domTypeahead.search === "")) &&
			!e.isComposing
		) {
			e.preventDefault();
			const shouldReturn = this.#handleKeyboardSelection();
			if (shouldReturn) return;
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
		const isSpaceKey = e.key === kbd.SPACE;

		const candidateNodes = this.root.getCandidateNodes();

		if (e.key === kbd.TAB) return;

		if (!isModifierKey && (isCharacterKey || isSpaceKey)) {
			const matchedNode = this.#domTypeahead.handleTypeaheadSearch(e.key, candidateNodes);
			if (!matchedNode && isSpaceKey) {
				e.preventDefault();
				this.#handleKeyboardSelection();
			}
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
		if (this.root.opts.disabled.current) return;
		e.preventDefault();
		if (e.pointerType === "touch") {
			if (this.root.opts.open.current === false) {
				this.#handlePointerOpen(e);
			} else {
				this.root.handleClose();
			}
		}
	}

	readonly props = $derived.by(
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
				[this.root.getBitsAttr("trigger")]: "",
				onpointerdown: this.onpointerdown,
				onkeydown: this.onkeydown,
				onclick: this.onclick,
				onpointerup: this.onpointerup,
				...this.attachment,
			}) as const
	);
}

interface SelectContentStateOpts
	extends WithRefOpts,
		ReadableBoxedValues<{
			onInteractOutside: (e: PointerEvent) => void;
			onEscapeKeydown: (e: KeyboardEvent) => void;
		}> {}

export class SelectContentState {
	static create(opts: SelectContentStateOpts) {
		return SelectContentContext.set(new SelectContentState(opts, SelectRootContext.get()));
	}
	readonly opts: SelectContentStateOpts;
	readonly root: SelectRoot;
	readonly attachment: RefAttachment;
	viewportNode = $state<HTMLElement | null>(null);
	isPositioned = $state(false);
	domContext: DOMContext;

	constructor(opts: SelectContentStateOpts, root: SelectRoot) {
		this.opts = opts;
		this.root = root;
		this.attachment = attachRef(opts.ref, (v) => (this.root.contentNode = v));
		this.domContext = new DOMContext(this.opts.ref);

		if (this.root.domContext === null) {
			this.root.domContext = this.domContext;
		}

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

	readonly #styles = $derived.by(() => {
		return getFloatingContentCSSVars(this.root.isCombobox ? "combobox" : "select");
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

	readonly snippetProps = $derived.by(() => ({ open: this.root.opts.open.current }));

	readonly props = $derived.by(
		() =>
			({
				id: this.opts.id.current,
				role: "listbox",
				"aria-multiselectable": this.root.isMulti ? "true" : undefined,
				"data-state": getDataOpenClosed(this.root.opts.open.current),
				[this.root.getBitsAttr("content")]: "",
				style: {
					display: "flex",
					flexDirection: "column",
					outline: "none",
					boxSizing: "border-box",
					pointerEvents: "auto",
					...this.#styles,
				},
				onpointermove: this.onpointermove,
				...this.attachment,
			}) as const
	);

	readonly popperProps = {
		onInteractOutside: this.onInteractOutside,
		onEscapeKeydown: this.onEscapeKeydown,
		onOpenAutoFocus: this.onOpenAutoFocus,
		onCloseAutoFocus: this.onCloseAutoFocus,
		trapFocus: false,
		loop: false,
		onPlaced: () => {
			// onPlaced is also called when the menu is closed, so we need to check if the menu
			// is actually open to avoid setting positioning to true when the menu is closed
			if (this.root.opts.open.current) {
				this.isPositioned = true;
			}
		},
	};
}

interface SelectItemStateOpts
	extends WithRefOpts,
		ReadableBoxedValues<{
			value: string;
			disabled: boolean;
			label: string;
			onHighlight: () => void;
			onUnhighlight: () => void;
		}> {}

export class SelectItemState {
	static create(opts: SelectItemStateOpts) {
		return new SelectItemState(opts, SelectRootContext.get());
	}
	readonly opts: SelectItemStateOpts;
	readonly root: SelectRoot;
	readonly attachment: RefAttachment;
	readonly isSelected = $derived.by(() => this.root.includesItem(this.opts.value.current));
	readonly isHighlighted = $derived.by(
		() => this.root.highlightedValue === this.opts.value.current
	);
	readonly prevHighlighted = new Previous(() => this.isHighlighted);
	mounted = $state(false);

	constructor(opts: SelectItemStateOpts, root: SelectRoot) {
		this.opts = opts;
		this.root = root;
		this.attachment = attachRef(opts.ref);

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

	readonly props = $derived.by(
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
					this.root.highlightedValue === this.opts.value.current &&
					!this.opts.disabled.current
						? ""
						: undefined,
				"data-selected": this.root.includesItem(this.opts.value.current) ? "" : undefined,
				"data-label": this.opts.label.current,
				[this.root.getBitsAttr("item")]: "",
				onpointermove: this.onpointermove,
				onpointerdown: this.onpointerdown,
				onpointerup: this.onpointerup,
				...this.attachment,
			}) as const
	);
}

interface SelectGroupStateOpts extends WithRefOpts {}

export class SelectGroupState {
	static create(opts: SelectGroupStateOpts) {
		return SelectGroupContext.set(new SelectGroupState(opts, SelectRootContext.get()));
	}
	readonly opts: SelectGroupStateOpts;
	readonly root: SelectBaseRootState;
	labelNode = $state<HTMLElement | null>(null);
	readonly attachment: RefAttachment;

	constructor(opts: SelectGroupStateOpts, root: SelectBaseRootState) {
		this.opts = opts;
		this.root = root;
		this.attachment = attachRef(opts.ref);
	}

	readonly props = $derived.by(
		() =>
			({
				id: this.opts.id.current,
				role: "group",
				[this.root.getBitsAttr("group")]: "",
				"aria-labelledby": this.labelNode?.id ?? undefined,
				...this.attachment,
			}) as const
	);
}

interface SelectGroupHeadingStateOpts extends WithRefOpts {}

export class SelectGroupHeadingState {
	static create(opts: SelectGroupHeadingStateOpts) {
		return new SelectGroupHeadingState(opts, SelectGroupContext.get());
	}
	readonly opts: SelectGroupHeadingStateOpts;
	readonly group: SelectGroupState;
	readonly attachment: RefAttachment;

	constructor(opts: SelectGroupHeadingStateOpts, group: SelectGroupState) {
		this.opts = opts;
		this.group = group;
		this.attachment = attachRef(opts.ref, (v) => (this.group.labelNode = v));
	}

	readonly props = $derived.by(
		() =>
			({
				id: this.opts.id.current,
				[this.group.root.getBitsAttr("group-label")]: "",
				...this.attachment,
			}) as const
	);
}

interface SelectHiddenInputStateOpts
	extends ReadableBoxedValues<{
		value: string;
	}> {}

export class SelectHiddenInputState {
	static create(opts: SelectHiddenInputStateOpts) {
		return new SelectHiddenInputState(opts, SelectRootContext.get());
	}
	readonly opts: SelectHiddenInputStateOpts;
	readonly root: SelectBaseRootState;
	readonly shouldRender = $derived.by(() => this.root.opts.name.current !== "");

	constructor(opts: SelectHiddenInputStateOpts, root: SelectBaseRootState) {
		this.opts = opts;
		this.root = root;
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

	readonly props = $derived.by(
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

interface SelectViewportStateOpts extends WithRefOpts {}

export class SelectViewportState {
	static create(opts: SelectViewportStateOpts) {
		return new SelectViewportState(opts, SelectContentContext.get());
	}
	readonly opts: SelectViewportStateOpts;
	readonly content: SelectContentState;
	readonly root: SelectBaseRootState;
	readonly attachment: RefAttachment;
	prevScrollTop = $state(0);

	constructor(opts: SelectViewportStateOpts, content: SelectContentState) {
		this.opts = opts;
		this.content = content;
		this.root = content.root;
		this.attachment = attachRef(opts.ref, (v) => (this.content.viewportNode = v));
	}

	readonly props = $derived.by(
		() =>
			({
				id: this.opts.id.current,
				role: "presentation",
				[this.root.getBitsAttr("viewport")]: "",
				style: {
					// we use position: 'relative' here on the `viewport` so that when we call
					// `selectedItem.offsetTop` in calculations, the offset is relative to the viewport
					// (independent of the scrollUpButton).
					position: "relative",
					flex: 1,
					overflow: "auto",
				},
				...this.attachment,
			}) as const
	);
}

interface SelectScrollButtonImplStateOpts
	extends WithRefOpts,
		ReadableBoxedValues<{
			delay: (tick: number) => number;
		}> {}

export class SelectScrollButtonImplState {
	readonly opts: SelectScrollButtonImplStateOpts;
	readonly content: SelectContentState;
	readonly root: SelectBaseRootState;
	readonly attachment: RefAttachment;
	autoScrollTimer: number | null = null;
	userScrollTimer = -1;
	isUserScrolling = false;
	onAutoScroll: () => void = noop;
	mounted = $state(false);

	constructor(opts: SelectScrollButtonImplStateOpts, content: SelectContentState) {
		this.opts = opts;
		this.content = content;
		this.root = content.root;
		this.attachment = attachRef(opts.ref);

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
		this.content.domContext.clearTimeout(this.userScrollTimer);
		this.isUserScrolling = true;
		this.userScrollTimer = this.content.domContext.setTimeout(() => {
			this.isUserScrolling = false;
		}, 200);
	}

	clearAutoScrollInterval() {
		if (this.autoScrollTimer === null) return;
		this.content.domContext.clearTimeout(this.autoScrollTimer);
		this.autoScrollTimer = null;
	}

	onpointerdown(_: BitsPointerEvent) {
		if (this.autoScrollTimer !== null) return;
		const autoScroll = (tick: number) => {
			this.onAutoScroll();
			this.autoScrollTimer = this.content.domContext.setTimeout(
				() => autoScroll(tick + 1),
				this.opts.delay.current(tick)
			);
		};
		this.autoScrollTimer = this.content.domContext.setTimeout(
			() => autoScroll(1),
			this.opts.delay.current(0)
		);
	}

	onpointermove(e: BitsPointerEvent) {
		this.onpointerdown(e);
	}

	onpointerleave(_: BitsPointerEvent) {
		this.clearAutoScrollInterval();
	}

	readonly props = $derived.by(
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
				...this.attachment,
			}) as const
	);
}

export class SelectScrollDownButtonState {
	static create(opts: SelectScrollButtonImplStateOpts) {
		return new SelectScrollDownButtonState(
			new SelectScrollButtonImplState(opts, SelectContentContext.get())
		);
	}
	readonly scrollButtonState: SelectScrollButtonImplState;
	readonly content: SelectContentState;
	readonly root: SelectBaseRootState;
	canScrollDown = $state(false);
	scrollIntoViewTimer: ReturnType<typeof globalThis.setTimeout> | null = null;

	constructor(scrollButtonState: SelectScrollButtonImplState) {
		this.scrollButtonState = scrollButtonState;
		this.content = scrollButtonState.content;
		this.root = scrollButtonState.root;
		this.scrollButtonState.onAutoScroll = this.handleAutoScroll;

		watch([() => this.content.viewportNode, () => this.content.isPositioned], () => {
			if (!this.content.viewportNode || !this.content.isPositioned) return;
			this.handleScroll(true);

			return on(this.content.viewportNode, "scroll", () => this.handleScroll());
		});

		watch(
			() => this.scrollButtonState.mounted,
			() => {
				if (!this.scrollButtonState.mounted) return;
				if (this.scrollIntoViewTimer) {
					clearTimeout(this.scrollIntoViewTimer);
				}
				this.scrollIntoViewTimer = afterSleep(5, () => {
					const activeItem = this.root.highlightedNode;
					activeItem?.scrollIntoView({ block: this.root.opts.scrollAlignment.current });
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
			this.scrollButtonState.handleUserScroll();
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

	readonly props = $derived.by(
		() =>
			({
				...this.scrollButtonState.props,
				[this.root.getBitsAttr("scroll-down-button")]: "",
			}) as const
	);
}

export class SelectScrollUpButtonState {
	static create(opts: SelectScrollButtonImplStateOpts) {
		return new SelectScrollUpButtonState(
			new SelectScrollButtonImplState(opts, SelectContentContext.get())
		);
	}
	readonly scrollButtonState: SelectScrollButtonImplState;
	readonly content: SelectContentState;
	readonly root: SelectBaseRootState;
	canScrollUp = $state(false);

	constructor(scrollButtonState: SelectScrollButtonImplState) {
		this.scrollButtonState = scrollButtonState;
		this.content = scrollButtonState.content;
		this.root = scrollButtonState.root;
		this.scrollButtonState.onAutoScroll = this.handleAutoScroll;

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
			this.scrollButtonState.handleUserScroll();
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

	readonly props = $derived.by(
		() =>
			({
				...this.scrollButtonState.props,
				[this.root.getBitsAttr("scroll-up-button")]: "",
			}) as const
	);

	readonly carts = {
		carts: [
			{
				id: 1,
				products: [
					{
						id: 168,
						title: "Charger SXT RWD",
						price: 32999.99,
						quantity: 3,
						total: 98999.97,
						discountPercentage: 13.39,
						discountedTotal: 85743.87,
						thumbnail:
							"https://cdn.dummyjson.com/products/images/vehicle/Charger%20SXT%20RWD/thumbnail.png",
					},
					{
						id: 78,
						title: "Apple MacBook Pro 14 Inch Space Grey",
						price: 1999.99,
						quantity: 2,
						total: 3999.98,
						discountPercentage: 18.52,
						discountedTotal: 3259.18,
						thumbnail:
							"https://cdn.dummyjson.com/products/images/laptops/Apple%20MacBook%20Pro%2014%20Inch%20Space%20Grey/thumbnail.png",
					},
					{
						id: 183,
						title: "Green Oval Earring",
						price: 24.99,
						quantity: 5,
						total: 124.95,
						discountPercentage: 6.28,
						discountedTotal: 117.1,
						thumbnail:
							"https://cdn.dummyjson.com/products/images/womens-jewellery/Green%20Oval%20Earring/thumbnail.png",
					},
					{
						id: 100,
						title: "Apple Airpods",
						price: 129.99,
						quantity: 5,
						total: 649.95,
						discountPercentage: 12.84,
						discountedTotal: 566.5,
						thumbnail:
							"https://cdn.dummyjson.com/products/images/mobile-accessories/Apple%20Airpods/thumbnail.png",
					},
				],
				total: 103774.85,
				discountedTotal: 89686.65,
				userId: 33,
				totalProducts: 4,
				totalQuantity: 15,
			},
			{
				id: 2,
				products: [
					{
						id: 144,
						title: "Cricket Helmet",
						price: 44.99,
						quantity: 4,
						total: 179.96,
						discountPercentage: 11.47,
						discountedTotal: 159.32,
						thumbnail:
							"https://cdn.dummyjson.com/products/images/sports-accessories/Cricket%20Helmet/thumbnail.png",
					},
					{
						id: 124,
						title: "iPhone X",
						price: 899.99,
						quantity: 4,
						total: 3599.96,
						discountPercentage: 8.03,
						discountedTotal: 3310.88,
						thumbnail:
							"https://cdn.dummyjson.com/products/images/smartphones/iPhone%20X/thumbnail.png",
					},
					{
						id: 148,
						title: "Golf Ball",
						price: 9.99,
						quantity: 4,
						total: 39.96,
						discountPercentage: 11.24,
						discountedTotal: 35.47,
						thumbnail:
							"https://cdn.dummyjson.com/products/images/sports-accessories/Golf%20Ball/thumbnail.png",
					},
					{
						id: 122,
						title: "iPhone 6",
						price: 299.99,
						quantity: 3,
						total: 899.97,
						discountPercentage: 19.64,
						discountedTotal: 723.22,
						thumbnail:
							"https://cdn.dummyjson.com/products/images/smartphones/iPhone%206/thumbnail.png",
					},
					{
						id: 110,
						title: "Selfie Lamp with iPhone",
						price: 14.99,
						quantity: 5,
						total: 74.95,
						discountPercentage: 19.87,
						discountedTotal: 60.06,
						thumbnail:
							"https://cdn.dummyjson.com/products/images/mobile-accessories/Selfie%20Lamp%20with%20iPhone/thumbnail.png",
					},
				],
				total: 4794.8,
				discountedTotal: 4288.95,
				userId: 142,
				totalProducts: 5,
				totalQuantity: 20,
			},
			{
				id: 3,
				products: [
					{
						id: 98,
						title: "Rolex Submariner Watch",
						price: 13999.99,
						quantity: 1,
						total: 13999.99,
						discountPercentage: 16.35,
						discountedTotal: 11710.99,
						thumbnail:
							"https://cdn.dummyjson.com/products/images/mens-watches/Rolex%20Submariner%20Watch/thumbnail.png",
					},
					{
						id: 125,
						title: "Oppo A57",
						price: 249.99,
						quantity: 5,
						total: 1249.95,
						discountPercentage: 16.54,
						discountedTotal: 1043.21,
						thumbnail:
							"https://cdn.dummyjson.com/products/images/smartphones/Oppo%20A57/thumbnail.png",
					},
					{
						id: 55,
						title: "Egg Slicer",
						price: 6.99,
						quantity: 2,
						total: 13.98,
						discountPercentage: 16.04,
						discountedTotal: 11.74,
						thumbnail:
							"https://cdn.dummyjson.com/products/images/kitchen-accessories/Egg%20Slicer/thumbnail.png",
					},
					{
						id: 62,
						title: "Ice Cube Tray",
						price: 5.99,
						quantity: 2,
						total: 11.98,
						discountPercentage: 8.25,
						discountedTotal: 10.99,
						thumbnail:
							"https://cdn.dummyjson.com/products/images/kitchen-accessories/Ice%20Cube%20Tray/thumbnail.png",
					},
					{
						id: 132,
						title: "Samsung Galaxy S8",
						price: 499.99,
						quantity: 3,
						total: 1499.97,
						discountPercentage: 8.84,
						discountedTotal: 1367.37,
						thumbnail:
							"https://cdn.dummyjson.com/products/images/smartphones/Samsung%20Galaxy%20S8/thumbnail.png",
					},
				],
				total: 16775.87,
				discountedTotal: 14144.3,
				userId: 108,
				totalProducts: 5,
				totalQuantity: 13,
			},
			{
				id: 4,
				products: [
					{
						id: 187,
						title: "Golden Shoes Woman",
						price: 49.99,
						quantity: 5,
						total: 249.95,
						discountPercentage: 1.64,
						discountedTotal: 245.85,
						thumbnail:
							"https://cdn.dummyjson.com/products/images/womens-shoes/Golden%20Shoes%20Woman/thumbnail.png",
					},
					{
						id: 40,
						title: "Strawberry",
						price: 3.99,
						quantity: 5,
						total: 19.95,
						discountPercentage: 4.6,
						discountedTotal: 19.03,
						thumbnail:
							"https://cdn.dummyjson.com/products/images/groceries/Strawberry/thumbnail.png",
					},
					{
						id: 156,
						title: "Green and Black Glasses",
						price: 34.99,
						quantity: 5,
						total: 174.95,
						discountPercentage: 4.34,
						discountedTotal: 167.36,
						thumbnail:
							"https://cdn.dummyjson.com/products/images/sunglasses/Green%20and%20Black%20Glasses/thumbnail.png",
					},
					{
						id: 62,
						title: "Ice Cube Tray",
						price: 5.99,
						quantity: 2,
						total: 11.98,
						discountPercentage: 8.25,
						discountedTotal: 10.99,
						thumbnail:
							"https://cdn.dummyjson.com/products/images/kitchen-accessories/Ice%20Cube%20Tray/thumbnail.png",
					},
				],
				total: 456.83,
				discountedTotal: 443.23,
				userId: 87,
				totalProducts: 4,
				totalQuantity: 17,
			},
			{
				id: 5,
				products: [
					{
						id: 108,
						title: "iPhone 12 Silicone Case with MagSafe Plum",
						price: 29.99,
						quantity: 2,
						total: 59.98,
						discountPercentage: 14.68,
						discountedTotal: 51.17,
						thumbnail:
							"https://cdn.dummyjson.com/products/images/mobile-accessories/iPhone%2012%20Silicone%20Case%20with%20MagSafe%20Plum/thumbnail.png",
					},
					{
						id: 138,
						title: "Baseball Ball",
						price: 8.99,
						quantity: 5,
						total: 44.95,
						discountPercentage: 18.49,
						discountedTotal: 36.64,
						thumbnail:
							"https://cdn.dummyjson.com/products/images/sports-accessories/Baseball%20Ball/thumbnail.png",
					},
					{
						id: 157,
						title: "Party Glasses",
						price: 19.99,
						quantity: 2,
						total: 39.98,
						discountPercentage: 19.17,
						discountedTotal: 32.32,
						thumbnail:
							"https://cdn.dummyjson.com/products/images/sunglasses/Party%20Glasses/thumbnail.png",
					},
					{
						id: 8,
						title: "Dior J'adore",
						price: 89.99,
						quantity: 3,
						total: 269.97,
						discountPercentage: 10.79,
						discountedTotal: 240.84,
						thumbnail:
							"https://cdn.dummyjson.com/products/images/fragrances/Dior%20J'adore/thumbnail.png",
					},
					{
						id: 80,
						title: "Huawei Matebook X Pro",
						price: 1399.99,
						quantity: 5,
						total: 6999.95,
						discountPercentage: 9.99,
						discountedTotal: 6300.65,
						thumbnail:
							"https://cdn.dummyjson.com/products/images/laptops/Huawei%20Matebook%20X%20Pro/thumbnail.png",
					},
					{
						id: 28,
						title: "Ice Cream",
						price: 5.49,
						quantity: 3,
						total: 16.47,
						discountPercentage: 10,
						discountedTotal: 14.82,
						thumbnail:
							"https://cdn.dummyjson.com/products/images/groceries/Ice%20Cream/thumbnail.png",
					},
				],
				total: 7431.3,
				discountedTotal: 6676.44,
				userId: 134,
				totalProducts: 6,
				totalQuantity: 20,
			},
			{
				id: 6,
				products: [
					{
						id: 172,
						title: "Blue Women's Handbag",
						price: 49.99,
						quantity: 5,
						total: 249.95,
						discountPercentage: 8.08,
						discountedTotal: 229.75,
						thumbnail:
							"https://cdn.dummyjson.com/products/images/womens-bags/Blue%20Women's%20Handbag/thumbnail.png",
					},
					{
						id: 112,
						title: "TV Studio Camera Pedestal",
						price: 499.99,
						quantity: 3,
						total: 1499.97,
						discountPercentage: 15.69,
						discountedTotal: 1264.62,
						thumbnail:
							"https://cdn.dummyjson.com/products/images/mobile-accessories/TV%20Studio%20Camera%20Pedestal/thumbnail.png",
					},
					{
						id: 97,
						title: "Rolex Datejust",
						price: 10999.99,
						quantity: 3,
						total: 32999.97,
						discountPercentage: 10.58,
						discountedTotal: 29508.57,
						thumbnail:
							"https://cdn.dummyjson.com/products/images/mens-watches/Rolex%20Datejust/thumbnail.png",
					},
					{
						id: 128,
						title: "Realme C35",
						price: 149.99,
						quantity: 3,
						total: 449.97,
						discountPercentage: 3.97,
						discountedTotal: 432.11,
						thumbnail:
							"https://cdn.dummyjson.com/products/images/smartphones/Realme%20C35/thumbnail.png",
					},
				],
				total: 35199.86,
				discountedTotal: 31435.05,
				userId: 150,
				totalProducts: 4,
				totalQuantity: 14,
			},
			{
				id: 7,
				products: [
					{
						id: 167,
						title: "300 Touring",
						price: 28999.99,
						quantity: 5,
						total: 144999.95,
						discountPercentage: 11.78,
						discountedTotal: 127918.96,
						thumbnail:
							"https://cdn.dummyjson.com/products/images/vehicle/300%20Touring/thumbnail.png",
					},
					{
						id: 111,
						title: "Selfie Stick Monopod",
						price: 12.99,
						quantity: 4,
						total: 51.96,
						discountPercentage: 10.98,
						discountedTotal: 46.25,
						thumbnail:
							"https://cdn.dummyjson.com/products/images/mobile-accessories/Selfie%20Stick%20Monopod/thumbnail.png",
					},
					{
						id: 129,
						title: "Realme X",
						price: 299.99,
						quantity: 2,
						total: 599.98,
						discountPercentage: 10.13,
						discountedTotal: 539.2,
						thumbnail:
							"https://cdn.dummyjson.com/products/images/smartphones/Realme%20X/thumbnail.png",
					},
				],
				total: 145651.89,
				discountedTotal: 128504.41,
				userId: 86,
				totalProducts: 3,
				totalQuantity: 11,
			},
			{
				id: 8,
				products: [
					{
						id: 117,
						title: "Sportbike Motorcycle",
						price: 7499.99,
						quantity: 2,
						total: 14999.98,
						discountPercentage: 19.83,
						discountedTotal: 12025.48,
						thumbnail:
							"https://cdn.dummyjson.com/products/images/motorcycle/Sportbike%20Motorcycle/thumbnail.png",
					},
					{
						id: 18,
						title: "Cat Food",
						price: 8.99,
						quantity: 4,
						total: 35.96,
						discountPercentage: 1.15,
						discountedTotal: 35.55,
						thumbnail:
							"https://cdn.dummyjson.com/products/images/groceries/Cat%20Food/thumbnail.png",
					},
					{
						id: 105,
						title: "Apple MagSafe Battery Pack",
						price: 99.99,
						quantity: 5,
						total: 499.95,
						discountPercentage: 7.14,
						discountedTotal: 464.25,
						thumbnail:
							"https://cdn.dummyjson.com/products/images/mobile-accessories/Apple%20MagSafe%20Battery%20Pack/thumbnail.png",
					},
					{
						id: 6,
						title: "Calvin Klein CK One",
						price: 49.99,
						quantity: 3,
						total: 149.97,
						discountPercentage: 5.67,
						discountedTotal: 141.47,
						thumbnail:
							"https://cdn.dummyjson.com/products/images/fragrances/Calvin%20Klein%20CK%20One/thumbnail.png",
					},
				],
				total: 15685.86,
				discountedTotal: 12666.75,
				userId: 23,
				totalProducts: 4,
				totalQuantity: 14,
			},
			{
				id: 9,
				products: [
					{
						id: 178,
						title: "Corset Leather With Skirt",
						price: 89.99,
						quantity: 2,
						total: 179.98,
						discountPercentage: 12.59,
						discountedTotal: 157.32,
						thumbnail:
							"https://cdn.dummyjson.com/products/images/womens-dresses/Corset%20Leather%20With%20Skirt/thumbnail.png",
					},
					{
						id: 191,
						title: "Rolex Cellini Moonphase",
						price: 15999.99,
						quantity: 4,
						total: 63999.96,
						discountPercentage: 3.26,
						discountedTotal: 61913.56,
						thumbnail:
							"https://cdn.dummyjson.com/products/images/womens-watches/Rolex%20Cellini%20Moonphase/thumbnail.png",
					},
					{
						id: 47,
						title: "Table Lamp",
						price: 49.99,
						quantity: 2,
						total: 99.98,
						discountPercentage: 13.74,
						discountedTotal: 86.24,
						thumbnail:
							"https://cdn.dummyjson.com/products/images/home-decoration/Table%20Lamp/thumbnail.png",
					},
					{
						id: 134,
						title: "Vivo S1",
						price: 249.99,
						quantity: 5,
						total: 1249.95,
						discountPercentage: 5.64,
						discountedTotal: 1179.45,
						thumbnail:
							"https://cdn.dummyjson.com/products/images/smartphones/Vivo%20S1/thumbnail.png",
					},
				],
				total: 65529.87,
				discountedTotal: 63336.57,
				userId: 194,
				totalProducts: 4,
				totalQuantity: 13,
			},
			{
				id: 10,
				products: [
					{
						id: 190,
						title: "IWC Ingenieur Automatic Steel",
						price: 4999.99,
						quantity: 5,
						total: 24999.95,
						discountPercentage: 12.34,
						discountedTotal: 21914.96,
						thumbnail:
							"https://cdn.dummyjson.com/products/images/womens-watches/IWC%20Ingenieur%20Automatic%20Steel/thumbnail.png",
					},
					{
						id: 94,
						title: "Longines Master Collection",
						price: 1499.99,
						quantity: 3,
						total: 4499.97,
						discountPercentage: 16.44,
						discountedTotal: 3760.17,
						thumbnail:
							"https://cdn.dummyjson.com/products/images/mens-watches/Longines%20Master%20Collection/thumbnail.png",
					},
				],
				total: 29499.92,
				discountedTotal: 25675.13,
				userId: 160,
				totalProducts: 2,
				totalQuantity: 8,
			},
			{
				id: 11,
				products: [
					{
						id: 88,
						title: "Nike Air Jordan 1 Red And Black",
						price: 149.99,
						quantity: 1,
						total: 149.99,
						discountPercentage: 17.18,
						discountedTotal: 124.22,
						thumbnail:
							"https://cdn.dummyjson.com/products/images/mens-shoes/Nike%20Air%20Jordan%201%20Red%20And%20Black/thumbnail.png",
					},
					{
						id: 32,
						title: "Milk",
						price: 3.49,
						quantity: 3,
						total: 10.47,
						discountPercentage: 9.36,
						discountedTotal: 9.49,
						thumbnail:
							"https://cdn.dummyjson.com/products/images/groceries/Milk/thumbnail.png",
					},
					{
						id: 74,
						title: "Spoon",
						price: 4.99,
						quantity: 3,
						total: 14.97,
						discountPercentage: 2.78,
						discountedTotal: 14.55,
						thumbnail:
							"https://cdn.dummyjson.com/products/images/kitchen-accessories/Spoon/thumbnail.png",
					},
					{
						id: 145,
						title: "Cricket Wicket",
						price: 29.99,
						quantity: 3,
						total: 89.97,
						discountPercentage: 17.87,
						discountedTotal: 73.89,
						thumbnail:
							"https://cdn.dummyjson.com/products/images/sports-accessories/Cricket%20Wicket/thumbnail.png",
					},
					{
						id: 26,
						title: "Green Chili Pepper",
						price: 0.99,
						quantity: 3,
						total: 2.97,
						discountPercentage: 18.69,
						discountedTotal: 2.41,
						thumbnail:
							"https://cdn.dummyjson.com/products/images/groceries/Green%20Chili%20Pepper/thumbnail.png",
					},
					{
						id: 127,
						title: "Oppo K1",
						price: 299.99,
						quantity: 1,
						total: 299.99,
						discountPercentage: 15.93,
						discountedTotal: 252.2,
						thumbnail:
							"https://cdn.dummyjson.com/products/images/smartphones/Oppo%20K1/thumbnail.png",
					},
				],
				total: 568.36,
				discountedTotal: 476.76,
				userId: 172,
				totalProducts: 6,
				totalQuantity: 14,
			},
			{
				id: 12,
				products: [
					{
						id: 63,
						title: "Kitchen Sieve",
						price: 7.99,
						quantity: 4,
						total: 31.96,
						discountPercentage: 18.8,
						discountedTotal: 25.95,
						thumbnail:
							"https://cdn.dummyjson.com/products/images/kitchen-accessories/Kitchen%20Sieve/thumbnail.png",
					},
					{
						id: 181,
						title: "Marni Red & Black Suit",
						price: 179.99,
						quantity: 5,
						total: 899.95,
						discountPercentage: 14.21,
						discountedTotal: 772.07,
						thumbnail:
							"https://cdn.dummyjson.com/products/images/womens-dresses/Marni%20Red%20&%20Black%20Suit/thumbnail.png",
					},
				],
				total: 931.91,
				discountedTotal: 798.02,
				userId: 202,
				totalProducts: 2,
				totalQuantity: 9,
			},
			{
				id: 13,
				products: [
					{
						id: 85,
						title: "Man Plaid Shirt",
						price: 34.99,
						quantity: 2,
						total: 69.98,
						discountPercentage: 3.7,
						discountedTotal: 67.39,
						thumbnail:
							"https://cdn.dummyjson.com/products/images/mens-shirts/Man%20Plaid%20Shirt/thumbnail.png",
					},
					{
						id: 109,
						title: "Monopod",
						price: 19.99,
						quantity: 3,
						total: 59.97,
						discountPercentage: 12.95,
						discountedTotal: 52.2,
						thumbnail:
							"https://cdn.dummyjson.com/products/images/mobile-accessories/Monopod/thumbnail.png",
					},
					{
						id: 160,
						title: "Samsung Galaxy Tab S8 Plus Grey",
						price: 599.99,
						quantity: 1,
						total: 599.99,
						discountPercentage: 4.31,
						discountedTotal: 574.13,
						thumbnail:
							"https://cdn.dummyjson.com/products/images/tablets/Samsung%20Galaxy%20Tab%20S8%20Plus%20Grey/thumbnail.png",
					},
					{
						id: 163,
						title: "Girl Summer Dress",
						price: 19.99,
						quantity: 3,
						total: 59.97,
						discountPercentage: 9.44,
						discountedTotal: 54.31,
						thumbnail:
							"https://cdn.dummyjson.com/products/images/tops/Girl%20Summer%20Dress/thumbnail.png",
					},
					{
						id: 31,
						title: "Lemon",
						price: 0.79,
						quantity: 4,
						total: 3.16,
						discountPercentage: 12.32,
						discountedTotal: 2.77,
						thumbnail:
							"https://cdn.dummyjson.com/products/images/groceries/Lemon/thumbnail.png",
					},
				],
				total: 793.07,
				discountedTotal: 750.8,
				userId: 41,
				totalProducts: 5,
				totalQuantity: 13,
			},
			{
				id: 14,
				products: [
					{
						id: 92,
						title: "Sports Sneakers Off White Red",
						price: 109.99,
						quantity: 3,
						total: 329.97,
						discountPercentage: 17.73,
						discountedTotal: 271.47,
						thumbnail:
							"https://cdn.dummyjson.com/products/images/mens-shoes/Sports%20Sneakers%20Off%20White%20Red/thumbnail.png",
					},
					{
						id: 54,
						title: "Citrus Squeezer Yellow",
						price: 8.99,
						quantity: 5,
						total: 44.95,
						discountPercentage: 6.3,
						discountedTotal: 42.12,
						thumbnail:
							"https://cdn.dummyjson.com/products/images/kitchen-accessories/Citrus%20Squeezer%20Yellow/thumbnail.png",
					},
					{
						id: 76,
						title: "Wooden Rolling Pin",
						price: 11.99,
						quantity: 1,
						total: 11.99,
						discountPercentage: 8.45,
						discountedTotal: 10.98,
						thumbnail:
							"https://cdn.dummyjson.com/products/images/kitchen-accessories/Wooden%20Rolling%20Pin/thumbnail.png",
					},
					{
						id: 44,
						title: "Family Tree Photo Frame",
						price: 29.99,
						quantity: 5,
						total: 149.95,
						discountPercentage: 10.68,
						discountedTotal: 133.94,
						thumbnail:
							"https://cdn.dummyjson.com/products/images/home-decoration/Family%20Tree%20Photo%20Frame/thumbnail.png",
					},
					{
						id: 67,
						title: "Mug Tree Stand",
						price: 15.99,
						quantity: 3,
						total: 47.97,
						discountPercentage: 16.65,
						discountedTotal: 39.98,
						thumbnail:
							"https://cdn.dummyjson.com/products/images/kitchen-accessories/Mug%20Tree%20Stand/thumbnail.png",
					},
					{
						id: 16,
						title: "Apple",
						price: 1.99,
						quantity: 1,
						total: 1.99,
						discountPercentage: 11.74,
						discountedTotal: 1.76,
						thumbnail:
							"https://cdn.dummyjson.com/products/images/groceries/Apple/thumbnail.png",
					},
				],
				total: 586.82,
				discountedTotal: 500.25,
				userId: 94,
				totalProducts: 6,
				totalQuantity: 18,
			},
			{
				id: 15,
				products: [
					{
						id: 11,
						title: "Annibale Colombo Bed",
						price: 1899.99,
						quantity: 5,
						total: 9499.95,
						discountPercentage: 8.09,
						discountedTotal: 8731.4,
						thumbnail:
							"https://cdn.dummyjson.com/products/images/furniture/Annibale%20Colombo%20Bed/thumbnail.png",
					},
					{
						id: 133,
						title: "Samsung Galaxy S10",
						price: 699.99,
						quantity: 3,
						total: 2099.97,
						discountPercentage: 1.12,
						discountedTotal: 2076.45,
						thumbnail:
							"https://cdn.dummyjson.com/products/images/smartphones/Samsung%20Galaxy%20S10/thumbnail.png",
					},
					{
						id: 111,
						title: "Selfie Stick Monopod",
						price: 12.99,
						quantity: 3,
						total: 38.97,
						discountPercentage: 10.98,
						discountedTotal: 34.69,
						thumbnail:
							"https://cdn.dummyjson.com/products/images/mobile-accessories/Selfie%20Stick%20Monopod/thumbnail.png",
					},
					{
						id: 162,
						title: "Blue Frock",
						price: 29.99,
						quantity: 3,
						total: 89.97,
						discountPercentage: 3.86,
						discountedTotal: 86.5,
						thumbnail:
							"https://cdn.dummyjson.com/products/images/tops/Blue%20Frock/thumbnail.png",
					},
					{
						id: 30,
						title: "Kiwi",
						price: 2.49,
						quantity: 5,
						total: 12.45,
						discountPercentage: 4.34,
						discountedTotal: 11.91,
						thumbnail:
							"https://cdn.dummyjson.com/products/images/groceries/Kiwi/thumbnail.png",
					},
				],
				total: 11741.31,
				discountedTotal: 10940.95,
				userId: 11,
				totalProducts: 5,
				totalQuantity: 19,
			},
			{
				id: 16,
				products: [
					{
						id: 19,
						title: "Chicken Meat",
						price: 9.99,
						quantity: 2,
						total: 19.98,
						discountPercentage: 13.37,
						discountedTotal: 17.31,
						thumbnail:
							"https://cdn.dummyjson.com/products/images/groceries/Chicken%20Meat/thumbnail.png",
					},
					{
						id: 152,
						title: "Tennis Racket",
						price: 49.99,
						quantity: 3,
						total: 149.97,
						discountPercentage: 9.13,
						discountedTotal: 136.28,
						thumbnail:
							"https://cdn.dummyjson.com/products/images/sports-accessories/Tennis%20Racket/thumbnail.png",
					},
					{
						id: 35,
						title: "Potatoes",
						price: 2.29,
						quantity: 1,
						total: 2.29,
						discountPercentage: 1.69,
						discountedTotal: 2.25,
						thumbnail:
							"https://cdn.dummyjson.com/products/images/groceries/Potatoes/thumbnail.png",
					},
				],
				total: 172.24,
				discountedTotal: 155.84,
				userId: 200,
				totalProducts: 3,
				totalQuantity: 6,
			},
			{
				id: 17,
				products: [
					{
						id: 1,
						title: "Essence Mascara Lash Princess",
						price: 9.99,
						quantity: 2,
						total: 19.98,
						discountPercentage: 0.63,
						discountedTotal: 19.85,
						thumbnail:
							"https://cdn.dummyjson.com/products/images/beauty/Essence%20Mascara%20Lash%20Princess/thumbnail.png",
					},
					{
						id: 60,
						title: "Grater Black",
						price: 10.99,
						quantity: 3,
						total: 32.97,
						discountPercentage: 16.62,
						discountedTotal: 27.49,
						thumbnail:
							"https://cdn.dummyjson.com/products/images/kitchen-accessories/Grater%20Black/thumbnail.png",
					},
					{
						id: 74,
						title: "Spoon",
						price: 4.99,
						quantity: 4,
						total: 19.96,
						discountPercentage: 2.78,
						discountedTotal: 19.41,
						thumbnail:
							"https://cdn.dummyjson.com/products/images/kitchen-accessories/Spoon/thumbnail.png",
					},
					{
						id: 44,
						title: "Family Tree Photo Frame",
						price: 29.99,
						quantity: 4,
						total: 119.96,
						discountPercentage: 10.68,
						discountedTotal: 107.15,
						thumbnail:
							"https://cdn.dummyjson.com/products/images/home-decoration/Family%20Tree%20Photo%20Frame/thumbnail.png",
					},
				],
				total: 192.87,
				discountedTotal: 173.9,
				userId: 141,
				totalProducts: 4,
				totalQuantity: 13,
			},
			{
				id: 18,
				products: [
					{
						id: 127,
						title: "Oppo K1",
						price: 299.99,
						quantity: 4,
						total: 1199.96,
						discountPercentage: 15.93,
						discountedTotal: 1008.81,
						thumbnail:
							"https://cdn.dummyjson.com/products/images/smartphones/Oppo%20K1/thumbnail.png",
					},
					{
						id: 24,
						title: "Fish Steak",
						price: 14.99,
						quantity: 3,
						total: 44.97,
						discountPercentage: 7.66,
						discountedTotal: 41.53,
						thumbnail:
							"https://cdn.dummyjson.com/products/images/groceries/Fish%20Steak/thumbnail.png",
					},
					{
						id: 20,
						title: "Cooking Oil",
						price: 4.99,
						quantity: 5,
						total: 24.95,
						discountPercentage: 12.62,
						discountedTotal: 21.8,
						thumbnail:
							"https://cdn.dummyjson.com/products/images/groceries/Cooking%20Oil/thumbnail.png",
					},
					{
						id: 154,
						title: "Black Sun Glasses",
						price: 29.99,
						quantity: 3,
						total: 89.97,
						discountPercentage: 1.11,
						discountedTotal: 88.97,
						thumbnail:
							"https://cdn.dummyjson.com/products/images/sunglasses/Black%20Sun%20Glasses/thumbnail.png",
					},
					{
						id: 44,
						title: "Family Tree Photo Frame",
						price: 29.99,
						quantity: 2,
						total: 59.98,
						discountPercentage: 10.68,
						discountedTotal: 53.57,
						thumbnail:
							"https://cdn.dummyjson.com/products/images/home-decoration/Family%20Tree%20Photo%20Frame/thumbnail.png",
					},
					{
						id: 5,
						title: "Red Nail Polish",
						price: 8.99,
						quantity: 5,
						total: 44.95,
						discountPercentage: 3.76,
						discountedTotal: 43.26,
						thumbnail:
							"https://cdn.dummyjson.com/products/images/beauty/Red%20Nail%20Polish/thumbnail.png",
					},
				],
				total: 1464.78,
				discountedTotal: 1257.94,
				userId: 189,
				totalProducts: 6,
				totalQuantity: 22,
			},
			{
				id: 19,
				products: [
					{
						id: 187,
						title: "Golden Shoes Woman",
						price: 49.99,
						quantity: 3,
						total: 149.97,
						discountPercentage: 1.64,
						discountedTotal: 147.51,
						thumbnail:
							"https://cdn.dummyjson.com/products/images/womens-shoes/Golden%20Shoes%20Woman/thumbnail.png",
					},
					{
						id: 153,
						title: "Volleyball",
						price: 11.99,
						quantity: 5,
						total: 59.95,
						discountPercentage: 16.05,
						discountedTotal: 50.33,
						thumbnail:
							"https://cdn.dummyjson.com/products/images/sports-accessories/Volleyball/thumbnail.png",
					},
					{
						id: 34,
						title: "Nescafe Coffee",
						price: 7.99,
						quantity: 3,
						total: 23.97,
						discountPercentage: 8.31,
						discountedTotal: 21.98,
						thumbnail:
							"https://cdn.dummyjson.com/products/images/groceries/Nescafe%20Coffee/thumbnail.png",
					},
					{
						id: 130,
						title: "Realme XT",
						price: 349.99,
						quantity: 2,
						total: 699.98,
						discountPercentage: 17.86,
						discountedTotal: 574.96,
						thumbnail:
							"https://cdn.dummyjson.com/products/images/smartphones/Realme%20XT/thumbnail.png",
					},
				],
				total: 933.87,
				discountedTotal: 794.78,
				userId: 59,
				totalProducts: 4,
				totalQuantity: 13,
			},
			{
				id: 20,
				products: [
					{
						id: 107,
						title: "Beats Flex Wireless Earphones",
						price: 49.99,
						quantity: 1,
						total: 49.99,
						discountPercentage: 8.79,
						discountedTotal: 45.6,
						thumbnail:
							"https://cdn.dummyjson.com/products/images/mobile-accessories/Beats%20Flex%20Wireless%20Earphones/thumbnail.png",
					},
					{
						id: 193,
						title: "Watch Gold for Women",
						price: 799.99,
						quantity: 3,
						total: 2399.97,
						discountPercentage: 19.53,
						discountedTotal: 1931.26,
						thumbnail:
							"https://cdn.dummyjson.com/products/images/womens-watches/Watch%20Gold%20for%20Women/thumbnail.png",
					},
					{
						id: 100,
						title: "Apple Airpods",
						price: 129.99,
						quantity: 3,
						total: 389.97,
						discountPercentage: 12.84,
						discountedTotal: 339.9,
						thumbnail:
							"https://cdn.dummyjson.com/products/images/mobile-accessories/Apple%20Airpods/thumbnail.png",
					},
					{
						id: 90,
						title: "Puma Future Rider Trainers",
						price: 89.99,
						quantity: 5,
						total: 449.95,
						discountPercentage: 14.7,
						discountedTotal: 383.81,
						thumbnail:
							"https://cdn.dummyjson.com/products/images/mens-shoes/Puma%20Future%20Rider%20Trainers/thumbnail.png",
					},
					{
						id: 118,
						title: "Attitude Super Leaves Hand Soap",
						price: 8.99,
						quantity: 5,
						total: 44.95,
						discountPercentage: 7.23,
						discountedTotal: 41.7,
						thumbnail:
							"https://cdn.dummyjson.com/products/images/skin-care/Attitude%20Super%20Leaves%20Hand%20Soap/thumbnail.png",
					},
					{
						id: 166,
						title: "Tartan Dress",
						price: 39.99,
						quantity: 5,
						total: 199.95,
						discountPercentage: 2.82,
						discountedTotal: 194.31,
						thumbnail:
							"https://cdn.dummyjson.com/products/images/tops/Tartan%20Dress/thumbnail.png",
					},
				],
				total: 3534.78,
				discountedTotal: 2936.58,
				userId: 90,
				totalProducts: 6,
				totalQuantity: 22,
			},
			{
				id: 21,
				products: [
					{
						id: 77,
						title: "Yellow Peeler",
						price: 5.99,
						quantity: 2,
						total: 11.98,
						discountPercentage: 13.16,
						discountedTotal: 10.4,
						thumbnail:
							"https://cdn.dummyjson.com/products/images/kitchen-accessories/Yellow%20Peeler/thumbnail.png",
					},
					{
						id: 91,
						title: "Sports Sneakers Off White & Red",
						price: 119.99,
						quantity: 2,
						total: 239.98,
						discountPercentage: 1.96,
						discountedTotal: 235.28,
						thumbnail:
							"https://cdn.dummyjson.com/products/images/mens-shoes/Sports%20Sneakers%20Off%20White%20&%20Red/thumbnail.png",
					},
				],
				total: 251.96,
				discountedTotal: 245.68,
				userId: 42,
				totalProducts: 2,
				totalQuantity: 4,
			},
			{
				id: 22,
				products: [
					{
						id: 73,
						title: "Spice Rack",
						price: 19.99,
						quantity: 5,
						total: 99.95,
						discountPercentage: 8.74,
						discountedTotal: 91.21,
						thumbnail:
							"https://cdn.dummyjson.com/products/images/kitchen-accessories/Spice%20Rack/thumbnail.png",
					},
					{
						id: 2,
						title: "Eyeshadow Palette with Mirror",
						price: 19.99,
						quantity: 2,
						total: 39.98,
						discountPercentage: 0.7,
						discountedTotal: 39.7,
						thumbnail:
							"https://cdn.dummyjson.com/products/images/beauty/Eyeshadow%20Palette%20with%20Mirror/thumbnail.png",
					},
					{
						id: 69,
						title: "Plate",
						price: 3.99,
						quantity: 2,
						total: 7.98,
						discountPercentage: 16,
						discountedTotal: 6.7,
						thumbnail:
							"https://cdn.dummyjson.com/products/images/kitchen-accessories/Plate/thumbnail.png",
					},
					{
						id: 155,
						title: "Classic Sun Glasses",
						price: 24.99,
						quantity: 3,
						total: 74.97,
						discountPercentage: 9.27,
						discountedTotal: 68.02,
						thumbnail:
							"https://cdn.dummyjson.com/products/images/sunglasses/Classic%20Sun%20Glasses/thumbnail.png",
					},
				],
				total: 222.88,
				discountedTotal: 205.63,
				userId: 140,
				totalProducts: 4,
				totalQuantity: 12,
			},
			{
				id: 23,
				products: [
					{
						id: 82,
						title: "New DELL XPS 13 9300 Laptop",
						price: 1499.99,
						quantity: 5,
						total: 7499.95,
						discountPercentage: 3.9,
						discountedTotal: 7207.45,
						thumbnail:
							"https://cdn.dummyjson.com/products/images/laptops/New%20DELL%20XPS%2013%209300%20Laptop/thumbnail.png",
					},
					{
						id: 172,
						title: "Blue Women's Handbag",
						price: 49.99,
						quantity: 4,
						total: 199.96,
						discountPercentage: 8.08,
						discountedTotal: 183.8,
						thumbnail:
							"https://cdn.dummyjson.com/products/images/womens-bags/Blue%20Women's%20Handbag/thumbnail.png",
					},
					{
						id: 41,
						title: "Tissue Paper Box",
						price: 2.49,
						quantity: 2,
						total: 4.98,
						discountPercentage: 2.74,
						discountedTotal: 4.84,
						thumbnail:
							"https://cdn.dummyjson.com/products/images/groceries/Tissue%20Paper%20Box/thumbnail.png",
					},
					{
						id: 37,
						title: "Red Onions",
						price: 1.99,
						quantity: 4,
						total: 7.96,
						discountPercentage: 8.95,
						discountedTotal: 7.25,
						thumbnail:
							"https://cdn.dummyjson.com/products/images/groceries/Red%20Onions/thumbnail.png",
					},
					{
						id: 138,
						title: "Baseball Ball",
						price: 8.99,
						quantity: 5,
						total: 44.95,
						discountPercentage: 18.49,
						discountedTotal: 36.64,
						thumbnail:
							"https://cdn.dummyjson.com/products/images/sports-accessories/Baseball%20Ball/thumbnail.png",
					},
				],
				total: 7757.8,
				discountedTotal: 7439.98,
				userId: 147,
				totalProducts: 5,
				totalQuantity: 20,
			},
			{
				id: 24,
				products: [
					{
						id: 108,
						title: "iPhone 12 Silicone Case with MagSafe Plum",
						price: 29.99,
						quantity: 5,
						total: 149.95,
						discountPercentage: 14.68,
						discountedTotal: 127.94,
						thumbnail:
							"https://cdn.dummyjson.com/products/images/mobile-accessories/iPhone%2012%20Silicone%20Case%20with%20MagSafe%20Plum/thumbnail.png",
					},
					{
						id: 134,
						title: "Vivo S1",
						price: 249.99,
						quantity: 4,
						total: 999.96,
						discountPercentage: 5.64,
						discountedTotal: 943.56,
						thumbnail:
							"https://cdn.dummyjson.com/products/images/smartphones/Vivo%20S1/thumbnail.png",
					},
					{
						id: 174,
						title: "Prada Women Bag",
						price: 599.99,
						quantity: 1,
						total: 599.99,
						discountPercentage: 12.86,
						discountedTotal: 522.83,
						thumbnail:
							"https://cdn.dummyjson.com/products/images/womens-bags/Prada%20Women%20Bag/thumbnail.png",
					},
				],
				total: 1749.9,
				discountedTotal: 1594.33,
				userId: 6,
				totalProducts: 3,
				totalQuantity: 10,
			},
			{
				id: 25,
				products: [
					{
						id: 4,
						title: "Red Lipstick",
						price: 12.99,
						quantity: 1,
						total: 12.99,
						discountPercentage: 14.69,
						discountedTotal: 11.08,
						thumbnail:
							"https://cdn.dummyjson.com/products/images/beauty/Red%20Lipstick/thumbnail.png",
					},
					{
						id: 126,
						title: "Oppo F19 Pro+",
						price: 399.99,
						quantity: 1,
						total: 399.99,
						discountPercentage: 14.38,
						discountedTotal: 342.47,
						thumbnail:
							"https://cdn.dummyjson.com/products/images/smartphones/Oppo%20F19%20Pro+/thumbnail.png",
					},
				],
				total: 412.98,
				discountedTotal: 353.55,
				userId: 118,
				totalProducts: 2,
				totalQuantity: 2,
			},
			{
				id: 26,
				products: [
					{
						id: 37,
						title: "Red Onions",
						price: 1.99,
						quantity: 5,
						total: 9.95,
						discountPercentage: 8.95,
						discountedTotal: 9.06,
						thumbnail:
							"https://cdn.dummyjson.com/products/images/groceries/Red%20Onions/thumbnail.png",
					},
					{
						id: 128,
						title: "Realme C35",
						price: 149.99,
						quantity: 3,
						total: 449.97,
						discountPercentage: 3.97,
						discountedTotal: 432.11,
						thumbnail:
							"https://cdn.dummyjson.com/products/images/smartphones/Realme%20C35/thumbnail.png",
					},
				],
				total: 459.92,
				discountedTotal: 441.17,
				userId: 66,
				totalProducts: 2,
				totalQuantity: 8,
			},
			{
				id: 27,
				products: [
					{
						id: 33,
						title: "Mulberry",
						price: 4.99,
						quantity: 1,
						total: 4.99,
						discountPercentage: 2.75,
						discountedTotal: 4.85,
						thumbnail:
							"https://cdn.dummyjson.com/products/images/groceries/Mulberry/thumbnail.png",
					},
					{
						id: 110,
						title: "Selfie Lamp with iPhone",
						price: 14.99,
						quantity: 2,
						total: 29.98,
						discountPercentage: 19.87,
						discountedTotal: 24.02,
						thumbnail:
							"https://cdn.dummyjson.com/products/images/mobile-accessories/Selfie%20Lamp%20with%20iPhone/thumbnail.png",
					},
					{
						id: 16,
						title: "Apple",
						price: 1.99,
						quantity: 3,
						total: 5.97,
						discountPercentage: 11.74,
						discountedTotal: 5.27,
						thumbnail:
							"https://cdn.dummyjson.com/products/images/groceries/Apple/thumbnail.png",
					},
					{
						id: 83,
						title: "Blue & Black Check Shirt",
						price: 29.99,
						quantity: 5,
						total: 149.95,
						discountPercentage: 8.76,
						discountedTotal: 136.81,
						thumbnail:
							"https://cdn.dummyjson.com/products/images/mens-shirts/Blue%20&%20Black%20Check%20Shirt/thumbnail.png",
					},
				],
				total: 190.89,
				discountedTotal: 170.95,
				userId: 75,
				totalProducts: 4,
				totalQuantity: 11,
			},
			{
				id: 28,
				products: [
					{
						id: 1,
						title: "Essence Mascara Lash Princess",
						price: 9.99,
						quantity: 5,
						total: 49.95,
						discountPercentage: 0.63,
						discountedTotal: 49.64,
						thumbnail:
							"https://cdn.dummyjson.com/products/images/beauty/Essence%20Mascara%20Lash%20Princess/thumbnail.png",
					},
					{
						id: 141,
						title: "Basketball Rim",
						price: 39.99,
						quantity: 4,
						total: 159.96,
						discountPercentage: 14.7,
						discountedTotal: 136.45,
						thumbnail:
							"https://cdn.dummyjson.com/products/images/sports-accessories/Basketball%20Rim/thumbnail.png",
					},
				],
				total: 209.91,
				discountedTotal: 186.09,
				userId: 147,
				totalProducts: 2,
				totalQuantity: 9,
			},
			{
				id: 29,
				products: [
					{
						id: 80,
						title: "Huawei Matebook X Pro",
						price: 1399.99,
						quantity: 2,
						total: 2799.98,
						discountPercentage: 9.99,
						discountedTotal: 2520.26,
						thumbnail:
							"https://cdn.dummyjson.com/products/images/laptops/Huawei%20Matebook%20X%20Pro/thumbnail.png",
					},
					{
						id: 107,
						title: "Beats Flex Wireless Earphones",
						price: 49.99,
						quantity: 4,
						total: 199.96,
						discountPercentage: 8.79,
						discountedTotal: 182.38,
						thumbnail:
							"https://cdn.dummyjson.com/products/images/mobile-accessories/Beats%20Flex%20Wireless%20Earphones/thumbnail.png",
					},
					{
						id: 25,
						title: "Green Bell Pepper",
						price: 1.29,
						quantity: 2,
						total: 2.58,
						discountPercentage: 1.2,
						discountedTotal: 2.55,
						thumbnail:
							"https://cdn.dummyjson.com/products/images/groceries/Green%20Bell%20Pepper/thumbnail.png",
					},
					{
						id: 121,
						title: "iPhone 5s",
						price: 199.99,
						quantity: 4,
						total: 799.96,
						discountPercentage: 8.38,
						discountedTotal: 732.92,
						thumbnail:
							"https://cdn.dummyjson.com/products/images/smartphones/iPhone%205s/thumbnail.png",
					},
					{
						id: 153,
						title: "Volleyball",
						price: 11.99,
						quantity: 5,
						total: 59.95,
						discountPercentage: 16.05,
						discountedTotal: 50.33,
						thumbnail:
							"https://cdn.dummyjson.com/products/images/sports-accessories/Volleyball/thumbnail.png",
					},
				],
				total: 3862.43,
				discountedTotal: 3488.44,
				userId: 170,
				totalProducts: 5,
				totalQuantity: 17,
			},
			{
				id: 30,
				products: [
					{
						id: 181,
						title: "Marni Red & Black Suit",
						price: 179.99,
						quantity: 1,
						total: 179.99,
						discountPercentage: 14.21,
						discountedTotal: 154.41,
						thumbnail:
							"https://cdn.dummyjson.com/products/images/womens-dresses/Marni%20Red%20&%20Black%20Suit/thumbnail.png",
					},
					{
						id: 171,
						title: "Pacifica Touring",
						price: 31999.99,
						quantity: 4,
						total: 127999.96,
						discountPercentage: 7.4,
						discountedTotal: 118527.96,
						thumbnail:
							"https://cdn.dummyjson.com/products/images/vehicle/Pacifica%20Touring/thumbnail.png",
					},
					{
						id: 35,
						title: "Potatoes",
						price: 2.29,
						quantity: 4,
						total: 9.16,
						discountPercentage: 1.69,
						discountedTotal: 9.01,
						thumbnail:
							"https://cdn.dummyjson.com/products/images/groceries/Potatoes/thumbnail.png",
					},
					{
						id: 46,
						title: "Plant Pot",
						price: 14.99,
						quantity: 4,
						total: 59.96,
						discountPercentage: 17.65,
						discountedTotal: 49.38,
						thumbnail:
							"https://cdn.dummyjson.com/products/images/home-decoration/Plant%20Pot/thumbnail.png",
					},
				],
				total: 128249.07,
				discountedTotal: 118740.76,
				userId: 177,
				totalProducts: 4,
				totalQuantity: 13,
			},
		],
		total: 50,
		skip: 0,
		limit: 30,
	};
}
