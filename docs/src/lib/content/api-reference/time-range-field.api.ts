import type {
	TimeRangeFieldInputPropsWithoutHTML,
	TimeRangeFieldLabelPropsWithoutHTML,
	TimeRangeFieldRootPropsWithoutHTML,
	TimeRangeFieldSegmentPropsWithoutHTML,
} from "bits-ui";
import { withChildProps } from "./shared.js";
import { input as timeFieldInput, root as timeFieldRoot } from "./time-field.api.js";
import {
	OnTimeStartEndValueChangeProp,
	TimeOnRangeChangeProp,
	TimeRangeProp,
	TimeSegmentDataAttr,
	TimeSegmentPartProp,
} from "./extended-types/shared/index.js";
import { DateRangeFieldInputTypeProp } from "./extended-types/date-range-field/index.js";
import {
	defineComponentApiSchema,
	defineComponentPropSchema,
	defineEnumDataAttr,
	defineEnumProp,
	defineFunctionProp,
	defineSimpleDataAttr,
	defineStringProp,
} from "../utils.js";

export const root = defineComponentApiSchema<TimeRangeFieldRootPropsWithoutHTML>({
	title: "Root",
	description: "The root time field component.",
	props: {
		value: defineComponentPropSchema({
			type: "TimeRange",
			definition: TimeRangeProp,
			stringDefinition: "{ start: TimeValue | undefined; end: TimeValue | undefined }",
			description: "The selected time range.",
			bindable: true,
		}),
		onValueChange: defineFunctionProp({
			definition: TimeOnRangeChangeProp,
			description: "A function that is called when the selected time range changes.",
			stringDefinition: "(value: TimeRange) => void",
		}),
		placeholder: timeFieldRoot.props!.placeholder,
		onPlaceholderChange: timeFieldRoot.props!.onPlaceholderChange,
		errorMessageId: timeFieldRoot.props!.errorMessageId,
		validate: timeFieldRoot.props!.validate,
		onInvalid: timeFieldRoot.props!.onInvalid,
		minValue: timeFieldRoot.props!.minValue,
		maxValue: timeFieldRoot.props!.maxValue,
		granularity: timeFieldRoot.props!.granularity,
		hideTimeZone: timeFieldRoot.props!.hideTimeZone,
		hourCycle: timeFieldRoot.props!.hourCycle,
		locale: timeFieldRoot.props!.locale,
		disabled: timeFieldRoot.props!.disabled,
		readonly: timeFieldRoot.props!.readonly,
		readonlySegments: timeFieldRoot.props!.readonlySegments,
		required: timeFieldRoot.props!.required,
		onStartValueChange: defineFunctionProp({
			definition: OnTimeStartEndValueChangeProp,
			description: "A function that is called when the start time changes.",
			stringDefinition: "(value: TimeValue | undefined) => void",
		}),
		onEndValueChange: defineFunctionProp({
			definition: OnTimeStartEndValueChangeProp,
			description: "A function that is called when the end time changes.",
			stringDefinition: "(value: TimeValue | undefined) => void",
		}),
		...withChildProps({ elType: "HTMLDivElement" }),
	},
	dataAttributes: [
		defineSimpleDataAttr({
			name: "time-range-field-root",
			description: "Present on the root element.",
		}),
	],
});

export const input = defineComponentApiSchema<TimeRangeFieldInputPropsWithoutHTML>({
	title: "Input",
	description: "The container for the segments of the time field.",
	props: {
		type: defineEnumProp({
			options: ["start", "end"],
			description: "The type of field to render (start or end).",
			required: true,
			definition: DateRangeFieldInputTypeProp,
		}),
		name: defineStringProp({
			description:
				"The name of the time field used for form submission. If provided, a hidden input element will be rendered alongside the time field.",
		}),
		...withChildProps({ elType: "HTMLDivElement" }),
		children: timeFieldInput.props!.children,
		child: timeFieldInput.props!.child,
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

export const segment = defineComponentApiSchema<TimeRangeFieldSegmentPropsWithoutHTML>({
	title: "Segment",
	description: "A segment of the time field.",
	props: {
		part: defineComponentPropSchema({
			type: "TimeSegmentPart",
			definition: TimeSegmentPartProp,
			stringDefinition: `"hour" | "minute" | "second" | "dayPeriod" | "timeZoneName" | "literal"`,
			description: "The part of the time to render.",
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
			options: ["hour", "minute", "second", "dayPeriod", "timeZoneName", "literal"],
			value: TimeSegmentDataAttr,
		}),
		defineSimpleDataAttr({
			name: "time-field-segment",
			description: "Present on the element.",
		}),
	],
});

export const label = defineComponentApiSchema<TimeRangeFieldLabelPropsWithoutHTML>({
	title: "Label",
	description: "The label for the time field.",
	props: withChildProps({ elType: "HTMLSpanElement" }),
	dataAttributes: [
		defineSimpleDataAttr({
			name: "invalid",
			description: "Present on the element when the field is invalid",
		}),
		defineSimpleDataAttr({
			name: "time-field-label",
			description: "Present on the element.",
		}),
	],
});

export const timeRangeField = [root, input, segment, label];
