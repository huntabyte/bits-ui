import type {
	TimeFieldInputPropsWithoutHTML,
	TimeFieldLabelPropsWithoutHTML,
	TimeFieldRootPropsWithoutHTML,
	TimeFieldSegmentPropsWithoutHTML,
} from "bits-ui";
import { childrenSnippet, timeValueProp, withChildProps } from "./shared.js";
import {
	TimeGranularityProp,
	HourCycleProp,
	OnTimePlaceholderChangeProp,
	OnTimeValueChangeProp,
	TimeFieldInputChildSnippetProps,
	TimeFieldInputChildrenSnippetProps,
	TimeOnInvalidProp,
	TimeSegmentPartProp,
	TimeValidateProp,
	TimeSegmentDataAttr,
} from "./extended-types/shared/index.js";

import { TimeFieldEditableSegmentPartProp } from "./extended-types/time-field/index.js";
import {
	defineBooleanProp,
	defineComponentApiSchema,
	defineComponentPropSchema,
	defineEnumDataAttr,
	defineEnumProp,
	defineFunctionProp,
	definePropSchema,
	defineSimpleDataAttr,
	defineStringProp,
} from "../utils.js";

export const root = defineComponentApiSchema<TimeFieldRootPropsWithoutHTML>({
	title: "Root",
	description: "The root time field component.",
	props: {
		value: definePropSchema({
			...timeValueProp,
			description: "The selected time.",
			bindable: true,
		}),
		onValueChange: defineFunctionProp({
			definition: OnTimeValueChangeProp,
			description:
				"A function that is called when the selected time changes. The type of value is inferred from the `value` prop if provided.",
			stringDefinition: "(value: TimeValue) => void",
		}),
		placeholder: definePropSchema({
			...timeValueProp,
			description:
				"The placeholder time, which is used to determine what time to start the segments from when no value exists.",
			bindable: true,
		}),
		onPlaceholderChange: defineFunctionProp({
			definition: OnTimePlaceholderChangeProp,
			description: "A function that is called when the placeholder time changes.",
			stringDefinition: "(value: TimeValue) => void",
		}),
		required: defineBooleanProp({
			description: "Whether or not the field is required.",
			default: false,
		}),
		validate: defineFunctionProp({
			definition: TimeValidateProp,
			description: "A function that returns whether or not a time is unavailable.",
			stringDefinition: "(time: TimeValue) => string[] | string | void",
		}),
		onInvalid: defineFunctionProp({
			definition: TimeOnInvalidProp,
			description: "A callback fired when the field's value is invalid.",
			stringDefinition: "(reason: 'min' | 'max' | 'custom', msg?: string | string[]) => void",
		}),
		errorMessageId: defineStringProp({
			description:
				"The `id` of the element which contains the error messages for the field when the time is invalid.",
		}),
		hourCycle: defineEnumProp({
			options: ["12", "24"],
			description:
				"The hour cycle to use for formatting times. Defaults to the locale preference",
			definition: HourCycleProp,
		}),
		granularity: defineEnumProp({
			options: ["hour", "minute", "second"],
			description:
				"The granularity to use for formatting the field. The field will render segments for each part of the time up to and including the specified granularity.",
			definition: TimeGranularityProp,
			default: "minute",
		}),
		hideTimeZone: defineBooleanProp({
			description:
				"Whether or not to hide the time zone segment of the field. This only applies when using a `ZonedDateTime` as the `value` prop.",
			default: false,
		}),
		maxValue: definePropSchema({
			...timeValueProp,
			description: "The maximum valid time that can be entered.",
		}),
		minValue: definePropSchema({
			...timeValueProp,
			description: "The minimum valid time that can be entered.",
		}),
		locale: defineStringProp({
			description: "The locale to use for formatting times.",
			default: "en-US",
		}),
		disabled: defineBooleanProp({
			default: false,
			description: "Whether or not the field is disabled.",
		}),
		readonly: defineBooleanProp({
			description: "Whether or not the field is readonly.",
			default: false,
		}),
		readonlySegments: defineComponentPropSchema({
			type: "EditableTimeSegmentPart[]",
			definition: TimeFieldEditableSegmentPartProp,
			stringDefinition: `"hour" | "minute" | "second" | "dayPeriod"`,
			description:
				"An array of segments that should be readonly, which prevent user input on them.",
		}),
		children: childrenSnippet(),
	},
});

export const input = defineComponentApiSchema<TimeFieldInputPropsWithoutHTML>({
	title: "Input",
	description: "The container for the segments of the time field.",
	props: {
		name: defineStringProp({
			description:
				"The name of the time field used for form submission. If provided, a hidden input element will be rendered alongside the time field.",
		}),
		...withChildProps({
			elType: "HTMLDivElement",
			children: {
				definition: TimeFieldInputChildrenSnippetProps,
				stringDefinition: `import type { TimeSegmentPart } from "bits-ui";

type ChildrenSnippetProps = {
	segments: Array<{ part: TimeSegmentPart; value: string }>;
};`,
			},
			child: {
				definition: TimeFieldInputChildSnippetProps,
				stringDefinition: `import type { TimeSegmentPart } from "bits-ui";

type ChildSnippetProps = {
	props: Record<string, unknown>;
	segments: Array<{ part: TimeSegmentPart; value: string }>;
};`,
			},
		}),
	},
	dataAttributes: [
		defineSimpleDataAttr({
			name: "invalid",
			description: "Present on the element when the field is invalid.",
		}),
		defineSimpleDataAttr({
			name: "disabled",
			description: "Present on the element when the field is disabled.",
		}),
		defineSimpleDataAttr({
			name: "time-field-input",
			description: "Present on the element.",
		}),
	],
});

export const segment = defineComponentApiSchema<TimeFieldSegmentPropsWithoutHTML>({
	title: "Segment",
	description: "A segment of the time field.",
	props: {
		part: defineComponentPropSchema({
			type: "TimeSegmentPart",
			definition: TimeSegmentPartProp,
			stringDefinition: `"hour" | "minute" | "second" | "dayPeriod" | "timeZoneName" | "literal";`,
			description: "The part of the time to render.",
			required: true,
		}),
		...withChildProps({ elType: "HTMLDivElement" }),
	},
	dataAttributes: [
		defineSimpleDataAttr({
			name: "invalid",
			description: "Present on the element when the field is invalid",
		}),
		defineSimpleDataAttr({
			name: "disabled",
			description: "Present on the element when the field is disabled",
		}),
		defineSimpleDataAttr({
			name: "readonly",
			description: "Present on the element when the field or segment is readonly",
		}),
		defineEnumDataAttr({
			name: "segment",
			description: "The part of the time to render.",
			options: ["hour", "minute", "second", "dayPeriod", "timeZoneName", "literal"],
			value: TimeSegmentDataAttr,
		}),
		defineSimpleDataAttr({
			name: "time-field-segment",
			description: "Present on the element.",
		}),
	],
});

export const label = defineComponentApiSchema<TimeFieldLabelPropsWithoutHTML>({
	title: "Label",
	description: "The label for the time field.",
	props: withChildProps({ elType: "HTMLSpanElement" }),
	dataAttributes: [
		defineSimpleDataAttr({
			name: "invalid",
			description: "Present on the element when the field is invalid",
		}),
		defineSimpleDataAttr({
			name: "disabled",
			description: "Present on the element when the field is disabled",
		}),
		defineSimpleDataAttr({
			name: "time-field-label",
			description: "Present on the element.",
		}),
	],
});

export const timeField = [root, input, segment, label];
