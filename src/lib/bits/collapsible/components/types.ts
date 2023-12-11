import type {
	OnChangeFn,
	PrimitiveButtonAttributes,
	PrimitiveDivAttributes,
	Transition,
	TransitionProps
} from "$lib/internal";
import type { AsChildProps, DefaultProps, Without } from "$lib/internal/new/types";

type BaseCollapsibleProps = {
	/**
	 * Whether the collapsible is disabled, which
	 * prevents it from being opened or closed, depending
	 * on its initial state.
	 *
	 * @default false
	 */
	disabled?: boolean;

	/**
	 * The default open state of the collapsible.
	 *
	 * @default false
	 */
	defaultOpen?: boolean;

	/**
	 * The open state of the collapsible, which can be
	 * used to programatically control the open state from
	 * outside the component if provided.
	 *
	 * @default false
	 */
	open?: boolean;

	/**
	 * A callback function called when the open state changes.
	 * It receives the new open state as its only argument.
	 */
	onOpenChange?: OnChangeFn<boolean>;
} & PrimitiveDivAttributes;

export type CollapsibleProps =
	| AsChildProps<BaseCollapsibleProps>
	| DefaultProps<BaseCollapsibleProps>;

export type CollapsibleWithoutHTML = Omit<BaseCollapsibleProps, keyof PrimitiveDivAttributes>;

export interface BaseCollapsibleContentProps<
	T extends Transition = Transition,
	In extends Transition = Transition,
	Out extends Transition = Transition
> extends PrimitiveDivAttributes,
		TransitionProps<T, In, Out> {}

export type CollapsibleContentProps<
	T extends Transition = Transition,
	In extends Transition = Transition,
	Out extends Transition = Transition
> =
	| AsChildProps<BaseCollapsibleContentProps<T, In, Out>>
	| DefaultProps<BaseCollapsibleContentProps<T, In, Out>>;

export type CollapsibleContentWithoutHTML = Without<
	BaseCollapsibleContentProps,
	PrimitiveDivAttributes
>;

export type BaseCollapsibleTriggerProps = PrimitiveButtonAttributes;

export type CollapsibleTriggerProps =
	| AsChildProps<BaseCollapsibleTriggerProps>
	| DefaultProps<BaseCollapsibleTriggerProps>;
