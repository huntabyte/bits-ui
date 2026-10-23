import { describe, expect, it } from "vitest";
import { CalendarDate, CalendarDateTime } from "@internationalized/date";
import { getValueFromSegments } from "./helpers.js";
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
