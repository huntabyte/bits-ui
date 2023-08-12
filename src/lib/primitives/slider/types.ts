import type { CreateSliderProps, SliderComponentEvents } from "@melt-ui/svelte";
import type {
	Expand,
	OmitValue,
	HTMLSpanAttributes,
	OnChangeFn,
	KeydownClickEvents
} from "$internal/index.js";

type Props = Expand<
	OmitValue<CreateSliderProps> & {
		value?: CreateSliderProps["defaultValue"] & {};
		onValueChange?: OnChangeFn<CreateSliderProps["defaultValue"]>;
	}
> &
	HTMLSpanAttributes;

type RangeProps = HTMLSpanAttributes;

type ThumbProps = HTMLSpanAttributes;

type ThumbEvents = SliderComponentEvents["thumb"] & KeydownClickEvents;

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
