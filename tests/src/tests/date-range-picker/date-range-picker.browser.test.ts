import { CalendarDate, CalendarDateTime, toZoned } from "@internationalized/date";
import { getTestKbd } from "../utils";
import { expect, it, describe } from "vitest";
import { render } from "vitest-browser-svelte";
import DateRangePickerTest, {
	type DateRangePickerTestProps,
} from "./date-range-picker-test.svelte";
import { expectExists, expectNotClickableLoc, expectNotExists } from "../browser-utils";
import { page, userEvent, type Locator } from "@vitest/browser/context";

const kbd = getTestKbd();

const calendarDate = {
	start: new CalendarDate(2022, 1, 1),
	end: new CalendarDate(2022, 3, 1),
};

const calendarDateTime = {
	start: new CalendarDateTime(2022, 1, 1, 12, 30),
	end: new CalendarDateTime(2022, 3, 1, 12, 30),
};
const zonedDateTime = {
	start: toZoned(calendarDateTime.start, "America/New_York"),
	end: toZoned(calendarDateTime.end, "America/New_York"),
};

const calendarDateRange = {
	start: new CalendarDate(1980, 1, 20),
	end: new CalendarDate(1980, 1, 25),
};

const calendarDateTimeRange = {
	start: new CalendarDateTime(1980, 1, 20, 12, 30, 0, 0),
	end: new CalendarDateTime(1980, 1, 25, 12, 30, 0, 0),
};

const zonedDateTimeRange = {
	start: toZoned(calendarDateTimeRange.start, "America/New_York"),
	end: toZoned(calendarDateTimeRange.end, "America/New_York"),
};

const narrowWeekdays = ["S", "M", "T", "W", "T", "F", "S"];
const shortWeekdays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const longWeekdays = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
// prettier-ignore
const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October" ,"November", "December"];
const SELECTED_DAY_SELECTOR = "[data-bits-day][data-selected]";
const SELECTED_ATTR = "data-selected";

function setup(props: Partial<DateRangePickerTestProps> = {}) {
	const t = render(DateRangePickerTest, { ...props });
	const trigger = page.getByTestId("trigger");
	const start = {
		month: page.getByTestId("start-month"),
		day: page.getByTestId("start-day"),
		year: page.getByTestId("start-year"),
		value: page.getByTestId("start-value"),
	};

	const end = {
		month: page.getByTestId("end-month"),
		day: page.getByTestId("end-day"),
		year: page.getByTestId("end-year"),
		value: page.getByTestId("end-value"),
	};
	const startInput = page.getByTestId("start-input");
	const endInput = page.getByTestId("end-input");
	const label = page.getByTestId("label");

	function getSelectedDays(calendar: HTMLElement) {
		return calendar.querySelectorAll<HTMLElement>(SELECTED_DAY_SELECTOR);
	}

	function getContent() {
		return page.getByTestId("content");
	}

	return {
		container: t.container,
		trigger,
		start,
		end,
		startInput,
		endInput,
		label,
		getSelectedDays,
		getContent,
	};
}

async function open(
	props: DateRangePickerTestProps = {},
	openWith: "click" | (string & {}) = "click"
) {
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

	function getSelectedDays(calendar: Locator) {
		return Array.from(calendar.element().querySelectorAll<HTMLElement>(SELECTED_DAY_SELECTOR));
	}
	return {
		...t,
		content,
		calendar,
		getSelectedDays,
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

	await expect.element(t.start.month).toHaveTextContent(String(calendarDate.start.month));
	await expect.element(t.start.day).toHaveTextContent(String(calendarDate.start.day));
	await expect.element(t.start.year).toHaveTextContent(String(calendarDate.start.year));
	await expect.element(t.start.value).toHaveTextContent(calendarDate.start.toString());

	await expect.element(t.end.month).toHaveTextContent(String(calendarDate.end.month));
	await expect.element(t.end.day).toHaveTextContent(String(calendarDate.end.day));
	await expect.element(t.end.year).toHaveTextContent(String(calendarDate.end.year));
	await expect.element(t.end.value).toHaveTextContent(calendarDate.end.toString());
});

it("should populate segment with value - `CalendarDateTime`", async () => {
	const t = setup({
		value: calendarDateTime,
		granularity: "second",
	});

	await expect.element(t.start.month).toHaveTextContent(String(calendarDateTime.start.month));
	await expect.element(t.start.day).toHaveTextContent(String(calendarDateTime.start.day));
	await expect.element(t.start.year).toHaveTextContent(String(calendarDateTime.start.year));
	await expect
		.element(page.getByTestId("start-hour"))
		.toHaveTextContent(String(calendarDateTime.start.hour));
	await expect
		.element(page.getByTestId("start-minute"))
		.toHaveTextContent(String(calendarDateTime.start.minute));
	await expect
		.element(page.getByTestId("start-second"))
		.toHaveTextContent(String(calendarDateTime.start.second));
	await expect.element(t.start.value).toHaveTextContent(calendarDateTime.start.toString());

	await expect.element(t.end.month).toHaveTextContent(String(calendarDateTime.end.month));
	await expect.element(t.end.day).toHaveTextContent(String(calendarDateTime.end.day));
	await expect.element(t.end.year).toHaveTextContent(String(calendarDateTime.end.year));
	await expect
		.element(page.getByTestId("end-hour"))
		.toHaveTextContent(String(calendarDateTime.end.hour));
	await expect
		.element(page.getByTestId("end-minute"))
		.toHaveTextContent(String(calendarDateTime.end.minute));
	await expect
		.element(page.getByTestId("end-second"))
		.toHaveTextContent(String(calendarDateTime.end.second));
	await expect.element(t.end.value).toHaveTextContent(calendarDateTime.end.toString());
});

it("should populate segment with value - `ZonedDateTime`", async () => {
	const t = setup({
		value: zonedDateTime,
		granularity: "second",
	});

	await expect.element(t.start.month).toHaveTextContent(String(calendarDateTime.start.month));
	await expect.element(t.start.day).toHaveTextContent(String(calendarDateTime.start.day));
	await expect.element(t.start.year).toHaveTextContent(String(calendarDateTime.start.year));
	await expect
		.element(page.getByTestId("start-hour"))
		.toHaveTextContent(String(calendarDateTime.start.hour));
	await expect
		.element(page.getByTestId("start-minute"))
		.toHaveTextContent(String(calendarDateTime.start.minute));
	await expect
		.element(page.getByTestId("start-second"))
		.toHaveTextContent(String(calendarDateTime.start.second));
	await expect.element(t.start.value).toHaveTextContent(calendarDateTime.start.toString());

	await expect.element(t.end.month).toHaveTextContent(String(calendarDateTime.end.month));
	await expect.element(t.end.day).toHaveTextContent(String(calendarDateTime.end.day));
	await expect.element(t.end.year).toHaveTextContent(String(calendarDateTime.end.year));
	await expect
		.element(page.getByTestId("end-hour"))
		.toHaveTextContent(String(calendarDateTime.end.hour));
	await expect
		.element(page.getByTestId("end-minute"))
		.toHaveTextContent(String(calendarDateTime.end.minute));
	await expect
		.element(page.getByTestId("end-second"))
		.toHaveTextContent(String(calendarDateTime.end.second));
	await expect.element(t.end.value).toHaveTextContent(calendarDateTime.end.toString());
});

it("should navigate between the fields", async () => {
	setup({
		value: calendarDate,
	});

	const fields = ["start", "end"] as const;
	const segments = ["month", "day", "year"] as const;

	const startMonth = page.getByTestId("start-month");

	await startMonth.click();

	for (const field of fields) {
		for (const segment of segments) {
			if (field === "start" && segment === "month") continue;
			const seg = page.getByTestId(`${field}-${segment}`);
			await userEvent.keyboard(kbd.ARROW_RIGHT);
			await expect.element(seg).toHaveFocus();
		}
	}

	await startMonth.click();

	for (const field of fields) {
		for (const segment of segments) {
			if (field === "start" && segment === "month") continue;
			const seg = page.getByTestId(`${field}-${segment}`);
			await userEvent.keyboard(kbd.TAB);
			await expect.element(seg).toHaveFocus();
		}
	}
});

it("should navigate between the fields - right to left", async () => {
	setup({
		value: calendarDate,
	});

	const fields = ["end", "start"] as const;
	const segments = ["year", "day", "month"] as const;

	const endYear = page.getByTestId("end-year");

	await endYear.click();

	for (const field of fields) {
		for (const segment of segments) {
			if (field === "end" && segment === "year") continue;
			const seg = page.getByTestId(`${field}-${segment}`);
			await userEvent.keyboard(kbd.ARROW_LEFT);
			await expect.element(seg).toHaveFocus();
		}
	}

	await endYear.click();

	for (const field of fields) {
		for (const segment of segments) {
			if (field === "end" && segment === "year") continue;
			const seg = page.getByTestId(`${field}-${segment}`);
			await userEvent.keyboard(kbd.SHIFT_TAB);
			await expect.element(seg).toHaveFocus();
		}
	}
});

it("should respect `bind:value` to the value", async () => {
	const t = setup({
		value: calendarDate,
	});
	await expect.element(t.start.value).toHaveTextContent(calendarDate.start.toString());
	await expect.element(t.end.value).toHaveTextContent(calendarDate.end.toString());

	await t.start.month.click();
	await userEvent.keyboard("2");
	await expect.element(t.start.value).toHaveTextContent("2022-02-01");
	await expect.element(t.end.value).toHaveTextContent(calendarDate.end.toString());
});

it("should populate calendar date with keyboard", async () => {
	const t = setup({ value: calendarDate });

	await t.start.month.click();

	await userEvent.keyboard("2142020");
	await userEvent.keyboard("2152020");

	await expect.element(t.start.value).toHaveTextContent("2020-02-14");
	await expect.element(t.end.value).toHaveTextContent("2020-02-15");
});

it("should render an input for the start and end", async () => {
	const t = setup({
		startProps: {
			name: "start-hidden-input",
		},
		endProps: {
			name: "end-hidden-input",
		},
	});
	await expect
		.element(t.container.querySelector('input[name="start-hidden-input"]'))
		.toBeInTheDocument();
	await expect
		.element(t.container.querySelector('input[name="end-hidden-input"]'))
		.toBeInTheDocument();
});

describe("respects default value if provided", () => {
	it("CalendarDate", async () => {
		const t = await open({ value: calendarDateRange });

		expect(t.getSelectedDays(t.calendar)).toHaveLength(6);

		const heading = page.getByTestId("heading");
		await expect.element(heading).toHaveTextContent("January 1980");
	});

	it("CalendarDateTime", async () => {
		const t = await open({ value: calendarDateTimeRange });

		expect(t.getSelectedDays(t.calendar)).toHaveLength(6);

		const heading = page.getByTestId("heading");
		await expect.element(heading).toHaveTextContent("January 1980");
	});

	it("ZonedDateTime", async () => {
		const t = await open({ value: zonedDateTimeRange });

		expect(t.getSelectedDays(t.calendar)).toHaveLength(6);

		const heading = page.getByTestId("heading");
		await expect.element(heading).toHaveTextContent("January 1980");
	});
});

it("should allow clearing the selected range", async () => {
	const t = await open({
		value: calendarDateRange,
	});

	expect(t.getSelectedDays(t.calendar)).toHaveLength(6);

	const clearButton = page.getByText("clear");

	await clearButton.click();
	await expectNotExists(t.getContent());
	await t.trigger.click();
	await expectExists(t.getContent());

	expect(t.getSelectedDays(t.calendar)).toHaveLength(0);
});

it("should reset range on select when a range is already selected", async () => {
	const t = await open({
		value: calendarDateRange,
	});

	const startValue = page.getByTestId("start-value");
	const endValue = page.getByTestId("end-value");

	await expect.element(startValue).toHaveTextContent(String(calendarDateRange.start));
	await expect.element(endValue).toHaveTextContent(String(calendarDateRange.end));

	const fifthDayInMonth = page.getByTestId("date-1-5");
	await fifthDayInMonth.click();
	await expect.element(fifthDayInMonth).toHaveFocus();

	const selectedDays = t.getSelectedDays(t.calendar);
	expect(selectedDays).toHaveLength(1);
	await expect.element(startValue).toHaveTextContent("1980-01-05");
	await expect.element(endValue).toHaveTextContent("undefined");
	const seventhDayInMonth = page.getByTestId("date-1-7");
	await seventhDayInMonth.click();
	await t.trigger.click();
	await expectExists(t.getContent());
	await seventhDayInMonth.click();
	await expect.element(seventhDayInMonth).toHaveFocus();
	expect(t.getSelectedDays(t.calendar)).toHaveLength(0);
});

it("should navigate the months forward using the next button", async () => {
	await open({ value: calendarDateTimeRange });

	const heading = page.getByTestId("heading");
	const nextBtn = page.getByTestId("next-button");

	for (const month of months) {
		await expect.element(heading).toHaveTextContent(`${month} 1980`);
		await nextBtn.click();
	}
	await expect.element(heading).toHaveTextContent("January 1981");
});

it("should navigate the months backwards using the prev button", async () => {
	await open({ value: calendarDateTimeRange });

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

it("should renders six weeks when `fixedWeeks` is `true`", { timeout: 10000 }, async () => {
	const t = await open({
		value: calendarDateTimeRange,
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
		value: calendarDateRange,
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
		value: calendarDateRange,
		maxValue: new CalendarDate(1980, 3, 25),
	});

	const nextBtn = page.getByTestId("next-button");
	await nextBtn.click();
	const heading = page.getByTestId("heading");
	await expect.element(heading).toHaveTextContent("February 1980");
	await expect.element(nextBtn).not.toHaveAttribute("aria-disabled", "true");
	await expect.element(nextBtn).not.toHaveAttribute("data-disabled");
	await expectExists(page.getByTestId("next-button"));

	await page.getByTestId("next-button").click();
	await expect.element(heading).toHaveTextContent("March 1980");
	await expect.element(nextBtn).toHaveAttribute("aria-disabled", "true");
	await expect.element(nextBtn).toHaveAttribute("data-disabled");

	await expectNotClickableLoc(nextBtn);
	await expect.element(heading).toHaveTextContent("March 1980");
});

it("should not navigate after `maxValue` (with keyboard)", async () => {
	await open({
		value: calendarDateRange,
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

	// four keypresses to April 1980
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
		value: calendarDateRange,
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

	// four keypresses to November 1979
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

it("should set default placeholder greater than `minValue`", async () => {
	const currentYear = new Date().getFullYear();
	const minValue = new CalendarDate(currentYear + 2, 2, 1);
	await open({minValue});
	const heading = page.getByTestId("heading");
	await expect.element(heading).toHaveTextContent(`February ${minValue.year}`);
});

it("should set default placeholder lower than `maxValue`", async () => {
	const currentYear = new Date().getFullYear();
	const maxValue = new CalendarDate(currentYear - 2, 11, 11);
	await open({maxValue});
	const heading = page.getByTestId("heading");
	await expect.element(heading).toHaveTextContent(`November ${maxValue.year}`);
});


it("should handle unavailable dates appropriately", async () => {
	await open({
		placeholder: calendarDateRange.start,
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
	await expect.element(t.start.value).toHaveTextContent(calendarDate.start.toString());
	await expect.element(t.end.value).toHaveTextContent(calendarDate.end.toString());

	await t.start.month.click();
	await userEvent.keyboard("2");
	await expect.element(t.start.value).toHaveTextContent("2022-02-01");
	await expect.element(t.end.value).toHaveTextContent(calendarDate.end.toString());
	await t.trigger.click();
	await expectExists(t.getContent());

	const heading = page.getByTestId("heading");
	await expect.element(heading).toHaveTextContent("February 2022");
});

describe("correct weekday label formatting", () => {
	it("narrow", async () => {
		await open({
			placeholder: calendarDateRange.start,
			weekdayFormat: "narrow",
		});
		for (const [i, weekday] of narrowWeekdays.entries()) {
			const weekdayEl = page.getByTestId(`weekday-1-${i}`);
			await expect.element(weekdayEl).toHaveTextContent(weekday);
		}
	});

	it("short", async () => {
		await open({
			placeholder: calendarDateRange.start,
			weekdayFormat: "short",
		});
		for (const [i, weekday] of shortWeekdays.entries()) {
			const weekdayEl = page.getByTestId(`weekday-1-${i}`);
			await expect.element(weekdayEl).toHaveTextContent(weekday);
		}
	});

	it("long`", async () => {
		await open({
			placeholder: calendarDateRange.start,
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

describe("excludeDisabled functionality", () => {
	it("should default to false and allow ranges with disabled dates", async () => {
		const t = await open({
			placeholder: new CalendarDate(1980, 1, 1),
			isDateDisabled: (date) => date.day === 6, // Jan 6 is disabled
		});

		const startValue = page.getByTestId("start-value");
		const endValue = page.getByTestId("end-value");

		// select start date (Jan 5)
		const startDay = page.getByTestId("date-1-5");
		await startDay.click();
		await expect.element(startValue).toHaveTextContent("1980-01-05");

		// select end date (Jan 8) - should include disabled Jan 6
		const endDay = page.getByTestId("date-1-8");
		await endDay.click();

		// should keep the range even though it contains a disabled date
		await expect.element(startValue).toHaveTextContent("1980-01-05");
		await expect.element(endValue).toHaveTextContent("1980-01-08");
		await t.trigger.click();
		await expectExists(t.getContent());
		expect(t.getSelectedDays(t.calendar)).toHaveLength(4); // Jan 5, 6, 7, 8 (including disabled 6)
	});

	it("should reset range when excludeDisabled is true and range contains disabled dates", async () => {
		await open({
			placeholder: new CalendarDate(1980, 1, 1),
			excludeDisabled: true,
			isDateDisabled: (date) => date.day === 6, // Jan 6 is disabled
		});

		const startValue = page.getByTestId("start-value");
		const endValue = page.getByTestId("end-value");

		// select start date (Jan 5)
		const startDay = page.getByTestId("date-1-5");
		await startDay.click();
		await expect.element(startValue).toHaveTextContent("1980-01-05");
		await expect.element(endValue).toHaveTextContent("undefined");

		// select end date (Jan 8) - would include disabled Jan 6
		const endDay = page.getByTestId("date-1-8");
		await endDay.click();

		// should reset to just the end date since range contained disabled date
		await expect.element(startValue).toHaveTextContent("1980-01-08");
		await expect.element(endValue).toHaveTextContent("undefined");
	});

	it("should allow valid ranges when excludeDisabled is true and no disabled dates in range", async () => {
		const t = await open({
			placeholder: new CalendarDate(1980, 1, 1),
			excludeDisabled: true,
			isDateDisabled: (date) => date.day === 10, // Jan 10 is disabled
		});

		const startValue = page.getByTestId("start-value");
		const endValue = page.getByTestId("end-value");

		// select start date (Jan 5)
		const startDay = page.getByTestId("date-1-5");
		await startDay.click();
		await expect.element(startValue).toHaveTextContent("1980-01-05");

		// select end date (Jan 8) - no disabled dates in range
		const endDay = page.getByTestId("date-1-8");
		await endDay.click();

		// should keep the valid range
		await expect.element(startValue).toHaveTextContent("1980-01-05");
		await expect.element(endValue).toHaveTextContent("1980-01-08");
		await t.trigger.click();
		await expectExists(t.getContent());
		expect(t.getSelectedDays(t.calendar)).toHaveLength(4); // Jan 5, 6, 7, 8
	});

	it("should reset range when selecting in reverse order with excludeDisabled true", async () => {
		await open({
			placeholder: new CalendarDate(1980, 1, 1),
			excludeDisabled: true,
			isDateDisabled: (date) => date.day === 6, // Jan 6 is disabled
		});

		const startValue = page.getByTestId("start-value");
		const endValue = page.getByTestId("end-value");

		// select "end" date first (Jan 8)
		const endDay = page.getByTestId("date-1-8");
		await endDay.click();
		await expect.element(startValue).toHaveTextContent("1980-01-08");
		await expect.element(endValue).toHaveTextContent("undefined");

		// select "start" date (Jan 5) - would include disabled Jan 6
		const startDay = page.getByTestId("date-1-5");
		await startDay.click();

		// should reset to just the start date since range would contain disabled date
		await expect.element(startValue).toHaveTextContent("1980-01-05");
		await expect.element(endValue).toHaveTextContent("undefined");
	});

	it("should handle multiple disabled dates in range", async () => {
		await open({
			placeholder: new CalendarDate(1980, 1, 1),
			excludeDisabled: true,
			isDateDisabled: (date) => date.day === 6 || date.day === 8, // Jan 6 and 8 disabled
		});

		const startValue = page.getByTestId("start-value");
		const endValue = page.getByTestId("end-value");

		// select start date (Jan 5)
		const startDay = page.getByTestId("date-1-5");
		await startDay.click();
		expect(startValue).toHaveTextContent("1980-01-05");

		// select end date (Jan 10) - would include disabled Jan 6 and 8
		const endDay = page.getByTestId("date-1-10");
		await endDay.click();

		// should reset to just the end date
		await expect.element(startValue).toHaveTextContent("1980-01-10");
		await expect.element(endValue).toHaveTextContent("undefined");
	});

	it("should handle disabled start or end dates correctly", async () => {
		const t = await open({
			placeholder: new CalendarDate(1980, 1, 1),
			excludeDisabled: true,
			isDateDisabled: (date) => date.day === 5, // Jan 5 is disabled
		});

		const startValue = page.getByTestId("start-value");
		const endValue = page.getByTestId("end-value");

		// try to select disabled date - should be prevented by base calendar logic
		const disabledDay = page.getByTestId("date-1-5");
		await expect.element(disabledDay).toHaveAttribute("aria-disabled", "true");
		await expect.element(startValue).toHaveTextContent("undefined");
		await expect.element(endValue).toHaveTextContent("undefined");

		// select valid start date (Jan 6)
		const startDay = page.getByTestId("date-1-6");
		await startDay.click();
		await expect.element(startValue).toHaveTextContent("1980-01-06");

		// select valid end date (Jan 8) - no disabled dates in range
		const endDay = page.getByTestId("date-1-8");
		await endDay.click();

		// should keep the valid range
		await expect.element(startValue).toHaveTextContent("1980-01-06");
		await expect.element(endValue).toHaveTextContent("1980-01-08");
		await t.trigger.click();
		await expectExists(t.getContent());
		expect(t.getSelectedDays(t.calendar)).toHaveLength(3); // Jan 6, 7, 8
	});

	it("should work with minDays and maxDays constraints together", async () => {
		await open({
			placeholder: new CalendarDate(1980, 1, 1),
			excludeDisabled: true,
			minDays: 3,
			maxDays: 5,
			isDateDisabled: (date) => date.day === 7, // Jan 7 is disabled
		});

		const startValue = page.getByTestId("start-value");
		const endValue = page.getByTestId("end-value");

		// select start date (Jan 5)
		const startDay = page.getByTestId("date-1-5");
		await startDay.click();
		await expect.element(startValue).toHaveTextContent("1980-01-05");

		// select end date (Jan 9) - would include disabled Jan 7, also meets minDays
		const endDay = page.getByTestId("date-1-9");
		await endDay.click();

		// should reset due to disabled date in range
		await expect.element(startValue).toHaveTextContent("1980-01-09");
		await expect.element(endValue).toHaveTextContent("undefined");

		// now select a valid range without disabled dates
		const validStartDay = page.getByTestId("date-1-10");
		await validStartDay.click();
		await expect.element(startValue).toHaveTextContent("1980-01-10");

		const validEndDay = page.getByTestId("date-1-13");
		await validEndDay.click();
		await expect.element(startValue).toHaveTextContent("1980-01-10");
		await expect.element(endValue).toHaveTextContent("1980-01-13");
	});

	it("should handle range that includes disabled dates and updates field segments", async () => {
		const t = await open({
			placeholder: new CalendarDate(1980, 1, 1),
			excludeDisabled: true,
			isDateDisabled: (date) => date.day === 6, // Jan 6 is disabled
		});

		const startValue = page.getByTestId("start-value");
		const endValue = page.getByTestId("end-value");

		// select range that includes disabled date (Jan 5 to Jan 8, with Jan 6 disabled)
		const startDay = page.getByTestId("date-1-5");
		await startDay.click();
		const endDay = page.getByTestId("date-1-8");
		await endDay.click();

		// should reset due to disabled Jan 6 in the range
		await expect.element(startValue).toHaveTextContent("1980-01-08");
		await expect.element(endValue).toHaveTextContent("undefined");

		// check that the field segments also update correctly
		await expect.element(t.start.month).toHaveTextContent("1");
		await expect.element(t.start.day).toHaveTextContent("8");
		await expect.element(t.start.year).toHaveTextContent("1980");
		await expect.element(t.end.month).toHaveTextContent("mm");
		await expect.element(t.end.day).toHaveTextContent("dd");
		await expect.element(t.end.year).toHaveTextContent("yyyy");
	});

	it("should close picker when valid range is selected and closeOnRangeSelect is true", async () => {
		const t = await open({
			placeholder: new CalendarDate(1980, 1, 1),
			excludeDisabled: true,
			closeOnRangeSelect: true,
			isDateDisabled: (date) => date.day === 10, // Jan 10 is disabled, outside our range
		});

		await expectExists(t.getContent());

		// select start date (Jan 5)
		const startDay = page.getByTestId("date-1-5");
		await startDay.click();

		// picker should still be open
		await expectExists(t.getContent());

		// select end date (Jan 8) - valid range, no disabled dates
		const endDay = page.getByTestId("date-1-8");
		await endDay.click();

		// picker should close after valid range selection
		await expectNotExists(t.getContent());
	});

	it("should not close picker when range is reset due to excludeDisabled", async () => {
		const t = await open({
			placeholder: new CalendarDate(1980, 1, 1),
			excludeDisabled: true,
			closeOnRangeSelect: true,
			isDateDisabled: (date) => date.day === 6, // Jan 6 is disabled
		});

		await expectExists(t.getContent());

		// select start date (Jan 5)
		const startDay = page.getByTestId("date-1-5");
		await startDay.click();

		// picker should still be open
		await expectExists(t.getContent());

		// select end date (Jan 8) - would include disabled Jan 6, range will be reset
		const endDay = page.getByTestId("date-1-8");
		await endDay.click();

		// picker should remain open since no complete range was selected
		await expectExists(t.getContent());
	});

	it("should not affect range when excludeDisabled is false even with disabled dates", async () => {
		const t = await open({
			placeholder: new CalendarDate(1980, 1, 1),
			excludeDisabled: false, // explicitly set to false
			isDateDisabled: (date) => date.day === 6 || date.day === 7,
		});

		const startValue = page.getByTestId("start-value");
		const endValue = page.getByTestId("end-value");

		// select range that includes multiple disabled dates
		const startDay = page.getByTestId("date-1-5");
		await startDay.click();
		const endDay = page.getByTestId("date-1-9");
		await endDay.click();

		// should keep the range despite disabled dates
		await expect.element(startValue).toHaveTextContent("1980-01-05");
		await expect.element(endValue).toHaveTextContent("1980-01-09");
		await t.trigger.click();
		await expectExists(t.getContent());
		expect(t.getSelectedDays(t.calendar)).toHaveLength(5); // includes disabled dates
	});
});
