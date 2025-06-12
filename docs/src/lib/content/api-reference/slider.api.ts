import type {
	SliderRangePropsWithoutHTML,
	SliderRootPropsWithoutHTML,
	SliderThumbLabelPropsWithoutHTML,
	SliderThumbPropsWithoutHTML,
	SliderTickLabelPropsWithoutHTML,
	SliderTickPropsWithoutHTML,
} from "bits-ui";
import {
	SliderRootChildrenSnippetProps,
	SliderRootChildSnippetProps,
	SliderRootOnValueChangeProp,
	SliderTickLabelPositionProp,
} from "./extended-types/slider/index.js";
import {
	NumberOrArrayNumberProp,
	OrientationProp,
	SliderThumbPositioningProp,
} from "./extended-types/shared/index.js";
import {
	dirProp,
	typeSingleOrMultipleProp,
	withChildProps,
} from "$lib/content/api-reference/shared.js";
import {
	defineBooleanProp,
	defineComponentApiSchema,
	defineEnumDataAttr,
	defineEnumProp,
	defineFunctionProp,
	defineNumberProp,
	defineSimpleDataAttr,
	defineUnionProp,
} from "../utils.js";

const orientationDataAttr = defineEnumDataAttr({
	name: "orientation",
	description: "The orientation of the slider.",
	options: ["horizontal", "vertical"],
	value: OrientationProp,
});

const sharedDataAttrs = [
	orientationDataAttr,
	defineSimpleDataAttr({
		name: "disabled",
		description: "Present when the slider is disabled.",
	}),
];

const root = defineComponentApiSchema<SliderRootPropsWithoutHTML>({
	title: "Root",
	description: "The root slider component which contains the remaining slider components.",
	props: {
		type: {
			...typeSingleOrMultipleProp,
			description:
				"The type of the slider. If set to `'multiple'`, the slider will allow multiple thumbs and the `value` will be an array of numbers.",
		},
		value: defineNumberProp({
			default: 0,
			description:
				"The current value of the slider. If the `type` is set to `'multiple'`, this should be an array of numbers and will default to an empty array.",
			bindable: true,
		}),
		onValueChange: defineFunctionProp({
			definition: SliderRootOnValueChangeProp,
			description: "A callback function called when the value state of the slider changes.",
			stringDefinition: "(value: number) => void | (value: number[]) => void",
		}),
		onValueCommit: defineFunctionProp({
			definition: SliderRootOnValueChangeProp,
			description:
				"A callback function called when the user finishes dragging the thumb and the value changes. This is different than the `onValueChange` callback because it waits until the user stops dragging before calling the callback, where the `onValueChange` callback is called immediately after the user starts dragging.",
			stringDefinition: "(value: number) => void | (value: number[]) => void",
		}),
		disabled: defineBooleanProp({
			default: false,
			description: "Whether or not the switch is disabled.",
		}),
		max: defineNumberProp({
			default: 100,
			description: "The maximum value of the slider.",
		}),
		min: defineNumberProp({
			default: 0,
			description: "The minimum value of the slider.",
		}),
		orientation: defineEnumProp({
			options: ["horizontal", "vertical"],
			default: "horizontal",
			description: "The orientation of the slider.",
			definition: OrientationProp,
		}),
		step: defineUnionProp({
			options: ["number[]", "number"],
			definition: NumberOrArrayNumberProp,
			description:
				"The step value of the slider. If a single number is provided, the slider will step by that number and use that number to generate the ticks (e.g. `step={1}` will generate ticks at `0, 1, 2, 3, ...`). If an array of numbers is provided, the slider will snap to those values (e.g. `step={[0, 4, 8, 16, 24]}`) and ticks will be generated at those values.",
			bindable: true,
		}),
		dir: dirProp,
		autoSort: defineBooleanProp({
			default: true,
			description:
				"Whether to automatically sort the values in the array when moving thumbs past one another. This is only applicable to the `'multiple'` type.",
		}),
		thumbPositioning: defineEnumProp({
			options: ["exact", "contain"],
			default: "contain",
			description:
				"The positioning of the slider thumb. `'contain'` will ensure that the thumb is always visible within the track, while `'exact'` will ensure that the thumb is always at the same position relative to the track. For an SSR-friendly alternative to `thumbPositioning='contain'`, use the `trackPadding` prop to set the padding between the thumbs/first ticks and the edges of the track.",
			definition: SliderThumbPositioningProp,
		}),
		trackPadding: defineNumberProp({
			description:
				"A percentage of the full track length to pad the start and end of the track. This is useful for creating a visual buffer between the thumbs or beginning/end ticks and the edges of the track. This is an SSR-friendly alternative to `thumbPositioning='contain'`.",
		}),
		...withChildProps({
			elType: "HTMLSpanElement",
			child: {
				definition: SliderRootChildSnippetProps,
				stringDefinition: `type TickItem = {
	/** The value this tick represents */
	value: number;
	/** The index of this tick */
	index: number;
};

type ChildSnippetProps = {
	/** The tick items to iterate over and render */
	tickItems: TickItem[];
	/** The currently active thumb */
	thumbs: number[];
	/** Props to apply to the root element */
	props: Record<string, unknown>;
};`,
			},
			children: {
				definition: SliderRootChildrenSnippetProps,
				stringDefinition: `type TickItem = {
	/** The value this tick represents */
	value: number;
	/** The index of this tick */
	index: number;
};

type ChildrenSnippetProps = {
	/** The tick items to iterate over and render */
	tickItems: TickItem[];
	/** The currently active thumb */
	thumbs: number[];
};`,
			},
		}),
	},
	dataAttributes: [
		...sharedDataAttrs,
		defineSimpleDataAttr({
			name: "slider-root",
			description: "Present on the root element.",
		}),
	],
});

const thumb = defineComponentApiSchema<SliderThumbPropsWithoutHTML>({
	title: "Thumb",
	description: "A thumb on the slider.",
	props: {
		index: defineNumberProp({
			description: "The index of the value this thumb represents.",
			required: true,
		}),
		disabled: defineBooleanProp({
			default: false,
			description: "Whether or not the thumb is disabled.",
		}),
		...withChildProps({ elType: "HTMLSpanElement" }),
	},
	dataAttributes: [
		orientationDataAttr,
		defineSimpleDataAttr({
			name: "disabled",
			description: "Present when either the thumb or the slider is disabled.",
		}),
		defineSimpleDataAttr({
			name: "active",
			description: "Present when the thumb is active/grabbed.",
		}),
		defineSimpleDataAttr({
			name: "slider-thumb",
			description: "Present on the thumb elements.",
		}),
	],
});

const range = defineComponentApiSchema<SliderRangePropsWithoutHTML>({
	title: "Range",
	description: "The range of the slider.",
	props: withChildProps({ elType: "HTMLSpanElement" }),
	dataAttributes: [
		...sharedDataAttrs,
		defineSimpleDataAttr({
			name: "slider-range",
			description: "Present on the range elements.",
		}),
	],
});

const tick = defineComponentApiSchema<SliderTickPropsWithoutHTML>({
	title: "Tick",
	description: "A tick mark on the slider.",
	props: {
		index: defineNumberProp({
			description:
				"The index of the tick in the array of ticks provided by the `ticks` `children` snippet prop.",
			required: true,
		}),
		...withChildProps({ elType: "HTMLSpanElement" }),
	},
	dataAttributes: [
		...sharedDataAttrs,
		defineSimpleDataAttr({
			name: "bounded",
			description:
				"Present when the tick is bounded (i.e. the tick is less than or equal to the current value).",
		}),
		defineSimpleDataAttr({
			name: "value",
			description: "The value the tick represents.",
		}),
		defineSimpleDataAttr({
			name: "selected",
			description: "Present when the tick is the same value as one of the thumbs.",
		}),
		defineSimpleDataAttr({
			name: "slider-tick",
			description: "Present on the tick elements.",
		}),
	],
});

const tickLabel = defineComponentApiSchema<SliderTickLabelPropsWithoutHTML>({
	title: "TickLabel",
	description: "A label for a tick on the slider.",
	props: {
		index: defineNumberProp({
			description:
				"The index of the tick in the array of ticks provided by the `ticks` `children` snippet prop.",
			required: true,
		}),
		position: defineEnumProp({
			options: ["top", "bottom", "left", "right"],
			description: "The position of the tick label.",
			definition: SliderTickLabelPositionProp,
		}),
		...withChildProps({ elType: "HTMLSpanElement" }),
	},
	dataAttributes: [
		...sharedDataAttrs,
		defineEnumDataAttr({
			name: "position",
			description: "The position of the tick label.",
			options: ["top", "bottom", "left", "right"],
			value: SliderTickLabelPositionProp,
		}),
		defineSimpleDataAttr({
			name: "selected",
			description:
				"Present when the tick this label represents is the same value as one of the thumbs.",
		}),
		defineSimpleDataAttr({
			name: "value",
			description: "The value of the tick this label represents.",
		}),
		defineSimpleDataAttr({
			name: "bounded",
			description:
				"Present when the tick this label represents is bounded (i.e. the tick is less than or equal to the current value or within the range of a multiple slider).",
		}),
		defineSimpleDataAttr({
			name: "slider-tick-label",
			description: "Present on the tick label elements.",
		}),
	],
});

const thumbLabel = defineComponentApiSchema<SliderThumbLabelPropsWithoutHTML>({
	title: "ThumbLabel",
	description: "A label for a thumb on the slider.",
	props: {
		index: defineNumberProp({
			description: "The index of the thumb this label represents.",
			required: true,
		}),
		position: defineEnumProp({
			options: ["top", "bottom", "left", "right"],
			description: "The position of the label relative to the thumb.",
			definition: SliderTickLabelPositionProp,
			default: "`'top'` for horizontal sliders and `'left'` for vertical sliders",
		}),
		...withChildProps({ elType: "HTMLSpanElement" }),
	},
	dataAttributes: [
		orientationDataAttr,
		defineSimpleDataAttr({
			name: "disabled",
			description:
				"Present when either the thumb this label represents or the slider is disabled.",
		}),
		defineEnumDataAttr({
			name: "position",
			description: "The position of the label relative to the thumb.",
			options: ["top", "bottom", "left", "right"],
			value: SliderTickLabelPositionProp,
		}),
		defineSimpleDataAttr({
			name: "active",
			description: "Present when the thumb this label represents is active.",
		}),
		defineSimpleDataAttr({
			name: "value",
			description: "The value of the thumb this label represents.",
		}),
		defineSimpleDataAttr({
			name: "slider-thumb-label",
			description: "Present on the thumb label elements.",
		}),
	],
});

export const slider = [root, range, thumb, thumbLabel, tick, tickLabel];
