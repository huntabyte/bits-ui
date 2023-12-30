import type { APISchema } from "@/types";
import { enums, builderAndAttrsSlotProps, domElProps } from "@/content/api-reference/helpers.js";
import type * as Slider from "$lib/bits/slider/_types.js";
import * as C from "@/content/constants.js";

const root: APISchema<Slider.Props> = {
	title: "Root",
	description: "The root slider component which contains the remaining slider components.",
	props: {
		value: {
			default: "[]",
			type: "number[]",
			description: "The current value of the slider."
		},
		onValueChange: {
			type: {
				type: C.FUNCTION,
				definition: "(value: number[]) => void"
			},
			description: "A callback function called when the value state of the slider changes."
		},
		disabled: {
			default: C.FALSE,
			type: C.BOOLEAN,
			description: "Whether or not the switch is disabled."
		},
		max: {
			default: "100",
			type: C.NUMBER,
			description: "The maximum value of the slider."
		},
		min: {
			default: "0",
			type: C.NUMBER,
			description: "The minimum value of the slider."
		},
		orientation: {
			default: '"horizontal"',
			type: {
				type: C.ENUM,
				definition: enums("horizontal", "vertical")
			},
			description: "The orientation of the slider."
		},
		step: {
			default: "1",
			type: C.NUMBER,
			description: "The step value of the slider."
		},
		dir: {
			default: '"ltr"',
			type: {
				type: C.ENUM,
				definition: enums("ltr", "rtl")
			},
			description:
				"The reading direction of the slider. If set to 'rtl', the slider will be reversed for both `'horizontal'` and `'vertical'` orientations."
		},
		...domElProps("HTMLSpanElement")
	},
	slotProps: {
		...builderAndAttrsSlotProps,
		ticks: {
			type: C.NUMBER,
			description: "The number of ticks to display on the slider."
		}
	},
	dataAttributes: [
		{
			name: "orientation",
			description: "The orientation of the slider.",
			value: enums("horizontal", "vertical"),
			isEnum: true
		},
		{
			name: "slider-root",
			description: "Present on the root element."
		}
	]
};

const thumb: APISchema<Slider.ThumbProps> = {
	title: "Thumb",
	description: "A thumb on the slider.",
	props: domElProps("HTMLSpanElement"),
	slotProps: { ...builderAndAttrsSlotProps },
	dataAttributes: [
		{
			name: "slider-thumb",
			description: "Present on the thumb elements."
		}
	]
};

const range: APISchema<Slider.RangeProps> = {
	title: "Range",
	description: "The range of the slider.",
	props: domElProps("HTMLSpanElement"),
	slotProps: { ...builderAndAttrsSlotProps },
	dataAttributes: [
		{
			name: "slider-range",
			description: "Present on the range elements."
		}
	]
};

const tick: APISchema<Slider.TickProps> = {
	title: "Tick",
	description: "A tick mark on the slider.",
	props: domElProps("HTMLSpanElement"),
	slotProps: { ...builderAndAttrsSlotProps },
	dataAttributes: [
		{
			name: "bounded",
			description: "Present when the tick is bounded."
		},
		{
			name: "slider-tick",
			description: "Present on the tick elements."
		}
	]
};

export const slider = [root, range, thumb, tick];
