import {
	type ReadableBox,
	afterTick,
	box,
	attachRef,
	type ReadableBoxedValues,
	type WritableBoxedValues,
} from "svelte-toolbelt";
import { Context, watch } from "runed";
import type { InteractOutsideBehaviorType } from "../utilities/dismissible-layer/types.js";
import type { Direction } from "$lib/shared/index.js";
import {
	createBitsAttrs,
	getAriaExpanded,
	getDataDisabled,
	getDataOpenClosed,
} from "$lib/internal/attrs.js";
import { kbd } from "$lib/internal/kbd.js";
import { wrapArray } from "$lib/internal/arrays.js";
import type { OnChangeFn, RefAttachment, WithRefOpts } from "$lib/internal/types.js";
import { onMount } from "svelte";
import type { FocusEventHandler, KeyboardEventHandler, PointerEventHandler } from "svelte/elements";
import { getFloatingContentCSSVars } from "../../internal/floating-svelte/floating-utils.svelte";
import { RovingFocusGroup } from "$lib/internal/roving-focus-group.js";

const menubarAttrs = createBitsAttrs({
	component: "menubar",
	parts: ["root", "trigger", "content"],
});

const MenubarRootContext = new Context<MenubarRootState>("Menubar.Root");
const MenubarMenuContext = new Context<MenubarMenuState>("Menubar.Menu");
interface MenubarRootStateOpts
	extends WithRefOpts,
		ReadableBoxedValues<{
			dir: Direction;
			loop: boolean;
		}>,
		WritableBoxedValues<{
			value: string;
		}> {}

export class MenubarRootState {
	static create(opts: MenubarRootStateOpts) {
		return MenubarRootContext.set(new MenubarRootState(opts));
	}
	readonly opts: MenubarRootStateOpts;
	readonly rovingFocusGroup: RovingFocusGroup;
	readonly attachment: RefAttachment;
	wasOpenedByKeyboard = $state(false);
	triggerIds = $state<string[]>([]);
	valueToChangeHandler = new Map<string, ReadableBox<OnChangeFn<boolean>>>();

	constructor(opts: MenubarRootStateOpts) {
		this.opts = opts;
		this.attachment = attachRef(this.opts.ref);
		this.rovingFocusGroup = new RovingFocusGroup({
			rootNode: this.opts.ref,
			candidateAttr: menubarAttrs.trigger,
			loop: this.opts.loop,
			orientation: box.with(() => "horizontal"),
		});
	}

	/**
	 * @param id - the id of the trigger to register
	 * @returns - a function to de-register the trigger
	 */
	registerTrigger = (id: string) => {
		this.triggerIds.push(id);

		return () => {
			this.triggerIds = this.triggerIds.filter((triggerId) => triggerId !== id);
		};
	};

	/**
	 * @param value - the value of the menu to register
	 * @param contentId - the content id to associate with the value
	 * @returns - a function to de-register the menu
	 */
	registerMenu = (value: string, onOpenChange: ReadableBox<OnChangeFn<boolean>>) => {
		this.valueToChangeHandler.set(value, onOpenChange);

		return () => {
			this.valueToChangeHandler.delete(value);
		};
	};

	updateValue = (value: string) => {
		const currValue = this.opts.value.current;
		const currHandler = this.valueToChangeHandler.get(currValue)?.current;
		const nextHandler = this.valueToChangeHandler.get(value)?.current;
		this.opts.value.current = value;
		if (currHandler && currValue !== value) {
			currHandler(false);
		}
		if (nextHandler) {
			nextHandler(true);
		}
	};

	getTriggers = () => {
		const node = this.opts.ref.current;
		if (!node) return [];
		return Array.from(
			node.querySelectorAll<HTMLButtonElement>(menubarAttrs.selector("trigger"))
		);
	};

	onMenuOpen = (id: string, triggerId: string) => {
		this.updateValue(id);
		this.rovingFocusGroup.setCurrentTabStopId(triggerId);
	};

	onMenuClose = () => {
		this.updateValue("");
	};

	onMenuToggle = (id: string) => {
		this.updateValue(this.opts.value.current ? "" : id);
	};

	readonly props = $derived.by(
		() =>
			({
				id: this.opts.id.current,
				role: "menubar",
				[menubarAttrs.root]: "",
				...this.attachment,
			}) as const
	);
}

interface MenubarMenuStateOpts
	extends ReadableBoxedValues<{
		value: string;
		onOpenChange: OnChangeFn<boolean>;
	}> {}

export class MenubarMenuState {
	static create(opts: MenubarMenuStateOpts) {
		return MenubarMenuContext.set(new MenubarMenuState(opts, MenubarRootContext.get()));
	}

	readonly opts: MenubarMenuStateOpts;
	readonly root: MenubarRootState;
	open = $derived.by(() => this.root.opts.value.current === this.opts.value.current);
	wasOpenedByKeyboard = false;
	triggerNode = $state<HTMLElement | null>(null);
	triggerId = $derived.by(() => this.triggerNode?.id);
	contentId = $derived.by(() => this.contentNode?.id);
	contentNode = $state<HTMLElement | null>(null);

	constructor(opts: MenubarMenuStateOpts, root: MenubarRootState) {
		this.opts = opts;
		this.root = root;

		watch(
			() => this.open,
			() => {
				if (!this.open) {
					this.wasOpenedByKeyboard = false;
				}
			}
		);

		onMount(() => {
			return this.root.registerMenu(this.opts.value.current, opts.onOpenChange);
		});
	}

	getTriggerNode() {
		return this.triggerNode;
	}

	toggleMenu() {
		this.root.onMenuToggle(this.opts.value.current);
	}

	openMenu() {
		this.root.onMenuOpen(this.opts.value.current, this.triggerNode?.id ?? "");
	}
}

interface MenubarTriggerStateOpts
	extends WithRefOpts,
		ReadableBoxedValues<{
			disabled: boolean;
		}> {}

export class MenubarTriggerState {
	static create(opts: MenubarTriggerStateOpts) {
		return new MenubarTriggerState(opts, MenubarMenuContext.get());
	}

	readonly opts: MenubarTriggerStateOpts;
	readonly menu: MenubarMenuState;
	readonly root: MenubarRootState;
	readonly attachment: RefAttachment;
	isFocused = $state(false);
	#tabIndex = $state(0);

	constructor(opts: MenubarTriggerStateOpts, menu: MenubarMenuState) {
		this.opts = opts;
		this.menu = menu;
		this.root = menu.root;
		this.attachment = attachRef(this.opts.ref, (v) => (this.menu.triggerNode = v));

		onMount(() => {
			return this.root.registerTrigger(opts.id.current);
		});

		$effect(() => {
			if (this.root.triggerIds.length) {
				this.#tabIndex = this.root.rovingFocusGroup.getTabIndex(this.menu.getTriggerNode());
			}
		});
	}

	onpointerdown: PointerEventHandler<HTMLElement> = (e) => {
		// only call if the left button but not when the CTRL key is pressed
		if (!this.opts.disabled.current && e.button === 0 && e.ctrlKey === false) {
			// prevent trigger from focusing when opening
			// which allows the content to focus without competition
			if (!this.menu.open) {
				e.preventDefault();
			}
			this.menu.toggleMenu();
		}
	};

	onpointerenter: PointerEventHandler<HTMLElement> = () => {
		const isMenubarOpen = Boolean(this.root.opts.value.current);
		if (isMenubarOpen && !this.menu.open) {
			this.menu.openMenu();
			this.menu.getTriggerNode()?.focus();
		}
	};

	onkeydown: KeyboardEventHandler<HTMLElement> = (e) => {
		if (this.opts.disabled.current) return;
		if (e.key === kbd.TAB) return;
		if (e.key === kbd.ENTER || e.key === kbd.SPACE) {
			this.root.onMenuToggle(this.menu.opts.value.current);
		}
		if (e.key === kbd.ARROW_DOWN) {
			this.menu.openMenu();
		}
		// prevent keydown from scrolling window / first focused item
		// from inadvertently closing the menu
		if (e.key === kbd.ENTER || e.key === kbd.SPACE || e.key === kbd.ARROW_DOWN) {
			this.menu.wasOpenedByKeyboard = true;
			e.preventDefault();
		}

		this.root.rovingFocusGroup.handleKeydown(this.menu.getTriggerNode(), e);
	};

	onfocus: FocusEventHandler<HTMLElement> = () => {
		this.isFocused = true;
	};

	onblur: FocusEventHandler<HTMLElement> = () => {
		this.isFocused = false;
	};

	readonly props = $derived.by(
		() =>
			({
				type: "button",
				role: "menuitem",
				id: this.opts.id.current,
				"aria-haspopup": "menu",
				"aria-expanded": getAriaExpanded(this.menu.open),
				"aria-controls": this.menu.open ? this.menu.contentId : undefined,
				"data-highlighted": this.isFocused ? "" : undefined,
				"data-state": getDataOpenClosed(this.menu.open),
				"data-disabled": getDataDisabled(this.opts.disabled.current),
				"data-menu-value": this.menu.opts.value.current,
				disabled: this.opts.disabled.current ? true : undefined,
				tabindex: this.#tabIndex,
				[menubarAttrs.trigger]: "",
				onpointerdown: this.onpointerdown,
				onpointerenter: this.onpointerenter,
				onkeydown: this.onkeydown,
				onfocus: this.onfocus,
				onblur: this.onblur,
				...this.attachment,
			}) as const
	);
}

interface MenubarContentStateOpts
	extends WithRefOpts,
		ReadableBoxedValues<{
			interactOutsideBehavior: InteractOutsideBehaviorType;
			onOpenAutoFocus: (e: Event) => void;
			onCloseAutoFocus: (e: Event) => void;
			onFocusOutside: (e: FocusEvent) => void;
			onInteractOutside: (e: PointerEvent) => void;
		}> {}

export class MenubarContentState {
	static create(opts: MenubarContentStateOpts) {
		return new MenubarContentState(opts, MenubarMenuContext.get());
	}

	readonly opts: MenubarContentStateOpts;
	readonly menu: MenubarMenuState;
	readonly root: MenubarRootState;
	readonly attachment: RefAttachment;

	constructor(opts: MenubarContentStateOpts, menu: MenubarMenuState) {
		this.opts = opts;
		this.menu = menu;
		this.root = menu.root;
		this.attachment = attachRef(this.opts.ref, (v) => (this.menu.contentNode = v));
	}

	onCloseAutoFocus = (e: Event) => {
		this.opts.onCloseAutoFocus.current(e);
		if (e.defaultPrevented) return;
	};

	onFocusOutside = (e: FocusEvent) => {
		const target = e.target as HTMLElement;
		const isMenubarTrigger = this.root
			.getTriggers()
			.some((trigger) => trigger.contains(target));
		if (isMenubarTrigger) e.preventDefault();
		this.opts.onFocusOutside.current(e);
	};

	onInteractOutside = (e: PointerEvent) => {
		this.opts.onInteractOutside.current(e);
	};

	onOpenAutoFocus = (e: Event) => {
		this.opts.onOpenAutoFocus.current(e);
		if (e.defaultPrevented) return;
		afterTick(() => this.opts.ref.current?.focus());
	};

	onkeydown: KeyboardEventHandler<HTMLElement> = (e) => {
		if (e.key !== kbd.ARROW_LEFT && e.key !== kbd.ARROW_RIGHT) return;

		const target = e.target as HTMLElement;
		const targetIsSubTrigger = target.hasAttribute("data-menu-sub-trigger");
		const isKeydownInsideSubMenu = target.closest("[data-menu-content]") !== e.currentTarget;

		const prevMenuKey = this.root.opts.dir.current === "rtl" ? kbd.ARROW_RIGHT : kbd.ARROW_LEFT;
		const isPrevKey = prevMenuKey === e.key;
		const isNextKey = !isPrevKey;

		// prevent navigation when opening a submenu
		if (isNextKey && targetIsSubTrigger) return;
		// or if we're inside a submenu and moving back to close it
		if (isKeydownInsideSubMenu && isPrevKey) return;

		const items = this.root.getTriggers().filter((trigger) => !trigger.disabled);
		let candidates = items.map((item) => ({
			value: item.getAttribute("data-menu-value")!,
			triggerId: item.id ?? "",
		}));
		if (isPrevKey) candidates.reverse();
		const candidateValues = candidates.map(({ value }) => value);

		const currentIndex = candidateValues.indexOf(this.menu.opts.value.current);

		candidates = this.root.opts.loop.current
			? wrapArray(candidates, currentIndex + 1)
			: candidates.slice(currentIndex + 1);
		const [nextValue] = candidates;
		if (nextValue) this.menu.root.onMenuOpen(nextValue.value, nextValue.triggerId);
	};

	props = $derived.by(
		() =>
			({
				id: this.opts.id.current,
				"aria-labelledby": this.menu.triggerId,
				style: getFloatingContentCSSVars("menubar"),
				onkeydown: this.onkeydown,
				"data-menu-content": "",
				[menubarAttrs.content]: "",
				...this.attachment,
			}) as const
	);

	popperProps = {
		onCloseAutoFocus: this.onCloseAutoFocus,
		onFocusOutside: this.onFocusOutside,
		onInteractOutside: this.onInteractOutside,
		onOpenAutoFocus: this.onOpenAutoFocus,
	};
}
