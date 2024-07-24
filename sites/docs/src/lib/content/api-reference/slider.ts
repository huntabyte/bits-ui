import type {
	SliderRootPropsWithoutHTML,
	SliderRangePropsWithoutHTML,
	SliderThumbPropsWithoutHTML,
	SliderTickPropsWithoutHTML,
} from "bits-ui";
import {
	builderAndAttrsSlotProps,
	enums,
	withChildProps,
} from "$lib/content/api-reference/helpers.js";
import * as C from "$lib/content/constants.js";
import type { APISchema } from "$lib/types/index.js";

const root: APISchema<SliderRootPropsWithoutHTML> = {
	title: "Root",
	description: "The root slider component which contains the remaining slider components.",
	props: {
		value: {
			default: "[]",
			type: "number[]",
			description: "The current value of the slider.",
			bindable: true,
		},
		onValueChange: {
			type: {
				type: C.FUNCTION,
				definition: "(value: number[]) => void",
			},
			description: "A callback function called when the value state of the slider changes.",
		},
		onValueChangeEnd: {
			type: {
				type: C.FUNCTION,
				definition: "(value: number[]) => void",
			},
			description:
				"A callback function called when the user finishes dragging the thumb and the value changes. This is different than the `onValueChange` callback because it waits until the user stops dragging before calling the callback, where the `onValueChange` callback is called immediately after the user starts dragging.",
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
		autoSort: {
			type: C.BOOLEAN,
			default: C.TRUE,
			description:
				"Whether to automatically sort the values in the array when moving thumbs past one another.",
		},

		...withChildProps({ elType: "HTMLSpanElement" }),
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
		index: {
			type: C.NUMBER,
			description:
				"The index of the thumb in the array of thumbs provided by the `thumbs` `children` snippet prop.",
		},
		disabled: {
			default: C.FALSE,
			type: C.BOOLEAN,
			description: "Whether or not the thumb is disabled.",
		},
		...withChildProps({ elType: "HTMLSpanElement" }),
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
	props: withChildProps({ elType: "HTMLSpanElement" }),
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
		index: {
			type: "number",
			description:
				"The index of the tick in the array of ticks provided by the `ticks` `children` snippet prop.",
		},
		...withChildProps({ elType: "HTMLSpanElement" }),
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
