import type { HTMLButtonAttributes } from "svelte/elements";
import type { CreateDialogProps as MeltDialogProps } from "@melt-ui/svelte";
import type { CustomEventHandler } from "$lib/index.js";
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

export type AlertDialogPropsWithoutHTML = Expand<
	OmitOpen<Omit<MeltDialogProps, "role" | "forceVisible" | "ids">> & {
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

export type AlertDialogTriggerPropsWithoutHTML = DOMElement<HTMLButtonElement>;

export type AlertDialogActionPropsWithoutHTML = DOMElement<HTMLButtonElement>;

export type AlertDialogCancelPropsWithoutHTML = DOMElement<HTMLButtonElement>;

export type AlertDialogContentPropsWithoutHTML<
	T extends Transition = Transition,
	In extends Transition = Transition,
	Out extends Transition = Transition,
> = Expand<TransitionProps<T, In, Out> & DOMElement>;

export type AlertDialogOverlayPropsWithoutHTML<
	T extends Transition = Transition,
	In extends Transition = Transition,
	Out extends Transition = Transition,
> = Expand<TransitionProps<T, In, Out> & DOMElement>;

export type AlertDialogDescriptionPropsWithoutHTML = DOMElement;

export type AlertDialogPortalPropsWithoutHTML = DOMElement;

export type AlertDialogTitlePropsWithoutHTML = Expand<
	{
		level?: "h1" | "h2" | "h3" | "h4" | "h5" | "h6";
	} & DOMElement<HTMLHeadingElement>
>;

export type AlertDialogProps = AlertDialogPropsWithoutHTML;

export type AlertDialogTriggerProps = AlertDialogTriggerPropsWithoutHTML & HTMLButtonAttributes;

export type AlertDialogActionProps = AlertDialogActionPropsWithoutHTML & HTMLButtonAttributes;

export type AlertDialogCancelProps = AlertDialogCancelPropsWithoutHTML & HTMLButtonAttributes;

export type AlertDialogContentProps<
	T extends Transition = Transition,
	In extends Transition = Transition,
	Out extends Transition = Transition,
> = AlertDialogContentPropsWithoutHTML<T, In, Out> & HTMLDivAttributes;

export type AlertDialogOverlayProps<
	T extends Transition = Transition,
	In extends Transition = Transition,
	Out extends Transition = Transition,
> = AlertDialogContentPropsWithoutHTML<T, In, Out> & HTMLDivAttributes;

export type AlertDialogDescriptionProps = AlertDialogDescriptionPropsWithoutHTML &
	HTMLDivAttributes;

export type AlertDialogPortalProps = AlertDialogPortalPropsWithoutHTML & HTMLDivAttributes;

export type AlertDialogTitleProps = AlertDialogTitlePropsWithoutHTML & HTMLHeadingAttributes;

export type AlertDialogTriggerEvents<T extends Element = HTMLButtonElement> = {
	click: CustomEventHandler<MouseEvent, T>;
	keydown: CustomEventHandler<KeyboardEvent, T>;
};

export type AlertDialogContentEvents<T extends Element = HTMLElement> = {
	pointerdown: SvelteEvent<PointerEvent, T>;
	pointerup: SvelteEvent<PointerEvent, T>;
	pointermove: SvelteEvent<PointerEvent, T>;
	touchend: SvelteEvent<TouchEvent, T>;
	touchstart: SvelteEvent<TouchEvent, T>;
	touchcancel: SvelteEvent<TouchEvent, T>;
	touchmove: SvelteEvent<TouchEvent, T>;
};

export type AlertDialogActionEvents = AlertDialogTriggerEvents;
export type AlertDialogCancelEvents = AlertDialogTriggerEvents;
