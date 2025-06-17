import { CalendarDate, CalendarDateTime, toZoned } from "@internationalized/date";
import { getTestKbd } from "../utils";
import { expect, it, describe } from "vitest";
import { render } from "vitest-browser-svelte";
import DateRangePickerTest, {
	type DateRangePickerTestProps,
} from "./date-range-picker-test.svelte";
import { tick } from "svelte";
import { expectExists, expectNotExists, setupBrowserUserEvents } from "../browser-utils";

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
	const user = setupBrowserUserEvents();
	const returned = render(DateRangePickerTest, { ...props });
	const trigger = returned.getByTestId("trigger").element() as HTMLElement;
	const start = {
		month: returned.getByTestId("start-month").element() as HTMLElement,
		day: returned.getByTestId("start-day").element() as HTMLElement,
		year: returned.getByTestId("start-year").element() as HTMLElement,
		value: returned.getByTestId("start-value").element() as HTMLElement,
	};

	const end = {
		month: returned.getByTestId("end-month").element() as HTMLElement,
		day: returned.getByTestId("end-day").element() as HTMLElement,
		year: returned.getByTestId("end-year").element() as HTMLElement,
		value: returned.getByTestId("end-value").element() as HTMLElement,
	};
	const startInput = returned.getByTestId("start-input").element() as HTMLElement;
	const endInput = returned.getByTestId("end-input").element() as HTMLElement;
	const label = returned.getByTestId("label").element() as HTMLElement;

	function getSelectedDays(calendar: HTMLElement) {
		return calendar.querySelectorAll<HTMLElement>(SELECTED_DAY_SELECTOR);
	}

	function getContent() {
		return returned.getByTestId("content");
	}

	return {
		...returned,
		user,
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
		await t.user.click(t.trigger);
	} else {
		t.trigger.focus();
		await t.user.keyboard(openWith);
	}
	await expectExists(t.getContent());
	const content = t.getByTestId("content").element() as HTMLElement;
	const calendar = t.getByTestId("calendar").element() as HTMLElement;

	function getSelectedDays() {
		return calendar.querySelectorAll<HTMLElement>(SELECTED_DAY_SELECTOR);
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

	expect(t.start.month).toHaveTextContent(String(calendarDate.start.month));
	expect(t.start.day).toHaveTextContent(String(calendarDate.start.day));
	expect(t.start.year).toHaveTextContent(String(calendarDate.start.year));
	expect(t.start.value).toHaveTextContent(calendarDate.start.toString());

	expect(t.end.month).toHaveTextContent(String(calendarDate.end.month));
	expect(t.end.day).toHaveTextContent(String(calendarDate.end.day));
	expect(t.end.year).toHaveTextContent(String(calendarDate.end.year));
	expect(t.end.value).toHaveTextContent(calendarDate.end.toString());
});

it("should populate segment with value - `CalendarDateTime`", async () => {
	const t = setup({
		value: calendarDateTime,
		granularity: "second",
	});

	expect(t.start.month).toHaveTextContent(String(calendarDateTime.start.month));
	expect(t.start.day).toHaveTextContent(String(calendarDateTime.start.day));
	expect(t.start.year).toHaveTextContent(String(calendarDateTime.start.year));
	expect(t.getByTestId("start-hour")).toHaveTextContent(String(calendarDateTime.start.hour));
	expect(t.getByTestId("start-minute")).toHaveTextContent(String(calendarDateTime.start.minute));
	expect(t.getByTestId("start-second")).toHaveTextContent(String(calendarDateTime.start.second));
	expect(t.start.value).toHaveTextContent(calendarDateTime.start.toString());

	expect(t.end.month).toHaveTextContent(String(calendarDateTime.end.month));
	expect(t.end.day).toHaveTextContent(String(calendarDateTime.end.day));
	expect(t.end.year).toHaveTextContent(String(calendarDateTime.end.year));
	expect(t.getByTestId("end-hour")).toHaveTextContent(String(calendarDateTime.end.hour));
	expect(t.getByTestId("end-minute")).toHaveTextContent(String(calendarDateTime.end.minute));
	expect(t.getByTestId("end-second")).toHaveTextContent(String(calendarDateTime.end.second));
	expect(t.end.value).toHaveTextContent(calendarDateTime.end.toString());
});

it("should populate segment with value - `ZonedDateTime`", async () => {
	const t = setup({
		value: zonedDateTime,
		granularity: "second",
	});

	expect(t.start.month).toHaveTextContent(String(calendarDateTime.start.month));
	expect(t.start.day).toHaveTextContent(String(calendarDateTime.start.day));
	expect(t.start.year).toHaveTextContent(String(calendarDateTime.start.year));
	expect(t.getByTestId("start-hour")).toHaveTextContent(String(calendarDateTime.start.hour));
	expect(t.getByTestId("start-minute")).toHaveTextContent(String(calendarDateTime.start.minute));
	expect(t.getByTestId("start-second")).toHaveTextContent(String(calendarDateTime.start.second));
	expect(t.start.value).toHaveTextContent(calendarDateTime.start.toString());

	expect(t.end.month).toHaveTextContent(String(calendarDateTime.end.month));
	expect(t.end.day).toHaveTextContent(String(calendarDateTime.end.day));
	expect(t.end.year).toHaveTextContent(String(calendarDateTime.end.year));
	expect(t.getByTestId("end-hour")).toHaveTextContent(String(calendarDateTime.end.hour));
	expect(t.getByTestId("end-minute")).toHaveTextContent(String(calendarDateTime.end.minute));
	expect(t.getByTestId("end-second")).toHaveTextContent(String(calendarDateTime.end.second));
	expect(t.end.value).toHaveTextContent(calendarDateTime.end.toString());
});

it("should navigate between the fields", async () => {
	const t = setup({
		value: calendarDate,
	});

	const fields = ["start", "end"] as const;
	const segments = ["month", "day", "year"] as const;

	await t.user.click(t.getByTestId("start-month"));

	for (const field of fields) {
		for (const segment of segments) {
			if (field === "start" && segment === "month") continue;
			const seg = t.getByTestId(`${field}-${segment}`);
			await t.user.keyboard(kbd.ARROW_RIGHT);
			expect(seg).toHaveFocus();
		}
	}

	await t.user.click(t.getByTestId("start-month"));

	for (const field of fields) {
		for (const segment of segments) {
			if (field === "start" && segment === "month") continue;
			const seg = t.getByTestId(`${field}-${segment}`);
			await t.user.keyboard(kbd.TAB);
			expect(seg).toHaveFocus();
		}
	}
});

it("should navigate between the fields - right to left", async () => {
	const t = setup({
		value: calendarDate,
	});

	const fields = ["end", "start"] as const;
	const segments = ["year", "day", "month"] as const;

	await t.user.click(t.getByTestId("end-year"));

	for (const field of fields) {
		for (const segment of segments) {
			if (field === "end" && segment === "year") continue;
			const seg = t.getByTestId(`${field}-${segment}`);
			await t.user.keyboard(kbd.ARROW_LEFT);
			expect(seg).toHaveFocus();
		}
	}

	await t.user.click(t.getByTestId("end-year"));

	for (const field of fields) {
		for (const segment of segments) {
			if (field === "end" && segment === "year") continue;
			const seg = t.getByTestId(`${field}-${segment}`);
			await t.user.keyboard(kbd.SHIFT_TAB);
			expect(seg).toHaveFocus();
		}
	}
});

it("should respect `bind:value` to the value", async () => {
	const t = setup({
		value: calendarDate,
	});
	expect(t.start.value).toHaveTextContent(calendarDate.start.toString());
	expect(t.end.value).toHaveTextContent(calendarDate.end.toString());

	await t.user.click(t.start.month);
	await t.user.keyboard("2");
	expect(t.start.value).toHaveTextContent("2022-02-01");
	expect(t.end.value).toHaveTextContent(calendarDate.end.toString());
});

it("should populate calendar date with keyboard", async () => {
	const t = setup({ value: calendarDate });

	await t.user.click(t.start.month);

	await t.user.keyboard("2142020");
	await t.user.keyboard("2152020");

	expect(t.start.value).toHaveTextContent("2020-02-14");
	expect(t.end.value).toHaveTextContent("2020-02-15");
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
	expect(t.container.querySelector('input[name="start-hidden-input"]')).toBeInTheDocument();
	expect(t.container.querySelector('input[name="end-hidden-input"]')).toBeInTheDocument();
});

describe("respects default value if provided", () => {
	it("CalendarDate", async () => {
		const t = await open({ value: calendarDateRange });

		expect(t.getSelectedDays()).toHaveLength(6);

		const heading = t.getByTestId("heading");
		expect(heading).toHaveTextContent("January 1980");
	});

	it("CalendarDateTime", async () => {
		const t = await open({ value: calendarDateTimeRange });

		expect(t.getSelectedDays()).toHaveLength(6);

		const heading = t.getByTestId("heading");
		expect(heading).toHaveTextContent("January 1980");
	});

	it("ZonedDateTime", async () => {
		const t = await open({ value: zonedDateTimeRange });

		expect(t.getSelectedDays()).toHaveLength(6);

		const heading = t.getByTestId("heading");
		expect(heading).toHaveTextContent("January 1980");
	});
});

it("should allow clearing the selected range", async () => {
	const t = await open({
		value: calendarDateRange,
	});

	expect(t.getSelectedDays()).toHaveLength(6);

	const clearButton = t.getByText("clear");

	await t.user.click(clearButton);

	expect(t.getSelectedDays()).toHaveLength(0);
});

it("should reset range on select when a range is already selected", async () => {
	const t = await open({
		value: calendarDateRange,
	});

	const startValue = t.getByTestId("start-value");
	const endValue = t.getByTestId("end-value");

	expect(startValue).toHaveTextContent(String(calendarDateRange.start));
	expect(endValue).toHaveTextContent(String(calendarDateRange.end));

	const fifthDayInMonth = t.getByTestId("date-1-5");
	await t.user.click(fifthDayInMonth);
	expect(fifthDayInMonth).toHaveFocus();

	const selectedDays = t.getSelectedDays();
	expect(selectedDays).toHaveLength(1);
	expect(startValue).toHaveTextContent("1980-01-05");
	expect(endValue).toHaveTextContent("undefined");
	const seventhDayInMonth = t.getByTestId("date-1-7");
	await t.user.click(seventhDayInMonth);
	await tick();
	expect(t.getSelectedDays()).toHaveLength(3);
});

it("should navigate the months forward using the next button", async () => {
	const t = await open({ value: calendarDateTimeRange });

	const heading = t.getByTestId("heading");
	const nextBtn = t.getByTestId("next-button");

	for (const month of months) {
		expect(heading).toHaveTextContent(`${month} 1980`);
		await t.user.click(nextBtn);
	}
	expect(heading).toHaveTextContent("January 1981");
});

it("should navigate the months backwards using the prev button", async () => {
	const t = await open({ value: calendarDateTimeRange });

	const heading = t.getByTestId("heading");
	const prevBtn = t.getByTestId("prev-button");
	const newMonths = [...months].reverse();
	newMonths.pop();

	expect(heading).toHaveTextContent("January 1980");
	await t.user.click(prevBtn);

	for (const month of newMonths) {
		expect(heading).toHaveTextContent(`${month} 1979`);
		await t.user.click(prevBtn);
	}
	expect(heading).toHaveTextContent("January 1979");
});

it("should renders six weeks when `fixedWeeks` is `true`", { timeout: 5000 }, async () => {
	const t = await open({
		value: calendarDateTimeRange,
		fixedWeeks: true,
	});

	function getNumberOfWeeks() {
		return t.calendar.querySelectorAll("[data-week]").length;
	}

	const nextButton = t.getByTestId("next-button");

	for (let i = 0; i < 12; i++) {
		expect(getNumberOfWeeks()).toBe(6);
		await t.user.click(nextButton);
	}

	for (let i = 0; i < 24; i++) {
		expect(getNumberOfWeeks()).toBe(6);
		await t.user.click(nextButton);
	}
});

it("should not allow navigation before the `minValue` (prev button)", async () => {
	const t = await open({
		value: calendarDateRange,
		minValue: new CalendarDate(1979, 11, 25),
	});

	const prevBtn = t.getByTestId("prev-button");
	await t.user.click(prevBtn);
	const heading = t.getByTestId("heading");
	expect(heading).toHaveTextContent("December 1979");
	expect(prevBtn).not.toHaveAttribute("aria-disabled", "true");
	expect(prevBtn).not.toHaveAttribute("data-disabled");

	await t.user.click(prevBtn);
	expect(heading).toHaveTextContent("November 1979");
	expect(prevBtn).toHaveAttribute("aria-disabled", "true");
	expect(prevBtn).toHaveAttribute("data-disabled");

	await t.user.click(prevBtn);
	expect(heading).toHaveTextContent("November 1979");
});

it("should not allow navigation after the `maxValue` (next button)", async () => {
	const t = await open({
		value: calendarDateRange,
		maxValue: new CalendarDate(1980, 3, 25),
	});

	const nextBtn = t.getByTestId("next-button");
	await t.user.click(nextBtn);
	const heading = t.getByTestId("heading");
	expect(heading).toHaveTextContent("February 1980");
	expect(nextBtn).not.toHaveAttribute("aria-disabled", "true");
	expect(nextBtn).not.toHaveAttribute("data-disabled");

	await t.user.click(nextBtn);
	expect(heading).toHaveTextContent("March 1980");
	expect(nextBtn).toHaveAttribute("aria-disabled", "true");
	expect(nextBtn).toHaveAttribute("data-disabled");

	await t.user.click(nextBtn);
	expect(heading).toHaveTextContent("March 1980");
});

it("should not navigate after `maxValue` (with keyboard)", async () => {
	const t = await open({
		value: calendarDateRange,
		maxValue: new CalendarDate(1980, 3, 31),
	});

	const firstDayInMonth = t.getByTestId("date-1-1").element() as HTMLElement;
	firstDayInMonth.focus();
	expect(firstDayInMonth).toHaveFocus();

	const heading = t.getByTestId("heading");
	expect(heading).toHaveTextContent("January 1980");

	// five keypresses to February 1980
	await t.user.keyboard(kbd.ARROW_DOWN);
	expect(t.getByTestId("date-1-8")).toHaveFocus();
	await t.user.keyboard(kbd.ARROW_DOWN);
	expect(t.getByTestId("date-1-15")).toHaveFocus();
	await t.user.keyboard(kbd.ARROW_DOWN);
	expect(t.getByTestId("date-1-22")).toHaveFocus();
	await t.user.keyboard(kbd.ARROW_DOWN);
	expect(t.getByTestId("date-1-29")).toHaveFocus();
	await t.user.keyboard(kbd.ARROW_DOWN);
	expect(t.getByTestId("date-2-5")).toHaveFocus();
	expect(heading).toHaveTextContent("February 1980");

	// four keypresses to March 1980
	await t.user.keyboard(kbd.ARROW_DOWN);
	expect(t.getByTestId("date-2-12")).toHaveFocus();
	await t.user.keyboard(kbd.ARROW_DOWN);
	expect(t.getByTestId("date-2-19")).toHaveFocus();
	await t.user.keyboard(kbd.ARROW_DOWN);
	expect(t.getByTestId("date-2-26")).toHaveFocus();
	await t.user.keyboard(kbd.ARROW_DOWN);
	expect(t.getByTestId("date-3-4")).toHaveFocus();
	expect(heading).toHaveTextContent("March 1980");

	// four keypresses to April 1980
	await t.user.keyboard(kbd.ARROW_DOWN);
	expect(t.getByTestId("date-3-11")).toHaveFocus();
	await t.user.keyboard(kbd.ARROW_DOWN);
	expect(t.getByTestId("date-3-18")).toHaveFocus();
	await t.user.keyboard(kbd.ARROW_DOWN);
	expect(t.getByTestId("date-3-25")).toHaveFocus();
	await t.user.keyboard(kbd.ARROW_DOWN);
	expect(t.getByTestId("date-3-25")).toHaveFocus();
	expect(heading).toHaveTextContent("March 1980");
});

it("should not navigate before `minValue` (with keyboard)", async () => {
	const t = await open({
		value: calendarDateRange,
		minValue: new CalendarDate(1979, 12, 1),
	});

	const firstDayInMonth = t.getByTestId("date-1-1").element() as HTMLElement;
	firstDayInMonth.focus();
	expect(firstDayInMonth).toHaveFocus();

	const heading = t.getByTestId("heading");
	expect(heading).toHaveTextContent("January 1980");

	// one keypress to get to December 1979
	await t.user.keyboard(kbd.ARROW_UP);
	expect(t.getByTestId("date-12-25")).toHaveFocus();
	expect(heading).toHaveTextContent("December 1979");

	// four keypresses to November 1979
	await t.user.keyboard(kbd.ARROW_UP);
	expect(t.getByTestId("date-12-18")).toHaveFocus();
	await t.user.keyboard(kbd.ARROW_UP);
	expect(t.getByTestId("date-12-11")).toHaveFocus();
	await t.user.keyboard(kbd.ARROW_UP);
	expect(t.getByTestId("date-12-4")).toHaveFocus();
	await t.user.keyboard(kbd.ARROW_UP);
	expect(t.getByTestId("date-12-4")).toHaveFocus();
	expect(heading).toHaveTextContent("December 1979");
});

it("should handle unavailable dates appropriately", async () => {
	const t = await open({
		placeholder: calendarDateRange.start,
		isDateUnavailable: (date) => {
			return date.day === 3;
		},
	});

	const thirdDayInMonth = t.getByTestId("date-1-3").element() as HTMLElement;
	expect(thirdDayInMonth).toHaveTextContent("3");
	expect(thirdDayInMonth).toHaveAttribute("data-unavailable");
	expect(thirdDayInMonth).toHaveAttribute("aria-disabled", "true");
	await t.user.click(thirdDayInMonth);
	expect(thirdDayInMonth).not.toHaveAttribute(SELECTED_ATTR);
});

it("should sync the calendar with the input when input is changed", async () => {
	const t = setup({
		value: calendarDate,
	});
	expect(t.start.value).toHaveTextContent(calendarDate.start.toString());
	expect(t.end.value).toHaveTextContent(calendarDate.end.toString());

	await t.user.click(t.start.month);
	await t.user.keyboard("2");
	expect(t.start.value).toHaveTextContent("2022-02-01");
	expect(t.end.value).toHaveTextContent(calendarDate.end.toString());
	await t.user.click(t.trigger);
	await expectExists(t.getContent());

	const heading = t.getByTestId("heading");
	expect(heading).toHaveTextContent("February 2022");
});

describe("correct weekday label formatting", () => {
	it("narrow", async () => {
		const t = await open({
			placeholder: calendarDateRange.start,
			weekdayFormat: "narrow",
		});
		for (const [i, weekday] of narrowWeekdays.entries()) {
			const weekdayEl = t.getByTestId(`weekday-1-${i}`);
			expect(weekdayEl).toHaveTextContent(weekday);
		}
	});

	it("short", async () => {
		const t = await open({
			placeholder: calendarDateRange.start,
			weekdayFormat: "short",
		});
		for (const [i, weekday] of shortWeekdays.entries()) {
			const weekdayEl = t.getByTestId(`weekday-1-${i}`);
			expect(weekdayEl).toHaveTextContent(weekday);
		}
	});

	it("long`", async () => {
		const t = await open({
			placeholder: calendarDateRange.start,
			weekdayFormat: "long",
		});
		for (const [i, weekday] of longWeekdays.entries()) {
			const weekdayEl = t.getByTestId(`weekday-1-${i}`);
			expect(weekdayEl).toHaveTextContent(weekday);
		}
	});
});

it("should respect the `weekStartsOn` prop regardless of locale", async () => {
	const t = await open({
		placeholder: new CalendarDate(1980, 1, 1),
		weekStartsOn: 2,
		weekdayFormat: "short",
		locale: "fr",
	});
	expect(t.getByTestId("weekday-1-0").element().textContent).toBe("mar.");
});

it("should default the first day of the week to the locale's first day of the week if `weekStartsOn` is not provided", async () => {
	const t = await open({
		placeholder: new CalendarDate(1980, 1, 1),
		weekdayFormat: "short",
		locale: "fr",
	});
	expect(t.getByTestId("weekday-1-0").element().textContent).toBe("lun.");
});

describe("excludeDisabled functionality", () => {
	it("should default to false and allow ranges with disabled dates", async () => {
		const t = await open({
			placeholder: new CalendarDate(1980, 1, 1),
			isDateDisabled: (date) => date.day === 6, // Jan 6 is disabled
		});

		const startValue = t.getByTestId("start-value");
		const endValue = t.getByTestId("end-value");

		// select start date (Jan 5)
		const startDay = t.getByTestId("date-1-5");
		await t.user.click(startDay);
		expect(startValue).toHaveTextContent("1980-01-05");

		// select end date (Jan 8) - should include disabled Jan 6
		const endDay = t.getByTestId("date-1-8");
		await t.user.click(endDay);

		// should keep the range even though it contains a disabled date
		expect(startValue).toHaveTextContent("1980-01-05");
		expect(endValue).toHaveTextContent("1980-01-08");
		expect(t.getSelectedDays()).toHaveLength(4); // Jan 5, 6, 7, 8 (including disabled 6)
	});

	it("should reset range when excludeDisabled is true and range contains disabled dates", async () => {
		const t = await open({
			placeholder: new CalendarDate(1980, 1, 1),
			excludeDisabled: true,
			isDateDisabled: (date) => date.day === 6, // Jan 6 is disabled
		});

		const startValue = t.getByTestId("start-value");
		const endValue = t.getByTestId("end-value");

		// select start date (Jan 5)
		const startDay = t.getByTestId("date-1-5");
		await t.user.click(startDay);
		expect(startValue).toHaveTextContent("1980-01-05");
		expect(endValue).toHaveTextContent("undefined");

		// select end date (Jan 8) - would include disabled Jan 6
		const endDay = t.getByTestId("date-1-8");
		await t.user.click(endDay);

		// should reset to just the end date since range contained disabled date
		expect(startValue).toHaveTextContent("1980-01-08");
		expect(endValue).toHaveTextContent("undefined");
	});

	it("should allow valid ranges when excludeDisabled is true and no disabled dates in range", async () => {
		const t = await open({
			placeholder: new CalendarDate(1980, 1, 1),
			excludeDisabled: true,
			isDateDisabled: (date) => date.day === 10, // Jan 10 is disabled
		});

		const startValue = t.getByTestId("start-value");
		const endValue = t.getByTestId("end-value");

		// select start date (Jan 5)
		const startDay = t.getByTestId("date-1-5");
		await t.user.click(startDay);
		expect(startValue).toHaveTextContent("1980-01-05");

		// select end date (Jan 8) - no disabled dates in range
		const endDay = t.getByTestId("date-1-8");
		await t.user.click(endDay);

		// should keep the valid range
		expect(startValue).toHaveTextContent("1980-01-05");
		expect(endValue).toHaveTextContent("1980-01-08");
		expect(t.getSelectedDays()).toHaveLength(4); // Jan 5, 6, 7, 8
	});

	it("should reset range when selecting in reverse order with excludeDisabled true", async () => {
		const t = await open({
			placeholder: new CalendarDate(1980, 1, 1),
			excludeDisabled: true,
			isDateDisabled: (date) => date.day === 6, // Jan 6 is disabled
		});

		const startValue = t.getByTestId("start-value");
		const endValue = t.getByTestId("end-value");

		// select "end" date first (Jan 8)
		const endDay = t.getByTestId("date-1-8");
		await t.user.click(endDay);
		expect(startValue).toHaveTextContent("1980-01-08");
		expect(endValue).toHaveTextContent("undefined");

		// select "start" date (Jan 5) - would include disabled Jan 6
		const startDay = t.getByTestId("date-1-5");
		await t.user.click(startDay);

		// should reset to just the start date since range would contain disabled date
		expect(startValue).toHaveTextContent("1980-01-05");
		expect(endValue).toHaveTextContent("undefined");
	});

	it("should handle multiple disabled dates in range", async () => {
		const t = await open({
			placeholder: new CalendarDate(1980, 1, 1),
			excludeDisabled: true,
			isDateDisabled: (date) => date.day === 6 || date.day === 8, // Jan 6 and 8 disabled
		});

		const startValue = t.getByTestId("start-value");
		const endValue = t.getByTestId("end-value");

		// select start date (Jan 5)
		const startDay = t.getByTestId("date-1-5");
		await t.user.click(startDay);
		expect(startValue).toHaveTextContent("1980-01-05");

		// select end date (Jan 10) - would include disabled Jan 6 and 8
		const endDay = t.getByTestId("date-1-10");
		await t.user.click(endDay);

		// should reset to just the end date
		expect(startValue).toHaveTextContent("1980-01-10");
		expect(endValue).toHaveTextContent("undefined");
	});

	it("should handle disabled start or end dates correctly", async () => {
		const t = await open({
			placeholder: new CalendarDate(1980, 1, 1),
			excludeDisabled: true,
			isDateDisabled: (date) => date.day === 5, // Jan 5 is disabled
		});

		const startValue = t.getByTestId("start-value");
		const endValue = t.getByTestId("end-value");

		// try to select disabled date - should be prevented by base calendar logic
		const disabledDay = t.getByTestId("date-1-5");
		await t.user.click(disabledDay);
		expect(startValue).toHaveTextContent("undefined");
		expect(endValue).toHaveTextContent("undefined");

		// select valid start date (Jan 6)
		const startDay = t.getByTestId("date-1-6");
		await t.user.click(startDay);
		expect(startValue).toHaveTextContent("1980-01-06");

		// select valid end date (Jan 8) - no disabled dates in range
		const endDay = t.getByTestId("date-1-8");
		await t.user.click(endDay);

		// should keep the valid range
		expect(startValue).toHaveTextContent("1980-01-06");
		expect(endValue).toHaveTextContent("1980-01-08");
		expect(t.getSelectedDays()).toHaveLength(3); // Jan 6, 7, 8
	});

	it("should work with minDays and maxDays constraints together", async () => {
		const t = await open({
			placeholder: new CalendarDate(1980, 1, 1),
			excludeDisabled: true,
			minDays: 3,
			maxDays: 5,
			isDateDisabled: (date) => date.day === 7, // Jan 7 is disabled
		});

		const startValue = t.getByTestId("start-value");
		const endValue = t.getByTestId("end-value");

		// select start date (Jan 5)
		const startDay = t.getByTestId("date-1-5");
		await t.user.click(startDay);
		expect(startValue).toHaveTextContent("1980-01-05");

		// select end date (Jan 9) - would include disabled Jan 7, also meets minDays
		const endDay = t.getByTestId("date-1-9");
		await t.user.click(endDay);

		// should reset due to disabled date in range
		expect(startValue).toHaveTextContent("1980-01-09");
		expect(endValue).toHaveTextContent("undefined");

		// now select a valid range without disabled dates
		const validStartDay = t.getByTestId("date-1-10");
		await t.user.click(validStartDay);
		expect(startValue).toHaveTextContent("1980-01-10");

		const validEndDay = t.getByTestId("date-1-13");
		await t.user.click(validEndDay);
		expect(startValue).toHaveTextContent("1980-01-10");
		expect(endValue).toHaveTextContent("1980-01-13");
	});

	it("should handle range that includes disabled dates and updates field segments", async () => {
		const t = await open({
			placeholder: new CalendarDate(1980, 1, 1),
			excludeDisabled: true,
			isDateDisabled: (date) => date.day === 6, // Jan 6 is disabled
		});

		const startValue = t.getByTestId("start-value");
		const endValue = t.getByTestId("end-value");

		// select range that includes disabled date (Jan 5 to Jan 8, with Jan 6 disabled)
		const startDay = t.getByTestId("date-1-5");
		await t.user.click(startDay);
		const endDay = t.getByTestId("date-1-8");
		await t.user.click(endDay);

		// should reset due to disabled Jan 6 in the range
		expect(startValue).toHaveTextContent("1980-01-08");
		expect(endValue).toHaveTextContent("undefined");

		// check that the field segments also update correctly
		expect(t.start.month).toHaveTextContent("1");
		expect(t.start.day).toHaveTextContent("8");
		expect(t.start.year).toHaveTextContent("1980");
		expect(t.end.month).toHaveTextContent("mm");
		expect(t.end.day).toHaveTextContent("dd");
		expect(t.end.year).toHaveTextContent("yyyy");
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
		const startDay = t.getByTestId("date-1-5");
		await t.user.click(startDay);

		// picker should still be open
		await expectExists(t.getContent());

		// select end date (Jan 8) - valid range, no disabled dates
		const endDay = t.getByTestId("date-1-8");
		await t.user.click(endDay);

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
		const startDay = t.getByTestId("date-1-5");
		await t.user.click(startDay);

		// picker should still be open
		await expectExists(t.getContent());

		// select end date (Jan 8) - would include disabled Jan 6, range will be reset
		const endDay = t.getByTestId("date-1-8");
		await t.user.click(endDay);

		// picker should remain open since no complete range was selected
		await expectExists(t.getContent());
	});

	it("should not affect range when excludeDisabled is false even with disabled dates", async () => {
		const t = await open({
			placeholder: new CalendarDate(1980, 1, 1),
			excludeDisabled: false, // explicitly set to false
			isDateDisabled: (date) => date.day === 6 || date.day === 7,
		});

		const startValue = t.getByTestId("start-value");
		const endValue = t.getByTestId("end-value");

		// select range that includes multiple disabled dates
		const startDay = t.getByTestId("date-1-5");
		await t.user.click(startDay);
		const endDay = t.getByTestId("date-1-9");
		await t.user.click(endDay);

		// should keep the range despite disabled dates
		expect(startValue).toHaveTextContent("1980-01-05");
		expect(endValue).toHaveTextContent("1980-01-09");
		expect(t.getSelectedDays()).toHaveLength(5); // includes disabled dates
	});
});
