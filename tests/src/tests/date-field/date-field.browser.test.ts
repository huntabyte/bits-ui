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
import { userEvent, type Locator } from "@vitest/browser/context";
import { getTestKbd } from "../utils.js";
import DateFieldTest, { type DateFieldTestProps } from "./date-field-test.svelte";
import {
	expectExists,
	expectNotClickableLoc,
	expectNotExists,
	setupBrowserUserEvents,
} from "../browser-utils";

const kbd = getTestKbd();

const TIME_PLACEHOLDER = "––";

const calendarDate = new CalendarDate(1980, 1, 20);
const calendarDateTime = new CalendarDateTime(1980, 1, 20, 12, 30, 0, 0);
const zonedDateTime = toZoned(calendarDateTime, "America/New_York");

function setup(props: DateFieldTestProps = {}) {
	const user = setupBrowserUserEvents();
	const t = render(DateFieldTest, { ...props });
	const month = t.getByTestId("month");
	const day = t.getByTestId("day");
	const year = t.getByTestId("year");
	const value = t.getByTestId("value");
	const input = t.getByTestId("input");
	const label = t.getByTestId("label");

	return { ...t, user, month, day, year, value, input, label };
}

describe("date field", () => {
	it("should populate segment with value - `CalendarDate`", async () => {
		const t = setup({
			value: calendarDate,
		});

		await expect.element(t.month).toHaveTextContent(String(calendarDate.month));
		await expect.element(t.day).toHaveTextContent(String(calendarDate.day));
		await expect.element(t.year).toHaveTextContent(String(calendarDate.year));
		await expect.element(t.value).toHaveTextContent(calendarDate.toString());
	});

	it("should populate segment with value - `CalendarDateTime`", async () => {
		const t = setup({
			value: calendarDateTime,
		});

		await expect.element(t.month).toHaveTextContent(String(calendarDateTime.month));
		await expect.element(t.day).toHaveTextContent(String(calendarDateTime.day));
		await expect.element(t.year).toHaveTextContent(String(calendarDateTime.year));
		await expect
			.element(t.getByTestId("hour"))
			.toHaveTextContent(String(calendarDateTime.hour));
		await expect
			.element(t.getByTestId("minute"))
			.toHaveTextContent(String(calendarDateTime.minute));
		await expect.element(t.value).toHaveTextContent(calendarDate.toString());
	});

	it("should populate segment with value - `ZonedDateTime`", async () => {
		const t = setup({
			value: zonedDateTime,
		});

		await expect.element(t.month).toHaveTextContent(String(zonedDateTime.month));
		await expect.element(t.day).toHaveTextContent(String(zonedDateTime.day));
		await expect.element(t.year).toHaveTextContent(String(zonedDateTime.year));
		await expect.element(t.getByTestId("hour")).toHaveTextContent(String(zonedDateTime.hour));
		await expect
			.element(t.getByTestId("minute"))
			.toHaveTextContent(String(zonedDateTime.minute));
		await expect.element(t.getByTestId("dayPeriod")).toHaveTextContent("PM");
		await expect.element(t.getByTestId("timeZoneName")).toHaveTextContent("EST");
		await expect.element(t.value).toHaveTextContent(calendarDate.toString());
	});

	it("should change segment positioning based on `locale`", async () => {
		if (navigator.userAgent.includes("WebKit")) {
			expect(true);
			return;
		}
		const t = setup({
			locale: "en-UK",
		});

		const firstSeg = t.input.element().children[0];
		// skipping the literal slashes here
		const secondSeg = t.input.element().children[2];
		const thirdSeg = t.input.element().children[4];

		await expect.element(firstSeg).toHaveTextContent("dd");
		await expect.element(secondSeg).toHaveTextContent("mm");
		await expect.element(thirdSeg).toHaveTextContent("yyyy");
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
		await t.label.click();
		await expect.element(t.month).toHaveFocus();
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
			await segment.click();
			await expect.element(segment).toHaveFocus();
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

		await t.day.click();
		await userEvent.keyboard(kbd.ARROW_UP);
		await expect.element(t.day).toHaveTextContent(cycle("day"));
		await t.month.click();
		await userEvent.keyboard(kbd.ARROW_UP);
		await expect.element(t.month).toHaveTextContent(cycle("month"));
		await t.year.click();
		await userEvent.keyboard(kbd.ARROW_UP);
		await expect.element(t.year).toHaveTextContent(cycle("year"));
		await hour.click();
		await userEvent.keyboard(kbd.ARROW_UP);
		await expect.element(hour).toHaveTextContent("1");
		await minute.click();
		await userEvent.keyboard(kbd.ARROW_UP);
		await expect.element(minute).toHaveTextContent(cycle("minute"));
		await second.click();
		await userEvent.keyboard(kbd.ARROW_UP);
		await expect.element(second).toHaveTextContent(cycle("second"));
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

		await t.day.click();
		await userEvent.keyboard(kbd.ARROW_DOWN);
		await expect.element(t.day).toHaveTextContent(cycle("day"));
		await t.month.click();
		await userEvent.keyboard(kbd.ARROW_DOWN);
		await expect.element(t.month).toHaveTextContent(cycle("month"));
		await t.year.click();
		await userEvent.keyboard(kbd.ARROW_DOWN);
		await expect.element(t.year).toHaveTextContent(cycle("year"));
		await hour.click();
		await userEvent.keyboard(kbd.ARROW_DOWN);
		await expect.element(hour).toHaveTextContent(cycle("hour"));
		await minute.click();
		await userEvent.keyboard(kbd.ARROW_DOWN);
		await expect.element(minute).toHaveTextContent(cycle("minute"));
		await second.click();
		await userEvent.keyboard(kbd.ARROW_DOWN);
		await expect.element(second).toHaveTextContent(cycle("second"));
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

		await t.month.click();

		for (const seg of segments) {
			await expect.element(seg).toHaveFocus();
			await userEvent.keyboard(kbd.ARROW_RIGHT);
		}
		await expect.element(t.getByTestId("timeZoneName")).toHaveFocus();

		for (const seg of segments.reverse()) {
			await expect.element(seg).toHaveFocus();
			await userEvent.keyboard(kbd.ARROW_LEFT);
		}
		await expect.element(t.month).toHaveFocus();
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

		await t.month.click();

		for (const seg of segments) {
			await expect.element(seg).toHaveFocus();
			await userEvent.keyboard(kbd.TAB);
		}
		await expect.element(t.getByTestId("timeZoneName")).toHaveFocus();

		for (const seg of segments.reverse()) {
			await userEvent.keyboard(kbd.SHIFT_TAB);
			await expect.element(seg).toHaveFocus();
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
			await expectNotClickableLoc(seg);
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
			t.getByTestId("hour"),
			t.getByTestId("minute"),
			t.getByTestId("second"),
		];

		for (const segment of segments) {
			await segment.click();
			await expect.element(segment).toHaveFocus();
			await userEvent.keyboard(kbd.ARROW_UP);
			await expect
				.element(segment)
				.toHaveTextContent(
					String(
						zonedDateTime[
							(segment.element() as HTMLElement).dataset.segment as
								| keyof TimeFields
								| keyof DateFields
						] ?? ""
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
			t.getByTestId("hour"),
			t.getByTestId("minute"),
			t.getByTestId("second"),
			t.getByTestId("dayPeriod"),
			t.getByTestId("timeZoneName"),
		];

		await t.month.click();
		await userEvent.keyboard(`{2}`);
		await expect.element(t.month).toHaveTextContent("2");
		await expect.element(t.day).toHaveFocus();
		await userEvent.keyboard(`19`);
		await expect.element(t.day).toHaveTextContent("19");
		await expect.element(t.getByTestId("year")).toHaveFocus();
		await userEvent.keyboard(`{1111}`);
		await expect.element(t.year).toHaveTextContent("1111");

		for (const seg of segments) {
			await expect.element(seg).toHaveAttribute("aria-invalid", "true");
			await expect.element(seg).toHaveAttribute("data-invalid");
		}

		await expect.element(t.input).toHaveAttribute("data-invalid");
		await expect.element(t.label).toHaveAttribute("data-invalid");
	});

	it("should adjust the hour cycle with the `hourCycle` prop", async () => {
		const t = setup({
			value: zonedDateTime,
			hourCycle: 24,
		});
		await expectNotExists(t.getByTestId("dayPeriod"));

		const hour = t.getByTestId("hour");
		await expect.element(hour).toHaveTextContent("12");
		await hour.click();
		await expect.element(hour).toHaveFocus();
		await userEvent.keyboard(kbd.ARROW_UP);
		await expect.element(hour).toHaveTextContent("13");
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
			await expect.element(seg).toBeVisible();
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
			t.getByTestId("hour"),
			t.getByTestId("minute"),
			t.getByTestId("dayPeriod"),
		];

		await expectNotExists(t.getByTestId("second"));

		for (const seg of displayedSegments) {
			await expect.element(seg).toBeVisible();
		}
	});

	it("should change the value when the dayPeriod segment is changed", async () => {
		const t = setup({
			value: calendarDateTime,
		});

		await expect.element(t.value).toHaveTextContent("1980-01-20T12:30");
		const dayPeriod = t.getByTestId("dayPeriod");
		await expect.element(dayPeriod).toHaveTextContent("PM");

		await dayPeriod.click();
		await expect.element(dayPeriod).toHaveFocus();
		await userEvent.keyboard(kbd.ARROW_UP);
		await expect.element(dayPeriod).toHaveTextContent("AM");
		await expect.element(t.value).toHaveTextContent("1980-01-20T00:30");
	});

	it("should go all the way through the segment with spamming 3", async () => {
		const t = setup({
			value: zonedDateTime,
			granularity: "second",
		});

		const { getHour, getMinute, getSecond, getDayPeriod } = getTimeSegments(t.getByTestId);

		await t.month.click();
		await userEvent.keyboard(`{3}`);

		await expect.element(t.day).toHaveFocus();
		await userEvent.keyboard(`{3}`);
		await userEvent.keyboard(`{3}`);
		await expect.element(t.year).toHaveFocus();
		await userEvent.keyboard(`{3}`);
		await userEvent.keyboard(`{3}`);
		await userEvent.keyboard(`{3}`);
		await userEvent.keyboard(`{3}`);
		await expect.element(getHour()).toHaveFocus();
		await userEvent.keyboard(`{3}`);
		await expect.element(getMinute()).toHaveFocus();
		await userEvent.keyboard(`{3}`);
		await userEvent.keyboard(`{3}`);
		await expect.element(getSecond()).toHaveFocus();
		await userEvent.keyboard(`{3}`);
		await userEvent.keyboard(`{3}`);
		await expect.element(getDayPeriod()).toHaveFocus();
	});

	it("should overwrite on first click and type - `month`", async () => {
		const t = setup({
			value: zonedDateTime,
			granularity: "second",
		});

		await t.month.click();
		await expect.element(t.month).toHaveFocus();
		await expect.element(t.month).toHaveTextContent(String(zonedDateTime.month));
		await userEvent.keyboard(`{3}`);
		await expect.element(t.month).toHaveTextContent("3");
	});

	it("should fully overwrite on first click and type - `day`", async () => {
		const t = setup({
			value: zonedDateTime,
			granularity: "second",
		});

		await t.day.click();
		await expect.element(t.day).toHaveFocus();
		await expect.element(t.day).toHaveTextContent(String(zonedDateTime.day));
		await userEvent.keyboard(`{1}`);
		await expect.element(t.day).toHaveTextContent("1");
	});

	it("should overwrite on first click and type - `year`", async () => {
		const t = setup({
			value: zonedDateTime,
			granularity: "second",
		});

		await t.year.click();
		await expect.element(t.year).toHaveFocus();
		await expect.element(t.year).toHaveTextContent(String(zonedDateTime.year));
		await userEvent.keyboard(`{1}`);
		await expect.element(t.year).toHaveTextContent("1");
	});

	it("should overwrite on first click and type - `hour`", async () => {
		const t = setup({
			value: zonedDateTime,
			granularity: "second",
		});
		const hour = t.getByTestId("hour");

		await hour.click();
		await expect.element(hour).toHaveFocus();
		await expect.element(hour).toHaveTextContent(String(zonedDateTime.hour));
		await userEvent.keyboard(`{1}`);
		await expect.element(hour).toHaveTextContent("1");
	});

	it("should overwrite on first click and type - `minute`", async () => {
		const t = setup({
			value: zonedDateTime,
			granularity: "second",
		});
		const minute = t.getByTestId("minute");

		await minute.click();
		await expect.element(minute).toHaveFocus();
		await expect.element(minute).toHaveTextContent(String(zonedDateTime.minute));
		await userEvent.keyboard(`{1}`);
		await expect.element(minute).toHaveTextContent("1");
	});

	it("should overwrite on first click and type - `second`", async () => {
		const t = setup({
			value: zonedDateTime,
			granularity: "second",
		});
		const second = t.getByTestId("second");

		await second.click();
		await expect.element(second).toHaveFocus();
		await expect.element(second).toHaveTextContent(String(zonedDateTime.second));
		await userEvent.keyboard(`{1}`);
		await expect.element(second).toHaveTextContent("1");
	});

	it("should move to the previous segment when backspace is pressed while empty - `day`", async () => {
		const t = setup({
			value: zonedDateTime,
			granularity: "second",
		});

		await t.day.click();
		await expect.element(t.day).toHaveFocus();
		await expect.element(t.day).toHaveTextContent(String(zonedDateTime.day));
		await userEvent.keyboard(kbd.BACKSPACE);
		await expect.element(t.day).toHaveTextContent("2");
		await userEvent.keyboard(kbd.BACKSPACE);
		await expect.element(t.day).toHaveTextContent("dd");
		await expect.element(t.day).toHaveFocus();
		await userEvent.keyboard(kbd.BACKSPACE);
		await expect.element(t.month).toHaveFocus();
	});

	it("should to the previous segment when backspace is pressed while empty - `year`", async () => {
		const t = setup({
			value: zonedDateTime,
			granularity: "second",
		});

		await t.year.click();
		await expect.element(t.year).toHaveFocus();
		await userEvent.keyboard(kbd.BACKSPACE);
		await expect.element(t.year).toHaveTextContent("198");
		await userEvent.keyboard(kbd.BACKSPACE);
		await expect.element(t.year).toHaveTextContent("19");
		await userEvent.keyboard(kbd.BACKSPACE);
		await expect.element(t.year).toHaveTextContent("1");
		await userEvent.keyboard(kbd.BACKSPACE);
		await expect.element(t.year).toHaveTextContent("yyyy");
		await expect.element(t.year).toHaveFocus();
		await userEvent.keyboard(kbd.BACKSPACE);
		await expect.element(t.day).toHaveFocus();
	});

	it.skip("displays correct timezone with ZonedDateTime value - `now`", async () => {
		const t = setup({
			value: now("America/Los_Angeles"),
		});

		const timeZone = t.getByTestId("timeZoneName");
		if (isDaylightSavingsTime()) {
			await expect.element(timeZone).toHaveTextContent("PDT");
		} else {
			await expect.element(timeZone).toHaveTextContent("PST");
		}
	});

	it("should display correct timezone with ZonedDateTime value - absolute -> local", async () => {
		const t = setup({
			value: parseAbsoluteToLocal("2023-10-12T12:30:00Z"),
		});

		const timeZone = t.getByTestId("timeZoneName");
		await expect.element(timeZone).toHaveTextContent(thisTimeZone("2023-10-12T12:30:00Z"));
	});

	it("should not allow changing the dayPeriod without a value", async () => {
		const t = setup({
			granularity: "second",
		});
		const { getDayPeriod, getHour } = getTimeSegments(t.getByTestId);

		await expect.element(getHour()).toHaveTextContent(TIME_PLACEHOLDER);
		await getDayPeriod().click();
		await userEvent.keyboard(kbd.ARROW_UP);
		await expect.element(getHour()).toHaveTextContent(TIME_PLACEHOLDER);
	});

	it("should handle backspacing the year segment appropriately", async () => {
		const t = setup({
			granularity: "hour",
		});

		(t.year.element() as HTMLElement).focus();

		await userEvent.keyboard(`{0}`);
		await userEvent.keyboard(`{0}`);
		await userEvent.keyboard(`{9}`);
		await userEvent.keyboard(`{8}`);

		const { getHour } = getTimeSegments(t.getByTestId);
		const hour = getHour();
		await expect.element(hour).toHaveFocus();

		await userEvent.keyboard(kbd.ARROW_LEFT);
		await expect.element(t.year).toHaveFocus();

		await userEvent.keyboard(kbd.BACKSPACE);
		await expect.element(t.year).toHaveTextContent("009");
		await userEvent.keyboard(kbd.BACKSPACE);
		await expect.element(t.year).toHaveTextContent("00");
		await userEvent.keyboard(`{8}`);
		await userEvent.keyboard(`{7}`);
		await expect.element(t.year).toHaveTextContent("0087");
		await expect.element(hour).toHaveFocus();
	});

	it("should allow going from 12PM -> 12AM without changing the display hour to 0", async () => {
		const t = setup({
			value: new CalendarDateTime(2023, 10, 12, 12, 30, 0, 0),
		});
		const { getHour, getDayPeriod } = getTimeSegments(t.getByTestId);

		await expect.element(getHour()).toHaveTextContent("12");

		await getDayPeriod().click();
		await userEvent.keyboard(kbd.ARROW_UP);

		await expect.element(getHour()).toHaveTextContent("12");
		await expect.element(getDayPeriod()).toHaveTextContent("AM");
	});

	it("should never allow the hour to be 0 when in a 12 hour cycle", async () => {
		const t = setup({
			value: new CalendarDateTime(2023, 10, 12, 12, 30, 0, 0),
		});
		const { getHour, getDayPeriod } = getTimeSegments(t.getByTestId);

		await expect.element(getHour()).toHaveTextContent("12");

		await getDayPeriod().click();
		await userEvent.keyboard(kbd.ARROW_UP);

		await expect.element(getHour()).toHaveTextContent("12");
		await expect.element(getDayPeriod()).toHaveTextContent("AM");

		await getHour().click();
		await userEvent.keyboard(kbd.ARROW_UP);
		await expect.element(getHour()).toHaveTextContent("01");
		await expect.element(getHour()).not.toHaveTextContent("12");
		await expect.element(getDayPeriod()).toHaveTextContent("AM");
		await getDayPeriod().click();
		await userEvent.keyboard(kbd.ARROW_UP);
		await expect.element(getHour()).toHaveTextContent("01");
		await expect.element(getDayPeriod()).toHaveTextContent("PM");
		await getHour().click();
		await userEvent.keyboard(kbd.ARROW_DOWN);
		await expect.element(getHour()).toHaveTextContent("12");
		await expect.element(getDayPeriod()).toHaveTextContent("PM");
	});

	it("should add missing leading zeroes to the day,month, and year segments on focusout", async () => {
		const t = setup({
			value: new CalendarDate(2023, 10, 12),
		});

		await t.month.click();
		await userEvent.keyboard(`{1}`);
		await userEvent.keyboard(kbd.ARROW_RIGHT);
		await expect.element(t.day).toHaveFocus();
		await expect.element(t.month).toHaveTextContent("01");

		await userEvent.keyboard(`{1}`);
		await userEvent.keyboard(kbd.ARROW_RIGHT);
		await expect.element(t.year).toHaveFocus();
		await expect.element(t.day).toHaveTextContent("01");
		await userEvent.keyboard(kbd.BACKSPACE);
		await expect.element(t.year).toHaveTextContent("202");
		await userEvent.keyboard(kbd.ARROW_LEFT);
		await expect.element(t.day).toHaveFocus();
		await expect.element(t.year).toHaveTextContent("0202");
	});

	it("should not intercept number keys when the ctrl or meta key is pressed, allowing default browser behavior", async () => {
		const t = setup({
			value: new CalendarDate(2023, 10, 12),
		});

		await t.month.click();

		await userEvent.keyboard(`{1}`);
		await userEvent.keyboard(`{2}`);
		await expect.element(t.month).toHaveTextContent("12");

		await userEvent.keyboard(`{Shift>}1{/Shift}`);
		await expect.element(t.month).toHaveTextContent("12");

		await userEvent.keyboard(`{Ctrl>}2{/Ctrl}`);
		await expect.element(t.month).toHaveTextContent("12");

		await userEvent.keyboard(`{Meta>}2{/Meta}`);
		await expect.element(t.month).toHaveTextContent("12");
	});

	it("should not allow typing 24 hour cycle hours when the hourcycle is 12", async () => {
		const t = setup({
			value: new CalendarDateTime(2023, 10, 12, 12, 30, 0, 0),
		});
		const { getHour, getMinute } = getTimeSegments(t.getByTestId);

		await expect.element(getHour()).toHaveTextContent("12");

		await getHour().click();
		await userEvent.keyboard(`{1}{4}`);
		await expect.element(getMinute()).toHaveFocus();
		await expect.element(getHour()).toHaveTextContent("04");
	});

	it("should not go to zero on arrow navigation with a 12 hour cycle", async () => {
		const t = setup({
			value: new CalendarDateTime(2023, 10, 12, 12, 30, 0, 0),
		});
		const { getHour, getMinute } = getTimeSegments(t.getByTestId);

		await expect.element(getHour()).toHaveTextContent("12");
		await getHour().click();
		await userEvent.keyboard(`{1}{4}`);
		await expect.element(getMinute()).toHaveFocus();
		await expect.element(getHour()).toHaveTextContent("04");
		await getHour().click();
		await userEvent.keyboard(kbd.ARROW_DOWN);
		await userEvent.keyboard(kbd.ARROW_DOWN);
		await userEvent.keyboard(kbd.ARROW_DOWN);
		await userEvent.keyboard(kbd.ARROW_DOWN);
		await expect.element(getHour()).toHaveTextContent("12");
	});

	it("should allow double zeroes to be set in the minute segment", async () => {
		const t = setup({
			value: new CalendarDateTime(2023, 10, 12, 12, 30, 0, 0),
		});
		const { getHour, getMinute } = getTimeSegments(t.getByTestId);

		await expect.element(getHour()).toHaveTextContent("12");
		await getMinute().click();
		await userEvent.keyboard(`{0}{0}`);
		await expect.element(getMinute()).toHaveTextContent("00");
	});

	it("should advance to the next segment when typing two zeroes into the minute segment", async () => {
		const t = setup({
			value: new CalendarDateTime(2023, 10, 12, 12, 30, 0, 0),
		});
		const { getHour, getMinute, getDayPeriod } = getTimeSegments(t.getByTestId);

		await expect.element(getHour()).toHaveTextContent("12");
		await getMinute().click();
		await userEvent.keyboard(`{0}{0}`);
		await expect.element(getDayPeriod()).toHaveFocus();
	});

	it("should allow double zeroes to be set in the second segment", async () => {
		const t = setup({
			value: new CalendarDateTime(2023, 10, 12, 12, 30, 30, 0),
			granularity: "second",
		});
		const { getSecond } = getTimeSegments(t.getByTestId);

		await expect.element(getSecond()).toHaveTextContent("30");
		await getSecond().click();
		await userEvent.keyboard(`{0}{0}`);
		await expect.element(getSecond()).toHaveTextContent("00");
	});

	it("should advance to the next segment when typing two zeroes into the second segment", async () => {
		const t = setup({
			value: new CalendarDateTime(2023, 10, 12, 12, 30, 30, 0),
			granularity: "second",
		});
		const { getSecond, getDayPeriod } = getTimeSegments(t.getByTestId);

		await expect.element(getSecond()).toHaveTextContent("30");
		await getSecond().click();
		await userEvent.keyboard(`{0}{0}`);
		await expect.element(getDayPeriod()).toHaveFocus();
	});

	it("should not allow typing characters that are not `a` or `p` into the dayPeriod segment", async () => {
		const t = setup({
			value: new CalendarDateTime(2023, 10, 12, 12, 30, 30, 0),
			granularity: "second",
		});
		const { getDayPeriod } = getTimeSegments(t.getByTestId);

		await expect.element(getDayPeriod()).toHaveTextContent("PM");
		await getDayPeriod().click();
		await userEvent.keyboard("{i}{d}{k}");
		await expect.element(getDayPeriod()).toHaveTextContent("PM");
	});

	it("should not allow typing non-numeric characters into the date/time segments", async () => {
		const t = setup({
			value: new CalendarDateTime(2023, 10, 12, 12, 30, 30, 0),
			granularity: "second",
		});
		const { getHour, getMinute, getSecond } = getTimeSegments(t.getByTestId);

		const segments = [t.day, t.month, t.year, getHour(), getMinute(), getSecond()];

		for (const seg of segments) {
			await seg.click();
			await userEvent.keyboard("{i}{d}{k}");
			await expect.element(seg).not.toHaveTextContent("idk");
		}
	});

	it("should allow changing the day period with capital or lowercase `a` and `p`", async () => {
		const t = setup({
			value: new CalendarDateTime(2023, 10, 12, 12, 30, 30, 0),
			granularity: "second",
		});

		const { getDayPeriod } = getTimeSegments(t.getByTestId);
		const dp = getDayPeriod();

		await expect.element(dp).toHaveTextContent("PM");
		await dp.click();
		await userEvent.keyboard("{Shift>}a{/Shift}");
		await expect.element(dp).toHaveTextContent("AM");
		await userEvent.keyboard("{Shift>}p{/Shift}");
		await expect.element(dp).toHaveTextContent("PM");
		await userEvent.keyboard("a");
		await expect.element(dp).toHaveTextContent("AM");
		await userEvent.keyboard("p");
		await expect.element(dp).toHaveTextContent("PM");
	});

	it("should not allow more than 4 digits in the year segment, even if the user types more", async () => {
		const t = setup({
			value: new CalendarDate(2023, 10, 12),
		});
		await t.year.click();
		await userEvent.keyboard(kbd.BACKSPACE);
		await userEvent.keyboard(kbd.BACKSPACE);
		await userEvent.keyboard(kbd.BACKSPACE);
		await userEvent.keyboard(kbd.BACKSPACE);
		await expect.element(t.year).toHaveTextContent("yyyy");
		for (const i of "222222") {
			await userEvent.keyboard(i);
		}
		await expect.element(t.year).not.toHaveTextContent("222222");
		await expect.element(t.year).toHaveTextContent("2222");
	});

	it("should render a hidden input if the `name` prop is passed", async () => {
		const t = setup({
			name: "date-field",
		});
		const hiddenInput = t.container.querySelector("input");
		await expect.element(hiddenInput).not.toBeNull();

		await expect.element(hiddenInput).toHaveAttribute("name", "date-field");
		await expect.element(hiddenInput).toHaveAttribute("aria-hidden", "true");
	});

	it("should not render a hidden input if the name prop isn't passed", async () => {
		const t = setup();
		const hiddenInput = t.container.querySelector("input");
		await expect.element(hiddenInput).toBeNull();
	});

	it("should keep the value of the hidden input in sync with the fields value", async () => {
		const value = new CalendarDateTime(2023, 10, 12, 12, 30, 30, 0);
		const t = setup({
			name: "hello",
			value,
		});

		const hiddenInput = t.container.querySelector("input");
		await expect.element(hiddenInput).toHaveValue(value.toString());

		await t.year.click();
		await userEvent.keyboard(kbd.ARROW_UP);
		await expect.element(hiddenInput).toHaveValue(value.add({ years: 1 }).toString());
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
		(hour.element() as HTMLElement).focus();
		await userEvent.keyboard("22");
		await expect.element(hour).toHaveTextContent("22");
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
		(hour.element() as HTMLElement).focus();
		await userEvent.keyboard("00");
		await expect.element(hour).toHaveTextContent("00");
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
		(hour.element() as HTMLElement).focus();
		await userEvent.keyboard(kbd.ARROW_DOWN);
		await expect.element(hour).toHaveTextContent("00");
		await expect.element(hour).not.toHaveTextContent(/^0$/);
		await userEvent.keyboard(kbd.ARROW_DOWN);
		await expect.element(hour).toHaveTextContent("23");
		await userEvent.keyboard(kbd.ARROW_UP);
		await expect.element(hour).toHaveTextContent("00");
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
		await expect.element(hour).toHaveTextContent("00");
	});

	it("should reset the segment values when the value is reset", async () => {
		const t = setup({
			value: new CalendarDateTime(2023, 10, 12, 12, 30, 30, 0),
			granularity: "second",
		});

		const reset = t.getByTestId("reset");

		await reset.click();

		await expect.element(t.day).toHaveTextContent("dd");
		await expect.element(t.month).toHaveTextContent("mm");
		await expect.element(t.year).toHaveTextContent("yyyy");
	});
});

/**
 * Since the time segments are not always present, this function returns an
 * object with functions that return the time segments if they exist, so they
 * can be used on an as-needed basis without invoking errors.
 */
// oxlint-disable-next-line no-explicit-any
function getTimeSegments(getByTestId: (...args: any[]) => Locator) {
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
