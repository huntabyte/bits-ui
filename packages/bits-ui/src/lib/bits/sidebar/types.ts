import type { WithChild, Without, OnChangeFn } from "$lib/internal/types.js";
import type {
	BitsPrimitiveAnchorAttributes,
	BitsPrimitiveButtonAttributes,
	BitsPrimitiveDivAttributes,
	BitsPrimitiveElementAttributes,
	BitsPrimitiveInputAttributes,
	BitsPrimitiveLiAttributes,
	BitsPrimitiveUListAttributes,
} from "$lib/shared/attributes.js";

export type SidebarState = "expanded" | "collapsed";
export type SidebarSide = "left" | "right";
export type SidebarVariant = "sidebar" | "floating" | "inset";
export type SidebarCollapsible = "offcanvas" | "icon" | "none";
export type SidebarMenuButtonSize = "default" | "sm" | "lg";
export type SidebarMenuButtonVariant = "default" | "outline";
export type SidebarMenuSubButtonSize = "sm" | "md";

export type SidebarProviderSnippetProps = {
	state: SidebarState;
	open: boolean;
	openMobile: boolean;
	isMobile: boolean;
	setOpen: (open: boolean) => void;
	setOpenMobile: (open: boolean) => void;
	toggle: () => void;
};

export type SidebarProviderPropsWithoutHTML = WithChild<
	{
		/** Whether the desktop sidebar is open. */
		open?: boolean;
		/** Called when the desktop open state changes. */
		onOpenChange?: OnChangeFn<boolean>;
		/** Whether the mobile sidebar is open. */
		openMobile?: boolean;
		/** Called when the mobile open state changes. */
		onOpenMobileChange?: OnChangeFn<boolean>;
		/** Disables sidebar toggling. */
		disabled?: boolean;
		/**
		 * Overrides automatic mobile detection. When omitted, `mobileBreakpoint` is used.
		 */
		isMobile?: boolean;
		/** The viewport width below which the mobile state is used. */
		mobileBreakpoint?: number;
		/**
		 * The key used with Command or Control to toggle the sidebar. Set to `null` to disable.
		 */
		keyboardShortcut?: string | null;
	},
	SidebarProviderSnippetProps,
	HTMLDivElement
>;

export type SidebarProviderProps = SidebarProviderPropsWithoutHTML &
	Without<BitsPrimitiveDivAttributes, SidebarProviderPropsWithoutHTML>;

export type SidebarRootSnippetProps = SidebarProviderSnippetProps & {
	side: SidebarSide;
	variant: SidebarVariant;
	collapsible: SidebarCollapsible;
};

export type SidebarRootPropsWithoutHTML = WithChild<
	{
		side?: SidebarSide;
		variant?: SidebarVariant;
		collapsible?: SidebarCollapsible;
	},
	SidebarRootSnippetProps,
	HTMLDivElement
>;

export type SidebarRootProps = SidebarRootPropsWithoutHTML &
	Without<BitsPrimitiveDivAttributes, SidebarRootPropsWithoutHTML>;

export type SidebarTriggerPropsWithoutHTML = WithChild<
	{ disabled?: boolean },
	SidebarProviderSnippetProps,
	HTMLButtonElement
>;
export type SidebarTriggerProps = SidebarTriggerPropsWithoutHTML &
	Without<BitsPrimitiveButtonAttributes, SidebarTriggerPropsWithoutHTML>;

export type SidebarRailPropsWithoutHTML = SidebarTriggerPropsWithoutHTML;
export type SidebarRailProps = SidebarRailPropsWithoutHTML &
	Without<BitsPrimitiveButtonAttributes, SidebarRailPropsWithoutHTML>;

type SidebarDivPartPropsWithoutHTML = WithChild<{}, { _default: never }, HTMLDivElement>;
type SidebarDivPartProps = SidebarDivPartPropsWithoutHTML &
	Without<BitsPrimitiveDivAttributes, SidebarDivPartPropsWithoutHTML>;

export type SidebarHeaderPropsWithoutHTML = SidebarDivPartPropsWithoutHTML;
export type SidebarHeaderProps = SidebarDivPartProps;
export type SidebarFooterPropsWithoutHTML = SidebarDivPartPropsWithoutHTML;
export type SidebarFooterProps = SidebarDivPartProps;
export type SidebarContentPropsWithoutHTML = SidebarDivPartPropsWithoutHTML;
export type SidebarContentProps = SidebarDivPartProps;
export type SidebarGroupPropsWithoutHTML = SidebarDivPartPropsWithoutHTML;
export type SidebarGroupProps = SidebarDivPartProps;
export type SidebarGroupLabelPropsWithoutHTML = SidebarDivPartPropsWithoutHTML;
export type SidebarGroupLabelProps = SidebarDivPartProps;
export type SidebarGroupContentPropsWithoutHTML = SidebarDivPartPropsWithoutHTML;
export type SidebarGroupContentProps = SidebarDivPartProps;
export type SidebarMenuBadgePropsWithoutHTML = SidebarDivPartPropsWithoutHTML;
export type SidebarMenuBadgeProps = SidebarDivPartProps;

export type SidebarInsetPropsWithoutHTML = WithChild<{}, { _default: never }, HTMLElement>;
export type SidebarInsetProps = SidebarInsetPropsWithoutHTML &
	Without<BitsPrimitiveElementAttributes, SidebarInsetPropsWithoutHTML>;

export type SidebarInputPropsWithoutHTML = WithChild<{}, { _default: never }, HTMLInputElement>;
export type SidebarInputProps = SidebarInputPropsWithoutHTML &
	Without<BitsPrimitiveInputAttributes, SidebarInputPropsWithoutHTML>;

export type SidebarSeparatorPropsWithoutHTML = WithChild<
	{ decorative?: boolean },
	{ _default: never },
	HTMLDivElement
>;
export type SidebarSeparatorProps = SidebarSeparatorPropsWithoutHTML &
	Without<BitsPrimitiveDivAttributes, SidebarSeparatorPropsWithoutHTML>;

type SidebarButtonPartPropsWithoutHTML = WithChild<
	{ disabled?: boolean },
	{ _default: never },
	HTMLButtonElement
>;
type SidebarButtonPartProps = SidebarButtonPartPropsWithoutHTML &
	Without<BitsPrimitiveButtonAttributes, SidebarButtonPartPropsWithoutHTML>;

export type SidebarGroupActionPropsWithoutHTML = SidebarButtonPartPropsWithoutHTML;
export type SidebarGroupActionProps = SidebarButtonPartProps;
export type SidebarMenuActionPropsWithoutHTML = SidebarButtonPartPropsWithoutHTML & {
	showOnHover?: boolean;
};
export type SidebarMenuActionProps = SidebarMenuActionPropsWithoutHTML &
	Without<BitsPrimitiveButtonAttributes, SidebarMenuActionPropsWithoutHTML>;

export type SidebarMenuPropsWithoutHTML = WithChild<{}, { _default: never }, HTMLUListElement>;
export type SidebarMenuProps = SidebarMenuPropsWithoutHTML &
	Without<BitsPrimitiveUListAttributes, SidebarMenuPropsWithoutHTML>;

export type SidebarMenuItemPropsWithoutHTML = WithChild<{}, { _default: never }, HTMLLIElement>;
export type SidebarMenuItemProps = SidebarMenuItemPropsWithoutHTML &
	Without<BitsPrimitiveLiAttributes, SidebarMenuItemPropsWithoutHTML>;

export type SidebarMenuButtonSnippetProps = { active: boolean };
export type SidebarMenuButtonPropsWithoutHTML = WithChild<
	{
		isActive?: boolean;
		size?: SidebarMenuButtonSize;
		variant?: SidebarMenuButtonVariant;
		disabled?: boolean;
	},
	SidebarMenuButtonSnippetProps,
	HTMLButtonElement
>;
export type SidebarMenuButtonProps = SidebarMenuButtonPropsWithoutHTML &
	Without<BitsPrimitiveButtonAttributes, SidebarMenuButtonPropsWithoutHTML>;

export type SidebarMenuSkeletonPropsWithoutHTML = WithChild<{
	showIcon?: boolean;
}>;
export type SidebarMenuSkeletonProps = SidebarMenuSkeletonPropsWithoutHTML &
	Without<BitsPrimitiveDivAttributes, SidebarMenuSkeletonPropsWithoutHTML>;

export type SidebarMenuSubPropsWithoutHTML = SidebarMenuPropsWithoutHTML;
export type SidebarMenuSubProps = SidebarMenuProps;
export type SidebarMenuSubItemPropsWithoutHTML = SidebarMenuItemPropsWithoutHTML;
export type SidebarMenuSubItemProps = SidebarMenuItemProps;

export type SidebarMenuSubButtonSnippetProps = { active: boolean };
export type SidebarMenuSubButtonPropsWithoutHTML = WithChild<
	{
		isActive?: boolean;
		size?: SidebarMenuSubButtonSize;
	},
	SidebarMenuSubButtonSnippetProps,
	HTMLAnchorElement
>;
export type SidebarMenuSubButtonProps = SidebarMenuSubButtonPropsWithoutHTML &
	Without<BitsPrimitiveAnchorAttributes, SidebarMenuSubButtonPropsWithoutHTML>;
