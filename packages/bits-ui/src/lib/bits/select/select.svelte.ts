import { type ReadableBox, box } from "svelte-toolbelt";
import { Set } from "svelte/reactivity";
import { tick, untrack } from "svelte";
import { focusFirst } from "../utilities/focus-scope/utils.js";
import {
	type Box,
	type ReadableBoxedValues,
	type WritableBoxedValues,
	watch,
} from "$lib/internal/box.svelte.js";
import { useId } from "$lib/internal/useId.svelte.js";
import type { Direction } from "$lib/shared/index.js";
import { createContext } from "$lib/internal/createContext.js";
import { useFormControl } from "$lib/internal/useFormControl.svelte.js";
import { useNodeById } from "$lib/internal/useNodeById.svelte.js";
import { type Typeahead, useTypeahead } from "$lib/internal/useTypeahead.svelte.js";
import {
	getAriaDisabled,
	getAriaExpanded,
	getAriaRequired,
	getAriaSelected,
	getDataChecked,
	getDataDisabled,
	getDataOpenClosed,
} from "$lib/internal/attrs.js";
import { kbd } from "$lib/internal/kbd.js";

export const OPEN_KEYS = [kbd.SPACE, kbd.ENTER, kbd.ARROW_UP, kbd.ARROW_DOWN];
export const SELECTION_KEYS = [" ", kbd.ENTER];
export const CONTENT_MARGIN = 10;

const TRIGGER_ATTR = "data-select-trigger";
const CONTENT_ATTR = "data-select-content";
const ITEM_ATTR = "data-select-item";
const VIEWPORT_ATTR = "data-select-viewport";
const VALUE_ATTR = "data-select-value";
const ITEM_TEXT_ATTR = "data-select-item-text";

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
	triggerNode = box<HTMLElement | null>(null);
	valueId = box<string>(useId());
	valueNodeHasChildren = box(false);
	contentId = box<string>(useId());
	triggerPointerDownPos = box<{ x: number; y: number } | null>({ x: 0, y: 0 });
	contentFragment = box<DocumentFragment | null>(null);

	// A set of all the native options we'll use to render the native select element under the hood
	nativeOptionsSet = new Set<ReadableBox<SelectNativeOption>>();
	// A key we'll use to rerender the native select when the options change to keep it in sync
	nativeSelectKey = $derived.by(() => {
		return Array.from(this.nativeOptionsSet)
			.map((opt) => opt.value.value)
			.join(";");
	});

	nativeOptionsArr = $derived.by(() => Array.from(this.nativeOptionsSet));

	isFormControl = useFormControl(this.triggerNode);

	constructor(props: SelectRootStateProps) {
		this.open = props.open;
		this.value = props.value;
		this.dir = props.dir;
		this.disabled = props.disabled;
		this.required = props.required;
	}

	onNativeOptionAdd(option: ReadableBox<SelectNativeOption>) {
		this.nativeOptionsSet.add(option);
	}

	onNativeOptionRemove(option: ReadableBox<SelectNativeOption>) {
		this.nativeOptionsSet.delete(option);
	}

	getTriggerTypeaheadCandidateNodes() {
		const node = this.contentFragment.value;
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

	createContent(props: SelectContentStateProps) {
		return new SelectContentState(props, this);
	}

	createContentImpl(props: SelectContentImplStateProps) {
		return new SelectContentImplState(props, this);
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
	#node: Box<HTMLElement | null>;
	#isDisabled = $derived.by(() => {
		return this.#root.disabled.value || this.#disabled.value;
	});

	constructor(props: SelectTriggerStateProps, root: SelectRootState) {
		this.#id = props.id;
		this.#root = root;
		this.#root.triggerNode = useNodeById(this.#id);
		this.#node = useNodeById(this.#id);
		this.#disabled = props.disabled;

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

type SelectContentStateProps = ReadableBoxedValues<{
	id: string;
}>;

class SelectContentState {
	root: SelectRootState;
	fragment = box<DocumentFragment | null>(null);

	constructor(props: SelectContentStateProps, root: SelectRootState) {
		this.root = root;
		this.root.contentId.value = props.id.value;

		$effect(() => {
			this.root.contentId.value = props.id.value;
		});

		$effect(() => {
			this.fragment.value = new DocumentFragment();
		});

		$effect(() => {
			this.root.contentFragment.value = this.fragment.value;
		});
	}
}

type SelectContentImplStateProps = ReadableBoxedValues<{
	id: string;
	position: "item-aligned" | "floating";
}>;

class SelectContentImplState {
	id: SelectContentImplStateProps["id"];
	root: SelectRootState;
	contentNode = box<HTMLElement | null>(null);
	viewportNode = box<HTMLElement | null>(null);
	selectedItem = box<HTMLElement | null>(null);
	selectedItemText = box<HTMLElement | null>(null);
	position: SelectContentImplStateProps["position"];
	isPositioned = box(true);
	firstValidItemFound = box(false);
	typeahead: Typeahead;

	constructor(props: SelectContentImplStateProps, root: SelectRootState) {
		this.position = props.position;
		this.id = props.id;
		this.root = root;
		this.typeahead = useTypeahead();

		watch(this.isPositioned, () => {
			this.focusSelectedItem();
		});

		$effect(() => {
			if (!this.contentNode.value) return;

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
				document.addEventListener("pointermove", handlePointerMove);
				document.addEventListener("pointerup", handlePointerUp, {
					capture: true,
					once: true,
				});
			}

			return () => {
				document.removeEventListener("pointermove", handlePointerMove);
				document.removeEventListener("pointerup", handlePointerUp, {
					capture: true,
				});
			};
		});
	}

	onItemLeave() {
		this.contentNode.value?.focus();
	}

	focusSelectedItem() {
		if (!this.selectedItem.value && this.contentNode.value) {
			focusFirst([this.contentNode.value])
		}
		if (this.selectedItem.value && this.contentNode.value) {
			focusFirst([this.selectedItem.value, this.contentNode.value]);
		}
	}

	itemRegister(node: HTMLElement | null, value: string, disabled: boolean) {
		const isFirstValidItem = !this.firstValidItemFound.value && !disabled;
		const isSelectedItem =
			this.root.value.value !== undefined && this.root.value.value === value;

		if (isSelectedItem || isFirstValidItem) {
			this.selectedItem.value = node;

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

			setTimeout(() => focusFirst(candidateNodes));
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
				[CONTENT_ATTR]: "",
			}) as const
	);

	createItem(props: SelectItemStateProps) {
		return new SelectItemState(props, this);
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
	content: SelectContentImplState;
	textId = box<string | undefined>(undefined);
	value: SelectItemStateProps["value"];
	disabled: SelectItemStateProps["disabled"];
	textValue: SelectItemStateProps["textValue"];
	isSelected = $derived.by(() => this.root.value.value === this.value.value);
	isFocused = box(false);
	node = box<HTMLElement | null>(null);
	trueTextValue = box<string>("");

	constructor(props: SelectItemStateProps, content: SelectContentImplState) {
		this.#id = props.id;
		this.root = content.root;
		this.content = content;
		this.value = props.value;
		this.disabled = props.disabled;
		this.textValue = props.textValue;

		$effect(() => {
			const node = document.getElementById(this.#id.value);
			if (!node) return;
			this.content.itemRegister(node, this.value.value, this.disabled.value);
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
				onpointermove: this.#onpointermove,
				onpointerleave: this.#onpointerleave,
				onpointerdown: this.#onpointerdown,
				onpointerup: this.#onpointerup,
				onkeydown: this.#onkeydown,
				onfocus: this.#onfocus,
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
				const textNode = document.getElementById(this.#id.value);
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

export const [setSelectRootContext, getSelectRootContext] =
	createContext<SelectRootState>("Select.Root");

export const [setSelectTriggerContext] = createContext<SelectTriggerState>("Select.Trigger");

export const [setSelectContentImplContext, getSelectContentImplContext] =
	createContext<SelectContentImplState>("Select.Content");

export const [setSelectItemContext, getSelectItemContext] =
	createContext<SelectItemState>("Select.Item");

export function useSelectRoot(props: SelectRootStateProps) {
	return setSelectRootContext(new SelectRootState(props));
}

export function useSelectContent(props: SelectContentStateProps) {
	return getSelectRootContext().createContent(props);
}

export function useSelectContentImpl(props: SelectContentImplStateProps) {
	return setSelectContentImplContext(getSelectRootContext().createContentImpl(props));
}

export function useSelectTrigger(props: SelectTriggerStateProps) {
	return getSelectRootContext().createTrigger(props);
}

export function useSelectValue() {
	return getSelectRootContext().createValue();
}

export function useSelectItem(props: SelectItemStateProps) {
	return setSelectItemContext(getSelectContentImplContext().createItem(props));
}

export function useSelectItemText(props: SelectItemTextStateProps) {
	return getSelectItemContext().createText(props);
}

//

export function shouldShowPlaceholder(value?: string) {
	return value === "" || value === undefined;
}
