/**
 * We define prop types without the HTMLAttributes here so that we can use them
 * to type-check our API documentation, which requires we document each prop,
 * but we don't want to document the HTML attributes.
 */
import type { CreateSelectProps, SelectOptionProps } from "@melt-ui/svelte";
import type {
	AsChild,
	Expand,
	OmitForceVisible,
	OmitIds,
	OmitOpen,
	OnChangeFn,
	Transition,
	TransitionProps
} from "$lib/internal/index.js";
import type { _ArrowProps } from "$lib/shared/types.js";

type Props<T = unknown> = Expand<
	OmitOpen<
		OmitForceVisible<
			OmitIds<
				Omit<CreateSelectProps, "selected" | "defaultSelected" | "onSelectedChange" | "arrowSize">
			>
		>
	> & {
		/**
		 * The selected value of the select.
		 * You can bind this to a value to programmatically control the selected value.
		 *
		 * @defaultValue undefined
		 */
		selected?: CreateSelectProps["defaultSelected"] & {};

		/**
		 * A callback function called when the selected value changes.
		 */
		onSelectedChange?: OnChangeFn<T>;

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
	}
>;

type ContentProps<
	T extends Transition = Transition,
	In extends Transition = Transition,
	Out extends Transition = Transition
> = Expand<TransitionProps<T, In, Out> & AsChild>;

type GroupProps = AsChild;
type InputProps = AsChild;
type LabelProps = AsChild;
type ItemProps = Expand<SelectOptionProps & AsChild>;
type SeparatorProps = AsChild;

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

type ArrowProps = _ArrowProps;

export type {
	Props,
	ArrowProps,
	ContentProps,
	GroupProps,
	InputProps,
	LabelProps,
	ItemProps,
	SeparatorProps,
	TriggerProps,
	ValueProps
};
