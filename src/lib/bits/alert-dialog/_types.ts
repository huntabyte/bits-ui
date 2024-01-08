/**
 * We define prop types without the HTMLAttributes here so that we can use them
 * to type-check our API documentation, which requires we document each prop,
 * but we don't want to document the HTML attributes.
 */

import type {
	OmitOpen,
	Expand,
	OnChangeFn,
	Transition,
	TransitionProps,
	DOMElement
} from "$lib/internal/index.js";
import type { CreateDialogProps } from "@melt-ui/svelte";

type Props = Expand<
	OmitOpen<Omit<CreateDialogProps, "role" | "forceVisible" | "ids">> & {
		/**
		 * The open state of the alert dialog.
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

type TriggerProps = DOMElement<HTMLButtonElement>;

type ActionProps = TriggerProps;
type CancelProps = TriggerProps;

type ContentProps<
	T extends Transition = Transition,
	In extends Transition = Transition,
	Out extends Transition = Transition
> = Expand<TransitionProps<T, In, Out> & DOMElement>;

type DescriptionProps = DOMElement;

type PortalProps = DOMElement;

type TitleProps = Expand<
	{
		level?: "h1" | "h2" | "h3" | "h4" | "h5" | "h6";
	} & DOMElement<HTMLHeadingElement>
>;

export type {
	Props,
	TriggerProps,
	ActionProps,
	CancelProps,
	ContentProps,
	DescriptionProps,
	ContentProps as OverlayProps,
	PortalProps,
	TitleProps
};
