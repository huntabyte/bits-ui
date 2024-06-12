import { box } from "svelte-toolbelt";
import { untrack } from "svelte";
import type { InteractOutsideEvent } from "@melt-ui/svelte";
import type { InteractOutsideBehaviorType } from "../utilities/dismissable-layer/types.js";
import type { ReadableBoxedValues, WritableBoxedValues } from "$lib/internal/box.svelte.js";
import { type UseRovingFocusReturn, useRovingFocus } from "$lib/internal/useRovingFocus.svelte.js";
import type { Direction } from "$lib/shared/index.js";
import { createContext } from "$lib/internal/createContext.js";
import { getAriaExpanded, getDataDisabled, getDataOpenClosed } from "$lib/internal/attrs.js";
import { kbd } from "$lib/internal/kbd.js";
import { wrapArray } from "$lib/internal/useTypeahead.svelte.js";
import { isBrowser } from "$lib/internal/is.js";

const ROOT_ATTR = "data-menubar-root";
const TRIGGER_ATTR = "data-menubar-trigger";

type MenubarRootStateProps = ReadableBoxedValues<{
	id: string;
	dir: Direction;
	loop: boolean;
	ref: HTMLElement | null | undefined;
}> &
	WritableBoxedValues<{
		value: string;
	}>;

class MenubarRootState {
	id: MenubarRootStateProps["id"];
	value: MenubarRootStateProps["value"];
	dir: MenubarRootStateProps["dir"];
	loop: MenubarRootStateProps["loop"];
	rovingFocusGroup: UseRovingFocusReturn;
	currentTabStopId = box<string | null>(null);
	wasOpenedByKeyboard = $state(false);
	ref: MenubarRootStateProps["ref"];

	constructor(props: MenubarRootStateProps) {
		this.value = props.value;
		this.ref = props.ref;
		this.dir = props.dir;
		this.loop = props.loop;
		this.id = props.id;
		this.rovingFocusGroup = useRovingFocus({
			rootNodeRef: this.ref,
			candidateSelector: TRIGGER_ATTR,
			loop: this.loop,
			orientation: box.with(() => "horizontal"),
			currentTabStopId: this.currentTabStopId,
		});
	}

	getNode() {
		return document.getElementById(this.id.value);
	}

	getTriggers() {
		const node = this.getNode();
		if (!node) return [];
		return Array.from(node.querySelectorAll<HTMLButtonElement>(`[${TRIGGER_ATTR}]`));
	}

	onMenuOpen(id: string) {
		this.value.value = id;
		this.currentTabStopId.value = id;
	}

	onMenuClose() {
		this.value.value = "";
	}

	onMenuToggle(id: string) {
		this.value.value = this.value.value ? "" : id;
	}

	createMenu(props: MenubarMenuStateProps) {
		return new MenubarMenuState(props, this);
	}

	props = $derived.by(
		() =>
			({
				id: this.id.value,
				role: "menubar",
				[ROOT_ATTR]: "",
			}) as const
	);
}

type MenubarMenuStateProps = ReadableBoxedValues<{
	value: string;
}>;

class MenubarMenuState {
	root: MenubarRootState;
	value: MenubarMenuStateProps["value"];
	open = $derived.by(() => this.root.value.value === this.value.value);
	wasOpenedByKeyboard = $state(false);
	triggerId = box.with(() => "");
	contentId = box.with(() => "");

	constructor(props: MenubarMenuStateProps, root: MenubarRootState) {
		this.value = props.value;
		this.root = root;

		$effect(() => {
			if (!this.open) {
				untrack(() => {
					this.wasOpenedByKeyboard = false;
				});
			}
		});
	}

	createTrigger(props: MenubarTriggerStateProps) {
		return new MenubarTriggerState(props, this);
	}

	createContent(props: MenubarContentStateProps) {
		return new MenubarContentState(props, this);
	}

	getTriggerNode() {
		if (!isBrowser) return null;
		return document.getElementById(this.triggerId.value);
	}

	getContentNode() {
		return document.getElementById(this.contentId.value);
	}
}

type MenubarTriggerStateProps = ReadableBoxedValues<{
	id: string;
	disabled: boolean;
}>;

class MenubarTriggerState {
	disabled: MenubarTriggerStateProps["disabled"];
	menu: MenubarMenuState;
	root: MenubarRootState;
	isFocused = $state(false);

	constructor(props: MenubarTriggerStateProps, menu: MenubarMenuState) {
		this.disabled = props.disabled;
		this.menu = menu;
		this.menu.triggerId = props.id;
		this.root = menu.root;
	}

	#onpointerdown = (e: PointerEvent) => {
		// only call if the left button but not when the CTRL key is pressed
		if (!this.disabled.value && e.button === 0 && e.ctrlKey === false) {
			this.root.onMenuOpen(this.menu.value.value);
			// prevent trigger from focusing when opening
			// which allows the content to focus withut competition
			if (!this.menu.open) e.preventDefault();
		}
	};

	#onpointerenter = () => {
		const isMenubarOpen = Boolean(this.root.value.value);
		if (isMenubarOpen && !this.menu.open) {
			this.root.onMenuOpen(this.menu.value.value);
			this.menu.getTriggerNode()?.focus();
		}
	};

	#onkeydown = (e: KeyboardEvent) => {
		if (this.disabled.value) return;
		if (e.key === kbd.ENTER || e.key === kbd.SPACE) {
			this.root.onMenuToggle(this.menu.value.value);
		}
		if (e.key === kbd.ARROW_DOWN) {
			this.root.onMenuOpen(this.menu.value.value);
		}
		// prevent keydown from scrolling window / first focused item
		// from inadvertedly closing the menu
		if (e.key === kbd.ENTER || e.key === kbd.SPACE || e.key === kbd.ARROW_DOWN) {
			this.menu.wasOpenedByKeyboard = true;
			e.preventDefault();
		}

		this.root.rovingFocusGroup.handleKeydown(this.menu.getTriggerNode(), e);
	};

	#onfocus = () => {
		this.isFocused = true;
	};

	#onblur = () => {
		this.isFocused = false;
	};

	#tabIndex = $derived.by(
		() => this.root.rovingFocusGroup.getTabIndex(this.menu.getTriggerNode()).value
	);

	props = $derived.by(
		() =>
			({
				type: "button",
				role: "menuitem",
				id: this.menu.triggerId.value,
				"aria-haspopup": "menu",
				"aria-expanded": getAriaExpanded(this.menu.open),
				"aria-controls": this.menu.open ? this.menu.contentId.value : undefined,
				"data-highlighted": this.isFocused ? "" : undefined,
				"data-state": getDataOpenClosed(this.menu.open),
				"data-disabled": getDataDisabled(this.disabled.value),
				"data-menu-value": this.menu.value.value,
				disabled: this.disabled.value ? true : undefined,
				tabIndex: this.#tabIndex,
				[TRIGGER_ATTR]: "",
				onpointerdown: this.#onpointerdown,
				onpointerenter: this.#onpointerenter,
				onkeydown: this.#onkeydown,
				onfocus: this.#onfocus,
				onblur: this.#onblur,
			}) as const
	);
}

type MenubarContentStateProps = ReadableBoxedValues<{
	id: string;
	interactOutsideBehavior: InteractOutsideBehaviorType;
}>;

class MenubarContentState {
	id: MenubarContentStateProps["id"];
	menu: MenubarMenuState;
	root: MenubarRootState;
	hasInteractedOutside = $state(false);
	interactOutsideBehavior: MenubarContentStateProps["interactOutsideBehavior"];

	constructor(props: MenubarContentStateProps, menu: MenubarMenuState) {
		this.id = props.id;
		this.interactOutsideBehavior = props.interactOutsideBehavior;
		this.menu = menu;
		this.root = menu.root;
	}

	onDestroyAutoFocus = (e: Event) => {
		const menubarOpen = Boolean(this.root.value.value);
		if (!menubarOpen && !this.hasInteractedOutside) {
			this.menu.getTriggerNode()?.focus();
		}

		this.hasInteractedOutside = false;
		e.preventDefault();
	};

	onFocusOutside = (e: Event) => {
		const target = e.target as HTMLElement;
		const isMenubarTrigger = this.root
			.getTriggers()
			.some((trigger) => trigger.contains(target));
		if (isMenubarTrigger) e.preventDefault();
	};

	onInteractOutside = () => {
		this.hasInteractedOutside = true;
	};

	onMountAutoFocus = (e: Event) => {
		if (!this.menu.wasOpenedByKeyboard) {
			e.preventDefault();
		}
	};

	#onkeydown = (e: KeyboardEvent) => {
		if (e.key !== kbd.ARROW_LEFT && e.key !== kbd.ARROW_RIGHT) return;

		const target = e.target as HTMLElement;
		const targetIsSubTrigger = target.hasAttribute("data-menu-sub-trigger");
		const isKeydownInsideSubMenu = target.closest("[data-menu-content]") !== e.currentTarget;

		const prevMenuKey = this.root.dir.value === "rtl" ? kbd.ARROW_RIGHT : kbd.ARROW_LEFT;
		const isPrevKey = prevMenuKey === e.key;
		const isNextKey = !isPrevKey;

		// prevent navigation when opening a submenu
		if (isNextKey && targetIsSubTrigger) return;
		// or if we're inside a submenu and moving back to close it
		if (isKeydownInsideSubMenu && isPrevKey) return;

		const items = this.root.getTriggers().filter((trigger) => !trigger.disabled);
		let candidateValues = items.map((item) => item.getAttribute("data-menu-value")!);
		if (isPrevKey) candidateValues.reverse();

		const currentIndex = candidateValues.indexOf(this.menu.value.value);

		candidateValues = this.root.loop.value
			? wrapArray(candidateValues, currentIndex + 1)
			: candidateValues.slice(currentIndex + 1);
		const [nextValue] = candidateValues;
		if (nextValue) this.root.onMenuOpen(nextValue);
	};

	props = $derived.by(() => ({
		id: this.id.value,
		"aria-labelledby": this.menu.triggerId.value,
		style: {
			"--bits-menubar-content-transform-origin": "var(--bits-floating-transform-origin)",
			"--bits-menubar-content-available-width": "var(--bits-floating-available-width)",
			"--bits-menubar-content-available-height": "var(--bits-floating-available-height)",
			"--bits-menubar-trigger-width": "var(--bits-floating-anchor-width)",
			"--bits-menubar-trigger-height": "var(--bits-floating-anchor-height)",
		},
		onkeydown: this.#onkeydown,
	}));
}

const [setMenubarRootContext, getMenubarRootContext] =
	createContext<MenubarRootState>("Menubar.Root");

const [setMenubarMenuContext, getMenubarMenuContext] =
	createContext<MenubarMenuState>("Menubar.Menu");

export function useMenubarRoot(props: MenubarRootStateProps) {
	return setMenubarRootContext(new MenubarRootState(props));
}

export function useMenubarMenu(props: MenubarMenuStateProps) {
	return setMenubarMenuContext(getMenubarRootContext().createMenu(props));
}

export function useMenubarTrigger(props: MenubarTriggerStateProps) {
	return getMenubarMenuContext().createTrigger(props);
}

export function useMenubarContent(props: MenubarContentStateProps) {
	return getMenubarMenuContext().createContent(props);
}
