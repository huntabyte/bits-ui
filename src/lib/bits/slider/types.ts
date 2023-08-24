import type { CreateSliderProps } from "@melt-ui/svelte";
import type {
	Expand,
	OmitValue,
	HTMLSpanAttributes,
	OnChangeFn,
	AsChild
} from "$lib/internal/index.js";
import type { CustomEventHandler } from "$lib/index.js";
import type { HTMLInputAttributes } from "svelte/elements";

type Props = Expand<
	OmitValue<CreateSliderProps> & {
		value?: CreateSliderProps["defaultValue"] & {};
		onValueChange?: OnChangeFn<CreateSliderProps["defaultValue"]>;
	} & AsChild
> &
	HTMLSpanAttributes;

type RangeProps = AsChild & HTMLSpanAttributes;

type ThumbProps = AsChild & HTMLSpanAttributes;

type ThumbEvents<T extends Element = HTMLSpanElement> = {
	keydown: CustomEventHandler<KeyboardEvent, T>;
};

type InputProps = Omit<HTMLInputAttributes, "value">;

export type {
	Props,
	RangeProps,
	ThumbProps,
	InputProps,
	//
	Props as SliderProps,
	RangeProps as SliderRangeProps,
	ThumbProps as SliderThumbProps,
	InputProps as SliderInputProps,
	//
	ThumbEvents,
	//
	ThumbEvents as SliderThumbEvents
};
