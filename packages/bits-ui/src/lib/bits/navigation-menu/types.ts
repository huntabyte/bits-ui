import type {
	OnChangeFn,
	PrimitiveAnchorAttributes,
	PrimitiveButtonAttributes,
	PrimitiveDivAttributes,
	PrimitiveElementAttributes,
	PrimitiveLiAttributes,
	PrimitiveUListAttributes,
	WithAsChild,
	Without,
} from "$lib/internal/types.js";
import type { Direction, Orientation } from "$lib/shared/index.js";
import type { InteractOutsideEvent } from "@melt-ui/svelte";

export type NavigationMenuRootPropsWithoutHTML = WithAsChild<{
	/**
	 * The value of the currently open menu item.
	 *
	 * @bindable
	 */
	value?: string;

	/**
	 * The callback to call when a menu item is selected.
	 */
	onValueChange?: OnChangeFn<string>;

	/**
	 * The duration from when the mouse enters a trigger until the content opens.
	 */
	delayDuration?: number;

	/**
	 * How much time a user has to enter another trigger without incurring a delay again.
	 */
	skipDelayDuration?: number;

	/**
	 * The reading direction of the content.
	 */
	dir?: Direction;

	/**
	 * The orientation of the menu.
	 */
	orientation?: Orientation;
}>;

export type NavigationMenuRootProps = NavigationMenuRootPropsWithoutHTML &
	Without<PrimitiveElementAttributes, NavigationMenuRootPropsWithoutHTML>;

export type NavigationMenuSubPropsWithoutHTML = WithAsChild<{
	/**
	 * The value of the currently open menu item within the menu.
	 *
	 * @bindable
	 */
	value?: string;

	/**
	 * A callback fired when the active menu item changes.
	 */
	onValueChange?: OnChangeFn<string>;

	/**
	 * The orientation of the menu.
	 */
	orientation?: Orientation;
}>;

export type NavigationMenuSubProps = NavigationMenuSubPropsWithoutHTML &
	Without<PrimitiveDivAttributes, NavigationMenuSubPropsWithoutHTML>;

export type NavigationMenuListPropsWithoutHTML = WithAsChild<{}>;

export type NavigationMenuListProps = NavigationMenuListPropsWithoutHTML &
	Without<PrimitiveUListAttributes, NavigationMenuListPropsWithoutHTML>;

export type NavigationMenuItemPropsWithoutHTML = WithAsChild<{
	/**
	 * The value of the menu item.
	 */
	value?: string;
}>;

export type NavigationMenuItemProps = NavigationMenuItemPropsWithoutHTML &
	Without<PrimitiveLiAttributes, NavigationMenuItemPropsWithoutHTML>;

export type NavigationMenuTriggerPropsWithoutHTML = WithAsChild<{
	/**
	 * Whether the trigger is disabled.
	 * @defaultValue false
	 */
	disabled?: boolean;
}>;

export type NavigationMenuTriggerProps = NavigationMenuTriggerPropsWithoutHTML &
	Without<PrimitiveButtonAttributes, NavigationMenuTriggerPropsWithoutHTML>;

export type NavigationMenuContentPropsWithoutHTML = WithAsChild<{
	/**
	 * Callback fired when an interaction occurs outside the content.
	 * Default behavior can be prevented with `event.preventDefault()`
	 *
	 */
	onInteractOutside?: (event: InteractOutsideEvent) => void;

	/**
	 * Callback fired when a focus event occurs outside the content.
	 * Default behavior can be prevented with `event.preventDefault()`
	 */
	onFocusOutside?: (event: FocusEvent) => void;

	/**
	 * Callback fires when an escape keydown event occurs.
	 * Default behavior can be prevented with `event.preventDefault()`
	 */
	onEscapeKeydown?: (event: KeyboardEvent) => void;

	/**
	 * Whether to forcefully mount the content, regardless of the open state.
	 * This is useful when wanting to use more custom transition and animation
	 * libraries.
	 *
	 * @defaultValue false
	 */
	forceMount?: boolean;
}>;

export type NavigationMenuContentProps = NavigationMenuContentPropsWithoutHTML &
	Without<PrimitiveDivAttributes, NavigationMenuContentPropsWithoutHTML>;

export type NavigationMenuLinkPropsWithoutHTML = WithAsChild<{
	/**
	 * Whether the link is the current active page
	 */
	active?: boolean;

	/**
	 * A callback fired when the link is clicked.
	 * Default behavior can be prevented with `event.preventDefault()`
	 */
	onSelect?: (e: Event) => void;
}>;

export type NavigationMenuLinkProps = NavigationMenuLinkPropsWithoutHTML &
	Without<PrimitiveAnchorAttributes, NavigationMenuLinkPropsWithoutHTML>;

export type NavigationMenuIndicatorPropsWithoutHTML = WithAsChild<{
	/**
	 * Whether to forcefully mount the content, regardless of the open state.
	 * This is useful when wanting to use more custom transition and animation
	 * libraries.
	 *
	 * @defaultValue false
	 */
	forceMount?: boolean;
}>;

export type NavigationMenuIndicatorProps = NavigationMenuIndicatorPropsWithoutHTML &
	Without<PrimitiveDivAttributes, NavigationMenuIndicatorPropsWithoutHTML>;

export type NavigationMenuViewportPropsWithoutHTML = WithAsChild<{
	/**
	 * Whether to forcefully mount the content, regardless of the open state.
	 * This is useful when wanting to use more custom transition and animation
	 * libraries.
	 *
	 * @defaultValue false
	 */
	forceMount?: boolean;
}>;

export type NavigationMenuViewportProps = NavigationMenuViewportPropsWithoutHTML &
	Without<PrimitiveDivAttributes, NavigationMenuViewportPropsWithoutHTML>;
