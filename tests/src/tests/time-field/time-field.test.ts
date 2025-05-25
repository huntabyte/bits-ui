import { render } from "@testing-library/svelte/svelte5";
import { axe } from "jest-axe";
import { it, vi } from "vitest";
import {
	Time,
	CalendarDateTime,
	type TimeFields,
	parseAbsoluteToLocal,
	toZoned,
	ZonedDateTime,
} from "@internationalized/date";
import { getTestKbd, setupUserEvents } from "../utils.js";
import TimeFieldTest, { type TimeFieldTestProps } from "./time-field-test.svelte";
import type { TimeValue } from "bits-ui";
import { tick } from "svelte";

const kbd = getTestKbd();

const TIME_PLACEHOLDER = "––";

const time = new Time(12, 30, 0, 0);
const calendarDateTime = new CalendarDateTime(1980, 1, 20, 12, 30, 0, 0);
const zonedDateTime = toZoned(calendarDateTime, "America/New_York");

function setup<T extends TimeValue = Time>(props: TimeFieldTestProps<T> = {}) {
	const user = setupUserEvents();
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	const returned = render(TimeFieldTest, { ...(props as any) });

	const getHour = () => returned.queryByTestId("hour") as HTMLElement;
	const getMinute = () => returned.queryByTestId("minute") as HTMLElement;
	const getSecond = () => returned.queryByTestId("second") as HTMLElement;
	const getDayPeriod = () => returned.queryByTestId("dayPeriod") as HTMLElement;
	const getTimeZoneName = () => returned.queryByTestId("timeZoneName") as HTMLElement;

	const value = returned.getByTestId("value");
	const input = returned.getByTestId("input");
	const label = returned.getByTestId("label");

	const getHiddenInput = () =>
		returned.container.querySelector("input[aria-hidden]") as HTMLInputElement;

	return {
		...returned,
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

it("should have no axe violations", async () => {
	const { container } = setup();
	expect(await axe(container)).toHaveNoViolations();
});

it("should populate segment with value - `Time`", async () => {
	const t = setup({
		value: time,
	});

	expect(t.getHour()).toHaveTextContent(String(time.hour));
	expect(t.getMinute()).toHaveTextContent(String(time.minute));
	expect(t.value).toHaveTextContent(time.toString());
});

it("should populate segment with value - `CalendarDateTime`", async () => {
	const t = setup({
		value: calendarDateTime,
	});

	expect(t.getHour()).toHaveTextContent(String(calendarDateTime.hour));
	expect(t.getMinute()).toHaveTextContent(String(calendarDateTime.minute));
	expect(t.getDayPeriod()).toHaveTextContent("PM");
	expect(t.value).toHaveTextContent(calendarDateTime.toString());
});

it("should populate segment with value - `ZonedDateTime`", async () => {
	const t = setup({
		value: zonedDateTime,
	});

	expect(t.getHour()).toHaveTextContent(String(zonedDateTime.hour));
	expect(t.getMinute()).toHaveTextContent(String(zonedDateTime.minute));
	expect(t.getDayPeriod()).toHaveTextContent("PM");
	expect(t.getTimeZoneName()).toHaveTextContent("EST");
	expect(t.value).toHaveTextContent(zonedDateTime.toString());
});

it("should not show the day period for locales that don't use them", async () => {
	const t = setup({
		locale: "en-UK",
		value: calendarDateTime,
	});
	expect(t.getDayPeriod()).toBeNull();
});

it("should show the day period for locales that do use them", async () => {
	const t = setup({
		value: calendarDateTime,
	});
	expect(t.getDayPeriod()).not.toBeNull();
});

it("should focus first segment on label click", async () => {
	const t = setup();
	await t.user.click(t.label);
	expect(t.getHour()).toHaveFocus();
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
			await t.user.click(segment);
		}
		expect(segment).toHaveFocus();
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

	await t.user.click(t.getHour());
	await t.user.keyboard(kbd.ARROW_UP);
	expect(t.getHour()).toHaveTextContent("1");
	await t.user.click(t.getMinute());
	await t.user.keyboard(kbd.ARROW_UP);
	expect(t.getMinute()).toHaveTextContent(cycle("minute"));
	await t.user.click(t.getSecond());
	await t.user.keyboard(kbd.ARROW_UP);
	expect(t.getSecond()).toHaveTextContent(cycle("second"));
});

it("should decrement segment on arrow down", async () => {
	const t = setup({
		value: zonedDateTime,
		granularity: "second",
	});

	function cycle(segment: keyof TimeFields) {
		return String(zonedDateTime.cycle(segment, -1)[segment]);
	}

	await t.user.click(t.getHour());
	await t.user.keyboard(kbd.ARROW_DOWN);
	expect(t.getHour()).toHaveTextContent(cycle("hour"));
	await t.user.click(t.getMinute());
	await t.user.keyboard(kbd.ARROW_DOWN);
	expect(t.getMinute()).toHaveTextContent(cycle("minute"));
	await t.user.click(t.getSecond());
	await t.user.keyboard(kbd.ARROW_DOWN);
	expect(t.getSecond()).toHaveTextContent(cycle("second"));
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

	await t.user.click(t.getHour());

	for (const seg of segments) {
		expect(seg).toHaveFocus();
		await t.user.keyboard(kbd.ARROW_RIGHT);
	}
	expect(t.getTimeZoneName()).toHaveFocus();

	for (const seg of segments.reverse()) {
		expect(seg).toHaveFocus();
		await t.user.keyboard(kbd.ARROW_LEFT);
	}
	expect(t.getHour()).toHaveFocus();
});

it("should navigate the segments using tab", async () => {
	const t = setup({
		value: zonedDateTime,
		granularity: "second",
	});

	const segments = [t.getHour(), t.getMinute(), t.getSecond(), t.getDayPeriod()];

	await t.user.click(t.getHour());

	for (const seg of segments) {
		expect(seg).toHaveFocus();
		await t.user.keyboard(kbd.TAB);
	}
	expect(t.getTimeZoneName()).toHaveFocus();

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
		t.getHour(),
		t.getMinute(),
		t.getSecond(),
		t.getDayPeriod(),
		t.getTimeZoneName(),
	];

	for (const seg of segments) {
		await t.user.click(seg);
		expect(seg).not.toHaveFocus();
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
		await t.user.click(segment);
		expect(segment).toHaveFocus();
		await t.user.keyboard(kbd.ARROW_UP);
		expect(segment).toHaveTextContent(
			String(zonedDateTime[segment.dataset.segment as keyof TimeFields])
		);
	}
});

it("should marks the field as invalid if the value is invalid", async () => {
	const t = setup({
		granularity: "second",
		validate: (time) => (time.hour === 13 ? "Invalid time" : undefined),
		value: zonedDateTime,
	});

	await t.user.click(t.getHour());
	await t.user.keyboard(`{1}`);
	expect(t.getHour()).toHaveTextContent("1");
	await t.user.keyboard(`{3}`);
	expect(t.getHour()).toHaveTextContent("03");
});

it("should adjust the hour cycle with the `hourCycle` prop", async () => {
	const t = setup({
		value: zonedDateTime,
		hourCycle: 24,
	});

	expect(t.getDayPeriod()).toBeNull();
	expect(t.getHour()).toHaveTextContent("12");
	await t.user.click(t.getHour());
	expect(t.getHour()).toHaveFocus();
	await t.user.keyboard(kbd.ARROW_UP);
	expect(t.getHour()).toHaveTextContent("13");
});

it("should override the default displayed segments with the `granularity` prop - `'hour'`", async () => {
	const t = setup({
		value: calendarDateTime,
		granularity: "hour",
	});

	const nonDisplayedSegments = ["minute", "second"];
	const displayedSegments = [t.getHour()];
	for (const seg of nonDisplayedSegments) {
		expect(t.queryByTestId(seg)).toBeNull();
	}

	for (const seg of displayedSegments) {
		expect(seg).toBeVisible();
	}
});

it("should override the default displayed segments with the `granularity` prop - `'second'`", async () => {
	const t = setup({
		value: calendarDateTime,
		granularity: "second",
	});

	const displayedSegments = [t.getHour(), t.getMinute(), t.getSecond(), t.getDayPeriod()];

	for (const seg of displayedSegments) {
		expect(seg).toBeVisible();
	}
});

it("should change the value when the dayPeriod segment is changed", async () => {
	const t = setup({
		value: calendarDateTime,
	});

	expect(t.value).toHaveTextContent("1980-01-20T12:30");
	expect(t.getDayPeriod()).toHaveTextContent("PM");

	await t.user.click(t.getDayPeriod());
	expect(t.getDayPeriod()).toHaveFocus();
	await t.user.keyboard(kbd.ARROW_UP);
	expect(t.getDayPeriod()).toHaveTextContent("AM");
	expect(t.value).toHaveTextContent("1980-01-20T00:30");
});

it("should go all the way through the segment with spamming 3", async () => {
	const t = setup({
		value: zonedDateTime,
		granularity: "second",
	});

	await t.user.click(t.getHour());
	await t.user.keyboard(`{3}`);
	expect(t.getMinute()).toHaveFocus();
	await t.user.keyboard(`{3}`);
	await t.user.keyboard(`{3}`);
	expect(t.getSecond()).toHaveFocus();
	await t.user.keyboard(`{3}`);
	await t.user.keyboard(`{3}`);
	expect(t.getDayPeriod()).toHaveFocus();
});

it("should overwrite on first click and type - `hour`", async () => {
	const t = setup({
		value: zonedDateTime,
		granularity: "second",
	});

	await t.user.click(t.getHour());
	expect(t.getHour()).toHaveFocus();
	expect(t.getHour()).toHaveTextContent(String(zonedDateTime.hour));
	await t.user.keyboard(`{1}`);
	expect(t.getHour()).toHaveTextContent("1");
});

it("should overwrite on first click and type - `minute`", async () => {
	const t = setup({
		value: zonedDateTime,
		granularity: "second",
	});

	await t.user.click(t.getMinute());
	expect(t.getMinute()).toHaveFocus();
	expect(t.getMinute()).toHaveTextContent(String(zonedDateTime.minute));
	await t.user.keyboard(`{1}`);
	expect(t.getMinute()).toHaveTextContent("1");
});

it("should overwrite on first click and type - `second`", async () => {
	const t = setup({
		value: zonedDateTime,
		granularity: "second",
	});

	await t.user.click(t.getSecond());
	expect(t.getSecond()).toHaveFocus();
	expect(t.getSecond()).toHaveTextContent(String(zonedDateTime.second));
	await t.user.keyboard(`{1}`);
	expect(t.getSecond()).toHaveTextContent("1");
});

it("should move to the previous segment when backspace is pressed while empty - `minute`", async () => {
	const t = setup({
		value: zonedDateTime,
		granularity: "second",
	});

	await t.user.click(t.getMinute());
	expect(t.getMinute()).toHaveFocus();
	expect(t.getMinute()).toHaveTextContent(String(zonedDateTime.minute));
	await t.user.keyboard(kbd.BACKSPACE);
	expect(t.getMinute()).toHaveTextContent("3");
	await t.user.keyboard(kbd.BACKSPACE);
	expect(t.getMinute()).toHaveTextContent(TIME_PLACEHOLDER);
	expect(t.getMinute()).toHaveFocus();
	await t.user.keyboard(kbd.BACKSPACE);
	expect(t.getHour()).toHaveFocus();
});

it("should to the previous segment when backspace is pressed while empty - `second`", async () => {
	const t = setup({
		value: zonedDateTime,
		granularity: "second",
	});

	await t.user.click(t.getSecond());
	expect(t.getSecond()).toHaveFocus();
	await t.user.keyboard(kbd.BACKSPACE);
	expect(t.getSecond()).toHaveTextContent(TIME_PLACEHOLDER);
	expect(t.getSecond()).toHaveFocus();
	await t.user.keyboard(kbd.BACKSPACE);
	expect(t.getMinute()).toHaveFocus();
});

it("displays correct timezone with ZonedDateTime value - absolute -> local", async () => {
	const t = setup({
		value: parseAbsoluteToLocal("2023-10-12T12:30:00Z"),
	});

	expect(t.getTimeZoneName()).toHaveTextContent(thisTimeZone("2023-10-12T12:30:00Z"));
});

it("should not allow changing the dayPeriod without a value", async () => {
	const t = setup({
		granularity: "second",
	});

	expect(t.getHour()).toHaveTextContent(TIME_PLACEHOLDER);
	await t.user.click(t.getDayPeriod());
	await t.user.keyboard(kbd.ARROW_UP);
	expect(t.getHour()).toHaveTextContent(TIME_PLACEHOLDER);
});

it("should allow going from 12PM -> 12AM without changing the display hour to 0", async () => {
	const t = setup({
		value: new CalendarDateTime(2023, 10, 12, 12, 30, 0, 0),
	});

	expect(t.getHour()).toHaveTextContent("12");

	await t.user.click(t.getDayPeriod());
	await t.user.keyboard(kbd.ARROW_UP);

	expect(t.getHour()).toHaveTextContent("12");
	expect(t.getDayPeriod()).toHaveTextContent("AM");
});

it("should never allow the hour to be 0 when in a 12 hour cycle", async () => {
	const t = setup({
		value: new CalendarDateTime(2023, 10, 12, 12, 30, 0, 0),
	});

	expect(t.getHour()).toHaveTextContent("12");

	await t.user.click(t.getDayPeriod());
	await t.user.keyboard(kbd.ARROW_UP);

	expect(t.getHour()).toHaveTextContent("12");
	expect(t.getDayPeriod()).toHaveTextContent("AM");

	await t.user.click(t.getHour());
	await t.user.keyboard(kbd.ARROW_UP);
	expect(t.getHour()).toHaveTextContent("01");
	expect(t.getHour()).not.toHaveTextContent("12");
	expect(t.getDayPeriod()).toHaveTextContent("AM");
	await t.user.click(t.getDayPeriod());
	await t.user.keyboard(kbd.ARROW_UP);
	expect(t.getHour()).toHaveTextContent("01");
	expect(t.getDayPeriod()).toHaveTextContent("PM");
	await t.user.click(t.getHour());
	await t.user.keyboard(kbd.ARROW_DOWN);
	expect(t.getHour()).toHaveTextContent("12");
	expect(t.getDayPeriod()).toHaveTextContent("PM");
});

it("should add missing leading zeroes to the hour and minute segments on focusout", async () => {
	const t = setup({
		value: new Time(12, 30, 0, 0),
	});

	await t.user.click(t.getHour());
	await t.user.keyboard(`{1}`);
	await t.user.keyboard(kbd.ARROW_RIGHT);
	expect(t.getMinute()).toHaveFocus();
	expect(t.getHour()).toHaveTextContent("01");

	await t.user.keyboard(`{1}`);
	await t.user.keyboard(kbd.ARROW_LEFT);
	expect(t.getHour()).toHaveFocus();
	expect(t.getHour()).toHaveTextContent("01");
});

it("should not intercept number keys when the ctrl or meta key is pressed, allowing default browser behavior", async () => {
	const t = setup({
		value: new Time(12, 30, 0, 0),
	});

	await t.user.click(t.getHour());
	await t.user.keyboard(`{1}`);
	await t.user.keyboard(`{2}`);
	expect(t.getHour()).toHaveTextContent("12");

	await t.user.keyboard(`{Shift>}1{/Shift}`);
	expect(t.getHour()).toHaveTextContent("12");

	await t.user.keyboard(`{Ctrl>}2{/Ctrl}`);
	expect(t.getHour()).toHaveTextContent("12");

	await t.user.keyboard(`{Meta>}2{/Meta}`);
	expect(t.getHour()).toHaveTextContent("12");
});

it("should not allow typing 24 hour cycle hours when the hourcycle is 12", async () => {
	const t = setup({
		value: new CalendarDateTime(2023, 10, 12, 12, 30, 0, 0),
	});

	expect(t.getHour()).toHaveTextContent("12");
	await t.user.click(t.getHour());
	await t.user.keyboard(`{1}{4}`);
	expect(t.getMinute()).toHaveFocus();
	expect(t.getHour()).toHaveTextContent("04");
});

it("should not go to zero on arrow navigation with a 12 hour cycle", async () => {
	const t = setup({
		value: new CalendarDateTime(2023, 10, 12, 12, 30, 0, 0),
	});

	expect(t.getHour()).toHaveTextContent("12");
	await t.user.click(t.getHour());
	await t.user.keyboard(`{1}{4}`);
	expect(t.getMinute()).toHaveFocus();
	expect(t.getHour()).toHaveTextContent("04");
	await t.user.click(t.getHour());
	await t.user.keyboard(kbd.ARROW_DOWN);
	await t.user.keyboard(kbd.ARROW_DOWN);
	expect(t.getHour()).toHaveTextContent("02");
});

it("should allow double zeroes to be set in the minute segment", async () => {
	const t = setup({
		value: new CalendarDateTime(2023, 10, 12, 12, 30, 0, 0),
	});

	expect(t.getHour()).toHaveTextContent("12");
	await t.user.click(t.getMinute());
	await t.user.keyboard(`{0}{0}`);
	expect(t.getMinute()).toHaveTextContent("00");
});

it("should advance to the next segment when typing two zeroes into the minute segment", async () => {
	const t = setup({
		value: new CalendarDateTime(2023, 10, 12, 12, 30, 0, 0),
	});

	expect(t.getHour()).toHaveTextContent("12");
	await t.user.click(t.getMinute());
	await t.user.keyboard(`{0}{0}`);
	expect(t.getDayPeriod()).toHaveFocus();
});

it("should allow double zeroes to be set in the second segment", async () => {
	const t = setup({
		value: new CalendarDateTime(2023, 10, 12, 12, 30, 30, 0),
		granularity: "second",
	});

	expect(t.getSecond()).toHaveTextContent("30");
	await t.user.click(t.getSecond());
	await t.user.keyboard(`{0}{0}`);
	expect(t.getSecond()).toHaveTextContent("00");
});

it("should advance to the next segment when typing two zeroes into the second segment", async () => {
	const t = setup({
		value: new CalendarDateTime(2023, 10, 12, 12, 30, 30, 0),
		granularity: "second",
	});

	expect(t.getSecond()).toHaveTextContent("30");
	await t.user.click(t.getSecond());
	await t.user.keyboard(`{0}{0}`);
	expect(t.getDayPeriod()).toHaveFocus();
});

it("should not allow typing characters that are not `a` or `p` into the dayPeriod segment", async () => {
	const t = setup({
		value: new CalendarDateTime(2023, 10, 12, 12, 30, 30, 0),
		granularity: "second",
	});

	expect(t.getDayPeriod()).toHaveTextContent("PM");
	await t.user.click(t.getDayPeriod());
	await t.user.keyboard("{i}{d}{k}");
	expect(t.getDayPeriod().textContent).toBe("PM");
});

it("should not allow typing non-numeric characters into the time segments", async () => {
	const t = setup({
		value: new CalendarDateTime(2023, 10, 12, 12, 30, 30, 0),
		granularity: "second",
	});

	const segments = [t.getHour(), t.getMinute(), t.getSecond()];

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

	expect(t.getDayPeriod()).toHaveTextContent("PM");
	await t.user.click(t.getDayPeriod());
	await t.user.keyboard("{Shift>}a{/Shift}");
	expect(t.getDayPeriod()).toHaveTextContent("AM");
	await t.user.keyboard("{Shift>}p{/Shift}");
	expect(t.getDayPeriod()).toHaveTextContent("PM");
	await t.user.keyboard("a");
	expect(t.getDayPeriod()).toHaveTextContent("AM");
	await t.user.keyboard("p");
	expect(t.getDayPeriod()).toHaveTextContent("PM");
});

it("should render a hidden input if the `name` prop is passed", async () => {
	const t = setup({
		name: "time-field",
	});
	expect(t.getHiddenInput()).not.toBeNull();
	expect(t.getHiddenInput()).toHaveAttribute("name", "time-field");
	expect(t.getHiddenInput()).toHaveAttribute("aria-hidden", "true");
});

it("should not render a hidden input if the name prop isn't passed", async () => {
	const t = setup();
	expect(t.getHiddenInput()).toBeNull();
});

it("should keep the value of the hidden input in sync with the fields value", async () => {
	const value = new CalendarDateTime(2023, 10, 12, 12, 30, 30, 0);
	const t = setup({
		name: "hello",
		value,
	});

	await tick();

	expect(t.getHiddenInput()).not.toBeNull();

	expect(t.getHiddenInput()).toHaveValue(extractTime(value));

	await t.user.click(t.getHour());
	await t.user.keyboard(kbd.ARROW_UP);
	expect(t.getHiddenInput()).toHaveValue(extractTime(value.add({ hours: 1 })));
});

it("should handle 24 hour time appropriately", async () => {
	const value = new CalendarDateTime(2023, 10, 12, 12, 30, 30, 0);
	const t = setup({
		name: "hello",
		value,
		hourCycle: 24,
	});

	await t.user.click(t.getHour());
	await t.user.keyboard("22");
	expect(t.getHour()).toHaveTextContent("22");
});

it("should allow 00 to be entered when hourCycle is 24", async () => {
	const value = new CalendarDateTime(2023, 10, 12, 12, 30, 30, 0);
	const t = setup({
		name: "hello",
		value,
		hourCycle: 24,
	});

	await t.user.click(t.getHour());
	await t.user.keyboard("00");
	expect(t.getHour()).toHaveTextContent("00");
});

it("navigating to 00 with ArrowUp/Down when hourCycle is 24 should show 00 and not 0", async () => {
	const value = new CalendarDateTime(2023, 10, 12, 1, 30, 30, 0);
	const t = setup({
		name: "hello",
		value,
		hourCycle: 24,
	});

	await t.user.click(t.getHour());
	await t.user.keyboard(kbd.ARROW_DOWN);
	expect(t.getHour()).toHaveTextContent("00");
	expect(t.getHour().textContent).not.toBe("0");
	await t.user.keyboard(kbd.ARROW_DOWN);
	expect(t.getHour()).toHaveTextContent("23");
	await t.user.keyboard(kbd.ARROW_UP);
	expect(t.getHour()).toHaveTextContent("00");
});

it("should display correct hour when prepopulated with value and hourCycle is 24", async () => {
	const value = new CalendarDateTime(2023, 10, 12, 0, 30, 30, 0);
	const t = setup({
		name: "hello",
		value,
		hourCycle: 24,
	});

	expect(t.getHour()).toHaveTextContent("00");
});

it("should reset the segment values when the value is reset", async () => {
	const t = setup({
		value: new CalendarDateTime(2023, 10, 12, 12, 30, 30, 0),
		granularity: "second",
	});

	await t.user.click(t.getByTestId("reset"));

	expect(t.getHour()).toHaveTextContent(TIME_PLACEHOLDER);
	expect(t.getMinute()).toHaveTextContent(TIME_PLACEHOLDER);
});

it("should hide timezone when hideTimeZone is true", async () => {
	const t = setup({
		value: zonedDateTime,
		hideTimeZone: true,
	});

	expect(t.getTimeZoneName()).toBeNull();
});

it("should show timezone when hideTimeZone is false", async () => {
	const t = setup({
		value: zonedDateTime,
		hideTimeZone: false,
	});

	expect(t.getTimeZoneName()).not.toBeNull();
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
	await t.user.click(t.getHour());
	await t.user.keyboard(kbd.ARROW_UP);

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

	await t.user.click(t.getHour());
	await t.user.keyboard(kbd.ARROW_UP);

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

	await t.user.click(t.getHour());
	await t.user.keyboard(kbd.ARROW_UP);

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

	await t.user.click(t.getHour());
	await t.user.keyboard(kbd.ARROW_DOWN);
	expect(t.getHour()).toHaveTextContent("11");
	expect(mockOnInvalid).toHaveBeenCalledWith("min", undefined);

	expect(t.getHour()).toHaveAttribute("aria-invalid", "true");
	expect(t.input).toHaveAttribute("data-invalid");
	expect(t.label).toHaveAttribute("data-invalid");
});

it("should respect the maxValue prop", async () => {
	const mockOnInvalid = vi.fn();

	const t = setup({
		maxValue: new Time(12, 30, 0),
		value: new Time(12, 30, 0),
		onInvalid: mockOnInvalid,
	});

	await t.user.click(t.getHour());
	await t.user.keyboard(kbd.ARROW_UP);
	expect(t.getHour()).toHaveTextContent("01");
	expect(mockOnInvalid).toHaveBeenCalledWith("max", undefined);

	expect(t.getHour()).toHaveAttribute("aria-invalid", "true");
	expect(t.input).toHaveAttribute("data-invalid");
	expect(t.label).toHaveAttribute("data-invalid");
});

it("should respect readonlySegments prop", async () => {
	const t = setup({
		value: new Time(12, 30, 0),
		readonlySegments: ["hour", "minute"],
		granularity: "second",
	});

	await t.user.click(t.getHour());
	await t.user.keyboard(kbd.ARROW_UP);
	expect(t.getHour()).toHaveTextContent("12");

	await t.user.click(t.getMinute());
	await t.user.keyboard(kbd.ARROW_UP);
	expect(t.getMinute()).toHaveTextContent("30");

	await t.user.click(t.getSecond());
	await t.user.keyboard(kbd.ARROW_UP);
	expect(t.getSecond()).toHaveTextContent("01");
});

it("should default to a 24 hour clock for locales that use it", async () => {
	const t = setup({
		locale: "en-UK",
		value: new Time(13, 30, 0),
	});

	expect(t.getHour()).toHaveTextContent("13");
});

it("should allow changing the day period even if no value is populated yet", async () => {
	const t = setup();

	expect(t.getDayPeriod()).toHaveTextContent("AM");
	await t.user.click(t.getDayPeriod());

	await t.user.keyboard(kbd.p);
	expect(t.getDayPeriod()).toHaveTextContent("PM");
});

it("should not adjust the hour when the day period is changed", async () => {
	const t = setup();

	await t.user.click(t.getDayPeriod());
	await t.user.keyboard(kbd.ARROW_UP);
	await t.user.keyboard(kbd.ARROW_UP);
	expect(t.getDayPeriod()).toHaveTextContent("AM");
	expect(t.getHour()).toHaveTextContent(TIME_PLACEHOLDER);
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
