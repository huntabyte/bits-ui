import type { HTMLButtonAttributes } from "svelte/elements";
import type { CreateDialogProps as MeltDialogProps } from "@melt-ui/svelte";
import type {
	DOMElement,
	Expand,
	HTMLDivAttributes,
	HTMLHeadingAttributes,
	OmitOpen,
	OnChangeFn,
	SvelteEvent,
	Transition,
	TransitionProps,
} from "$lib/internal/index.js";
import type { CustomEventHandler } from "$lib/index.js";

import type { FocusProp } from "$lib/shared/index.js";

export type DialogPropsWithoutHTML = Expand<
	OmitOpen<
		Omit<MeltDialogProps, "role" | "ids" | "forceVisible" | "openFocus" | "closeFocus">
	> & {
		/**
		 * The open state of the dialog.
		 * You can bind this to a boolean value to programmatically control the open state.
		 *
		 * @defaultValue false
		 */
		open?: MeltDialogProps["defaultOpen"] & {};

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

export type DialogTriggerPropsWithoutHTML = DOMElement<HTMLButtonElement>;

export type DialogClosePropsWithoutHTML = DialogTriggerPropsWithoutHTML;

export type DialogContentPropsWithoutHTML<
	T extends Transition = Transition,
	In extends Transition = Transition,
	Out extends Transition = Transition,
> = Expand<TransitionProps<T, In, Out> & DOMElement>;

export type DialogDescriptionPropsWithoutHTML = DOMElement;

export type DialogOverlayPropsWithoutHTML<
	T extends Transition = Transition,
	In extends Transition = Transition,
	Out extends Transition = Transition,
> = Expand<TransitionProps<T, In, Out> & DOMElement>;

export type DialogPortalPropsWithoutHTML = DOMElement;

export type DialogTitlePropsWithoutHTML = Expand<
	{
		level?: "h1" | "h2" | "h3" | "h4" | "h5" | "h6";
	} & DOMElement<HTMLHeadingElement>
>;

export type DialogProps = DialogPropsWithoutHTML;

export type DialogTriggerProps = DialogTriggerPropsWithoutHTML & HTMLButtonAttributes;
export type DialogCloseProps = DialogTriggerProps;

export type DialogContentProps<
	T extends Transition = Transition,
	In extends Transition = Transition,
	Out extends Transition = Transition,
> = DialogContentPropsWithoutHTML<T, In, Out> & HTMLDivAttributes;

export type DialogDescriptionProps = DialogDescriptionPropsWithoutHTML & HTMLDivAttributes;

export type DialogOverlayProps<
	T extends Transition = Transition,
	In extends Transition = Transition,
	Out extends Transition = Transition,
> = DialogOverlayPropsWithoutHTML<T, In, Out> & HTMLDivAttributes;

export type DialogPortalProps = DialogPortalPropsWithoutHTML & HTMLDivAttributes;
export type DialogTitleProps = DialogTitlePropsWithoutHTML & HTMLHeadingAttributes;

export type DialogOverlayEvents<T extends Element = HTMLElement> = {
	mouseup: SvelteEvent<MouseEvent, T>;
};

export type DialogContentEvents<T extends Element = HTMLElement> = {
	pointerdown: SvelteEvent<PointerEvent, T>;
	pointerup: SvelteEvent<PointerEvent, T>;
	pointermove: SvelteEvent<PointerEvent, T>;
	touchend: SvelteEvent<TouchEvent, T>;
	touchstart: SvelteEvent<TouchEvent, T>;
	touchcancel: SvelteEvent<TouchEvent, T>;
	touchmove: SvelteEvent<TouchEvent, T>;
};

export type DialogTriggerEvents<T extends Element = HTMLButtonElement> = {
	click: CustomEventHandler<MouseEvent, T>;
	keydown: CustomEventHandler<KeyboardEvent, T>;
};
export type DialogCloseEvents = DialogTriggerEvents;
