/**
 * We define prop types without the HTMLAttributes here so that we can use them
 * to type-check our API documentation, which requires we document each prop,
 * but we don't want to document the HTML attributes.
 */
import type { CreateSelectProps, SelectOptionProps } from "@melt-ui/svelte";
import type { AsChild, Expand, OmitFloating, OnChangeFn } from "$lib/internal/index.js";
import type { ContentProps, ArrowProps } from "$lib/bits/floating/_types.js";

type Props<T = unknown, Multiple extends boolean = false> = Expand<
	OmitFloating<Omit<CreateSelectProps, "selected" | "defaultSelected" | "onSelectedChange">> & {
		/**
		 * The selected value of the select.
		 * You can bind this to a value to programmatically control the selected value.
		 *
		 * @defaultValue undefined
		 */
		selected?: CreateSelectProps<T, Multiple>["defaultSelected"] & {};

		/**
		 * A callback function called when the selected value changes.
		 */
		onSelectedChange?: OnChangeFn<CreateSelectProps<T, Multiple>["defaultSelected"]>;

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
		 *
		 */
		multiple?: Multiple;
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
