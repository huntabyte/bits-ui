import { expect, it, vi } from "vitest";
import { render } from "vitest-browser-svelte";
import {
	Time,
	CalendarDateTime,
	type TimeFields,
	parseAbsoluteToLocal,
	toZoned,
	ZonedDateTime,
} from "@internationalized/date";
import { getTestKbd } from "../utils.js";
import TimeFieldTest, { type TimeFieldTestProps } from "./time-field-test.svelte";
import type { TimeValue } from "bits-ui";
import { tick } from "svelte";
import { expectNotExists, setupBrowserUserEvents } from "../browser-utils";
import { page, userEvent } from "@vitest/browser/context";

const kbd = getTestKbd();

const TIME_PLACEHOLDER = "––";

const time = new Time(12, 30, 0, 0);
const calendarDateTime = new CalendarDateTime(1980, 1, 20, 12, 30, 0, 0);
const zonedDateTime = toZoned(calendarDateTime, "America/New_York");

function setup<T extends TimeValue = Time>(props: TimeFieldTestProps<T> = {}) {
	const user = setupBrowserUserEvents();
	// oxlint-disable-next-line no-explicit-any
	const returned = render(TimeFieldTest, { ...(props as any) });

	const getHour = () => page.getByTestId("hour");
	const getMinute = () => page.getByTestId("minute");
	const getSecond = () => page.getByTestId("second");
	const getDayPeriod = () => page.getByTestId("dayPeriod");
	const getTimeZoneName = () => page.getByTestId("timeZoneName");

	const value = page.getByTestId("value");
	const input = page.getByTestId("input");
	const label = page.getByTestId("label");

	const getHiddenInput = () =>
		returned.container.querySelector("input[aria-hidden]") as HTMLInputElement;

	return {
		user,
		value,
		input,
		label,
		getHour,
		getMinute,
		getSecond,
		getDayPeriod,
		getTimeZoneName,
		getHiddenInput,
	};
}

it("should populate segment with value - `Time`", async () => {
	const t = setup({
		value: time,
	});

	await expect.element(t.getHour()).toHaveTextContent(String(time.hour));
	await expect.element(t.getMinute()).toHaveTextContent(String(time.minute));
	await expect.element(t.value).toHaveTextContent(time.toString());
});

it("should populate segment with value - `CalendarDateTime`", async () => {
	const t = setup({
		value: calendarDateTime,
	});

	await expect.element(t.getHour()).toHaveTextContent(String(calendarDateTime.hour));
	await expect.element(t.getMinute()).toHaveTextContent(String(calendarDateTime.minute));
	await expect.element(t.getDayPeriod()).toHaveTextContent("PM");
	await expect.element(t.value).toHaveTextContent(calendarDateTime.toString());
});

it("should populate segment with value - `ZonedDateTime`", async () => {
	const t = setup({
		value: zonedDateTime,
	});

	await expect.element(t.getHour()).toHaveTextContent(String(zonedDateTime.hour));
	await expect.element(t.getMinute()).toHaveTextContent(String(zonedDateTime.minute));
	await expect.element(t.getDayPeriod()).toHaveTextContent("PM");
	await expect.element(t.getTimeZoneName()).toHaveTextContent("EST");
	await expect.element(t.value).toHaveTextContent(zonedDateTime.toString());
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
	await expectNotExists(t.getDayPeriod());
});

it("should show the day period for locales that do use them", async () => {
	const t = setup({
		value: calendarDateTime,
	});
	await expect.element(t.getDayPeriod()).not.toBeNull();
});

it("should focus first segment on label click", async () => {
	const t = setup();
	await t.label.click();
	await expect.element(t.getHour()).toHaveFocus();
});

it("should focus segments on click", async () => {
	const t = setup({
		value: zonedDateTime,
	});

	const dayPeriod = t.getDayPeriod();
	const timeZoneName = t.getTimeZoneName();
	const segments = [t.getHour(), t.getMinute(), dayPeriod, timeZoneName];

	for (const segment of segments) {
		if (segment) {
			await segment.click();
		}
		await expect.element(segment).toHaveFocus();
	}
});

it("should increment segment on arrow up", async () => {
	const t = setup({
		value: zonedDateTime,
		granularity: "second",
	});

	function cycle(segment: keyof TimeFields) {
		return String(zonedDateTime.cycle(segment, 1)[segment]);
	}

	await t.getHour().click();
	await userEvent.keyboard(kbd.ARROW_UP);
	await expect.element(t.getHour()).toHaveTextContent("1");
	await t.getMinute().click();
	await userEvent.keyboard(kbd.ARROW_UP);
	await expect.element(t.getMinute()).toHaveTextContent(cycle("minute"));
	await t.getSecond().click();
	await userEvent.keyboard(kbd.ARROW_UP);
	await expect.element(t.getSecond()).toHaveTextContent(cycle("second"));
});

it("should decrement segment on arrow down", async () => {
	const t = setup({
		value: zonedDateTime,
		granularity: "second",
	});

	function cycle(segment: keyof TimeFields) {
		return String(zonedDateTime.cycle(segment, -1)[segment]);
	}

	await t.getHour().click();
	await userEvent.keyboard(kbd.ARROW_DOWN);
	await expect.element(t.getHour()).toHaveTextContent(cycle("hour"));
	await t.getMinute().click();
	await userEvent.keyboard(kbd.ARROW_DOWN);
	await expect.element(t.getMinute()).toHaveTextContent(cycle("minute"));
	await t.getSecond().click();
	await userEvent.keyboard(kbd.ARROW_DOWN);
	await expect.element(t.getSecond()).toHaveTextContent(cycle("second"));
});

it("should navigate segments using the arrow keys", async () => {
	const t = setup({
		value: zonedDateTime,
		granularity: "second",
	});

	const segments = [
		t.getHour(),
		t.getMinute(),
		t.getSecond(),
		t.getDayPeriod(),
		t.getTimeZoneName(),
	];

	await t.getHour().click();

	for (const seg of segments) {
		await expect.element(seg).toHaveFocus();
		await userEvent.keyboard(kbd.ARROW_RIGHT);
	}
	await expect.element(t.getTimeZoneName()).toHaveFocus();

	for (const seg of segments.reverse()) {
		await expect.element(seg).toHaveFocus();
		await userEvent.keyboard(kbd.ARROW_LEFT);
	}
	await expect.element(t.getHour()).toHaveFocus();
});

it("should navigate the segments using tab", async () => {
	const t = setup({
		value: zonedDateTime,
		granularity: "second",
	});

	const segments = [t.getHour(), t.getMinute(), t.getSecond(), t.getDayPeriod()];

	await t.getHour().click();

	for (const seg of segments) {
		await expect.element(seg).toHaveFocus();
		await userEvent.keyboard(kbd.TAB);
	}
	await expect.element(t.getTimeZoneName()).toHaveFocus();

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
		t.getHour(),
		t.getMinute(),
		t.getSecond(),
		t.getDayPeriod(),
		t.getTimeZoneName(),
	];

	for (const seg of segments) {
		await seg.click({ force: true });
		await expect.element(seg).not.toHaveFocus();
	}
});

it("should prevent modification when `readonly`", async () => {
	const t = setup({
		value: zonedDateTime,
		granularity: "second",
		readonly: true,
	});

	const segments = [t.getHour(), t.getMinute(), t.getSecond()];

	for (const segment of segments) {
		await segment.click();
		await expect.element(segment).toHaveFocus();
		await userEvent.keyboard(kbd.ARROW_UP);
		await expect
			.element(segment)
			.toHaveTextContent(
				String(
					zonedDateTime[
						(segment.element() as HTMLElement).dataset.segment as keyof TimeFields
					]
				)
			);
	}
});

it("should marks the field as invalid if the value is invalid", async () => {
	const t = setup({
		granularity: "second",
		validate: (time) => (time.hour === 13 ? "Invalid time" : undefined),
		value: zonedDateTime,
	});

	await t.getHour().click();
	await userEvent.keyboard(`{1}`);
	await expect.element(t.getHour()).toHaveTextContent("1");
	await userEvent.keyboard(`{3}`);
	await expect.element(t.getHour()).toHaveTextContent("03");
});

it("should adjust the hour cycle with the `hourCycle` prop", async () => {
	const t = setup({
		value: zonedDateTime,
		hourCycle: 24,
	});

	await expectNotExists(t.getDayPeriod());
	await expect.element(t.getHour()).toHaveTextContent("12");
	await t.getHour().click();
	await expect.element(t.getHour()).toHaveFocus();
	await userEvent.keyboard(kbd.ARROW_UP);
	await expect.element(t.getHour()).toHaveTextContent("13");
});

it("should override the default displayed segments with the `granularity` prop - `'hour'`", async () => {
	const t = setup({
		value: calendarDateTime,
		granularity: "hour",
	});

	const nonDisplayedSegments = ["minute", "second"];
	const displayedSegments = [t.getHour()];
	for (const seg of nonDisplayedSegments) {
		await expectNotExists(page.getByTestId(seg));
	}

	for (const seg of displayedSegments) {
		await expect.element(seg).toBeVisible();
	}
});

it("should override the default displayed segments with the `granularity` prop - `'second'`", async () => {
	const t = setup({
		value: calendarDateTime,
		granularity: "second",
	});

	const displayedSegments = [t.getHour(), t.getMinute(), t.getSecond(), t.getDayPeriod()];

	for (const seg of displayedSegments) {
		await expect.element(seg).toBeVisible();
	}
});

it("should change the value when the dayPeriod segment is changed", async () => {
	const t = setup({
		value: calendarDateTime,
	});

	await expect.element(t.value).toHaveTextContent("1980-01-20T12:30");
	await expect.element(t.getDayPeriod()).toHaveTextContent("PM");

	await t.getDayPeriod().click();
	await expect.element(t.getDayPeriod()).toHaveFocus();
	await userEvent.keyboard(kbd.ARROW_UP);
	await expect.element(t.getDayPeriod()).toHaveTextContent("AM");
	await expect.element(t.value).toHaveTextContent("1980-01-20T00:30");
});

it("should go all the way through the segment with spamming 3", async () => {
	const t = setup({
		value: zonedDateTime,
		granularity: "second",
	});

	await t.getHour().click();
	await userEvent.keyboard(`{3}`);
	await expect.element(t.getMinute()).toHaveFocus();
	await userEvent.keyboard(`{3}`);
	await userEvent.keyboard(`{3}`);
	await expect.element(t.getSecond()).toHaveFocus();
	await userEvent.keyboard(`{3}`);
	await userEvent.keyboard(`{3}`);
	await expect.element(t.getDayPeriod()).toHaveFocus();
});

it("should overwrite on first click and type - `hour`", async () => {
	const t = setup({
		value: zonedDateTime,
		granularity: "second",
	});

	await t.getHour().click();
	await expect.element(t.getHour()).toHaveFocus();
	await expect.element(t.getHour()).toHaveTextContent(String(zonedDateTime.hour));
	await userEvent.keyboard(`{1}`);
	await expect.element(t.getHour()).toHaveTextContent("1");
});

it("should overwrite on first click and type - `minute`", async () => {
	const t = setup({
		value: zonedDateTime,
		granularity: "second",
	});

	await t.getMinute().click();
	await expect.element(t.getMinute()).toHaveFocus();
	await expect.element(t.getMinute()).toHaveTextContent(String(zonedDateTime.minute));
	await userEvent.keyboard(`{1}`);
	await expect.element(t.getMinute()).toHaveTextContent("1");
});

it("should overwrite on first click and type - `second`", async () => {
	const t = setup({
		value: zonedDateTime,
		granularity: "second",
	});

	await t.getSecond().click();
	await expect.element(t.getSecond()).toHaveFocus();
	await expect.element(t.getSecond()).toHaveTextContent(String(zonedDateTime.second));
	await userEvent.keyboard(`{1}`);
	await expect.element(t.getSecond()).toHaveTextContent("1");
});

it("should move to the previous segment when backspace is pressed while empty - `minute`", async () => {
	const t = setup({
		value: zonedDateTime,
		granularity: "second",
	});

	await t.getMinute().click();
	await expect.element(t.getMinute()).toHaveFocus();
	await expect.element(t.getMinute()).toHaveTextContent(String(zonedDateTime.minute));
	await userEvent.keyboard(kbd.BACKSPACE);
	await expect.element(t.getMinute()).toHaveTextContent("3");
	await userEvent.keyboard(kbd.BACKSPACE);
	await expect.element(t.getMinute()).toHaveTextContent(TIME_PLACEHOLDER);
	await expect.element(t.getMinute()).toHaveFocus();
	await userEvent.keyboard(kbd.BACKSPACE);
	await expect.element(t.getHour()).toHaveFocus();
});

it("should to the previous segment when backspace is pressed while empty - `second`", async () => {
	const t = setup({
		value: zonedDateTime,
		granularity: "second",
	});

	await t.getSecond().click();
	await expect.element(t.getSecond()).toHaveFocus();
	await userEvent.keyboard(kbd.BACKSPACE);
	await expect.element(t.getSecond()).toHaveTextContent(TIME_PLACEHOLDER);
	await expect.element(t.getSecond()).toHaveFocus();
	await userEvent.keyboard(kbd.BACKSPACE);
	await expect.element(t.getMinute()).toHaveFocus();
});

it("displays correct timezone with ZonedDateTime value - absolute -> local", async () => {
	const t = setup({
		value: parseAbsoluteToLocal("2023-10-12T12:30:00Z"),
	});

	await expect
		.element(t.getTimeZoneName())
		.toHaveTextContent(thisTimeZone("2023-10-12T12:30:00Z"));
});

it("should not allow changing the dayPeriod without a value", async () => {
	const t = setup({
		granularity: "second",
	});

	await expect.element(t.getHour()).toHaveTextContent(TIME_PLACEHOLDER);
	await t.getDayPeriod().click();
	await userEvent.keyboard(kbd.ARROW_UP);
	await expect.element(t.getHour()).toHaveTextContent(TIME_PLACEHOLDER);
});

it("should allow going from 12PM -> 12AM without changing the display hour to 0", async () => {
	const t = setup({
		value: new CalendarDateTime(2023, 10, 12, 12, 30, 0, 0),
	});

	await expect.element(t.getHour()).toHaveTextContent("12");

	await t.getDayPeriod().click();
	await userEvent.keyboard(kbd.ARROW_UP);

	await expect.element(t.getHour()).toHaveTextContent("12");
	await expect.element(t.getDayPeriod()).toHaveTextContent("AM");
});

it("should never allow the hour to be 0 when in a 12 hour cycle", async () => {
	const t = setup({
		value: new CalendarDateTime(2023, 10, 12, 12, 30, 0, 0),
	});

	await expect.element(t.getHour()).toHaveTextContent("12");

	await t.getDayPeriod().click();
	await userEvent.keyboard(kbd.ARROW_UP);

	await expect.element(t.getHour()).toHaveTextContent("12");
	await expect.element(t.getDayPeriod()).toHaveTextContent("AM");

	await t.getHour().click();
	await userEvent.keyboard(kbd.ARROW_UP);
	await expect.element(t.getHour()).toHaveTextContent("01");
	await expect.element(t.getHour()).not.toHaveTextContent("12");
	await expect.element(t.getDayPeriod()).toHaveTextContent("AM");
	await t.getDayPeriod().click();
	await userEvent.keyboard(kbd.ARROW_UP);
	await expect.element(t.getHour()).toHaveTextContent("01");
	await expect.element(t.getDayPeriod()).toHaveTextContent("PM");
	await t.getHour().click();
	await userEvent.keyboard(kbd.ARROW_DOWN);
	await expect.element(t.getHour()).toHaveTextContent("12");
	await expect.element(t.getDayPeriod()).toHaveTextContent("PM");
});

it("should add missing leading zeroes to the hour and minute segments on focusout", async () => {
	const t = setup({
		value: new Time(12, 30, 0, 0),
	});

	await t.getHour().click();
	await userEvent.keyboard(`{1}`);
	await userEvent.keyboard(kbd.ARROW_RIGHT);
	await expect.element(t.getMinute()).toHaveFocus();
	await expect.element(t.getHour()).toHaveTextContent("01");

	await userEvent.keyboard(`{1}`);
	await userEvent.keyboard(kbd.ARROW_LEFT);
	await expect.element(t.getHour()).toHaveFocus();
	await expect.element(t.getHour()).toHaveTextContent("01");
});

it("should not intercept number keys when the ctrl or meta key is pressed, allowing default browser behavior", async () => {
	const t = setup({
		value: new Time(12, 30, 0, 0),
	});

	await t.getHour().click();
	await userEvent.keyboard(`{1}`);
	await userEvent.keyboard(`{2}`);
	await expect.element(t.getHour()).toHaveTextContent("12");

	await userEvent.keyboard(`{Shift>}1{/Shift}`);
	await expect.element(t.getHour()).toHaveTextContent("12");

	await userEvent.keyboard(`{Ctrl>}2{/Ctrl}`);
	await expect.element(t.getHour()).toHaveTextContent("12");

	await userEvent.keyboard(`{Meta>}2{/Meta}`);
	await expect.element(t.getHour()).toHaveTextContent("12");
});

it("should not allow typing 24 hour cycle hours when the hourcycle is 12", async () => {
	const t = setup({
		value: new CalendarDateTime(2023, 10, 12, 12, 30, 0, 0),
	});

	await expect.element(t.getHour()).toHaveTextContent("12");
	await t.getHour().click();
	await userEvent.keyboard(`{1}{4}`);
	await expect.element(t.getMinute()).toHaveFocus();
	await expect.element(t.getHour()).toHaveTextContent("04");
});

it("should not go to zero on arrow navigation with a 12 hour cycle", async () => {
	const t = setup({
		value: new CalendarDateTime(2023, 10, 12, 12, 30, 0, 0),
	});

	await expect.element(t.getHour()).toHaveTextContent("12");
	await t.getHour().click();
	await userEvent.keyboard(`{1}{4}`);
	await expect.element(t.getMinute()).toHaveFocus();
	await expect.element(t.getHour()).toHaveTextContent("04");
	await t.getHour().click();
	await userEvent.keyboard(kbd.ARROW_DOWN);
	await userEvent.keyboard(kbd.ARROW_DOWN);
	await expect.element(t.getHour()).toHaveTextContent("02");
});

it("should allow double zeroes to be set in the minute segment", async () => {
	const t = setup({
		value: new CalendarDateTime(2023, 10, 12, 12, 30, 0, 0),
	});

	await expect.element(t.getHour()).toHaveTextContent("12");
	await t.getMinute().click();
	await userEvent.keyboard(`{0}{0}`);
	await expect.element(t.getMinute()).toHaveTextContent("00");
});

it("should advance to the next segment when typing two zeroes into the minute segment", async () => {
	const t = setup({
		value: new CalendarDateTime(2023, 10, 12, 12, 30, 0, 0),
	});

	await expect.element(t.getHour()).toHaveTextContent("12");
	await t.getMinute().click();
	await userEvent.keyboard(`{0}{0}`);
	await expect.element(t.getDayPeriod()).toHaveFocus();
});

it("should allow double zeroes to be set in the second segment", async () => {
	const t = setup({
		value: new CalendarDateTime(2023, 10, 12, 12, 30, 30, 0),
		granularity: "second",
	});

	await expect.element(t.getSecond()).toHaveTextContent("30");
	await t.getSecond().click();
	await userEvent.keyboard(`{0}{0}`);
	await expect.element(t.getSecond()).toHaveTextContent("00");
});

it("should advance to the next segment when typing two zeroes into the second segment", async () => {
	const t = setup({
		value: new CalendarDateTime(2023, 10, 12, 12, 30, 30, 0),
		granularity: "second",
	});

	await expect.element(t.getSecond()).toHaveTextContent("30");
	await t.getSecond().click();
	await userEvent.keyboard(`{0}{0}`);
	await expect.element(t.getDayPeriod()).toHaveFocus();
});

it("should not allow typing characters that are not `a` or `p` into the dayPeriod segment", async () => {
	const t = setup({
		value: new CalendarDateTime(2023, 10, 12, 12, 30, 30, 0),
		granularity: "second",
	});

	await expect.element(t.getDayPeriod()).toHaveTextContent("PM");
	await t.getDayPeriod().click();
	await userEvent.keyboard("{i}{d}{k}");
	await expect.element(t.getDayPeriod().element() as HTMLElement).toHaveTextContent("PM");
});

it("should not allow typing non-numeric characters into the time segments", async () => {
	const t = setup({
		value: new CalendarDateTime(2023, 10, 12, 12, 30, 30, 0),
		granularity: "second",
	});

	const segments = [t.getHour(), t.getMinute(), t.getSecond()];

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

	await expect.element(t.getDayPeriod()).toHaveTextContent("PM");
	await t.getDayPeriod().click();
	await userEvent.keyboard("{Shift>}a{/Shift}");
	await expect.element(t.getDayPeriod()).toHaveTextContent("AM");
	await userEvent.keyboard("{Shift>}p{/Shift}");
	await expect.element(t.getDayPeriod()).toHaveTextContent("PM");
	await userEvent.keyboard("a");
	await expect.element(t.getDayPeriod()).toHaveTextContent("AM");
	await userEvent.keyboard("p");
	await expect.element(t.getDayPeriod()).toHaveTextContent("PM");
});

it("should render a hidden input if the `name` prop is passed", async () => {
	const t = setup({
		name: "time-field",
	});
	await expect.element(t.getHiddenInput()).not.toBeNull();
	await expect.element(t.getHiddenInput()).toHaveAttribute("name", "time-field");
	await expect.element(t.getHiddenInput()).toHaveAttribute("aria-hidden", "true");
});

it("should not render a hidden input if the name prop isn't passed", async () => {
	const t = setup();
	await expect.element(t.getHiddenInput()).toBeNull();
});

it("should keep the value of the hidden input in sync with the fields value", async () => {
	const value = new CalendarDateTime(2023, 10, 12, 12, 30, 30, 0);
	const t = setup({
		name: "hello",
		value,
	});

	await tick();

	await expect.element(t.getHiddenInput()).not.toBeNull();

	await expect.element(t.getHiddenInput()).toHaveValue(extractTime(value));

	await t.getHour().click();
	await userEvent.keyboard(kbd.ARROW_UP);
	await expect.element(t.getHiddenInput()).toHaveValue(extractTime(value.add({ hours: 1 })));
});

it("should handle 24 hour time appropriately", async () => {
	const value = new CalendarDateTime(2023, 10, 12, 12, 30, 30, 0);
	const t = setup({
		name: "hello",
		value,
		hourCycle: 24,
	});

	await t.getHour().click();
	await userEvent.keyboard("22");
	await expect.element(t.getHour()).toHaveTextContent("22");
});

it("should allow 00 to be entered when hourCycle is 24", async () => {
	const value = new CalendarDateTime(2023, 10, 12, 12, 30, 30, 0);
	const t = setup({
		name: "hello",
		value,
		hourCycle: 24,
	});

	await t.getHour().click();
	await userEvent.keyboard("00");
	await expect.element(t.getHour()).toHaveTextContent("00");
});

it("navigating to 00 with ArrowUp/Down when hourCycle is 24 should show 00 and not 0", async () => {
	const value = new CalendarDateTime(2023, 10, 12, 1, 30, 30, 0);
	const t = setup({
		name: "hello",
		value,
		hourCycle: 24,
	});

	await t.getHour().click();
	await userEvent.keyboard(kbd.ARROW_DOWN);
	await expect.element(t.getHour()).toHaveTextContent("00");
	expect(t.getHour().element().textContent).not.toBe("0");
	await userEvent.keyboard(kbd.ARROW_DOWN);
	await expect.element(t.getHour()).toHaveTextContent("23");
	await userEvent.keyboard(kbd.ARROW_UP);
	await expect.element(t.getHour()).toHaveTextContent("00");
});

it("should display correct hour when prepopulated with value and hourCycle is 24", async () => {
	const value = new CalendarDateTime(2023, 10, 12, 0, 30, 30, 0);
	const t = setup({
		name: "hello",
		value,
		hourCycle: 24,
	});

	await expect.element(t.getHour()).toHaveTextContent("00");
});

it("should reset the segment values when the value is reset", async () => {
	const t = setup({
		value: new CalendarDateTime(2023, 10, 12, 12, 30, 30, 0),
		granularity: "second",
	});

	await page.getByTestId("reset").click();

	await expect.element(t.getHour()).toHaveTextContent(TIME_PLACEHOLDER);
	await expect.element(t.getMinute()).toHaveTextContent(TIME_PLACEHOLDER);
});

it("should hide timezone when hideTimeZone is true", async () => {
	setup({
		value: zonedDateTime,
		hideTimeZone: true,
	});

	await expectNotExists(page.getByTestId("timeZoneName"));
});

it("should show timezone when hideTimeZone is false", async () => {
	const t = setup({
		value: zonedDateTime,
		hideTimeZone: false,
	});

	await expect.element(t.getTimeZoneName()).not.toBeNull();
});

it("should type the onValueChange callback with the type of the provided value (CalendarDateTime)", async () => {
	// calendar date time
	let changedValue: CalendarDateTime | undefined;
	const t = setup({
		value: calendarDateTime,
		// v should be CalendarDateTime | undefined,
		onValueChange: (v) => {
			changedValue = v;
		},
	});

	// change the value and then we will test/assert that the type is correct
	await t.getHour().click();
	await userEvent.keyboard(kbd.ARROW_UP);

	expect(changedValue).toBeDefined();
	if (changedValue) {
		// @ts-expect-error - this is expected to error since it's a `CalendarDateTime` type
		expect(changedValue.timeZone).toBeUndefined();
		expect(changedValue.day).toBeDefined();
		expect(changedValue).toBeInstanceOf(CalendarDateTime);
	}
});

it("should type the onValueChange callback with the type of the provided value (Time)", async () => {
	// time
	let changedValue: Time | undefined;
	const t = setup({
		value: new Time(12, 30, 0),
		// v should be Time | undefined
		onValueChange: (v) => {
			changedValue = v;
		},
	});

	await t.getHour().click();
	await userEvent.keyboard(kbd.ARROW_UP);

	expect(changedValue).toBeDefined();
	if (changedValue) {
		expect(changedValue.hour).toBeDefined();
		// @ts-expect-error - this is expected to error since it's a `Time` type
		expect(changedValue.day).toBeUndefined();
		expect(changedValue).toBeInstanceOf(Time);
	}
});

it("should type the onValueChange callback with the type of the provided value (ZonedDateTime)", async () => {
	// Test another type error case
	let changedValue: ZonedDateTime | undefined;
	const t = setup({
		value: toZoned(calendarDateTime, "America/New_York"),
		// v should be ZonedDateTime | undefined
		onValueChange: (v) => {
			changedValue = v;
		},
	});

	await t.getHour().click();
	await userEvent.keyboard(kbd.ARROW_UP);

	expect(changedValue).toBeDefined();
	if (changedValue) {
		expect(changedValue.hour).toBeDefined();
		expect(changedValue.timeZone).toBeDefined();
		expect(changedValue).toBeInstanceOf(ZonedDateTime);
	}
});

it("should respect the minValue prop", async () => {
	const mockOnInvalid = vi.fn();

	const t = setup({
		minValue: new Time(12, 30, 0),
		value: new Time(12, 30, 0),
		onInvalid: mockOnInvalid,
	});

	await t.getHour().click();
	await userEvent.keyboard(kbd.ARROW_DOWN);
	await expect.element(t.getHour()).toHaveTextContent("11");
	expect(mockOnInvalid).toHaveBeenCalledWith("min", undefined);

	await expect.element(t.getHour()).toHaveAttribute("aria-invalid", "true");
	await expect.element(t.input).toHaveAttribute("data-invalid");
	await expect.element(t.label).toHaveAttribute("data-invalid");
});

it("should respect the maxValue prop", async () => {
	const mockOnInvalid = vi.fn();

	const t = setup({
		maxValue: new Time(12, 30, 0),
		value: new Time(12, 30, 0),
		onInvalid: mockOnInvalid,
	});

	await t.getHour().click();
	await userEvent.keyboard(kbd.ARROW_UP);
	await expect.element(t.getHour()).toHaveTextContent("01");
	expect(mockOnInvalid).toHaveBeenCalledWith("max", undefined);

	await expect.element(t.getHour()).toHaveAttribute("aria-invalid", "true");
	await expect.element(t.input).toHaveAttribute("data-invalid");
	await expect.element(t.label).toHaveAttribute("data-invalid");
});

it("should respect readonlySegments prop", async () => {
	const t = setup({
		value: new Time(12, 30, 0),
		readonlySegments: ["hour", "minute"],
		granularity: "second",
	});

	await t.getHour().click();
	await userEvent.keyboard(kbd.ARROW_UP);
	await expect.element(t.getHour()).toHaveTextContent("12");

	await t.getMinute().click();
	await userEvent.keyboard(kbd.ARROW_UP);
	await expect.element(t.getMinute()).toHaveTextContent("30");

	await t.getSecond().click();
	await userEvent.keyboard(kbd.ARROW_UP);
	await expect.element(t.getSecond()).toHaveTextContent("01");
});

it("should default to a 24 hour clock for locales that use it", async () => {
	// skip if webkit

	if (navigator.userAgent.includes("WebKit")) {
		expect(true);
		return;
	}

	const t = setup({
		locale: "en-UK",
		value: new Time(13, 30, 0),
	});

	await vi.waitFor(() => expect.element(t.getHour()).toHaveTextContent("13"));
});

it("should allow changing the day period even if no value is populated yet", async () => {
	const t = setup();

	await expect.element(t.getDayPeriod()).toHaveTextContent("AM");
	await t.getDayPeriod().click();

	await userEvent.keyboard(kbd.p);
	await expect.element(t.getDayPeriod()).toHaveTextContent("PM");
});

it("should not adjust the hour when the day period is changed", async () => {
	const t = setup();

	await t.getDayPeriod().click();
	await userEvent.keyboard(kbd.ARROW_UP);
	await userEvent.keyboard(kbd.ARROW_UP);
	await expect.element(t.getDayPeriod()).toHaveTextContent("AM");
	await expect.element(t.getHour()).toHaveTextContent(TIME_PLACEHOLDER);
});

function thisTimeZone(date: string): string {
	const timezone =
		Intl.DateTimeFormat(undefined, { timeZoneName: "short" })
			.formatToParts(new Date(date))
			.find((p) => p.type === "timeZoneName")?.value ?? "";
	return timezone;
}

function extractTime(time: TimeValue): string {
	if (time instanceof Time) {
		return time.toString();
	}
	return new Time(time.hour, time.minute, time.second).toString();
}
