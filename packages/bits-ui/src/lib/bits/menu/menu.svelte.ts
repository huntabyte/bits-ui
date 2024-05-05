import { box } from "runed";
import { focusFirst } from "../utilities/focus-scope/utils.js";
import {
	FIRST_LAST_KEYS,
	type GraceIntent,
	LAST_KEYS,
	SELECTION_KEYS,
	SUB_OPEN_KEYS,
	type Side,
	isMouseEvent,
	isPointerInGraceArea,
} from "./utils.js";
import {
	type ReadableBoxedValues,
	type WritableBoxedValues,
	watch,
} from "$lib/internal/box.svelte.js";
import { addEventListener } from "$lib/internal/events.js";
import type { AnyFn } from "$lib/internal/types.js";
import { executeCallbacks } from "$lib/internal/callbacks.js";
import { useNodeById } from "$lib/internal/useNodeById.svelte.js";
import { useTypeahead } from "$lib/internal/useTypeahead.svelte.js";
import { onDestroyEffect } from "$lib/internal/onDestroyEffect.svelte.js";
import { isElement, isHTMLElement } from "$lib/internal/is.js";
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
import type { Direction } from "$lib/shared/index.js";
import { afterTick } from "$lib/internal/afterTick.js";

const TRIGGER_ATTR = "data-menu-trigger";
const CONTENT_ATTR = "data-menu-content";
const ITEM_ATTR = "data-menu-item";
const SUB_TRIGGER_ATTR = "data-menu-subtrigger";

const [setMenuRootContext] = createContext<MenuRootState>("Menu.Root");

const [setMenuMenuContext, getMenuMenuContext] = createContext<MenuMenuState>(
	["Menu.Root", "Menu.Sub"],
	"MenuContext"
);

const [setMenuContentContext, getMenuContentContext] =
	createContext<MenuContentState>("Menu.Content");

export type MenuRootStateProps = ReadableBoxedValues<{
	dir: Direction;
}> & {
	onClose: AnyFn;
};

class MenuRootState {
	onClose: MenuRootStateProps["onClose"];
	isUsingKeyboard = box(false);
	dir: MenuRootStateProps["dir"];

	constructor(props: MenuRootStateProps) {
		this.onClose = props.onClose;
		this.dir = props.dir;

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

	createMenu(props: MenuMenuStateProps) {
		return new MenuMenuState(props, this);
	}
}

type MenuMenuStateProps = WritableBoxedValues<{
	open: boolean;
}>;

class MenuMenuState {
	root: MenuRootState;
	open: MenuMenuStateProps["open"];
	contentNode = box<HTMLElement | null>(null);
	triggerId = box.with<string | undefined>(() => undefined);
	parentMenu?: MenuMenuState;

	constructor(props: MenuMenuStateProps, root: MenuRootState, parentMenu?: MenuMenuState) {
		this.root = root;
		this.open = props.open;
		this.parentMenu = parentMenu;

		if (parentMenu) {
			watch(parentMenu.open, (v) => {
				if (!v) this.open.value = false;
			});
		}
	}

	toggleOpen() {
		this.open.value = !this.open.value;
	}

	onOpen() {
		this.open.value = true;
	}

	onClose() {
		this.open.value = false;
	}

	createContent(props: MenuContentStateProps) {
		return new MenuContentState(props, this);
	}

	createSubmenu(props: MenuMenuStateProps) {
		return new MenuMenuState(props, this.root, this);
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
	#id: MenuContentStateProps["id"];
	parentMenu: MenuMenuState;
	search = $state("");
	#loop: MenuContentStateProps["loop"];
	#timer = $state(0);
	pointerGraceTimer = $state(0);
	#pointerGraceIntent = $state<GraceIntent | null>(null);
	#pointerDir = $state<Side>("right");
	#lastPointerX = $state(0);
	#handleTypeaheadSearch: ReturnType<typeof useTypeahead>["handleTypeaheadSearch"];
	rovingFocusGroup: ReturnType<typeof useRovingFocus>;

	constructor(props: MenuContentStateProps, parentMenu: MenuMenuState) {
		this.#id = props.id;
		this.#loop = props.loop;
		this.parentMenu = parentMenu;
		this.parentMenu.contentNode = useNodeById(this.#id, this.parentMenu.open);

		onDestroyEffect(() => {
			window.clearTimeout(this.#timer);
		});

		this.#handleTypeaheadSearch = useTypeahead().handleTypeaheadSearch;
		this.rovingFocusGroup = useRovingFocus({
			rootNode: this.parentMenu.contentNode,
			candidateSelector: ITEM_ATTR,
			loop: this.#loop,
			orientation: box.with(() => "vertical"),
		});
	}

	getCandidateNodes() {
		const node = this.parentMenu.contentNode.value;
		if (!node) return [];
		const candidates = Array.from(
			node.querySelectorAll<HTMLElement>(`[${ITEM_ATTR}]:not([data-disabled])`)
		);
		return candidates;
	}

	isPointerMovingToSubmenu(e: PointerEvent) {
		const isMovingTowards = this.#pointerDir === this.#pointerGraceIntent?.side;
		return isMovingTowards && isPointerInGraceArea(e, this.#pointerGraceIntent?.area);
	}

	onPointerGraceIntentChange(intent: GraceIntent | null) {
		this.#pointerGraceIntent = intent;
	}

	#onkeydown = (e: KeyboardEvent) => {
		if (e.defaultPrevented) return;

		const target = e.target;
		const currentTarget = e.currentTarget;
		if (!isHTMLElement(target) || !isHTMLElement(currentTarget)) return;

		const isKeydownInside =
			target.closest(`[${CONTENT_ATTR}]`) === this.parentMenu.contentNode.value;
		const isModifierKey = e.ctrlKey || e.altKey || e.metaKey;
		const isCharacterKey = e.key.length === 1;

		const kbdFocusedEl = this.rovingFocusGroup.handleKeydown(target, e);
		if (kbdFocusedEl) return;

		// prevent space from being considered with typeahead
		if (e.code === "Space") return;

		const candidateNodes = this.getCandidateNodes();

		if (isKeydownInside) {
			// menus do not respect the tab key
			if (e.key === kbd.TAB) e.preventDefault();
			if (!isModifierKey && isCharacterKey) {
				this.#handleTypeaheadSearch(e.key, candidateNodes);
			}
		}

		// focus first/last based on key pressed
		if (e.target !== this.parentMenu.contentNode.value) return;

		if (!FIRST_LAST_KEYS.includes(e.key)) return;
		e.preventDefault();

		if (LAST_KEYS.includes(e.key)) {
			candidateNodes.reverse();
		}
		focusFirst(candidateNodes);
	};

	#onblur = (e: FocusEvent) => {
		if (!isElement(e.currentTarget)) return;
		if (!isElement(e.target)) return;
		// clear search buffer when leaving the menu
		if (!e.currentTarget.contains?.(e.target)) {
			window.clearTimeout(this.#timer);
			this.search = "";
		}
	};

	#onfocus = () => {
		if (!this.parentMenu.root.isUsingKeyboard.value) return;

		afterTick(() => this.rovingFocusGroup.focusFirstCandidate());
	};

	#onpointermove = (e: PointerEvent) => {
		if (!isMouseEvent(e)) return;
		const target = e.target;
		if (!isElement(target)) return;
		const pointerXHasChanged = this.#lastPointerX !== e.clientX;
		const currentTarget = e.currentTarget;
		if (!isElement(currentTarget)) return;

		// We don't use `event.movementX` for this check because Safari will
		// always return `0` on a pointer event.
		if (currentTarget.contains(target) && pointerXHasChanged) {
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
		this.parentMenu.contentNode.value?.focus();
		this.rovingFocusGroup.setCurrentTabStopId("");
	}

	onTriggerLeave(e: PointerEvent) {
		if (this.isPointerMovingToSubmenu(e)) return true;
		return false;
	}

	onMountAutoFocus(e: Event) {
		if (e.defaultPrevented) return;
		e.preventDefault();
		afterTick(() => {
			this.parentMenu.contentNode.value?.focus();
		});
	}

	props = $derived.by(
		() =>
			({
				id: this.#id.value,
				role: "menu",
				"aria-orientation": getAriaOrientation("vertical"),
				[CONTENT_ATTR]: "",
				"data-state": getDataOpenClosed(this.parentMenu.open.value),
				onkeydown: this.#onkeydown,
				onblur: this.#onblur,
				onpointermove: this.#onpointermove,
				onfocus: this.#onfocus,
			}) as const
	);

	createItem(props: MenuItemSharedStateProps & MenuItemStateProps) {
		const item = new MenuItemSharedState(props, this);
		return new MenuItemState(props, item);
	}

	createSubTrigger(props: MenuItemSharedStateProps) {
		const item = new MenuItemSharedState(props, this);
		const submenu = getMenuMenuContext();
		submenu.triggerId = props.id;
		return new MenuSubTriggerState(item, this, submenu);
	}
}

type MenuItemSharedStateProps = ReadableBoxedValues<{
	disabled: boolean;
	id: string;
}>;

class MenuItemSharedState {
	content: MenuContentState;
	id: MenuItemSharedStateProps["id"];
	disabled: MenuItemSharedStateProps["disabled"];
	#isFocused = $state(false);

	constructor(props: MenuItemSharedStateProps, content: MenuContentState) {
		this.content = content;
		this.id = props.id;
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
		afterTick(() => {
			if (e.defaultPrevented) return;
			if (!isMouseEvent(e)) return;
			this.content.onItemLeave(e);
		});
	};

	#onfocus = async (e: FocusEvent) => {
		afterTick(() => {
			if (e.defaultPrevented || this.disabled.value) return;
			this.#isFocused = true;
		});
	};

	#onblur = async (e: FocusEvent) => {
		afterTick(() => {
			if (e.defaultPrevented) return;
			this.#isFocused = false;
		});
	};

	props = $derived.by(
		() =>
			({
				id: this.id.value,
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

	#onclick = (e: MouseEvent) => {
		if (this.#item.disabled.value) return;
		this.#onSelect.value(e);
	};

	#onpointerup = async (e: PointerEvent) => {
		afterTick(() => {
			if (e.defaultPrevented) return;
			if (!this.#isPointerDown) {
				if (!isHTMLElement(e.currentTarget)) return;
				e.currentTarget?.click();
			}
		});
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

class MenuSubTriggerState {
	#item: MenuItemSharedState;
	// The menu this subtrigger item belongs within
	#content: MenuContentState;
	// the menu this subtrigger item opens
	#submenu: MenuMenuState;
	#openTimer = $state<number | null>(null);

	constructor(item: MenuItemSharedState, content: MenuContentState, submenu: MenuMenuState) {
		this.#item = item;
		this.#content = content;
		this.#submenu = submenu;
		this.#submenu.triggerId = item.id;

		onDestroyEffect(() => {
			this.#clearOpenTimer();
		});
	}

	#clearOpenTimer() {
		if (this.#openTimer === null) return;
		window.clearTimeout(this.#openTimer);
		this.#openTimer = null;
	}

	#onpointermove = (e: PointerEvent) => {
		if (!isMouseEvent(e)) return;
		const defaultPrevented = this.#content.onItemEnter(e);
		if (defaultPrevented) return;
		if (!this.#item.disabled.value && !this.#submenu.open.value && !this.#openTimer) {
			this.#content.onPointerGraceIntentChange(null);
			this.#openTimer = window.setTimeout(() => {
				this.#submenu.onOpen();
				this.#clearOpenTimer();
			}, 100);
		}
	};

	#onpointerleave = (e: PointerEvent) => {
		if (!isMouseEvent(e)) return;
		this.#clearOpenTimer();

		const contentRect = this.#submenu.contentNode.value?.getBoundingClientRect();
		if (contentRect?.width) {
			const side = this.#submenu.contentNode.value?.dataset.side as Side;

			const rightSide = side === "right";
			const bleed = rightSide ? -5 : +5;
			const contentNearEdge = contentRect[rightSide ? "left" : "right"];
			const contentFarEdge = contentRect[rightSide ? "right" : "left"];

			this.#content.onPointerGraceIntentChange({
				area: [
					// Apply a bleed on clientX to ensure that our exit point is
					// consistently within polygon bounds
					{ x: e.clientX + bleed, y: e.clientY },
					{ x: contentNearEdge, y: contentRect.top },
					{ x: contentFarEdge, y: contentRect.top },
					{ x: contentFarEdge, y: contentRect.bottom },
					{ x: contentNearEdge, y: contentRect.bottom },
				],
				side,
			});

			window.clearTimeout(this.#content.pointerGraceTimer);
			this.#content.pointerGraceTimer = window.setTimeout(
				() => this.#content.onPointerGraceIntentChange(null),
				300
			);
		} else {
			const defaultPrevented = this.#content.onTriggerLeave(e);
			if (defaultPrevented) return;

			// There's 100ms where the user may leave an item before the submenu was opened.
			this.#content.onPointerGraceIntentChange(null);
		}
	};

	#onkeydown = (e: KeyboardEvent) => {
		const isTypingAhead = this.#content.search !== "";
		if (this.#item.disabled.value || (isTypingAhead && e.key === kbd.SPACE)) return;

		if (SUB_OPEN_KEYS[this.#submenu.root.dir.value].includes(e.key)) {
			this.#submenu.onOpen();

			afterTick(() => {
				this.#submenu.contentNode.value?.focus();
				e.preventDefault();
			});
		}
	};

	#onclick = (e: MouseEvent) => {
		if (this.#item.disabled.value) return;
		/**
		 * We manually focus because iOS Safari doesn't always focus on click (e.g. buttons)
		 * and we rely heavily on `onFocusOutside` for submenus to close when switching
		 * between separate submenus.
		 */
		if (!isHTMLElement(e.currentTarget)) return;
		e.currentTarget.focus();
		if (!this.#submenu.open.value) {
			this.#submenu.onOpen();
		}
	};

	props = $derived.by(() =>
		mergeProps(this.#item.props, {
			"aria-haspopup": "menu",
			"aria-expanded": getAriaExpanded(this.#submenu.open.value),
			"data-state": getDataOpenClosed(this.#submenu.open.value),
			"aria-controls": this.#submenu.open.value
				? this.#submenu.contentNode.value?.id
				: undefined,
			[SUB_TRIGGER_ATTR]: "",
			onclick: this.#onclick,
			onpointermove: this.#onpointermove,
			onpointerleave: this.#onpointerleave,
			onkeydown: this.#onkeydown,
		})
	);
}

type DropdownMenuTriggerStateProps = ReadableBoxedValues<{
	id: string;
	disabled: boolean;
}>;

class DropdownMenuTriggerState {
	#parentMenu: MenuMenuState;
	#disabled: DropdownMenuTriggerStateProps["disabled"];
	constructor(props: DropdownMenuTriggerStateProps, parentMenu: MenuMenuState) {
		this.#parentMenu = parentMenu;
		this.#disabled = props.disabled;
		this.#parentMenu.triggerId = props.id;
	}

	#onclick = async (e: MouseEvent) => {
		if (!this.#disabled.value && e.button === 0 && e.ctrlKey === false) {
			this.#parentMenu.toggleOpen();
			// prevent trigger focusing when opening
			// allowing the content to be given focus without competition
			if (this.#parentMenu.open.value) e.preventDefault();
		}
	};

	#onkeydown = (e: KeyboardEvent) => {
		if (this.#disabled.value) return;
		if (e.key === kbd.SPACE || e.key === kbd.ENTER) {
			this.#parentMenu.toggleOpen();
			e.preventDefault();
			return;
		}
		if (e.key === kbd.ARROW_DOWN) {
			this.#parentMenu.onOpen();
			e.preventDefault();
		}
	};

	#ariaControls = $derived.by(() => {
		if (this.#parentMenu.open.value && this.#parentMenu.contentNode.value)
			return this.#parentMenu.contentNode.value.id;
		return undefined;
	});

	props = $derived.by(
		() =>
			({
				id: this.#parentMenu.triggerId.value,
				disabled: this.#disabled.value,
				"aria-haspopup": "menu",
				"aria-expanded": getAriaExpanded(this.#parentMenu.open.value),
				"aria-controls": this.#ariaControls,
				"data-disabled": getDataDisabled(this.#disabled.value),
				"data-state": getDataOpenClosed(this.#parentMenu.open.value),
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

export function useMenuRoot(props: MenuRootStateProps) {
	return setMenuRootContext(new MenuRootState(props));
}

export function useMenuMenu(root: MenuRootState, props: MenuMenuStateProps) {
	return setMenuMenuContext(root.createMenu(props));
}

export function useMenuSubmenu(props: MenuMenuStateProps) {
	return setMenuMenuContext(getMenuMenuContext().createSubmenu(props));
}

export function useMenuSubTrigger(props: MenuItemSharedStateProps) {
	return getMenuContentContext().createSubTrigger(props);
}

export function useMenuDropdownTrigger(props: DropdownMenuTriggerStateProps) {
	return getMenuMenuContext().createDropdownTrigger(props);
}

export function useMenuContent(props: MenuContentStateProps) {
	return setMenuContentContext(getMenuMenuContext().createContent(props));
}

export function useMenuItem(props: MenuItemSharedStateProps & MenuItemStateProps) {
	return getMenuContentContext().createItem(props);
}
