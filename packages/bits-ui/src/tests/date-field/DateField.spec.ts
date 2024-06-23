import { render } from "@testing-library/svelte/svelte5";
import { axe } from "jest-axe";
import { describe, it } from "vitest";
import {
	CalendarDate,
	CalendarDateTime,
	type DateFields,
	type TimeFields,
	now,
	parseAbsoluteToLocal,
	toZoned,
} from "@internationalized/date";
import { getTestKbd, setupUserEvents } from "../utils.js";
import DateFieldTest, { type DateFieldTestProps } from "./DateFieldTest.svelte";

const kbd = getTestKbd();

const TIME_PLACEHOLDER = "––";

const calendarDate = new CalendarDate(1980, 1, 20);
const calendarDateTime = new CalendarDateTime(1980, 1, 20, 12, 30, 0, 0);
const zonedDateTime = toZoned(calendarDateTime, "America/New_York");

function setup(props: DateFieldTestProps = {}) {
	const user = setupUserEvents();
	const returned = render(DateFieldTest, { ...props });
	const month = returned.getByTestId("month");
	const day = returned.getByTestId("day");
	const year = returned.getByTestId("year");
	const value = returned.getByTestId("value");
	const input = returned.getByTestId("input");
	const label = returned.getByTestId("label");

	return { ...returned, user, month, day, year, value, input, label };
}

describe("date field", () => {
	it("has no axe violations", async () => {
		const { container } = setup();
		expect(await axe(container)).toHaveNoViolations();
	});

	it("populates segment with value - `CalendarDate`", async () => {
		const { month, day, year, value } = setup({
			value: calendarDate,
		});

		expect(month).toHaveTextContent(String(calendarDate.month));
		expect(day).toHaveTextContent(String(calendarDate.day));
		expect(year).toHaveTextContent(String(calendarDate.year));
		expect(value).toHaveTextContent(calendarDate.toString());
	});

	it("populates segment with value - `CalendarDateTime`", async () => {
		const { month, day, year, value, getByTestId } = setup({
			value: calendarDateTime,
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
			value: zonedDateTime,
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
			locale: "en-UK",
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
			value: calendarDateTime,
		});
		expect(queryByTestId("dayPeriod")).toBeNull();
	});

	it("does show the day period for locales that do use them", async () => {
		const { queryByTestId } = setup({
			value: calendarDateTime,
		});
		expect(queryByTestId("dayPeriod")).not.toBeNull();
	});

	it("focuses first segment on label click", async () => {
		const { user, label, month } = setup();
		await user.click(label);
		expect(month).toHaveFocus();
	});

	it("focuses segments on click", async () => {
		const { user, day, month, year, getByTestId } = setup({
			value: zonedDateTime,
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
			granularity: "second",
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
			granularity: "second",
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
			granularity: "second",
		});
		const { getHour, getMinute, getSecond, getDayPeriod, getTimeZoneName } =
			getTimeSegments(getByTestId);

		const segments = [
			month,
			day,
			year,
			getHour(),
			getMinute(),
			getSecond(),
			getDayPeriod(),
			getTimeZoneName(),
		];

		await user.click(month);

		for (const seg of segments) {
			expect(seg).toHaveFocus();
			await user.keyboard(kbd.ARROW_RIGHT);
		}
		expect(getTimeZoneName()).toHaveFocus();

		for (const seg of segments.reverse()) {
			expect(seg).toHaveFocus();
			await user.keyboard(kbd.ARROW_LEFT);
		}
		expect(month).toHaveFocus();
	});

	it("navigates the segments using tab", async () => {
		const { getByTestId, user, day, month, year } = setup({
			value: zonedDateTime,
			granularity: "second",
		});
		const { getHour, getMinute, getSecond, getDayPeriod, getTimeZoneName } =
			getTimeSegments(getByTestId);

		const segments = [month, day, year, getHour(), getMinute(), getSecond(), getDayPeriod()];

		await user.click(month);

		for (const seg of segments) {
			expect(seg).toHaveFocus();
			await user.keyboard(kbd.TAB);
		}
		expect(getTimeZoneName()).toHaveFocus();

		for (const seg of segments.reverse()) {
			await user.keyboard(kbd.SHIFT_TAB);
			expect(seg).toHaveFocus();
		}
	});

	it("prevents interaction when `disabled`", async () => {
		const { user, getByTestId, day, month, year } = setup({
			value: zonedDateTime,
			granularity: "second",
			disabled: true,
		});

		const { getHour, getMinute, getSecond, getDayPeriod, getTimeZoneName } =
			getTimeSegments(getByTestId);

		const segments = [
			month,
			day,
			year,
			getHour(),
			getMinute(),
			getSecond(),
			getDayPeriod(),
			getTimeZoneName(),
		];

		for (const seg of segments) {
			await user.click(seg);
			expect(seg).not.toHaveFocus();
		}
	});

	it("prevents modification when `readonly`", async () => {
		const { user, getByTestId, day, month, year } = setup({
			value: zonedDateTime,
			granularity: "second",
			readonly: true,
		});
		const { getHour, getMinute, getSecond } = getTimeSegments(getByTestId);
		const segments = [month, day, year, getHour(), getMinute(), getSecond()];

		for (const segment of segments) {
			await user.click(segment);
			expect(segment).toHaveFocus();
			await user.keyboard(kbd.ARROW_UP);
			expect(segment).toHaveTextContent(
				String(
					zonedDateTime[segment.dataset.segment as keyof TimeFields | keyof DateFields]
				)
			);
		}
	});

	it("correctly marks the field as invalid if the value is invalid", async () => {
		const { getByTestId, day, month, year, input, label, user } = setup({
			granularity: "second",
			isDateUnavailable: (date) => date.day === 19,
			value: zonedDateTime,
		});

		const { getHour, getMinute, getSecond, getDayPeriod, getTimeZoneName } =
			getTimeSegments(getByTestId);
		const segments = [
			month,
			day,
			year,
			getHour(),
			getMinute(),
			getSecond(),
			getDayPeriod(),
			getTimeZoneName(),
		];

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
			hourCycle: 24,
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
			granularity: "day",
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
			granularity: "minute",
		});

		const displayedSegments = [
			month,
			day,
			year,
			getByTestId("hour"),
			getByTestId("minute"),
			getByTestId("dayPeriod"),
		];

		expect(queryByTestId("second")).toBeNull();

		for (const seg of displayedSegments) {
			expect(seg).toBeVisible();
		}
	});

	it("changes the value when the dayPeriod segment is changed", async () => {
		const { getByTestId, user, value } = setup({
			value: calendarDateTime,
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
			granularity: "second",
		});

		const { getHour, getMinute, getSecond, getDayPeriod } = getTimeSegments(getByTestId);

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
		expect(getHour()).toHaveFocus();
		await user.keyboard(`{3}`);
		expect(getMinute()).toHaveFocus();
		await user.keyboard(`{3}`);
		await user.keyboard(`{3}`);
		expect(getSecond()).toHaveFocus();
		await user.keyboard(`{3}`);
		await user.keyboard(`{3}`);
		expect(getDayPeriod()).toHaveFocus();
	});

	it("fully overwrites on first click and type - `month`", async () => {
		const { user, month } = setup({
			value: zonedDateTime,
			granularity: "second",
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
			granularity: "second",
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
			granularity: "second",
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
			granularity: "second",
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
			granularity: "second",
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
			granularity: "second",
		});
		const second = getByTestId("second");

		await user.click(second);
		expect(second).toHaveFocus();
		expect(second).toHaveTextContent(String(zonedDateTime.second));
		await user.keyboard(`{1}`);
		expect(second).toHaveTextContent("1");
	});

	it("moves to the previous segment when backspace is pressed while empty - `day`", async () => {
		const { user, day, month } = setup({
			value: zonedDateTime,
			granularity: "second",
		});

		await user.click(day);
		expect(day).toHaveFocus();
		expect(day).toHaveTextContent(String(zonedDateTime.day));
		await user.keyboard(kbd.BACKSPACE);
		expect(day).toHaveTextContent("2");
		await user.keyboard(kbd.BACKSPACE);
		expect(day).toHaveTextContent("dd");
		expect(day).toHaveFocus();
		await user.keyboard(kbd.BACKSPACE);
		expect(month).toHaveFocus();
	});

	it("moves to the previous segment when backspace is pressed while empty - `year`", async () => {
		const { user, year, day } = setup({
			value: zonedDateTime,
			granularity: "second",
		});

		await user.click(year);
		expect(year).toHaveFocus();
		await user.keyboard(kbd.BACKSPACE);
		expect(year).toHaveTextContent("198");
		await user.keyboard(kbd.BACKSPACE);
		expect(year).toHaveTextContent("19");
		await user.keyboard(kbd.BACKSPACE);
		expect(year).toHaveTextContent("1");
		await user.keyboard(kbd.BACKSPACE);
		expect(year).toHaveTextContent("yyyy");
		expect(year).toHaveFocus();
		await user.keyboard(kbd.BACKSPACE);
		expect(day).toHaveFocus();
	});

	it.skip("displays correct timezone with ZonedDateTime value - `now`", async () => {
		const { getByTestId } = setup({
			value: now("America/Los_Angeles"),
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
			value: parseAbsoluteToLocal("2023-10-12T12:30:00Z"),
		});

		const timeZone = getByTestId("timeZoneName");
		expect(timeZone).toHaveTextContent(thisTimeZone("2023-10-12T12:30:00Z"));
	});

	it("should not allow changing the dayPeriod without a value", async () => {
		const { getByTestId, user } = setup({
			granularity: "second",
		});
		const { getDayPeriod, getHour } = getTimeSegments(getByTestId);

		expect(getHour()).toHaveTextContent(TIME_PLACEHOLDER);
		await user.click(getDayPeriod());
		await user.keyboard(kbd.ARROW_UP);
		expect(getHour()).toHaveTextContent(TIME_PLACEHOLDER);
	});

	it("should handle backspacing the year segment appropriately", async () => {
		const { getByTestId, user, year } = setup({
			granularity: "hour",
		});

		year.focus();

		await user.keyboard(`{0}`);
		await user.keyboard(`{0}`);
		await user.keyboard(`{9}`);
		await user.keyboard(`{8}`);

		const { getHour } = getTimeSegments(getByTestId);
		const hour = getHour();
		expect(hour).toHaveFocus();

		await user.keyboard(kbd.ARROW_LEFT);
		expect(year).toHaveFocus();

		await user.keyboard(kbd.BACKSPACE);
		expect(year).toHaveTextContent("009");
		await user.keyboard(kbd.BACKSPACE);
		expect(year).toHaveTextContent("00");
		await user.keyboard(`{8}`);
		await user.keyboard(`{7}`);
		expect(year).toHaveTextContent("0087");
		expect(hour).toHaveFocus();
	});

	it("should allow going from 12PM -> 12AM without changing the display hour to 0", async () => {
		const { getByTestId, user } = setup({
			value: new CalendarDateTime(2023, 10, 12, 12, 30, 0, 0),
		});
		const { getHour, getDayPeriod } = getTimeSegments(getByTestId);

		expect(getHour()).toHaveTextContent("12");

		await user.click(getDayPeriod());
		await user.keyboard(kbd.ARROW_UP);

		expect(getHour()).toHaveTextContent("12");
		expect(getDayPeriod()).toHaveTextContent("AM");
	});

	it("should never allow the hour to be 0 when in a 12 hour cycle", async () => {
		const { getByTestId, user } = setup({
			value: new CalendarDateTime(2023, 10, 12, 12, 30, 0, 0),
		});
		const { getHour, getDayPeriod } = getTimeSegments(getByTestId);

		expect(getHour()).toHaveTextContent("12");

		await user.click(getDayPeriod());
		await user.keyboard(kbd.ARROW_UP);

		expect(getHour()).toHaveTextContent("12");
		expect(getDayPeriod()).toHaveTextContent("AM");

		await user.click(getHour());
		await user.keyboard(kbd.ARROW_UP);
		expect(getHour()).toHaveTextContent("1");
		expect(getHour()).not.toHaveTextContent("12");
		expect(getDayPeriod()).toHaveTextContent("PM");
		await user.click(getDayPeriod());
		await user.keyboard(kbd.ARROW_UP);
		expect(getHour()).toHaveTextContent("1");
		expect(getDayPeriod()).toHaveTextContent("AM");
		await user.click(getHour());
		await user.keyboard(kbd.ARROW_DOWN);
		expect(getHour()).toHaveTextContent("12");
		expect(getDayPeriod()).toHaveTextContent("AM");
	});

	it("should add missing leading zeroes to the day,month, and year segments on focusout", async () => {
		const { user, month, day, year } = setup({
			value: new CalendarDate(2023, 10, 12),
		});

		await user.click(month);
		await user.keyboard(`{1}`);
		await user.keyboard(kbd.ARROW_RIGHT);
		expect(day).toHaveFocus();
		expect(month).toHaveTextContent("01");

		await user.keyboard(`{1}`);
		await user.keyboard(kbd.ARROW_RIGHT);
		expect(year).toHaveFocus();
		expect(day).toHaveTextContent("01");
		await user.keyboard(kbd.BACKSPACE);
		expect(year).toHaveTextContent("202");
		await user.keyboard(kbd.ARROW_LEFT);
		expect(day).toHaveFocus();
		expect(year).toHaveTextContent("0202");
	});

	it.todo(
		"if a user enters something like `15` into the hour segment and a 12 hour cycle is being used, the value should not be changed to `3` and should instead be `5`"
	);
});

// eslint-disable-next-line ts/no-explicit-any
function getTimeSegments(getByTestId: (...args: any[]) => HTMLElement) {
	return {
		getHour: () => getByTestId("hour"),
		getMinute: () => getByTestId("minute"),
		getSecond: () => getByTestId("second"),
		getDayPeriod: () => getByTestId("dayPeriod"),
		getTimeZoneName: () => getByTestId("timeZoneName"),
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
