/**
 * We define prop types without the HTMLAttributes here so that we can use them
 * to type-check our API documentation, which requires we document each prop,
 * but we don't want to document the HTML attributes.
 */
import type { CreateSelectProps, SelectOptionProps } from "@melt-ui/svelte";
import type { AsChild, Expand, OmitFloating, OnChangeFn } from "$lib/internal/index.js";
import type { ContentProps, ArrowProps } from "$lib/bits/floating/_types.js";
import type { Selected } from "$lib";

export type WhenTrue<TrueOrFalse, IfTrue, IfFalse, IfNeither = IfTrue | IfFalse> = [
	TrueOrFalse
] extends [true]
	? IfTrue
	: [TrueOrFalse] extends [false]
	? IfFalse
	: IfNeither;

type SelectValue<T, Multiple extends boolean> = WhenTrue<Multiple, T[] | undefined, T | undefined>;

type Props<T = unknown, Multiple extends boolean = false> = Expand<
	OmitFloating<
		Omit<CreateSelectProps, "selected" | "defaultSelected" | "onSelectedChange" | "multiple">
	> & {
		/**
		 * The selected value of the select.
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
		 * The open state of the select menu.
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
		 * Optionally provide an array of `Selected<T>` objects to
		 * type the `selected` and `onSelectedChange` props.
		 */
		items?: Selected<T>[];
	}
>;

type GroupProps = AsChild;
type InputProps = AsChild;
type LabelProps = AsChild;
type ItemProps = Expand<SelectOptionProps & AsChild>;
type SeparatorProps = AsChild;

type IndicatorProps = AsChild;

type TriggerProps = AsChild;

type ValueProps = Expand<
	{
		/**
		 * The placeholder text to display when there is no value.
		 *
		 * @defaultValue ""
		 */
		placeholder?: string;
	} & AsChild
>;

export type {
	Props,
	ArrowProps,
	ContentProps,
	IndicatorProps,
	GroupProps,
	InputProps,
	LabelProps,
	ItemProps,
	SeparatorProps,
	TriggerProps,
	ValueProps
};
