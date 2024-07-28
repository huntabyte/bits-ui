import type { HTMLButtonAttributes } from "svelte/elements";
import type { CreateCollapsibleProps as MeltCollapsibleProps } from "@melt-ui/svelte";
import type { CustomEventHandler } from "$lib/index.js";
import type {
	DOMElement,
	Expand,
	HTMLDivAttributes,
	OmitForceVisible,
	OmitOpen,
	OnChangeFn,
	Transition,
	TransitionProps,
} from "$lib/internal/index.js";

export type CollapsiblePropsWithoutHTML = Expand<
	OmitOpen<OmitForceVisible<MeltCollapsibleProps>> & {
		/**
		 * The open state of the collapsible.
		 * You can bind this to a boolean value to programmatically control the open state.
		 *
		 * @defaultValue false
		 */
		open?: boolean | undefined;

		/**
		 * A callback function called when the open state changes.
		 */
		onOpenChange?: OnChangeFn<boolean> | undefined;
	} & DOMElement
>;

export type CollapsibleContentPropsWithoutHTML<
	T extends Transition = Transition,
	In extends Transition = Transition,
	Out extends Transition = Transition,
> = Expand<TransitionProps<T, In, Out> & DOMElement>;

export type CollapsibleTriggerPropsWithoutHTML = DOMElement<HTMLButtonElement>;

export type CollapsibleProps = CollapsiblePropsWithoutHTML & HTMLDivAttributes;

export type CollapsibleContentProps<
	T extends Transition = Transition,
	In extends Transition = Transition,
	Out extends Transition = Transition,
> = CollapsibleContentPropsWithoutHTML<T, In, Out> & HTMLDivAttributes;

export type CollapsibleTriggerProps = CollapsibleTriggerPropsWithoutHTML & HTMLButtonAttributes;

export type CollapsibleTriggerEvents = {
	click: CustomEventHandler<MouseEvent, HTMLButtonElement>;
};
