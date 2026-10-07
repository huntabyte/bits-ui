import { describe, expect, it } from "vitest";
import { CalendarDate, CalendarDateTime } from "@internationalized/date";
import { boxWith } from "svelte-toolbelt";
import { createFormatter } from "../formatter.js";
import {
	createContent,
	getDateRefForPart,
	getDaySegmentMaxValue,
	getValueFromSegments,
} from "./helpers.js";
import type { SegmentValueObj } from "./types.js";

/**
 * Builds a field node whose segments appear in the given order, mimicking the
 * order the segments are rendered in for a given locale.
 */
function createFieldNode(parts: string[]) {
	const field = document.createElement("div");
	for (const part of parts) {
		const segment = document.createElement("div");
		segment.dataset.segment = part;
		field.appendChild(segment);
	}
	return field;
}

/**
 * Renders the day segment through the real `createContent` pipeline for a given
 * set of typed segment values. The placeholder is in November, which only has 30
 * days — so a typed `31` is only kept if the rendering does not constrain it.
 */
function renderDay(segmentValues: Partial<SegmentValueObj>) {
	return createContent({
		segmentValues: {
			day: null,
			month: null,
			year: null,
			hour: null,
			minute: null,
			second: null,
			dayPeriod: null,
			...segmentValues,
		} as SegmentValueObj,
		formatter: createFormatter({
			initialLocale: "en-GB",
			monthFormat: boxWith(() => "long"),
			yearFormat: boxWith(() => "numeric"),
		}),
		locale: "en-GB",
		granularity: "day",
		dateRef: new CalendarDate(2026, 11, 5),
		hideTimeZone: false,
		hourCycle: undefined,
	});
}

describe("day rendering", () => {
	it("renders the typed day while the month segment is still empty", () => {
		// The placeholder month has 30 days, so the typed `31` must not render as `30`.
		expect(renderDay({ day: "31" }).obj.day).toBe("31");
	});

	it("constrains the rendered day once a month is entered", () => {
		expect(renderDay({ day: "31", month: "11", year: "2026" }).obj.day).toBe("30");
	});

	it("renders february 29th when the entered year is a leap year", () => {
		expect(renderDay({ day: "29", month: "02", year: "2028" }).obj.day).toBe("29");
	});
});

describe("getDateRefForPart", () => {
	it("applies the entered month and year before rendering the day", () => {
		// February 2028 has 29 days. Without applying the entered month and year first,
		// the day would be constrained by the placeholder's month (November, 30 days).
		const dateRef = getDateRefForPart("day", new CalendarDate(2026, 11, 5), {
			day: "29",
			month: "02",
			year: "2028",
		} as SegmentValueObj);

		expect(dateRef.month).toBe(2);
		expect(dateRef.year).toBe(2028);
		expect(dateRef.set({ day: 29 }).day).toBe(29);
	});

	it("constrains the day by the entered month and year", () => {
		const dateRef = getDateRefForPart("day", new CalendarDate(2026, 11, 5), {
			day: "29",
			month: "02",
			year: "2028",
		} as SegmentValueObj);

		expect(dateRef.set({ day: 29 }).day).toBe(29);
	});

	it("returns the given date for parts other than the day", () => {
		const placeholder = new CalendarDate(2026, 11, 5);
		expect(getDateRefForPart("month", placeholder, { day: "31" } as SegmentValueObj)).toBe(
			placeholder
		);
	});
});

describe("getDaySegmentMaxValue", () => {
	it("allows any day while the month segment is still empty", () => {
		// Typing `31102026` while the placeholder is in November must not stop at `31`,
		// otherwise the remaining digits land in the wrong segments.
		expect(getDaySegmentMaxValue(undefined, new CalendarDate(2026, 11, 5))).toBe(31);
		expect(getDaySegmentMaxValue("", new CalendarDate(2026, 11, 5))).toBe(31);
	});

	it("constrains the day to the entered month", () => {
		expect(getDaySegmentMaxValue("02", new CalendarDate(2026, 11, 5))).toBe(28);
		expect(getDaySegmentMaxValue("04", new CalendarDate(2026, 11, 5))).toBe(30);
		expect(getDaySegmentMaxValue("10", new CalendarDate(2026, 11, 5))).toBe(31);
	});

	it("takes the leap year of the placeholder into account", () => {
		expect(getDaySegmentMaxValue("02", new CalendarDate(2024, 11, 5))).toBe(29);
	});
});

describe("getValueFromSegments", () => {
	it("applies the day-first (en-GB) segment order without clamping the day to the dateRef's month", () => {
		const fieldNode = createFieldNode(["day", "literal", "month", "literal", "year"]);
		const segmentObj = { day: "31", month: "08", year: "2026" } as SegmentValueObj;

		// the placeholder/dateRef sits in a 30-day month (November)
		const value = getValueFromSegments({
			segmentObj,
			fieldNode,
			dateRef: new CalendarDate(2024, 11, 1),
		});

		expect(value.toString()).toBe("2026-08-31");
	});

	it("applies the month-first (en-US) segment order", () => {
		const fieldNode = createFieldNode(["month", "literal", "day", "literal", "year"]);
		const segmentObj = { day: "31", month: "08", year: "2026" } as SegmentValueObj;

		const value = getValueFromSegments({
			segmentObj,
			fieldNode,
			dateRef: new CalendarDate(2024, 11, 1),
		});

		expect(value.toString()).toBe("2026-08-31");
	});

	it("resolves february 29th against the entered year and not the dateRef's year", () => {
		const fieldNode = createFieldNode(["day", "literal", "month", "literal", "year"]);
		const segmentObj = { day: "29", month: "02", year: "2024" } as SegmentValueObj;

		const value = getValueFromSegments({
			segmentObj,
			fieldNode,
			dateRef: new CalendarDate(2025, 2, 1),
		});

		expect(value.toString()).toBe("2024-02-29");
	});

	it("keeps the time segments when the field has a time granularity", () => {
		const fieldNode = createFieldNode([
			"day",
			"literal",
			"month",
			"literal",
			"year",
			"hour",
			"literal",
			"minute",
			"dayPeriod",
		]);
		const segmentObj = {
			day: "31",
			month: "08",
			year: "2026",
			hour: "13",
			minute: "45",
			second: null,
			dayPeriod: "PM",
		} as unknown as SegmentValueObj;

		const value = getValueFromSegments({
			segmentObj,
			fieldNode,
			dateRef: new CalendarDateTime(2024, 11, 1, 0, 0),
		});

		expect(value.toString()).toBe("2026-08-31T13:45:00");
	});

	it("ignores segments that have not been filled in yet", () => {
		const fieldNode = createFieldNode(["day", "literal", "month", "literal", "year"]);
		const segmentObj = { day: "15", month: null, year: null } as unknown as SegmentValueObj;

		const value = getValueFromSegments({
			segmentObj,
			fieldNode,
			dateRef: new CalendarDate(2024, 11, 1),
		});

		expect(value.toString()).toBe("2024-11-15");
	});
});
