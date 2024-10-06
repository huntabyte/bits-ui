/**
 * This logic is adapted from Radix UI Select component.
 * https://github.com/radix-ui/primitives/blob/main/packages/react/select/src/Select.tsx
 * Credit to the Radix UI team for the original implementation.
 */
import { type ReadableBox, type WritableBox, afterSleep, afterTick, box, useRefById } from "svelte-toolbelt";
import { SvelteMap } from "svelte/reactivity";
import { untrack } from "svelte";
import type { ReadableBoxedValues, WritableBoxedValues } from "$lib/internal/box.svelte.js";
import { useId } from "$lib/internal/use-id.js";
import type { Direction } from "$lib/shared/index.js";
import { createContext } from "$lib/internal/create-context.js";
import { useFormControl } from "$lib/internal/use-form-control.svelte.js";
import { type Typeahead, useTypeahead } from "$lib/internal/use-typeahead.svelte.js";
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
import { clamp } from "$lib/internal/clamp.js";
import { noop } from "$lib/internal/noop.js";
import { addEventListener } from "$lib/internal/events.js";
import type { WithRefProps } from "$lib/internal/types.js";

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
const GROUP_LABEL_ATTR = "data-select-group-label";
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
	triggerNode = $state<HTMLElement | null>(null);
	valueId = box<string>(useId());
	valueNodeHasChildren = box(false);
	valueNode = $state<HTMLElement | null>(null);
	contentNode = $state<HTMLElement | null>(null);
	contentId = $state<string | undefined>(undefined);
	triggerPointerDownPos = box<{ x: number; y: number } | null>({ x: 0, y: 0 });
	contentFragment = $state<DocumentFragment | null>(null);

	// A set of all the native options we'll use to render the native select element under the hood
	#nativeOptionsSet = new SvelteMap<string, ReadableBox<SelectNativeOption>>();
	// A key we'll use to rerender the native select when the options change to keep it in sync
	nativeSelectKey = $derived.by(() => {
		return Array.from(this.#nativeOptionsSet.values())
			.map((opt) => opt.current.value)
			.join(";");
	});

	nativeOptionsArr = $derived.by(() => Array.from(this.#nativeOptionsSet.values()));
	isFormControl = useFormControl(() => this.triggerNode);

	constructor(props: SelectRootStateProps) {
		this.open = props.open;
		this.value = props.value;
		this.dir = props.dir;
		this.disabled = props.disabled;
		this.required = props.required;
	}

	handleClose = () => {
		this.open.current = false;
		this.focusTriggerNode();
	};

	focusTriggerNode = (preventScroll: boolean = true) => {
		const node = this.triggerNode;
		if (!node) return;
		// this needs to be 10 otherwise Firefox doesn't focus the correct node
		afterSleep(10, () => {
			node.focus({ preventScroll });
		});
	};

	onNativeOptionAdd = (option: ReadableBox<SelectNativeOption>) => {
		this.#nativeOptionsSet.set(option.current.value, option);
	};

	onNativeOptionRemove = (option: ReadableBox<SelectNativeOption>) => {
		this.#nativeOptionsSet.delete(option.current.value);
	};

	getTriggerTypeaheadCandidateNodes = () => {
		const node = this.contentFragment;
		if (!node) return [];
		return Array.from(
			node.querySelectorAll<HTMLElement>(`[${ITEM_ATTR}]:not([data-disabled])`)
		);
	};

	getCandidateNodes = () => {
		const node = this.contentNode;
		if (!node) return [];
		return Array.from(
			node.querySelectorAll<HTMLElement>(`[${ITEM_ATTR}]:not([data-disabled])`)
		);
	};
}

type SelectTriggerStateProps = WithRefProps<
	ReadableBoxedValues<{
		disabled: boolean;
	}>
>;

class SelectTriggerState {
	#root: SelectRootState;
	#id: SelectTriggerStateProps["id"];
	#ref: SelectTriggerStateProps["ref"];
	#disabled: SelectTriggerStateProps["disabled"];
	#typeahead: Typeahead;
	#isDisabled = $derived.by(() => {
		return this.#root.disabled.current || this.#disabled.current;
	});

	constructor(props: SelectTriggerStateProps, root: SelectRootState) {
		this.#id = props.id;
		this.#ref = props.ref;
		this.#root = root;
		this.#disabled = props.disabled;

		useRefById({
			id: this.#id,
			ref: this.#ref,
			onRefChange: (node) => {
				this.#root.triggerNode = node;
			},
		});

		this.#typeahead = useTypeahead();
	}

	#handleOpen = () => {
		if (this.#isDisabled) return;
		this.#root.open.current = true;
		this.#typeahead.resetTypeahead();
	};

	#handlePointerOpen = (e: PointerEvent) => {
		this.#handleOpen();
		this.#root.triggerPointerDownPos.current = {
			x: Math.round(e.pageX),
			y: Math.round(e.pageY),
		};
	};

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
		if (target?.hasPointerCapture(e.pointerId)) {
			target?.releasePointerCapture(e.pointerId);
		}

		// only call the handle if it's a left click, since pointerdown is triggered
		// by right clicks as well, but not when ctrl is pressed
		if (e.button === 0 && e.ctrlKey === false) {
			if (this.#root.open.current === false) {
				this.#handlePointerOpen(e);
				e.preventDefault();
			} else {
				this.#root.handleClose();
			}
		}
	};

	#onpointerup = (e: PointerEvent) => {
		e.preventDefault();
		if (e.pointerType === "touch") {
			this.#handlePointerOpen(e);
		}
	};

	#onkeydown = (e: KeyboardEvent) => {
		const isTypingAhead = this.#typeahead.search.current !== "";
		const isModifierKey = e.ctrlKey || e.altKey || e.metaKey;

		if (!isModifierKey && e.key.length === 1) {
			if (isTypingAhead && e.key === " ") return;
		}
		const newItem = this.#typeahead.handleTypeaheadSearch(
			e.key,
			this.#root.getTriggerTypeaheadCandidateNodes()
		);

		if (newItem && newItem.dataset.value) {
			this.#root.value.current = newItem.dataset.value;
		}

		if (OPEN_KEYS.includes(e.key)) {
			this.#handleOpen();
			e.preventDefault();
		}
	};

	props = $derived.by(
		() =>
			({
				id: this.#id.current,
				disabled: this.#isDisabled,
				role: "combobox",
				type: "button",
				"aria-controls": this.#root.contentId,
				"aria-expanded": getAriaExpanded(this.#root.open.current),
				"aria-required": getAriaRequired(this.#root.required.current),
				"aria-autocomplete": "none",
				dir: this.#root.dir.current,
				"data-state": getDataOpenClosed(this.#root.open.current),
				"data-disabled": getDataDisabled(this.#isDisabled),
				"data-placeholder": shouldShowPlaceholder(this.#root.value.current)
					? ""
					: undefined,
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
	showPlaceholder = $derived.by(() => shouldShowPlaceholder(this.root.value.current));
	ref: WritableBox<HTMLElement | null> = box(null);

	constructor(root: SelectRootState) {
		this.root = root;

		useRefById({
			id: this.root.valueId,
			ref: this.ref,
			onRefChange: (node) => {
				this.root.valueNode = node;
			},
		});
	}

	props = $derived.by(
		() =>
			({
				id: this.root.valueId.current,
				"data-state": getDataOpenClosed(this.root.open.current),
				"data-disabled": getDataDisabled(this.root.disabled.current),
				[VALUE_ATTR]: "",
				style: {
					pointerEvents: "none",
				},
			}) as const
	);
}

class SelectContentFragState {
	root: SelectRootState;

	constructor(root: SelectRootState) {
		this.root = root;

		$effect(() => {
			this.root.contentFragment = new DocumentFragment();
		});
	}
}

type SelectContentStateProps = WithRefProps<
	ReadableBoxedValues<{
		position: "item-aligned" | "floating";
	}>
>;

export class SelectContentState {
	id: SelectContentStateProps["id"];
	ref: SelectContentStateProps["ref"];
	root: SelectRootState;
	viewportNode = $state<HTMLElement | null>(null);
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
		this.ref = props.ref;
		this.root = root;
		this.typeahead = useTypeahead();

		useRefById({
			id: this.id,
			ref: this.ref,
			deps: () => this.root.open.current,
			onRefChange: (node) => {
				this.root.contentNode = node;
				this.root.contentId = node?.id;
			},
		});

		$effect(() => {
			this.root.open.current;
			untrack(() => {
				let cleanup = [noop];

				afterTick(() => {
					const node = document.getElementById(this.id.current);
					if (!node) return;

					let pointerMoveDelta = { x: 0, y: 0 };

					const handlePointerMove = (e: PointerEvent) => {
						pointerMoveDelta = {
							x: Math.abs(
								Math.round(e.pageX) -
									(this.root.triggerPointerDownPos.current?.x ?? 0)
							),
							y: Math.abs(
								Math.round(e.pageY) -
									(this.root.triggerPointerDownPos.current?.y ?? 0)
							),
						};
					};

					const handlePointerUp = (e: PointerEvent) => {
						if (e.pointerType === "touch") return;

						if (pointerMoveDelta.x <= 10 && pointerMoveDelta.y <= 10) {
							e.preventDefault();
						} else {
							if (!this.root.contentNode?.contains(e.target as HTMLElement)) {
								this.root.handleClose();
							}
						}
						document.removeEventListener("pointermove", handlePointerMove);
						this.root.triggerPointerDownPos.current = null;
					};

					if (this.root.triggerPointerDownPos.current !== null) {
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
		});

		$effect(() => {
			if (this.isPositioned.current) {
				this.focusSelectedItem();
			}
		});

		$effect(() => {
			if (this.root.open.current === false) {
				this.isPositioned.current = false;
			}
		});
	}

	focusFirst = (candidates: Array<HTMLElement | null>) => {
		const [firstItem, ...restItems] = this.root.getCandidateNodes();
		const [lastItem] = restItems.slice(-1);

		const PREV_FOCUSED_ELEMENT = document.activeElement;

		for (const candidate of candidates) {
			if (candidate === PREV_FOCUSED_ELEMENT) return;
			candidate?.scrollIntoView({ block: "nearest" });
			// viewport might have padding so scroll to the edge when focusing first/last
			const viewport = this.viewportNode;
			if (candidate === firstItem && viewport) {
				viewport.scrollTop = 0;
			}
			if (candidate === lastItem && viewport) {
				viewport.scrollTop = viewport.scrollHeight;
			}

			candidate?.focus();

			if (document.activeElement !== PREV_FOCUSED_ELEMENT) return;
		}
	};

	onItemLeave = () => {
		this.root.contentNode?.focus();
	};

	getSelectedItem = () => {
		const candidates = this.root.getCandidateNodes();
		const selectedItemNode =
			candidates.find((node) => node?.dataset.value === this.root.value.current) ?? null;
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
	};

	focusSelectedItem = () => {
		afterTick(() => {
			const candidates = this.root.getCandidateNodes();
			const selected =
				candidates.find((node) => node?.dataset.value === this.root.value.current) ?? null;
			const first = candidates[0] ?? null;
			this.focusFirst([selected, first]);
		});
	};

	itemRegister = (value: string, disabled: boolean) => {
		const isFirstValidItem = !this.firstValidItemFound.current && !disabled;
		const isSelectedItem =
			this.root.value.current !== undefined && this.root.value.current === value;

		if (isSelectedItem || isFirstValidItem) {
			if (isFirstValidItem) {
				this.firstValidItemFound.current = true;
			}
		}
	};

	itemTextRegister = (node: HTMLElement | null, value: string, disabled: boolean) => {
		const isFirstValidItem = !this.firstValidItemFound.current && !disabled;
		const isSelectedItem =
			this.root.value.current !== undefined && this.root.value.current === value;

		if (isSelectedItem || isFirstValidItem) {
			this.selectedItemText.current = node;
		}
	};

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
				id: this.id.current,
				role: "listbox",
				"data-state": getDataOpenClosed(this.root.open.current),
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
}

type SelectItemStateProps = WithRefProps<
	ReadableBoxedValues<{
		value: string;
		disabled: boolean;
		textValue?: string;
	}>
>;

class SelectItemState {
	#id: SelectItemStateProps["id"];
	#ref: SelectItemStateProps["ref"];
	root: SelectRootState;
	content: SelectContentState;
	textId = box<string | undefined>(undefined);
	value: SelectItemStateProps["value"];
	disabled: SelectItemStateProps["disabled"];
	textValue: SelectItemStateProps["textValue"];
	isSelected = $derived.by(() => this.root.value.current === this.value.current);
	isFocused = box(false);
	node = box<HTMLElement | null>(null);
	trueTextValue = box<string>("");

	constructor(props: SelectItemStateProps, content: SelectContentState) {
		this.#id = props.id;
		this.#ref = props.ref;
		this.root = content.root;
		this.content = content;
		this.value = props.value;
		this.disabled = props.disabled;
		this.textValue = props.textValue;

		useRefById({
			id: this.#id,
			ref: this.#ref,
		});

		$effect(() => {
			const node = this.#ref.current;
			if (!node) return;
			this.content.itemRegister(this.value.current, this.disabled.current);
		});
	}

	onItemTextChange = (node: HTMLElement | null) => {
		this.trueTextValue.current = ((this.textValue?.current || node?.textContent) ?? "").trim();
	};

	setTextId = (id: string) => {
		this.textId.current = id;
	};

	handleSelect = async (e?: PointerEvent) => {
		if (e?.defaultPrevented) return;

		if (!this.disabled.current) {
			this.root.value.current = this.value.current;
			this.root.handleClose();
		}
	};

	#onpointermove = async (e: PointerEvent) => {
		if (e.defaultPrevented) return;
		if (this.disabled.current) {
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

		const isTypingAhead = this.content.typeahead.search.current !== "";
		if (isTypingAhead && e.key === kbd.SPACE) return;

		if (SELECTION_KEYS.includes(e.key)) {
			this.handleSelect();
		}

		// prevent page scroll on space
		if (e.key === kbd.SPACE) e.preventDefault();
	};

	#onfocus = () => {
		this.isFocused.current = true;
	};

	#onblur = () => {
		this.isFocused.current = false;
	};

	#ontouchend = (e: TouchEvent) => {
		e.preventDefault();
		e.stopPropagation();
	};

	props = $derived.by(
		() =>
			({
				id: this.#id.current,
				role: "option",
				"aria-labelledby": this.textId.current ?? undefined,
				"data-highlighted": this.isFocused.current ? "" : undefined,
				"aria-selected": getAriaSelected(this.isSelected),
				"data-state": getDataChecked(this.isSelected),
				"aria-disabled": getAriaDisabled(this.disabled.current),
				"data-disabled": getDataDisabled(this.disabled.current),
				"data-selected": this.isSelected ? "" : undefined,
				"data-value": this.value.current,
				tabindex: this.disabled.current ? undefined : -1,
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
}

type SelectItemTextStateProps = WithRefProps;

class SelectItemTextState {
	item: SelectItemState;
	#id: SelectItemTextStateProps["id"];
	#ref: SelectItemTextStateProps["ref"];
	node = box<HTMLElement | null>(null);
	nativeOption = box.with(
		() =>
			({
				key: this.item.value.current,
				value: this.item.value.current,
				disabled: this.item.disabled.current,
				innerHTML: this.node.current?.textContent,
			}) as const
	);

	constructor(props: SelectItemTextStateProps, item: SelectItemState) {
		this.#id = props.id;
		this.#ref = props.ref;
		this.item = item;
		this.item.setTextId(this.#id.current);

		useRefById({
			id: this.#id,
			ref: this.#ref,
		});

		$effect(() => {
			this.item.setTextId(this.#id.current);
		});

		$effect(() => {
			untrack(() => {
				const textNode = this.item.root.contentFragment?.getElementById(this.#id.current);
				if (!textNode) return;
				this.item.onItemTextChange(textNode);
				this.item.content.itemTextRegister(
					textNode,
					this.item.value.current,
					this.item.disabled.current
				);

				this.item.root.onNativeOptionAdd(
					box.with(() => ({
						key: this.item.value.current,
						value: this.item.value.current,
						disabled: this.item.disabled.current,
						innerHTML: textNode?.textContent,
					}))
				);
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
				id: this.#id.current,
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
				const contentNode = document.getElementById(this.content.id.current);
				if (contentNode) {
					this.contentZIndex = window.getComputedStyle(contentNode).zIndex;
				}
			});
		});
	}

	position = () => {
		afterTick(() => {
			const { selectedItemNode, selectedItemTextNode } = this.content.getSelectedItem();
			const contentNode = this.root.contentNode;
			const contentWrapperNode = document.getElementById(this.contentWrapperId);
			const viewportNode = this.content.viewportNode;
			const triggerNode = this.root.triggerNode;
			const valueNode = document.getElementById(this.root.valueId.current);

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

			if (this.root.dir.current === "rtl") {
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

			this.onPlaced.current();
		});
		requestAnimationFrame(() => (this.shouldExpandOnScroll = true));
	};

	handleScrollButtonChange = (id: string) => {
		afterTick(() => {
			const node = document.getElementById(id);
			if (!node) return;
			if (!this.shouldReposition) return;
			this.position();
			this.content.focusSelectedItem();
			this.shouldReposition = false;
		});
	};

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
				id: this.content.id.current,
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
			"--bits-select-anchor-width": "var(--bits-floating-anchor-width)",
			"--bits-select-anchor-height": "var(--bits-floating-anchor-height)",
		},
	} as const;
}

type SelectViewportStateProps = WithRefProps;

class SelectViewportState {
	id: SelectViewportStateProps["id"];
	ref: SelectViewportStateProps["ref"];
	content: SelectContentState;
	prevScrollTop = $state(0);

	constructor(props: SelectViewportStateProps, content: SelectContentState) {
		this.id = props.id;
		this.content = content;
		this.ref = props.ref;

		useRefById({
			id: this.id,
			ref: this.ref,
			onRefChange: (node) => {
				this.content.viewportNode = node;
			},
			deps: () => this.content.root.open.current,
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
				id: this.id.current,
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

type SelectScrollButtonImplStateProps = WithRefProps<
	ReadableBoxedValues<{
		mounted: boolean;
	}>
>;

class SelectScrollButtonImplState {
	id: SelectScrollButtonImplStateProps["id"];
	ref: SelectScrollButtonImplStateProps["ref"];
	content: SelectContentState;
	alignedPositionState: SelectItemAlignedPositionState | null;
	autoScrollTimer = $state<number | null>(null);
	onAutoScroll: () => void = noop;
	mounted: SelectScrollButtonImplStateProps["mounted"];

	constructor(props: SelectScrollButtonImplStateProps, content: SelectContentState) {
		this.content = content;
		this.ref = props.ref;
		this.alignedPositionState = content.alignedPositionState;
		this.id = props.id;
		this.mounted = props.mounted;

		useRefById({
			id: this.id,
			ref: this.ref,
			deps: () => this.mounted.current,
		});

		$effect(() => {
			if (this.mounted.current) {
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

	clearAutoScrollTimer = () => {
		if (this.autoScrollTimer !== null) {
			window.clearInterval(this.autoScrollTimer);
			this.autoScrollTimer = null;
		}
	};

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
				id: this.id.current,
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

	constructor(state: SelectScrollButtonImplState) {
		this.state = state;
		this.content = state.content;
		this.state.onAutoScroll = this.handleAutoScroll;

		$effect(() => {
			const viewport = this.content.viewportNode;
			const isPositioned = this.content.isPositioned.current;

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
			if (this.state.mounted.current) {
				this.state.alignedPositionState?.handleScrollButtonChange(this.state.id.current);
			}
		});

		$effect(() => {
			if (!this.state.mounted.current) {
				this.state.clearAutoScrollTimer();
			}
		});
	}

	handleAutoScroll = () => {
		afterTick(() => {
			const viewport = this.content.viewportNode;
			const selectedItem = this.content.getSelectedItem().selectedItemNode;
			if (!viewport || !selectedItem) {
				return;
			}
			viewport.scrollTop = viewport.scrollTop + selectedItem.offsetHeight;
		});
	};

	props = $derived.by(() => ({ ...this.state.props, [SCROLL_DOWN_BUTTON_ATTR]: "" }) as const);
}

class SelectScrollUpButtonState {
	state: SelectScrollButtonImplState;
	content: SelectContentState;
	canScrollUp = $state(false);

	constructor(state: SelectScrollButtonImplState) {
		this.state = state;
		this.content = state.content;
		this.state.onAutoScroll = this.handleAutoScroll;

		$effect(() => {
			let cleanup = noop;

			cleanup();
			const viewport = this.content.viewportNode;
			const isPositioned = this.content.isPositioned.current;

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
			if (this.state.mounted.current) {
				this.state.alignedPositionState?.handleScrollButtonChange(this.state.id.current);
			}
		});

		$effect(() => {
			if (!this.state.mounted.current) {
				this.state.clearAutoScrollTimer();
			}
		});
	}

	handleAutoScroll = () => {
		afterTick(() => {
			const viewport = this.content.viewportNode;
			const selectedItem = this.content.getSelectedItem().selectedItemNode;
			if (!viewport || !selectedItem) return;
			viewport.scrollTop = viewport.scrollTop - selectedItem.offsetHeight;
		});
	};

	props = $derived.by(() => ({ ...this.state.props, [SCROLL_UP_BUTTON_ATTR]: "" }) as const);
}

type SelectGroupStateProps = WithRefProps;

class SelectGroupState {
	#id: SelectGroupStateProps["id"];
	#ref: SelectGroupStateProps["ref"];
	labelNode = $state<HTMLElement | null>(null);

	constructor(props: SelectGroupStateProps) {
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
				id: this.#id.current,
				role: "group",
				"aria-labelledby": this.labelNode?.id ?? undefined,
				[GROUP_ATTR]: "",
			}) as const
	);
}

type SelectGroupHeadingStateProps = WithRefProps;

class SelectGroupHeadingState {
	#id: SelectGroupHeadingStateProps["id"];
	#ref: SelectGroupHeadingStateProps["ref"];
	group: SelectGroupState;

	constructor(props: SelectGroupHeadingStateProps, group: SelectGroupState) {
		this.#ref = props.ref;
		this.#id = props.id;
		this.group = group;

		useRefById({
			id: this.#id,
			ref: this.#ref,
			onRefChange: (node) => {
				this.group.labelNode = node;
			},
		});
	}

	props = $derived.by(
		() =>
			({
				id: this.#id.current,
				[GROUP_LABEL_ATTR]: "",
			}) as const
	);
}

type SelectSeparatorStateProps = WithRefProps;

class SelectSeparatorState {
	#id: SelectSeparatorStateProps["id"];
	#ref: SelectSeparatorStateProps["ref"];

	constructor(props: SelectSeparatorStateProps) {
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
				id: this.#id.current,
				[SEPARATOR_ATTR]: "",
				"aria-hidden": getAriaHidden(true),
			}) as const
	);
}

type SelectArrowStateProps = WithRefProps;

class SelectArrowState {
	#id: SelectArrowStateProps["id"];
	#ref: SelectArrowStateProps["ref"];

	constructor(props: SelectArrowStateProps) {
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
				id: this.#id.current,
				[ARROW_ATTR]: "",
				"aria-hidden": getAriaHidden(true),
			}) as const
	);
}

type SelectIconStateProps = WithRefProps;

class SelectIconState {
	#id: SelectIconStateProps["id"];
	#ref: SelectIconStateProps["ref"];

	constructor(props: SelectIconStateProps) {
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
				id: this.#id.current,
				[ICON_ATTR]: "",
				"aria-hidden": getAriaHidden(true),
			}) as const
	);
}

export function useSelectRoot(props: SelectRootStateProps) {
	return setSelectRootContext(new SelectRootState(props));
}

export function useSelectContentFrag() {
	return new SelectContentFragState(getSelectRootContext());
}

export function useSelectContent(props: SelectContentStateProps) {
	return setSelectContentContext(new SelectContentState(props, getSelectRootContext()));
}

export function useSelectItemAlignedPosition(props: SelectItemAlignedPositionStateProps) {
	const contentContext = getSelectContentContext();
	const alignedPositionState = new SelectItemAlignedPositionState(props, contentContext);
	contentContext.alignedPositionState = alignedPositionState;
	return setSelectContentItemAlignedContext(alignedPositionState);
}

export function useSelectFloatingPosition() {
	return new SelectFloatingPositionState(getSelectContentContext());
}

export function useSelectTrigger(props: SelectTriggerStateProps) {
	return new SelectTriggerState(props, getSelectRootContext());
}

export function useSelectValue() {
	return new SelectValueState(getSelectRootContext());
}

export function useSelectItem(props: SelectItemStateProps) {
	return setSelectItemContext(new SelectItemState(props, getSelectContentContext()));
}

export function useSelectItemText(props: SelectItemTextStateProps) {
	return new SelectItemTextState(props, getSelectItemContext());
}

export function useSelectViewport(props: SelectViewportStateProps) {
	return new SelectViewportState(props, getSelectContentContext());
}

export function useSelectScrollUpButton(props: SelectScrollButtonImplStateProps) {
	const state = new SelectScrollButtonImplState(props, getSelectContentContext());
	return new SelectScrollUpButtonState(state);
}

export function useSelectScrollDownButton(props: SelectScrollButtonImplStateProps) {
	const state = new SelectScrollButtonImplState(props, getSelectContentContext());
	return new SelectScrollDownButtonState(state);
}

export function useSelectGroup(props: SelectGroupStateProps) {
	return setSelectGroupContext(new SelectGroupState(props));
}

export function useSelectGroupHeading(props: SelectGroupHeadingStateProps) {
	return new SelectGroupHeadingState(props, getSelectGroupContext());
}

export function useSelectArrow(props: SelectArrowStateProps) {
	return new SelectArrowState(props);
}

export function useSelectSeparator(props: SelectSeparatorStateProps) {
	return new SelectSeparatorState(props);
}

export function useSelectIcon(props: SelectIconStateProps) {
	return new SelectIconState(props);
}

//

export function shouldShowPlaceholder(value?: string) {
	return value === "" || value === undefined;
}
