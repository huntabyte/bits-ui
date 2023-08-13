import type { CreateSliderProps, SliderComponentEvents } from "@melt-ui/svelte";
import type {
	Expand,
	OmitValue,
	HTMLSpanAttributes,
	OnChangeFn,
	AsChild
} from "$internal/index.js";

type Props = Expand<
	OmitValue<CreateSliderProps> & {
		value?: CreateSliderProps["defaultValue"] & {};
		onValueChange?: OnChangeFn<CreateSliderProps["defaultValue"]>;
	}
> &
	AsChild &
	HTMLSpanAttributes;

type RangeProps = AsChild & HTMLSpanAttributes;

type ThumbProps = AsChild & HTMLSpanAttributes;

type ThumbEvents = SliderComponentEvents["thumb"];

export type {
	Props,
	RangeProps,
	ThumbProps,
	//
	Props as SliderProps,
	RangeProps as SliderRange,
	ThumbProps as SliderThumb,
	//
	ThumbEvents,
	//
	ThumbEvents as SliderThumbEvents
};
