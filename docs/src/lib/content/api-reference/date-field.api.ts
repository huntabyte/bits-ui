import type {
	DateFieldInputPropsWithoutHTML,
	DateFieldLabelPropsWithoutHTML,
	DateFieldRootPropsWithoutHTML,
	DateFieldSegmentPropsWithoutHTML,
} from "bits-ui";
import {
	childrenSnippet,
	dateOnInvalidProp,
	dateValidateProp,
	onDateValueChangeProp,
	onPlaceholderChangeProp,
	withChildProps,
} from "./shared.js";
import {
	DateFieldInputChildSnippetProps,
	DateFieldInputChildrenSnippetProps,
	DateFieldSegmentDataAttr,
	GranularityProp,
	HourCycleProp,
	SegmentPartProp,
} from "./extended-types/shared/index.js";

import { DateFieldEditableSegmentPartProp } from "./extended-types/date-field/index.js";
import {
	defineBooleanProp,
	defineComponentApiSchema,
	defineComponentPropSchema,
	defineEnumDataAttr,
	defineEnumProp,
	definePropSchema,
	defineSimpleDataAttr,
	defineStringProp,
} from "../utils.js";
import { dateValueProp } from "./shared.js";

export const root = defineComponentApiSchema<DateFieldRootPropsWithoutHTML>({
	title: "Root",
	description: "The root date field component.",
	props: {
		value: definePropSchema({
			...dateValueProp,
			description: "The selected date.",
		}),
		onValueChange: onDateValueChangeProp,
		placeholder: definePropSchema({
			...dateValueProp,
			description:
				"The placeholder date, which is used to determine what date to start the segments from when no value exists.",
			bindable: true,
		}),
		onPlaceholderChange: onPlaceholderChangeProp,
		required: defineBooleanProp({
			description: "Whether or not the date field is required.",
			default: false,
		}),
		validate: dateValidateProp,
		onInvalid: dateOnInvalidProp,
		errorMessageId: defineStringProp({
			description:
				"The `id` of the element which contains the error messages for the date field when the date is invalid.",
		}),
		hourCycle: defineEnumProp({
			options: ["12", "24"],
			description:
				"The hour cycle to use for formatting times. Defaults to the locale preference",
			definition: HourCycleProp,
		}),
		granularity: defineEnumProp({
			options: ["day", "hour", "minute", "second"],
			description:
				"The granularity to use for formatting the field. Defaults to `'day'` if a `CalendarDate` is provided, otherwise defaults to `'minute'`. The field will render segments for each part of the date up to and including the specified granularity.",
			definition: GranularityProp,
		}),
		hideTimeZone: defineBooleanProp({
			description: "Whether or not to hide the time zone segment of the field.",
			default: false,
		}),
		maxValue: definePropSchema({
			...dateValueProp,
			description: "The maximum valid date that can be entered.",
		}),
		minValue: definePropSchema({
			...dateValueProp,
			description: "The minimum valid date that can be entered.",
		}),
		locale: defineStringProp({
			description: "The locale to use for formatting dates.",
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
			type: "EditableSegmentPart[]",
			definition: DateFieldEditableSegmentPartProp,
			stringDefinition: `"day" | "month" | "year" | "hour" | "minute" | "second" | "dayPeriod"`,
			description:
				"An array of segments that should be readonly, which prevent user input on them.",
		}),
		children: childrenSnippet(),
	},
});

export const input = defineComponentApiSchema<DateFieldInputPropsWithoutHTML>({
	title: "Input",
	description: "The container for the segments of the date field.",
	props: {
		name: defineStringProp({
			description:
				"The name of the date field used for form submission. If provided, a hidden input element will be rendered alongside the date field.",
		}),
		...withChildProps({
			elType: "HTMLDivElement",
			children: {
				definition: DateFieldInputChildrenSnippetProps,
				stringDefinition: `import type { SegmentPart } from "bits-ui";
type ChildrenSnippetProps = {
	segments: Array<{ part: SegmentPart; value: string }>;
};`,
			},
			child: {
				definition: DateFieldInputChildSnippetProps,
				stringDefinition: `import type { SegmentPart } from "bits-ui";
type ChildSnippetProps = {
	props: Record<string, unknown>;
	segments: Array<{ part: SegmentPart; value: string }>;
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
			name: "date-field-input",
			description: "Present on the element.",
		}),
	],
});

export const segment = defineComponentApiSchema<DateFieldSegmentPropsWithoutHTML>({
	title: "Segment",
	description: "A segment of the date field.",
	props: {
		part: defineComponentPropSchema({
			type: "SegmentPart",
			definition: SegmentPartProp,
			stringDefinition: `"day" |"month" | "year" | "hour" | "minute" | "second" | "dayPeriod" | "timeZoneName" | "literal";`,
			description: "The part of the date to render.",
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
			description: "The part of the date being rendered.",
			value: DateFieldSegmentDataAttr,
			options: [
				"day",
				"month",
				"year",
				"hour",
				"minute",
				"second",
				"dayPeriod",
				"timeZoneName",
				"literal",
			],
		}),
		defineSimpleDataAttr({
			name: "date-field-segment",
			description: "Present on the element.",
		}),
	],
});

export const label = defineComponentApiSchema<DateFieldLabelPropsWithoutHTML>({
	title: "Label",
	description: "The label for the date field.",
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
			name: "date-field-label",
			description: "Present on the element.",
		}),
	],
});

export const dateField = [root, input, segment, label];
