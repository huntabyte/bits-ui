import type { HTMLButtonAttributes } from "svelte/elements";
import type { CreatePopoverProps as MeltPopoverProps } from "@melt-ui/svelte";
import type {
	DOMElement,
	Expand,
	HTMLDivAttributes,
	OmitFloating,
	OnChangeFn,
} from "$lib/internal/index.js";
import type { CustomEventHandler } from "$lib/index.js";

import type {
	ArrowProps as PopoverArrowPropsWithoutHTML,
	ContentProps as PopoverContentPropsWithoutHTML,
} from "$lib/bits/floating/_types.js";

export type { ContentProps as PopoverContentProps } from "$lib/bits/floating/types.js";

export type { PopoverContentPropsWithoutHTML, PopoverArrowPropsWithoutHTML };

export type PopoverPropsWithoutHTML = Expand<
	OmitFloating<MeltPopoverProps> & {
		/**
		 * The open state of the popover.
		 * You can bind this to a boolean value to programmatically control the open state.
		 *
		 * @defaultValue false
		 */
		open?: boolean | undefined;

		/**
		 * A callback function called when the open state changes.
		 */
		onOpenChange?: OnChangeFn<boolean> | undefined;
	}
>;

export type PopoverTriggerPropsWithoutHTML = DOMElement<HTMLButtonElement>;
export type PopoverClosePropsWithoutHTML = DOMElement<HTMLButtonElement>;

export type PopoverProps = PopoverPropsWithoutHTML;

export type PopoverTriggerProps = PopoverTriggerPropsWithoutHTML & HTMLButtonAttributes;

export type PopoverCloseProps = PopoverClosePropsWithoutHTML & HTMLButtonAttributes;

export type PopoverArrowProps = PopoverArrowPropsWithoutHTML & HTMLDivAttributes;

export type PopoverTriggerEvents<T extends Element = HTMLButtonElement> = {
	click: CustomEventHandler<MouseEvent, T>;
	keydown: CustomEventHandler<KeyboardEvent, T>;
};

export type PopoverCloseEvents = PopoverTriggerEvents;
