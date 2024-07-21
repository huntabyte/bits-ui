import type {
	OnChangeFn,
	PrimitiveButtonAttributes,
	PrimitiveDivAttributes,
	PrimitiveInputAttributes,
	WithChild,
	WithChildren,
	Without,
} from "$lib/internal/types.js";
import type { PortalProps } from "../utilities/portal/types.js";
import type { PopperLayerProps } from "../utilities/popper-layer/types.js";
import type { ArrowProps, ArrowPropsWithoutHTML } from "../utilities/arrow/types.js";

export type ComboboxBaseRootPropsWithoutHTML = WithChildren<{
	/**
	 * Whether the combobox is disabled.
	 *
	 * @defaultValue `false`
	 */
	disabled?: boolean;

	/**
	 * Whether the combobox is required (for form submission).
	 *
	 * @defaultValue `false`
	 */
	required?: boolean;

	/**
	 * The name to apply to the hidden input element for form submission.
	 * If not provided, a hidden input will not be rendered and the combobox will not be part of a form.
	 */
	name?: string;

	/**
	 * Whether the combobox popover is open.
	 *
	 * @defaultValue `false`
	 * @bindable
	 */
	open?: boolean;

	/**
	 * A callback function called when the open state changes.
	 */
	onOpenChange?: OnChangeFn<boolean>;

	/**
	 * Whether or not the combobox menu should loop through the items when navigating with the keyboard.
	 *
	 * @defaultValue `false`
	 */
	loop?: boolean;

	/**
	 * How to scroll the combobox items into view when navigating with the keyboard.
	 *
	 * @defaultValue `"nearest"`
	 */
	scrollAlignment?: "nearest" | "center";
}>;

export type ComboboxSingleRootPropsWithoutHTML = {
	/**
	 * The value of the selected combobox item.
	 *
	 * @bindable
	 */
	value?: string;

	/**
	 * A callback function called when the value changes.
	 */
	onValueChange?: OnChangeFn<string>;

	/**
	 * The type of combobox.
	 *
	 * @required
	 */
	type: "single";
};

export type ComboboxMultipleRootPropsWithoutHTML = {
	/**
	 * The value of the selected combobox item.
	 *
	 * @bindable
	 */
	value?: string[];

	/**
	 * A callback function called when the value changes.
	 */
	onValueChange?: OnChangeFn<string[]>;

	/**
	 * The type of combobox.
	 *
	 * @required
	 */
	type: "multiple";
};

export type ComboboxSingleRootProps = ComboboxBaseRootPropsWithoutHTML &
	ComboboxSingleRootPropsWithoutHTML &
	Without<
		PrimitiveDivAttributes,
		ComboboxSingleRootPropsWithoutHTML | ComboboxBaseRootPropsWithoutHTML
	>;

export type ComboboxMultipleRootProps = ComboboxBaseRootPropsWithoutHTML &
	ComboboxMultipleRootPropsWithoutHTML &
	Without<
		PrimitiveDivAttributes,
		ComboboxMultipleRootPropsWithoutHTML | ComboboxBaseRootPropsWithoutHTML
	>;

export type ComboboxRootPropsWithoutHTML = ComboboxBaseRootPropsWithoutHTML &
	(ComboboxSingleRootPropsWithoutHTML | ComboboxMultipleRootPropsWithoutHTML);

export type ComboboxRootProps = ComboboxRootPropsWithoutHTML;

export type ComboboxInputPropsWithoutHTML = WithChild<{
	/**
	 * The default value of the input. This is not a reactive prop and is only used to populate
	 * the input when the combobox is first mounted if there is already a value set.
	 */
	defaultValue?: string;
}>;

export type ComboboxInputProps = ComboboxInputPropsWithoutHTML &
	Without<Omit<PrimitiveInputAttributes, "value">, ComboboxInputPropsWithoutHTML>;

export type ComboboxContentPropsWithoutHTML = WithChild<PopperLayerProps>;

export type ComboboxContentProps = ComboboxContentPropsWithoutHTML &
	Without<PrimitiveDivAttributes, ComboboxContentPropsWithoutHTML>;

export type ComboboxTriggerPropsWithoutHTML = WithChild;

export type ComboboxTriggerProps = ComboboxTriggerPropsWithoutHTML &
	Without<PrimitiveButtonAttributes, ComboboxTriggerPropsWithoutHTML>;

export type ComboboxItemSnippetProps = { selected: boolean; highlighted: boolean };

export type ComboboxItemPropsWithoutHTML = WithChild<
	{
		/**
		 * The value of the item.
		 *
		 * @required
		 */
		value: string;

		/**
		 * The label of the item. If provided, this is the item that users will search for.
		 * If not provided, the value will be used as the label.
		 */
		label?: string;

		/**
		 * Whether the item is disabled.
		 *
		 * @defaultValeu `false`
		 */
		disabled?: boolean;

		/**
		 * A callback function called when the item is highlighted. This can be used as a
		 * replacement for `onfocus` since we don't actually focus the item and instead
		 * rely on the `aria-activedescendant` attribute to indicate the highlighted item.
		 */
		onHighlight?: () => void;

		/**
		 * A callback function called when the item is unhighlighted. This can be used as a
		 * replacement for `onblur` since we don't actually focus the item and instead
		 * rely on the `aria-activedescendant` attribute to indicate the highlighted item.
		 */
		onUnhighlight?: () => void;
	},
	ComboboxItemSnippetProps
>;

export type ComboboxItemProps = ComboboxItemPropsWithoutHTML &
	Without<PrimitiveDivAttributes, ComboboxItemPropsWithoutHTML>;

export type ComboboxGroupPropsWithoutHTML = WithChild;

export type ComboboxGroupProps = ComboboxGroupPropsWithoutHTML &
	Without<PrimitiveDivAttributes, ComboboxGroupPropsWithoutHTML>;

export type ComboboxGroupLabelPropsWithoutHTML = WithChild;

export type ComboboxGroupLabelProps = ComboboxGroupLabelPropsWithoutHTML &
	Without<PrimitiveDivAttributes, ComboboxGroupLabelPropsWithoutHTML>;

export type ComboboxSeparatorPropsWithoutHTML = WithChild;

export type ComboboxSeparatorProps = ComboboxSeparatorPropsWithoutHTML &
	Without<PrimitiveDivAttributes, ComboboxSeparatorPropsWithoutHTML>;

export type ComboboxPortalPropsWithoutHTML = PortalProps;

export type ComboboxPortalProps = ComboboxPortalPropsWithoutHTML;

export type ComboboxArrowPropsWithoutHTML = ArrowPropsWithoutHTML;

export type ComboboxArrowProps = ArrowProps;
