import { CalendarDate, parseZonedDateTime } from "@internationalized/date";
import { describe, expect, it, vi } from "vitest";
import { getISOWeekNumber } from "./utils.js";

describe("getISOWeekNumber", () => {
	it("returns ISO week 1 for a known CalendarDate in early January", () => {
		expect(getISOWeekNumber(new CalendarDate(2024, 1, 4))).toBe(1);
	});

	it("uses the zoned calendar day at year boundaries", () => {
		const sydneyMidnight = parseZonedDateTime("2024-01-01T00:00[Australia/Sydney]");

		// Jan 1, 2024 in Australia/Sydney is ISO week 1.
		expect(getISOWeekNumber(sydneyMidnight)).toBe(1);
	});

	it("returns the same ISO week for CalendarDate in UTC+ local timezones", async () => {
		const previousTz = process.env.TZ;
		process.env.TZ = "Australia/Sydney";
		vi.resetModules();
		expect(getISOWeekNumber(new CalendarDate(2024, 1, 1))).toBe(1);
		process.env.TZ = previousTz;
	});
});
