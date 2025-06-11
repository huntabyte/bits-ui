import type {
	DateRangeFieldInputPropsWithoutHTML,
	DateRangeFieldLabelPropsWithoutHTML,
	DateRangeFieldRootPropsWithoutHTML,
	DateRangeFieldSegmentPropsWithoutHTML,
} from "bits-ui";
import { withChildProps } from "./shared.js";
import { input as dateFieldInput, root as dateFieldRoot } from "./date-field.api.js";
import {
	DateOnRangeChangeProp,
	DateRangeProp,
	OnStartEndValueChangeProp,
} from "./extended-types/shared/index.js";
import { DateRangeFieldInputTypeProp } from "./extended-types/date-range-field/index.js";
import { DateFieldSegmentPartProp } from "./extended-types/date-field/index.js";
import {
	defineComponentApiSchema,
	defineComponentPropSchema,
	defineEnumDataAttr,
	defineEnumProp,
	defineFunctionProp,
	defineSimpleDataAttr,
	defineStringProp,
} from "../utils.js";

export const root = defineComponentApiSchema<DateRangeFieldRootPropsWithoutHTML>({
	title: "Root",
	description: "The root date field component.",
	props: {
		value: defineComponentPropSchema({
			type: "DateRange",
			definition: DateRangeProp,
			stringDefinition: "{ start: DateValue; end: DateValue }",
			description: "The selected date range.",
			bindable: true,
		}),
		onValueChange: defineFunctionProp({
			definition: DateOnRangeChangeProp,
			description: "A function that is called when the selected date changes.",
			stringDefinition: "(value: DateRange) => void",
		}),
		placeholder: dateFieldRoot.props!.placeholder,
		onPlaceholderChange: dateFieldRoot.props!.onPlaceholderChange,
		errorMessageId: dateFieldRoot.props!.errorMessageId,
		validate: dateFieldRoot.props!.validate,
		onInvalid: dateFieldRoot.props!.onInvalid,
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
		onStartValueChange: defineFunctionProp({
			definition: OnStartEndValueChangeProp,
			description: "A function that is called when the start date changes.",
			stringDefinition: "(value: DateValue) => void",
		}),
		onEndValueChange: defineFunctionProp({
			definition: OnStartEndValueChangeProp,
			description: "A function that is called when the end date changes.",
			stringDefinition: "(value: DateValue) => void",
		}),
		...withChildProps({ elType: "HTMLDivElement" }),
	},
	dataAttributes: [
		defineSimpleDataAttr({
			name: "date-range-field-root",
			description: "Present on the root element.",
		}),
	],
});

export const input = defineComponentApiSchema<DateRangeFieldInputPropsWithoutHTML>({
	title: "Input",
	description: "The container for the segments of the date field.",
	props: {
		type: defineEnumProp({
			options: ["start", "end"],
			description: "The type of field to render (start or end).",
			required: true,
			definition: DateRangeFieldInputTypeProp,
		}),
		name: defineStringProp({
			description:
				"The name of the date field used for form submission. If provided, a hidden input element will be rendered alongside the date field.",
		}),
		...withChildProps({ elType: "HTMLDivElement" }),
		children: dateFieldInput.props!.children,
		child: dateFieldInput.props!.child,
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

export const segment = defineComponentApiSchema<DateRangeFieldSegmentPropsWithoutHTML>({
	title: "Segment",
	description: "A segment of the date field.",
	props: {
		part: defineComponentPropSchema({
			type: "SegmentPart",
			definition: DateFieldSegmentPartProp,
			stringDefinition: `"month" | "day" | "year" | "hour" | "minute" | "second" | "dayPeriod" | "timeZoneName" | "literal"`,
			description: "The part of the date to render.",
			required: true,
		}),
		...withChildProps({ elType: "HTMLSpanElement" }),
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
		defineEnumDataAttr({
			name: "segment",
			description: "The type of segment the element represents.",
			value: DateFieldSegmentPartProp,
			options: [
				"month",
				"day",
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

export const label = defineComponentApiSchema<DateRangeFieldLabelPropsWithoutHTML>({
	title: "Label",
	description: "The label for the date field.",
	props: withChildProps({ elType: "HTMLSpanElement" }),
	dataAttributes: [
		defineSimpleDataAttr({
			name: "invalid",
			description: "Present on the element when the field is invalid",
		}),
		defineSimpleDataAttr({
			name: "date-field-label",
			description: "Present on the element.",
		}),
	],
});

export const dateRangeField = [root, input, segment, label];
