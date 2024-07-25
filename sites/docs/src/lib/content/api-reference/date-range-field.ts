import type {
	DateRangeFieldInputPropsWithoutHTML,
	DateRangeFieldLabelPropsWithoutHTML,
	DateRangeFieldRootPropsWithoutHTML,
	DateRangeFieldSegmentPropsWithoutHTML,
} from "bits-ui";
import { createApiSchema, createEnumProp, createFunctionProp, withChildProps } from "./helpers.js";
import { enums } from "$lib/content/api-reference/helpers.js";
import * as C from "$lib/content/constants.js";
import { root as dateFieldRoot } from "./date-field.js";

export const root = createApiSchema<DateRangeFieldRootPropsWithoutHTML>({
	title: "Root",
	description: "The root date field component.",
	props: {
		value: {
			type: {
				type: "DateRange",
				definition: "{ start: DateValue; end: DateValue; }",
			},
			description: "The selected date range.",
		},
		onValueChange: {
			type: {
				type: C.FUNCTION,
				definition: "(date: DateRange | undefined) => void",
			},
			description: "A function that is called when the selected date changes.",
		},
		placeholder: dateFieldRoot.props!.placeholder,
		onPlaceholderChange: dateFieldRoot.props!.onPlaceholderChange,
		isDateUnavailable: dateFieldRoot.props!.isDateUnavailable,
		minValue: dateFieldRoot.props!.minValue,
		maxValue: dateFieldRoot.props!.maxValue,
		granularity: dateFieldRoot.props!.granularity,
		hideTimeZone: dateFieldRoot.props!.hideTimeZone,
		hourCycle: dateFieldRoot.props!.hourCycle,
		locale: dateFieldRoot.props!.locale,
		disabled: dateFieldRoot.props!.disabled,
		readonly: dateFieldRoot.props!.readonly,
		readonlySegments: dateFieldRoot.props!.readonlySegments,
		required: dateFieldRoot.props!.required,
		onStartValueChange: createFunctionProp({
			definition: "(date: DateValue | undefined) => void",
			description: "A function that is called when the start date changes.",
		}),
		onEndValueChange: createFunctionProp({
			definition: "(date: DateValue | undefined) => void",
			description: "A function that is called when the end date changes.",
		}),
		...withChildProps({ elType: "HTMLDivElement" }),
	},
});

export const input = createApiSchema<DateRangeFieldInputPropsWithoutHTML>({
	title: "Input",
	description: "The container for the segments of the date field.",
	props: {
		type: createEnumProp({
			options: ["start", "end"],
			description: "The type of field to render (start or end).",
			required: true,
		}),
		name: {
			type: C.STRING,
			description:
				"The name of the date field used for form submission. If provided, a hidden input element will be rendered alongside the date field.",
		},
		...withChildProps({ elType: "HTMLDivElement" }),
	},
	dataAttributes: [
		{
			name: "invalid",
			description: "Present on the element when the field is invalid.",
		},
		{
			name: "disabled",
			description: "Present on the element when the field is disabled.",
		},
		{
			name: "date-field-input",
			description: "Present on the element.",
		},
	],
});

export const segment = createApiSchema<DateRangeFieldSegmentPropsWithoutHTML>({
	title: "Segment",
	description: "A segment of the date field.",
	props: {
		part: {
			type: {
				type: "SegmentPart",
				definition: enums(
					"month",
					"day",
					"year",
					"hour",
					"minute",
					"second",
					"dayPeriod",
					"timeZoneName",
					"literal"
				),
			},
			description: "The part of the date to render.",
			required: true,
		},
		...withChildProps({ elType: "HTMLSpanElement" }),
	},
	dataAttributes: [
		{
			name: "invalid",
			description: "Present on the element when the field is invalid",
		},
		{
			name: "disabled",
			description: "Present on the element when the field is disabled",
		},
		{
			name: "segment",
			value: enums(
				"month",
				"day",
				"year",
				"hour",
				"minute",
				"second",
				"dayPeriod",
				"timeZoneName",
				"literal"
			),
			isEnum: true,
			description: "The type of segment the element represents.",
		},
		{
			name: "date-field-segment",
			description: "Present on the element.",
		},
	],
});

export const label = createApiSchema<DateRangeFieldLabelPropsWithoutHTML>({
	title: "Label",
	description: "The label for the date field.",
	props: withChildProps({ elType: "HTMLSpanElement" }),
	dataAttributes: [
		{
			name: "invalid",
			description: "Present on the element when the field is invalid",
		},
		{
			name: "date-field-label",
			description: "Present on the element.",
		},
	],
});

export const dateRangeField = [root, input, segment, label];
