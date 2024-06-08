import type { PopperLayerProps } from "../utilities/popper-layer/types.js";
import type {
	OnChangeFn,
	PrimitiveDivAttributes,
	WithAsChild,
	WithChildren,
	Without,
} from "$lib/internal/types.js";
import type { Direction } from "$lib/shared/index.js";

export type SelectRootPropsWithoutHTML = WithChildren<{
	/**
	 * The open state of the select.
	 */
	open?: boolean;

	/**
	 * A callback that is called when the select's open state changes.
	 */
	onOpenChange?: OnChangeFn<boolean>;

	/**
	 * The value of the select.
	 */
	value?: string;

	/**
	 * A callback that is called when the select's value changes.
	 */
	onValueChange?: OnChangeFn<string>;

	/**
	 * The reading direction of the select.
	 */
	dir?: Direction;

	/**
	 * The name of the select used in form submission.
	 */
	name?: string;

	/**
	 * The native HTML select autocomplete attribute.
	 */
	autocomplete?: string;

	/**
	 * Whether the select is disabled.
	 */
	disabled?: boolean;

	/**
	 * Whether the select is required.
	 */
	required?: boolean;
}>;

export type SelectRootProps = SelectRootPropsWithoutHTML;

export type SelectContentImplPropsWithoutHTML = WithAsChild<PopperLayerProps> & {
	/**
	 *  The positioning mode to use
	 *
	 *  `item-aligned (default)` - behaves similarly to a native MacOS menu by positioning content relative to the active item. <br>
	 *  `floating` - positions content in the same way as our other primitives, for example `Popover` or `DropdownMenu`.
	 */
	position?: "item-aligned" | "floating";
};

export type SelectContentImplProps = SelectContentImplPropsWithoutHTML &
	Without<PrimitiveDivAttributes, SelectContentImplPropsWithoutHTML>;

export type SelectContentPropsWithoutHTML = SelectContentImplPropsWithoutHTML & {
	/**
	 * Whether to force mount the content for use with certain animation libraries.
	 */
	forceMount?: boolean;
};

export type SelectContentProps = SelectContentPropsWithoutHTML &
	Without<PrimitiveDivAttributes, SelectContentPropsWithoutHTML>;
