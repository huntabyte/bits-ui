import { untrack } from "svelte";
import { box } from "svelte-toolbelt";
import { getTabbableCandidates } from "../utilities/focus-scope/utils.js";
import type { ReadableBoxedValues, WritableBoxedValues } from "$lib/internal/box.svelte.js";
import type { Direction, Orientation } from "$lib/shared/index.js";
import { getDataOrientation } from "$lib/internal/attrs.js";
import { createContext } from "$lib/internal/createContext.js";
import { useId } from "$lib/internal/useId.svelte.js";

const [setNavigationMenuRootContext, getNavigationMenuRootContext] =
	createContext<NavigationMenuRootState>("NavigationMenu.Root");

const [setNavigationMenuProviderContext, getNavigationMenuProviderContext] =
	createContext<NavigationMenuProviderState>("NavigationMenu.Provider");

const ROOT_ATTR = "data-navigation-menu-root";
const SUB_ATTR = "data-navigation-menu-sub";
const ITEM_ATTR = "data-navigation-menu-item";

type NavigationMenuRootStateProps = ReadableBoxedValues<{
	id: string;
	delayDuration: number;
	skipDelayDuration: number;
	orientation: Orientation;
	dir: Direction;
}> &
	WritableBoxedValues<{ value: string }>;

class NavigationMenuRootState {
	id: NavigationMenuRootStateProps["id"];
	delayDuration: NavigationMenuRootStateProps["delayDuration"];
	skipDelayDuration: NavigationMenuRootStateProps["skipDelayDuration"];
	orientation: NavigationMenuRootStateProps["orientation"];
	dir: NavigationMenuRootStateProps["dir"];
	value: NavigationMenuRootStateProps["value"];
	openTimer = $state<number>(0);
	closeTimer = $state<number>(0);
	skipDelayTimer = $state<number>(0);
	isOpenDelayed = $state(true);

	constructor(props: NavigationMenuRootStateProps) {
		this.id = props.id;
		this.delayDuration = props.delayDuration;
		this.skipDelayDuration = props.skipDelayDuration;
		this.orientation = props.orientation;
		this.dir = props.dir;
		this.value = props.value;

		$effect(() => {
			const isOpen = this.value.value !== "";
			untrack(() => {
				const hasSkipDelayDuration = this.skipDelayDuration.value > 0;

				if (isOpen) {
					window.clearTimeout(this.skipDelayTimer);
					if (hasSkipDelayDuration) this.isOpenDelayed = true;
				} else {
					window.clearTimeout(this.skipDelayTimer);
					this.skipDelayTimer = window.setTimeout(() => {
						this.isOpenDelayed = true;
					}, this.skipDelayDuration.value);
				}
			});
		});

		$effect(() => {
			return () => {
				window.clearTimeout(this.openTimer);
				window.clearTimeout(this.closeTimer);
				window.clearTimeout(this.skipDelayTimer);
			};
		});
	}
	setValue(v: string) {
		this.value.value = v;
	}

	startCloseTimer() {
		window.clearTimeout(this.closeTimer);
		this.closeTimer = window.setTimeout(() => this.setValue(""), 150);
	}

	handleOpen(itemValue: string) {
		window.clearTimeout(this.closeTimer);
		this.setValue(itemValue);
	}

	handleDelayedOpen(itemValue: string) {
		const isOpen = this.value.value === itemValue;
		if (isOpen) {
			// If the item is already open (e.g. we're transitioning from the content to the trigger)
			// then we want to clear the close timer immediately.
			window.clearTimeout(this.closeTimer);
		} else {
			this.openTimer = window.setTimeout(() => {
				window.clearTimeout(this.closeTimer);
				this.setValue(itemValue);
			});
		}
	}

	onTriggerEnter(itemValue: string) {
		window.clearTimeout(this.openTimer);
		if (this.isOpenDelayed) this.handleDelayedOpen(itemValue);
		else this.handleOpen(itemValue);
	}

	onTriggerLeave() {
		window.clearTimeout(this.openTimer);
		this.startCloseTimer();
	}

	onContentEnter() {
		window.clearTimeout(this.closeTimer);
	}

	onContentLeave = this.startCloseTimer;

	onItemSelect(itemValue: string) {
		const newValue = this.value.value === itemValue ? "" : itemValue;
		this.setValue(newValue);
	}

	onItemDismiss() {
		this.setValue("");
	}

	props = $derived.by(() => ({
		"aria-label": "Main",
		"data-orientation": getDataOrientation(this.orientation.value),
		dir: this.dir.value,
		[ROOT_ATTR]: "",
	}));

	createProvider(props: NavigationMenuProviderStateProps) {
		return new NavigationMenuProviderState({
			...props,
			isRoot: false,
			rootNavigationId: this.id,
		});
	}
}

type NavigationMenuSubStateProps = ReadableBoxedValues<{
	id: string;
	orientation: Orientation;
	dir: Direction;
}> &
	WritableBoxedValues<{ value: string }>;

class NavigationMenuSubState {
	id: NavigationMenuSubStateProps["id"];
	orientation: NavigationMenuSubStateProps["orientation"];
	dir: NavigationMenuSubStateProps["dir"];
	value: NavigationMenuSubStateProps["value"];

	constructor(props: NavigationMenuSubStateProps) {
		this.id = props.id;
		this.orientation = props.orientation;
		this.dir = props.dir;
		this.value = props.value;
	}
	setValue(v: string) {
		this.value.value = v;
	}

	onTriggerEnter(itemValue: string) {
		this.setValue(itemValue);
	}

	onItemSelect(itemValue: string) {
		this.setValue(itemValue);
	}

	onItemDismiss() {
		this.setValue("");
	}

	props = $derived.by(() => ({
		"data-orientation": getDataOrientation(this.orientation.value),
		[SUB_ATTR]: "",
	}));
}

type NavigationMenuProviderStateProps = ReadableBoxedValues<{
	rootNavigationId: string;
	dir: Direction;
	orientation: Orientation;
}> &
	WritableBoxedValues<{
		value: string;
	}> & {
		isRoot: boolean;
		onTriggerEnter: (itemValue: string) => void;
		onTriggerLeave?: () => void;
		onContentEnter?: () => void;
		onContentLeave?: () => void;
		onItemSelect: (itemValue: string) => void;
		onItemDismiss: () => void;
	};

class NavigationMenuProviderState {
	isRoot: NavigationMenuProviderStateProps["isRoot"] = $state(false);
	rootNavigationId: NavigationMenuProviderStateProps["rootNavigationId"];
	dir: NavigationMenuProviderStateProps["dir"];
	orientation: NavigationMenuProviderStateProps["orientation"];
	value: NavigationMenuProviderStateProps["value"];
	onTriggerEnter: NavigationMenuProviderStateProps["onTriggerEnter"];
	onTriggerLeave: NavigationMenuProviderStateProps["onTriggerLeave"];
	onContentEnter: NavigationMenuProviderStateProps["onContentEnter"];
	onContentLeave: NavigationMenuProviderStateProps["onContentLeave"];
	onItemSelect: NavigationMenuProviderStateProps["onItemSelect"];
	onItemDismiss: NavigationMenuProviderStateProps["onItemDismiss"];
	viewportId = box.with<string | undefined>(() => undefined);
	viewportContentId = box.with<string | undefined>(() => undefined);
	indicatorTrackId = box.with<string | undefined>(() => undefined);

	constructor(props: NavigationMenuProviderStateProps) {
		this.isRoot = props.isRoot;
		this.rootNavigationId = props.rootNavigationId;
		this.dir = props.dir;
		this.orientation = props.orientation;
		this.value = props.value;
		this.onTriggerEnter = props.onTriggerEnter;
		this.onTriggerLeave = props.onTriggerLeave;
		this.onContentEnter = props.onContentEnter;
		this.onContentLeave = props.onContentLeave;
		this.onItemSelect = props.onItemSelect;
		this.onItemDismiss = props.onItemDismiss;
	}
}

type NavigationMenuListStateProps = ReadableBoxedValues<{
	id: string;
}>;

class NavigationMenuListState {
	id: NavigationMenuListStateProps["id"];
	indicatorId = box(useId());

	constructor(
		props: NavigationMenuListStateProps,
		private provider: NavigationMenuProviderState
	) {
		this.id = props.id;
	}

	indicatorProps = $derived.by(
		() =>
			({
				id: this.indicatorId.value,
				style: {
					position: "relative",
				},
			}) as const
	);

	props = $derived.by(
		() =>
			({
				"data-orientation": getDataOrientation(this.provider.orientation.value),
			}) as const
	);
}

type NavigationMenuItemStateProps = ReadableBoxedValues<{
	id: string;
	value: string;
}>;

class NavigationMenuItemState {
	id: NavigationMenuItemStateProps["id"];
	value: NavigationMenuItemStateProps["value"];
	contentId = box.with<string | undefined>(() => undefined);
	triggerId = box.with<string | undefined>(() => undefined);
	focusProxyId = box.with<string | undefined>(() => undefined);
	restoreContentTabOrder = $state(() => {});
	wasEscapeClose = $state(false);

	constructor(
		props: NavigationMenuItemStateProps,
		private provider: NavigationMenuProviderState
	) {
		this.id = props.id;
		this.value = props.value;
	}

	getContentNode() {
		return document.getElementById(this.contentId.value ?? "");
	}

	getTriggerNode() {
		return document.getElementById(this.triggerId.value ?? "");
	}

	getFocusProxyNode() {
		return document.getElementById(this.focusProxyId.value ?? "");
	}

	handleContentEntry(side: "start" | "end" = "start") {
		const contentNode = this.getContentNode();
		if (!contentNode) return;
		this.restoreContentTabOrder();
		const candidates = getTabbableCandidates(contentNode);
		if (candidates.length) {
			focusFirst(side === "start" ? candidates : candidates.reverse());
		}
	}

	handleContentExit() {
		const contentNode = this.getContentNode();
		if (!contentNode) return;
		const candidates = getTabbableCandidates(contentNode);
		if (candidates.length) {
			this.restoreContentTabOrder = removeFromTabOrder(candidates);
		}
	}

	props = $derived.by(
		() =>
			({
				id: this.id.value,
				[ITEM_ATTR]: "",
			}) as const
	);
}

function focusFirst(candidates: HTMLElement[]) {
	const previouslyFocusedElement = document.activeElement;
	return candidates.some((candidate) => {
		// if focus is already where we want to go, we don't want to keep going through the candidates
		if (candidate === previouslyFocusedElement) return true;
		candidate.focus();
		return document.activeElement !== previouslyFocusedElement;
	});
}

function removeFromTabOrder(candidates: HTMLElement[]) {
	candidates.forEach((candidate) => {
		candidate.dataset.tabindex = candidate.getAttribute("tabindex") || "";
		candidate.setAttribute("tabindex", "-1");
	});
	return () => {
		candidates.forEach((candidate) => {
			const prevTabIndex = candidate.dataset.tabindex as string;
			candidate.setAttribute("tabindex", prevTabIndex);
		});
	};
}
