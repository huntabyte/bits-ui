import { render } from "@testing-library/svelte";
import userEvent from "@testing-library/user-event";
import { axe } from "jest-axe";
import { describe, it } from "vitest";
import { testKbd as kbd } from "../utils.js";
import DateFieldTest from "./DateFieldTest.svelte";
import type { DateField } from "$lib";
import {
	CalendarDate,
	CalendarDateTime,
	toZoned,
	type TimeFields,
	type DateFields,
	now,
	parseAbsoluteToLocal
} from "@internationalized/date";

const calendarDate = new CalendarDate(1980, 1, 20);
const calendarDateTime = new CalendarDateTime(1980, 1, 20, 12, 30, 0, 0);
const zonedDateTime = toZoned(calendarDateTime, "America/New_York");

function setup(props: DateField.Props = {}) {
	const user = userEvent.setup();
	const returned = render(DateFieldTest, { ...props });
	const month = returned.getByTestId("month");
	const day = returned.getByTestId("day");
	const year = returned.getByTestId("year");
	const value = returned.getByTestId("value");
	const input = returned.getByTestId("input");
	const label = returned.getByTestId("label");

	return { ...returned, user, month, day, year, value, input, label };
}

describe("Date Field", () => {
	it("has no axe violations", async () => {
		const { container } = setup();
		expect(await axe(container)).toHaveNoViolations();
	});

	it("populates segment with value - `CalendarDate`", async () => {
		const { month, day, year, value } = setup({
			value: calendarDate
		});

		expect(month).toHaveTextContent(String(calendarDate.month));
		expect(day).toHaveTextContent(String(calendarDate.day));
		expect(year).toHaveTextContent(String(calendarDate.year));
		expect(value).toHaveTextContent(calendarDate.toString());
	});

	it("populates segment with value - `CalendarDateTime`", async () => {
		const { month, day, year, value, getByTestId } = setup({
			value: calendarDateTime
		});

		expect(month).toHaveTextContent(String(calendarDateTime.month));
		expect(day).toHaveTextContent(String(calendarDateTime.day));
		expect(year).toHaveTextContent(String(calendarDateTime.year));
		expect(getByTestId("hour")).toHaveTextContent(String(calendarDateTime.hour));
		expect(getByTestId("minute")).toHaveTextContent(String(calendarDateTime.minute));
		expect(value).toHaveTextContent(calendarDate.toString());
	});

	it("populates segment with value - `ZonedDateTime`", async () => {
		const { month, day, year, value, getByTestId } = setup({
			value: zonedDateTime
		});

		expect(month).toHaveTextContent(String(zonedDateTime.month));
		expect(day).toHaveTextContent(String(zonedDateTime.day));
		expect(year).toHaveTextContent(String(zonedDateTime.year));
		expect(getByTestId("hour")).toHaveTextContent(String(zonedDateTime.hour));
		expect(getByTestId("minute")).toHaveTextContent(String(zonedDateTime.minute));
		expect(getByTestId("dayPeriod")).toHaveTextContent("PM");
		expect(getByTestId("timeZoneName")).toHaveTextContent("EST");
		expect(value).toHaveTextContent(calendarDate.toString());
	});

	it("changes segment positioning based on `locale`", async () => {
		const { input } = setup({
			locale: "en-UK"
		});

		const firstSeg = input.children[0];
		// skipping the literal slashes here
		const secondSeg = input.children[2];
		const thirdSeg = input.children[4];

		expect(firstSeg).toHaveTextContent("dd");
		expect(secondSeg).toHaveTextContent("mm");
		expect(thirdSeg).toHaveTextContent("yyyy");
	});

	it("doesnt show the day period for locales that don't use them", async () => {
		const { queryByTestId } = setup({
			locale: "en-UK",
			value: calendarDateTime
		});
		expect(queryByTestId("dayPeriod")).toBeNull();
	});

	it("does show the day period for locales that do use them", async () => {
		const { queryByTestId } = setup({
			value: calendarDateTime
		});
		expect(queryByTestId("dayPeriod")).not.toBeNull();
	});

	it("focuses first segment on label click", async () => {
		const { user, label, input } = setup();
		await user.click(label);
		expect(input.firstChild).toHaveFocus();
	});

	it("focuses segments on click", async () => {
		const { user, day, month, year, getByTestId } = setup({
			value: zonedDateTime
		});

		const hour = getByTestId("hour");
		const minute = getByTestId("minute");
		const dayPeriod = getByTestId("dayPeriod");
		const timeZoneName = getByTestId("timeZoneName");
		const segments = [day, month, year, hour, minute, dayPeriod, timeZoneName];

		for (const segment of segments) {
			await user.click(segment);
			expect(segment).toHaveFocus();
		}
	});

	it("incremenets segment on arrow up", async () => {
		const { user, day, month, year, getByTestId } = setup({
			value: zonedDateTime,
			granularity: "second"
		});

		const hour = getByTestId("hour");
		const minute = getByTestId("minute");
		const second = getByTestId("second");

		function cycle(segment: keyof TimeFields | keyof DateFields) {
			return String(zonedDateTime.cycle(segment, 1)[segment]);
		}

		await user.click(day);
		await user.keyboard(kbd.ARROW_UP);
		expect(day).toHaveTextContent(cycle("day"));
		await user.click(month);
		await user.keyboard(kbd.ARROW_UP);
		expect(month).toHaveTextContent(cycle("month"));
		await user.click(year);
		await user.keyboard(kbd.ARROW_UP);
		expect(year).toHaveTextContent(cycle("year"));
		await user.click(hour);
		await user.keyboard(kbd.ARROW_UP);
		expect(hour).toHaveTextContent("1");
		await user.click(minute);
		await user.keyboard(kbd.ARROW_UP);
		expect(minute).toHaveTextContent(cycle("minute"));
		await user.click(second);
		await user.keyboard(kbd.ARROW_UP);
		expect(second).toHaveTextContent(cycle("second"));
	});

	it("decrements segment on arrow down", async () => {
		const { user, day, month, year, getByTestId } = setup({
			value: zonedDateTime,
			granularity: "second"
		});

		const hour = getByTestId("hour");
		const minute = getByTestId("minute");
		const second = getByTestId("second");

		function cycle(segment: keyof TimeFields | keyof DateFields) {
			return String(zonedDateTime.cycle(segment, -1)[segment]);
		}

		await user.click(day);
		await user.keyboard(kbd.ARROW_DOWN);
		expect(day).toHaveTextContent(cycle("day"));
		await user.click(month);
		await user.keyboard(kbd.ARROW_DOWN);
		expect(month).toHaveTextContent(cycle("month"));
		await user.click(year);
		await user.keyboard(kbd.ARROW_DOWN);
		expect(year).toHaveTextContent(cycle("year"));
		await user.click(hour);
		await user.keyboard(kbd.ARROW_DOWN);
		expect(hour).toHaveTextContent(cycle("hour"));
		await user.click(minute);
		await user.keyboard(kbd.ARROW_DOWN);
		expect(minute).toHaveTextContent(cycle("minute"));
		await user.click(second);
		await user.keyboard(kbd.ARROW_DOWN);
		expect(second).toHaveTextContent(cycle("second"));
	});

	it("navigates segments using the arrow keys", async () => {
		const { getByTestId, user, day, month, year } = setup({
			value: zonedDateTime,
			granularity: "second"
		});
		const { hour, minute, second, dayPeriod, timeZoneName } = getTimeSegments(getByTestId);

		const segments = [month, day, year, hour, minute, second, dayPeriod, timeZoneName];

		await user.click(month);

		for (const seg of segments) {
			expect(seg).toHaveFocus();
			await user.keyboard(kbd.ARROW_RIGHT);
		}
		expect(timeZoneName).toHaveFocus();

		for (const seg of segments.reverse()) {
			expect(seg).toHaveFocus();
			await user.keyboard(kbd.ARROW_LEFT);
		}
		expect(month).toHaveFocus();
	});

	it("navigates the segments using tab", async () => {
		const { getByTestId, user, day, month, year } = setup({
			value: zonedDateTime,
			granularity: "second"
		});
		const { hour, minute, second, dayPeriod, timeZoneName } = getTimeSegments(getByTestId);

		const segments = [month, day, year, hour, minute, second, dayPeriod];

		await user.click(month);

		for (const seg of segments) {
			expect(seg).toHaveFocus();
			await user.keyboard(kbd.TAB);
		}
		expect(timeZoneName).toHaveFocus();

		for (const seg of segments.reverse()) {
			await user.keyboard(kbd.SHIFT_TAB);
			expect(seg).toHaveFocus();
		}
	});

	it("prevents interaction when `disabled`", async () => {
		const { user, getByTestId, day, month, year } = setup({
			value: zonedDateTime,
			granularity: "second",
			disabled: true
		});

		const { hour, minute, second, dayPeriod, timeZoneName } = getTimeSegments(getByTestId);

		const segments = [month, day, year, hour, minute, second, dayPeriod, timeZoneName];

		for (const seg of segments) {
			await user.click(seg);
			expect(seg).not.toHaveFocus();
		}
	});

	it("prevents modification when `readonly`", async () => {
		const { user, getByTestId, day, month, year } = setup({
			value: zonedDateTime,
			granularity: "second",
			readonly: true
		});
		const { hour, minute, second } = getTimeSegments(getByTestId);
		const segments = [month, day, year, hour, minute, second];

		for (const segment of segments) {
			await user.click(segment);
			expect(segment).toHaveFocus();
			await user.keyboard(kbd.ARROW_UP);
			expect(segment).toHaveTextContent(
				String(zonedDateTime[segment.dataset.segment as keyof TimeFields | keyof DateFields])
			);
		}
	});

	it("correctly marks the field as invalid if the value is invalid", async () => {
		const { getByTestId, day, month, year, input, label, user } = setup({
			granularity: "second",
			isDateUnavailable: (date) => date.day === 19,
			value: zonedDateTime
		});

		const { hour, minute, second, dayPeriod, timeZoneName } = getTimeSegments(getByTestId);
		const segments = [month, day, year, hour, minute, second, dayPeriod, timeZoneName];

		await user.click(month);
		await user.keyboard(`{2}`);
		expect(month).toHaveTextContent("2");
		expect(day).toHaveFocus();
		await user.keyboard(`{19}`);
		expect(day).toHaveTextContent("19");
		expect(year).toHaveFocus();
		await user.keyboard(`{1111}`);
		expect(year).toHaveTextContent("1111");

		for (const seg of segments) {
			expect(seg).toHaveAttribute("aria-invalid", "true");
			expect(seg).toHaveAttribute("data-invalid");
		}

		expect(input).toHaveAttribute("data-invalid");
		expect(label).toHaveAttribute("data-invalid");
	});

	it("adjusts the hour cycle with the `hourCycle` prop", async () => {
		const { getByTestId, queryByTestId, user } = setup({
			value: zonedDateTime,
			hourCycle: 24
		});

		expect(queryByTestId("dayPeriod")).toBeNull();
		const hour = getByTestId("hour");
		expect(hour).toHaveTextContent("12");
		await user.click(hour);
		expect(hour).toHaveFocus();
		await user.keyboard(kbd.ARROW_UP);
		expect(hour).toHaveTextContent("13");
	});

	it("overrides the default displayed segments with the `granularity` prop - `'day'`", async () => {
		const { queryByTestId, month, day, year } = setup({
			value: calendarDateTime,
			granularity: "day"
		});

		const nonDisplayedSegments = ["hour", "minute", "second", "dayPeriod"];
		const displayedSegments = [month, day, year];
		for (const seg of nonDisplayedSegments) {
			expect(queryByTestId(seg)).toBeNull();
		}

		for (const seg of displayedSegments) {
			expect(seg).toBeVisible();
		}
	});
	it("overrides the default displayed segments with the `granularity` prop - `'minute'`", async () => {
		const { queryByTestId, getByTestId, month, day, year } = setup({
			value: calendarDateTime,
			granularity: "minute"
		});

		const displayedSegments = [
			month,
			day,
			year,
			getByTestId("hour"),
			getByTestId("minute"),
			getByTestId("dayPeriod")
		];

		expect(queryByTestId("second")).toBeNull();

		for (const seg of displayedSegments) {
			expect(seg).toBeVisible();
		}
	});

	it("changes the value when the dayPeriod segment is changed", async () => {
		const { getByTestId, user, value } = setup({
			value: calendarDateTime
		});

		expect(value).toHaveTextContent("1980-01-20T12:30");
		const dayPeriod = getByTestId("dayPeriod");
		expect(dayPeriod).toHaveTextContent("PM");

		await user.click(dayPeriod);
		expect(dayPeriod).toHaveFocus();
		await user.keyboard(kbd.ARROW_UP);
		expect(dayPeriod).toHaveTextContent("AM");
		expect(value).toHaveTextContent("1980-01-20T00:30");
	});

	it("takes you all the way through the segment with spamming 3", async () => {
		const { getByTestId, user, month, day, year } = setup({
			value: zonedDateTime,
			granularity: "second"
		});

		const { hour, minute, second, dayPeriod } = getTimeSegments(getByTestId);

		await user.click(month);
		await user.keyboard(`{3}`);
		expect(day).toHaveFocus();
		await user.keyboard(`{3}`);
		await user.keyboard(`{3}`);
		expect(year).toHaveFocus();
		await user.keyboard(`{3}`);
		await user.keyboard(`{3}`);
		await user.keyboard(`{3}`);
		await user.keyboard(`{3}`);
		expect(hour).toHaveFocus();
		await user.keyboard(`{3}`);
		expect(minute).toHaveFocus();
		await user.keyboard(`{3}`);
		await user.keyboard(`{3}`);
		expect(second).toHaveFocus();
		await user.keyboard(`{3}`);
		await user.keyboard(`{3}`);
		expect(dayPeriod).toHaveFocus();
	});

	it("fully overwrites on first click and type - `month`", async () => {
		const { user, month } = setup({
			value: zonedDateTime,
			granularity: "second"
		});

		await user.click(month);
		expect(month).toHaveFocus();
		expect(month).toHaveTextContent(String(zonedDateTime.month));
		await user.keyboard(`{3}`);
		expect(month).toHaveTextContent("3");
	});

	it("fully overwrites on first click and type - `day`", async () => {
		const { user, day } = setup({
			value: zonedDateTime,
			granularity: "second"
		});

		await user.click(day);
		expect(day).toHaveFocus();
		expect(day).toHaveTextContent(String(zonedDateTime.day));
		await user.keyboard(`{1}`);
		expect(day).toHaveTextContent("1");
	});

	it("fully overwrites on first click and type - `year`", async () => {
		const { user, year } = setup({
			value: zonedDateTime,
			granularity: "second"
		});

		await user.click(year);
		expect(year).toHaveFocus();
		expect(year).toHaveTextContent(String(zonedDateTime.year));
		await user.keyboard(`{1}`);
		expect(year).toHaveTextContent("1");
	});

	it("fully overwrites on first click and type - `hour`", async () => {
		const { user, getByTestId } = setup({
			value: zonedDateTime,
			granularity: "second"
		});
		const hour = getByTestId("hour");

		await user.click(hour);
		expect(hour).toHaveFocus();
		expect(hour).toHaveTextContent(String(zonedDateTime.hour));
		await user.keyboard(`{1}`);
		expect(hour).toHaveTextContent("1");
	});

	it("fully overwrites on first click and type - `minute`", async () => {
		const { user, getByTestId } = setup({
			value: zonedDateTime,
			granularity: "second"
		});
		const minute = getByTestId("minute");

		await user.click(minute);
		expect(minute).toHaveFocus();
		expect(minute).toHaveTextContent(String(zonedDateTime.minute));
		await user.keyboard(`{1}`);
		expect(minute).toHaveTextContent("1");
	});

	it("fully overwrites on first click and type - `second`", async () => {
		const { user, getByTestId } = setup({
			value: zonedDateTime,
			granularity: "second"
		});
		const second = getByTestId("second");

		await user.click(second);
		expect(second).toHaveFocus();
		expect(second).toHaveTextContent(String(zonedDateTime.second));
		await user.keyboard(`{1}`);
		expect(second).toHaveTextContent("1");
	});

	it("displays correct timezone with ZonedDateTime value - `now`", async () => {
		const { getByTestId } = setup({
			value: now("America/Los_Angeles")
		});

		const timeZone = getByTestId("timeZoneName");
		if (isDaylightSavingsTime()) {
			expect(timeZone).toHaveTextContent("PDT");
		} else {
			expect(timeZone).toHaveTextContent("PST");
		}
	});

	it("displays correct timezone with ZonedDateTime value - absolute -> local", async () => {
		const { getByTestId } = setup({
			value: parseAbsoluteToLocal("2023-10-12T12:30:00Z")
		});

		const timeZone = getByTestId("timeZoneName");
		expect(timeZone).toHaveTextContent(thisTimeZone("2023-10-12T12:30:00Z"));
	});
});

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function getTimeSegments(getByTestId: (...args: any[]) => HTMLElement) {
	return {
		hour: getByTestId("hour"),
		minute: getByTestId("minute"),
		second: getByTestId("second"),
		dayPeriod: getByTestId("dayPeriod"),
		timeZoneName: getByTestId("timeZoneName")
	};
}

function isDaylightSavingsTime(): boolean {
	const now = new Date();
	const january = new Date(now.getFullYear(), 0, 1);
	const july = new Date(now.getFullYear(), 6, 1);
	const timezoneOffset = now.getTimezoneOffset();
	const isDaylightSavingsTime =
		timezoneOffset < Math.max(january.getTimezoneOffset(), july.getTimezoneOffset());
	return isDaylightSavingsTime;
}

function thisTimeZone(date: string): string {
	const timezone =
		Intl.DateTimeFormat(undefined, { timeZoneName: "short" })
			.formatToParts(new Date(date))
			.find((p) => p.type === "timeZoneName")?.value ?? "";
	return timezone;
}
