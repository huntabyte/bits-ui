/**
 * We define prop types without the HTMLAttributes here so that we can use them
 * to type-check our API documentation, which requires we document each prop,
 * but we don't want to document the HTML attributes.
 */
import type { ComboboxOptionProps, CreateComboboxProps } from "@melt-ui/svelte";
import type { DOMElement, Expand, OmitFloating, OnChangeFn } from "$lib/internal/index.js";
import type { ArrowProps, ContentProps } from "$lib/bits/floating/_types.js";
import type { Selected } from "$lib/index.js";

export type WhenTrue<TrueOrFalse, IfTrue, IfFalse, IfNeither = IfTrue | IfFalse> = [
	TrueOrFalse,
] extends [true]
	? IfTrue
	: [TrueOrFalse] extends [false]
		? IfFalse
		: IfNeither;

type SelectValue<T, Multiple extends boolean> = WhenTrue<Multiple, T[] | undefined, T | undefined>;

type Props<T = unknown, Multiple extends boolean = false> = Expand<
	OmitFloating<
		Omit<CreateComboboxProps, "selected" | "defaultSelected" | "onSelectedChange" | "multiple">
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

		/**
		 * Whether the input has been touched or not. You can bind to this to
		 * handle filtering the items only when the input has been touched.
		 *
		 * @defaultValue false
		 */
		touchedInput?: boolean;
	}
>;

type InputProps = DOMElement<HTMLInputElement>;
type LabelProps = DOMElement<HTMLLabelElement>;

type GroupProps = DOMElement;
type GroupLabelProps = DOMElement;

type ItemProps = Expand<ComboboxOptionProps & DOMElement>;

type HiddenInputProps = DOMElement;
type SeparatorProps = DOMElement;
type IndicatorProps = DOMElement;

export type {
	Props,
	ContentProps,
	InputProps,
	ItemProps,
	LabelProps,
	GroupProps,
	GroupLabelProps,
	ArrowProps,
	HiddenInputProps,
	SeparatorProps,
	IndicatorProps,
};
