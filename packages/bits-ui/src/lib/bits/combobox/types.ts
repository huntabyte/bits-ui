import type { BitsPrimitiveInputAttributes, BitsPrimitiveButtonAttributes, BitsPrimitiveDivAttributes } from "$lib/shared/attributes.js";
import type {
	SelectBaseRootPropsWithoutHTML,
	SelectMultipleRootPropsWithoutHTML,
	SelectSingleRootPropsWithoutHTML,
} from "$lib/bits/select/types.js";
import type { WithChild, Without } from "$lib/internal/types.js";

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

	/**
	 * Whether to clear the input after any item is selected or deselected.
	 * Useful with the `Tags` component pattern where selected items are
	 * displayed as chips and the input should reset for the next search.
	 *
	 * Only applies to `type="multiple"` comboboxes.
	 *
	 * @default false
	 */
	clearInputOnSelect?: boolean;

	/**
	 * Whether to remove the last selected item when the user presses Backspace
	 * with an empty input. Useful with the `Tags` component pattern.
	 *
	 * Only applies to `type="multiple"` comboboxes.
	 *
	 * @default false
	 */
	removeOnBackspace?: boolean;
}>;

export type ComboboxInputProps = ComboboxInputPropsWithoutHTML &
	Without<Omit<BitsPrimitiveInputAttributes, "value">, ComboboxInputPropsWithoutHTML>;

export type ComboboxTagsPropsWithoutHTML = WithChild;

export type ComboboxTagsProps = ComboboxTagsPropsWithoutHTML &
	Without<BitsPrimitiveDivAttributes, ComboboxTagsPropsWithoutHTML>;

export type ComboboxTagSnippetProps = {
	value: string;
	label: string;
};

export type ComboboxTagPropsWithoutHTML = WithChild<
	{
		/**
		 * The value of the selected item this tag represents.
		 */
		value: string;
	},
	ComboboxTagSnippetProps
>;

export type ComboboxTagProps = ComboboxTagPropsWithoutHTML &
	Without<BitsPrimitiveDivAttributes, ComboboxTagPropsWithoutHTML>;

export type ComboboxTagRemoveButtonPropsWithoutHTML = WithChild;

export type ComboboxTagRemoveButtonProps = ComboboxTagRemoveButtonPropsWithoutHTML &
	Without<BitsPrimitiveButtonAttributes, ComboboxTagRemoveButtonPropsWithoutHTML>;
