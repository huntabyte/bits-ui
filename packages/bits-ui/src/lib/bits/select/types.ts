import type { Snippet } from "svelte";
import type { PopperLayerProps } from "../utilities/popper-layer/types.js";
import type { ArrowProps, ArrowPropsWithoutHTML } from "../utilities/arrow/types.js";
import type {
	OnChangeFn,
	PrimitiveButtonAttributes,
	PrimitiveDivAttributes,
	PrimitiveSpanAttributes,
	WithAsChild,
	WithChildren,
	Without,
} from "$lib/internal/types.js";
import type { Direction } from "$lib/shared/index.js";
import type { PortalProps } from "$lib/bits/utilities/portal/index.js";

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
	 *  `item-aligned` - behaves similarly to a native MacOS menu by positioning content relative to the active item. <br>
	 *  `floating  (default)` - positions content in the same way as our other primitives, for example `Popover` or `DropdownMenu`.
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

export type SelectItemPropsWithoutHTML = Omit<
	WithAsChild<
		{
			/**
			 * The value of the item.
			 */
			value: string;

			/**
			 * Whether the item is disabled.
			 *
			 * @defaultValue false
			 */
			disabled?: boolean;

			/**
			 * Optionally provide text to use for typeahead purposes.
			 *
			 * By default, the typeahead behavior will use the `textContent` of the `SelectItemText`
			 * component. Use this prop if the text content is not suitable for typeahead.
			 */
			textValue?: string;
		},
		{ selected: boolean }
	>,
	"children"
> & {
	children?: Snippet<[{ selected: boolean }]>;
};

export type SelectItemProps = SelectItemPropsWithoutHTML &
	Without<PrimitiveDivAttributes, SelectItemPropsWithoutHTML>;

export type SelectTriggerPropsWithoutHTML = WithAsChild<{
	/**
	 * Whether the trigger is disabled.
	 *
	 * @defaultValue false
	 */
	disabled?: boolean;
}>;

export type SelectTriggerProps = SelectTriggerPropsWithoutHTML &
	Without<PrimitiveButtonAttributes, SelectTriggerPropsWithoutHTML>;

export type SelectValuePropsWithoutHTML = WithAsChild<{
	/**
	 * The content to render inside the `Select.Value` when no `value` is set.
	 */
	placeholder?: string;
}>;

export type SelectValueProps = SelectValuePropsWithoutHTML &
	Without<Omit<PrimitiveSpanAttributes, "id">, SelectValuePropsWithoutHTML>;

export type SelectItemTextPropsWithoutHTML = WithAsChild<{}>;

export type SelectItemTextProps = SelectItemTextPropsWithoutHTML &
	Without<PrimitiveSpanAttributes, SelectItemTextPropsWithoutHTML>;

export type SelectViewportPropsWithoutHTML = WithAsChild<{}>;
export type SelectViewportProps = SelectViewportPropsWithoutHTML &
	Without<PrimitiveDivAttributes, SelectViewportPropsWithoutHTML>;

export type SelectPortalPropsWithoutHTML = PortalProps;
export type SelectPortalProps = SelectPortalPropsWithoutHTML;

export type SelectScrollButtonPropsWithoutHTML = WithAsChild<{}>;

export type SelectScrollButtonProps = SelectScrollButtonPropsWithoutHTML &
	Without<PrimitiveDivAttributes, SelectScrollButtonPropsWithoutHTML>;

export type SelectIconPropsWithoutHTML = WithAsChild<{}>;

export type SelectIconProps = SelectIconPropsWithoutHTML &
	Without<PrimitiveSpanAttributes, SelectIconPropsWithoutHTML>;

export type SelectGroupPropsWithoutHTML = WithAsChild<{}>;

export type SelectGroupProps = SelectGroupPropsWithoutHTML &
	Without<PrimitiveDivAttributes, SelectGroupPropsWithoutHTML>;

export type SelectGroupLabelPropsWithoutHTML = WithAsChild<{}>;

export type SelectGroupLabelProps = SelectGroupLabelPropsWithoutHTML &
	Without<PrimitiveDivAttributes, SelectGroupLabelPropsWithoutHTML>;

export type SelectSeparatorPropsWithoutHTML = WithAsChild<{}>;

export type SelectSeparatorProps = SelectSeparatorPropsWithoutHTML &
	Without<PrimitiveDivAttributes, SelectSeparatorPropsWithoutHTML>;

export type SelectArrowPropsWithoutHTML = ArrowPropsWithoutHTML;

export type SelectArrowProps = ArrowProps;
