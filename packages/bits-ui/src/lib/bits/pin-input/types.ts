import type { HTMLInputAttributes } from "svelte/elements";
import type { CreatePinInputProps as MeltPinInputProps } from "@melt-ui/svelte";
import type {
	DOMElement,
	Expand,
	HTMLDivAttributes,
	OmitIds,
	OmitValue,
	OnChangeFn,
} from "$lib/internal/index.js";
import type { CustomEventHandler } from "$lib/index.js";

export type PinInputPropsWithoutHTML = Expand<
	OmitIds<
		OmitValue<MeltPinInputProps> & {
			/**
			 * The value pin-input, which is an array of strings.
			 *
			 * You can bind to this to programmatically control the value.
			 */
			value?: MeltPinInputProps["defaultValue"] | undefined;

			/**
			 * A callback function called when the value changes.
			 */
			onValueChange?: OnChangeFn<MeltPinInputProps["defaultValue"]> | undefined;
		} & DOMElement
	>
>;

export type PinInputInputPropsWithoutHTML = DOMElement<HTMLInputElement>;

export type PinInputHiddenInputPropsWithoutHTML = DOMElement<HTMLInputElement>;
//

export type PinInputProps = PinInputPropsWithoutHTML & HTMLDivAttributes;

export type PinInputInputProps = PinInputInputPropsWithoutHTML & HTMLInputAttributes;

export type PinInputHiddenInputProps = PinInputHiddenInputPropsWithoutHTML & HTMLInputAttributes;

export type PinInputInputEvents = {
	keydown: CustomEventHandler<KeyboardEvent, HTMLInputElement>;
	input: CustomEventHandler<InputEvent, HTMLInputElement>;
	paste: CustomEventHandler<ClipboardEvent, HTMLInputElement>;
	change: CustomEventHandler<Event, HTMLInputElement>;
	focus: CustomEventHandler<FocusEvent, HTMLInputElement>;
	blur: CustomEventHandler<FocusEvent, HTMLInputElement>;
};
