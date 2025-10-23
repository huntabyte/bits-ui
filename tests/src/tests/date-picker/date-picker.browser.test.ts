import { CalendarDate, CalendarDateTime, toZoned } from "@internationalized/date";
import { getTestKbd } from "../utils";
import { expect, it, describe } from "vitest";
import { render } from "vitest-browser-svelte";
import DatePickerTest, { type DatePickerTestProps } from "./date-picker-test.svelte";
import { expectExists, expectNotClickableLoc, expectNotExists } from "../browser-utils";
import { page, userEvent, type Locator } from "@vitest/browser/context";

const kbd = getTestKbd();

const calendarDate = new CalendarDate(2022, 1, 15);
const calendarDateTime = new CalendarDateTime(2022, 1, 15, 12, 30);
const zonedDateTime = toZoned(calendarDateTime, "America/New_York");

const testDate = new CalendarDate(1980, 1, 20);
const testDateTime = new CalendarDateTime(1980, 1, 20, 12, 30, 0, 0);
const testZonedDateTime = toZoned(testDateTime, "America/New_York");

const narrowWeekdays = ["S", "M", "T", "W", "T", "F", "S"];
const shortWeekdays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const longWeekdays = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
// prettier-ignore
const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October" ,"November", "December"];
const SELECTED_DAY_SELECTOR = "[data-bits-day][data-selected]";
const SELECTED_ATTR = "data-selected";

function setup(props: Partial<DatePickerTestProps> = {}) {
	const t = render(DatePickerTest, { ...props });
	const month = page.getByTestId("month");
	const day = page.getByTestId("day");
	const year = page.getByTestId("year");
	const value = page.getByTestId("value");
	const input = page.getByTestId("input");
	const label = page.getByTestId("label");
	const trigger = page.getByTestId("trigger");

	function getContent() {
		return page.getByTestId("content");
	}

	return { ...t, month, day, year, value, input, label, trigger, getContent };
}

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

async function open(props: DatePickerTestProps = {}, openWith: "click" | (string & {}) = "click") {
	const t = setup(props);
	await expectNotExists(t.getContent());
	if (openWith === "click") {
		await t.trigger.click();
	} else {
		(t.trigger.element() as HTMLElement).focus();
		await userEvent.keyboard(openWith);
	}
	await expectExists(t.getContent());
	const content = page.getByTestId("content");
	const calendar = page.getByTestId("calendar");

	function getSelectedDay() {
		return calendar.element().querySelector<HTMLElement>(SELECTED_DAY_SELECTOR);
	}

	return {
		...t,
		content,
		calendar,
		getSelectedDay,
	};
}

it("should open on click", async () => {
	await open();
});

it.each([kbd.ENTER, kbd.SPACE])("should open on %s", async (key) => {
	await open({}, key);
});

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
		granularity: "second",
	});

	await expect.element(t.month).toHaveTextContent(String(calendarDateTime.month));
	await expect.element(t.day).toHaveTextContent(String(calendarDateTime.day));
	await expect.element(t.year).toHaveTextContent(String(calendarDateTime.year));
	await expect.element(page.getByTestId("hour")).toHaveTextContent(String(calendarDateTime.hour));
	await expect
		.element(page.getByTestId("minute"))
		.toHaveTextContent(String(calendarDateTime.minute));
	await expect
		.element(page.getByTestId("second"))
		.toHaveTextContent(String(calendarDateTime.second));
	await expect.element(t.value).toHaveTextContent(calendarDateTime.toString());
});

it("should populate segment with value - `ZonedDateTime`", async () => {
	const t = setup({
		value: zonedDateTime,
		granularity: "second",
	});

	await expect.element(t.month).toHaveTextContent(String(calendarDateTime.month));
	await expect.element(t.day).toHaveTextContent(String(calendarDateTime.day));
	await expect.element(t.year).toHaveTextContent(String(calendarDateTime.year));
	await expect.element(page.getByTestId("hour")).toHaveTextContent(String(calendarDateTime.hour));
	await expect
		.element(page.getByTestId("minute"))
		.toHaveTextContent(String(calendarDateTime.minute));
	await expect
		.element(page.getByTestId("second"))
		.toHaveTextContent(String(calendarDateTime.second));
	await expect.element(t.value).toHaveTextContent(calendarDateTime.toString());
});

it("should navigate between the segments", async () => {
	setup({
		value: calendarDate,
	});

	const segments = ["month", "day", "year"] as const;
	const month = page.getByTestId("month");

	await month.click();

	for (const segment of segments) {
		if (segment === "month") continue;
		const seg = page.getByTestId(segment);
		await userEvent.keyboard(kbd.ARROW_RIGHT);
		await expect.element(seg).toHaveFocus();
	}

	await month.click();

	for (const segment of segments) {
		if (segment === "month") continue;
		const seg = page.getByTestId(segment);
		await userEvent.keyboard(kbd.TAB);
		await expect.element(seg).toHaveFocus();
	}
});

it("should navigate between the segments - right to left", async () => {
	setup({
		value: calendarDate,
	});

	const segments = ["year", "day", "month"] as const;
	const year = page.getByTestId("year");

	await year.click();

	for (const segment of segments) {
		if (segment === "year") continue;
		const seg = page.getByTestId(segment);
		await userEvent.keyboard(kbd.ARROW_LEFT);
		await expect.element(seg).toHaveFocus();
	}

	await year.click();

	for (const segment of segments) {
		if (segment === "year") continue;
		const seg = page.getByTestId(segment);
		await userEvent.keyboard(kbd.SHIFT_TAB);
		await expect.element(seg).toHaveFocus();
	}
});

it("should respect `bind:value`", async () => {
	const t = setup({
		value: calendarDate,
	});
	await expect.element(t.value).toHaveTextContent(calendarDate.toString());

	await t.month.click();
	await userEvent.keyboard("2");
	await expect.element(t.value).toHaveTextContent("2022-02-15");
});

it("should populate date with keyboard", async () => {
	const t = setup({ value: calendarDate });

	await t.month.click();

	await userEvent.keyboard("2142020");

	await expect.element(t.value).toHaveTextContent("2020-02-14");
});

describe("respects value if provided", () => {
	it("CalendarDate", async () => {
		const t = await open({ value: testDate });

		expect(t.getSelectedDay()).toBeTruthy();

		const heading = page.getByTestId("heading");
		await expect.element(heading).toHaveTextContent("January 1980");
	});

	it("CalendarDateTime", async () => {
		const t = await open({ value: testDateTime });

		expect(t.getSelectedDay()).toBeTruthy();

		const heading = page.getByTestId("heading");
		await expect.element(heading).toHaveTextContent("January 1980");
	});

	it("ZonedDateTime", async () => {
		const t = await open({ value: testZonedDateTime });

		expect(t.getSelectedDay()).toBeTruthy();

		const heading = page.getByTestId("heading");
		await expect.element(heading).toHaveTextContent("January 1980");
	});
});

it("should allow clearing the selected date", async () => {
	const t = await open({
		value: testDate,
	});

	expect(t.getSelectedDay()).toBeTruthy();

	const clearButton = page.getByText("clear");

	await clearButton.click();
	await expectNotExists(t.getContent());
	await t.trigger.click();
	await expectExists(t.getContent());

	expect(t.getSelectedDay()).toBeFalsy();
});

it("should update value when selecting a date", async () => {
	const t = await open({
		placeholder: testDate,
	});

	const value = page.getByTestId("value");
	await expect.element(value).toHaveTextContent("undefined");

	const fifthDayInMonth = page.getByTestId("date-1-5");
	await fifthDayInMonth.click();

	await expect.element(value).toHaveTextContent("1980-01-05");
	await expectNotExists(t.getContent());
	await t.trigger.click();
	await expectExists(t.getContent());

	expect(t.getSelectedDay()).toBeTruthy();
});

it("should navigate the months forward using the next button", async () => {
	await open({ value: testDateTime });

	const heading = page.getByTestId("heading");
	const nextBtn = page.getByTestId("next-button");

	for (const month of months) {
		await expect.element(heading).toHaveTextContent(`${month} 1980`);
		await nextBtn.click();
	}
	await expect.element(heading).toHaveTextContent("January 1981");
});

it("should navigate the months backwards using the prev button", async () => {
	await open({ value: testDateTime });

	const heading = page.getByTestId("heading");
	const prevBtn = page.getByTestId("prev-button");
	const newMonths = [...months].reverse();
	newMonths.pop();

	await expect.element(heading).toHaveTextContent("January 1980");
	await prevBtn.click();

	for (const month of newMonths) {
		await expect.element(heading).toHaveTextContent(`${month} 1979`);
		await prevBtn.click();
	}
	await expect.element(heading).toHaveTextContent("January 1979");
});

it("should render six weeks when `fixedWeeks` is `true`", { timeout: 10000 }, async () => {
	const t = await open({
		value: testDateTime,
		fixedWeeks: true,
	});

	function getNumberOfWeeks() {
		return t.calendar.element().querySelectorAll("[data-week]").length;
	}

	const nextButton = page.getByTestId("next-button");

	for (let i = 0; i < 16; i++) {
		expect(getNumberOfWeeks()).toBe(6);
		await nextButton.click({ force: true });
	}
});

it("should not allow navigation before the `minValue` (prev button)", async () => {
	await open({
		value: testDate,
		minValue: new CalendarDate(1979, 11, 25),
	});

	const prevBtn = page.getByTestId("prev-button");
	await prevBtn.click();
	const heading = page.getByTestId("heading");
	await expect.element(heading).toHaveTextContent("December 1979");
	await expect.element(prevBtn).not.toHaveAttribute("aria-disabled", "true");
	await expect.element(prevBtn).not.toHaveAttribute("data-disabled");

	await prevBtn.click();
	await expect.element(heading).toHaveTextContent("November 1979");
	await expect.element(prevBtn).toHaveAttribute("aria-disabled", "true");
	await expect.element(prevBtn).toHaveAttribute("data-disabled");

	await expectNotClickableLoc(prevBtn);
	await expect.element(heading).toHaveTextContent("November 1979");
});

it("should not allow navigation after the `maxValue` (next button)", async () => {
	await open({
		value: testDate,
		maxValue: new CalendarDate(1980, 3, 25),
	});

	const nextBtn = page.getByTestId("next-button");
	await nextBtn.click();
	const heading = page.getByTestId("heading");
	await expect.element(heading).toHaveTextContent("February 1980");
	await expect.element(nextBtn).not.toHaveAttribute("aria-disabled", "true");
	await expect.element(nextBtn).not.toHaveAttribute("data-disabled");

	await nextBtn.click();
	await expect.element(heading).toHaveTextContent("March 1980");
	await expect.element(nextBtn).toHaveAttribute("aria-disabled", "true");
	await expect.element(nextBtn).toHaveAttribute("data-disabled");

	await expectNotClickableLoc(nextBtn);
	await expect.element(heading).toHaveTextContent("March 1980");
});

it("should not navigate after `maxValue` (with keyboard)", async () => {
	await open({
		value: testDate,
		maxValue: new CalendarDate(1980, 3, 31),
	});

	const firstDayInMonth = page.getByTestId("date-1-1").element() as HTMLElement;
	firstDayInMonth.focus();
	await expect.element(firstDayInMonth).toHaveFocus();

	const heading = page.getByTestId("heading");
	await expect.element(heading).toHaveTextContent("January 1980");

	// five keypresses to February 1980
	await userEvent.keyboard(kbd.ARROW_DOWN);
	await expect.element(page.getByTestId("date-1-8")).toHaveFocus();
	await userEvent.keyboard(kbd.ARROW_DOWN);
	await expect.element(page.getByTestId("date-1-15")).toHaveFocus();
	await userEvent.keyboard(kbd.ARROW_DOWN);
	await expect.element(page.getByTestId("date-1-22")).toHaveFocus();
	await userEvent.keyboard(kbd.ARROW_DOWN);
	await expect.element(page.getByTestId("date-1-29")).toHaveFocus();
	await userEvent.keyboard(kbd.ARROW_DOWN);
	await expect.element(page.getByTestId("date-2-5")).toHaveFocus();
	await expect.element(heading).toHaveTextContent("February 1980");

	// four keypresses to March 1980
	await userEvent.keyboard(kbd.ARROW_DOWN);
	await expect.element(page.getByTestId("date-2-12")).toHaveFocus();
	await userEvent.keyboard(kbd.ARROW_DOWN);
	await expect.element(page.getByTestId("date-2-19")).toHaveFocus();
	await userEvent.keyboard(kbd.ARROW_DOWN);
	await expect.element(page.getByTestId("date-2-26")).toHaveFocus();
	await userEvent.keyboard(kbd.ARROW_DOWN);
	await expect.element(page.getByTestId("date-3-4")).toHaveFocus();
	await expect.element(heading).toHaveTextContent("March 1980");

	// four keypresses to April 1980 - should stop at max
	await userEvent.keyboard(kbd.ARROW_DOWN);
	await expect.element(page.getByTestId("date-3-11")).toHaveFocus();
	await userEvent.keyboard(kbd.ARROW_DOWN);
	await expect.element(page.getByTestId("date-3-18")).toHaveFocus();
	await userEvent.keyboard(kbd.ARROW_DOWN);
	await expect.element(page.getByTestId("date-3-25")).toHaveFocus();
	await userEvent.keyboard(kbd.ARROW_DOWN);
	await expect.element(page.getByTestId("date-3-25")).toHaveFocus();
	await expect.element(heading).toHaveTextContent("March 1980");
});

it("should not navigate before `minValue` (with keyboard)", async () => {
	await open({
		value: testDate,
		minValue: new CalendarDate(1979, 12, 1),
	});

	const firstDayInMonth = page.getByTestId("date-1-1").element() as HTMLElement;
	firstDayInMonth.focus();
	await expect.element(firstDayInMonth).toHaveFocus();

	const heading = page.getByTestId("heading");
	await expect.element(heading).toHaveTextContent("January 1980");

	// one keypress to get to December 1979
	await userEvent.keyboard(kbd.ARROW_UP);
	await expect.element(page.getByTestId("date-12-25")).toHaveFocus();
	await expect.element(heading).toHaveTextContent("December 1979");

	// four keypresses to November 1979 - should stop at min
	await userEvent.keyboard(kbd.ARROW_UP);
	await expect.element(page.getByTestId("date-12-18")).toHaveFocus();
	await userEvent.keyboard(kbd.ARROW_UP);
	await expect.element(page.getByTestId("date-12-11")).toHaveFocus();
	await userEvent.keyboard(kbd.ARROW_UP);
	await expect.element(page.getByTestId("date-12-4")).toHaveFocus();
	await userEvent.keyboard(kbd.ARROW_UP);
	await expect.element(page.getByTestId("date-12-4")).toHaveFocus();
	await expect.element(heading).toHaveTextContent("December 1979");
});

it("should handle unavailable dates appropriately", async () => {
	await open({
		placeholder: testDate,
		isDateUnavailable: (date) => {
			return date.day === 3;
		},
	});

	const thirdDayInMonth = page.getByTestId("date-1-3");
	await expect.element(thirdDayInMonth).toHaveTextContent("3");
	await expect.element(thirdDayInMonth).toHaveAttribute("data-unavailable");
	await expect.element(thirdDayInMonth).toHaveAttribute("aria-disabled", "true");
	await expectNotClickableLoc(thirdDayInMonth);
	await expect.element(thirdDayInMonth).not.toHaveAttribute(SELECTED_ATTR);
});

it("should sync the calendar with the input when input is changed", async () => {
	const t = setup({
		value: calendarDate,
	});
	await expect.element(t.value).toHaveTextContent(calendarDate.toString());

	await t.month.click();
	await userEvent.keyboard("2");
	await expect.element(t.value).toHaveTextContent("2022-02-15");
	await t.trigger.click();
	await expectExists(t.getContent());

	const heading = page.getByTestId("heading");
	await expect.element(heading).toHaveTextContent("February 2022");
});

describe("correct weekday label formatting", () => {
	it("narrow", async () => {
		await open({
			placeholder: testDate,
			weekdayFormat: "narrow",
		});
		for (const [i, weekday] of narrowWeekdays.entries()) {
			const weekdayEl = page.getByTestId(`weekday-1-${i}`);
			await expect.element(weekdayEl).toHaveTextContent(weekday);
		}
	});

	it("short", async () => {
		await open({
			placeholder: testDate,
			weekdayFormat: "short",
		});
		for (const [i, weekday] of shortWeekdays.entries()) {
			const weekdayEl = page.getByTestId(`weekday-1-${i}`);
			await expect.element(weekdayEl).toHaveTextContent(weekday);
		}
	});

	it("long", async () => {
		await open({
			placeholder: testDate,
			weekdayFormat: "long",
		});
		for (const [i, weekday] of longWeekdays.entries()) {
			const weekdayEl = page.getByTestId(`weekday-1-${i}`);
			await expect.element(weekdayEl).toHaveTextContent(weekday);
		}
	});
});

it("should respect the `weekStartsOn` prop regardless of locale", async () => {
	await open({
		placeholder: new CalendarDate(1980, 1, 1),
		weekStartsOn: 2,
		weekdayFormat: "short",
		locale: "fr",
	});
	await expect.element(page.getByTestId("weekday-1-0")).toHaveTextContent("mar.");
});

it("should default the first day of the week to the locale's first day of the week if `weekStartsOn` is not provided", async () => {
	await open({
		placeholder: new CalendarDate(1980, 1, 1),
		weekdayFormat: "short",
		locale: "fr",
	});
	await expect.element(page.getByTestId("weekday-1-0")).toHaveTextContent("lun.");
});

it("should handle disabled dates correctly", async () => {
	await open({
		placeholder: testDate,
		isDateDisabled: (date) => date.day === 5,
	});

	const fifthDayInMonth = page.getByTestId("date-1-5");
	await expect.element(fifthDayInMonth).toHaveTextContent("5");
	await expect.element(fifthDayInMonth).toHaveAttribute("data-disabled");
	await expect.element(fifthDayInMonth).toHaveAttribute("aria-disabled", "true");
	await expectNotClickableLoc(fifthDayInMonth);
});

it("should close popover when date is selected and closeOnDateSelect is true", async () => {
	const t = await open({
		placeholder: testDate,
		closeOnDateSelect: true,
	});

	await expectExists(t.getContent());

	const fifthDayInMonth = page.getByTestId("date-1-5");
	await fifthDayInMonth.click();

	// should close after selection
	await expectNotExists(t.getContent());
	await expect.element(t.value).toHaveTextContent("1980-01-05");
});

it("should not close popover when closeOnDateSelect is false", async () => {
	const t = await open({
		placeholder: testDate,
		closeOnDateSelect: false,
	});

	await expectExists(t.getContent());

	const fifthDayInMonth = page.getByTestId("date-1-5");
	await fifthDayInMonth.click();

	// should remain open
	await expectExists(t.getContent());
	await expect.element(t.value).toHaveTextContent("1980-01-05");
});

describe("date picker - 24-hour format with locales", () => {
	it("should allow typing hours 0-23 with non en-US locales that use 24-hour format", async () => {
		const t = setup({
			granularity: "minute",
			locale: "nl-NL", // dutch uses 24-hour format
		});

		const { getHour, getMinute } = getTimeSegments(page.getByTestId);

		await t.day.click();
		await userEvent.keyboard("9");

		await expect.element(t.day).toHaveTextContent("09");
		await expect.element(t.month).toHaveFocus();
		await userEvent.keyboard("9");
		await expect.element(t.month).toHaveTextContent("09");
		await expect.element(t.year).toHaveFocus();
		await userEvent.keyboard("1234");
		await expect.element(t.year).toHaveTextContent("1234");
		await expect.element(getHour()).toHaveFocus();
		await userEvent.keyboard("22");
		await expect.element(getHour()).toHaveTextContent("22");
		await expect.element(getMinute()).toHaveFocus();
	});

	it("should allow arrow key navigation through full 0-23 range with 24-hour locales", async () => {
		const value = new CalendarDateTime(2023, 10, 12, 14, 30, 30, 0);
		setup({
			value,
			granularity: "minute",
			locale: "fr-FR", // french uses 24-hour format
		});

		const { getHour } = getTimeSegments(page.getByTestId);
		const hour = getHour();

		await expect.element(hour).toHaveTextContent("14");

		// arrow up should go to 15, not clamp to 12
		await hour.click();
		await userEvent.keyboard(kbd.ARROW_UP);
		await expect.element(hour).toHaveTextContent("15");

		// continue to 23
		for (let i = 0; i < 8; i++) {
			await userEvent.keyboard(kbd.ARROW_UP);
		}
		await expect.element(hour).toHaveTextContent("23");

		// arrow up from 23 should cycle to 00
		await userEvent.keyboard(kbd.ARROW_UP);
		await expect.element(hour).toHaveTextContent("00");

		// arrow down from 00 should go to 23
		await userEvent.keyboard(kbd.ARROW_DOWN);
		await expect.element(hour).toHaveTextContent("23");
	});

	it("should display and allow typing hours > 12 with sv-SE locale (24-hour format)", async () => {
		const value = new CalendarDateTime(2023, 10, 12, 18, 30, 30, 0);
		setup({
			value,
			granularity: "minute",
			locale: "sv-SE", // swedish uses 24-hour format
		});

		const { getHour } = getTimeSegments(page.getByTestId);
		const hour = getHour();

		// should display 18, not clamp to 12 or convert to 12-hour format
		await expect.element(hour).toHaveTextContent("18");

		// should not have dayPeriod segment
		await expectNotExists(page.getByTestId("dayPeriod"));

		// typing should allow values > 12
		await hour.click();
		await userEvent.keyboard("20");
		await expect.element(hour).toHaveTextContent("20");

		// arrow down should work correctly (not clamp to 1-12 range)
		await hour.click();
		await userEvent.keyboard(kbd.ARROW_DOWN);
		await expect.element(hour).toHaveTextContent("19");
	});

	it("should handle ja-JP locale (24-hour format) correctly", async () => {
		const value = new CalendarDateTime(2023, 10, 12, 16, 30, 0, 0);
		setup({
			value,
			granularity: "minute",
			locale: "ja-JP", // japanese uses 24-hour format
		});

		const { getHour } = getTimeSegments(page.getByTestId);
		const hour = getHour();

		// should display 16
		await expect.element(hour).toHaveTextContent("16");

		// should not have dayPeriod segment
		await expectNotExists(page.getByTestId("dayPeriod"));

		// typing should allow values > 12
		await hour.click();
		await userEvent.keyboard("21");
		await expect.element(hour).toHaveTextContent("21");
	});
});
