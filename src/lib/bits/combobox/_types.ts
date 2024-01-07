/**
 * We define prop types without the HTMLAttributes here so that we can use them
 * to type-check our API documentation, which requires we document each prop,
 * but we don't want to document the HTML attributes.
 */
import type { CreateComboboxProps, ComboboxOptionProps } from "@melt-ui/svelte";
import type { DOMElement, Expand, OmitFloating, OnChangeFn } from "$lib/internal/index";
import type { ContentProps as MenuProps, ArrowProps } from "$lib/bits/floating/_types";
import type { Selected as SharedSelected } from "$lib";

export type WhenTrue<TrueOrFalse, IfTrue, IfFalse, IfNeither = IfTrue | IfFalse> = [
	TrueOrFalse
] extends [true]
	? IfTrue
	: [TrueOrFalse] extends [false]
	? IfFalse
	: IfNeither;

type Selected<T> = SharedSelected<T> & { disabled?: boolean };
type SelectValue<T, Multiple extends boolean> = WhenTrue<Multiple, T[] | undefined, T | undefined>;

type Props<T = unknown, Multiple extends boolean = false> = Expand<
	OmitFloating<
		Omit<CreateComboboxProps, "selected" | "defaultSelected" | "onSelectedChange" | "inputValue" |"multiple">
	> & {
		/**
		 * The selected value of the combobox.
		 * You can bind this to a value to programmatically control the selected value.
		 *
		 * @defaultValue undefined
		 */
		selected?: SelectValue<Selected<T>, Multiple> | undefined;

		/**
		 * A callback function called when the selected value changes.
		 */
		onSelectedChange?: OnChangeFn<SelectValue<Selected<T>, Multiple>>;

		/**
		 * The open state of the combobox menu.
		 * You can bind this to a boolean value to programmatically control the open state.
		 *
		 * @defaultValue false
		 */
		open?: boolean;

		/**
		 * A callback function called when the open state changes.
		 */
		onOpenChange?: OnChangeFn<boolean>;

		/**
		 * Whether or not multiple values can be selected.
		 */
		multiple?: Multiple;

		/**
		 * The value of the input.
		 * You can bind this to a value to programmatically control the input value.
		 *
		 * @defaultValue ""
		 */
		inputValue?: string;

		/**
		 * Optionally provide an array of `Selected<T>` objects to
		 * type the `selected` and `onSelectedChange` props.
		 */
		items?: Selected<T>[];
	}
>;

type InputProps = DOMElement<HTMLInputElement>;
type ContentProps = DOMElement;
type LabelProps = DOMElement<HTMLLabelElement>;
type ItemProps = Expand<ComboboxOptionProps & DOMElement>;
type IndicatorProps = DOMElement;
type HiddenInputProps = DOMElement;

export type {
	Props,
	ContentProps,
	InputProps,
	LabelProps,
	MenuProps,
	ItemProps,
	IndicatorProps,
	ArrowProps,
	HiddenInputProps
};
