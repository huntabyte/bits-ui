import type {
	SliderRangePropsWithoutHTML,
	SliderRootPropsWithoutHTML,
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
	SingleOrMultipleProp,
	SliderThumbPositioningProp,
} from "./extended-types/shared/index.js";
import {
	createApiSchema,
	createBooleanProp,
	createDataAttrSchema,
	createEnumProp,
	createFunctionProp,
	createNumberProp,
	createUnionProp,
	dirProp,
	withChildProps,
} from "$lib/content/api-reference/helpers.js";
import * as C from "$lib/content/constants.js";

const sharedDataAttrs = [
	createDataAttrSchema({
		name: "orientation",
		definition: OrientationProp,
		description: "The orientation of the slider.",
		isEnum: true,
	}),
	createDataAttrSchema({
		name: "disabled",
		description: "Present when the slider is disabled.",
	}),
];

const root = createApiSchema<SliderRootPropsWithoutHTML>({
	title: "Root",
	description: "The root slider component which contains the remaining slider components.",
	props: {
		type: createUnionProp({
			options: ["'single'", "'multiple'"],
			description:
				"The type of the slider. If set to `'multiple'`, the slider will allow multiple thumbs and the `value` will be an array of numbers.",
			required: true,
			definition: SingleOrMultipleProp,
		}),
		value: {
			default: "0",
			type: "number",
			description:
				"The current value of the slider. If the `type` is set to `'multiple'`, this should be an array of numbers and will default to an empty array.",
			bindable: true,
		},
		onValueChange: createFunctionProp({
			definition: SliderRootOnValueChangeProp,
			description: "A callback function called when the value state of the slider changes.",
			stringDefinition: "(value: number) => void | (value: number[]) => void",
		}),
		onValueCommit: createFunctionProp({
			definition: SliderRootOnValueChangeProp,
			description:
				"A callback function called when the user finishes dragging the thumb and the value changes. This is different than the `onValueChange` callback because it waits until the user stops dragging before calling the callback, where the `onValueChange` callback is called immediately after the user starts dragging.",
			stringDefinition: "(value: number) => void | (value: number[]) => void",
		}),
		disabled: createBooleanProp({
			default: C.FALSE,
			description: "Whether or not the switch is disabled.",
		}),
		max: createNumberProp({
			default: "100",
			description: "The maximum value of the slider.",
		}),
		min: createNumberProp({
			default: "0",
			description: "The minimum value of the slider.",
		}),
		orientation: createEnumProp({
			options: ["horizontal", "vertical"],
			default: "'horizontal'",
			description: "The orientation of the slider.",
			definition: OrientationProp,
		}),
		step: createUnionProp({
			options: ["number[]", "number"],
			definition: NumberOrArrayNumberProp,
			description:
				"The step value of the slider. If a single number is provided, the slider will step by that number and use that number to generate the ticks (e.g. `step={1}` will generate ticks at `0, 1, 2, 3, ...`). If an array of numbers is provided, the slider will snap to those values (e.g. `step={[0, 4, 8, 16, 24]}`) and ticks will be generated at those values.",
			bindable: true,
		}),
		dir: dirProp,
		autoSort: createBooleanProp({
			default: C.TRUE,
			description:
				"Whether to automatically sort the values in the array when moving thumbs past one another. This is only applicable to the `'multiple'` type.",
		}),
		thumbPositioning: createEnumProp({
			options: ["exact", "contain"],
			default: "'contain'",
			description:
				"The positioning of the slider thumb. `'contain'` will ensure that the thumb is always visible within the track, while `'exact'` will ensure that the thumb is always at the same position relative to the track. For an SSR-friendly alternative to `thumbPositioning='contain'`, use the `trackPadding` prop to set the padding between the thumbs/first ticks and the edges of the track.",
			definition: SliderThumbPositioningProp,
		}),
		trackPadding: createNumberProp({
			description:
				"A percentage of the full track length to pad the start and end of the track. This is useful for creating a visual buffer between the thumbs or beginning/end ticks and the edges of the track. This is an SSR-friendly alternative to `thumbPositioning='contain'`.",
		}),
		...withChildProps({
			elType: "HTMLSpanElement",
			childDef: SliderRootChildSnippetProps,
			childrenDef: SliderRootChildrenSnippetProps,
		}),
	},
	dataAttributes: [
		...sharedDataAttrs,
		createDataAttrSchema({
			name: "slider-root",
			description: "Present on the root element.",
		}),
	],
});

const thumb = createApiSchema<SliderThumbPropsWithoutHTML>({
	title: "Thumb",
	description: "A thumb on the slider.",
	props: {
		index: createNumberProp({
			description:
				"The index of the thumb in the array of thumbs provided by the `thumbs` `children` snippet prop.",
			required: true,
		}),
		disabled: createBooleanProp({
			default: C.FALSE,
			description: "Whether or not the thumb is disabled.",
		}),
		...withChildProps({ elType: "HTMLSpanElement" }),
	},
	dataAttributes: [
		...sharedDataAttrs,
		createDataAttrSchema({
			name: "active",
			description: "Present when the thumb is active/grabbed.",
		}),
		createDataAttrSchema({
			name: "slider-thumb",
			description: "Present on the thumb elements.",
		}),
	],
});

const range = createApiSchema<SliderRangePropsWithoutHTML>({
	title: "Range",
	description: "The range of the slider.",
	props: withChildProps({ elType: "HTMLSpanElement" }),
	dataAttributes: [
		createDataAttrSchema({
			name: "orientation",
			definition: OrientationProp,
			description: "The orientation of the slider.",
		}),
		createDataAttrSchema({
			name: "disabled",
			description: "Present when the slider is disabled.",
		}),
		createDataAttrSchema({
			name: "slider-range",
			description: "Present on the range elements.",
		}),
	],
});

const tick = createApiSchema<SliderTickPropsWithoutHTML>({
	title: "Tick",
	description: "A tick mark on the slider.",
	props: {
		index: createNumberProp({
			description:
				"The index of the tick in the array of ticks provided by the `ticks` `children` snippet prop.",
			required: true,
		}),
		...withChildProps({ elType: "HTMLSpanElement" }),
	},
	dataAttributes: [
		createDataAttrSchema({
			name: "bounded",
			description:
				"Present when the tick is bounded (i.e. the tick is less than or equal to the current value).",
		}),
		createDataAttrSchema({
			name: "disabled",
			description: "Present when the slider is disabled.",
		}),
		createDataAttrSchema({
			name: "orientation",
			definition: OrientationProp,
			description: "The orientation of the slider.",
		}),
		createDataAttrSchema({
			name: "value",
			description: "The value the tick represents.",
		}),
		createDataAttrSchema({
			name: "slider-tick",
			description: "Present on the tick elements.",
		}),
	],
});

const tickLabel = createApiSchema<SliderTickLabelPropsWithoutHTML>({
	title: "TickLabel",
	description: "A label for a tick on the slider.",
	props: {
		index: createNumberProp({
			description:
				"The index of the tick in the array of ticks provided by the `ticks` `children` snippet prop.",
			required: true,
		}),
		position: createEnumProp({
			options: ["top", "bottom", "left", "right"],
			description: "The position of the tick label.",
			definition: SliderTickLabelPositionProp,
		}),
		...withChildProps({ elType: "HTMLSpanElement" }),
	},
	dataAttributes: [
		...sharedDataAttrs,
		createDataAttrSchema({
			name: "position",
			definition: SliderTickLabelPositionProp,
			description: "The position of the tick label.",
			isEnum: true,
		}),
		createDataAttrSchema({
			name: "selected",
			description: "Present when the tick this label represents is a selected value.",
		}),
		createDataAttrSchema({
			name: "value",
			description: "The value of the tick this label represents.",
		}),
		createDataAttrSchema({
			name: "bounded",
			description:
				"Present when the tick this label represents is bounded (i.e. the tick is less than or equal to the current value or within the range of a multiple slider).",
		}),
		createDataAttrSchema({
			name: "slider-tick-label",
			description: "Present on the tick label elements.",
		}),
	],
});

export const slider = [root, range, thumb, tick, tickLabel];
