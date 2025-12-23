import type {
	BitsPrimitiveButtonAttributes,
	BitsPrimitiveDivAttributes,
	BitsPrimitiveInputAttributes,
} from "$lib/shared/attributes.js";
import type {
	SelectBaseRootPropsWithoutHTML,
	SelectMultipleRootPropsWithoutHTML,
	SelectSingleRootPropsWithoutHTML,
} from "$lib/bits/select/types.js";
import type { WithChild, Without } from "$lib/internal/types.js";
import type { SelectedItem } from "$lib/bits/select/select.svelte.js";

export type ComboboxBaseRootPropsWithoutHTML = Omit<
	SelectBaseRootPropsWithoutHTML,
	"autocomplete"
> & {
	/**
	 * A read-only value that can be used to programmatically
	 * update the input value.
	 *
	 * This is useful for updating the displayed label/input
	 * when the value changes outside of Bits UI.
	 */
	inputValue?: string;
};

export type ComboboxSingleRootPropsWithoutHTML = ComboboxBaseRootPropsWithoutHTML &
	SelectSingleRootPropsWithoutHTML;

export type ComboboxSingleRootProps = ComboboxSingleRootPropsWithoutHTML;

export type ComboboxMultipleRootPropsWithoutHTML = ComboboxBaseRootPropsWithoutHTML &
	SelectMultipleRootPropsWithoutHTML;
export type ComboboxMultipleRootProps = ComboboxMultipleRootPropsWithoutHTML;

export type ComboboxRootPropsWithoutHTML = ComboboxBaseRootPropsWithoutHTML &
	(ComboboxSingleRootPropsWithoutHTML | ComboboxMultipleRootPropsWithoutHTML);

export type ComboboxRootProps = ComboboxRootPropsWithoutHTML;

export type {
	SelectContentProps as ComboboxContentProps,
	SelectContentPropsWithoutHTML as ComboboxContentPropsWithoutHTML,
	SelectContentStaticProps as ComboboxContentStaticProps,
	SelectContentStaticPropsWithoutHTML as ComboboxContentStaticPropsWithoutHTML,
	SelectItemProps as ComboboxItemProps,
	SelectItemPropsWithoutHTML as ComboboxItemPropsWithoutHTML,
	SelectItemSnippetProps as ComboboxItemSnippetProps,
	SelectTriggerProps as ComboboxTriggerProps,
	SelectTriggerPropsWithoutHTML as ComboboxTriggerPropsWithoutHTML,
	SelectGroupPropsWithoutHTML as ComboboxGroupPropsWithoutHTML,
	SelectGroupProps as ComboboxGroupProps,
	SelectGroupHeadingPropsWithoutHTML as ComboboxGroupHeadingPropsWithoutHTML,
	SelectGroupHeadingProps as ComboboxGroupHeadingProps,
	SelectViewportPropsWithoutHTML as ComboboxViewportPropsWithoutHTML,
	SelectViewportProps as ComboboxViewportProps,
	SelectScrollDownButtonProps as ComboboxScrollDownButtonProps,
	SelectScrollDownButtonPropsWithoutHTML as ComboboxScrollDownButtonPropsWithoutHTML,
	SelectScrollUpButtonProps as ComboboxScrollUpButtonProps,
	SelectScrollUpButtonPropsWithoutHTML as ComboboxScrollUpButtonPropsWithoutHTML,
	SelectArrowProps as ComboboxArrowProps,
	SelectArrowPropsWithoutHTML as ComboboxArrowPropsWithoutHTML,
	SelectPortalProps as ComboboxPortalProps,
	SelectPortalPropsWithoutHTML as ComboboxPortalPropsWithoutHTML,
} from "$lib/bits/select/types.js";

export type ComboboxInputPropsWithoutHTML = WithChild<{
	/**
	 * The default value of the input. This is not a reactive prop and is only used to populate
	 * the input when the combobox is first mounted if there is already a value set.
	 */
	defaultValue?: string;

	/**
	 * Whether to clear the input when the last item is deselected.
	 *
	 * @default false
	 */
	clearOnDeselect?: boolean;
}>;

export type ComboboxInputProps = ComboboxInputPropsWithoutHTML &
	Without<Omit<BitsPrimitiveInputAttributes, "value">, ComboboxInputPropsWithoutHTML>;

//
// CHIPS
//

export type ComboboxChipsSnippetProps = {
	/**
	 * An array of selected items with their values and labels.
	 * Derived from the Root's `items` prop filtered to selected values.
	 * If no `items` array is provided, value is used for both value and label.
	 */
	selectedItems: SelectedItem[];
};

export type ComboboxChipsPropsWithoutHTML = WithChild<{}, ComboboxChipsSnippetProps>;

export type ComboboxChipsProps = ComboboxChipsPropsWithoutHTML &
	Without<BitsPrimitiveDivAttributes, ComboboxChipsPropsWithoutHTML>;

export type ComboboxChipSnippetProps = {
	/**
	 * The value of this chip.
	 */
	value: string;
	/**
	 * The label for this chip (derived from items array or equals value).
	 */
	label: string;
	/**
	 * Whether the chip is disabled.
	 */
	disabled: boolean;
	/**
	 * Whether the chip is currently highlighted (has focus).
	 */
	highlighted: boolean;
};

export type ComboboxChipPropsWithoutHTML = WithChild<
	{
		/**
		 * The value of the chip. This should match one of the selected values.
		 * @required
		 */
		value: string;

		/**
		 * Whether the chip is disabled.
		 * @default false
		 */
		disabled?: boolean;
	},
	ComboboxChipSnippetProps
>;

export type ComboboxChipProps = ComboboxChipPropsWithoutHTML &
	Without<BitsPrimitiveDivAttributes, ComboboxChipPropsWithoutHTML>;

export type ComboboxChipRemovePropsWithoutHTML = WithChild;

export type ComboboxChipRemoveProps = ComboboxChipRemovePropsWithoutHTML &
	Without<BitsPrimitiveButtonAttributes, ComboboxChipRemovePropsWithoutHTML>;
