import type {
	SliderPropsWithoutHTML,
	SliderRangePropsWithoutHTML,
	SliderThumbPropsWithoutHTML,
	SliderTickPropsWithoutHTML,
} from "bits-ui";
import { builderAndAttrsSlotProps, domElProps, enums } from "$lib/content/api-reference/helpers.js";
import * as C from "$lib/content/constants.js";
import type { APISchema } from "$lib/types/index.js";

const root: APISchema<SliderPropsWithoutHTML> = {
	title: "Root",
	description: "The root slider component which contains the remaining slider components.",
	props: {
		value: {
			default: "[]",
			type: "number[]",
			description: "The current value of the slider.",
		},
		onValueChange: {
			type: {
				type: C.FUNCTION,
				definition: "(value: number[]) => void",
			},
			description: "A callback function called when the value state of the slider changes.",
		},
		disabled: {
			default: C.FALSE,
			type: C.BOOLEAN,
			description: "Whether or not the switch is disabled.",
		},
		max: {
			default: "100",
			type: C.NUMBER,
			description: "The maximum value of the slider.",
		},
		min: {
			default: "0",
			type: C.NUMBER,
			description: "The minimum value of the slider.",
		},
		orientation: {
			default: '"horizontal"',
			type: {
				type: C.ENUM,
				definition: enums("horizontal", "vertical"),
			},
			description: "The orientation of the slider.",
		},
		step: {
			default: "1",
			type: C.NUMBER,
			description: "The step value of the slider.",
		},
		dir: {
			default: '"ltr"',
			type: {
				type: C.ENUM,
				definition: enums("ltr", "rtl"),
			},
			description:
				"The reading direction of the slider. If set to 'rtl', the slider will be reversed for both `'horizontal'` and `'vertical'` orientations.",
		},
		...domElProps("HTMLSpanElement"),
	},
	slotProps: {
		ticks: {
			type: "Tick[]",
			description: "The tick builders to pass to the individual `Slider.Tick` components.",
		},
		thumbs: {
			type: "Thumb[]",
			description: "The thumb builders to pass to the individual `Slider.Thumb` components.",
		},
		...builderAndAttrsSlotProps,
	},
	dataAttributes: [
		{
			name: "orientation",
			description: "The orientation of the slider.",
			value: enums("horizontal", "vertical"),
			isEnum: true,
		},
		{
			name: "slider-root",
			description: "Present on the root element.",
		},
	],
};

const thumb: APISchema<SliderThumbPropsWithoutHTML> = {
	title: "Thumb",
	description: "A thumb on the slider.",
	props: {
		thumb: {
			type: "Thumb",
			description:
				"An individual thumb builder from the `thumbs` slot prop provided by the `Slider.Root` component.",
		},
		...domElProps("HTMLSpanElement"),
	},
	slotProps: { ...builderAndAttrsSlotProps },
	dataAttributes: [
		{
			name: "slider-thumb",
			description: "Present on the thumb elements.",
		},
	],
};

const range: APISchema<SliderRangePropsWithoutHTML> = {
	title: "Range",
	description: "The range of the slider.",
	props: domElProps("HTMLSpanElement"),
	slotProps: { ...builderAndAttrsSlotProps },
	dataAttributes: [
		{
			name: "slider-range",
			description: "Present on the range elements.",
		},
	],
};

const tick: APISchema<SliderTickPropsWithoutHTML> = {
	title: "Tick",
	description: "A tick mark on the slider.",
	props: {
		tick: {
			type: "Tick",
			description:
				"An individual tick builder from the `ticks` slot prop provided by the `Slider.Root` component.",
		},
		...domElProps("HTMLSpanElement"),
	},
	slotProps: { ...builderAndAttrsSlotProps },
	dataAttributes: [
		{
			name: "bounded",
			description: "Present when the tick is bounded.",
		},
		{
			name: "slider-tick",
			description: "Present on the tick elements.",
		},
	],
};

export const slider = [root, range, thumb, tick];
