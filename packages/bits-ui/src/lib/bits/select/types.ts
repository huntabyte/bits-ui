import type { HTMLSelectAttributes } from "svelte/elements";
import type { Expand } from "svelte-toolbelt";
import type { PopperLayerProps } from "../utilities/popper-layer/types.js";
import type { ArrowProps, ArrowPropsWithoutHTML } from "../utilities/arrow/types.js";
import type { OnChangeFn, WithChild, WithChildren, Without } from "$lib/internal/types.js";
import type {
	PrimitiveButtonAttributes,
	PrimitiveDivAttributes,
	PrimitiveSpanAttributes,
} from "$lib/shared/attributes.js";
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
	autocomplete?: HTMLSelectAttributes["autocomplete"];

	/**
	 * The native HTML select `form` attribute.
	 */
	form?: string;

	/**
	 * Whether the select is disabled.
	 */
	disabled?: boolean;

	/**
	 * Whether the select is required.
	 */
	required?: boolean;

	/**
	 * Whether or not the open state is controlled or not. If `true`, the component will not update
	 * the open state internally, instead it will call `onOpenChange` when it would have
	 * otherwise, and it is up to you to update the `open` prop that is passed to the component.
	 *
	 * @defaultValue false
	 */
	controlledOpen?: boolean;

	/**
	 * Whether or not the value state is controlled or not. If `true`, the component will not update
	 * the value state internally, instead it will call `onValueChange` when it would have
	 * otherwise, and it is up to you to update the `value` prop that is passed to the component.
	 *
	 * @defaultValue false
	 */
	controlledValue?: boolean;
}>;

export type SelectRootProps = SelectRootPropsWithoutHTML;

export type _SharedSelectContentProps = {
	/**
	 * Whether or not to loop through the items when navigating with the keyboard.
	 *
	 * @defaultValue `false`
	 */
	loop?: boolean;
};

export type SelectContentImplPropsWithoutHTML = Expand<
	WithChild<
		Omit<PopperLayerProps, "content"> & {
			/**
			 *  The positioning mode to use
			 *
			 *  `item-aligned` - behaves similarly to a native MacOS menu by positioning content relative to the active item. <br>
			 *  `floating  (default)` - positions content in the same way as our other primitives, for example `Popover` or `DropdownMenu`.
			 */
			position?: "item-aligned" | "floating";
		} & _SharedSelectContentProps
	>
>;

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

export type SelectItemSnippetProps = { selected: boolean };

export type SelectItemPropsWithoutHTML = WithChild<
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
	SelectItemSnippetProps
>;

export type SelectItemProps = SelectItemPropsWithoutHTML &
	Without<PrimitiveDivAttributes, SelectItemPropsWithoutHTML>;

export type SelectTriggerPropsWithoutHTML = WithChild<{
	/**
	 * Whether the trigger is disabled.
	 *
	 * @defaultValue false
	 */
	disabled?: boolean | null | undefined;
}>;

export type SelectTriggerProps = SelectTriggerPropsWithoutHTML &
	Without<PrimitiveButtonAttributes, SelectTriggerPropsWithoutHTML>;

export type SelectValuePropsWithoutHTML = WithChild<{
	/**
	 * The content to render inside the `Select.Value` when no `value` is set.
	 */
	placeholder?: string;
}>;

export type SelectValueProps = SelectValuePropsWithoutHTML &
	Without<Omit<PrimitiveSpanAttributes, "id">, SelectValuePropsWithoutHTML>;

export type SelectItemTextPropsWithoutHTML = WithChild;

export type SelectItemTextProps = SelectItemTextPropsWithoutHTML &
	Without<PrimitiveSpanAttributes, SelectItemTextPropsWithoutHTML>;

export type SelectViewportPropsWithoutHTML = WithChild;
export type SelectViewportProps = SelectViewportPropsWithoutHTML &
	Without<PrimitiveDivAttributes, SelectViewportPropsWithoutHTML>;

export type SelectPortalPropsWithoutHTML = PortalProps;
export type SelectPortalProps = SelectPortalPropsWithoutHTML;

export type SelectScrollUpButtonPropsWithoutHTML = WithChild;

export type SelectScrollUpButtonProps = SelectScrollUpButtonPropsWithoutHTML &
	Without<PrimitiveDivAttributes, SelectScrollUpButtonPropsWithoutHTML>;

export type SelectScrollDownButtonPropsWithoutHTML = WithChild;

export type SelectScrollDownButtonProps = SelectScrollDownButtonPropsWithoutHTML &
	Without<PrimitiveDivAttributes, SelectScrollDownButtonPropsWithoutHTML>;

export type SelectIconPropsWithoutHTML = WithChild;

export type SelectIconProps = SelectIconPropsWithoutHTML &
	Without<PrimitiveSpanAttributes, SelectIconPropsWithoutHTML>;

export type SelectGroupPropsWithoutHTML = WithChild;

export type SelectGroupProps = SelectGroupPropsWithoutHTML &
	Without<PrimitiveDivAttributes, SelectGroupPropsWithoutHTML>;

export type SelectGroupHeadingPropsWithoutHTML = WithChild;

export type SelectGroupHeadingProps = SelectGroupHeadingPropsWithoutHTML &
	Without<PrimitiveDivAttributes, SelectGroupHeadingPropsWithoutHTML>;

export type SelectSeparatorPropsWithoutHTML = WithChild;

export type SelectSeparatorProps = SelectSeparatorPropsWithoutHTML &
	Without<PrimitiveDivAttributes, SelectSeparatorPropsWithoutHTML>;

export type SelectArrowPropsWithoutHTML = ArrowPropsWithoutHTML;

export type SelectArrowProps = ArrowProps;
