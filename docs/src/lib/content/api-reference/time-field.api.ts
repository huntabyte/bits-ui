import type {
	TimeFieldInputPropsWithoutHTML,
	TimeFieldLabelPropsWithoutHTML,
	TimeFieldRootPropsWithoutHTML,
	TimeFieldSegmentPropsWithoutHTML,
} from "bits-ui";
import {
	childrenSnippet,
	createApiSchema,
	createBooleanProp,
	createDataAttrSchema,
	createEnumDataAttr,
	createEnumProp,
	createFunctionProp,
	createPropSchema,
	createStringProp,
	withChildProps,
} from "./helpers.js";
import { timeValueProp } from "./extended-types/index.js";
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
} from "./extended-types/shared/index.js";

import * as C from "$lib/content/constants.js";
import { TimeFieldEditableSegmentPartProp } from "./extended-types/time-field/index.js";

export const root = createApiSchema<TimeFieldRootPropsWithoutHTML>({
	title: "Root",
	description: "The root time field component.",
	props: {
		value: createPropSchema({
			type: timeValueProp,
			description: "The selected time.",
			bindable: true,
		}),
		onValueChange: createFunctionProp({
			definition: OnTimeValueChangeProp,
			description:
				"A function that is called when the selected time changes. The type of value is inferred from the `value` prop if provided.",
			stringDefinition: "(value: TimeValue) => void",
		}),
		placeholder: createPropSchema({
			type: timeValueProp,
			description:
				"The placeholder time, which is used to determine what time to start the segments from when no value exists.",
			bindable: true,
		}),
		onPlaceholderChange: createFunctionProp({
			definition: OnTimePlaceholderChangeProp,
			description: "A function that is called when the placeholder time changes.",
			stringDefinition: "(value: TimeValue) => void",
		}),
		required: createBooleanProp({
			description: "Whether or not the field is required.",
			default: C.FALSE,
		}),
		validate: createFunctionProp({
			definition: TimeValidateProp,
			description: "A function that returns whether or not a time is unavailable.",
			stringDefinition: "(time: TimeValue) => string[] | string | void",
		}),
		onInvalid: createFunctionProp({
			definition: TimeOnInvalidProp,
			description: "A callback fired when the field's value is invalid.",
			stringDefinition: "(reason: 'min' | 'max' | 'custom', msg?: string | string[]) => void",
		}),
		errorMessageId: createStringProp({
			description:
				"The `id` of the element which contains the error messages for the field when the time is invalid.",
		}),
		hourCycle: createEnumProp({
			options: ["12", "24"],
			description:
				"The hour cycle to use for formatting times. Defaults to the locale preference",
			definition: HourCycleProp,
		}),
		granularity: createEnumProp({
			options: ["hour", "minute", "second"],
			description:
				"The granularity to use for formatting the field. The field will render segments for each part of the time up to and including the specified granularity.",
			definition: TimeGranularityProp,
			default: "minute",
		}),
		hideTimeZone: createBooleanProp({
			description:
				"Whether or not to hide the time zone segment of the field. This only applies when using a `ZonedDateTime` as the `value` prop.",
			default: C.FALSE,
		}),
		maxValue: createPropSchema({
			type: timeValueProp,
			description: "The maximum valid time that can be entered.",
		}),
		minValue: createPropSchema({
			type: timeValueProp,
			description: "The minimum valid time that can be entered.",
		}),
		locale: createStringProp({
			description: "The locale to use for formatting times.",
			default: "'en-US'",
		}),
		disabled: createBooleanProp({
			default: C.FALSE,
			description: "Whether or not the field is disabled.",
		}),
		readonly: createBooleanProp({
			description: "Whether or not the field is readonly.",
			default: C.FALSE,
		}),
		readonlySegments: createPropSchema({
			type: {
				type: "EditableTimeSegmentPart[]",
				definition: TimeFieldEditableSegmentPartProp,
				stringDefinition: `"hour" | "minute" | "second" | "dayPeriod"`,
			},
			description:
				"An array of segments that should be readonly, which prevent user input on them.",
		}),
		children: childrenSnippet(),
	},
});

export const input = createApiSchema<TimeFieldInputPropsWithoutHTML>({
	title: "Input",
	description: "The container for the segments of the time field.",
	props: {
		name: createStringProp({
			description:
				"The name of the time field used for form submission. If provided, a hidden input element will be rendered alongside the time field.",
		}),
		...withChildProps({
			elType: "HTMLDivElement",
			childrenDef: TimeFieldInputChildrenSnippetProps,
			childDef: TimeFieldInputChildSnippetProps,
		}),
	},
	dataAttributes: [
		createDataAttrSchema({
			name: "invalid",
			description: "Present on the element when the field is invalid.",
		}),
		createDataAttrSchema({
			name: "disabled",
			description: "Present on the element when the field is disabled.",
		}),
		createDataAttrSchema({
			name: "time-field-input",
			description: "Present on the element.",
		}),
	],
});

export const segment = createApiSchema<TimeFieldSegmentPropsWithoutHTML>({
	title: "Segment",
	description: "A segment of the time field.",
	props: {
		part: createPropSchema({
			type: {
				type: "TimeSegmentPart",
				definition: TimeSegmentPartProp,
				stringDefinition: `"hour" | "minute" | "second" | "dayPeriod" | "timeZoneName" | "literal";`,
			},
			description: "The part of the time to render.",
			required: true,
		}),
		...withChildProps({ elType: "HTMLDivElement" }),
	},
	dataAttributes: [
		createDataAttrSchema({
			name: "invalid",
			description: "Present on the element when the field is invalid",
		}),
		createDataAttrSchema({
			name: "disabled",
			description: "Present on the element when the field is disabled",
		}),
		createDataAttrSchema({
			name: "readonly",
			description: "Present on the element when the field or segment is readonly",
		}),
		createEnumDataAttr({
			name: "segment",
			description: "The part of the time to render.",
			options: ["hour", "minute", "second", "dayPeriod", "timeZoneName", "literal"],
		}),
		createDataAttrSchema({
			name: "time-field-segment",
			description: "Present on the element.",
		}),
	],
});

export const label = createApiSchema<TimeFieldLabelPropsWithoutHTML>({
	title: "Label",
	description: "The label for the time field.",
	props: withChildProps({ elType: "HTMLSpanElement" }),
	dataAttributes: [
		createDataAttrSchema({
			name: "invalid",
			description: "Present on the element when the field is invalid",
		}),
		createDataAttrSchema({
			name: "disabled",
			description: "Present on the element when the field is disabled",
		}),
		createDataAttrSchema({
			name: "time-field-label",
			description: "Present on the element.",
		}),
	],
});

export const timeField = [root, input, segment, label];
