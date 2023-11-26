import type { DateValue } from "@internationalized/date";

export type DateRange = {
	start: DateValue | undefined;
	end: DateValue | undefined;
};

export type SegmentPart =
	| "month"
	| "day"
	| "year"
	| "hour"
	| "minute"
	| "second"
	| "dayPeriod"
	| "timeZoneName"
	| "literal";
