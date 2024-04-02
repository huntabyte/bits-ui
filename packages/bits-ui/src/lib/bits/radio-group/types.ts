import type { HTMLButtonAttributes, HTMLInputAttributes } from "svelte/elements";
import type {
	RadioGroupItemProps as MeltRadioGroupItemProps,
	CreateRadioGroupProps as MeltRadioGroupProps,
} from "@melt-ui/svelte";
import type {
	DOMElement,
	Expand,
	HTMLDivAttributes,
	ObjectVariation,
	OmitValue,
	OnChangeFn,
} from "$lib/internal/index.js";
import type { CustomEventHandler } from "$lib/index.js";

export type RadioGroupPropsWithoutHTML = Expand<
	OmitValue<MeltRadioGroupProps> & {
		/**
		 * The value of the radio group.
		 * You can bind this to a value to programmatically control the value.
		 *
		 * @defaultValue undefined
		 */

		value?: MeltRadioGroupProps["defaultValue"] & {};

		/**
		 * A callback function called when the value changes.
		 */

		onValueChange?: OnChangeFn<MeltRadioGroupProps["defaultValue"] & {}>;
	} & DOMElement
>;

export type RadioGroupInputPropsWithoutHTML = DOMElement<HTMLInputElement>;

export type RadioGroupItemPropsWithoutHTML = Expand<
	ObjectVariation<MeltRadioGroupItemProps> & DOMElement<HTMLButtonElement>
>;

export type RadioGroupItemIndicatorPropsWithoutHTML = DOMElement;

//

export type RadioGroupProps = RadioGroupPropsWithoutHTML & HTMLDivAttributes;

export type RadioGroupInputProps = RadioGroupInputPropsWithoutHTML & HTMLInputAttributes;

export type RadioGroupItemProps = RadioGroupItemPropsWithoutHTML & HTMLButtonAttributes;

export type RadioGroupItemIndicatorProps = RadioGroupItemIndicatorPropsWithoutHTML &
	HTMLDivAttributes;

export type RadioGroupItemEvents<T extends Element = HTMLButtonElement> = {
	click: CustomEventHandler<MouseEvent, T>;
	keydown: CustomEventHandler<KeyboardEvent, T>;
	focus: CustomEventHandler<FocusEvent, T>;
};
