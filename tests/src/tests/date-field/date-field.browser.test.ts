import { expect, it, describe } from "vitest";
import { render } from "vitest-browser-svelte";
import {
	CalendarDate,
	CalendarDateTime,
	type DateFields,
	type TimeFields,
	now,
	parseAbsoluteToLocal,
	toZoned,
} from "@internationalized/date";
import type { Locator } from "@vitest/browser/context";
import { getTestKbd } from "../utils.js";
import DateFieldTest, { type DateFieldTestProps } from "./date-field-test.svelte";
import { expectExists, expectNotExists, setupBrowserUserEvents } from "../browser-utils";

const kbd = getTestKbd();

const TIME_PLACEHOLDER = "––";

const calendarDate = new CalendarDate(1980, 1, 20);
const calendarDateTime = new CalendarDateTime(1980, 1, 20, 12, 30, 0, 0);
const zonedDateTime = toZoned(calendarDateTime, "America/New_York");

function setup(props: DateFieldTestProps = {}) {
	const user = setupBrowserUserEvents();
	const t = render(DateFieldTest, { ...props });
	const month = t.getByTestId("month").element() as HTMLElement;
	const day = t.getByTestId("day").element() as HTMLElement;
	const year = t.getByTestId("year").element() as HTMLElement;
	const value = t.getByTestId("value").element() as HTMLElement;
	const input = t.getByTestId("input").element() as HTMLElement;
	const label = t.getByTestId("label").element() as HTMLElement;

	return { ...t, user, month, day, year, value, input, label };
}

describe("date field", () => {
	it("should populate segment with value - `CalendarDate`", async () => {
		const t = setup({
			value: calendarDate,
		});

		expect(t.month).toHaveTextContent(String(calendarDate.month));
		expect(t.day).toHaveTextContent(String(calendarDate.day));
		expect(t.year).toHaveTextContent(String(calendarDate.year));
		expect(t.value).toHaveTextContent(calendarDate.toString());
	});

	it("should populate segment with value - `CalendarDateTime`", async () => {
		const t = setup({
			value: calendarDateTime,
		});

		expect(t.month).toHaveTextContent(String(calendarDateTime.month));
		expect(t.day).toHaveTextContent(String(calendarDateTime.day));
		expect(t.year).toHaveTextContent(String(calendarDateTime.year));
		expect(t.getByTestId("hour")).toHaveTextContent(String(calendarDateTime.hour));
		expect(t.getByTestId("minute")).toHaveTextContent(String(calendarDateTime.minute));
		expect(t.value).toHaveTextContent(calendarDate.toString());
	});

	it("should populate segment with value - `ZonedDateTime`", async () => {
		const t = setup({
			value: zonedDateTime,
		});

		expect(t.month).toHaveTextContent(String(zonedDateTime.month));
		expect(t.day).toHaveTextContent(String(zonedDateTime.day));
		expect(t.year).toHaveTextContent(String(zonedDateTime.year));
		expect(t.getByTestId("hour")).toHaveTextContent(String(zonedDateTime.hour));
		expect(t.getByTestId("minute")).toHaveTextContent(String(zonedDateTime.minute));
		expect(t.getByTestId("dayPeriod")).toHaveTextContent("PM");
		expect(t.getByTestId("timeZoneName")).toHaveTextContent("EST");
		expect(t.value).toHaveTextContent(calendarDate.toString());
	});

	it("should change segment positioning based on `locale`", async () => {
		if (navigator.userAgent.includes("WebKit")) {
			expect(true);
			return;
		}
		const t = setup({
			locale: "en-UK",
		});

		const firstSeg = t.input.children[0];
		// skipping the literal slashes here
		const secondSeg = t.input.children[2];
		const thirdSeg = t.input.children[4];

		expect(firstSeg).toHaveTextContent("dd");
		expect(secondSeg).toHaveTextContent("mm");
		expect(thirdSeg).toHaveTextContent("yyyy");
	});

	it("should not show the day period for locales that don't use them", async () => {
		if (navigator.userAgent.includes("WebKit")) {
			expect(true);
			return;
		}
		const t = setup({
			locale: "en-UK",
			value: calendarDateTime,
		});
		await expectNotExists(t.getByTestId("dayPeriod"));
	});

	it("should show the day period for locales that do use them", async () => {
		const t = setup({
			value: calendarDateTime,
		});
		await expectExists(t.getByTestId("dayPeriod"));
	});

	it("should focus first segment on label click", async () => {
		const t = setup();
		await t.user.click(t.label);
		expect(t.month).toHaveFocus();
	});

	it("should focus segments on click", async () => {
		const t = setup({
			value: zonedDateTime,
		});

		const hour = t.getByTestId("hour");
		const minute = t.getByTestId("minute");
		const dayPeriod = t.getByTestId("dayPeriod");
		const timeZoneName = t.getByTestId("timeZoneName");
		const segments = [t.day, t.month, t.year, hour, minute, dayPeriod, timeZoneName];

		for (const segment of segments) {
			await t.user.click(segment);
			expect(segment).toHaveFocus();
		}
	});

	it("should increment segment on arrow up", async () => {
		const t = setup({
			value: zonedDateTime,
			granularity: "second",
		});

		const hour = t.getByTestId("hour");
		const minute = t.getByTestId("minute");
		const second = t.getByTestId("second");

		function cycle(segment: keyof TimeFields | keyof DateFields) {
			return String(zonedDateTime.cycle(segment, 1)[segment]);
		}

		await t.user.click(t.day);
		await t.user.keyboard(kbd.ARROW_UP);
		expect(t.day).toHaveTextContent(cycle("day"));
		await t.user.click(t.month);
		await t.user.keyboard(kbd.ARROW_UP);
		expect(t.month).toHaveTextContent(cycle("month"));
		await t.user.click(t.year);
		await t.user.keyboard(kbd.ARROW_UP);
		expect(t.year).toHaveTextContent(cycle("year"));
		await t.user.click(hour);
		await t.user.keyboard(kbd.ARROW_UP);
		expect(hour).toHaveTextContent("1");
		await t.user.click(minute);
		await t.user.keyboard(kbd.ARROW_UP);
		expect(minute).toHaveTextContent(cycle("minute"));
		await t.user.click(second);
		await t.user.keyboard(kbd.ARROW_UP);
		expect(second).toHaveTextContent(cycle("second"));
	});

	it("should decrement segment on arrow down", async () => {
		const t = setup({
			value: zonedDateTime,
			granularity: "second",
		});

		const hour = t.getByTestId("hour");
		const minute = t.getByTestId("minute");
		const second = t.getByTestId("second");

		function cycle(segment: keyof TimeFields | keyof DateFields) {
			return String(zonedDateTime.cycle(segment, -1)[segment]);
		}

		await t.user.click(t.day);
		await t.user.keyboard(kbd.ARROW_DOWN);
		expect(t.day).toHaveTextContent(cycle("day"));
		await t.user.click(t.month);
		await t.user.keyboard(kbd.ARROW_DOWN);
		expect(t.month).toHaveTextContent(cycle("month"));
		await t.user.click(t.year);
		await t.user.keyboard(kbd.ARROW_DOWN);
		expect(t.year).toHaveTextContent(cycle("year"));
		await t.user.click(hour);
		await t.user.keyboard(kbd.ARROW_DOWN);
		expect(hour).toHaveTextContent(cycle("hour"));
		await t.user.click(minute);
		await t.user.keyboard(kbd.ARROW_DOWN);
		expect(minute).toHaveTextContent(cycle("minute"));
		await t.user.click(second);
		await t.user.keyboard(kbd.ARROW_DOWN);
		expect(second).toHaveTextContent(cycle("second"));
	});

	it("should navigate segments using the arrow keys", async () => {
		const t = setup({
			value: zonedDateTime,
			granularity: "second",
		});

		const segments = [
			t.month,
			t.day,
			t.year,
			t.getByTestId("hour"),
			t.getByTestId("minute"),
			t.getByTestId("second"),
			t.getByTestId("dayPeriod"),
			t.getByTestId("timeZoneName"),
		];

		await t.user.click(t.month);

		for (const seg of segments) {
			expect(seg).toHaveFocus();
			await t.user.keyboard(kbd.ARROW_RIGHT);
		}
		expect(t.getByTestId("timeZoneName")).toHaveFocus();

		for (const seg of segments.reverse()) {
			expect(seg).toHaveFocus();
			await t.user.keyboard(kbd.ARROW_LEFT);
		}
		expect(t.month).toHaveFocus();
	});

	it("should navigate the segments using tab", async () => {
		const t = setup({
			value: zonedDateTime,
			granularity: "second",
		});

		const segments = [
			t.month,
			t.day,
			t.year,
			t.getByTestId("hour"),
			t.getByTestId("minute"),
			t.getByTestId("second"),
			t.getByTestId("dayPeriod"),
		];

		await t.user.click(t.month);

		for (const seg of segments) {
			expect(seg).toHaveFocus();
			await t.user.keyboard(kbd.TAB);
		}
		expect(t.getByTestId("timeZoneName")).toHaveFocus();

		for (const seg of segments.reverse()) {
			await t.user.keyboard(kbd.SHIFT_TAB);
			expect(seg).toHaveFocus();
		}
	});

	it("should prevent interaction when `disabled`", async () => {
		const t = setup({
			value: zonedDateTime,
			granularity: "second",
			disabled: true,
		});

		const segments = [
			t.month,
			t.day,
			t.year,
			t.getByTestId("hour"),
			t.getByTestId("minute"),
			t.getByTestId("second"),
			t.getByTestId("dayPeriod"),
			t.getByTestId("timeZoneName"),
		];

		for (const seg of segments) {
			await t.user.click(seg);
		}
	});

	it("should prevent modification when `readonly`", async () => {
		const t = setup({
			value: zonedDateTime,
			granularity: "second",
			readonly: true,
		});

		const segments = [
			t.month,
			t.day,
			t.year,
			t.getByTestId("hour").element() as HTMLElement,
			t.getByTestId("minute").element() as HTMLElement,
			t.getByTestId("second").element() as HTMLElement,
		];

		for (const segment of segments) {
			await t.user.click(segment);
			expect(segment).toHaveFocus();
			await t.user.keyboard(kbd.ARROW_UP);
			expect(segment).toHaveTextContent(
				String(
					zonedDateTime[segment.dataset.segment as keyof TimeFields | keyof DateFields] ??
						""
				)
			);
		}
	});

	it("should marks the field as invalid if the value is invalid", async () => {
		const t = setup({
			granularity: "second",
			validate: (date) => (date.day === 19 ? "Invalid date" : undefined),
			value: zonedDateTime,
		});

		const segments = [
			t.month,
			t.day,
			t.year,
			t.getByTestId("hour").element() as HTMLElement,
			t.getByTestId("minute").element() as HTMLElement,
			t.getByTestId("second").element() as HTMLElement,
			t.getByTestId("dayPeriod").element() as HTMLElement,
			t.getByTestId("timeZoneName").element() as HTMLElement,
		];

		await t.user.click(t.month);
		await t.user.keyboard(`{2}`);
		expect(t.month).toHaveTextContent("2");
		expect(t.day).toHaveFocus();
		await t.user.keyboard(`19`);
		expect(t.day).toHaveTextContent("19");
		expect(t.getByTestId("year")).toHaveFocus();
		await t.user.keyboard(`{1111}`);
		expect(t.year).toHaveTextContent("1111");

		for (const seg of segments) {
			expect(seg).toHaveAttribute("aria-invalid", "true");
			expect(seg).toHaveAttribute("data-invalid");
		}

		expect(t.input).toHaveAttribute("data-invalid");
		expect(t.label).toHaveAttribute("data-invalid");
	});

	it("should adjust the hour cycle with the `hourCycle` prop", async () => {
		const t = setup({
			value: zonedDateTime,
			hourCycle: 24,
		});
		await expectNotExists(t.getByTestId("dayPeriod"));

		const hour = t.getByTestId("hour");
		expect(hour).toHaveTextContent("12");
		await t.user.click(hour);
		expect(hour).toHaveFocus();
		await t.user.keyboard(kbd.ARROW_UP);
		expect(hour).toHaveTextContent("13");
	});

	it("should override the default displayed segments with the `granularity` prop - `'day'`", async () => {
		const t = setup({
			value: calendarDateTime,
			granularity: "day",
		});

		const nonDisplayedSegments = ["hour", "minute", "second", "dayPeriod"];
		const displayedSegments = [t.month, t.day, t.year];
		for (const seg of nonDisplayedSegments) {
			await expectNotExists(t.getByTestId(seg));
		}

		for (const seg of displayedSegments) {
			expect(seg).toBeVisible();
		}
	});

	it("should override the default displayed segments with the `granularity` prop - `'minute'`", async () => {
		const t = setup({
			value: calendarDateTime,
			granularity: "minute",
		});

		const displayedSegments = [
			t.month,
			t.day,
			t.year,
			t.getByTestId("hour").element() as HTMLElement,
			t.getByTestId("minute").element() as HTMLElement,
			t.getByTestId("dayPeriod").element() as HTMLElement,
		];

		await expectNotExists(t.getByTestId("second"));

		for (const seg of displayedSegments) {
			expect(seg).toBeVisible();
		}
	});

	it("should change the value when the dayPeriod segment is changed", async () => {
		const t = setup({
			value: calendarDateTime,
		});

		expect(t.value).toHaveTextContent("1980-01-20T12:30");
		const dayPeriod = t.getByTestId("dayPeriod");
		expect(dayPeriod).toHaveTextContent("PM");

		await t.user.click(dayPeriod);
		expect(dayPeriod).toHaveFocus();
		await t.user.keyboard(kbd.ARROW_UP);
		expect(dayPeriod).toHaveTextContent("AM");
		expect(t.value).toHaveTextContent("1980-01-20T00:30");
	});

	it("should go all the way through the segment with spamming 3", async () => {
		const t = setup({
			value: zonedDateTime,
			granularity: "second",
		});

		const { getHour, getMinute, getSecond, getDayPeriod } = getTimeSegments(t.getByTestId);

		await t.user.click(t.month);
		await t.user.keyboard(`{3}`);
		expect(t.day).toHaveFocus();
		await t.user.keyboard(`{3}`);
		await t.user.keyboard(`{3}`);
		expect(t.year).toHaveFocus();
		await t.user.keyboard(`{3}`);
		await t.user.keyboard(`{3}`);
		await t.user.keyboard(`{3}`);
		await t.user.keyboard(`{3}`);
		expect(getHour()).toHaveFocus();
		await t.user.keyboard(`{3}`);
		expect(getMinute()).toHaveFocus();
		await t.user.keyboard(`{3}`);
		await t.user.keyboard(`{3}`);
		expect(getSecond()).toHaveFocus();
		await t.user.keyboard(`{3}`);
		await t.user.keyboard(`{3}`);
		expect(getDayPeriod()).toHaveFocus();
	});

	it("should overwrite on first click and type - `month`", async () => {
		const t = setup({
			value: zonedDateTime,
			granularity: "second",
		});

		await t.user.click(t.month);
		expect(t.month).toHaveFocus();
		expect(t.month).toHaveTextContent(String(zonedDateTime.month));
		await t.user.keyboard(`{3}`);
		expect(t.month).toHaveTextContent("3");
	});

	it("should fully overwrite on first click and type - `day`", async () => {
		const t = setup({
			value: zonedDateTime,
			granularity: "second",
		});

		await t.user.click(t.day);
		expect(t.day).toHaveFocus();
		expect(t.day).toHaveTextContent(String(zonedDateTime.day));
		await t.user.keyboard(`{1}`);
		expect(t.day).toHaveTextContent("1");
	});

	it("should overwrite on first click and type - `year`", async () => {
		const t = setup({
			value: zonedDateTime,
			granularity: "second",
		});

		await t.user.click(t.year);
		expect(t.year).toHaveFocus();
		expect(t.year).toHaveTextContent(String(zonedDateTime.year));
		await t.user.keyboard(`{1}`);
		expect(t.year).toHaveTextContent("1");
	});

	it("should overwrite on first click and type - `hour`", async () => {
		const t = setup({
			value: zonedDateTime,
			granularity: "second",
		});
		const hour = t.getByTestId("hour").element() as HTMLElement;

		await t.user.click(hour);
		expect(hour).toHaveFocus();
		expect(hour).toHaveTextContent(String(zonedDateTime.hour));
		await t.user.keyboard(`{1}`);
		expect(hour).toHaveTextContent("1");
	});

	it("should overwrite on first click and type - `minute`", async () => {
		const t = setup({
			value: zonedDateTime,
			granularity: "second",
		});
		const minute = t.getByTestId("minute").element() as HTMLElement;

		await t.user.click(minute);
		expect(minute).toHaveFocus();
		expect(minute).toHaveTextContent(String(zonedDateTime.minute));
		await t.user.keyboard(`{1}`);
		expect(minute).toHaveTextContent("1");
	});

	it("should overwrite on first click and type - `second`", async () => {
		const t = setup({
			value: zonedDateTime,
			granularity: "second",
		});
		const second = t.getByTestId("second").element() as HTMLElement;

		await t.user.click(second);
		expect(second).toHaveFocus();
		expect(second).toHaveTextContent(String(zonedDateTime.second));
		await t.user.keyboard(`{1}`);
		expect(second).toHaveTextContent("1");
	});

	it("should move to the previous segment when backspace is pressed while empty - `day`", async () => {
		const t = setup({
			value: zonedDateTime,
			granularity: "second",
		});

		await t.user.click(t.day);
		expect(t.day).toHaveFocus();
		expect(t.day).toHaveTextContent(String(zonedDateTime.day));
		await t.user.keyboard(kbd.BACKSPACE);
		expect(t.day).toHaveTextContent("2");
		await t.user.keyboard(kbd.BACKSPACE);
		expect(t.day).toHaveTextContent("dd");
		expect(t.day).toHaveFocus();
		await t.user.keyboard(kbd.BACKSPACE);
		expect(t.month).toHaveFocus();
	});

	it("should to the previous segment when backspace is pressed while empty - `year`", async () => {
		const t = setup({
			value: zonedDateTime,
			granularity: "second",
		});

		await t.user.click(t.year);
		expect(t.year).toHaveFocus();
		await t.user.keyboard(kbd.BACKSPACE);
		expect(t.year).toHaveTextContent("198");
		await t.user.keyboard(kbd.BACKSPACE);
		expect(t.year).toHaveTextContent("19");
		await t.user.keyboard(kbd.BACKSPACE);
		expect(t.year).toHaveTextContent("1");
		await t.user.keyboard(kbd.BACKSPACE);
		expect(t.year).toHaveTextContent("yyyy");
		expect(t.year).toHaveFocus();
		await t.user.keyboard(kbd.BACKSPACE);
		expect(t.day).toHaveFocus();
	});

	it.skip("displays correct timezone with ZonedDateTime value - `now`", async () => {
		const t = setup({
			value: now("America/Los_Angeles"),
		});

		const timeZone = t.getByTestId("timeZoneName");
		if (isDaylightSavingsTime()) {
			expect(timeZone).toHaveTextContent("PDT");
		} else {
			expect(timeZone).toHaveTextContent("PST");
		}
	});

	it("should display correct timezone with ZonedDateTime value - absolute -> local", async () => {
		const t = setup({
			value: parseAbsoluteToLocal("2023-10-12T12:30:00Z"),
		});

		const timeZone = t.getByTestId("timeZoneName");
		expect(timeZone).toHaveTextContent(thisTimeZone("2023-10-12T12:30:00Z"));
	});

	it("should not allow changing the dayPeriod without a value", async () => {
		const t = setup({
			granularity: "second",
		});
		const { getDayPeriod, getHour } = getTimeSegments(t.getByTestId);

		expect(getHour()).toHaveTextContent(TIME_PLACEHOLDER);
		await t.user.click(getDayPeriod());
		await t.user.keyboard(kbd.ARROW_UP);
		expect(getHour()).toHaveTextContent(TIME_PLACEHOLDER);
	});

	it("should handle backspacing the year segment appropriately", async () => {
		const t = setup({
			granularity: "hour",
		});

		t.year.focus();

		await t.user.keyboard(`{0}`);
		await t.user.keyboard(`{0}`);
		await t.user.keyboard(`{9}`);
		await t.user.keyboard(`{8}`);

		const { getHour } = getTimeSegments(t.getByTestId);
		const hour = getHour();
		expect(hour).toHaveFocus();

		await t.user.keyboard(kbd.ARROW_LEFT);
		expect(t.year).toHaveFocus();

		await t.user.keyboard(kbd.BACKSPACE);
		expect(t.year).toHaveTextContent("009");
		await t.user.keyboard(kbd.BACKSPACE);
		expect(t.year).toHaveTextContent("00");
		await t.user.keyboard(`{8}`);
		await t.user.keyboard(`{7}`);
		expect(t.year).toHaveTextContent("0087");
		expect(hour).toHaveFocus();
	});

	it("should allow going from 12PM -> 12AM without changing the display hour to 0", async () => {
		const t = setup({
			value: new CalendarDateTime(2023, 10, 12, 12, 30, 0, 0),
		});
		const { getHour, getDayPeriod } = getTimeSegments(t.getByTestId);

		expect(getHour()).toHaveTextContent("12");

		await t.user.click(getDayPeriod());
		await t.user.keyboard(kbd.ARROW_UP);

		expect(getHour()).toHaveTextContent("12");
		expect(getDayPeriod()).toHaveTextContent("AM");
	});

	it("should never allow the hour to be 0 when in a 12 hour cycle", async () => {
		const t = setup({
			value: new CalendarDateTime(2023, 10, 12, 12, 30, 0, 0),
		});
		const { getHour, getDayPeriod } = getTimeSegments(t.getByTestId);

		expect(getHour()).toHaveTextContent("12");

		await t.user.click(getDayPeriod());
		await t.user.keyboard(kbd.ARROW_UP);

		expect(getHour()).toHaveTextContent("12");
		expect(getDayPeriod()).toHaveTextContent("AM");

		await t.user.click(getHour());
		await t.user.keyboard(kbd.ARROW_UP);
		expect(getHour()).toHaveTextContent("01");
		expect(getHour()).not.toHaveTextContent("12");
		expect(getDayPeriod()).toHaveTextContent("AM");
		await t.user.click(getDayPeriod());
		await t.user.keyboard(kbd.ARROW_UP);
		expect(getHour()).toHaveTextContent("01");
		expect(getDayPeriod()).toHaveTextContent("PM");
		await t.user.click(getHour());
		await t.user.keyboard(kbd.ARROW_DOWN);
		expect(getHour()).toHaveTextContent("12");
		expect(getDayPeriod()).toHaveTextContent("PM");
	});

	it("should add missing leading zeroes to the day,month, and year segments on focusout", async () => {
		const t = setup({
			value: new CalendarDate(2023, 10, 12),
		});

		await t.user.click(t.month);
		await t.user.keyboard(`{1}`);
		await t.user.keyboard(kbd.ARROW_RIGHT);
		expect(t.day).toHaveFocus();
		expect(t.month).toHaveTextContent("01");

		await t.user.keyboard(`{1}`);
		await t.user.keyboard(kbd.ARROW_RIGHT);
		expect(t.year).toHaveFocus();
		expect(t.day).toHaveTextContent("01");
		await t.user.keyboard(kbd.BACKSPACE);
		expect(t.year).toHaveTextContent("202");
		await t.user.keyboard(kbd.ARROW_LEFT);
		expect(t.day).toHaveFocus();
		expect(t.year).toHaveTextContent("0202");
	});

	it("should not intercept number keys when the ctrl or meta key is pressed, allowing default browser behavior", async () => {
		const t = setup({
			value: new CalendarDate(2023, 10, 12),
		});

		await t.user.click(t.month);
		await t.user.keyboard(`{1}`);
		await t.user.keyboard(`{2}`);
		expect(t.month).toHaveTextContent("12");

		await t.user.keyboard(`{Shift>}1{/Shift}`);
		expect(t.month).toHaveTextContent("12");

		await t.user.keyboard(`{Ctrl>}2{/Ctrl}`);
		expect(t.month).toHaveTextContent("12");

		await t.user.keyboard(`{Meta>}2{/Meta}`);
		expect(t.month).toHaveTextContent("12");
	});

	it("should not allow typing 24 hour cycle hours when the hourcycle is 12", async () => {
		const t = setup({
			value: new CalendarDateTime(2023, 10, 12, 12, 30, 0, 0),
		});
		const { getHour, getMinute } = getTimeSegments(t.getByTestId);

		expect(getHour()).toHaveTextContent("12");
		await t.user.click(getHour());
		await t.user.keyboard(`{1}{4}`);
		expect(getMinute()).toHaveFocus();
		expect(getHour()).toHaveTextContent("04");
	});

	it("should not go to zero on arrow navigation with a 12 hour cycle", async () => {
		const t = setup({
			value: new CalendarDateTime(2023, 10, 12, 12, 30, 0, 0),
		});
		const { getHour, getMinute } = getTimeSegments(t.getByTestId);

		expect(getHour()).toHaveTextContent("12");
		await t.user.click(getHour());
		await t.user.keyboard(`{1}{4}`);
		expect(getMinute()).toHaveFocus();
		expect(getHour()).toHaveTextContent("04");
		await t.user.click(getHour());
		await t.user.keyboard(kbd.ARROW_DOWN);
		await t.user.keyboard(kbd.ARROW_DOWN);
		await t.user.keyboard(kbd.ARROW_DOWN);
		await t.user.keyboard(kbd.ARROW_DOWN);
		expect(getHour()).toHaveTextContent("12");
	});

	it("should allow double zeroes to be set in the minute segment", async () => {
		const t = setup({
			value: new CalendarDateTime(2023, 10, 12, 12, 30, 0, 0),
		});
		const { getHour, getMinute } = getTimeSegments(t.getByTestId);

		expect(getHour()).toHaveTextContent("12");
		await t.user.click(getMinute());
		await t.user.keyboard(`{0}{0}`);
		expect(getMinute()).toHaveTextContent("00");
	});

	it("should advance to the next segment when typing two zeroes into the minute segment", async () => {
		const t = setup({
			value: new CalendarDateTime(2023, 10, 12, 12, 30, 0, 0),
		});
		const { getHour, getMinute, getDayPeriod } = getTimeSegments(t.getByTestId);

		expect(getHour()).toHaveTextContent("12");
		await t.user.click(getMinute());
		await t.user.keyboard(`{0}{0}`);
		expect(getDayPeriod()).toHaveFocus();
	});

	it("should allow double zeroes to be set in the second segment", async () => {
		const t = setup({
			value: new CalendarDateTime(2023, 10, 12, 12, 30, 30, 0),
			granularity: "second",
		});
		const { getSecond } = getTimeSegments(t.getByTestId);

		expect(getSecond()).toHaveTextContent("30");
		await t.user.click(getSecond());
		await t.user.keyboard(`{0}{0}`);
		expect(getSecond()).toHaveTextContent("00");
	});

	it("should advance to the next segment when typing two zeroes into the second segment", async () => {
		const t = setup({
			value: new CalendarDateTime(2023, 10, 12, 12, 30, 30, 0),
			granularity: "second",
		});
		const { getSecond, getDayPeriod } = getTimeSegments(t.getByTestId);

		expect(getSecond()).toHaveTextContent("30");
		await t.user.click(getSecond());
		await t.user.keyboard(`{0}{0}`);
		expect(getDayPeriod()).toHaveFocus();
	});

	it("should not allow typing characters that are not `a` or `p` into the dayPeriod segment", async () => {
		const t = setup({
			value: new CalendarDateTime(2023, 10, 12, 12, 30, 30, 0),
			granularity: "second",
		});
		const { getDayPeriod } = getTimeSegments(t.getByTestId);

		expect(getDayPeriod()).toHaveTextContent("PM");
		await t.user.click(getDayPeriod());
		await t.user.keyboard("{i}{d}{k}");
		expect(getDayPeriod().textContent).toBe("PM");
	});

	it("should not allow typing non-numeric characters into the date/time segments", async () => {
		const t = setup({
			value: new CalendarDateTime(2023, 10, 12, 12, 30, 30, 0),
			granularity: "second",
		});
		const { getHour, getMinute, getSecond } = getTimeSegments(t.getByTestId);

		const segments = [t.day, t.month, t.year, getHour(), getMinute(), getSecond()];

		for (const seg of segments) {
			await t.user.click(seg);
			await t.user.keyboard("{i}{d}{k}");
			expect(seg).not.toHaveTextContent("idk");
		}
	});

	it("should allow changing the day period with capital or lowercase `a` and `p`", async () => {
		const t = setup({
			value: new CalendarDateTime(2023, 10, 12, 12, 30, 30, 0),
			granularity: "second",
		});

		const { getDayPeriod } = getTimeSegments(t.getByTestId);
		const dp = getDayPeriod();

		expect(dp).toHaveTextContent("PM");
		await t.user.click(dp);
		await t.user.keyboard("{Shift>}a{/Shift}");
		expect(dp).toHaveTextContent("AM");
		await t.user.keyboard("{Shift>}p{/Shift}");
		expect(dp).toHaveTextContent("PM");
		await t.user.keyboard("a");
		expect(dp).toHaveTextContent("AM");
		await t.user.keyboard("p");
		expect(dp).toHaveTextContent("PM");
	});

	it("should not allow more than 4 digits in the year segment, even if the user types more", async () => {
		const t = setup({
			value: new CalendarDate(2023, 10, 12),
		});
		await t.user.click(t.year);
		await t.user.keyboard(kbd.BACKSPACE);
		await t.user.keyboard(kbd.BACKSPACE);
		await t.user.keyboard(kbd.BACKSPACE);
		await t.user.keyboard(kbd.BACKSPACE);
		expect(t.year).toHaveTextContent("yyyy");
		for (const i of "222222") {
			await t.user.keyboard(i);
		}
		expect(t.year).not.toHaveTextContent("222222");
		expect(t.year).toHaveTextContent("2222");
	});

	it("should render a hidden input if the `name` prop is passed", async () => {
		const t = setup({
			name: "date-field",
		});
		const hiddenInput = t.container.querySelector("input");
		expect(hiddenInput).not.toBeNull();
		expect(hiddenInput).toHaveAttribute("name", "date-field");
		expect(hiddenInput).toHaveAttribute("aria-hidden", "true"); // TODO: this is not working
	});

	it("should not render a hidden input if the name prop isn't passed", async () => {
		const t = setup();
		const hiddenInput = t.container.querySelector("input");
		expect(hiddenInput).toBeNull();
	});

	it("should keep the value of the hidden input in sync with the fields value", async () => {
		const value = new CalendarDateTime(2023, 10, 12, 12, 30, 30, 0);
		const t = setup({
			name: "hello",
			value,
		});

		const hiddenInput = t.container.querySelector("input");
		expect(hiddenInput).toHaveValue(value.toString());

		await t.user.click(t.year);
		await t.user.keyboard(kbd.ARROW_UP);
		expect(hiddenInput).toHaveValue(value.add({ years: 1 }).toString());
	});

	it("should handle 24 hour time appropriately", async () => {
		const value = new CalendarDateTime(2023, 10, 12, 12, 30, 30, 0);
		const t = setup({
			name: "hello",
			value,
			hourCycle: 24,
		});

		const { getHour } = getTimeSegments(t.getByTestId);
		const hour = getHour();
		hour.focus();
		await t.user.keyboard("22");
		expect(hour).toHaveTextContent("22");
	});

	it("should allow 00 to be entered when hourCycle is 24", async () => {
		const value = new CalendarDateTime(2023, 10, 12, 12, 30, 30, 0);
		const t = setup({
			name: "hello",
			value,
			hourCycle: 24,
		});

		const { getHour } = getTimeSegments(t.getByTestId);
		const hour = getHour();
		hour.focus();
		await t.user.keyboard("00");
		expect(hour).toHaveTextContent("00");
	});

	it("navigating to 00 with ArrowUp/Down when hourCycle is 24 should show 00 and not 0", async () => {
		const value = new CalendarDateTime(2023, 10, 12, 1, 30, 30, 0);
		const t = setup({
			name: "hello",
			value,
			hourCycle: 24,
		});

		const { getHour } = getTimeSegments(t.getByTestId);
		const hour = getHour();
		hour.focus();
		await t.user.keyboard(kbd.ARROW_DOWN);
		expect(hour).toHaveTextContent("00");
		expect(hour.textContent).not.toBe("0");
		await t.user.keyboard(kbd.ARROW_DOWN);
		expect(hour).toHaveTextContent("23");
		await t.user.keyboard(kbd.ARROW_UP);
		expect(hour).toHaveTextContent("00");
	});

	it("should display correct hour when prepopulated with value and hourCycle is 24", async () => {
		const value = new CalendarDateTime(2023, 10, 12, 0, 30, 30, 0);
		const t = setup({
			name: "hello",
			value,
			hourCycle: 24,
		});

		const { getHour } = getTimeSegments(t.getByTestId);
		const hour = getHour();
		expect(hour).toHaveTextContent("00");
	});

	it("should reset the segment values when the value is reset", async () => {
		const t = setup({
			value: new CalendarDateTime(2023, 10, 12, 12, 30, 30, 0),
			granularity: "second",
		});

		const reset = t.getByTestId("reset");

		await t.user.click(reset);

		expect(t.day).toHaveTextContent("dd");
		expect(t.month).toHaveTextContent("mm");
		expect(t.year).toHaveTextContent("yyyy");
	});
});

/**
 * Since the time segments are not always present, this function returns an
 * object with functions that return the time segments if they exist, so they
 * can be used on an as-needed basis without invoking errors.
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function getTimeSegments(getByTestId: (...args: any[]) => Locator) {
	return {
		getHour: () => getByTestId("hour").element() as HTMLElement,
		getMinute: () => getByTestId("minute").element() as HTMLElement,
		getSecond: () => getByTestId("second").element() as HTMLElement,
		getDayPeriod: () => getByTestId("dayPeriod").element() as HTMLElement,
		getTimeZoneName: () => getByTestId("timeZoneName").element() as HTMLElement,
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
