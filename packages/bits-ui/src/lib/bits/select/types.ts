import type {
	EventHandler,
	HTMLAttributes,
	HTMLButtonAttributes,
	HTMLInputAttributes,
} from "svelte/elements";
import type {
	SelectOptionProps as MeltSelectOptionProps,
	CreateSelectProps as MeltSelectProps,
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
	ArrowProps as SelectArrowPropsWithoutHTML,
	ContentProps as SelectContentPropsWithoutHTML,
} from "$lib/bits/floating/_types.js";

export type { SelectArrowPropsWithoutHTML, SelectContentPropsWithoutHTML };

export type WhenTrue<TrueOrFalse, IfTrue, IfFalse, IfNeither = IfTrue | IfFalse> = [
	TrueOrFalse,
] extends [true]
	? IfTrue
	: [TrueOrFalse] extends [false]
		? IfFalse
		: IfNeither;

type SelectValue<T, Multiple extends boolean> = WhenTrue<Multiple, T[] | undefined, T | undefined>;

export type SelectPropsWithoutHTML<T = unknown, Multiple extends boolean = false> = Expand<
	OmitFloating<
		Omit<MeltSelectProps, "selected" | "defaultSelected" | "onSelectedChange" | "multiple">
	> & {
		/**
		 * The selected value of the select.
		 * You can bind this to a value to programmatically control the selected value.
		 *
		 * @defaultValue undefined
		 */
		selected?: SelectValue<Selected<T>, Multiple> | undefined;

		/**
		 * A callback function called when the selected value changes.
		 */
		onSelectedChange?: OnChangeFn<SelectValue<Selected<T>, Multiple>>;

		/**
		 * The open state of the select menu.
		 * You can bind this to a boolean value to programmatically control the open state.
		 *
		 * @defaultValue false
		 */
		open?: boolean;

		/**
		 * A callback function called when the open state changes.
		 */
		onOpenChange?: OnChangeFn<boolean>;

		/**
		 * Whether or not multiple values can be selected.
		 */
		multiple?: Multiple;

		/**
		 * Optionally provide an array of `Selected<T>` objects to
		 * type the `selected` and `onSelectedChange` props.
		 */
		items?: Selected<T>[];
	}
>;

export type SelectGroupPropsWithoutHTML = DOMElement;
export type SelectInputPropsWithoutHTML = DOMElement<HTMLInputElement>;
export type SelectLabelPropsWithoutHTML = DOMElement;
export type SelectItemPropsWithoutHTML = Expand<MeltSelectOptionProps & DOMElement>;
export type SelectSeparatorPropsWithoutHTML = DOMElement;

export type SelectIndicatorPropsWithoutHTML = DOMElement;

export type SelectTriggerPropsWithoutHTML = DOMElement<HTMLButtonElement>;

export type SelectValuePropsWithoutHTML = Expand<
	{
		/**
		 * The placeholder text to display when there is no value.
		 *
		 * @defaultValue ""
		 */
		placeholder?: string;
	} & DOMElement<HTMLSpanElement>
>;

//

export type SelectProps<T, Multiple extends boolean = false> = SelectPropsWithoutHTML<T, Multiple>;

export type SelectContentProps<
	T extends Transition = Transition,
	In extends Transition = Transition,
	Out extends Transition = Transition,
> = SelectContentPropsWithoutHTML<T, In, Out> & HTMLDivAttributes;

export type SelectGroupProps = SelectGroupPropsWithoutHTML & HTMLDivAttributes;
export type SelectInputProps = SelectInputPropsWithoutHTML & HTMLInputAttributes;
export type SelectLabelProps = SelectLabelPropsWithoutHTML & HTMLDivAttributes;
export type SelectItemProps = SelectItemPropsWithoutHTML & HTMLDivAttributes;
export type SelectSeparatorProps = SelectSeparatorPropsWithoutHTML & HTMLDivAttributes;
export type SelectTriggerProps = SelectTriggerPropsWithoutHTML & HTMLButtonAttributes;

export type SelectValueProps = SelectValuePropsWithoutHTML & HTMLAttributes<HTMLSpanElement>;

export type SelectArrowProps = SelectArrowPropsWithoutHTML & HTMLDivAttributes;

export type SelectIndicatorProps = SelectIndicatorPropsWithoutHTML & HTMLDivAttributes;

export type SelectItemEvents<T extends Element = HTMLDivElement> = {
	click: CustomEventHandler<MouseEvent, T>;
	pointermove: CustomEventHandler<PointerEvent, T>;
	focusin: EventHandler<FocusEvent, T>;
	keydown: EventHandler<KeyboardEvent, T>;
	focusout: EventHandler<FocusEvent, T>;
	pointerleave: EventHandler<PointerEvent, T>;
};

export type SelectTriggerEvents<T extends Element = HTMLButtonElement> = {
	click: CustomEventHandler<MouseEvent, T>;
	keydown: CustomEventHandler<KeyboardEvent, T>;
};

export type SelectLabelEvents<T extends Element = HTMLSpanElement> = {
	click: CustomEventHandler<MouseEvent, T>;
};
export type SelectContentEvents<T extends Element = HTMLDivElement> = {
	pointerleave: CustomEventHandler<PointerEvent, T>;
	keydown: EventHandler<KeyboardEvent, T>;
};
