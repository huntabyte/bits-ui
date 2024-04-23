import type { ToggleGroupItemProps } from "@melt-ui/svelte";
import type {
	ToggleGroupItemPropsWithoutHTML,
	ToggleGroupRootProps,
	ToggleGroupRootPropsWithoutHTML,
} from "../toggle-group/types.js";
import type { Orientation } from "$lib/shared/index.js";
import type { PrimitiveDivAttributes, WithAsChild } from "$lib/internal/types.js";

export type ToolbarRootPropsWithoutHTML = WithAsChild<{
	orientation?: Orientation;
	loop?: boolean;
}>;

export type ToolbarRootProps = ToolbarRootPropsWithoutHTML & PrimitiveDivAttributes;

export type ToolbarGroupPropsWithoutHTML = ToggleGroupRootPropsWithoutHTML;

export type ToolbarGroupProps = ToggleGroupRootProps;

export type ToolbarItemPropsWithoutHTML = ToggleGroupItemPropsWithoutHTML;

export type ToolbarItemProps = ToggleGroupItemProps;
