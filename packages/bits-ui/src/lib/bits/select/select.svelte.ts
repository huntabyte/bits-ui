import { Context, Previous, watch } from "runed";
import {
	afterSleep,
	afterTick,
	onDestroyEffect,
	attachRef,
	DOMContext,
	executeCallbacks,
	type ReadableBoxedValues,
	type WritableBoxedValues,
	type Box,
	boxWith,
} from "svelte-toolbelt";
import { on } from "svelte/events";
import { backward, forward, next, prev } from "$lib/internal/arrays.js";
import {
	boolToStr,
	boolToStrTrueOrUndef,
	boolToEmptyStrOrUndef,
	getDataOpenClosed,
	boolToTrueOrUndef,
	getDataTransitionAttrs,
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
import { isOrContainsTarget } from "$lib/internal/elements.js";
import { createBitsAttrs } from "$lib/internal/attrs.js";
import { getFloatingContentCSSVars } from "$lib/internal/floating-svelte/floating-utils.svelte.js";
import { DataTypeahead } from "$lib/internal/data-typeahead.svelte.js";
import { DOMTypeahead } from "$lib/internal/dom-typeahead.svelte.js";
import { PresenceManager } from "$lib/internal/presence-manager.svelte.js";
import { DEV } from "esm-env";
import type { SelectValueSnippetProps } from "./types.js";

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
	contentPresence: PresenceManager;
	viewportNode = $state<HTMLElement | null>(null);
	triggerNode = $state<HTMLElement | null>(null);
	triggerPointerDownPos = $state<{ x: number; y: number } | null>(null);
	valueNode = $state<HTMLElement | null>(null);
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
	contentIsPositioned = $state(false);
	isItemAligned = $state(false);
	isUsingKeyboard = false;
	isCombobox = false;
	domContext = new DOMContext(() => null);
	selectedItemNode = $state<HTMLElement | null>(null);
	contentWrapperNode = $state<HTMLElement | null>(null);

	constructor(opts: SelectBaseRootStateOpts) {
		this.opts = opts;
		this.isCombobox = opts.isCombobox;

		this.contentPresence = new PresenceManager({
			ref: boxWith(() => this.contentNode),
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
		// In item-aligned mode, the content positioner scrolls the viewport so the
		// selected item lines up with the trigger. Calling scrollIntoView here would
		// fight that positioning and break the alignment.
		if (node && (this.isUsingKeyboard || initial) && !this.isItemAligned) {
			this.scrollHighlightedNodeIntoView(node);
		}
	}

	scrollHighlightedNodeIntoView(node: HTMLElement) {
		if (!this.viewportNode || !this.contentIsPositioned) return;
		node.scrollIntoView({ block: this.opts.scrollAlignment.current });
	}

	getCandidateNodes(): HTMLElement[] {
		const node = this.contentNode;
		if (!node) return [];
		return Array.from(
			node.querySelectorAll<HTMLElement>(`[${this.getBitsAttr("item")}]:not([data-disabled])`)
		);
	}

	getAllItemNodes(): HTMLElement[] {
		const node = this.contentNode;
		if (!node) return [];
		return Array.from(node.querySelectorAll<HTMLElement>(`[${this.getBitsAttr("item")}]`));
	}

	setHighlightedToFirstCandidate(initial = false) {
		this.setHighlightedNode(null);

		let nodes = this.getCandidateNodes();
		if (!nodes.length) return;

		// don't consider nodes that aren't visible within the viewport
		if (this.viewportNode) {
			const viewportRect = this.viewportNode.getBoundingClientRect();

			nodes = nodes.filter((node) => {
				if (!this.viewportNode) return false;

				const nodeRect = node.getBoundingClientRect();

				const isNodeFullyVisible =
					nodeRect.right <= viewportRect.right &&
					nodeRect.left >= viewportRect.left &&
					nodeRect.bottom <= viewportRect.bottom &&
					nodeRect.top >= viewportRect.top;

				return isNodeFullyVisible;
			});
		}

		this.setHighlightedNode(nodes[0]!, initial);
	}

	getNodeByValue(value: string): HTMLElement | null {
		const candidateNodes = this.getCandidateNodes();
		return candidateNodes.find((node) => node.dataset.value === value) ?? null;
	}

	/**
	 * Resolves the display label for a value: `items` entry when present, otherwise the
	 * mounted item's `data-label` or its text content.
	 */
	getLabelForValue(value: string): string {
		if (value === "") return "";
		const fromItems = this.opts.items.current.find((item) => item.value === value)?.label;
		if (fromItems !== undefined) return fromItems;
		const node = this.getNodeByValue(value);
		if (node) {
			const dataLabel = node.getAttribute("data-label");
			if (dataLabel !== null && dataLabel !== "") return dataLabel;
			return node.textContent?.trim() ?? value;
		}
		return value;
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
		return (
			this.opts.items.current.find((item) => item.value === this.opts.value.current)?.label ??
			""
		);
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
		const newValue = this.includesItem(itemValue) ? "" : itemValue;
		this.opts.value.current = newValue;
		if (newValue !== "") {
			this.opts.inputValue.current = itemLabel;
		}
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
			this.setHighlightedToFirstCandidate(true);
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
			this.setHighlightedToFirstCandidate(true);
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

type SelectValueStateProps = WithRefOpts<
	ReadableBoxedValues<{
		placeholder: string | null | undefined;
	}>
>;

export class SelectValueState {
	static create(opts: SelectValueStateProps) {
		return new SelectValueState(opts, SelectRootContext.get());
	}
	readonly root: SelectRoot;
	readonly opts: SelectValueStateProps;
	readonly attachment: RefAttachment;

	constructor(opts: SelectValueStateProps, root: SelectRoot) {
		this.root = root;
		this.opts = opts;
		this.attachment = attachRef(opts.ref, (v) => (this.root.valueNode = v));
		this.setValue = this.setValue.bind(this);
	}

	setValue(value: string | string[]) {
		if (this.root.isMulti && !Array.isArray(value)) {
			if (DEV)
				throw new Error(
					`Expected an array of strings passed to \`setValue\` got ${typeof value}.`
				);
			return;
		}
		if (!this.root.isMulti && typeof value !== "string") {
			if (DEV)
				throw new Error(`Expected a string passed to \`setValue\` got ${typeof value}.`);
			return;
		}
		this.root.opts.value.current = value;
	}

	// this way consumers get type narrowing for the value on `type`
	readonly snippetProps: SelectValueSnippetProps = $derived.by(() => {
		if (this.root.isMulti) {
			return {
				selection: {
					type: "multiple" as const,
					selected:
						this.root.opts.value.current.length > 0
							? this.root.opts.value.current.map((value) => ({
									value,
									label: this.root.getLabelForValue(value),
								}))
							: [],
					setValue: this.setValue,
				},
				placeholder: this.opts.placeholder.current ?? null,
				disabled: this.root.opts.disabled.current,
			};
		}
		const value = this.root.opts.value.current;
		return {
			selection: {
				type: "single" as const,
				selected:
					value !== ""
						? { value, label: value === "" ? "" : this.root.getLabelForValue(value) }
						: undefined,
				setValue: this.setValue,
			},
			placeholder: this.opts.placeholder.current ?? null,
			disabled: this.root.opts.disabled.current,
		};
	});

	readonly props = $derived.by(() => ({
		id: this.opts.id.current,
		"data-placeholder": this.root.hasValue ? undefined : "",
		"data-select-value": "",
		...this.attachment,
	}));
}

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
				"aria-expanded": boolToStr(this.root.opts.open.current),
				"data-state": getDataOpenClosed(this.root.opts.open.current),
				"data-disabled": boolToEmptyStrOrUndef(this.root.opts.disabled.current),
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
				"data-disabled": boolToEmptyStrOrUndef(this.root.opts.disabled.current),
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

	#handlePointerOpen(e: PointerEvent) {
		this.root.triggerPointerDownPos = {
			x: Math.round(e.pageX),
			y: Math.round(e.pageY),
		};
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
				"aria-expanded": boolToStr(this.root.opts.open.current),
				"aria-activedescendant": this.root.highlightedId,
				"data-state": getDataOpenClosed(this.root.opts.open.current),
				"data-disabled": boolToEmptyStrOrUndef(this.root.opts.disabled.current),
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
			position: "popper" | "item-aligned";
		}> {}

export class SelectContentState {
	static create(opts: SelectContentStateOpts) {
		return SelectContentContext.set(new SelectContentState(opts, SelectRootContext.get()));
	}
	readonly opts: SelectContentStateOpts;
	readonly root: SelectRoot;
	readonly attachment: RefAttachment;
	isPositioned = $state(false);
	domContext: DOMContext;
	readonly useItemAligned = $derived.by(() => this.opts.position.current === "item-aligned");
	// Matches Radix shouldRepositionRef — resets to true on each open, flipped false after
	// the first scroll-button-triggered reposition so we only reposition once.
	shouldReposition = true;
	// Matches Radix shouldExpandOnScrollRef — activated after initial positioning so that
	// user-initiated scrolling can expand the content wrapper height.
	shouldExpandOnScroll = false;
	// True when #position() used the if-branch (content grows upward from below trigger).
	expandsUpward = false;

	constructor(opts: SelectContentStateOpts, root: SelectRoot) {
		this.opts = opts;
		this.root = root;
		this.attachment = attachRef(opts.ref, (v) => (this.root.contentNode = v));
		this.domContext = new DOMContext(this.opts.ref);

		if (this.root.domContext === null) {
			this.root.domContext = this.domContext;
		}

		$effect(() => {
			this.root.isItemAligned = this.useItemAligned;
		});

		onDestroyEffect(() => {
			this.root.contentNode = null;
			this.root.contentWrapperNode = null;
			this.root.contentIsPositioned = false;
			this.isPositioned = false;
		});

		watch(
			() => this.root.opts.open.current,
			() => {
				if (this.root.opts.open.current) {
					this.shouldReposition = true;
					this.shouldExpandOnScroll = false;
					return;
				}
				this.root.contentIsPositioned = false;
				this.isPositioned = false;
			}
		);

		watch([() => this.isPositioned, () => this.root.highlightedNode], () => {
			if (!this.isPositioned || !this.root.highlightedNode) return;
			if (this.useItemAligned) return;
			this.root.scrollHighlightedNodeIntoView(this.root.highlightedNode);
		});

		// Re-run item-aligned positioning whenever layout-affecting state changes.
		watch(
			[
				() => this.useItemAligned,
				() => this.root.opts.open.current,
				() => this.root.contentWrapperNode,
				() => this.root.contentNode,
				() => this.root.viewportNode,
				() => this.root.triggerNode,
				() => this.root.selectedItemNode,
			],
			() => {
				if (!this.useItemAligned || !this.root.opts.open.current) return;
				this.#position();
			}
		);

		// Radix closes the select on resize in item-aligned mode.
		// On page scroll, reposition without clamping so the content scrolls off-screen
		// naturally when the trigger scrolls out of view.
		$effect(() => {
			if (!this.useItemAligned) return;
			const win = this.domContext.getWindow();
			if (!win) return;
			const reposition = (e: Event) => {
				if (e.target === this.root.viewportNode) return;
				if (!this.isPositioned) return;
				this.#repositionOnScroll();
			};
			return executeCallbacks(
				on(win, "resize", () => this.root.handleClose()),
				on(win, "scroll", reposition, { capture: true, passive: true })
			);
		});

		// Mirrors Radix's pointer-movement threshold guard. When the menu opens via a
		// mouse pointerdown on the trigger, attach document-level listeners that track
		// how far the pointer has moved. On the first pointerup, if the delta is ≤10px
		// in both axes, preventDefault() blocks item selection so that a quick click-to-
		// open doesn't immediately re-select the highlighted item.
		$effect(() => {
			const content = this.root.contentNode;
			const triggerPointerDownPos = this.root.triggerPointerDownPos;
			if (!content || !triggerPointerDownPos) return;

			const doc = this.domContext.getDocument();
			let pointerMoveDelta = { x: 0, y: 0 };

			const handlePointerMove = (e: PointerEvent) => {
				pointerMoveDelta = {
					x: Math.abs(Math.round(e.pageX) - triggerPointerDownPos.x),
					y: Math.abs(Math.round(e.pageY) - triggerPointerDownPos.y),
				};
			};

			const handlePointerUp = (e: PointerEvent) => {
				if (pointerMoveDelta.x <= 10 && pointerMoveDelta.y <= 10) {
					e.preventDefault();
				} else if (!content.contains(e.target as HTMLElement)) {
					this.root.handleClose();
				}
				this.root.triggerPointerDownPos = null;
			};

			doc.addEventListener("pointermove", handlePointerMove);
			doc.addEventListener("pointerup", handlePointerUp, { capture: true, once: true });

			return () => {
				doc.removeEventListener("pointermove", handlePointerMove);
				doc.removeEventListener("pointerup", handlePointerUp, { capture: true });
			};
		});

		this.onpointermove = this.onpointermove.bind(this);
	}

	setContentWrapper(node: HTMLElement | null) {
		this.root.contentWrapperNode = node;
	}

	/**
	 * Called when a scroll button mounts. Mirrors Radix's `handleScrollButtonChange`:
	 * repositions once if `shouldReposition` is still true (scroll up button appearance
	 * shifts the viewport down, invalidating the initial alignment).
	 */
	handleScrollButtonChange() {
		if (this.shouldReposition) {
			this.#position();
			this.shouldReposition = false;
		}
	}

	/**
	 * Called by SelectViewportState's scroll handler. Expands the content wrapper height
	 * as the user scrolls, up to the available viewport height. Mirrors Radix's
	 * `shouldExpandOnScrollRef` logic in the viewport's onScroll handler.
	 */
	handleExpandOnScroll(viewport: HTMLElement, prevScrollTop: number): number {
		const contentWrapper = this.root.contentWrapperNode;
		if (!this.shouldExpandOnScroll || !contentWrapper) return viewport.scrollTop;

		const scrolledBy = Math.abs(prevScrollTop - viewport.scrollTop);
		if (scrolledBy > 0) {
			const win = this.domContext.getWindow();
			if (!win) return viewport.scrollTop;
			const availableHeight = win.innerHeight - CONTENT_MARGIN * 2;
			const cssMinHeight = parseFloat(contentWrapper.style.minHeight);
			const cssHeight = parseFloat(contentWrapper.style.height);
			const prevHeight = Math.max(cssMinHeight, cssHeight);
			if (prevHeight < availableHeight) {
				const nextHeight = prevHeight + scrolledBy;
				const clampedNextHeight = Math.min(availableHeight, nextHeight);
				const heightDiff = nextHeight - clampedNextHeight;
				const actualIncrease = clampedNextHeight - prevHeight;
				contentWrapper.style.height = clampedNextHeight + "px";
				if (this.expandsUpward) {
					// Grow upward: shift top up by the amount height grew.
					contentWrapper.style.top =
						(parseFloat(contentWrapper.style.top) - actualIncrease) + "px";
					viewport.scrollTop = heightDiff > 0 ? heightDiff : 0;
					contentWrapper.style.justifyContent = "flex-end";
				}
			}
		}
		return viewport.scrollTop;
	}

	/**
	 * Positions the content wrapper so the selected item's center aligns with the
	 * trigger's center, exactly matching the Radix UI SelectItemAlignedPosition algorithm.
	 */
	#position() {
		const contentWrapper = this.root.contentWrapperNode;
		const content = this.root.contentNode;
		const viewport = this.root.viewportNode;
		const trigger = this.root.triggerNode;
		const selectedItem = this.root.selectedItemNode;

		if (!contentWrapper || !content || !viewport || !trigger || !selectedItem) {
			return;
		}

		const win = this.domContext.getWindow();
		if (!win) return;

		const triggerRect = trigger.getBoundingClientRect();

		// -----------------------------------------------------------------------------------------
		// Horizontal positioning — match trigger width and left edge exactly.
		// -----------------------------------------------------------------------------------------
		contentWrapper.style.width = triggerRect.width + "px";
		contentWrapper.style.left = triggerRect.left + "px";

		// -----------------------------------------------------------------------------------------
		// Vertical positioning
		// -----------------------------------------------------------------------------------------
		const allItems = this.root.getAllItemNodes();
		const availableHeight = win.innerHeight - CONTENT_MARGIN * 2;
		const itemsHeight = viewport.scrollHeight;

		const contentStyles = win.getComputedStyle(content);
		const contentBorderTopWidth = parseInt(contentStyles.borderTopWidth, 10);
		const contentPaddingTop = parseInt(contentStyles.paddingTop, 10);
		const contentBorderBottomWidth = parseInt(contentStyles.borderBottomWidth, 10);
		const contentPaddingBottom = parseInt(contentStyles.paddingBottom, 10);
		// prettier-ignore
		const fullContentHeight = contentBorderTopWidth + contentPaddingTop + itemsHeight + contentPaddingBottom + contentBorderBottomWidth;
		const minContentHeight = Math.min(selectedItem.offsetHeight * 5, fullContentHeight);

		const viewportStyles = win.getComputedStyle(viewport);
		const viewportPaddingTop = parseInt(viewportStyles.paddingTop, 10);
		const viewportPaddingBottom = parseInt(viewportStyles.paddingBottom, 10);

		const topEdgeToTriggerMiddle = triggerRect.top + triggerRect.height / 2 - CONTENT_MARGIN;
		const triggerMiddleToBottomEdge = availableHeight - topEdgeToTriggerMiddle;

		const selectedItemHalfHeight = selectedItem.offsetHeight / 2;
		const itemOffsetMiddle = selectedItem.offsetTop + selectedItemHalfHeight;
		const contentTopToItemMiddle = contentBorderTopWidth + contentPaddingTop + itemOffsetMiddle;
		const itemMiddleToContentBottom = fullContentHeight - contentTopToItemMiddle;
		// Use getBoundingClientRect for a pixel-accurate measurement that includes the content
		// element's border regardless of its CSS position value (relative vs. static changes
		// which element is the offsetParent and whether viewport.offsetTop includes the border).
		const contentWrapperRect = contentWrapper.getBoundingClientRect();
		const selectedItemRect = selectedItem.getBoundingClientRect();
		const viewportTopToItemMiddle =
			selectedItemRect.top - contentWrapperRect.top + viewport.scrollTop + selectedItemHalfHeight;

		const willAlignWithoutTopOverflow = viewportTopToItemMiddle <= topEdgeToTriggerMiddle;

		if (willAlignWithoutTopOverflow) {
			this.expandsUpward = true;
			const isLastItem =
				allItems.length > 0 && selectedItem === allItems[allItems.length - 1];
			const viewportOffsetBottom =
				content.clientHeight - viewport.offsetTop - viewport.offsetHeight;
			const clampedTriggerMiddleToBottomEdge = Math.max(
				triggerMiddleToBottomEdge,
				selectedItemHalfHeight +
					(isLastItem ? viewportPaddingBottom : 0) +
					viewportOffsetBottom +
					contentBorderBottomWidth
			);
			const height = viewportTopToItemMiddle + clampedTriggerMiddleToBottomEdge;
			contentWrapper.style.height = height + "px";
			// Compute top explicitly so content can scroll off-screen with the trigger.
			// Equivalent to bottom:0px + CONTENT_MARGIN gap but expressed as top.
			contentWrapper.style.top = (win.innerHeight - CONTENT_MARGIN - height) + "px";
			contentWrapper.style.bottom = "";
		} else {
			this.expandsUpward = false;
			const isFirstItem = allItems.length > 0 && selectedItem === allItems[0];
			const clampedTopEdgeToTriggerMiddle = Math.max(
				topEdgeToTriggerMiddle,
				contentBorderTopWidth +
					viewport.offsetTop +
					(isFirstItem ? viewportPaddingTop : 0) +
					selectedItemHalfHeight
			);
			const height = clampedTopEdgeToTriggerMiddle + itemMiddleToContentBottom;
			contentWrapper.style.height = height + "px";
			contentWrapper.style.bottom = "";
			// Scroll the viewport so the selected item aligns with the trigger center.
			// For items near the end of the list, the viewport may not be able to scroll as far as
			// needed (scrollTop gets clamped to scrollHeight - clientHeight). In that case, shift
			// the wrapper upward by the uncovered difference to keep the item on the trigger center.
			const desiredScrollTop = viewportTopToItemMiddle - topEdgeToTriggerMiddle;
			viewport.scrollTop = desiredScrollTop;
			const clampedBy = desiredScrollTop - viewport.scrollTop;
			contentWrapper.style.top = (CONTENT_MARGIN - clampedBy) + "px";
		}

		contentWrapper.style.margin = "";
		contentWrapper.style.minHeight = minContentHeight + "px";
		contentWrapper.style.maxHeight = availableHeight + "px";
		// Copy z-index from content so stacking context is preserved.
		contentWrapper.style.zIndex = win.getComputedStyle(content).zIndex;

		if (!this.isPositioned) {
			this.isPositioned = true;
			this.root.contentIsPositioned = true;
		}

		// Enable expand-on-scroll after the initial positioning settles.
		requestAnimationFrame(() => {
			this.shouldExpandOnScroll = true;
		});
	}

	/**
	 * Lightweight reposition used on page scroll. The trigger has moved (page scrolled) but
	 * the content wrapper (position: fixed) has not. Shift the wrapper by the delta between
	 * the trigger center's new position and the selected item's current screen center so the
	 * two stay aligned without rerunning the full layout algorithm.
	 */
	#repositionOnScroll() {
		const contentWrapper = this.root.contentWrapperNode;
		const trigger = this.root.triggerNode;
		const selectedItem = this.root.selectedItemNode;
		if (!contentWrapper || !trigger || !selectedItem) return;

		const currentTop = parseFloat(contentWrapper.style.top) || 0;
		const triggerCenterY = trigger.getBoundingClientRect().top + trigger.offsetHeight / 2;
		const itemCenterY = selectedItem.getBoundingClientRect().top + selectedItem.offsetHeight / 2;
		contentWrapper.style.top = (currentTop + triggerCenterY - itemCenterY) + "px";
		contentWrapper.style.bottom = "";
	}

	onpointermove(_: BitsPointerEvent) {
		this.root.isUsingKeyboard = false;
	}

	readonly #styles = $derived.by(() => {
		return getFloatingContentCSSVars(this.root.isCombobox ? "combobox" : "select");
	});

	onInteractOutside = (e: PointerEvent) => {
		const target = e.target as Element | null;
		if (
			(this.root.triggerNode && isOrContainsTarget(this.root.triggerNode, target as HTMLElement)) ||
			(this.root.inputNode && isOrContainsTarget(this.root.inputNode, target as HTMLElement))
		) {
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

	get shouldRender() {
		return this.root.contentPresence.shouldRender;
	}

	readonly snippetProps = $derived.by(() => ({ open: this.root.opts.open.current }));

	readonly props = $derived.by(
		() =>
			({
				id: this.opts.id.current,
				role: "listbox",
				"aria-multiselectable": this.root.isMulti ? "true" : undefined,
				"data-state": getDataOpenClosed(this.root.opts.open.current),
				"data-side": this.useItemAligned ? "none" : undefined,
				...getDataTransitionAttrs(this.root.contentPresence.transitionStatus),
				[this.root.getBitsAttr("content")]: "",
				style: this.useItemAligned
					? {
							// In item-aligned mode the wrapper div carries all positioning;
							// the content div just needs to fill it with correct box model.
							boxSizing: "border-box",
							maxHeight: "100%",
							display: "flex",
							flexDirection: "column",
							outline: "none",
							pointerEvents: "auto",
						}
					: {
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
				this.root.contentIsPositioned = true;
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

		// Publish this item's node to the root while it is the selected item so the
		// item-aligned positioner can measure it.
		watch([() => this.isSelected, () => this.mounted], () => {
			if (this.isSelected && this.mounted) {
				this.root.selectedItemNode = this.opts.ref.current;
			} else if (this.root.selectedItemNode === this.opts.ref.current) {
				this.root.selectedItemNode = null;
			}
		});

		onDestroyEffect(() => {
			if (this.root.selectedItemNode === this.opts.ref.current) {
				this.root.selectedItemNode = null;
			}
		});

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
				"data-disabled": boolToEmptyStrOrUndef(this.opts.disabled.current),
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
		value: string | undefined;
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
				disabled: boolToTrueOrUndef(this.root.opts.disabled.current),
				required: boolToTrueOrUndef(this.root.opts.required.current),
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
		this.attachment = attachRef(opts.ref, (v) => {
			this.root.viewportNode = v;
		});

		// Expand the content wrapper as the user scrolls in item-aligned mode.
		watch([() => this.root.viewportNode, () => this.content.useItemAligned], () => {
			const viewport = this.root.viewportNode;
			if (!viewport || !this.content.useItemAligned) return;
			let prevScrollTop = viewport.scrollTop;
			return on(viewport, "scroll", () => {
				prevScrollTop = this.content.handleExpandOnScroll(viewport, prevScrollTop);
			});
		});
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
				"aria-hidden": boolToStrTrueOrUndef(true),
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

		watch([() => this.root.viewportNode, () => this.content.isPositioned], () => {
			if (!this.root.viewportNode || !this.content.isPositioned) return;
			this.handleScroll(true);

			return on(this.root.viewportNode, "scroll", () => this.handleScroll());
		});

		/**
		 * If the input value changes, this means that the filtered items may have changed,
		 * so we need to re-evaluate the scroll-ability of the list.
		 */
		watch(
			[
				() => this.root.opts.inputValue.current,
				() => this.root.viewportNode,
				() => this.content.isPositioned,
			],
			() => {
				if (!this.root.viewportNode || !this.content.isPositioned) return;
				this.handleScroll(true);
			}
		);

		watch(
			() => this.scrollButtonState.mounted,
			() => {
				if (!this.scrollButtonState.mounted) return;
				if (this.scrollIntoViewTimer) {
					clearTimeout(this.scrollIntoViewTimer);
				}
				this.scrollIntoViewTimer = afterSleep(5, () => {
					if (this.content.useItemAligned) return;
					const activeItem = this.root.highlightedNode;
					if (!activeItem) return;
					this.root.scrollHighlightedNodeIntoView(activeItem);
				});
				// Reposition once when scroll button appears in item-aligned mode — the button
				// shifts the viewport down, invalidating the initial alignment.
				if (this.content.useItemAligned) {
					this.content.handleScrollButtonChange();
				}
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
		const viewport = this.root.viewportNode;
		if (!viewport) return;
		const maxScroll = viewport.scrollHeight - viewport.clientHeight;
		const paddingTop = Number.parseInt(getComputedStyle(viewport).paddingTop, 10);

		// In item-aligned mode the algorithm may scroll just enough to align the
		// selected item's center with the trigger center, leaving a tiny strip of
		// scrollable space below the last item. That strip would mount the scroll-
		// down arrow even though there is no NEXT item to scroll to. Treat the
		// arrow as unnecessary when the last item's top is already within the
		// visible viewport.
		const items = this.root.getAllItemNodes();
		const lastItem = items.length ? items[items.length - 1] : null;
		const lastItemTopVisible =
			!!lastItem && lastItem.offsetTop < viewport.scrollTop + viewport.clientHeight;

		this.canScrollDown =
			!lastItemTopVisible &&
			Math.ceil(viewport.scrollTop) < maxScroll - paddingTop;
	};

	handleAutoScroll = () => {
		const viewport = this.root.viewportNode;
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

		watch([() => this.root.viewportNode, () => this.content.isPositioned], () => {
			if (!this.root.viewportNode || !this.content.isPositioned) return;

			this.handleScroll(true);
			return on(this.root.viewportNode, "scroll", () => this.handleScroll());
		});

		watch(
			() => this.scrollButtonState.mounted,
			() => {
				// Reposition once when scroll up button appears in item-aligned mode.
				if (this.scrollButtonState.mounted && this.content.useItemAligned) {
					this.content.handleScrollButtonChange();
				}
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
		if (!this.root.viewportNode) return;
		const paddingTop = Number.parseInt(getComputedStyle(this.root.viewportNode).paddingTop, 10);
		this.canScrollUp = this.root.viewportNode.scrollTop - paddingTop > 0.1;
	};

	handleAutoScroll = () => {
		if (!this.root.viewportNode || !this.root.highlightedNode) return;
		this.root.viewportNode.scrollTop =
			this.root.viewportNode.scrollTop - this.root.highlightedNode.offsetHeight;
	};

	readonly props = $derived.by(
		() =>
			({
				...this.scrollButtonState.props,
				[this.root.getBitsAttr("scroll-up-button")]: "",
			}) as const
	);
}
