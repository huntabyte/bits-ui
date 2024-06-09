import { type ReadableBox, box } from "svelte-toolbelt";
import { Set } from "svelte/reactivity";
import { tick, untrack } from "svelte";
import type { Box, ReadableBoxedValues, WritableBoxedValues } from "$lib/internal/box.svelte.js";
import { watch } from "$lib/internal/box.svelte.js";
import { useId } from "$lib/internal/useId.svelte.js";
import type { Direction } from "$lib/shared/index.js";
import { createContext } from "$lib/internal/createContext.js";
import { useFormControl } from "$lib/internal/useFormControl.svelte.js";
import { useNodeById } from "$lib/internal/useNodeById.svelte.js";
import { type Typeahead, useTypeahead } from "$lib/internal/useTypeahead.svelte.js";
import {
	getAriaDisabled,
	getAriaExpanded,
	getAriaHidden,
	getAriaRequired,
	getAriaSelected,
	getDataChecked,
	getDataDisabled,
	getDataOpenClosed,
} from "$lib/internal/attrs.js";
import { kbd } from "$lib/internal/kbd.js";
import { afterTick } from "$lib/internal/afterTick.js";
import { clamp } from "$lib/internal/clamp.js";
import { noop } from "$lib/internal/callbacks.js";
import { addEventListener } from "$lib/internal/events.js";

export const OPEN_KEYS = [kbd.SPACE, kbd.ENTER, kbd.ARROW_UP, kbd.ARROW_DOWN];
export const SELECTION_KEYS = [" ", kbd.ENTER];
export const CONTENT_MARGIN = 10;

const TRIGGER_ATTR = "data-select-trigger";
const CONTENT_ATTR = "data-select-content";
const ITEM_ATTR = "data-select-item";
const VIEWPORT_ATTR = "data-select-viewport";
const VALUE_ATTR = "data-select-value";
const ITEM_TEXT_ATTR = "data-select-item-text";
const CONTENT_WRAPPER_ATTR = "data-select-content-wrapper";
const SCROLL_UP_BUTTON_ATTR = "data-select-scroll-up-button";
const SCROLL_DOWN_BUTTON_ATTR = "data-select-scroll-down-button";
const GROUP_ATTR = "data-select-group";
const GROUP_TITLE_ATTR = "data-select-group-title";
const SEPARATOR_ATTR = "data-select-separator";
const ARROW_ATTR = "data-select-arrow";
const ICON_ATTR = "data-select-icon";

export const [setSelectRootContext, getSelectRootContext] =
	createContext<SelectRootState>("Select.Root");

export const [setSelectTriggerContext] = createContext<SelectTriggerState>("Select.Trigger");

export const [setSelectContentContext, getSelectContentContext] =
	createContext<SelectContentState>("Select.Content");

export const [setSelectItemContext, getSelectItemContext] =
	createContext<SelectItemState>("Select.Item");

export const [setSelectContentItemAlignedContext, getSelectContentItemAlignedContext] =
	createContext<SelectItemAlignedPositionState>("Select.ContentItemAligned");

const [setSelectGroupContext, getSelectGroupContext] =
	createContext<SelectGroupState>("Select.Group");

type SelectRootStateProps = WritableBoxedValues<{
	open: boolean;
	value: string;
}> &
	ReadableBoxedValues<{
		dir: Direction;
		disabled: boolean;
		required: boolean;
	}>;

type SelectNativeOption = {
	value: string;
	key: string;
	disabled: boolean;
	innerHTML?: string | null;
};

export class SelectRootState {
	open: SelectRootStateProps["open"];
	value: SelectRootStateProps["value"];
	dir: SelectRootStateProps["dir"];
	disabled: SelectRootStateProps["disabled"];
	required: SelectRootStateProps["required"];
	triggerId = $state(useId());
	valueId = box<string>(useId());
	valueNodeHasChildren = box(false);
	contentId = box<string>(useId());
	triggerPointerDownPos = box<{ x: number; y: number } | null>({ x: 0, y: 0 });
	contentFragment = $state<DocumentFragment | null>(null);

	// A set of all the native options we'll use to render the native select element under the hood
	nativeOptionsSet = new Set<ReadableBox<SelectNativeOption>>();
	// A key we'll use to rerender the native select when the options change to keep it in sync
	nativeSelectKey = $derived.by(() => {
		return Array.from(this.nativeOptionsSet)
			.map((opt) => opt.value.value)
			.join(";");
	});

	nativeOptionsArr = $derived.by(() => Array.from(this.nativeOptionsSet));
	isFormControl = useFormControl(() => this.triggerId);

	constructor(props: SelectRootStateProps) {
		this.open = props.open;
		this.value = props.value;
		this.dir = props.dir;
		this.disabled = props.disabled;
		this.required = props.required;
	}

	focusTriggerNode(preventScroll: boolean = true) {
		const node = document.getElementById(this.triggerId);
		if (node) node.focus({ preventScroll });
	}

	onNativeOptionAdd(option: ReadableBox<SelectNativeOption>) {
		this.nativeOptionsSet.add(option);
	}

	onNativeOptionRemove(option: ReadableBox<SelectNativeOption>) {
		this.nativeOptionsSet.delete(option);
	}

	getTriggerTypeaheadCandidateNodes() {
		const node = this.contentFragment;
		if (!node) return [];
		const candidates = Array.from(
			node.querySelectorAll<HTMLElement>(`[${ITEM_ATTR}]:not([data-disabled])`)
		);
		return candidates;
	}

	getCandidateNodes() {
		const node = document.getElementById(this.contentId.value);
		if (!node) return [];
		const candidates = Array.from(
			node.querySelectorAll<HTMLElement>(`[${ITEM_ATTR}]:not([data-disabled])`)
		);
		return candidates;
	}

	createTrigger(props: SelectTriggerStateProps) {
		return new SelectTriggerState(props, this);
	}

	createValue() {
		return new SelectValueState(this);
	}

	createContent(props: SelectContentFragStateProps) {
		return new SelectContentFragState(props, this);
	}

	createContentImpl(props: SelectContentStateProps) {
		return new SelectContentState(props, this);
	}
}

type SelectTriggerStateProps = ReadableBoxedValues<{
	id: string;
	disabled: boolean;
}>;

class SelectTriggerState {
	#root: SelectRootState;
	#id: SelectTriggerStateProps["id"];
	#disabled: SelectTriggerStateProps["disabled"];
	#typeahead: Typeahead;
	#isDisabled = $derived.by(() => {
		return this.#root.disabled.value || this.#disabled.value;
	});

	constructor(props: SelectTriggerStateProps, root: SelectRootState) {
		this.#id = props.id;
		this.#root = root;
		this.#disabled = props.disabled;

		$effect(() => {
			this.#root.triggerId = this.#id.value;
		});

		this.#typeahead = useTypeahead();
	}

	#handleOpen() {
		if (this.#isDisabled) return;
		this.#root.open.value = true;
		this.#typeahead.resetTypeahead();
	}

	#handlePointerOpen(e: PointerEvent) {
		this.#handleOpen();
		this.#root.triggerPointerDownPos.value = {
			x: Math.round(e.pageX),
			y: Math.round(e.pageY),
		};
	}

	#onclick = (e: MouseEvent) => {
		// While browsers generally have no issue focusing the trigger when clicking
		// on a label, Safari seems to struggle with the fact that there's no `onClick`.
		// We force `focus` in this case. Note: this doesn't create any other side-effect
		// because we are preventing default in `onpointerdown` so effectively
		// this only runs for a label 'click'
		const currTarget = e.currentTarget as HTMLElement;
		currTarget.focus();
	};

	#onpointerdown = (e: PointerEvent) => {
		// prevent opening on touch down which can be triggered
		// when scrolling on touch devices (unexpected)
		if (e.pointerType === "touch") return e.preventDefault();

		// prevent implicit pointer capture
		const target = e.target as HTMLElement;
		if (target.hasPointerCapture(e.pointerId)) {
			target.releasePointerCapture(e.pointerId);
		}

		// only call the handle if it's a left click, since pointerdown is triggered
		// by right clicks as well, but not when ctrl is pressed
		if (e.button === 0 && e.ctrlKey === false) {
			this.#handlePointerOpen(e);
			e.preventDefault();
		}
	};

	#onpointerup = (e: PointerEvent) => {
		e.preventDefault();
		if (e.pointerType === "touch") {
			this.#handlePointerOpen(e);
		}
	};

	#onkeydown = (e: KeyboardEvent) => {
		const isTypingAhead = this.#typeahead.search.value !== "";
		const isModifierKey = e.ctrlKey || e.altKey || e.metaKey;

		if (!isModifierKey && e.key.length === 1) {
			if (isTypingAhead && e.key === " ") return;
		}
		const newItem = this.#typeahead.handleTypeaheadSearch(
			e.key,
			this.#root.getTriggerTypeaheadCandidateNodes()
		);

		if (newItem && newItem.dataset.value) {
			this.#root.value.value = newItem.dataset.value;
		}

		if (OPEN_KEYS.includes(e.key)) {
			this.#handleOpen();
			e.preventDefault();
		}
	};

	#ariaControls = $derived.by(() => {
		return this.#root.contentId.value ?? undefined;
	});

	props = $derived.by(
		() =>
			({
				id: this.#id.value,
				disabled: this.#isDisabled,
				role: "combobox",
				type: "button",
				"aria-controls": this.#ariaControls,
				"aria-expanded": getAriaExpanded(this.#root.open.value),
				"aria-required": getAriaRequired(this.#root.required.value),
				"aria-autocomplete": "none",
				dir: this.#root.dir.value,
				"data-state": getDataOpenClosed(this.#root.open.value),
				"data-disabled": getDataDisabled(this.#isDisabled),
				"data-placeholder": shouldShowPlaceholder(this.#root.value.value) ? "" : undefined,
				[TRIGGER_ATTR]: "",
				onclick: this.#onclick,
				onpointerdown: this.#onpointerdown,
				onpointerup: this.#onpointerup,
				onkeydown: this.#onkeydown,
			}) as const
	);
}

class SelectValueState {
	root: SelectRootState;
	showPlaceholder = $derived.by(() => shouldShowPlaceholder(this.root.value.value));
	id = box<string>(useId());

	constructor(root: SelectRootState) {
		this.root = root;
	}

	props = $derived.by(
		() =>
			({
				id: this.root.valueId.value,
				"data-state": getDataOpenClosed(this.root.open.value),
				"data-disabled": getDataDisabled(this.root.disabled.value),
				[VALUE_ATTR]: "",
				style: {
					pointerEvents: "none",
				},
			}) as const
	);
}

type SelectContentFragStateProps = ReadableBoxedValues<{
	id: string;
}>;

class SelectContentFragState {
	root: SelectRootState;

	constructor(props: SelectContentFragStateProps, root: SelectRootState) {
		this.root = root;
		this.root.contentId.value = props.id.value;

		$effect(() => {
			this.root.contentId.value = props.id.value;
		});

		$effect(() => {
			this.root.contentFragment = new DocumentFragment();
		});
	}
}

type SelectContentStateProps = ReadableBoxedValues<{
	id: string;
	position: "item-aligned" | "floating";
}>;

export class SelectContentState {
	id: SelectContentStateProps["id"];
	root: SelectRootState;
	contentNode = box<HTMLElement | null>(null);
	viewportId = $state(useId());
	selectedItemId = box<string>(useId());
	selectedItemTextId = box<string>(useId());
	selectedItemText = box<HTMLElement | null>(null);
	position: SelectContentStateProps["position"];
	isPositioned = box(false);
	firstValidItemFound = box(false);
	typeahead: Typeahead;
	alignedPositionState: SelectItemAlignedPositionState | null = null;

	constructor(props: SelectContentStateProps, root: SelectRootState) {
		this.position = props.position;
		this.id = props.id;
		this.root = root;
		this.typeahead = useTypeahead();
		this.contentNode = useNodeById(this.id);

		watch(this.root.open, () => {
			let cleanup = [noop];

			afterTick(() => {
				const node = document.getElementById(this.id.value);
				if (!node) return;

				let pointerMoveDelta = { x: 0, y: 0 };

				const handlePointerMove = (e: PointerEvent) => {
					pointerMoveDelta = {
						x: Math.abs(
							Math.round(e.pageX) - (this.root.triggerPointerDownPos.value?.x ?? 0)
						),
						y: Math.abs(
							Math.round(e.pageY) - (this.root.triggerPointerDownPos.value?.y ?? 0)
						),
					};
				};

				const handlePointerUp = (e: PointerEvent) => {
					if (e.pointerType === "touch") return;

					if (pointerMoveDelta.x <= 10 && pointerMoveDelta.y <= 10) {
						e.preventDefault();
					} else {
						if (!this.contentNode.value?.contains(e.target as HTMLElement)) {
							this.root.open.value = false;
						}
					}
					document.removeEventListener("pointermove", handlePointerMove);
					this.root.triggerPointerDownPos.value = null;
				};

				if (this.root.triggerPointerDownPos.value !== null) {
					const pointerMove = addEventListener(
						document,
						"pointermove",
						handlePointerMove
					);
					const pointerUp = addEventListener(document, "pointerup", handlePointerUp, {
						capture: true,
						once: true,
					});
					for (const cleanupFn of cleanup) cleanupFn();
					cleanup = [pointerMove, pointerUp];
				}

				return () => {
					for (const cleanupFn of cleanup) cleanupFn();
				};
			});
		});

		$effect(() => {
			if (this.isPositioned.value) {
				this.focusSelectedItem();
			}
		});

		$effect(() => {
			if (this.root.open.value === false) {
				this.isPositioned.value = false;
			}
		});
	}

	focusFirst(candidates: Array<HTMLElement | null>) {
		const [firstItem, ...restItems] = this.root.getCandidateNodes();
		const [lastItem] = restItems.slice(-1);

		const PREV_FOCUSED_ELEMENT = document.activeElement;

		for (const candidate of candidates) {
			if (candidate === PREV_FOCUSED_ELEMENT) return;
			candidate?.scrollIntoView({ block: "nearest" });
			// viewport might have padding so scroll to the edge when focusing first/last
			const viewport = document.getElementById(this.viewportId);
			if (candidate === firstItem && viewport) {
				viewport.scrollTop = 0;
			}
			if (candidate === lastItem && viewport) {
				viewport.scrollTop = viewport.scrollHeight;
			}

			candidate?.focus();

			if (document.activeElement !== PREV_FOCUSED_ELEMENT) return;
		}
	}

	onItemLeave() {
		this.contentNode.value?.focus();
	}

	getSelectedItem() {
		const candidates = this.root.getCandidateNodes();
		const selectedItemNode =
			candidates.find((node) => node?.dataset.value === this.root.value.value) ?? null;
		const first = candidates[0] ?? null;
		if (selectedItemNode) {
			const selectedItemTextNode = selectedItemNode.querySelector<HTMLElement>(
				`[${ITEM_TEXT_ATTR}]`
			);
			return {
				selectedItemNode,
				selectedItemTextNode,
			};
		} else {
			if (first) {
				const firstItemText = first.querySelector<HTMLElement>(`[${ITEM_TEXT_ATTR}]`);
				return {
					selectedItemNode: first,
					selectedItemTextNode: firstItemText,
				};
			}
		}
		return {
			selectedItemNode: null,
			selectedItemTextNode: null,
		};
	}

	focusSelectedItem() {
		afterTick(() => {
			const candidates = this.root.getCandidateNodes();
			const selected =
				candidates.find((node) => node?.dataset.value === this.root.value.value) ?? null;
			const first = candidates[0] ?? null;
			this.focusFirst([selected, first]);
		});
	}

	itemRegister(value: string, disabled: boolean) {
		const isFirstValidItem = !this.firstValidItemFound.value && !disabled;
		const isSelectedItem =
			this.root.value.value !== undefined && this.root.value.value === value;

		if (isSelectedItem || isFirstValidItem) {
			if (isFirstValidItem) {
				this.firstValidItemFound.value = true;
			}
		}
	}

	itemTextRegister(node: HTMLElement | null, value: string, disabled: boolean) {
		const isFirstValidItem = !this.firstValidItemFound.value && !disabled;
		const isSelectedItem =
			this.root.value.value !== undefined && this.root.value.value === value;

		if (isSelectedItem || isFirstValidItem) {
			this.selectedItemText.value = node;
		}
	}

	#onkeydown = (e: KeyboardEvent) => {
		const isModifierKey = e.ctrlKey || e.altKey || e.metaKey;

		if (e.key === "Tab") e.preventDefault();

		if (!isModifierKey && e.key.length === 1) {
			this.typeahead.handleTypeaheadSearch(e.key, this.root.getCandidateNodes());
		}

		if ([kbd.ARROW_UP, kbd.ARROW_DOWN, kbd.HOME, kbd.END].includes(e.key)) {
			let candidateNodes = this.root.getCandidateNodes();

			if (e.key === kbd.ARROW_UP || e.key === kbd.END) {
				candidateNodes = candidateNodes.slice().reverse();
			}

			if (e.key === kbd.ARROW_UP || e.key === kbd.ARROW_DOWN) {
				const currElement = e.target as HTMLElement;
				const currIndex = candidateNodes.indexOf(currElement);
				candidateNodes = candidateNodes.slice(currIndex + 1);
			}

			setTimeout(() => this.focusFirst(candidateNodes));
			e.preventDefault();
		}
	};

	#oncontextmenu = (e: Event) => {
		e.preventDefault();
	};

	props = $derived.by(
		() =>
			({
				id: this.id.value,
				role: "listbox",
				"data-state": getDataOpenClosed(this.root.open.value),
				style: {
					display: "flex",
					flexDirection: "column",
					outline: "none",
				},
				oncontextmenu: this.#oncontextmenu,
				onkeydown: this.#onkeydown,
				tabIndex: -1,
				[CONTENT_ATTR]: "",
			}) as const
	);

	createItem(props: SelectItemStateProps) {
		return new SelectItemState(props, this);
	}

	createViewport(props: SelectViewportStateProps) {
		return new SelectViewportState(props, this);
	}

	createItemAlignedPosition(props: SelectItemAlignedPositionStateProps) {
		return new SelectItemAlignedPositionState(props, this);
	}

	createFloatingPosition() {
		return new SelectFloatingPositionState(this);
	}

	createScrollDownButton(props: SelectScrollButtonImplStateProps) {
		const state = new SelectScrollButtonImplState(props, this);
		return new SelectScrollDownButtonState(state);
	}

	createScrollUpButton(props: SelectScrollButtonImplStateProps) {
		const state = new SelectScrollButtonImplState(props, this);
		return new SelectScrollUpButtonState(state);
	}
}

type SelectItemStateProps = ReadableBoxedValues<{
	value: string;
	disabled: boolean;
	textValue?: string;
	id: string;
}>;

class SelectItemState {
	#id: SelectItemStateProps["id"];
	root: SelectRootState;
	content: SelectContentState;
	textId = box<string | undefined>(undefined);
	value: SelectItemStateProps["value"];
	disabled: SelectItemStateProps["disabled"];
	textValue: SelectItemStateProps["textValue"];
	isSelected = $derived.by(() => this.root.value.value === this.value.value);
	isFocused = box(false);
	node = box<HTMLElement | null>(null);
	trueTextValue = box<string>("");

	constructor(props: SelectItemStateProps, content: SelectContentState) {
		this.#id = props.id;
		this.root = content.root;
		this.content = content;
		this.value = props.value;
		this.disabled = props.disabled;
		this.textValue = props.textValue;

		$effect(() => {
			const node = document.getElementById(this.#id.value);
			if (!node) return;
			this.content.itemRegister(this.value.value, this.disabled.value);
		});
	}

	onItemTextChange(node: HTMLElement | null) {
		this.trueTextValue.value = ((this.textValue?.value || node?.textContent) ?? "").trim();
	}

	setTextId(id: string) {
		this.textId.value = id;
	}

	async handleSelect(e?: PointerEvent) {
		await tick();
		if (e?.defaultPrevented) return;

		if (!this.disabled.value) {
			this.root.value.value = this.value.value;
			this.root.open.value = false;
		}
	}

	#onpointermove = async (e: PointerEvent) => {
		if (e.defaultPrevented) return;
		if (this.disabled.value) {
			this.content.onItemLeave();
		} else {
			(e.currentTarget as HTMLElement).focus({ preventScroll: true });
		}
	};

	#onpointerleave = async (e: PointerEvent) => {
		if (e.defaultPrevented) return;
		if (e.currentTarget === document.activeElement) {
			this.content.onItemLeave();
		}
	};

	#onpointerdown = (e: PointerEvent) => {
		(e.currentTarget as HTMLElement).focus({ preventScroll: true });
	};

	#onpointerup = async (e: PointerEvent) => {
		await this.handleSelect(e);
	};

	#onkeydown = async (e: KeyboardEvent) => {
		if (e.defaultPrevented) return;

		const isTypingAhead = this.content.typeahead.search.value !== "";
		if (isTypingAhead && e.key === kbd.SPACE) return;

		if (SELECTION_KEYS.includes(e.key)) {
			this.handleSelect();
		}

		// prevent page scroll on space
		if (e.key === kbd.SPACE) e.preventDefault();
	};

	#onfocus = () => {
		this.isFocused.value = true;
	};

	#onblur = () => {
		this.isFocused.value = false;
	};

	#ontouchend = (e: TouchEvent) => {
		e.preventDefault();
		e.stopPropagation();
	};

	props = $derived.by(
		() =>
			({
				id: this.#id.value,
				role: "option",
				"aria-labelledby": this.textId.value ?? undefined,
				"data-highlighted": this.isFocused.value ? "" : undefined,
				"aria-selected": getAriaSelected(this.isSelected && this.isFocused.value),
				"data-state": getDataChecked(this.isSelected),
				"aria-disabled": getAriaDisabled(this.disabled.value),
				"data-disabled": getDataDisabled(this.disabled.value),
				"data-value": this.value.value,
				tabindex: this.disabled.value ? undefined : -1,
				[ITEM_ATTR]: "",
				//
				onfocus: this.#onfocus,
				onpointermove: this.#onpointermove,
				onpointerleave: this.#onpointerleave,
				onpointerdown: this.#onpointerdown,
				onpointerup: this.#onpointerup,
				onkeydown: this.#onkeydown,
				onblur: this.#onblur,
				ontouchend: this.#ontouchend,
			}) as const
	);

	createText(props: SelectItemTextStateProps) {
		return new SelectItemTextState(props, this);
	}
}

type SelectItemTextStateProps = ReadableBoxedValues<{
	id: string;
}>;

class SelectItemTextState {
	item: SelectItemState;
	#id: SelectItemTextStateProps["id"];
	node = box<HTMLElement | null>(null);

	nativeOption = box.with(
		() =>
			({
				key: this.item.value.value,
				value: this.item.value.value,
				disabled: this.item.disabled.value,
				innerHTML: this.node.value?.textContent,
			}) as const
	);

	constructor(props: SelectItemTextStateProps, item: SelectItemState) {
		this.#id = props.id;
		this.node = useNodeById(this.#id);
		this.item = item;
		this.item.setTextId(this.#id.value);

		$effect(() => {
			this.item.setTextId(this.#id.value);
		});

		$effect(() => {
			untrack(() => {
				const textNode = this.item.root.contentFragment?.getElementById(this.#id.value);
				if (!textNode) return;
				this.item.onItemTextChange(textNode);
				this.item.content.itemTextRegister(
					textNode,
					this.item.value.value,
					this.item.disabled.value
				);

				this.item.root.onNativeOptionAdd(this.nativeOption);
			});
		});

		$effect(() => {
			return () => {
				this.item.root.onNativeOptionRemove(this.nativeOption);
			};
		});
	}

	props = $derived.by(
		() =>
			({
				id: this.#id.value,
				[ITEM_TEXT_ATTR]: "",
			}) as const
	);
}

type SelectItemAlignedPositionStateProps = ReadableBoxedValues<{
	onPlaced: () => void;
}>;

class SelectItemAlignedPositionState {
	root: SelectRootState;
	content: SelectContentState;
	shouldExpandOnScroll = $state(false);
	shouldReposition = $state(false);
	contentWrapperId = $state(useId());
	onPlaced: SelectItemAlignedPositionStateProps["onPlaced"];
	contentZIndex = $state("");

	constructor(props: SelectItemAlignedPositionStateProps, content: SelectContentState) {
		this.root = content.root;
		this.content = content;
		this.onPlaced = props.onPlaced;

		$effect(() => {
			afterTick(() => {
				this.position();
				const contentNode = document.getElementById(this.content.id.value);
				if (contentNode) {
					this.contentZIndex = window.getComputedStyle(contentNode).zIndex;
				}
			});
		});
	}

	position() {
		afterTick(() => {
			const { selectedItemNode, selectedItemTextNode } = this.content.getSelectedItem();
			const contentNode = document.getElementById(this.content.id.value);
			const contentWrapperNode = document.getElementById(this.contentWrapperId);
			const viewportNode = document.getElementById(this.content.viewportId);
			const triggerNode = document.getElementById(this.root.triggerId);
			const valueNode = document.getElementById(this.root.valueId.value);

			if (
				!contentNode ||
				!contentWrapperNode ||
				!viewportNode ||
				!selectedItemNode ||
				!selectedItemTextNode ||
				!triggerNode ||
				!valueNode
			) {
				return;
			}

			const triggerRect = triggerNode.getBoundingClientRect();

			// horizontal positioning
			const contentRect = contentNode.getBoundingClientRect();
			const valueRect = valueNode.getBoundingClientRect();
			const itemTextRect = selectedItemTextNode.getBoundingClientRect();

			if (this.root.dir.value === "rtl") {
				const itemTextOffset = itemTextRect.left - contentRect.left;
				const left = valueRect.left - itemTextOffset;
				const leftDelta = triggerRect.left - left;
				const minContentWidth = triggerRect.width + leftDelta;
				const contentWidth = Math.max(minContentWidth, contentRect.width);
				const rightEdge = window.innerWidth - CONTENT_MARGIN;
				const clampedLeft = clamp(left, CONTENT_MARGIN, rightEdge - contentWidth);

				contentWrapperNode.style.minWidth = `${minContentWidth}px`;
				contentWrapperNode.style.left = `${clampedLeft}px`;
			} else {
				const itemTextOffset = contentRect.right - itemTextRect.right;
				const right = window.innerWidth - valueRect.right - itemTextOffset;
				const rightDelta = window.innerWidth - triggerRect.right - right;
				const minContentWidth = triggerRect.width + rightDelta;
				const contentWidth = Math.max(minContentWidth, contentRect.width);
				const leftEdge = window.innerWidth - CONTENT_MARGIN;
				const clampedRight = clamp(right, CONTENT_MARGIN, leftEdge - contentWidth);

				contentWrapperNode.style.minWidth = `${minContentWidth}px`;
				contentWrapperNode.style.right = `${clampedRight}px`;
			}

			// vertical positioning
			const items = this.root.getCandidateNodes();

			const availableHeight = window.innerHeight - CONTENT_MARGIN * 2;
			const itemsHeight = viewportNode.scrollHeight;

			const contentStyles = window.getComputedStyle(contentNode);

			const contentBorderTopWidth = Number.parseInt(contentStyles.borderTopWidth, 10);
			const contentPaddingTop = Number.parseInt(contentStyles.paddingTop, 10);

			const contentBorderBottomWidth = Number.parseInt(contentStyles.borderBottomWidth, 10);
			const contentPaddingBottom = Number.parseInt(contentStyles.paddingBottom, 10);

			const fullContentHeight =
				contentBorderTopWidth +
				contentPaddingTop +
				itemsHeight +
				contentPaddingBottom +
				contentBorderBottomWidth;

			const minContentHeight = Math.min(selectedItemNode.offsetHeight * 5, fullContentHeight);

			const viewportStyles = window.getComputedStyle(viewportNode);
			const viewportPaddingTop = Number.parseInt(viewportStyles.paddingTop, 10);
			const viewportPaddingBottom = Number.parseInt(viewportStyles.paddingBottom, 10);

			const topEdgeToTriggerMiddle =
				triggerRect.top + triggerRect.height / 2 - CONTENT_MARGIN;
			const triggerMiddleToBottomEdge = availableHeight - topEdgeToTriggerMiddle;

			const selectedItemHalfHeight = selectedItemNode.offsetHeight / 2;
			const itemOffsetMiddle = selectedItemNode.offsetTop + selectedItemHalfHeight;
			const contentTopToItemMiddle =
				contentBorderTopWidth + contentPaddingTop + itemOffsetMiddle;
			const itemMiddleToContentBottom = fullContentHeight - contentTopToItemMiddle;

			const willAlignWithoutTopOverflow = contentTopToItemMiddle <= topEdgeToTriggerMiddle;

			if (willAlignWithoutTopOverflow) {
				const isLastItem = selectedItemNode === items[items.length - 1];
				contentWrapperNode.style.bottom = `${0}px`;
				const viewportOffsetBottom =
					contentNode.clientHeight - viewportNode.offsetTop - viewportNode.offsetHeight;
				const clampedTriggerMiddleToBottomEdge = Math.max(
					triggerMiddleToBottomEdge,
					selectedItemHalfHeight +
						// viewport might have padding bottom, include it to avoid a scrollable viewport
						(isLastItem ? viewportPaddingBottom : 0) +
						viewportOffsetBottom +
						contentBorderBottomWidth
				);
				const height = contentTopToItemMiddle + clampedTriggerMiddleToBottomEdge;
				contentWrapperNode.style.height = `${height}px`;
			} else {
				const isFirstItem = selectedItemNode === items[0];
				contentWrapperNode.style.top = `${0}px`;
				const clampedTopEdgeToTriggerMiddle = Math.max(
					topEdgeToTriggerMiddle,
					contentBorderTopWidth +
						viewportNode.offsetTop +
						// viewport might have padding top, include it to avoid a scrollable viewport
						(isFirstItem ? viewportPaddingTop : 0) +
						selectedItemHalfHeight
				);
				const height = clampedTopEdgeToTriggerMiddle + itemMiddleToContentBottom;
				contentWrapperNode.style.height = `${height}px`;
				viewportNode.scrollTop =
					contentTopToItemMiddle - topEdgeToTriggerMiddle + viewportNode.offsetTop;
			}

			contentWrapperNode.style.margin = `${CONTENT_MARGIN}px 0`;
			contentWrapperNode.style.minHeight = `${minContentHeight}px`;
			contentWrapperNode.style.maxHeight = `${availableHeight}px`;

			this.onPlaced.value();
		});
		requestAnimationFrame(() => (this.shouldExpandOnScroll = true));
	}

	handleScrollButtonChange(id: string) {
		afterTick(() => {
			const node = document.getElementById(id);
			if (!node) return;
			if (!this.shouldReposition) return;
			this.position();
			this.content.focusSelectedItem();
			this.shouldReposition = false;
		});
	}

	wrapperProps = $derived.by(
		() =>
			({
				id: this.contentWrapperId,
				style: {
					display: "flex",
					flexDirection: "column",
					position: "fixed",
					zIndex: this.contentZIndex,
				},
				[CONTENT_WRAPPER_ATTR]: "",
			}) as const
	);

	props = $derived.by(
		() =>
			({
				id: this.content.id.value,
				style: {
					boxSizing: "border-box",
					maxHeight: "100%",
				},
			}) as const
	);
}

class SelectFloatingPositionState {
	root: SelectRootState;
	content: SelectContentState;

	constructor(content: SelectContentState) {
		this.root = content.root;
		this.content = content;
	}

	props = {
		style: {
			boxSizing: "border-box",
			"--bits-select-content-transform-origin": "var(--bits-floating-transform-origin)",
			"--bits-select-content-available-width": "var(--bits-floating-available-width)",
			"--bits-select-content-available-height": "var(--bits-floating-available-height)",
			"--bits-select-trigger-width": "var(--bits-floating-anchor-width)",
			"--bits-select-trigger-height": "var(--bits-floating-anchor-height)",
		},
	} as const;
}

type SelectViewportStateProps = ReadableBoxedValues<{
	id: string;
}>;

class SelectViewportState {
	id: SelectViewportStateProps["id"];
	content: SelectContentState;
	prevScrollTop = $state(0);

	constructor(props: SelectViewportStateProps, content: SelectContentState) {
		this.id = props.id;
		this.content = content;
		this.content.viewportId = props.id.value;
		$effect(() => {
			if (this.content.viewportId !== props.id.value) {
				this.content.viewportId = props.id.value;
			}
		});
	}

	#onscroll = (e: WheelEvent) => {
		afterTick(() => {
			const viewport = e.currentTarget as HTMLElement;
			const shouldExpandOnScroll =
				this.content.alignedPositionState?.shouldExpandOnScroll ?? undefined;

			const contentWrapper = document.getElementById(
				this.content.alignedPositionState?.contentWrapperId ?? ""
			);

			if (shouldExpandOnScroll && contentWrapper) {
				const scrolledBy = Math.abs(this.prevScrollTop - viewport.scrollTop);
				if (scrolledBy > 0) {
					const availableHeight = window.innerHeight - CONTENT_MARGIN * 2;
					const cssMinHeight = Number.parseFloat(contentWrapper.style.minHeight);
					const cssHeight = Number.parseFloat(contentWrapper.style.height);
					const prevHeight = Math.max(cssMinHeight, cssHeight);

					if (prevHeight < availableHeight) {
						const nextHeight = prevHeight + scrolledBy;
						const clampedNextHeight = Math.min(availableHeight, nextHeight);
						const heightDiff = nextHeight - clampedNextHeight;

						contentWrapper.style.height = `${clampedNextHeight}px`;
						if (contentWrapper.style.bottom === "0px") {
							viewport.scrollTop = heightDiff > 0 ? heightDiff : 0;
							contentWrapper.style.justifyContent = "flex-end";
						}
					}
				}
			}
			this.prevScrollTop = viewport.scrollTop;
		});
	};

	props = $derived.by(
		() =>
			({
				id: this.id.value,
				role: "presentation",
				[VIEWPORT_ATTR]: "",
				style: {
					// we use position: 'relative' here on the `viewport` so that when we call
					// `selectedItem.offsetTop` in calculations, the offset is relative to the viewport
					// (independent of the scrollUpButton).
					position: "relative",
					flex: 1,
					overflow: "auto",
				},
				onscroll: this.#onscroll,
			}) as const
	);
}

type SelectScrollButtonImplStateProps = ReadableBoxedValues<{
	id: string;
	mounted: boolean;
}>;

class SelectScrollButtonImplState {
	id: SelectScrollButtonImplStateProps["id"];
	content: SelectContentState;
	alignedPositionState: SelectItemAlignedPositionState | null;
	autoScrollTimer = $state<number | null>(null);
	onAutoScroll: () => void = noop;
	mounted: SelectScrollButtonImplStateProps["mounted"];

	constructor(props: SelectScrollButtonImplStateProps, content: SelectContentState) {
		this.content = content;
		this.alignedPositionState = content.alignedPositionState;
		this.id = props.id;
		this.mounted = props.mounted;

		$effect(() => {
			if (this.mounted.value) {
				const activeItem = this.content.root
					.getCandidateNodes()
					.find((node) => node === document.activeElement);
				activeItem?.scrollIntoView({ block: "nearest" });
			}
		});

		$effect(() => {
			return () => {
				this.clearAutoScrollTimer();
			};
		});
	}

	clearAutoScrollTimer() {
		if (this.autoScrollTimer !== null) {
			window.clearInterval(this.autoScrollTimer);
			this.autoScrollTimer = null;
		}
	}

	#onpointerdown = () => {
		if (this.autoScrollTimer !== null) return;
		this.autoScrollTimer = window.setInterval(() => {
			this.onAutoScroll();
		}, 50);
	};

	#onpointermove = () => {
		this.content.onItemLeave?.();
		if (this.autoScrollTimer !== null) return;
		this.autoScrollTimer = window.setInterval(() => {
			this.onAutoScroll();
		}, 50);
	};

	#onpointerleave = () => {
		this.clearAutoScrollTimer();
	};

	props = $derived.by(
		() =>
			({
				id: this.id.value,
				"aria-hidden": "true",
				style: {
					flexShrink: 0,
				},
				onpointerdown: this.#onpointerdown,
				onpointermove: this.#onpointermove,
				onpointerleave: this.#onpointerleave,
			}) as const
	);
}

class SelectScrollDownButtonState {
	state: SelectScrollButtonImplState;
	content: SelectContentState;
	canScrollDown = $state(false);
	node = $state<HTMLElement | null>(null);

	constructor(state: SelectScrollButtonImplState) {
		this.state = state;
		this.content = state.content;
		this.state.onAutoScroll = this.handleAutoScroll;

		$effect(() => {
			const viewport = document.getElementById(this.content.viewportId);
			const isPositioned = this.content.isPositioned.value;

			if (!viewport || !isPositioned) return;

			let cleanup = noop;

			untrack(() => {
				const handleScroll = () => {
					const maxScroll = viewport.scrollHeight - viewport.clientHeight;
					this.canScrollDown = Math.ceil(viewport.scrollTop) < maxScroll;
				};
				handleScroll();

				cleanup = addEventListener(viewport, "scroll", handleScroll);
			});

			return () => {
				cleanup();
			};
		});

		$effect(() => {
			if (this.state.mounted.value) {
				this.state.alignedPositionState?.handleScrollButtonChange(this.state.id.value);
			}
		});

		$effect(() => {
			if (!this.state.mounted.value) {
				this.state.clearAutoScrollTimer();
			}
		});
	}

	handleAutoScroll() {
		afterTick(() => {
			const viewport = document.getElementById(this.content.viewportId);
			const selectedItem = this.content.getSelectedItem().selectedItemNode;
			if (!viewport || !selectedItem) {
				return;
			}
			viewport.scrollTop = viewport.scrollTop + selectedItem.offsetHeight;
		});
	}

	props = $derived.by(() => ({ ...this.state.props, [SCROLL_DOWN_BUTTON_ATTR]: "" }) as const);
}

class SelectScrollUpButtonState {
	state: SelectScrollButtonImplState;
	content: SelectContentState;
	canScrollUp = $state(false);
	node = $state<HTMLElement | null>(null);

	constructor(state: SelectScrollButtonImplState) {
		this.state = state;
		this.content = state.content;
		this.state.onAutoScroll = this.handleAutoScroll;

		$effect(() => {
			let cleanup = noop;

			cleanup();
			const viewport = document.getElementById(this.content.viewportId);
			const isPositioned = this.content.isPositioned.value;

			if (!viewport || !isPositioned) return;

			const handleScroll = () => {
				this.canScrollUp = viewport.scrollTop > 0;
			};
			handleScroll();

			cleanup = addEventListener(viewport, "scroll", handleScroll);

			return () => {
				cleanup();
			};
		});

		$effect(() => {
			if (this.state.mounted.value) {
				this.state.alignedPositionState?.handleScrollButtonChange(this.state.id.value);
			}
		});

		$effect(() => {
			if (!this.state.mounted.value) {
				this.state.clearAutoScrollTimer();
			}
		});
	}

	handleAutoScroll() {
		afterTick(() => {
			const viewport = document.getElementById(this.content.viewportId);
			const selectedItem = this.content.getSelectedItem().selectedItemNode;
			if (!viewport || !selectedItem) return;
			viewport.scrollTop = viewport.scrollTop - selectedItem.offsetHeight;
		});
	}

	props = $derived.by(() => ({ ...this.state.props, [SCROLL_UP_BUTTON_ATTR]: "" }) as const);
}

class SelectGroupState {
	labelId = box.with<string | undefined>(() => undefined);

	props = $derived.by(
		() =>
			({
				role: "group",
				"aria-labelledby": this.labelId.value ?? undefined,
				[GROUP_ATTR]: "",
			}) as const
	);

	createGroupLabel(props: SelectGroupLabelStateProps) {
		return new SelectGroupLabel(props, this);
	}
}

type SelectGroupLabelStateProps = ReadableBoxedValues<{
	id: string;
}>;

class SelectGroupLabel {
	group: SelectGroupState;

	constructor(props: SelectGroupLabelStateProps, group: SelectGroupState) {
		this.group = group;
		this.group.labelId = props.id;
	}

	props = $derived.by(
		() =>
			({
				id: this.group.labelId.value,
				[GROUP_TITLE_ATTR]: "",
			}) as const
	);
}

class SelectSeparatorState {
	props = {
		[SEPARATOR_ATTR]: "",
		"aria-hidden": getAriaHidden(true),
	} as const;
}

class SelectArrowState {
	props = {
		[ARROW_ATTR]: "",
		"aria-hidden": getAriaHidden(true),
	} as const;
}

class SelectIconState {
	props = {
		[ICON_ATTR]: "",
		"aria-hidden": getAriaHidden(true),
	} as const;
}

export function useSelectRoot(props: SelectRootStateProps) {
	return setSelectRootContext(new SelectRootState(props));
}

export function useSelectContentFrag(props: SelectContentFragStateProps) {
	return getSelectRootContext().createContent(props);
}

export function useSelectContent(props: SelectContentStateProps) {
	return setSelectContentContext(getSelectRootContext().createContentImpl(props));
}

export function useSelectItemAlignedPosition(props: SelectItemAlignedPositionStateProps) {
	const contentContext = getSelectContentContext();
	const alignedPositionState = contentContext.createItemAlignedPosition(props);
	contentContext.alignedPositionState = alignedPositionState;
	return setSelectContentItemAlignedContext(alignedPositionState);
}

export function useSelectFloatingPosition() {
	return getSelectContentContext().createFloatingPosition();
}

export function useSelectTrigger(props: SelectTriggerStateProps) {
	return getSelectRootContext().createTrigger(props);
}

export function useSelectValue() {
	return getSelectRootContext().createValue();
}

export function useSelectItem(props: SelectItemStateProps) {
	return setSelectItemContext(getSelectContentContext().createItem(props));
}

export function useSelectItemText(props: SelectItemTextStateProps) {
	return getSelectItemContext().createText(props);
}

export function useSelectViewport(props: SelectViewportStateProps) {
	return getSelectContentContext().createViewport(props);
}

export function useSelectScrollUpButton(props: SelectScrollButtonImplStateProps) {
	return getSelectContentContext().createScrollUpButton(props);
}

export function useSelectScrollDownButton(props: SelectScrollButtonImplStateProps) {
	return getSelectContentContext().createScrollDownButton(props);
}

export function useSelectGroup() {
	return setSelectGroupContext(new SelectGroupState());
}

export function useSelectGroupLabel(props: SelectGroupLabelStateProps) {
	return getSelectGroupContext().createGroupLabel(props);
}

export function useSelectArrow() {
	return new SelectArrowState();
}

export function useSelectSeparator() {
	return new SelectSeparatorState();
}

export function useSelectIcon() {
	return new SelectIconState();
}

//

export function shouldShowPlaceholder(value?: string) {
	return value === "" || value === undefined;
}
