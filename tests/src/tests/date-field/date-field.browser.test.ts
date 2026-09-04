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
import { page, userEvent, type Locator } from "vitest/browser";
import { getTestKbd } from "../utils.js";
import DateFieldTest, { type DateFieldTestProps } from "./date-field-test.svelte";
import { expectExists, expectNotClickableLoc, expectNotExists } from "../browser-utils";

const kbd = getTestKbd();

const TIME_PLACEHOLDER = "––";

const calendarDate = new CalendarDate(1980, 1, 20);
const calendarDateTime = new CalendarDateTime(1980, 1, 20, 12, 30, 0, 0);
const zonedDateTime = toZoned(calendarDateTime, "America/New_York");

async function setup(props: DateFieldTestProps = {}) {
	const t = await render(DateFieldTest, { ...props });
	const month = page.getByTestId("month");
	const day = page.getByTestId("day");
	const year = page.getByTestId("year");
	const value = page.getByTestId("value");
	const input = page.getByTestId("input");
	const label = page.getByTestId("label");

	return { ...t, month, day, year, value, input, label };
}

describe("date field", () => {
	it("should populate segment with value - `CalendarDate`", async () => {
		const t = await setup({
			value: calendarDate,
		});

		await expect.element(t.month).toMatchTextContent(String(calendarDate.month));
		await expect.element(t.day).toMatchTextContent(String(calendarDate.day));
		await expect.element(t.year).toMatchTextContent(String(calendarDate.year));
		await expect.element(t.value).toMatchTextContent(calendarDate.toString());
	});

	it("should populate segment with value - `CalendarDateTime`", async () => {
		const t = await setup({
			value: calendarDateTime,
		});

		await expect.element(t.month).toMatchTextContent(String(calendarDateTime.month));
		await expect.element(t.day).toMatchTextContent(String(calendarDateTime.day));
		await expect.element(t.year).toMatchTextContent(String(calendarDateTime.year));
		await expect
			.element(page.getByTestId("hour"))
			.toMatchTextContent(String(calendarDateTime.hour));
		await expect
			.element(page.getByTestId("minute"))
			.toMatchTextContent(String(calendarDateTime.minute));
		await expect.element(t.value).toMatchTextContent(calendarDate.toString());
	});

	it("should populate segment with value - `ZonedDateTime`", async () => {
		const t = await setup({
			value: zonedDateTime,
		});

		await expect.element(t.month).toMatchTextContent(String(zonedDateTime.month));
		await expect.element(t.day).toMatchTextContent(String(zonedDateTime.day));
		await expect.element(t.year).toMatchTextContent(String(zonedDateTime.year));
		await expect
			.element(page.getByTestId("hour"))
			.toMatchTextContent(String(zonedDateTime.hour));
		await expect
			.element(page.getByTestId("minute"))
			.toMatchTextContent(String(zonedDateTime.minute));
		await expect.element(page.getByTestId("dayPeriod")).toMatchTextContent("PM");
		await expect.element(page.getByTestId("timeZoneName")).toMatchTextContent("EST");
		await expect.element(t.value).toMatchTextContent(calendarDate.toString());
	});

	it("should change segment positioning based on `locale`", async () => {
		if (navigator.userAgent.includes("WebKit")) {
			expect(true);
			return;
		}
		const t = await setup({
			locale: "en-UK",
		});

		const firstSeg = t.input.element().children[0] as HTMLElement;
		// skipping the literal slashes here
		const secondSeg = t.input.element().children[2] as HTMLElement;
		const thirdSeg = t.input.element().children[4] as HTMLElement;

		await expect.element(firstSeg).toMatchTextContent("dd");
		await expect.element(secondSeg).toMatchTextContent("mm");
		await expect.element(thirdSeg).toMatchTextContent("yyyy");
	});

	it("should not show the day period for locales that don't use them", async () => {
		if (navigator.userAgent.includes("WebKit")) {
			expect(true);
			return;
		}
		await setup({
			locale: "en-UK",
			value: calendarDateTime,
		});
		await expectNotExists(page.getByTestId("dayPeriod"));
	});

	it("should show the day period for locales that do use them", async () => {
		await setup({
			value: calendarDateTime,
		});
		await expectExists(page.getByTestId("dayPeriod"));
	});

	it("should focus first segment on label click", async () => {
		const t = await setup();
		await t.label.click();
		await expect.element(t.month).toHaveFocus();
	});

	it("should focus segments on click", async () => {
		const t = await setup({
			value: zonedDateTime,
		});

		const hour = page.getByTestId("hour");
		const minute = page.getByTestId("minute");
		const dayPeriod = page.getByTestId("dayPeriod");
		const timeZoneName = page.getByTestId("timeZoneName");
		const segments = [t.day, t.month, t.year, hour, minute, dayPeriod, timeZoneName];

		for (const segment of segments) {
			await segment.click();
			await expect.element(segment).toHaveFocus();
		}
	});

	it("should increment segment on arrow up", async () => {
		const t = await setup({
			value: zonedDateTime,
			granularity: "second",
		});

		const hour = page.getByTestId("hour");
		const minute = page.getByTestId("minute");
		const second = page.getByTestId("second");

		function cycle(segment: keyof TimeFields | keyof DateFields) {
			return String(zonedDateTime.cycle(segment, 1)[segment]);
		}

		await t.day.click();
		await userEvent.keyboard(kbd.ARROW_UP);
		await expect.element(t.day).toMatchTextContent(cycle("day"));
		await t.month.click();
		await userEvent.keyboard(kbd.ARROW_UP);
		await expect.element(t.month).toMatchTextContent(cycle("month"));
		await t.year.click();
		await userEvent.keyboard(kbd.ARROW_UP);
		await expect.element(t.year).toMatchTextContent(cycle("year"));
		await hour.click();
		await userEvent.keyboard(kbd.ARROW_UP);
		await expect.element(hour).toMatchTextContent("1");
		await minute.click();
		await userEvent.keyboard(kbd.ARROW_UP);
		await expect.element(minute).toMatchTextContent(cycle("minute"));
		await second.click();
		await userEvent.keyboard(kbd.ARROW_UP);
		await expect.element(second).toMatchTextContent(cycle("second"));
	});

	it("should decrement segment on arrow down", async () => {
		const t = await setup({
			value: zonedDateTime,
			granularity: "second",
		});

		const hour = page.getByTestId("hour");
		const minute = page.getByTestId("minute");
		const second = page.getByTestId("second");

		function cycle(segment: keyof TimeFields | keyof DateFields) {
			return String(zonedDateTime.cycle(segment, -1)[segment]);
		}

		await t.day.click();
		await userEvent.keyboard(kbd.ARROW_DOWN);
		await expect.element(t.day).toMatchTextContent(cycle("day"));
		await t.month.click();
		await userEvent.keyboard(kbd.ARROW_DOWN);
		await expect.element(t.month).toMatchTextContent(cycle("month"));
		await t.year.click();
		await userEvent.keyboard(kbd.ARROW_DOWN);
		await expect.element(t.year).toMatchTextContent(cycle("year"));
		await hour.click();
		await userEvent.keyboard(kbd.ARROW_DOWN);
		await expect.element(hour).toMatchTextContent(cycle("hour"));
		await minute.click();
		await userEvent.keyboard(kbd.ARROW_DOWN);
		await expect.element(minute).toMatchTextContent(cycle("minute"));
		await second.click();
		await userEvent.keyboard(kbd.ARROW_DOWN);
		await expect.element(second).toMatchTextContent(cycle("second"));
	});

	it("should navigate segments using the arrow keys", async () => {
		const t = await setup({
			value: zonedDateTime,
			granularity: "second",
		});

		const segments = [
			t.month,
			t.day,
			t.year,
			page.getByTestId("hour"),
			page.getByTestId("minute"),
			page.getByTestId("second"),
			page.getByTestId("dayPeriod"),
			page.getByTestId("timeZoneName"),
		];

		await t.month.click();

		for (const seg of segments) {
			await expect.element(seg).toHaveFocus();
			await userEvent.keyboard(kbd.ARROW_RIGHT);
		}
		await expect.element(page.getByTestId("timeZoneName")).toHaveFocus();

		for (const seg of segments.reverse()) {
			await expect.element(seg).toHaveFocus();
			await userEvent.keyboard(kbd.ARROW_LEFT);
		}
		await expect.element(t.month).toHaveFocus();
	});

	it("should navigate the segments using tab", async () => {
		const t = await setup({
			value: zonedDateTime,
			granularity: "second",
		});

		const segments = [
			t.month,
			t.day,
			t.year,
			page.getByTestId("hour"),
			page.getByTestId("minute"),
			page.getByTestId("second"),
			page.getByTestId("dayPeriod"),
		];

		await t.month.click();

		for (const seg of segments) {
			await expect.element(seg).toHaveFocus();
			await userEvent.keyboard(kbd.TAB);
		}
		await expect.element(page.getByTestId("timeZoneName")).toHaveFocus();

		for (const seg of segments.reverse()) {
			await userEvent.keyboard(kbd.SHIFT_TAB);
			await expect.element(seg).toHaveFocus();
		}
	});

	it("should prevent interaction when `disabled`", async () => {
		const t = await setup({
			value: zonedDateTime,
			granularity: "second",
			disabled: true,
		});

		const segments = [
			t.month,
			t.day,
			t.year,
			page.getByTestId("hour"),
			page.getByTestId("minute"),
			page.getByTestId("second"),
			page.getByTestId("dayPeriod"),
			page.getByTestId("timeZoneName"),
		];

		for (const seg of segments) {
			await expectNotClickableLoc(seg);
		}
	});

	it("should prevent modification when `readonly`", async () => {
		const t = await setup({
			value: zonedDateTime,
			granularity: "second",
			readonly: true,
		});

		const segments = [
			t.month,
			t.day,
			t.year,
			page.getByTestId("hour"),
			page.getByTestId("minute"),
			page.getByTestId("second"),
		];

		for (const segment of segments) {
			await segment.click();
			await expect.element(segment).toHaveFocus();
			await userEvent.keyboard(kbd.ARROW_UP);
			await expect
				.element(segment)
				.toMatchTextContent(
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
		const t = await setup({
			granularity: "second",
			validate: (date) => (date.day === 19 ? "Invalid date" : undefined),
			value: zonedDateTime,
		});

		const segments = [
			t.month,
			t.day,
			t.year,
			page.getByTestId("hour"),
			page.getByTestId("minute"),
			page.getByTestId("second"),
			page.getByTestId("dayPeriod"),
			page.getByTestId("timeZoneName"),
		];

		await t.month.click();
		await userEvent.keyboard(`{2}`);
		await expect.element(t.month).toMatchTextContent("2");
		await expect.element(t.day).toHaveFocus();
		await userEvent.keyboard(`19`);
		await expect.element(t.day).toMatchTextContent("19");
		await expect.element(page.getByTestId("year")).toHaveFocus();
		await userEvent.keyboard(`{1111}`);
		await expect.element(t.year).toMatchTextContent("1111");

		for (const seg of segments) {
			await expect.element(seg).toHaveAttribute("aria-invalid", "true");
			await expect.element(seg).toHaveAttribute("data-invalid");
		}

		await expect.element(t.input).toHaveAttribute("data-invalid");
		await expect.element(t.label).toHaveAttribute("data-invalid");
	});

	it("should adjust the hour cycle with the `hourCycle` prop", async () => {
		await setup({
			value: zonedDateTime,
			hourCycle: 24,
		});
		await expectNotExists(page.getByTestId("dayPeriod"));

		const hour = page.getByTestId("hour");
		await expect.element(hour).toMatchTextContent("12");
		await hour.click();
		await expect.element(hour).toHaveFocus();
		await userEvent.keyboard(kbd.ARROW_UP);
		await expect.element(hour).toMatchTextContent("13");
	});

	it("should override the default displayed segments with the `granularity` prop - `'day'`", async () => {
		const t = await setup({
			value: calendarDateTime,
			granularity: "day",
		});

		const nonDisplayedSegments = ["hour", "minute", "second", "dayPeriod"];
		const displayedSegments = [t.month, t.day, t.year];
		for (const seg of nonDisplayedSegments) {
			await expectNotExists(page.getByTestId(seg));
		}

		for (const seg of displayedSegments) {
			await expect.element(seg).toBeVisible();
		}
	});

	it("should override the default displayed segments with the `granularity` prop - `'minute'`", async () => {
		const t = await setup({
			value: calendarDateTime,
			granularity: "minute",
		});

		const displayedSegments = [
			t.month,
			t.day,
			t.year,
			page.getByTestId("hour"),
			page.getByTestId("minute"),
			page.getByTestId("dayPeriod"),
		];

		await expectNotExists(page.getByTestId("second"));

		for (const seg of displayedSegments) {
			await expect.element(seg).toBeVisible();
		}
	});

	it("should change the value when the dayPeriod segment is changed", async () => {
		const t = await setup({
			value: calendarDateTime,
		});

		await expect.element(t.value).toMatchTextContent("1980-01-20T12:30");
		const dayPeriod = page.getByTestId("dayPeriod");
		await expect.element(dayPeriod).toMatchTextContent("PM");

		await dayPeriod.click();
		await expect.element(dayPeriod).toHaveFocus();
		await userEvent.keyboard(kbd.ARROW_UP);
		await expect.element(dayPeriod).toMatchTextContent("AM");
		await expect.element(t.value).toMatchTextContent("1980-01-20T00:30");
	});

	it("should go all the way through the segment with spamming 3", async () => {
		const t = await setup({
			value: zonedDateTime,
			granularity: "second",
		});

		const { getHour, getMinute, getSecond, getDayPeriod } = getTimeSegments(page.getByTestId);

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
		const t = await setup({
			value: zonedDateTime,
			granularity: "second",
		});

		await t.month.click();
		await expect.element(t.month).toHaveFocus();
		await expect.element(t.month).toMatchTextContent(String(zonedDateTime.month));
		await userEvent.keyboard(`{3}`);
		await expect.element(t.month).toMatchTextContent("3");
	});

	it("should fully overwrite on first click and type - `day`", async () => {
		const t = await setup({
			value: zonedDateTime,
			granularity: "second",
		});

		await t.day.click();
		await expect.element(t.day).toHaveFocus();
		await expect.element(t.day).toMatchTextContent(String(zonedDateTime.day));
		await userEvent.keyboard(`{1}`);
		await expect.element(t.day).toMatchTextContent("1");
	});

	it("should overwrite on first click and type - `year`", async () => {
		const t = await setup({
			value: zonedDateTime,
			granularity: "second",
		});

		await t.year.click();
		await expect.element(t.year).toHaveFocus();
		await expect.element(t.year).toMatchTextContent(String(zonedDateTime.year));
		await userEvent.keyboard(`{1}`);
		await expect.element(t.year).toMatchTextContent("1");
	});

	it("should overwrite on first click and type - `hour`", async () => {
		await setup({
			value: zonedDateTime,
			granularity: "second",
		});
		const hour = page.getByTestId("hour");

		await hour.click();
		await expect.element(hour).toHaveFocus();
		await expect.element(hour).toMatchTextContent(String(zonedDateTime.hour));
		await userEvent.keyboard(`{1}`);
		await expect.element(hour).toMatchTextContent("1");
	});

	it("should overwrite on first click and type - `minute`", async () => {
		await setup({
			value: zonedDateTime,
			granularity: "second",
		});
		const minute = page.getByTestId("minute");

		await minute.click();
		await expect.element(minute).toHaveFocus();
		await expect.element(minute).toMatchTextContent(String(zonedDateTime.minute));
		await userEvent.keyboard(`{1}`);
		await expect.element(minute).toMatchTextContent("1");
	});

	it("should overwrite on first click and type - `second`", async () => {
		await setup({
			value: zonedDateTime,
			granularity: "second",
		});
		const second = page.getByTestId("second");

		await second.click();
		await expect.element(second).toHaveFocus();
		await expect.element(second).toMatchTextContent(String(zonedDateTime.second));
		await userEvent.keyboard(`{1}`);
		await expect.element(second).toMatchTextContent("1");
	});

	it("should move to the previous segment when backspace is pressed while empty - `day`", async () => {
		const t = await setup({
			value: zonedDateTime,
			granularity: "second",
		});

		await t.day.click();
		await expect.element(t.day).toHaveFocus();
		await expect.element(t.day).toMatchTextContent(String(zonedDateTime.day));
		await userEvent.keyboard(kbd.BACKSPACE);
		await expect.element(t.day).toMatchTextContent("2");
		await userEvent.keyboard(kbd.BACKSPACE);
		await expect.element(t.day).toMatchTextContent("dd");
		await expect.element(t.day).toHaveFocus();
		await userEvent.keyboard(kbd.BACKSPACE);
		await expect.element(t.month).toHaveFocus();
	});

	it("should to the previous segment when backspace is pressed while empty - `year`", async () => {
		const t = await setup({
			value: zonedDateTime,
			granularity: "second",
		});

		await t.year.click();
		await expect.element(t.year).toHaveFocus();
		await userEvent.keyboard(kbd.BACKSPACE);
		await expect.element(t.year).toMatchTextContent("198");
		await userEvent.keyboard(kbd.BACKSPACE);
		await expect.element(t.year).toMatchTextContent("19");
		await userEvent.keyboard(kbd.BACKSPACE);
		await expect.element(t.year).toMatchTextContent("1");
		await userEvent.keyboard(kbd.BACKSPACE);
		await expect.element(t.year).toMatchTextContent("yyyy");
		await expect.element(t.year).toHaveFocus();
		await userEvent.keyboard(kbd.BACKSPACE);
		await expect.element(t.day).toHaveFocus();
	});

	it.skip("displays correct timezone with ZonedDateTime value - `now`", async () => {
		await setup({
			value: now("America/Los_Angeles"),
		});

		const timeZone = page.getByTestId("timeZoneName");
		if (isDaylightSavingsTime()) {
			await expect.element(timeZone).toMatchTextContent("PDT");
		} else {
			await expect.element(timeZone).toMatchTextContent("PST");
		}
	});

	it("should display correct timezone with ZonedDateTime value - absolute -> local", async () => {
		await setup({
			value: parseAbsoluteToLocal("2023-10-12T12:30:00Z"),
		});

		const timeZone = page.getByTestId("timeZoneName");
		await expect.element(timeZone).toMatchTextContent(thisTimeZone("2023-10-12T12:30:00Z"));
	});

	it("should not allow changing the dayPeriod without a value", async () => {
		await setup({
			granularity: "second",
		});
		const { getDayPeriod, getHour } = getTimeSegments(page.getByTestId);

		await expect.element(getHour()).toMatchTextContent(TIME_PLACEHOLDER);
		await getDayPeriod().click();
		await userEvent.keyboard(kbd.ARROW_UP);
		await expect.element(getHour()).toMatchTextContent(TIME_PLACEHOLDER);
	});

	it("should handle backspacing the year segment appropriately", async () => {
		const t = await setup({
			granularity: "hour",
		});

		(t.year.element() as HTMLElement).focus();

		await userEvent.keyboard(`{0}`);
		await userEvent.keyboard(`{0}`);
		await userEvent.keyboard(`{9}`);
		await userEvent.keyboard(`{8}`);

		const { getHour } = getTimeSegments(page.getByTestId);
		const hour = getHour();
		await expect.element(hour).toHaveFocus();

		await userEvent.keyboard(kbd.ARROW_LEFT);
		await expect.element(t.year).toHaveFocus();

		await userEvent.keyboard(kbd.BACKSPACE);
		await expect.element(t.year).toMatchTextContent("009");
		await userEvent.keyboard(kbd.BACKSPACE);
		await expect.element(t.year).toMatchTextContent("00");
		await userEvent.keyboard(`{8}`);
		await userEvent.keyboard(`{7}`);
		await expect.element(t.year).toMatchTextContent("0087");
		await expect.element(hour).toHaveFocus();
	});

	it("should keep focus on the year after correcting its first digit", async () => {
		const t = await setup({ granularity: "hour" });
		const { getHour } = getTimeSegments(page.getByTestId);

		await t.year.click();
		await userEvent.keyboard("1");
		await userEvent.keyboard(kbd.BACKSPACE);
		await userEvent.keyboard("2");

		await expect.element(t.year).toMatchTextContent("2");
		await expect.element(t.year).toHaveFocus();
		await expect.element(getHour()).not.toHaveFocus();
	});

	it("should allow going from 12PM -> 12AM without changing the display hour to 0", async () => {
		await setup({
			value: new CalendarDateTime(2023, 10, 12, 12, 30, 0, 0),
		});
		const { getHour, getDayPeriod } = getTimeSegments(page.getByTestId);

		await expect.element(getHour()).toMatchTextContent("12");

		await getDayPeriod().click();
		await userEvent.keyboard(kbd.ARROW_UP);

		await expect.element(getHour()).toMatchTextContent("12");
		await expect.element(getDayPeriod()).toMatchTextContent("AM");
	});

	it("should never allow the hour to be 0 when in a 12 hour cycle", async () => {
		await setup({
			value: new CalendarDateTime(2023, 10, 12, 12, 30, 0, 0),
		});
		const { getHour, getDayPeriod } = getTimeSegments(page.getByTestId);

		await expect.element(getHour()).toMatchTextContent("12");

		await getDayPeriod().click();
		await userEvent.keyboard(kbd.ARROW_UP);

		await expect.element(getHour()).toMatchTextContent("12");
		await expect.element(getDayPeriod()).toMatchTextContent("AM");

		await getHour().click();
		await userEvent.keyboard(kbd.ARROW_UP);
		await expect.element(getHour()).toMatchTextContent("01");
		await expect.element(getHour()).not.toMatchTextContent("12");
		await expect.element(getDayPeriod()).toMatchTextContent("AM");
		await getDayPeriod().click();
		await userEvent.keyboard(kbd.ARROW_UP);
		await expect.element(getHour()).toMatchTextContent("01");
		await expect.element(getDayPeriod()).toMatchTextContent("PM");
		await getHour().click();
		await userEvent.keyboard(kbd.ARROW_DOWN);
		await expect.element(getHour()).toMatchTextContent("12");
		await expect.element(getDayPeriod()).toMatchTextContent("PM");
	});

	it("should add missing leading zeroes to the day,month, and year segments on focusout", async () => {
		const t = await setup({
			value: new CalendarDate(2023, 10, 12),
		});

		await t.month.click();
		await userEvent.keyboard(`{1}`);
		await userEvent.keyboard(kbd.ARROW_RIGHT);
		await expect.element(t.day).toHaveFocus();
		await expect.element(t.month).toMatchTextContent("01");

		await userEvent.keyboard(`{1}`);
		await userEvent.keyboard(kbd.ARROW_RIGHT);
		await expect.element(t.year).toHaveFocus();
		await expect.element(t.day).toMatchTextContent("01");
		await userEvent.keyboard(kbd.BACKSPACE);
		await expect.element(t.year).toMatchTextContent("202");
		await userEvent.keyboard(kbd.ARROW_LEFT);
		await expect.element(t.day).toHaveFocus();
		await expect.element(t.year).toMatchTextContent("0202");
	});

	it("should not intercept number keys when the ctrl or meta key is pressed, allowing default browser behavior", async () => {
		const t = await setup({
			value: new CalendarDate(2023, 10, 12),
		});

		await t.month.click();

		await userEvent.keyboard(`{1}`);
		await userEvent.keyboard(`{2}`);
		await expect.element(t.month).toMatchTextContent("12");

		await userEvent.keyboard(`{Shift>}1{/Shift}`);
		await expect.element(t.month).toMatchTextContent("12");

		await userEvent.keyboard(`{Ctrl>}2{/Ctrl}`);
		await expect.element(t.month).toMatchTextContent("12");

		await userEvent.keyboard(`{Meta>}2{/Meta}`);
		await expect.element(t.month).toMatchTextContent("12");
	});

	it("should not allow typing 24 hour cycle hours when the hourcycle is 12", async () => {
		await setup({
			value: new CalendarDateTime(2023, 10, 12, 12, 30, 0, 0),
		});
		const { getHour, getMinute } = getTimeSegments(page.getByTestId);

		await expect.element(getHour()).toMatchTextContent("12");

		await getHour().click();
		await userEvent.keyboard(`{1}{4}`);
		await expect.element(getMinute()).toHaveFocus();
		await expect.element(getHour()).toMatchTextContent("04");
	});

	it("should not go to zero on arrow navigation with a 12 hour cycle", async () => {
		await setup({
			value: new CalendarDateTime(2023, 10, 12, 12, 30, 0, 0),
		});
		const { getHour, getMinute } = getTimeSegments(page.getByTestId);

		await expect.element(getHour()).toMatchTextContent("12");
		await getHour().click();
		await userEvent.keyboard(`{1}{4}`);
		await expect.element(getMinute()).toHaveFocus();
		await expect.element(getHour()).toMatchTextContent("04");
		await getHour().click();
		await userEvent.keyboard(kbd.ARROW_DOWN);
		await userEvent.keyboard(kbd.ARROW_DOWN);
		await userEvent.keyboard(kbd.ARROW_DOWN);
		await userEvent.keyboard(kbd.ARROW_DOWN);
		await expect.element(getHour()).toMatchTextContent("12");
	});

	it("should allow double zeroes to be set in the minute segment", async () => {
		await setup({
			value: new CalendarDateTime(2023, 10, 12, 12, 30, 0, 0),
		});
		const { getHour, getMinute } = getTimeSegments(page.getByTestId);

		await expect.element(getHour()).toMatchTextContent("12");
		await getMinute().click();
		await userEvent.keyboard(`{0}{0}`);
		await expect.element(getMinute()).toMatchTextContent("00");
	});

	it("should advance to the next segment when typing two zeroes into the minute segment", async () => {
		await setup({
			value: new CalendarDateTime(2023, 10, 12, 12, 30, 0, 0),
		});
		const { getHour, getMinute, getDayPeriod } = getTimeSegments(page.getByTestId);

		await expect.element(getHour()).toMatchTextContent("12");
		await getMinute().click();
		await userEvent.keyboard(`{0}{0}`);
		await expect.element(getDayPeriod()).toHaveFocus();
	});

	it("should allow double zeroes to be set in the second segment", async () => {
		await setup({
			value: new CalendarDateTime(2023, 10, 12, 12, 30, 30, 0),
			granularity: "second",
		});
		const { getSecond } = getTimeSegments(page.getByTestId);

		await expect.element(getSecond()).toMatchTextContent("30");
		await getSecond().click();
		await userEvent.keyboard(`{0}{0}`);
		await expect.element(getSecond()).toMatchTextContent("00");
	});

	it("should advance to the next segment when typing two zeroes into the second segment", async () => {
		await setup({
			value: new CalendarDateTime(2023, 10, 12, 12, 30, 30, 0),
			granularity: "second",
		});
		const { getSecond, getDayPeriod } = getTimeSegments(page.getByTestId);

		await expect.element(getSecond()).toMatchTextContent("30");
		await getSecond().click();
		await userEvent.keyboard(`{0}{0}`);
		await expect.element(getDayPeriod()).toHaveFocus();
	});

	it("should not allow typing characters that are not `a` or `p` into the dayPeriod segment", async () => {
		await setup({
			value: new CalendarDateTime(2023, 10, 12, 12, 30, 30, 0),
			granularity: "second",
		});
		const { getDayPeriod } = getTimeSegments(page.getByTestId);

		await expect.element(getDayPeriod()).toMatchTextContent("PM");
		await getDayPeriod().click();
		await userEvent.keyboard("{i}{d}{k}");
		await expect.element(getDayPeriod()).toMatchTextContent("PM");
	});

	it("should not allow typing non-numeric characters into the date/time segments", async () => {
		const t = await setup({
			value: new CalendarDateTime(2023, 10, 12, 12, 30, 30, 0),
			granularity: "second",
		});
		const { getHour, getMinute, getSecond } = getTimeSegments(page.getByTestId);

		const segments = [t.day, t.month, t.year, getHour(), getMinute(), getSecond()];

		for (const seg of segments) {
			await seg.click();
			await userEvent.keyboard("{i}{d}{k}");
			await expect.element(seg).not.toMatchTextContent("idk");
		}
	});

	it("should allow changing the day period with capital or lowercase `a` and `p`", async () => {
		await setup({
			value: new CalendarDateTime(2023, 10, 12, 12, 30, 30, 0),
			granularity: "second",
		});

		const { getDayPeriod } = getTimeSegments(page.getByTestId);
		const dp = getDayPeriod();

		await expect.element(dp).toMatchTextContent("PM");
		await dp.click();
		await userEvent.keyboard("{Shift>}a{/Shift}");
		await expect.element(dp).toMatchTextContent("AM");
		await userEvent.keyboard("{Shift>}p{/Shift}");
		await expect.element(dp).toMatchTextContent("PM");
		await userEvent.keyboard("a");
		await expect.element(dp).toMatchTextContent("AM");
		await userEvent.keyboard("p");
		await expect.element(dp).toMatchTextContent("PM");
	});

	it("should not allow more than 4 digits in the year segment, even if the user types more", async () => {
		const t = await setup({
			value: new CalendarDate(2023, 10, 12),
		});
		await t.year.click();
		await userEvent.keyboard(kbd.BACKSPACE);
		await userEvent.keyboard(kbd.BACKSPACE);
		await userEvent.keyboard(kbd.BACKSPACE);
		await userEvent.keyboard(kbd.BACKSPACE);
		await expect.element(t.year).toMatchTextContent("yyyy");
		for (const i of "222222") {
			await userEvent.keyboard(i);
		}
		await expect.element(t.year).not.toMatchTextContent("222222");
		await expect.element(t.year).toMatchTextContent("2222");
	});

	it("should render a hidden input if the `name` prop is passed", async () => {
		const t = await setup({
			name: "date-field",
		});
		const hiddenInput = t.container.querySelector("input");
		await expect.element(hiddenInput).not.toBeNull();

		await expect.element(hiddenInput).toHaveAttribute("name", "date-field");
		await expect.element(hiddenInput).toHaveAttribute("aria-hidden", "true");
	});

	it("should not render a hidden input if the name prop isn't passed", async () => {
		const t = await setup();
		const hiddenInput = t.container.querySelector("input");
		await expect.element(hiddenInput).toBeNull();
	});

	it("should keep the value of the hidden input in sync with the fields value", async () => {
		const value = new CalendarDateTime(2023, 10, 12, 12, 30, 30, 0);
		const t = await setup({
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
		await setup({
			name: "hello",
			value,
			hourCycle: 24,
		});

		const { getHour } = getTimeSegments(page.getByTestId);
		const hour = getHour();
		(hour.element() as HTMLElement).focus();
		await userEvent.keyboard("22");
		await expect.element(hour).toMatchTextContent("22");
	});

	it("should allow 00 to be entered when hourCycle is 24", async () => {
		const value = new CalendarDateTime(2023, 10, 12, 12, 30, 30, 0);
		await setup({
			name: "hello",
			value,
			hourCycle: 24,
		});

		const { getHour } = getTimeSegments(page.getByTestId);
		const hour = getHour();
		(hour.element() as HTMLElement).focus();
		await userEvent.keyboard("00");
		await expect.element(hour).toMatchTextContent("00");
	});

	it("navigating to 00 with ArrowUp/Down when hourCycle is 24 should show 00 and not 0", async () => {
		const value = new CalendarDateTime(2023, 10, 12, 1, 30, 30, 0);
		await setup({
			name: "hello",
			value,
			hourCycle: 24,
		});

		const { getHour } = getTimeSegments(page.getByTestId);
		const hour = getHour();
		(hour.element() as HTMLElement).focus();
		await userEvent.keyboard(kbd.ARROW_DOWN);
		await expect.element(hour).toMatchTextContent("00");
		await expect.element(hour).not.toMatchTextContent(/^0$/);
		await userEvent.keyboard(kbd.ARROW_DOWN);
		await expect.element(hour).toMatchTextContent("23");
		await userEvent.keyboard(kbd.ARROW_UP);
		await expect.element(hour).toMatchTextContent("00");
	});

	it("should display correct hour when prepopulated with value and hourCycle is 24", async () => {
		const value = new CalendarDateTime(2023, 10, 12, 0, 30, 30, 0);
		await setup({
			name: "hello",
			value,
			hourCycle: 24,
		});

		const { getHour } = getTimeSegments(page.getByTestId);
		const hour = getHour();
		await expect.element(hour).toMatchTextContent("00");
	});

	it("should reset the segment values when the value is reset", async () => {
		const t = await setup({
			value: new CalendarDateTime(2023, 10, 12, 12, 30, 30, 0),
			granularity: "second",
		});

		const reset = page.getByTestId("reset");

		await reset.click();

		await expect.element(t.day).toMatchTextContent("dd");
		await expect.element(t.month).toMatchTextContent("mm");
		await expect.element(t.year).toMatchTextContent("yyyy");
	});

	it("should allow typing hours 0-23 with non en-US locales that use 24-hour format", async () => {
		if (navigator.userAgent.includes("WebKit")) {
			expect(true);
			return;
		}

		await setup({
			granularity: "minute",
			locale: "de-DE", // german uses 24-hour format
		});

		const { getHour } = getTimeSegments(page.getByTestId);
		const hour = getHour();

		// should not have dayPeriod for 24-hour locales
		await expectNotExists(page.getByTestId("dayPeriod"));

		// test typing single digit hours > 2 (issue: these get clamped to 12-hour format)
		await hour.click();
		await userEvent.keyboard("3");
		await expect.element(hour).toMatchTextContent("03");

		// test typing hours 13-23 (issue: these should work but currently clamp)
		await hour.click();
		await userEvent.keyboard("15");
		await expect.element(hour).toMatchTextContent("15");

		await hour.click();
		await userEvent.keyboard("23");
		await expect.element(hour).toMatchTextContent("23");

		await hour.click();
		await userEvent.keyboard("18");
		await expect.element(hour).toMatchTextContent("18");
	});

	it("should allow arrow key navigation through full 0-23 range with 24-hour locales", async () => {
		if (navigator.userAgent.includes("WebKit")) {
			expect(true);
			return;
		}

		const value = new CalendarDateTime(2023, 10, 12, 14, 30, 30, 0);
		await setup({
			value,
			granularity: "minute",
			locale: "fr-FR", // french uses 24-hour format
		});

		const { getHour } = getTimeSegments(page.getByTestId);
		const hour = getHour();

		await expect.element(hour).toMatchTextContent("14");

		// arrow up should go to 15, not clamp to 12
		await hour.click();
		await userEvent.keyboard(kbd.ARROW_UP);
		await expect.element(hour).toMatchTextContent("15");

		// continue to 23
		for (let i = 0; i < 8; i++) {
			await userEvent.keyboard(kbd.ARROW_UP);
		}
		await expect.element(hour).toMatchTextContent("23");

		// arrow up from 23 should cycle to 00
		await userEvent.keyboard(kbd.ARROW_UP);
		await expect.element(hour).toMatchTextContent("00");

		// arrow down from 00 should go to 23
		await userEvent.keyboard(kbd.ARROW_DOWN);
		await expect.element(hour).toMatchTextContent("23");
	});

	it("should display and allow typing hours > 12 with sv-SE locale (24-hour format)", async () => {
		if (navigator.userAgent.includes("WebKit")) {
			expect(true);
			return;
		}

		const value = new CalendarDateTime(2023, 10, 12, 18, 30, 30, 0);
		await setup({
			value,
			granularity: "minute",
			locale: "sv-SE", // swedish uses 24-hour format
		});

		const { getHour } = getTimeSegments(page.getByTestId);
		const hour = getHour();

		// should display 18, not clamp to 12 or convert to 12-hour format
		await expect.element(hour).toMatchTextContent("18");

		// should not have dayPeriod segment
		await expectNotExists(page.getByTestId("dayPeriod"));

		// typing should allow values > 12
		await hour.click();
		await userEvent.keyboard("20");
		await expect.element(hour).toMatchTextContent("20");

		// arrow down should work correctly (not clamp to 1-12 range)
		await hour.click();
		await userEvent.keyboard(kbd.ARROW_DOWN);
		await expect.element(hour).toMatchTextContent("19");
	});

	it("should not affect day/month segments when backspacing the year", async () => {
		const t = await setup({ value: new CalendarDate(2023, 10, 12) });
		await t.year.click();
		await userEvent.keyboard(kbd.BACKSPACE);
		await expect.element(t.day).toMatchTextContent("12");
		await expect.element(t.month).toMatchTextContent("10");
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
