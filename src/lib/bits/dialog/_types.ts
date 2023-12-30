/**
 * We define prop types without the HTMLAttributes here so that we can use them
 * to type-check our API documentation, which requires we document each prop,
 * but we don't want to document the HTML attributes.
 */

import type { FocusProp } from "$lib/shared/index.js";
import type {
	DOMElement,
	Expand,
	OmitOpen,
	OnChangeFn,
	Transition,
	TransitionProps
} from "$lib/internal/index.js";
import type { CreateDialogProps } from "@melt-ui/svelte";

type Props = Expand<
	OmitOpen<
		Omit<CreateDialogProps, "role" | "ids" | "forceVisible" | "openFocus" | "closeFocus">
	> & {
		/**
		 * The open state of the dialog.
		 * You can bind this to a boolean value to programmatically control the open state.
		 *
		 * @defaultValue false
		 */
		open?: CreateDialogProps["defaultOpen"] & {};

		/**
		 * A callback function called when the open state changes.
		 */
		onOpenChange?: OnChangeFn<boolean>;

		/**
		 * Override the default autofocus behavior of the dialog when it opens
		 */
		openFocus?: FocusProp;

		/**
		 * Override the default autofocus behavior of the dialog after close
		 */
		closeFocus?: FocusProp;
	}
>;

type TriggerProps = DOMElement<HTMLButtonElement>;

type CloseProps = TriggerProps;

type ContentProps<
	T extends Transition = Transition,
	In extends Transition = Transition,
	Out extends Transition = Transition
> = Expand<TransitionProps<T, In, Out> & DOMElement>;

type DescriptionProps = DOMElement;

type OverlayProps<
	T extends Transition = Transition,
	In extends Transition = Transition,
	Out extends Transition = Transition
> = Expand<TransitionProps<T, In, Out> & DOMElement>;

type PortalProps = DOMElement;

type TitleProps = Expand<
	{
		level?: "h1" | "h2" | "h3" | "h4" | "h5" | "h6";
	} & DOMElement<HTMLHeadingElement>
>;

export type {
	Props,
	CloseProps,
	TitleProps,
	PortalProps,
	ContentProps,
	TriggerProps,
	OverlayProps,
	DescriptionProps
};
