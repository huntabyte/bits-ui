import type { CalendarDateTime, DateValue, Time, ZonedDateTime } from "@internationalized/date";
import type {
	DATE_SEGMENT_PARTS,
	EDITABLE_SEGMENT_PARTS,
	NON_EDITABLE_SEGMENT_PARTS,
	EDITABLE_TIME_SEGMENT_PARTS,
} from "$lib/internal/date-time/field/parts.js";

export type Granularity = "day" | "hour" | "minute" | "second";
export type TimeGranularity = "hour" | "minute" | "second";
export type HourCycle = 12 | 24;
export type WeekStartsOn = 0 | 1 | 2 | 3 | 4 | 5 | 6;

export type DateMatcher = (date: DateValue) => boolean;

export type TimeValue = Time | CalendarDateTime | ZonedDateTime;

export type TimeValidator<T extends TimeValue> = (time: T) => string[] | string | void;

/**
 * A function that returns a string or array of strings as validation errors if the date is
 * invalid, or nothing if the date is valid
 */
export type DateValidator = (date: DateValue) => string[] | string | void;

/**
 * A function that returns a string or array of strings as validation errors if the date range
 * is invalid, or nothing if the date range is valid
 */
export type DateRangeValidator = (range: {
	start: DateValue;
	end: DateValue;
}) => string[] | string | void;

export type TimeRangeValidator<T extends TimeValue = Time> = (range: {
	start: T;
	end: T;
}) => string[] | string | void;

/**
 * A callback fired when the date field's value is invalid. Use this to display an error
 * message to the user.
 */
export type DateOnInvalid = (reason: "min" | "max" | "custom", msg?: string | string[]) => void;

/**
 * A callback fired when the time field's value is invalid. Use this to display an error
 * message to the user.
 */
export type TimeOnInvalid = (reason: "min" | "max" | "custom", msg?: string | string[]) => void;

export type DateRange = {
	start: DateValue | undefined;
	end: DateValue | undefined;
};

export type TimeRange<T extends TimeValue = Time> = {
	start: T | undefined;
	end: T | undefined;
};

export interface CalendarView<T> {
	/**
	 * A `DateValue` representing the main reference point for the view.
	 * For example, in a monthly calendar, this would be a date in the
	 * month being displayed. It acts as the source of truth for the view's scope.
	 */
	value: DateValue;

	/**
	 * A flat array of all the dates shown in the view, including dates from
	 * adjacent periods (e.g., previous/next months) that are displayed to fill
	 * the grid. Useful for rendering the calendar layout consistently.
	 */
	dates: T[];
}

export interface Month<T> extends CalendarView<T> {
	value: DateValue;
	/**
	 * An array of arrays representing the weeks in the calendar.
	 * Each sub-array represents a week, and contains the dates for each
	 * day in that week. This structure is useful for rendering the calendar
	 * grid using a table, where each row represents a week and each cell
	 * represents a day.
	 */
	weeks: T[][];
}

export interface Year<T> extends CalendarView<{ value: T; label: string }> {
	/**
	 * A 2D array representing the months in the year view.
	 * Each sub-array represents a row of months, and each entry contains
	 * the value and label of a month. This structure supports rendering
	 * a grid-based year view (e.g., 3x4 layout for 12 months).
	 */
	months: { value: T; label: string }[][];
}

export type DateSegmentPart = (typeof DATE_SEGMENT_PARTS)[number];
export type EditableTimeSegmentPart = (typeof EDITABLE_TIME_SEGMENT_PARTS)[number];
export type EditableSegmentPart = (typeof EDITABLE_SEGMENT_PARTS)[number];
export type NonEditableSegmentPart = (typeof NON_EDITABLE_SEGMENT_PARTS)[number];
export type SegmentPart = EditableSegmentPart | NonEditableSegmentPart;

export type TimeSegmentPart = EditableTimeSegmentPart | "literal";
export type AnyTimeExceptLiteral = Exclude<TimeSegmentPart, "literal">;

export type AnyExceptLiteral = Exclude<SegmentPart, "literal">;

export type DayPeriod = "AM" | "PM" | null;
export type DateSegmentObj = {
	[K in DateSegmentPart]: string | null;
};
export type TimeSegmentObj = {
	[K in EditableTimeSegmentPart]: K extends "dayPeriod" ? DayPeriod : string | null;
};
export type DateAndTimeSegmentObj = DateSegmentObj & TimeSegmentObj;
export type SegmentValueObj = DateSegmentObj | DateAndTimeSegmentObj;
export type SegmentContentObj = Record<EditableSegmentPart, string>;

export type TimeSegmentValueObj = TimeSegmentObj;
export type TimeSegmentContentObj = Record<EditableTimeSegmentPart, string>;

export type SegmentState = {
	lastKeyZero: boolean;
	hasLeftFocus: boolean;
	updating: string | null;
};

export type SegmentStateMap = {
	[K in EditableSegmentPart]: SegmentState;
};

export type TimeSegmentStateMap = {
	[K in EditableTimeSegmentPart]: SegmentState;
};
