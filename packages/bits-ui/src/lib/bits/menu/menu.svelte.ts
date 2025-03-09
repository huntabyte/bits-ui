import { afterTick, box, mergeProps, onDestroyEffect, useRefById } from "svelte-toolbelt";
import { Context, watch } from "runed";
import {
	FIRST_LAST_KEYS,
	LAST_KEYS,
	SELECTION_KEYS,
	SUB_OPEN_KEYS,
	getCheckedState,
	isMouseEvent,
} from "./utils.js";
import { focusFirst } from "$lib/internal/focus.js";
import type { ReadableBoxedValues, WritableBoxedValues } from "$lib/internal/box.svelte.js";
import { CustomEventDispatcher } from "$lib/internal/events.js";
import type {
	AnyFn,
	BitsFocusEvent,
	BitsKeyboardEvent,
	BitsMouseEvent,
	BitsPointerEvent,
	WithRefProps,
} from "$lib/internal/types.js";
import { useDOMTypeahead } from "$lib/internal/use-dom-typeahead.svelte.js";
import { isElement, isElementOrSVGElement, isHTMLElement } from "$lib/internal/is.js";
import { useRovingFocus } from "$lib/internal/use-roving-focus.svelte.js";
import { kbd } from "$lib/internal/kbd.js";
import {
	getAriaChecked,
	getAriaDisabled,
	getAriaExpanded,
	getAriaOrientation,
	getDataDisabled,
	getDataOpenClosed,
} from "$lib/internal/attrs.js";
import type { Direction } from "$lib/shared/index.js";
import { IsUsingKeyboard } from "$lib/index.js";
import { useGraceArea } from "$lib/internal/use-grace-area.svelte.js";
import { getTabbableFrom } from "$lib/internal/tabbable.js";
import { FocusScopeContext } from "../utilities/focus-scope/use-focus-scope.svelte.js";
import { isTabbable } from "tabbable";

export const CONTEXT_MENU_TRIGGER_ATTR = "data-context-menu-trigger";

const MenuRootContext = new Context<MenuRootState>("Menu.Root");
const MenuMenuContext = new Context<MenuMenuState>("Menu.Root | Menu.Sub");
const MenuContentContext = new Context<MenuContentState>("Menu.Content");
const MenuGroupContext = new Context<MenuGroupState | MenuRadioGroupState>(
	"Menu.Group | Menu.RadioGroup"
);
const MenuRadioGroupContext = new Context<MenuRadioGroupState>("Menu.RadioGroup");

type MenuVariant = "context-menu" | "dropdown-menu" | "menubar";

export type MenuRootStateProps = ReadableBoxedValues<{
	dir: Direction;
	variant: MenuVariant;
}> & {
	onClose: AnyFn;
};

export const MenuOpenEvent = new CustomEventDispatcher("bitsmenuopen", {
	bubbles: false,
	cancelable: true,
});

class MenuRootState {
	isUsingKeyboard = new IsUsingKeyboard();
	ignoreCloseAutoFocus = $state(false);
	isPointerInTransit = $state(false);

	constructor(readonly opts: MenuRootStateProps) {}

	getAttr(name: string) {
		return `data-${this.opts.variant.current}-${name}`;
	}
}

type MenuMenuStateProps = WritableBoxedValues<{
	open: boolean;
}>;

class MenuMenuState {
	contentId = box.with<string>(() => "");
	contentNode = $state<HTMLElement | null>(null);
	triggerNode = $state<HTMLElement | null>(null);

	constructor(
		readonly opts: MenuMenuStateProps,
		readonly root: MenuRootState,
		readonly parentMenu: MenuMenuState | null
	) {
		if (parentMenu) {
			watch(
				() => parentMenu.opts.open.current,
				() => {
					if (parentMenu.opts.open.current) return;
					this.opts.open.current = false;
				}
			);
		}
	}

	toggleOpen() {
		this.opts.open.current = !this.opts.open.current;
	}

	onOpen() {
		this.opts.open.current = true;
	}

	onClose() {
		this.opts.open.current = false;
	}
}

type MenuContentStateProps = WithRefProps &
	ReadableBoxedValues<{
		loop: boolean;
		onCloseAutoFocus: (event: Event) => void;
	}> & {
		isSub?: boolean;
	};

class MenuContentState {
	search = $state("");
	#timer = 0;
	#handleTypeaheadSearch: ReturnType<typeof useDOMTypeahead>["handleTypeaheadSearch"];
	rovingFocusGroup: ReturnType<typeof useRovingFocus>;
	mounted = $state(false);
	#isSub: boolean;

	constructor(
		readonly opts: MenuContentStateProps,
		readonly parentMenu: MenuMenuState
	) {
		parentMenu.contentId = opts.id;

		this.#isSub = opts.isSub ?? false;
		this.onkeydown = this.onkeydown.bind(this);
		this.onblur = this.onblur.bind(this);
		this.onfocus = this.onfocus.bind(this);
		this.handleInteractOutside = this.handleInteractOutside.bind(this);

		useRefById({
			...opts,
			deps: () => this.parentMenu.opts.open.current,
			onRefChange: (node) => {
				if (this.parentMenu.contentNode !== node) {
					this.parentMenu.contentNode = node;
				}
			},
		});

		useGraceArea({
			contentNode: () => this.parentMenu.contentNode,
			triggerNode: () => this.parentMenu.triggerNode,
			enabled: () =>
				this.parentMenu.opts.open.current &&
				Boolean(
					this.parentMenu.triggerNode?.hasAttribute(
						this.parentMenu.root.getAttr("sub-trigger")
					)
				),
			onPointerExit: () => {
				this.parentMenu.opts.open.current = false;
			},
			setIsPointerInTransit: (value) => {
				this.parentMenu.root.isPointerInTransit = value;
			},
		});

		this.#handleTypeaheadSearch = useDOMTypeahead().handleTypeaheadSearch;
		this.rovingFocusGroup = useRovingFocus({
			rootNodeId: this.parentMenu.contentId,
			candidateAttr: this.parentMenu.root.getAttr("item"),
			loop: this.opts.loop,
			orientation: box.with(() => "vertical"),
		});

		watch(
			() => this.parentMenu.contentNode,
			(contentNode) => {
				if (!contentNode) return;
				const handler = () => {
					afterTick(() => {
						if (!this.parentMenu.root.isUsingKeyboard.current) return;
						this.rovingFocusGroup.focusFirstCandidate();
					});
				};
				return MenuOpenEvent.listen(contentNode, handler);
			}
		);

		$effect(() => {
			if (!this.parentMenu.opts.open.current) {
				window.clearTimeout(this.#timer);
			}
		});
	}

	#getCandidateNodes() {
		const node = this.parentMenu.contentNode;
		if (!node) return [];
		const candidates = Array.from(
			node.querySelectorAll<HTMLElement>(
				`[${this.parentMenu.root.getAttr("item")}]:not([data-disabled])`
			)
		);
		return candidates;
	}

	#isPointerMovingToSubmenu() {
		return this.parentMenu.root.isPointerInTransit;
	}

	onCloseAutoFocus = (e: Event) => {
		this.opts.onCloseAutoFocus.current(e);
		if (e.defaultPrevented || this.#isSub) return;
		if (this.parentMenu.triggerNode && isTabbable(this.parentMenu.triggerNode)) {
			this.parentMenu.triggerNode.focus();
		}
	};

	handleTabKeyDown(e: BitsKeyboardEvent) {
		/**
		 * We locate the root `menu`'s trigger by going up the tree until
		 * we find a menu that has no parent. This will allow us to focus the next
		 * tabbable element before/after the root trigger.
		 */
		let rootMenu = this.parentMenu;
		while (rootMenu.parentMenu !== null) {
			rootMenu = rootMenu.parentMenu;
		}
		// if for some unforeseen reason the root menu has no trigger, we bail
		if (!rootMenu.triggerNode) return;

		// cancel default tab behavior
		e.preventDefault();

		// find the next/previous tabbable
		const nodeToFocus = getTabbableFrom(rootMenu.triggerNode, e.shiftKey ? "prev" : "next");
		if (nodeToFocus) {
			/**
			 * We set a flag to ignore the `onCloseAutoFocus` event handler
			 * as well as the fallbacks inside the focus scope to prevent
			 * race conditions causing focus to fall back to the body even
			 * though we're trying to focus the next tabbable element.
			 */
			this.parentMenu.root.ignoreCloseAutoFocus = true;
			rootMenu.onClose();
			nodeToFocus.focus();
			afterTick(() => {
				this.parentMenu.root.ignoreCloseAutoFocus = false;
			});
		} else {
			document.body.focus();
		}
	}

	onkeydown(e: BitsKeyboardEvent) {
		if (e.defaultPrevented) return;
		if (e.key === kbd.TAB) {
			this.handleTabKeyDown(e);
			return;
		}

		const target = e.target;
		const currentTarget = e.currentTarget;
		if (!isHTMLElement(target) || !isHTMLElement(currentTarget)) return;

		const isKeydownInside =
			target.closest(`[${this.parentMenu.root.getAttr("content")}]`)?.id ===
			this.parentMenu.contentId.current;

		const isModifierKey = e.ctrlKey || e.altKey || e.metaKey;
		const isCharacterKey = e.key.length === 1;

		const kbdFocusedEl = this.rovingFocusGroup.handleKeydown(target, e);
		if (kbdFocusedEl) return;

		// prevent space from being considered with typeahead
		if (e.code === "Space") return;

		const candidateNodes = this.#getCandidateNodes();

		if (isKeydownInside) {
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
	}

	onblur(e: BitsFocusEvent) {
		if (!isElement(e.currentTarget)) return;
		if (!isElement(e.target)) return;
		// clear search buffer when leaving the menu
		if (!e.currentTarget.contains?.(e.target)) {
			window.clearTimeout(this.#timer);
			this.search = "";
		}
	}

	onfocus(_: BitsFocusEvent) {
		if (!this.parentMenu.root.isUsingKeyboard.current) return;
		afterTick(() => this.rovingFocusGroup.focusFirstCandidate());
	}

	onItemEnter() {
		return this.#isPointerMovingToSubmenu();
	}

	onItemLeave(e: BitsPointerEvent) {
		if (e.currentTarget.hasAttribute(this.parentMenu.root.getAttr("sub-trigger"))) return;
		if (this.#isPointerMovingToSubmenu() || this.parentMenu.root.isUsingKeyboard.current)
			return;
		const contentNode = this.parentMenu.contentNode;
		contentNode?.focus();
		this.rovingFocusGroup.setCurrentTabStopId("");
	}

	onTriggerLeave() {
		if (this.#isPointerMovingToSubmenu()) return true;
		return false;
	}

	onOpenAutoFocus = (e: Event) => {
		if (e.defaultPrevented) return;
		e.preventDefault();
		const contentNode = this.parentMenu.contentNode;
		contentNode?.focus();
	};

	handleInteractOutside(e: PointerEvent) {
		if (!isElementOrSVGElement(e.target)) return;
		const triggerId = this.parentMenu.triggerNode?.id;
		if (e.target.id === triggerId) {
			e.preventDefault();
			return;
		}
		if (e.target.closest(`#${triggerId}`)) {
			e.preventDefault();
		}
	}

	snippetProps = $derived.by(() => ({ open: this.parentMenu.opts.open.current }));

	props = $derived.by(
		() =>
			({
				id: this.opts.id.current,
				role: "menu",
				"aria-orientation": getAriaOrientation("vertical"),
				[this.parentMenu.root.getAttr("content")]: "",
				"data-state": getDataOpenClosed(this.parentMenu.opts.open.current),
				onkeydown: this.onkeydown,
				onblur: this.onblur,
				onfocus: this.onfocus,
				dir: this.parentMenu.root.opts.dir.current,
				style: {
					pointerEvents: "auto",
				},
			}) as const
	);

	popperProps = {
		onCloseAutoFocus: (e: Event) => this.onCloseAutoFocus(e),
	};
}

type MenuItemSharedStateProps = WithRefProps &
	ReadableBoxedValues<{
		disabled: boolean;
	}>;

class MenuItemSharedState {
	#isFocused = $state(false);

	constructor(
		readonly opts: MenuItemSharedStateProps,
		readonly content: MenuContentState
	) {
		this.onpointermove = this.onpointermove.bind(this);
		this.onpointerleave = this.onpointerleave.bind(this);
		this.onfocus = this.onfocus.bind(this);
		this.onblur = this.onblur.bind(this);

		useRefById({
			...opts,
			deps: () => this.content.mounted,
		});
	}

	onpointermove(e: BitsPointerEvent) {
		if (e.defaultPrevented) return;
		if (!isMouseEvent(e)) return;

		if (this.opts.disabled.current) {
			this.content.onItemLeave(e);
		} else {
			const defaultPrevented = this.content.onItemEnter();
			if (defaultPrevented) return;
			const item = e.currentTarget;
			if (!isHTMLElement(item)) return;
			item.focus();
		}
	}

	onpointerleave(e: BitsPointerEvent) {
		if (e.defaultPrevented) return;
		if (!isMouseEvent(e)) return;
		this.content.onItemLeave(e);
	}

	onfocus(e: BitsFocusEvent) {
		afterTick(() => {
			if (e.defaultPrevented || this.opts.disabled.current) return;
			this.#isFocused = true;
		});
	}

	onblur(e: BitsFocusEvent) {
		afterTick(() => {
			if (e.defaultPrevented) return;
			this.#isFocused = false;
		});
	}

	props = $derived.by(
		() =>
			({
				id: this.opts.id.current,
				tabindex: -1,
				role: "menuitem",
				"aria-disabled": getAriaDisabled(this.opts.disabled.current),
				"data-disabled": getDataDisabled(this.opts.disabled.current),
				"data-highlighted": this.#isFocused ? "" : undefined,
				[this.content.parentMenu.root.getAttr("item")]: "",
				//
				onpointermove: this.onpointermove,
				onpointerleave: this.onpointerleave,
				onfocus: this.onfocus,
				onblur: this.onblur,
			}) as const
	);
}

type MenuItemStateProps = ReadableBoxedValues<{
	onSelect: AnyFn;
	closeOnSelect: boolean;
}>;

class MenuItemState {
	#isPointerDown = false;
	root: MenuRootState;

	constructor(
		readonly opts: MenuItemStateProps,
		readonly item: MenuItemSharedState
	) {
		this.root = item.content.parentMenu.root;

		this.onkeydown = this.onkeydown.bind(this);
		this.onclick = this.onclick.bind(this);
		this.onpointerdown = this.onpointerdown.bind(this);
		this.onpointerup = this.onpointerup.bind(this);
	}

	#handleSelect() {
		if (this.item.opts.disabled.current) return;
		const selectEvent = new CustomEvent("menuitemselect", { bubbles: true, cancelable: true });
		this.opts.onSelect.current(selectEvent);
		afterTick(() => {
			if (selectEvent.defaultPrevented) {
				this.item.content.parentMenu.root.isUsingKeyboard.current = false;
				return;
			}
			if (this.opts.closeOnSelect.current) {
				this.item.content.parentMenu.root.opts.onClose();
			}
		});
	}

	onkeydown(e: BitsKeyboardEvent) {
		const isTypingAhead = this.item.content.search !== "";
		if (this.item.opts.disabled.current || (isTypingAhead && e.key === kbd.SPACE)) return;
		if (SELECTION_KEYS.includes(e.key)) {
			if (!isHTMLElement(e.currentTarget)) return;
			e.currentTarget.click();
			/**
			 * We prevent default browser behavior for selection keys as they should trigger
			 * a selection only:
			 * - prevents space from scrolling the page.
			 * - if keydown causes focus to move, prevents keydown from firing on the new target.
			 */
			e.preventDefault();
		}
	}

	onclick(_: BitsMouseEvent) {
		if (this.item.opts.disabled.current) return;
		this.#handleSelect();
	}

	onpointerup(e: BitsPointerEvent) {
		if (e.defaultPrevented) return;
		if (!this.#isPointerDown) {
			if (!isHTMLElement(e.currentTarget)) return;
			e.currentTarget?.click();
		}
	}

	onpointerdown(_: BitsPointerEvent) {
		this.#isPointerDown = true;
	}

	props = $derived.by(() =>
		mergeProps(this.item.props, {
			onclick: this.onclick,
			onpointerdown: this.onpointerdown,
			onpointerup: this.onpointerup,
			onkeydown: this.onkeydown,
		})
	);
}

class MenuSubTriggerState {
	#openTimer: number | null = null;

	constructor(
		readonly item: MenuItemSharedState,
		readonly content: MenuContentState,
		readonly submenu: MenuMenuState
	) {
		this.onpointerleave = this.onpointerleave.bind(this);
		this.onpointermove = this.onpointermove.bind(this);
		this.onkeydown = this.onkeydown.bind(this);
		this.onclick = this.onclick.bind(this);

		onDestroyEffect(() => {
			this.#clearOpenTimer();
		});

		useRefById({
			...item.opts,
			onRefChange: (node) => {
				this.submenu.triggerNode = node;
			},
		});
	}

	#clearOpenTimer() {
		if (this.#openTimer === null) return;
		window.clearTimeout(this.#openTimer);
		this.#openTimer = null;
	}

	onpointermove(e: BitsPointerEvent) {
		if (!isMouseEvent(e)) return;

		if (
			!this.item.opts.disabled.current &&
			!this.submenu.opts.open.current &&
			!this.#openTimer &&
			!this.content.parentMenu.root.isPointerInTransit
		) {
			this.#openTimer = window.setTimeout(() => {
				this.submenu.onOpen();
				this.#clearOpenTimer();
			}, 100);
		}
	}

	onpointerleave(e: BitsPointerEvent) {
		if (!isMouseEvent(e)) return;
		this.#clearOpenTimer();
	}

	onkeydown(e: BitsKeyboardEvent) {
		const isTypingAhead = this.content.search !== "";
		if (this.item.opts.disabled.current || (isTypingAhead && e.key === kbd.SPACE)) return;

		if (SUB_OPEN_KEYS[this.submenu.root.opts.dir.current].includes(e.key)) {
			this.submenu.onOpen();
			afterTick(() => {
				const contentNode = this.submenu.contentNode;
				if (!contentNode) return;
				MenuOpenEvent.dispatch(contentNode);
			});
			e.preventDefault();
		}
	}

	onclick(e: BitsMouseEvent) {
		if (this.item.opts.disabled.current) return;
		/**
		 * We manually focus because iOS Safari doesn't always focus on click (e.g. buttons)
		 * and we rely heavily on `onFocusOutside` for submenus to close when switching
		 * between separate submenus.
		 */
		if (!isHTMLElement(e.currentTarget)) return;
		e.currentTarget.focus();
		if (!this.submenu.opts.open.current) {
			this.submenu.onOpen();
		}
	}

	props = $derived.by(() =>
		mergeProps(
			{
				"aria-haspopup": "menu",
				"aria-expanded": getAriaExpanded(this.submenu.opts.open.current),
				"data-state": getDataOpenClosed(this.submenu.opts.open.current),
				"aria-controls": this.submenu.opts.open.current
					? this.submenu.contentId.current
					: undefined,
				[this.submenu.root.getAttr("sub-trigger")]: "",
				onclick: this.onclick,
				onpointermove: this.onpointermove,
				onpointerleave: this.onpointerleave,
				onkeydown: this.onkeydown,
			},
			this.item.props
		)
	);
}

type MenuCheckboxItemStateProps = WritableBoxedValues<{
	checked: boolean;
	indeterminate: boolean;
}>;

class MenuCheckboxItemState {
	constructor(
		readonly opts: MenuCheckboxItemStateProps,
		readonly item: MenuItemState
	) {}

	toggleChecked() {
		if (this.opts.indeterminate.current) {
			this.opts.indeterminate.current = false;
			this.opts.checked.current = true;
		} else {
			this.opts.checked.current = !this.opts.checked.current;
		}
	}

	snippetProps = $derived.by(() => ({
		checked: this.opts.checked.current,
		indeterminate: this.opts.indeterminate.current,
	}));

	props = $derived.by(
		() =>
			({
				...this.item.props,
				role: "menuitemcheckbox",
				"aria-checked": getAriaChecked(
					this.opts.checked.current,
					this.opts.indeterminate.current
				),
				"data-state": getCheckedState(this.opts.checked.current),
				[this.item.root.getAttr("checkbox-item")]: "",
			}) as const
	);
}

type MenuGroupStateProps = WithRefProps;

class MenuGroupState {
	groupHeadingId = $state<string | undefined>(undefined);

	constructor(
		readonly opts: MenuGroupStateProps,
		readonly root: MenuRootState
	) {
		useRefById(this.opts);
	}

	props = $derived.by(
		() =>
			({
				id: this.opts.id.current,
				role: "group",
				"aria-labelledby": this.groupHeadingId,
				[this.root.getAttr("group")]: "",
			}) as const
	);
}

type MenuGroupHeadingStateProps = WithRefProps;
class MenuGroupHeadingState {
	constructor(
		readonly opts: MenuGroupHeadingStateProps,
		readonly group: MenuGroupState | MenuRadioGroupState
	) {
		useRefById({
			...opts,
			onRefChange: (node) => {
				this.group.groupHeadingId = node?.id;
			},
		});
	}

	props = $derived.by(
		() =>
			({
				id: this.opts.id.current,
				role: "group",
				[this.group.root.getAttr("group-heading")]: "",
			}) as const
	);
}

type MenuSeparatorStateProps = WithRefProps;

class MenuSeparatorState {
	constructor(
		readonly opts: MenuSeparatorStateProps,
		readonly root: MenuRootState
	) {
		useRefById(opts);
	}

	props = $derived.by(
		() =>
			({
				id: this.opts.id.current,
				role: "group",
				[this.root.getAttr("separator")]: "",
			}) as const
	);
}

class MenuArrowState {
	constructor(readonly root: MenuRootState) {}

	props = $derived.by(
		() =>
			({
				[this.root.getAttr("arrow")]: "",
			}) as const
	);
}

type MenuRadioGroupStateProps = WithRefProps &
	WritableBoxedValues<{
		value: string;
	}>;

class MenuRadioGroupState {
	groupHeadingId = $state<string | null>(null);
	root: MenuRootState;

	constructor(
		readonly opts: MenuRadioGroupStateProps,
		readonly content: MenuContentState
	) {
		this.content = content;
		this.root = content.parentMenu.root;

		useRefById(opts);
	}

	setValue(v: string) {
		this.opts.value.current = v;
	}

	props = $derived.by(
		() =>
			({
				id: this.opts.id.current,
				[this.root.getAttr("radio-group")]: "",
				role: "group",
				"aria-labelledby": this.groupHeadingId,
			}) as const
	);
}

type MenuRadioItemStateProps = WithRefProps &
	ReadableBoxedValues<{
		value: string;
		closeOnSelect: boolean;
	}>;

class MenuRadioItemState {
	isChecked = $derived.by(() => this.group.opts.value.current === this.opts.value.current);

	constructor(
		readonly opts: MenuRadioItemStateProps,
		readonly item: MenuItemState,
		readonly group: MenuRadioGroupState
	) {
		useRefById(opts);
	}

	selectValue() {
		this.group.setValue(this.opts.value.current);
	}

	props = $derived.by(
		() =>
			({
				[this.group.root.getAttr("radio-item")]: "",
				...this.item.props,
				role: "menuitemradio",
				"aria-checked": getAriaChecked(this.isChecked, false),
				"data-state": getCheckedState(this.isChecked),
			}) as const
	);
}

//
// DROPDOWN MENU TRIGGER
//

type DropdownMenuTriggerStateProps = WithRefProps &
	ReadableBoxedValues<{
		disabled: boolean;
	}>;

class DropdownMenuTriggerState {
	constructor(
		readonly opts: DropdownMenuTriggerStateProps,
		readonly parentMenu: MenuMenuState
	) {
		this.onpointerdown = this.onpointerdown.bind(this);
		this.onpointerup = this.onpointerup.bind(this);
		this.onkeydown = this.onkeydown.bind(this);

		useRefById({
			...opts,
			onRefChange: (ref) => {
				this.parentMenu.triggerNode = ref;
			},
		});
	}

	onpointerdown(e: BitsPointerEvent) {
		if (this.opts.disabled.current) return;
		if (e.pointerType === "touch") return e.preventDefault();

		if (e.button === 0 && e.ctrlKey === false) {
			this.parentMenu.toggleOpen();
			// prevent trigger focusing when opening to allow
			// the content to be given focus without competition
			if (!this.parentMenu.opts.open.current) e.preventDefault();
		}
	}

	onpointerup(e: BitsPointerEvent) {
		if (this.opts.disabled.current) return;
		if (e.pointerType === "touch") {
			e.preventDefault();
			this.parentMenu.toggleOpen();
		}
	}

	onkeydown(e: BitsKeyboardEvent) {
		if (this.opts.disabled.current) return;
		if (e.key === kbd.SPACE || e.key === kbd.ENTER) {
			this.parentMenu.toggleOpen();
			e.preventDefault();
			return;
		}
		if (e.key === kbd.ARROW_DOWN) {
			this.parentMenu.onOpen();
			e.preventDefault();
		}
	}

	#ariaControls = $derived.by(() => {
		if (this.parentMenu.opts.open.current && this.parentMenu.contentId.current)
			return this.parentMenu.contentId.current;
		return undefined;
	});

	props = $derived.by(
		() =>
			({
				id: this.opts.id.current,
				disabled: this.opts.disabled.current,
				"aria-haspopup": "menu",
				"aria-expanded": getAriaExpanded(this.parentMenu.opts.open.current),
				"aria-controls": this.#ariaControls,
				"data-disabled": getDataDisabled(this.opts.disabled.current),
				"data-state": getDataOpenClosed(this.parentMenu.opts.open.current),
				[this.parentMenu.root.getAttr("trigger")]: "",
				//
				onpointerdown: this.onpointerdown,
				onpointerup: this.onpointerup,
				onkeydown: this.onkeydown,
			}) as const
	);
}

type ContextMenuTriggerStateProps = WithRefProps &
	ReadableBoxedValues<{
		disabled: boolean;
	}>;

class ContextMenuTriggerState {
	#point = $state({ x: 0, y: 0 });

	virtualElement = box({
		getBoundingClientRect: () => DOMRect.fromRect({ width: 0, height: 0, ...this.#point }),
	});
	#longPressTimer: number | null = null;

	constructor(
		readonly opts: ContextMenuTriggerStateProps,
		readonly parentMenu: MenuMenuState
	) {
		this.oncontextmenu = this.oncontextmenu.bind(this);
		this.onpointerdown = this.onpointerdown.bind(this);
		this.onpointermove = this.onpointermove.bind(this);
		this.onpointercancel = this.onpointercancel.bind(this);
		this.onpointerup = this.onpointerup.bind(this);

		useRefById({
			...opts,
			onRefChange: (node) => {
				this.parentMenu.triggerNode = node;
			},
			deps: () => this.parentMenu.opts.open.current,
		});

		watch(
			() => this.#point,
			(point) => {
				this.virtualElement.current = {
					getBoundingClientRect: () =>
						DOMRect.fromRect({ width: 0, height: 0, ...point }),
				};
			}
		);

		$effect(() => {
			if (this.opts.disabled.current) {
				this.#clearLongPressTimer();
			}
		});

		onDestroyEffect(() => this.#clearLongPressTimer());
	}

	#clearLongPressTimer() {
		if (this.#longPressTimer === null) return;
		window.clearTimeout(this.#longPressTimer);
	}

	#handleOpen(e: BitsMouseEvent | BitsPointerEvent) {
		this.#point = { x: e.clientX, y: e.clientY };
		this.parentMenu.onOpen();
	}

	oncontextmenu(e: BitsMouseEvent) {
		if (this.opts.disabled.current) return;
		this.#clearLongPressTimer();
		this.#handleOpen(e);
		e.preventDefault();
		this.parentMenu.contentNode?.focus();
	}

	onpointerdown(e: BitsPointerEvent) {
		if (this.opts.disabled.current || isMouseEvent(e)) return;
		this.#clearLongPressTimer();
		this.#longPressTimer = window.setTimeout(() => this.#handleOpen(e), 700);
	}

	onpointermove(e: BitsPointerEvent) {
		if (this.opts.disabled.current || isMouseEvent(e)) return;
		this.#clearLongPressTimer();
	}

	onpointercancel(e: BitsPointerEvent) {
		if (this.opts.disabled.current || isMouseEvent(e)) return;
		this.#clearLongPressTimer();
	}

	onpointerup(e: BitsPointerEvent) {
		if (this.opts.disabled.current || isMouseEvent(e)) return;
		this.#clearLongPressTimer();
	}

	props = $derived.by(
		() =>
			({
				id: this.opts.id.current,
				disabled: this.opts.disabled.current,
				"data-disabled": getDataDisabled(this.opts.disabled.current),
				"data-state": getDataOpenClosed(this.parentMenu.opts.open.current),
				[CONTEXT_MENU_TRIGGER_ATTR]: "",
				tabindex: -1,
				//
				onpointerdown: this.onpointerdown,
				onpointermove: this.onpointermove,
				onpointercancel: this.onpointercancel,
				onpointerup: this.onpointerup,
				oncontextmenu: this.oncontextmenu,
			}) as const
	);
}

type MenuItemCombinedProps = MenuItemSharedStateProps & MenuItemStateProps;

export function useMenuRoot(props: MenuRootStateProps) {
	const root = new MenuRootState(props);
	FocusScopeContext.set({
		get ignoreCloseAutoFocus() {
			return root.ignoreCloseAutoFocus;
		},
	});
	return MenuRootContext.set(root);
}

export function useMenuMenu(root: MenuRootState, props: MenuMenuStateProps) {
	return MenuMenuContext.set(new MenuMenuState(props, root, null));
}

export function useMenuSubmenu(props: MenuMenuStateProps) {
	const menu = MenuMenuContext.get();
	return MenuMenuContext.set(new MenuMenuState(props, menu.root, menu));
}

export function useMenuSubTrigger(props: MenuItemSharedStateProps) {
	const content = MenuContentContext.get();
	const item = new MenuItemSharedState(props, content);
	const submenu = MenuMenuContext.get();
	return new MenuSubTriggerState(item, content, submenu);
}

export function useMenuDropdownTrigger(props: DropdownMenuTriggerStateProps) {
	return new DropdownMenuTriggerState(props, MenuMenuContext.get());
}

export function useMenuContextTrigger(props: ContextMenuTriggerStateProps) {
	return new ContextMenuTriggerState(props, MenuMenuContext.get());
}

export function useMenuContent(props: MenuContentStateProps) {
	return MenuContentContext.set(new MenuContentState(props, MenuMenuContext.get()));
}

export function useMenuItem(props: MenuItemCombinedProps) {
	const item = new MenuItemSharedState(props, MenuContentContext.get());
	return new MenuItemState(props, item);
}

export function useMenuCheckboxItem(props: MenuItemCombinedProps & MenuCheckboxItemStateProps) {
	const item = new MenuItemState(props, new MenuItemSharedState(props, MenuContentContext.get()));
	return new MenuCheckboxItemState(props, item);
}

export function useMenuRadioGroup(props: MenuRadioGroupStateProps) {
	return MenuGroupContext.set(
		MenuRadioGroupContext.set(new MenuRadioGroupState(props, MenuContentContext.get()))
	);
}

export function useMenuRadioItem(props: MenuRadioItemStateProps & MenuItemCombinedProps) {
	const radioGroup = MenuRadioGroupContext.get();
	const sharedItem = new MenuItemSharedState(props, radioGroup.content);
	const item = new MenuItemState(props, sharedItem);
	return new MenuRadioItemState(props, item, radioGroup);
}

export function useMenuGroup(props: MenuGroupStateProps) {
	return MenuGroupContext.set(new MenuGroupState(props, MenuRootContext.get()));
}

export function useMenuGroupHeading(props: MenuGroupHeadingStateProps) {
	return new MenuGroupHeadingState(props, MenuGroupContext.get());
}

export function useMenuSeparator(props: MenuSeparatorStateProps) {
	return new MenuSeparatorState(props, MenuRootContext.get());
}

export function useMenuArrow() {
	return new MenuArrowState(MenuRootContext.get());
}
