import { type WritableBox, box } from "runed";
import { tick } from "svelte";
import { focusFirst } from "../utilities/focus-scope/utils.js";
import {
	FIRST_LAST_KEYS,
	type GraceIntent,
	LAST_KEYS,
	SELECTION_KEYS,
	type Side,
	isMouseEvent,
	isPointerInGraceArea,
} from "./utils.js";
import type { Box, ReadableBoxedValues, WritableBoxedValues } from "$lib/internal/box.svelte.js";
import { addEventListener } from "$lib/internal/events.js";
import type { AnyFn } from "$lib/internal/types.js";
import { executeCallbacks } from "$lib/internal/callbacks.js";
import { useNodeById } from "$lib/internal/useNodeById.svelte.js";
import { useTypeahead } from "$lib/internal/useTypeahead.svelte.js";
import { onDestroyEffect } from "$lib/internal/onDestroyEffect.svelte.js";
import { isElementOrSVGElement, isHTMLElement } from "$lib/internal/is.js";
import { useRovingFocus } from "$lib/internal/useRovingFocus.svelte.js";
import { kbd } from "$lib/internal/kbd.js";
import {
	getAriaDisabled,
	getAriaExpanded,
	getAriaOrientation,
	getDataDisabled,
	getDataOpenClosed,
} from "$lib/internal/attrs.js";
import { mergeProps } from "$lib/internal/mergeProps.js";
import { createContext } from "$lib/internal/createContext.js";

const TRIGGER_ATTR = "data-menu-trigger";
const CONTENT_ATTR = "data-menu-content";
const ITEM_ATTR = "data-menu-item";

export type MenuRootStateProps = WritableBoxedValues<{
	open: boolean;
}>;

class MenuRootState {
	open: MenuRootStateProps["open"];
	contentId = box.with<string | undefined>(() => undefined);
	triggerId = box.with<string | undefined>(() => undefined);
	isUsingKeyboard = box(false);

	constructor(props: MenuRootStateProps) {
		this.open = props.open;

		$effect(() => {
			const callbacksToDispose: AnyFn[] = [];

			const handlePointer = (_: PointerEvent) => {
				this.isUsingKeyboard.value = false;
			};

			const handleKeydown = (_: KeyboardEvent) => {
				this.isUsingKeyboard.value = true;

				const disposePointerDown = addEventListener(
					document,
					"pointerdown",
					handlePointer,
					{ capture: true, once: true }
				);
				const disposePointerMove = addEventListener(
					document,
					"pointermove",
					handlePointer,
					{ capture: true, once: true }
				);

				callbacksToDispose.push(disposePointerDown, disposePointerMove);
			};

			const disposeKeydown = addEventListener(document, "keydown", handleKeydown, {
				capture: true,
			});
			callbacksToDispose.push(disposeKeydown);

			return () => {
				executeCallbacks(callbacksToDispose);
			};
		});
	}

	onClose() {
		this.open.value = false;
	}

	onOpen() {
		this.open.value = true;
	}

	toggleOpen() {
		this.open.value = !this.open.value;
	}

	createContent(props: MenuContentStateProps) {
		return new MenuContentState(props, this);
	}

	createDropdownTrigger(props: DropdownMenuTriggerStateProps) {
		return new DropdownMenuTriggerState(props, this);
	}
}

type MenuContentStateProps = ReadableBoxedValues<{
	id: string;
	loop: boolean;
}>;

class MenuContentState {
	root: MenuRootState;
	search = $state("");
	#node: WritableBox<HTMLElement | null> = box(null);
	#loop: MenuContentStateProps["loop"];
	#timer = $state(0);
	pointerGraceTimer = $state(0);
	#pointerGraceIntent = $state<GraceIntent | null>(null);
	#pointerDir = $state<Side>("right");
	#lastPointerX = $state(0);
	#handleTypeaheadSearch: ReturnType<typeof useTypeahead>["handleTypeaheadSearch"];
	rovingFocusGroup: ReturnType<typeof useRovingFocus>;

	constructor(props: MenuContentStateProps, root: MenuRootState) {
		this.root = root;
		this.root.contentId = props.id;
		this.#loop = props.loop;
		this.#node = useNodeById(props.id);

		onDestroyEffect(() => {
			window.clearTimeout(this.#timer);
		});

		this.#handleTypeaheadSearch = useTypeahead().handleTypeaheadSearch;
		this.rovingFocusGroup = useRovingFocus({
			rootNode: this.#node,
			candidateSelector: ITEM_ATTR,
			loop: this.#loop,
			orientation: box.with(() => "vertical"),
		});
	}

	getCandidateNodes() {
		const node = this.#node.value;
		if (!node) return [];
		return Array.from(
			node.querySelectorAll<HTMLElement>(`[${ITEM_ATTR}]:not([data-disabled])`)
		);
	}

	isPointerMovingToSubmenu(e: PointerEvent) {
		const isMovingTowards = this.#pointerDir === this.#pointerGraceIntent?.side;

		return isMovingTowards && isPointerInGraceArea(e, this.#pointerGraceIntent?.area);
	}

	#onkeydown = (e: KeyboardEvent) => {
		if (e.defaultPrevented) return;

		const target = e.target;
		if (!isElementOrSVGElement(target)) return;

		const isKeydownInside = target.closest(CONTENT_ATTR) === e.currentTarget;
		const isModifierKey = e.ctrlKey || e.altKey || e.metaKey;
		const isCharacterKey = e.key.length === 1;

		const kbdFocusedEl = this.rovingFocusGroup.handleKeydown(this.#node.value, e);
		if (kbdFocusedEl) return;

		// prevent space from being considered with typeahead
		if (e.code === "Space") return;

		if (isKeydownInside) {
			// menus do not respect the tab key
			if (e.key === kbd.TAB) e.preventDefault();
			if (!isModifierKey && isCharacterKey) {
				this.#handleTypeaheadSearch(e.key, this.getCandidateNodes());
			}
		}

		// focus first/last based on key pressed
		if (e.target !== this.#node.value) return;

		if (!FIRST_LAST_KEYS.includes(e.key)) return;
		e.preventDefault();

		const candidateNodes = this.getCandidateNodes();
		if (LAST_KEYS.includes(e.key)) {
			candidateNodes.reverse();
		}
		focusFirst(candidateNodes);
	};

	#onblur = (e: FocusEvent) => {
		if (!isElementOrSVGElement(e.currentTarget)) return;
		if (!isElementOrSVGElement(e.target)) return;
		// clear search buffer when leaving the menu
		if (!e.currentTarget.contains?.(e.target)) {
			window.clearTimeout(this.#timer);
			this.search = "";
		}
	};

	#onpointermove = (e: PointerEvent) => {
		if (!isMouseEvent(e)) return;
		const target = e.target;
		if (!isElementOrSVGElement(target)) return;
		const pointerXHasChanged = this.#lastPointerX !== e.clientX;
		const currTarget = e.currentTarget;
		if (!isElementOrSVGElement(currTarget)) return;

		// We don't use `event.movementX` for this check because Safari will
		// always return `0` on a pointer event.
		if ((e?.currentTarget as HTMLElement)?.contains(target) && pointerXHasChanged) {
			const newDir = e.clientX > this.#lastPointerX ? "right" : "left";
			this.#pointerDir = newDir;
			this.#lastPointerX = e.clientX;
		}
	};

	onItemEnter(e: PointerEvent) {
		if (this.isPointerMovingToSubmenu(e)) return true;
		return false;
	}

	onItemLeave(e: PointerEvent) {
		if (this.isPointerMovingToSubmenu(e)) return;
		this.#node.value?.focus();
		this.rovingFocusGroup.setCurrentTabStopId("");
	}

	onTriggerLeave(e: PointerEvent) {
		if (this.isPointerMovingToSubmenu(e)) return true;
		return false;
	}

	props = $derived.by(() => ({
		role: "menu",
		"aria-orientation": getAriaOrientation("vertical"),
		[CONTENT_ATTR]: "",
		"data-state": getDataOpenClosed(this.root.open.value),
		onkeydown: this.#onkeydown,
		onblur: this.#onblur,
		onpointermove: this.#onpointermove,
	}));

	createItem(props: MenuItemSharedStateProps & MenuItemStateProps) {
		const item = new MenuItemSharedState(props, this);
		return new MenuItemState(props, item);
	}
}

type MenuItemSharedStateProps = ReadableBoxedValues<{
	disabled: boolean;
	id: string;
}>;

class MenuItemSharedState {
	content: MenuContentState;
	#id: MenuItemSharedStateProps["id"];
	disabled: MenuItemSharedStateProps["disabled"];
	#isFocused = $state(false);

	constructor(props: MenuItemSharedStateProps, content: MenuContentState) {
		this.content = content;
		this.#id = props.id;
		this.disabled = props.disabled;
	}

	#onpointermove = (e: PointerEvent) => {
		if (e.defaultPrevented) return;
		if (!isMouseEvent(e)) return;

		if (this.disabled.value) {
			this.content.onItemLeave(e);
		} else {
			const defaultPrevented = this.content.onItemEnter(e);
			if (defaultPrevented) return;
			const item = e.currentTarget;
			if (!isHTMLElement(item)) return;
			item.focus();
		}
	};

	#onpointerleave = async (e: PointerEvent) => {
		await tick();
		if (e.defaultPrevented) return;
		if (!isMouseEvent(e)) return;

		this.content.onItemLeave(e);
	};

	#onfocus = async (e: FocusEvent) => {
		await tick();
		if (e.defaultPrevented || this.disabled.value) return;
		this.#isFocused = true;
	};

	#onblur = async (e: FocusEvent) => {
		await tick();
		if (e.defaultPrevented) return;
		this.#isFocused = false;
	};

	props = $derived.by(
		() =>
			({
				id: this.#id.value,
				tabindex: -1,
				role: "menuitem",
				"aria-disabled": getAriaDisabled(this.disabled.value),
				"data-disabled": getDataDisabled(this.disabled.value),
				"data-highlighted": this.#isFocused ? "" : undefined,
				[ITEM_ATTR]: "",
				//
				onpointermove: this.#onpointermove,
				onpointerleave: this.#onpointerleave,
				onfocus: this.#onfocus,
				onblur: this.#onblur,
			}) as const
	);
}

type MenuItemStateProps = ReadableBoxedValues<{
	onSelect: AnyFn;
}>;

class MenuItemState {
	#item: MenuItemSharedState;
	#onSelect: MenuItemStateProps["onSelect"];
	#isPointerDown = $state(false);

	constructor(props: MenuItemStateProps, item: MenuItemSharedState) {
		this.#item = item;
		this.#onSelect = props.onSelect;
	}

	#onkeydown = (e: KeyboardEvent) => {
		const isTypingAhead = this.#item.content.search !== "";
		if (this.#item.disabled.value || (isTypingAhead && e.key === kbd.SPACE)) return;
		if (SELECTION_KEYS.includes(e.key)) {
			if (!isHTMLElement(e.currentTarget)) return;
			e.currentTarget.click();
			/**
			 * We prevent default browser behaviour for selection keys as they should trigger
			 * a selection only:
			 * - prevents space from scrolling the page.
			 * - if keydown causes focus to move, prevents keydown from firing on the new target.
			 */
			e.preventDefault();
		}
	};

	#onclick = () => {
		if (this.#item.disabled.value) return;
		this.#onSelect.value();
	};

	#onpointerup = async (e: PointerEvent) => {
		await tick();
		if (e.defaultPrevented) return;
		if (!this.#isPointerDown) {
			if (!isHTMLElement(e.currentTarget)) return;
			e.currentTarget?.click();
		}
	};

	#onpointerdown = () => {
		this.#isPointerDown = true;
	};

	props = $derived.by(() =>
		mergeProps(this.#item.props, {
			onclick: this.#onclick,
			onpointerdown: this.#onpointerdown,
			onpointerup: this.#onpointerup,
			onkeydown: this.#onkeydown,
		})
	);
}

type DropdownMenuTriggerStateProps = ReadableBoxedValues<{
	id: string;
	disabled: boolean;
}>;

class DropdownMenuTriggerState {
	#root: MenuRootState;
	#disabled: DropdownMenuTriggerStateProps["disabled"];
	constructor(props: DropdownMenuTriggerStateProps, root: MenuRootState) {
		this.#root = root;
		this.#disabled = props.disabled;
		this.#root.triggerId = props.id;
	}

	#onclick = async (e: MouseEvent) => {
		if (!this.#disabled.value && e.button === 0 && e.ctrlKey === false) {
			this.#root.toggleOpen();
			await tick();
			// prevent trigger focusing when opening
			// allowing the content to be given focus without competition
			if (this.#root.open.value) e.preventDefault();
		}
	};

	#onkeydown = (e: KeyboardEvent) => {
		if (this.#disabled.value) return;
		if (e.key === kbd.SPACE || e.key === kbd.ENTER) {
			this.#root.toggleOpen();
			e.preventDefault();
			return;
		}
		if (e.key === kbd.ARROW_DOWN) {
			this.#root.onOpen();
			e.preventDefault();
		}
	};

	props = $derived.by(
		() =>
			({
				id: this.#root.triggerId.value,
				disabled: this.#disabled.value,
				"aria-haspopup": "menu",
				"aria-expanded": getAriaExpanded(this.#root.open.value),
				"aria-controls": this.#root.open.value ? this.#root.contentId.value : undefined,
				"data-disabled": getDataDisabled(this.#disabled.value),
				"data-state": getDataOpenClosed(this.#root.open.value),
				[TRIGGER_ATTR]: "",
				//
				onclick: this.#onclick,
				onkeydown: this.#onkeydown,
			}) as const
	);
}

//
// CONTEXT METHODS
//

const [setMenuRootContext, getMenuRootContext] = createContext<MenuRootState>("Menu.Root");
const [setMenuContentContext, getMenuContentContext] =
	createContext<MenuContentState>("Menu.Content");

export function useMenuRoot(props: MenuRootStateProps) {
	return setMenuRootContext(new MenuRootState(props));
}

export function useMenuDropdownTrigger(props: DropdownMenuTriggerStateProps) {
	return getMenuRootContext().createDropdownTrigger(props);
}

export function useMenuContent(props: MenuContentStateProps) {
	return setMenuContentContext(getMenuRootContext().createContent(props));
}

export function useMenuItem(props: MenuItemSharedStateProps & MenuItemStateProps) {
	return getMenuContentContext().createItem(props);
}
