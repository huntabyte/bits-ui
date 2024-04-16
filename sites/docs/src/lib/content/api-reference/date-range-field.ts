import type {
	DateRangeFieldInputPropsWithoutHTML,
	DateRangeFieldLabelPropsWithoutHTML,
	DateRangeFieldPropsWithoutHTML,
	DateRangeFieldSegmentPropsWithoutHTML,
} from "bits-ui";
import { builderAndAttrsSlotProps } from "./helpers.js";
import { domElProps, enums, idsSlotProp, union } from "$lib/content/api-reference/helpers.js";
import { dateValueProp } from "$lib/content/api-reference/extended-types/index.js";
import * as C from "$lib/content/constants.js";
import type { APISchema } from "$lib/types/index.js";

export const root: APISchema<DateRangeFieldPropsWithoutHTML> = {
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
		placeholder: {
			type: dateValueProp,
			description:
				"The placeholder date, which is used to determine what date to start the segments from when no value exists.",
		},
		onPlaceholderChange: {
			type: {
				type: C.FUNCTION,
				definition: "(date: DateValue) => void",
			},
			description: "A function that is called when the placeholder date changes.",
		},
		isDateUnavailable: {
			type: {
				type: C.FUNCTION,
				definition: "(date: DateValue) => boolean",
			},
			description: "A function that returns whether or not a date is unavailable.",
		},
		hourCycle: {
			type: {
				type: C.ENUM,
				definition: union("12", "24"),
			},
			description:
				"The hour cycle to use for formatting times. Defaults to the locale preference",
		},
		granularity: {
			type: {
				type: C.ENUM,
				definition: enums("day", "hour", "minute", "second"),
			},
			description:
				"The granularity to use for formatting the field. Defaults to `'day'` if a `CalendarDate` is provided, otherwise defaults to `'minute'`. The field will render segments for each part of the date up to and including the specified granularity.",
		},
		hideTimeZone: {
			type: C.BOOLEAN,
			description: "Whether or not to hide the time zone segment of the field.",
			default: C.FALSE,
		},
		validationId: {
			type: C.STRING,
			description:
				"The id of your validation message element, if any, which will be applied to the `aria-describedby` attribute of the appropriate elements when a validation error occurs.",
		},
		descriptionId: {
			type: C.STRING,
			description:
				"The id of your description element, if any, which will be applied to the `aria-describedby` attribute of the appropriate elements.",
		},
		maxValue: {
			type: dateValueProp,
			description: "The maximum valid date that can be entered.",
		},
		minValue: {
			type: dateValueProp,
			description: "The minimum valid date that can be entered.",
		},
		locale: {
			type: C.STRING,
			description: "The locale to use for formatting dates.",
		},
		disabled: {
			default: C.FALSE,
			type: C.BOOLEAN,
			description: "Whether or not the accordion is disabled.",
		},
		readonly: {
			type: C.BOOLEAN,
			description: "Whether or not the field is readonly.",
			default: C.FALSE,
		},
		readonlySegments: {
			type: {
				type: C.OBJECT,
				definition: "{ start: EditableSegmentPart[]; end: EditableSegmentPart[]; }",
			},
			description:
				"The segments for the start and end fields that should be readonly, meaning users cannot edit them. This is useful for prepopulating fixed segments like years, months, or days.",
		},
	},
	slotProps: {
		ids: idsSlotProp,
		isInvalid: {
			type: C.BOOLEAN,
			description: "Whether or not the field is invalid.",
		},
	},
};

export const input: APISchema<DateRangeFieldInputPropsWithoutHTML> = {
	title: "Input",
	description: "The container for the segments of the date field.",
	props: domElProps("HTMLDivElement"),
	slotProps: {
		...builderAndAttrsSlotProps,
		segments: {
			type: {
				type: C.ARRAY,
				definition: "{ part: SegmentPart; value: string; }[]",
			},
			description: "An array of objects used to render the segments of the date field.",
		},
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
};

export const segment: APISchema<DateRangeFieldSegmentPropsWithoutHTML> = {
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
		type: {
			type: {
				type: C.ENUM,
				definition: enums("start", "end"),
			},
			description: "The type of field to render (start or end).",
			required: true,
		},
		...domElProps("HTMLDivElement"),
	},
	slotProps: {
		...builderAndAttrsSlotProps,
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
};

export const label: APISchema<DateRangeFieldLabelPropsWithoutHTML> = {
	title: "Label",
	description: "The label for the date field.",
	props: domElProps("HTMLSpanElement"),
	slotProps: {
		...builderAndAttrsSlotProps,
	},
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
};

export const dateRangeField = [root, input, segment, label];
