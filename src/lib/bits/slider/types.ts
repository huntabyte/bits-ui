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
		value?: number[];
		onValueChange?: OnChangeFn<number[]>;
	} & AsChild
> &
	HTMLSpanAttributes;

type RangeProps = AsChild & HTMLSpanAttributes;

type ThumbProps = AsChild & HTMLSpanAttributes;

type TickProps = AsChild & HTMLSpanAttributes;

type ThumbEvents<T extends Element = HTMLSpanElement> = {
	keydown: CustomEventHandler<KeyboardEvent, T>;
};

type InputProps = Omit<HTMLInputAttributes, "value">;

export type {
	Props,
	RangeProps,
	ThumbProps,
	InputProps,
	TickProps,
	//
	Props as SliderProps,
	RangeProps as SliderRangeProps,
	ThumbProps as SliderThumbProps,
	InputProps as SliderInputProps,
	TickProps as SliderTickProps,
	//
	ThumbEvents,
	//
	ThumbEvents as SliderThumbEvents
};
