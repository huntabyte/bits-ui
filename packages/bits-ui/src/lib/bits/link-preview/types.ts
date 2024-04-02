import type { HTMLAnchorAttributes } from "svelte/elements";
import type { CreateLinkPreviewProps } from "@melt-ui/svelte";
import type { CustomEventHandler } from "$lib/index.js";
import type {
	DOMElement,
	Expand,
	HTMLDivAttributes,
	OmitFloating,
	OnChangeFn,
	Transition,
} from "$lib/internal/index.js";
import type {
	ArrowProps as LinkPreviewArrowPropsWithoutHTML,
	ContentProps as LinkPreviewContentPropsWithoutHTML,
} from "$lib/bits/floating/_types.js";

export type LinkPreviewPropsWithoutHTML = Expand<
	OmitFloating<CreateLinkPreviewProps> & {
		/**
		 * The open state of the link preview.
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

export type LinkPreviewTriggerPropsWithoutHTML = DOMElement<HTMLAnchorElement>;

export type { LinkPreviewArrowPropsWithoutHTML, LinkPreviewContentPropsWithoutHTML };

export type LinkPreviewProps = LinkPreviewPropsWithoutHTML;

export type LinkPreviewTriggerProps = LinkPreviewTriggerPropsWithoutHTML & HTMLAnchorAttributes;

export type LinkPreviewContentProps<
	T extends Transition = Transition,
	In extends Transition = Transition,
	Out extends Transition = Transition,
> = LinkPreviewContentPropsWithoutHTML<T, In, Out> & HTMLDivAttributes;

export type LinkPreviewArrowProps = LinkPreviewArrowPropsWithoutHTML & HTMLDivAttributes;

export type LinkPreviewTriggerEvents<T extends Element = HTMLAnchorElement> = {
	click: CustomEventHandler<MouseEvent, T>;
	blur: CustomEventHandler<FocusEvent, T>;
	focus: CustomEventHandler<FocusEvent, T>;
	pointerenter: CustomEventHandler<PointerEvent, T>;
	pointerleave: CustomEventHandler<PointerEvent, T>;
};
export type LinkPreviewContentEvents<T extends Element = HTMLDivElement> = {
	focusout: CustomEventHandler<FocusEvent, T>;
	pointerenter: CustomEventHandler<PointerEvent, T>;
	pointerleave: CustomEventHandler<PointerEvent, T>;
	pointerdown: CustomEventHandler<PointerEvent, T>;
};
