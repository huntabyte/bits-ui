import { box } from "svelte-toolbelt";
import { tick, untrack } from "svelte";
import { IsFocusWithin } from "runed";
import type { InteractOutsideEvent } from "../utilities/dismissable-layer/types.js"
import {
	FIRST_LAST_KEYS,
	type GraceIntent,
	LAST_KEYS,
	SELECTION_KEYS,
	SUB_OPEN_KEYS,
	type Side,
	getCheckedState,
	isMouseEvent,
} from "./utils.js";
import { focusFirst } from "$lib/internal/focus.js";
import type { ReadableBoxedValues, WritableBoxedValues } from "$lib/internal/box.svelte.js";
import { addEventListener } from "$lib/internal/events.js";
import type { AnyFn, WithRefProps } from "$lib/internal/types.js";
import { executeCallbacks } from "$lib/internal/executeCallbacks.js";
import { useTypeahead } from "$lib/internal/useTypeahead.svelte.js";
import { isElement, isElementOrSVGElement, isHTMLElement } from "$lib/internal/is.js";
import { useRovingFocus } from "$lib/internal/useRovingFocus.svelte.js";
import { kbd } from "$lib/internal/kbd.js";
import {
	getAriaChecked,
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
import { useRefById } from "$lib/internal/useRefById.svelte.js";
import { isPointerInGraceArea, makeHullFromElements } from "$lib/internal/polygon.js";
import { onDestroyEffect } from "$lib/internal/onDestroyEffect.svelte.js";

const TRIGGER_ATTR = "data-menu-trigger";
const CONTENT_ATTR = "data-menu-content";
const ITEM_ATTR = "data-menu-item";
const SEPARATOR_ATTR = "data-menu-separator";
const SUB_TRIGGER_ATTR = "data-menu-sub-trigger";
const CHECKBOX_ITEM_ATTR = "data-menu-checkbox-item";
const GROUP_ATTR = "data-menu-group";
const LABEL_ATTR = "data-menu-label";
const RADIO_GROUP_ATTR = "data-menu-radio-group";
const RADIO_ITEM_ATTR = "data-menu-radio-item";
const ARROW_ATTR = "data-menu-arrow";
export const CONTEXT_MENU_TRIGGER_ATTR = "data-context-menu-trigger";

const [setMenuRootContext] = createContext<MenuRootState>("Menu.Root");

const [setMenuMenuContext, getMenuMenuContext] = createContext<MenuMenuState>(
	["Menu.Root", "Menu.Sub"],
	"MenuContext"
);

const [setMenuContentContext, getMenuContentContext] =
	createContext<MenuContentState>("Menu.Content");

const [setMenuGroupContext, getMenuGroupContext] = createContext<
	MenuGroupState | MenuRadioGroupState
>("Menu.Group");

const [setMenuRadioGroupContext, getMenuRadioGroupContext] =
	createContext<MenuRadioGroupState>("Menu.RadioGroup");

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
				this.isUsingKeyboard.current = false;
			};

			const handleKeydown = (_: KeyboardEvent) => {
				this.isUsingKeyboard.current = true;

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
	contentId = box.with<string>(() => "");
	contentNode = $state<HTMLElement | null>(null);
	triggerNode = $state<HTMLElement | null>(null);
	parentMenu?: MenuMenuState;

	constructor(props: MenuMenuStateProps, root: MenuRootState, parentMenu?: MenuMenuState) {
		this.root = root;
		this.open = props.open;
		this.parentMenu = parentMenu;

		if (parentMenu) {
			$effect(() => {
				parentMenu.open;
				untrack(() => {
					if (!this.parentMenu?.open) this.open.current = false;
				});
			});
		}
	}

	toggleOpen() {
		this.open.current = !this.open.current;
	}

	onOpen() {
		this.open.current = true;
	}

	onClose() {
		this.open.current = false;
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

	createContextTrigger(props: ContextMenuTriggerStateProps) {
		return new ContextMenuTriggerState(props, this);
	}
}

type MenuContentStateProps = ReadableBoxedValues<{
	id: string;
	loop: boolean;
	isMounted: boolean;
}> &
	WritableBoxedValues<{
		ref: HTMLElement | null;
	}>;

class MenuContentState {
	#id: MenuContentStateProps["id"];
	contentRef: MenuContentStateProps["ref"];
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
	isMounted: MenuContentStateProps["isMounted"];
	isFocusWithin = new IsFocusWithin(() => this.parentMenu.contentNode ?? undefined);

	constructor(props: MenuContentStateProps, parentMenu: MenuMenuState) {
		this.#id = props.id;
		this.#loop = props.loop;
		this.parentMenu = parentMenu;
		this.parentMenu.contentId = props.id;
		this.contentRef = props.ref;
		this.isMounted = props.isMounted;

		useRefById({
			id: this.#id,
			ref: this.contentRef,
			condition: () => this.parentMenu.open.current,
			onRefChange: (node) => {
				if (this.parentMenu.contentNode !== node) {
					this.parentMenu.contentNode = node;
				}
			},
		});

		onDestroyEffect(() => {
			window.clearTimeout(this.#timer);
		});

		this.#handleTypeaheadSearch = useTypeahead().handleTypeaheadSearch;
		this.rovingFocusGroup = useRovingFocus({
			rootNodeId: this.parentMenu.contentId,
			candidateSelector: ITEM_ATTR,
			loop: this.#loop,
			orientation: box.with(() => "vertical"),
		});
	}

	getCandidateNodes() {
		const node = this.parentMenu.contentNode;
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
			target.closest(`[${CONTENT_ATTR}]`)?.id === this.parentMenu.contentId.current;
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
		if ((e.target as HTMLElement)?.id !== this.parentMenu.contentId.current) return;

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
		if (!this.parentMenu.root.isUsingKeyboard.current) return;
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
		const contentNode = this.parentMenu.contentNode;
		contentNode?.focus();
		this.rovingFocusGroup.setCurrentTabStopId("");
	}

	onTriggerLeave(e: PointerEvent) {
		if (this.isPointerMovingToSubmenu(e)) return true;
		return false;
	}

	onMountAutoFocus(e: Event) {
		if (e.defaultPrevented) return;
		e.preventDefault();
		const contentNode = this.parentMenu.contentNode;
		contentNode?.focus();
	}

	handleInteractOutside = (e: InteractOutsideEvent) => {
		if (!isElementOrSVGElement(e.target)) return;
		const triggerId = this.parentMenu.triggerNode?.id
		if (e.target.id === triggerId) {
			e.preventDefault();
			return;
		}
		if (e.target.closest(`#${triggerId}`)) {
			e.preventDefault();
		}
	}

	props = $derived.by(
		() =>
			({
				id: this.#id.current,
				role: "menu",
				"aria-orientation": getAriaOrientation("vertical"),
				[CONTENT_ATTR]: "",
				"data-state": getDataOpenClosed(this.parentMenu.open.current),
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

	createCheckboxItem(
		props: MenuItemSharedStateProps & MenuItemStateProps & MenuCheckboxItemStateProps
	) {
		const item = new MenuItemState(props, new MenuItemSharedState(props, this));
		return new MenuCheckboxItemState(props, item);
	}

	createRadioGroup(props: MenuRadioGroupStateProps) {
		return new MenuRadioGroupState(props, this);
	}

	createSubTrigger(props: MenuItemSharedStateProps) {
		const item = new MenuItemSharedState(props, this);
		const submenu = getMenuMenuContext();
		return new MenuSubTriggerState(item, this, submenu);
	}
}

type MenuItemSharedStateProps = ReadableBoxedValues<{
	disabled: boolean;
	id: string;
}> &
	WritableBoxedValues<{
		ref: HTMLElement | null;
	}>;

class MenuItemSharedState {
	content: MenuContentState;
	ref: MenuItemSharedStateProps["ref"];
	id: MenuItemSharedStateProps["id"];
	disabled: MenuItemSharedStateProps["disabled"];
	#isFocused = $state(false);

	constructor(props: MenuItemSharedStateProps, content: MenuContentState) {
		this.content = content;
		this.id = props.id;
		this.disabled = props.disabled;
		this.ref = props.ref;

		useRefById({
			id: this.id,
			ref: this.ref,
			condition: () => this.content.isMounted.current,
		});
	}

	#onpointermove = (e: PointerEvent) => {
		if (e.defaultPrevented) return;
		if (!isMouseEvent(e)) return;

		if (this.disabled.current) {
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
			if (e.defaultPrevented || this.disabled.current) return;
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
				id: this.id.current,
				tabindex: -1,
				role: "menuitem",
				"aria-disabled": getAriaDisabled(this.disabled.current),
				"data-disabled": getDataDisabled(this.disabled.current),
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
		if (this.#item.disabled.current || (isTypingAhead && e.key === kbd.SPACE)) return;
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

	#handleSelect = async () => {
		if (this.#item.disabled.current) return;
		const selectEvent = new CustomEvent("menuitemselect", { bubbles: true, cancelable: true });
		this.#onSelect.current(selectEvent);
		await tick();
		if (selectEvent.defaultPrevented) {
			this.#item.content.parentMenu.root.isUsingKeyboard.current = false;
		} else {
			this.#item.content.parentMenu.root.onClose();
		}
	};

	#onclick = () => {
		if (this.#item.disabled.current) return;
		this.#handleSelect();
	};

	#onpointerup = async (e: PointerEvent) => {
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

		onDestroyEffect(() => {
			this.#clearOpenTimer();
		});

		useRefById({
			id: this.#item.id,
			ref: this.#item.ref,
			onRefChange: (node) => {
				this.#submenu.triggerNode = node;
			},
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
		if (!this.#item.disabled.current && !this.#submenu.open.current && !this.#openTimer) {
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

		const contentNode = this.#submenu.contentNode;
		const subTriggerNode = this.#item.ref.current;

		if (contentNode && subTriggerNode) {
			const polygon = makeHullFromElements([subTriggerNode, contentNode]);
			const side = contentNode?.dataset.side as Side;

			this.#content.onPointerGraceIntentChange({
				area: polygon,
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
		if (this.#item.disabled.current || (isTypingAhead && e.key === kbd.SPACE)) return;

		if (SUB_OPEN_KEYS[this.#submenu.root.dir.current].includes(e.key)) {
			this.#submenu.onOpen();

			const contentNode = this.#submenu.contentNode;

			contentNode?.focus();
			e.preventDefault();
		}
	};

	#onclick = (e: MouseEvent) => {
		if (this.#item.disabled.current) return;
		/**
		 * We manually focus because iOS Safari doesn't always focus on click (e.g. buttons)
		 * and we rely heavily on `onFocusOutside` for submenus to close when switching
		 * between separate submenus.
		 */
		if (!isHTMLElement(e.currentTarget)) return;
		e.currentTarget.focus();
		if (!this.#submenu.open.current) {
			this.#submenu.onOpen();
		}
	};

	props = $derived.by(() =>
		mergeProps(
			{
				"aria-haspopup": "menu",
				"aria-expanded": getAriaExpanded(this.#submenu.open.current),
				"data-state": getDataOpenClosed(this.#submenu.open.current),
				"aria-controls": this.#submenu.open.current
					? this.#submenu.contentId.current
					: undefined,
				[SUB_TRIGGER_ATTR]: "",
				onclick: this.#onclick,
				onpointermove: this.#onpointermove,
				onpointerleave: this.#onpointerleave,
				onkeydown: this.#onkeydown,
			},
			this.#item.props
		)
	);
}

type MenuCheckboxItemStateProps = WritableBoxedValues<{
	checked: boolean | "indeterminate";
}>;

class MenuCheckboxItemState {
	#item: MenuItemState;
	#checked: MenuCheckboxItemStateProps["checked"];

	constructor(props: MenuCheckboxItemStateProps, item: MenuItemState) {
		this.#item = item;
		this.#checked = props.checked;
	}

	toggleChecked() {
		if (this.#checked.current === true) {
			this.#checked.current = false;
		} else if (this.#checked.current === false) {
			this.#checked.current = true;
		} else if (this.#checked.current === "indeterminate") {
			this.#checked.current = true;
		}
	}

	props = $derived.by(
		() =>
			({
				...this.#item.props,
				role: "menuitemcheckbox",
				"aria-checked": getAriaChecked(this.#checked.current),
				"data-state": getCheckedState(this.#checked.current),
				[CHECKBOX_ITEM_ATTR]: "",
			}) as const
	);
}

type MenuGroupStateProps = WithRefProps;

class MenuGroupState {
	#id: MenuGroupStateProps["id"];
	#ref: MenuGroupStateProps["ref"];
	groupLabelId = $state<string | undefined>(undefined);

	constructor(props: MenuGroupStateProps) {
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
				"aria-labelledby": this.groupLabelId,
				[GROUP_ATTR]: "",
			}) as const
	);

	createGroupLabel(props: MenuGroupLabelStateProps) {
		return new MenuGroupLabelState(props, this);
	}
}

type MenuGroupLabelStateProps = WithRefProps;
class MenuGroupLabelState {
	#id: MenuGroupLabelStateProps["id"];
	#ref: MenuGroupLabelStateProps["ref"];
	#group: MenuGroupState | MenuRadioGroupState | undefined = undefined;

	constructor(props: MenuGroupLabelStateProps, group?: MenuGroupState | MenuRadioGroupState) {
		this.#id = props.id;
		this.#ref = props.ref;
		this.#group = group;

		useRefById({
			id: this.#id,
			ref: this.#ref,
			onRefChange: (node) => {
				if (!this.#group) return;
				this.#group.groupLabelId = node?.id;
			},
		});
	}

	props = $derived.by(
		() =>
			({
				id: this.#id.current,
				role: "group",
				[LABEL_ATTR]: "",
			}) as const
	);
}

type MenuSeparatorStateProps = WithRefProps;

class MenuSeparatorState {
	#id: MenuSeparatorStateProps["id"];
	#ref: MenuSeparatorStateProps["ref"];

	constructor(props: MenuSeparatorStateProps) {
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
				[SEPARATOR_ATTR]: "",
			}) as const
	);
}

class MenuArrowState {
	props = {
		[ARROW_ATTR]: "",
	} as const;
}

type MenuRadioGroupStateProps = WritableBoxedValues<{
	value: string;
	ref: HTMLElement | null;
}> &
	ReadableBoxedValues<{
		id: string;
	}>;

class MenuRadioGroupState {
	#id: MenuRadioGroupStateProps["id"];
	value: MenuRadioGroupStateProps["value"];
	#ref: MenuRadioGroupStateProps["ref"];
	#content: MenuContentState;
	groupLabelId = $state<string | null>(null);

	constructor(props: MenuRadioGroupStateProps, content: MenuContentState) {
		this.value = props.value;
		this.#id = props.id;
		this.#ref = props.ref;
		this.#content = content;

		useRefById({
			id: this.#id,
			ref: this.#ref,
		});
	}

	setValue(v: string) {
		this.value.current = v;
	}

	createRadioItem(
		props: MenuItemSharedStateProps & MenuItemStateProps & MenuRadioItemStateProps
	) {
		const item = this.#content.createItem(props);
		return new MenuRadioItemState(props, item, this);
	}

	createGroupLabel(props: MenuGroupLabelStateProps) {
		return new MenuGroupLabelState(props, this);
	}

	props = $derived.by(
		() =>
			({
				id: this.#id.current,
				[RADIO_GROUP_ATTR]: "",
				role: "group",
				"aria-labelledby": this.groupLabelId,
			}) as const
	);
}

type MenuRadioItemStateProps = ReadableBoxedValues<{
	value: string;
	id: string;
}> &
	WritableBoxedValues<{
		ref: HTMLElement | null;
	}>;

class MenuRadioItemState {
	#id: MenuRadioItemStateProps["id"];
	#ref: MenuRadioItemStateProps["ref"];
	#item: MenuItemState;
	#value: MenuRadioItemStateProps["value"];
	#group: MenuRadioGroupState;
	isChecked = $derived.by(() => this.#group.value.current === this.#value.current);

	constructor(props: MenuRadioItemStateProps, item: MenuItemState, group: MenuRadioGroupState) {
		this.#item = item;
		this.#id = props.id;
		this.#ref = props.ref;
		this.#group = group;
		this.#value = props.value;

		useRefById({
			id: this.#id,
			ref: this.#ref,
		});
	}

	selectValue() {
		this.#group.setValue(this.#value.current);
	}

	props = $derived.by(
		() =>
			({
				[RADIO_ITEM_ATTR]: "",
				...this.#item.props,
				role: "menuitemradio",
				"aria-checked": getAriaChecked(this.isChecked),
				"data-state": getCheckedState(this.isChecked),
			}) as const
	);
}

//
// DROPDOWN MENU TRIGGER
//

type DropdownMenuTriggerStateProps = ReadableBoxedValues<{
	id: string;
	disabled: boolean;
}> &
	WritableBoxedValues<{
		ref: HTMLElement | null;
	}>;

class DropdownMenuTriggerState {
	#id: DropdownMenuTriggerStateProps["id"];
	#ref: DropdownMenuTriggerStateProps["ref"];
	#parentMenu: MenuMenuState;
	#disabled: DropdownMenuTriggerStateProps["disabled"];

	constructor(props: DropdownMenuTriggerStateProps, parentMenu: MenuMenuState) {
		this.#ref = props.ref;
		this.#id = props.id;
		this.#parentMenu = parentMenu;
		this.#disabled = props.disabled;

		useRefById({
			id: this.#id,
			ref: this.#ref,
			onRefChange: (ref) => {
				this.#parentMenu.triggerNode = ref;
			},
		});
	}

	#onpointerdown = (e: PointerEvent) => {
		if (!this.#disabled.current && e.button === 0 && e.ctrlKey === false) {
			this.#parentMenu.toggleOpen();
			// prevent trigger focusing when opening to allow
			// the content to be given focus without competition
			if (!this.#parentMenu.open.current) e.preventDefault();
		}
	};

	#onkeydown = (e: KeyboardEvent) => {
		if (this.#disabled.current) return;
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
		if (this.#parentMenu.open.current && this.#parentMenu.contentId.current)
			return this.#parentMenu.contentId.current;
		return undefined;
	});

	props = $derived.by(
		() =>
			({
				id: this.#id.current,
				disabled: this.#disabled.current,
				"aria-haspopup": "menu",
				"aria-expanded": getAriaExpanded(this.#parentMenu.open.current),
				"aria-controls": this.#ariaControls,
				"data-disabled": getDataDisabled(this.#disabled.current),
				"data-state": getDataOpenClosed(this.#parentMenu.open.current),
				[TRIGGER_ATTR]: "",
				//
				onpointerdown: this.#onpointerdown,
				onkeydown: this.#onkeydown,
			}) as const
	);
}

type ContextMenuTriggerStateProps = ReadableBoxedValues<{
	id: string;
	disabled: boolean;
}> &
	WritableBoxedValues<{
		ref: HTMLElement | null;
	}>;

class ContextMenuTriggerState {
	#id: ContextMenuTriggerStateProps["id"];
	#ref: ContextMenuTriggerStateProps["ref"];
	#parentMenu: MenuMenuState;
	#disabled: ContextMenuTriggerStateProps["disabled"];
	#point = $state({ x: 0, y: 0 });

	virtualElement = box({
		getBoundingClientRect: () => DOMRect.fromRect({ width: 0, height: 0, ...this.#point }),
	});

	#longPressTimer = $state<number | null>(null);

	constructor(props: ContextMenuTriggerStateProps, parentMenu: MenuMenuState) {
		this.#parentMenu = parentMenu;
		this.#disabled = props.disabled;
		this.#id = props.id;
		this.#ref = props.ref;

		useRefById({
			id: this.#id,
			ref: this.#ref,
			onRefChange: (node) => {
				this.#parentMenu.triggerNode = node;
			},
			condition: () => this.#parentMenu.open.current,
		});

		$effect(() => {
			this.#point;
			this.virtualElement.current = {
				getBoundingClientRect: () =>
					DOMRect.fromRect({ width: 0, height: 0, ...this.#point }),
			};
		});

		$effect(() => {
			if (this.#disabled.current) {
				this.#clearLongPressTimer();
			}
		});

		$effect(() => {
			return () => {
				this.#clearLongPressTimer();
			};
		});
	}

	#clearLongPressTimer() {
		if (this.#longPressTimer === null) return;
		window.clearTimeout(this.#longPressTimer);
	}

	#handleOpen = (e: MouseEvent | PointerEvent) => {
		this.#point = { x: e.clientX, y: e.clientY };
		this.#parentMenu.onOpen();
	};

	#oncontextmenu = (e: MouseEvent) => {
		if (this.#disabled.current) return;
		this.#clearLongPressTimer();
		this.#handleOpen(e);
		e.preventDefault();
		this.#parentMenu.contentNode?.focus();
	};

	#onpointerdown = (e: PointerEvent) => {
		if (this.#disabled.current || isMouseEvent(e)) return;
		this.#clearLongPressTimer();
		this.#longPressTimer = window.setTimeout(() => this.#handleOpen(e), 700);
	};

	#onpointermove = (e: PointerEvent) => {
		if (this.#disabled.current || isMouseEvent(e)) return;
		this.#clearLongPressTimer();
	};

	#onpointercancel = (e: PointerEvent) => {
		if (this.#disabled.current || isMouseEvent(e)) return;
		this.#clearLongPressTimer();
	};

	#onpointerup = (e: PointerEvent) => {
		if (this.#disabled.current || isMouseEvent(e)) return;
		this.#clearLongPressTimer();
	};

	props = $derived.by(
		() =>
			({
				id: this.#id.current,
				disabled: this.#disabled.current,
				"data-disabled": getDataDisabled(this.#disabled.current),
				"data-state": getDataOpenClosed(this.#parentMenu.open.current),
				[TRIGGER_ATTR]: "",
				[CONTEXT_MENU_TRIGGER_ATTR]: "",
				//
				onpointerdown: this.#onpointerdown,
				onpointermove: this.#onpointermove,
				onpointercancel: this.#onpointercancel,
				onpointerup: this.#onpointerup,
				oncontextmenu: this.#oncontextmenu,
			}) as const
	);
}

type MenuItemCombinedProps = MenuItemSharedStateProps & MenuItemStateProps;

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

export function useMenuPortal() {
	return getMenuMenuContext();
}

export function useMenuContextTrigger(props: ContextMenuTriggerStateProps) {
	return getMenuMenuContext().createContextTrigger(props);
}

export function useMenuContent(props: MenuContentStateProps) {
	return setMenuContentContext(getMenuMenuContext().createContent(props));
}

export function useMenuItem(props: MenuItemCombinedProps) {
	return getMenuContentContext().createItem(props);
}

export function useMenuCheckboxItem(props: MenuItemCombinedProps & MenuCheckboxItemStateProps) {
	return getMenuContentContext().createCheckboxItem(props);
}

export function useMenuRadioGroup(props: MenuRadioGroupStateProps) {
	return setMenuGroupContext(
		setMenuRadioGroupContext(getMenuContentContext().createRadioGroup(props))
	);
}

export function useMenuRadioItem(props: MenuRadioItemStateProps & MenuItemCombinedProps) {
	return getMenuRadioGroupContext().createRadioItem(props);
}

export function useMenuGroup(props: MenuGroupStateProps) {
	return setMenuGroupContext(new MenuGroupState(props));
}

export function useMenuGroupLabel(props: MenuGroupLabelStateProps) {
	const groupCtx = getMenuGroupContext(null);
	if (!groupCtx) return new MenuGroupLabelState(props);
	return groupCtx.createGroupLabel(props);
}

export function useMenuSeparator(props: MenuSeparatorStateProps) {
	return new MenuSeparatorState(props);
}

export function useMenuArrow() {
	return new MenuArrowState();
}
