import type {
	ToggleGroupItemProps,
	ToggleGroupItemPropsWithoutHTML,
	ToggleGroupRootPropsWithoutHTML,
} from "../toggle-group/types.js";
import type { Orientation } from "$lib/shared/index.js";
import type {
	PrimitiveAnchorAttributes,
	PrimitiveButtonAttributes,
	PrimitiveDivAttributes,
	WithAsChild,
} from "$lib/internal/types.js";
import type { EventCallback } from "$lib/internal/events.js";

export type ToolbarRootPropsWithoutHTML = WithAsChild<{
	orientation?: Orientation;
	loop?: boolean;
}>;

export type ToolbarRootProps = ToolbarRootPropsWithoutHTML & PrimitiveDivAttributes;

export type ToolbarGroupPropsWithoutHTML = Omit<
	ToggleGroupRootPropsWithoutHTML,
	"orientation" | "loop" | "rovingFocus"
>;

export type ToolbarGroupProps = ToolbarGroupPropsWithoutHTML &
	Omit<PrimitiveDivAttributes, "value" | "disabled">;

export type ToolbarGroupItemPropsWithoutHTML = ToggleGroupItemPropsWithoutHTML;

export type ToolbarGroupItemProps = ToggleGroupItemProps;

export type ToolbarButtonPropsWithoutHTML = WithAsChild<{
	disabled?: boolean;
	onkeydown?: EventCallback<KeyboardEvent>;
}>;

export type ToolbarButtonProps = ToolbarButtonPropsWithoutHTML &
	Omit<PrimitiveButtonAttributes, "onkeydown" | "disabled">;

export type ToolbarLinkPropsWithoutHTML = WithAsChild<{
	onkeydown?: EventCallback<KeyboardEvent>;
}>;

export type ToolbarLinkProps = ToolbarLinkPropsWithoutHTML &
	Omit<PrimitiveAnchorAttributes, "onkeydown">;
