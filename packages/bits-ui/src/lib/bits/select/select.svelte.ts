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
import { PresenceManager } from "$lib/internal/presence-manager.svelte.js";

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
	selectedItemNode = $state<HTMLElement | null>(null);
	pendingOpenPointerId = $state<number | null>(null);
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

		watch(
			() => this.contentNode,
			() => {
				this.updateSelectedItemNode();
			}
		);
	}

	setHighlightedNode(node: HTMLElement | null, initial = false) {
		this.highlightedNode = node;
		if (node && (this.isUsingKeyboard || initial)) {
			node.scrollIntoView({ block: this.opts.scrollAlignment.current });
		}
	}

	getCandidateNodes(): HTMLElement[] {
		return this.getItemNodes(false);
	}

	getItemNodes(includeDisabled = true): HTMLElement[] {
		const node = this.contentNode;
		if (!node) return [];
		if (includeDisabled) {
			return Array.from(
			node.querySelectorAll<HTMLElement>(`[${this.getBitsAttr("item")}]`)
).filter((item) => !item.hasAttribute("data-disabled"))
		}
		return Array.from(
			node.querySelectorAll<HTMLElement>(`[${this.getBitsAttr("item")}]:not([data-disabled])`)
		);
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

	getNodeByValue(value: string, includeDisabled = false): HTMLElement | null {
		const itemNodes = this.getItemNodes(includeDisabled);
		return itemNodes.find((node) => node.dataset.value === value) ?? null;
	}

	abstract getPrimarySelectedValue(): string | null;

	updateSelectedItemNode() {
		const selectedValue = this.getPrimarySelectedValue();
		const nextSelectedNode =
			selectedValue === null ? null : this.getNodeByValue(selectedValue, true);
		if (this.selectedItemNode !== nextSelectedNode) {
			this.selectedItemNode = nextSelectedNode;
		}
	}

	setOpen(open: boolean) {
		this.opts.open.current = open;
	}

	toggleOpen() {
		this.opts.open.current = !this.opts.open.current;
	}

	handleOpen(_pointerType: string | null = null, pendingOpenPointerId: number | null = null) {
		this.pendingOpenPointerId = pendingOpenPointerId;
		this.setOpen(true);
		this.updateSelectedItemNode();
	}

	handleClose() {
		this.setHighlightedNode(null);
		this.pendingOpenPointerId = null;
		this.setOpen(false);
	}

	toggleMenu(pointerType: string | null = null, pendingOpenPointerId: number | null = null) {
		if (this.opts.open.current) {
			this.handleClose();
		} else {
			this.handleOpen(pointerType, pendingOpenPointerId);
		}
	}

	clearPendingOpenPointer() {
		this.pendingOpenPointerId = null;
	}

	consumePendingOpenPointer(pointerId: number): boolean {
		if (this.pendingOpenPointerId === null) return false;
		if (this.pendingOpenPointerId !== pointerId) return false;
		this.pendingOpenPointerId = null;
		return true;
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

		watch(
			() => this.opts.value.current,
			() => {
				this.updateSelectedItemNode();
			}
		);
	}

	getPrimarySelectedValue() {
		return this.opts.value.current;
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

		watch(
			() => this.opts.value.current,
			() => {
				this.updateSelectedItemNode();
			}
		);
	}

	getPrimarySelectedValue() {
		return this.opts.value.current[0] ?? null;
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
		this.root.toggleMenu(e.pointerType);
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

	#handleOpen(pointerType: string | null = null, pendingOpenPointerId: number | null = null) {
		this.root.handleOpen(pointerType, pendingOpenPointerId);
		this.#dataTypeahead.resetTypeahead();
		this.#domTypeahead.resetTypeahead();
	}

	#handlePointerDownOpen(e: PointerEvent) {
		this.#handleOpen(e.pointerType, e.pointerId);
	}

	#handlePointerUpOpen(e: PointerEvent) {
		this.#handleOpen(e.pointerType, null);
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
				this.#handlePointerDownOpen(e);
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
				this.#handlePointerUpOpen(e);
			} else {
				this.root.handleClose();
			}
			return;
		}
		this.root.clearPendingOpenPointer();
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
	itemAlignedFallback = $state(false);
	itemAlignedSideOffset = $state(0);
	#itemAlignedRaf: number | null = null;

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
			this.#cancelItemAlignedRaf();
		});

		watch(
			() => this.root.opts.open.current,
			() => {
				if (this.root.opts.open.current) {
					this.itemAlignedSideOffset = 0;
					this.itemAlignedFallback = false;
					this.#scheduleItemAlignedUpdate();
					return;
				}
				this.isPositioned = false;
				this.#cancelItemAlignedRaf();
			}
		);

		watch(
			[
				() => this.opts.position.current,
				() => this.root.selectedItemNode,
				() => this.root.triggerNode,
				() => this.root.contentNode,
				() => this.isPositioned,
			],
			() => {
				this.#scheduleItemAlignedUpdate();
			}
		);

		watch(
			[() => this.root.opts.open.current, () => this.opts.position.current],
			([open, position]) => {
				if (!open || position !== "item-aligned") return;
				return on(this.domContext.getWindow(), "resize", this.#scheduleItemAlignedUpdate);
			}
		);

		this.onpointermove = this.onpointermove.bind(this);
		this.onpointerup = this.onpointerup.bind(this);
	}

	readonly useItemAlignedPositioning = $derived.by(
		() => this.opts.position.current === "item-aligned" && !this.itemAlignedFallback
	);

	#cancelItemAlignedRaf = () => {
		if (this.#itemAlignedRaf === null) return;
		this.domContext.getWindow().cancelAnimationFrame(this.#itemAlignedRaf);
		this.#itemAlignedRaf = null;
	};

	#scheduleItemAlignedUpdate = () => {
		if (this.opts.position.current !== "item-aligned" || !this.root.opts.open.current) return;
		if (!this.isPositioned) return;
		this.#cancelItemAlignedRaf();
		afterTick(() => {
			if (this.opts.position.current !== "item-aligned" || !this.root.opts.open.current)
				return;
			if (!this.isPositioned) return;
			this.#itemAlignedRaf = this.domContext
				.getWindow()
				.requestAnimationFrame(this.#updateItemAlignedPositioning);
		});
	};

	#updateItemAlignedPositioning = () => {
		this.#itemAlignedRaf = null;
		if (this.opts.position.current !== "item-aligned" || !this.root.opts.open.current) return;

		this.root.updateSelectedItemNode();
		const selectedItem = this.root.selectedItemNode;
		const trigger = this.root.triggerNode;
		const floating = this.root.contentNode;
		const viewport = this.root.viewportNode;

		if (!selectedItem || !trigger || !floating) {
			this.itemAlignedFallback = true;
			this.itemAlignedSideOffset = 0;
			return;
		}

		const viewportHeight = this.domContext.getWindow().innerHeight;
		const viewportMargin = 20;
		const triggerRect = trigger.getBoundingClientRect();
		let floatingRect = floating.getBoundingClientRect();
		let itemRect = selectedItem.getBoundingClientRect();
		const popupHeight = Math.max(floating.offsetHeight, floatingRect.height);
		const minAllowedTop = viewportMargin;
		const maxAllowedTop = viewportHeight - viewportMargin - floatingRect.height;
		const popupFitsViewport = popupHeight <= viewportHeight - viewportMargin * 2;

		if (!popupFitsViewport || maxAllowedTop < minAllowedTop) {
			this.itemAlignedFallback = true;
			this.itemAlignedSideOffset = 0;
			return;
		}

		const getClampedTop = (nextItemRect: DOMRect, nextFloatingRect: DOMRect) => {
			const selectedItemCenterWithinFloating =
				nextItemRect.top - nextFloatingRect.top + nextItemRect.height / 2;
			const triggerCenterY = triggerRect.top + triggerRect.height / 2;
			const desiredFloatingTop = triggerCenterY - selectedItemCenterWithinFloating;
			return clamp(desiredFloatingTop, minAllowedTop, maxAllowedTop);
		};

		// First pass target position based on current scroll state.
		let clampedFloatingTop = getClampedTop(itemRect, floatingRect);

		// Adjust viewport scroll so the selected item center lines up with the trigger center
		// for the chosen (possibly clamped) popup top.
		if (viewport) {
			const currentCenterWithinFloating =
				itemRect.top - floatingRect.top + itemRect.height / 2;
			const desiredCenterWithinFloating =
				triggerRect.top + triggerRect.height / 2 - clampedFloatingTop;
			const scrollDelta = currentCenterWithinFloating - desiredCenterWithinFloating;

			if (Math.abs(scrollDelta) > 0.5) {
				const maxScrollTop = Math.max(viewport.scrollHeight - viewport.clientHeight, 0);
				const nextScrollTop = clamp(viewport.scrollTop + scrollDelta, 0, maxScrollTop);
				if (Math.abs(nextScrollTop - viewport.scrollTop) > 0.5) {
					viewport.scrollTop = nextScrollTop;
					itemRect = selectedItem.getBoundingClientRect();
					floatingRect = floating.getBoundingClientRect();
					clampedFloatingTop = getClampedTop(itemRect, floatingRect);
				}
			}
		}

		this.itemAlignedSideOffset = clampedFloatingTop - floatingRect.top;
		this.itemAlignedFallback = false;
	};

	onpointermove(_: BitsPointerEvent) {
		this.root.isUsingKeyboard = false;
	}

	onpointerup(e: BitsPointerEvent) {
		if (e.pointerType === "touch") return;
		this.root.clearPendingOpenPointer();
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
				onpointerup: this.onpointerup,
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
			// is actually open to avoid setting `isPositioned` to true when the menu is closed
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
				this.root.updateSelectedItemNode();
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
		if (this.root.consumePendingOpenPointer(e.pointerId)) return;
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
		if (!this.root.viewportNode) return;
		const maxScroll = this.root.viewportNode.scrollHeight - this.root.viewportNode.clientHeight;
		const paddingTop = Number.parseInt(getComputedStyle(this.root.viewportNode).paddingTop, 10);

		this.canScrollDown = Math.ceil(this.root.viewportNode.scrollTop) < maxScroll - paddingTop;
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

function clamp(value: number, min: number, max: number): number {
	return Math.min(Math.max(value, min), max);
}
