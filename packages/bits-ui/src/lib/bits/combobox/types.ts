import type { BitsPrimitiveInputAttributes } from "$lib/shared/attributes.js";
import type { WithChild, Without } from "$lib/internal/types.js";

export type {
	ListboxBaseRootPropsWithoutHTML as ComboboxBaseRootPropsWithoutHTML,
	ListboxContentProps as ComboboxContentProps,
	ListboxContentPropsWithoutHTML as ComboboxContentPropsWithoutHTML,
	ListboxContentStaticProps as ComboboxContentStaticProps,
	ListboxContentStaticPropsWithoutHTML as ComboboxContentStaticPropsWithoutHTML,
	ListboxItemProps as ComboboxItemProps,
	ListboxItemPropsWithoutHTML as ComboboxItemPropsWithoutHTML,
	ListboxItemSnippetProps as ComboboxItemSnippetProps,
	ListboxMultipleRootProps as ComboboxMultipleRootProps,
	ListboxMultipleRootPropsWithoutHTML as ComboboxMultipleRootPropsWithoutHTML,
	ListboxRootProps as ComboboxRootProps,
	ListboxRootPropsWithoutHTML as ComboboxRootPropsWithoutHTML,
	ListboxSingleRootProps as ComboboxSingleRootProps,
	ListboxSingleRootPropsWithoutHTML as ComboboxSingleRootPropsWithoutHTML,
	ListboxTriggerProps as ComboboxTriggerProps,
	ListboxTriggerPropsWithoutHTML as ComboboxTriggerPropsWithoutHTML,
	ListboxGroupPropsWithoutHTML as ComboboxGroupPropsWithoutHTML,
	ListboxGroupProps as ComboboxGroupProps,
	ListboxGroupHeadingPropsWithoutHTML as ComboboxGroupHeadingPropsWithoutHTML,
	ListboxGroupHeadingProps as ComboboxGroupHeadingProps,
	ListboxViewportPropsWithoutHTML as ComboboxViewportPropsWithoutHTML,
	ListboxViewportProps as ComboboxViewportProps,
	ListboxScrollDownButtonProps as ComboboxScrollDownButtonProps,
	ListboxScrollDownButtonPropsWithoutHTML as ComboboxScrollDownButtonPropsWithoutHTML,
	ListboxScrollUpButtonProps as ComboboxScrollUpButtonProps,
	ListboxScrollUpButtonPropsWithoutHTML as ComboboxScrollUpButtonPropsWithoutHTML,
	ListboxArrowProps as ComboboxArrowProps,
	ListboxArrowPropsWithoutHTML as ComboboxArrowPropsWithoutHTML,
	ListboxPortalProps as ComboboxPortalProps,
	ListboxPortalPropsWithoutHTML as ComboboxPortalPropsWithoutHTML,
} from "$lib/bits/listbox/types.js";

export type ComboboxInputPropsWithoutHTML = WithChild<{
	/**
	 * The default value of the input. This is not a reactive prop and is only used to populate
	 * the input when the combobox is first mounted if there is already a value set.
	 */
	defaultValue?: string;
}>;

export type ComboboxInputProps = ComboboxInputPropsWithoutHTML &
	Without<Omit<BitsPrimitiveInputAttributes, "value">, ComboboxInputPropsWithoutHTML>;
