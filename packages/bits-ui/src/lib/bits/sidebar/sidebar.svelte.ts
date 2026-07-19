import { attachRef, type ReadableBoxedValues, type WritableBoxedValues } from "svelte-toolbelt";
import { Context } from "runed";
import {
	boolToEmptyStrOrUndef,
	boolToStr,
	boolToTrueOrUndef,
	createBitsAttrs,
} from "$lib/internal/attrs.js";
import type { BitsMouseEvent, RefAttachment, WithRefOpts } from "$lib/internal/types.js";
import type {
	SidebarCollapsible,
	SidebarMenuButtonSize,
	SidebarMenuButtonVariant,
	SidebarMenuSubButtonSize,
	SidebarSide,
	SidebarState,
	SidebarVariant,
} from "./types.js";

export const sidebarAttrs = createBitsAttrs({
	component: "sidebar",
	parts: [
		"provider",
		"root",
		"trigger",
		"rail",
		"inset",
		"input",
		"header",
		"footer",
		"separator",
		"content",
		"group",
		"group-label",
		"group-action",
		"group-content",
		"menu",
		"menu-item",
		"menu-button",
		"menu-action",
		"menu-badge",
		"menu-skeleton",
		"menu-sub",
		"menu-sub-item",
		"menu-sub-button",
	],
});

interface SidebarProviderStateOpts
	extends WithRefOpts,
		WritableBoxedValues<{
			open: boolean;
			openMobile: boolean;
		}>,
		ReadableBoxedValues<{
			disabled: boolean;
			isMobile: boolean | undefined;
			keyboardShortcut: string | null;
			mobileBreakpoint: number;
		}> {}

const SidebarProviderContext = new Context<SidebarProviderState>("Sidebar.Provider");

export class SidebarProviderState {
	static create(opts: SidebarProviderStateOpts) {
		return SidebarProviderContext.set(new SidebarProviderState(opts));
	}

	readonly opts: SidebarProviderStateOpts;
	readonly attachment: RefAttachment;
	rootId = $state<string | undefined>(undefined);
	collapsible = $state<SidebarCollapsible>("offcanvas");
	#mediaQueryMatches = $state(false);

	readonly isMobile = $derived.by(() => this.opts.isMobile.current ?? this.#mediaQueryMatches);
	readonly open = $derived.by(() => this.opts.open.current);
	readonly openMobile = $derived.by(() => this.opts.openMobile.current);
	readonly currentOpen = $derived(this.isMobile ? this.openMobile : this.open);
	readonly state = $derived<SidebarState>(this.currentOpen ? "expanded" : "collapsed");
	readonly toggleDisabled = $derived.by(
		() => this.opts.disabled.current || this.collapsible === "none"
	);

	constructor(opts: SidebarProviderStateOpts) {
		this.opts = opts;
		this.attachment = attachRef(this.opts.ref);
		this.toggle = this.toggle.bind(this);
		this.setOpen = this.setOpen.bind(this);
		this.setOpenMobile = this.setOpenMobile.bind(this);
		this.onkeydown = this.onkeydown.bind(this);

		$effect(() => {
			if (this.opts.isMobile.current !== undefined || typeof window === "undefined") return;

			const breakpoint = Math.max(0, this.opts.mobileBreakpoint.current - 1);
			const query = window.matchMedia(`(max-width: ${breakpoint}px)`);
			const update = () => (this.#mediaQueryMatches = query.matches);

			update();
			query.addEventListener("change", update);
			return () => query.removeEventListener("change", update);
		});
	}

	setOpen(value: boolean) {
		if (this.opts.disabled.current) return;
		this.opts.open.current = value;
	}

	setOpenMobile(value: boolean) {
		if (this.opts.disabled.current) return;
		this.opts.openMobile.current = value;
	}

	toggle() {
		if (this.toggleDisabled) return;
		if (this.isMobile) {
			this.opts.openMobile.current = !this.opts.openMobile.current;
		} else {
			this.opts.open.current = !this.opts.open.current;
		}
	}

	onkeydown(e: KeyboardEvent) {
		const shortcut = this.opts.keyboardShortcut.current;
		if (!shortcut || this.toggleDisabled || e.defaultPrevented) return;
		if (!(e.metaKey || e.ctrlKey) || e.altKey || e.shiftKey) return;
		if (e.key.toLocaleLowerCase() !== shortcut.toLocaleLowerCase()) return;

		e.preventDefault();
		this.toggle();
	}

	readonly snippetProps = $derived.by(() => ({
		state: this.state,
		open: this.open,
		openMobile: this.openMobile,
		isMobile: this.isMobile,
		setOpen: this.setOpen,
		setOpenMobile: this.setOpenMobile,
		toggle: this.toggle,
	}));

	readonly props = $derived.by(
		() =>
			({
				id: this.opts.id.current,
				"data-state": this.state,
				"data-mobile": boolToEmptyStrOrUndef(this.isMobile),
				"data-disabled": boolToEmptyStrOrUndef(this.opts.disabled.current),
				[sidebarAttrs.provider]: "",
				...this.attachment,
			}) as const
	);
}

interface SidebarRootStateOpts
	extends WithRefOpts,
		ReadableBoxedValues<{
			side: SidebarSide;
			variant: SidebarVariant;
			collapsible: SidebarCollapsible;
		}> {}

export class SidebarRootState {
	static create(opts: SidebarRootStateOpts) {
		return new SidebarRootState(opts, SidebarProviderContext.get());
	}

	readonly opts: SidebarRootStateOpts;
	readonly provider: SidebarProviderState;
	readonly attachment: RefAttachment;

	constructor(opts: SidebarRootStateOpts, provider: SidebarProviderState) {
		this.opts = opts;
		this.provider = provider;
		this.attachment = attachRef(this.opts.ref);

		$effect(() => {
			this.provider.rootId = this.opts.id.current;
			this.provider.collapsible = this.opts.collapsible.current;
		});
	}

	readonly snippetProps = $derived.by(() => ({
		...this.provider.snippetProps,
		side: this.opts.side.current,
		variant: this.opts.variant.current,
		collapsible: this.opts.collapsible.current,
	}));

	readonly props = $derived.by(
		() =>
			({
				id: this.opts.id.current,
				"data-state": this.provider.state,
				"data-mobile": boolToEmptyStrOrUndef(this.provider.isMobile),
				"data-side": this.opts.side.current,
				"data-variant": this.opts.variant.current,
				"data-collapsible": this.opts.collapsible.current,
				[sidebarAttrs.root]: "",
				...this.attachment,
			}) as const
	);
}

interface SidebarToggleStateOpts
	extends WithRefOpts,
		ReadableBoxedValues<{
			disabled: boolean;
		}> {}

export class SidebarToggleState {
	static create(opts: SidebarToggleStateOpts, part: "trigger" | "rail") {
		return new SidebarToggleState(opts, SidebarProviderContext.get(), part);
	}

	readonly opts: SidebarToggleStateOpts;
	readonly provider: SidebarProviderState;
	readonly attachment: RefAttachment<HTMLButtonElement>;
	readonly part: "trigger" | "rail";
	readonly disabled = $derived.by(
		() => this.opts.disabled.current || this.provider.toggleDisabled
	);

	constructor(
		opts: SidebarToggleStateOpts,
		provider: SidebarProviderState,
		part: "trigger" | "rail"
	) {
		this.opts = opts;
		this.provider = provider;
		this.part = part;
		this.attachment = attachRef(this.opts.ref);
		this.onclick = this.onclick.bind(this);
	}

	onclick(e: BitsMouseEvent<HTMLButtonElement>) {
		if (this.disabled) return;
		if (e.button !== 0) return e.preventDefault();
		this.provider.toggle();
	}

	readonly snippetProps = $derived.by(() => this.provider.snippetProps);

	readonly props = $derived.by(
		() =>
			({
				id: this.opts.id.current,
				type: "button",
				"aria-controls": this.provider.rootId,
				"aria-expanded": boolToStr(this.provider.currentOpen),
				"data-state": this.provider.state,
				"data-mobile": boolToEmptyStrOrUndef(this.provider.isMobile),
				"data-disabled": boolToEmptyStrOrUndef(this.disabled),
				disabled: boolToTrueOrUndef(this.disabled),
				onclick: this.onclick,
				[sidebarAttrs[this.part]]: "",
				...this.attachment,
			}) as const
	);
}

interface SidebarMenuButtonStateOpts
	extends WithRefOpts,
		ReadableBoxedValues<{
			disabled: boolean;
			isActive: boolean;
			size: SidebarMenuButtonSize;
			variant: SidebarMenuButtonVariant;
		}> {}

export class SidebarMenuButtonState {
	static create(opts: SidebarMenuButtonStateOpts) {
		return new SidebarMenuButtonState(opts);
	}

	readonly opts: SidebarMenuButtonStateOpts;
	readonly attachment: RefAttachment<HTMLButtonElement>;

	constructor(opts: SidebarMenuButtonStateOpts) {
		this.opts = opts;
		this.attachment = attachRef(this.opts.ref);
	}

	readonly snippetProps = $derived.by(() => ({
		active: this.opts.isActive.current,
	}));

	readonly props = $derived.by(
		() =>
			({
				id: this.opts.id.current,
				type: "button",
				"aria-current": this.opts.isActive.current ? "page" : undefined,
				"data-active": boolToEmptyStrOrUndef(this.opts.isActive.current),
				"data-disabled": boolToEmptyStrOrUndef(this.opts.disabled.current),
				"data-size": this.opts.size.current,
				"data-variant": this.opts.variant.current,
				disabled: boolToTrueOrUndef(this.opts.disabled.current),
				[sidebarAttrs["menu-button"]]: "",
				...this.attachment,
			}) as const
	);
}

interface SidebarMenuSubButtonStateOpts
	extends WithRefOpts,
		ReadableBoxedValues<{
			isActive: boolean;
			size: SidebarMenuSubButtonSize;
		}> {}

export class SidebarMenuSubButtonState {
	static create(opts: SidebarMenuSubButtonStateOpts) {
		return new SidebarMenuSubButtonState(opts);
	}

	readonly opts: SidebarMenuSubButtonStateOpts;
	readonly attachment: RefAttachment<HTMLAnchorElement>;

	constructor(opts: SidebarMenuSubButtonStateOpts) {
		this.opts = opts;
		this.attachment = attachRef(this.opts.ref);
	}

	readonly snippetProps = $derived.by(() => ({
		active: this.opts.isActive.current,
	}));

	readonly props = $derived.by(
		() =>
			({
				id: this.opts.id.current,
				"aria-current": this.opts.isActive.current ? "page" : undefined,
				"data-active": boolToEmptyStrOrUndef(this.opts.isActive.current),
				"data-size": this.opts.size.current,
				[sidebarAttrs["menu-sub-button"]]: "",
				...this.attachment,
			}) as const
	);
}

type SidebarPart = Exclude<keyof typeof sidebarAttrs, "selector" | "getAttr">;

interface SidebarPartStateOpts extends WithRefOpts {}

export class SidebarPartState {
	static create(opts: SidebarPartStateOpts, part: SidebarPart) {
		return new SidebarPartState(opts, part);
	}

	readonly opts: SidebarPartStateOpts;
	readonly part: SidebarPart;
	readonly attachment: RefAttachment;

	constructor(opts: SidebarPartStateOpts, part: SidebarPart) {
		this.opts = opts;
		this.part = part;
		this.attachment = attachRef(this.opts.ref);
	}

	readonly props = $derived.by(
		() =>
			({
				id: this.opts.id.current,
				[sidebarAttrs[this.part]]: "",
				...this.attachment,
			}) as const
	);
}

export function useSidebar() {
	return SidebarProviderContext.get();
}
