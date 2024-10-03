import type { HTMLInputAttributes, HTMLLabelAttributes } from "svelte/elements";
import type {
	ComboboxOptionProps as MeltComboboxOptionProps,
	CreateComboboxProps as MeltComboboxProps,
} from "@melt-ui/svelte";
import type {
	DOMElement,
	Expand,
	HTMLDivAttributes,
	OmitFloating,
	OnChangeFn,
	Transition,
} from "$lib/internal/index.js";
import type { CustomEventHandler, Selected } from "$lib/index.js";

import type {
	ArrowProps as ComboboxArrowPropsWithoutHTML,
	ContentProps as ComboboxContentPropsWithoutHTML,
} from "$lib/bits/floating/_types.js";

type WhenTrue<TrueOrFalse, IfTrue, IfFalse, IfNeither = IfTrue | IfFalse> = [TrueOrFalse] extends [
	true,
]
	? IfTrue
	: [TrueOrFalse] extends [false]
		? IfFalse
		: IfNeither;

type SelectValue<T, Multiple extends boolean> = WhenTrue<Multiple, T[] | undefined, T | undefined>;

export type ComboboxPropsWithoutHTML<T = unknown, Multiple extends boolean = false> = Expand<
	OmitFloating<
		Omit<MeltComboboxProps, "selected" | "defaultSelected" | "onSelectedChange" | "multiple">
	> & {
		/**
		 * The selected value of the combobox.
		 * You can bind this to a value to programmatically control the selected value.
		 *
		 * @defaultValue undefined
		 */
		selected?: SelectValue<Selected<T>, Multiple> | undefined;

		/**
		 * A callback function called when the selected value changes.
		 */
		onSelectedChange?: OnChangeFn<SelectValue<Selected<T>, Multiple>> | undefined;

		/**
		 * The open state of the combobox menu.
		 * You can bind this to a boolean value to programmatically control the open state.
		 *
		 * @defaultValue false
		 */
		open?: boolean | undefined;

		/**
		 * A callback function called when the open state changes.
		 */
		onOpenChange?: OnChangeFn<boolean> | undefined;

		/**
		 * Whether or not multiple values can be selected.
		 */
		multiple?: Multiple | undefined;

		/**
		 * The value of the input.
		 * You can bind this to a value to programmatically control the input value.
		 *
		 * @defaultValue ""
		 */
		inputValue?: string | undefined;

		/**
		 * Optionally provide an array of `Selected<T>` objects to
		 * type the `selected` and `onSelectedChange` props.
		 */
		items?: Selected<T>[] | undefined;

		/**
		 * Whether the input has been touched or not. You can bind to this to
		 * handle filtering the items only when the input has been touched.
		 *
		 * @defaultValue false
		 */
		touchedInput?: boolean | undefined;
	}
>;

export type ComboboxInputPropsWithoutHTML = DOMElement<HTMLInputElement>;
export type ComboboxLabelPropsWithoutHTML = DOMElement<HTMLLabelElement>;

export type ComboboxGroupPropsWithoutHTML = DOMElement;
export type ComboboxGroupLabelPropsWithoutHTML = DOMElement;

export type ComboboxItemPropsWithoutHTML = Expand<MeltComboboxOptionProps & DOMElement>;

export type ComboboxHiddenInputPropsWithoutHTML = DOMElement;
export type ComboboxSeparatorPropsWithoutHTML = DOMElement;
export type ComboboxIndicatorPropsWithoutHTML = DOMElement;

//

export type ComboboxProps<T, Multiple extends boolean = false> = ComboboxPropsWithoutHTML<
	T,
	Multiple
>;

export type ComboboxContentProps<
	T extends Transition = Transition,
	In extends Transition = Transition,
	Out extends Transition = Transition,
> = ComboboxContentPropsWithoutHTML<T, In, Out> & HTMLDivAttributes;

export type ComboboxInputProps = ComboboxInputPropsWithoutHTML & HTMLInputAttributes;
export type ComboboxLabelProps = ComboboxLabelPropsWithoutHTML & HTMLLabelAttributes;

export type ComboboxGroupProps = ComboboxGroupPropsWithoutHTML & HTMLDivAttributes;
export type ComboboxGroupLabelProps = ComboboxGroupLabelPropsWithoutHTML & HTMLDivAttributes;

export type ComboboxItemProps = ComboboxItemPropsWithoutHTML & HTMLDivAttributes;

export type ComboboxHiddenInputProps = ComboboxHiddenInputPropsWithoutHTML & HTMLInputAttributes;
export type ComboboxSeparatorProps = ComboboxSeparatorPropsWithoutHTML & HTMLDivAttributes;
export type ComboboxIndicatorProps = ComboboxIndicatorPropsWithoutHTML & HTMLDivAttributes;
export type ComboboxArrowProps = ComboboxArrowPropsWithoutHTML & HTMLDivAttributes;

export type ComboboxItemEvents<T extends Element = HTMLDivElement> = {
	click: CustomEventHandler<MouseEvent, T>;
	pointermove: CustomEventHandler<PointerEvent, T>;
	focusin: CustomEventHandler<FocusEvent, T>;
	keydown: CustomEventHandler<KeyboardEvent, T>;
	focusout: CustomEventHandler<FocusEvent, T>;
	pointerleave: CustomEventHandler<PointerEvent, T>;
};

export type ComboboxContentEvents<T extends Element = HTMLDivElement> = {
	pointerleave: CustomEventHandler<PointerEvent, T>;
	keydown: CustomEventHandler<KeyboardEvent, T>;
};

export type ComboboxGroupLabelEvents<T extends Element = HTMLSpanElement> = {
	click: CustomEventHandler<MouseEvent, T>;
};

export type ComboboxInputEvents = {
	keydown: CustomEventHandler<KeyboardEvent, HTMLInputElement>;
	input: CustomEventHandler<InputEvent, HTMLInputElement>;
	click: CustomEventHandler<ClipboardEvent, HTMLInputElement>;
};

export type { ComboboxArrowPropsWithoutHTML, ComboboxContentPropsWithoutHTML };
