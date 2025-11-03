import { expect, it, describe } from "vitest";
import { render } from "vitest-browser-svelte";
import { CalendarDate, CalendarDateTime, toZoned } from "@internationalized/date";
import type { DateRange } from "bits-ui";
import { getTestKbd } from "../utils.js";
import RangeCalendarTest, { type RangeCalendarTestProps } from "./range-calendar-test.svelte";
import RangeCalendarSelectsTest from "./range-calendar-selects-test.svelte";
import { page, userEvent } from "@vitest/browser/context";

const kbd = getTestKbd();

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

function setup(props: Partial<RangeCalendarTestProps> = {}) {
	render(RangeCalendarTest, { ...props });
	const calendar = page.getByTestId("calendar");
	const prevButton = page.getByTestId("prev-button");
	const nextButton = page.getByTestId("next-button");
	expect(calendar).toBeVisible();

	function getSelectedDays() {
		return calendar.element().querySelectorAll<HTMLElement>(SELECTED_DAY_SELECTOR);
	}

	return { calendar, getSelectedDays, prevButton, nextButton };
}

describe("respects default value if provided", () => {
	it("CalendarDate", async () => {
		const t = setup({ value: calendarDateRange });

		expect(t.getSelectedDays()).toHaveLength(6);

		const heading = page.getByTestId("heading");
		await expect.element(heading).toHaveTextContent("January 1980");
	});

	it("CalendarDateTime", async () => {
		const t = setup({ value: calendarDateTimeRange });

		expect(t.getSelectedDays()).toHaveLength(6);

		const heading = page.getByTestId("heading");
		await expect.element(heading).toHaveTextContent("January 1980");
	});

	it("ZonedDateTime", async () => {
		const t = setup({ value: zonedDateTimeRange });

		expect(t.getSelectedDays()).toHaveLength(6);

		const heading = page.getByTestId("heading");
		await expect.element(heading).toHaveTextContent("January 1980");
	});
});

it("should allow clearing the selected range", async () => {
	const t = setup({
		value: calendarDateRange,
	});

	expect(t.getSelectedDays()).toHaveLength(6);

	const clearButton = page.getByText("clear");
	await clearButton.click();

	expect(t.getSelectedDays()).toHaveLength(0);
});

it("should reset range on select when a range is already selected", async () => {
	const t = setup({
		value: calendarDateRange,
	});

	const startValue = page.getByTestId("start-value");
	const endValue = page.getByTestId("end-value");

	await expect.element(startValue).toHaveTextContent(String(calendarDateRange.start));
	await expect.element(endValue).toHaveTextContent(String(calendarDateRange.end));

	const fifthDayInMonth = page.getByTestId("date-1-5");
	await fifthDayInMonth.click();
	await expect.element(fifthDayInMonth).toHaveFocus();

	const selectedDays = t.getSelectedDays();
	expect(selectedDays).toHaveLength(1);
	await expect.element(startValue).toHaveTextContent("1980-01-05");
	await expect.element(endValue).toHaveTextContent("undefined");
	const seventhDayInMonth = page.getByTestId("date-1-7");
	await seventhDayInMonth.click();
	expect(t.getSelectedDays()).toHaveLength(3);
});

it("should navigate the months forward using the next button", async () => {
	setup({ value: calendarDateTimeRange });

	const heading = page.getByTestId("heading");
	const nextBtn = page.getByTestId("next-button");

	for (const month of months) {
		await expect.element(heading).toHaveTextContent(`${month} 1980`);
		await nextBtn.click();
	}
	await expect.element(heading).toHaveTextContent("January 1981");
});

it("should navigate the months backwards using the prev button", async () => {
	setup({ value: calendarDateTimeRange });

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

it("should renders six weeks when `fixedWeeks` is `true`", async () => {
	const t = setup({
		value: calendarDateTimeRange,
		fixedWeeks: true,
	});

	function getNumberOfWeeks() {
		return t.calendar.element().querySelectorAll("[data-week]").length;
	}

	const nextButton = page.getByTestId("next-button");

	for (let i = 0; i < 6; i++) {
		expect(getNumberOfWeeks()).toBe(6);
		await nextButton.click();
	}
});

it("should not allow navigation before the `minValue` (prev button)", async () => {
	setup({
		value: calendarDateRange,
		minValue: new CalendarDate(1979, 11, 25),
	});

	const prevBtn = page.getByTestId("prev-button");
	await prevBtn.click();
	const heading = page.getByTestId("heading");
	await expect.element(heading).toHaveTextContent("December 1979");
	await expect.element(prevBtn).not.toHaveAttribute("aria-disabled", "true");
	await expect.element(prevBtn).not.toHaveAttribute("data-disabled");

	await prevBtn.click({ force: true });
	await expect.element(heading).toHaveTextContent("November 1979");
	await expect.element(prevBtn).toHaveAttribute("aria-disabled", "true");
	await expect.element(prevBtn).toHaveAttribute("data-disabled");

	await prevBtn.click({ force: true });
	await expect.element(heading).toHaveTextContent("November 1979");
});

it("should not allow navigation after the `maxValue` (next button)", async () => {
	setup({
		value: calendarDateRange,
		maxValue: new CalendarDate(1980, 3, 25),
	});

	const nextBtn = page.getByTestId("next-button");
	await nextBtn.click();
	const heading = page.getByTestId("heading");
	await expect.element(heading).toHaveTextContent("February 1980");
	await expect.element(nextBtn).not.toHaveAttribute("aria-disabled", "true");
	await expect.element(nextBtn).not.toHaveAttribute("data-disabled");

	await nextBtn.click({ force: true });
	await expect.element(heading).toHaveTextContent("March 1980");
	await expect.element(nextBtn).toHaveAttribute("aria-disabled", "true");
	await expect.element(nextBtn).toHaveAttribute("data-disabled");

	await nextBtn.click({ force: true });
	expect(heading).toHaveTextContent("March 1980");
});

it("should not navigate after `maxValue` (with keyboard)", async () => {
	setup({
		value: calendarDateRange,
		maxValue: new CalendarDate(1980, 3, 31),
	});

	const firstDayInMonth = page.getByTestId("date-1-1");
	(firstDayInMonth.element() as HTMLElement).focus();
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
	await expect.element(heading).toHaveTextContent("March 1980");
});

it("should not navigate before `minValue` (with keyboard)", async () => {
	setup({
		value: calendarDateRange,
		minValue: new CalendarDate(1979, 12, 1),
	});

	const firstDayInMonth = page.getByTestId("date-1-1");
	(firstDayInMonth.element() as HTMLElement).focus();
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
	setup({ minValue });
	const heading = page.getByTestId("heading");
	await expect.element(heading).toHaveTextContent(`February ${minValue.year}`);
});

it("should set default placeholder lower than `maxValue`", async () => {
	const currentYear = new Date().getFullYear();
	const maxValue = new CalendarDate(currentYear - 2, 11, 11);
	setup({ maxValue });
	const heading = page.getByTestId("heading");
	await expect.element(heading).toHaveTextContent(`November ${maxValue.year}`);
});


it("should handle unavailable dates appropriately", async () => {
	setup({
		placeholder: calendarDateRange.start,
		isDateUnavailable: (date) => {
			return date.day === 3;
		},
	});

	const thirdDayInMonth = page.getByTestId("date-1-3");
	await expect.element(thirdDayInMonth).toHaveTextContent("3");
	await expect.element(thirdDayInMonth).toHaveAttribute("data-unavailable");
	await expect.element(thirdDayInMonth).toHaveAttribute("aria-disabled", "true");
	await thirdDayInMonth.click({ force: true });
	await expect.element(thirdDayInMonth).not.toHaveAttribute(SELECTED_ATTR);
});

describe("correct weekday label formatting", () => {
	it("narrow", async () => {
		setup({
			placeholder: calendarDateRange.start,
			weekdayFormat: "narrow",
		});
		for (const [i, weekday] of narrowWeekdays.entries()) {
			const weekdayEl = page.getByTestId(`weekday-1-${i}`);
			await expect.element(weekdayEl).toHaveTextContent(weekday);
		}
	});

	it("short", async () => {
		setup({
			placeholder: calendarDateRange.start,
			weekdayFormat: "short",
		});
		for (const [i, weekday] of shortWeekdays.entries()) {
			const weekdayEl = page.getByTestId(`weekday-1-${i}`);
			await expect.element(weekdayEl).toHaveTextContent(weekday);
		}
	});

	it("long`", async () => {
		setup({
			placeholder: calendarDateRange.start,
			weekdayFormat: "long",
		});
		for (const [i, weekday] of longWeekdays.entries()) {
			const weekdayEl = page.getByTestId(`weekday-1-${i}`);
			await expect.element(weekdayEl).toHaveTextContent(weekday);
		}
	});
});

it("should not allow focusing on disabled dates, even if they are the only selected date, it should fallback to the first available date within the view", async () => {
	const t = setup({
		value: { start: new CalendarDate(1980, 1, 3), end: new CalendarDate(1980, 1, 3) },
		isDateDisabled: (date) => date.day === 3,
	});

	expect(document.body).toHaveFocus();
	await userEvent.keyboard(kbd.TAB);
	await expect.element(t.prevButton).toHaveFocus();
	await userEvent.keyboard(kbd.TAB);
	await expect.element(t.nextButton).toHaveFocus();
	await userEvent.keyboard(kbd.TAB);
	await expect.element(page.getByTestId("date-1-1")).toHaveFocus();
});

it("should respect the `weekStartsOn` prop regardless of locale", async () => {
	setup({
		placeholder: new CalendarDate(1980, 1, 1),
		weekStartsOn: 2,
		weekdayFormat: "short",
		locale: "fr",
	});
	await expect.element(page.getByTestId("weekday-1-0").element()).toHaveTextContent("mar.");
});

it("should default the first day of the week to the locale's first day of the week if `weekStartsOn` is not provided", async () => {
	setup({
		placeholder: new CalendarDate(1980, 1, 1),
		weekdayFormat: "short",
		locale: "fr",
	});
	await expect.element(page.getByTestId("weekday-1-0").element()).toHaveTextContent("lun.");
});

describe("minDays and maxDays constraints", () => {
	it("should reset range when selection violates minDays constraint", async () => {
		setup({
			placeholder: new CalendarDate(1980, 1, 1),
			minDays: 5,
		});

		const startValue = page.getByTestId("start-value");
		const endValue = page.getByTestId("end-value");

		// select start date (Jan 5)
		const startDay = page.getByTestId("date-1-5");
		await startDay.click();
		await expect.element(startValue).toHaveTextContent("1980-01-05");
		await expect.element(endValue).toHaveTextContent("undefined");

		// select end date only 2 days later (Jan 7) - violates minDays of 5
		const endDay = page.getByTestId("date-1-7");
		await endDay.click();

		// should reset to just the end date since it was selected most recently
		await expect.element(startValue).toHaveTextContent("1980-01-07");
		await expect.element(endValue).toHaveTextContent("undefined");
	});

	it("should reset range when selection violates maxDays constraint", async () => {
		setup({
			placeholder: new CalendarDate(1980, 1, 1),
			maxDays: 3,
		});

		const startValue = page.getByTestId("start-value");
		const endValue = page.getByTestId("end-value");

		// select start date (Jan 5)
		const startDay = page.getByTestId("date-1-5");
		await startDay.click();
		await expect.element(startValue).toHaveTextContent("1980-01-05");
		await expect.element(endValue).toHaveTextContent("undefined");

		// select end date 5 days later (Jan 10) - violates maxDays of 3 (6 days total)
		const endDay = page.getByTestId("date-1-10");
		await endDay.click();

		// should reset to just the end date since it was selected most recently
		await expect.element(startValue).toHaveTextContent("1980-01-10");
		await expect.element(endValue).toHaveTextContent("undefined");
	});

	it("should allow valid ranges within minDays constraint", async () => {
		const t = setup({
			placeholder: new CalendarDate(1980, 1, 1),
			minDays: 3,
		});

		const startValue = page.getByTestId("start-value");
		const endValue = page.getByTestId("end-value");

		// select start date (Jan 5)
		const startDay = page.getByTestId("date-1-5");
		await startDay.click();
		await expect.element(startValue).toHaveTextContent("1980-01-05");

		// select end date 3 days later (Jan 8) - exactly meets minDays of 3 (4 days total)
		const endDay = page.getByTestId("date-1-8");
		await endDay.click();

		// should keep the valid range
		await expect.element(startValue).toHaveTextContent("1980-01-05");
		await expect.element(endValue).toHaveTextContent("1980-01-08");
		expect(t.getSelectedDays()).toHaveLength(4); // Jan 5, 6, 7, 8
	});

	it("should allow valid ranges within maxDays constraint", async () => {
		const t = setup({
			placeholder: new CalendarDate(1980, 1, 1),
			maxDays: 5,
		});

		const startValue = page.getByTestId("start-value");
		const endValue = page.getByTestId("end-value");

		// select start date (Jan 5)
		const startDay = page.getByTestId("date-1-5");
		await startDay.click();
		await expect.element(startValue).toHaveTextContent("1980-01-05");

		// select end date 4 days later (Jan 9) - exactly meets maxDays of 5 (5 days total)
		const endDay = page.getByTestId("date-1-9");
		await endDay.click();

		// should keep the valid range
		await expect.element(startValue).toHaveTextContent("1980-01-05");
		await expect.element(endValue).toHaveTextContent("1980-01-09");
		expect(t.getSelectedDays()).toHaveLength(5); // Jan 5, 6, 7, 8, 9
	});

	it("should handle constraints when selecting dates in reverse order", async () => {
		setup({
			placeholder: new CalendarDate(1980, 1, 1),
			maxDays: 3,
		});

		const startValue = page.getByTestId("start-value");
		const endValue = page.getByTestId("end-value");

		// select "end" date first (Jan 10)
		const endDay = page.getByTestId("date-1-10");
		await endDay.click();
		await expect.element(startValue).toHaveTextContent("1980-01-10");
		await expect.element(endValue).toHaveTextContent("undefined");

		// select "start" date 5 days earlier (Jan 5) - violates maxDays of 3 (6 days total)
		const startDay = page.getByTestId("date-1-5");
		await startDay.click();

		// should reset to just the start date since it was selected most recently
		await expect.element(startValue).toHaveTextContent("1980-01-05");
		await expect.element(endValue).toHaveTextContent("undefined");
	});

	it("should work with both minDays and maxDays constraints together", async () => {
		const t = setup({
			placeholder: new CalendarDate(1980, 1, 1),
			minDays: 3,
			maxDays: 5,
		});

		const startValue = page.getByTestId("start-value");
		const endValue = page.getByTestId("end-value");

		// select start date (Jan 5)
		const startDay = page.getByTestId("date-1-5");
		await startDay.click();
		await expect.element(startValue).toHaveTextContent("1980-01-05");

		// try selecting too close (Jan 6) - violates minDays
		const tooCloseDay = page.getByTestId("date-1-6");
		await tooCloseDay.click();
		await expect.element(startValue).toHaveTextContent("1980-01-06");
		await expect.element(endValue).toHaveTextContent("undefined");

		// select valid range (Jan 8) - 3 days total, meets minDays
		const validDay = page.getByTestId("date-1-8");
		await validDay.click();
		await expect.element(startValue).toHaveTextContent("1980-01-06");
		await expect.element(endValue).toHaveTextContent("1980-01-08");
		expect(t.getSelectedDays()).toHaveLength(3);

		// try extending beyond maxDays by selecting a new start
		const tooFarDay = page.getByTestId("date-1-1");
		await tooFarDay.click();
		await expect.element(startValue).toHaveTextContent("1980-01-01");
		await expect.element(endValue).toHaveTextContent("undefined");
	});
});

describe("range selection data attributes", () => {
	it("should set correct data attributes for selected range", async () => {
		setup({
			placeholder: new CalendarDate(1980, 1, 1),
		});

		// select start date (Jan 5)
		const startDay = page.getByTestId("date-1-5");
		await startDay.click();
		await expect.element(startDay).toHaveAttribute("data-selected", "");
		await expect.element(startDay).toHaveAttribute("data-selection-start", "");
		await expect.element(startDay).not.toHaveAttribute("data-selection-end");

		// select end date (Jan 8)
		const endDay = page.getByTestId("date-1-8");
		await endDay.click();

		// verify start day attributes
		await expect.element(startDay).toHaveAttribute("data-selected", "");
		await expect.element(startDay).toHaveAttribute("data-selection-start", "");
		await expect.element(startDay).not.toHaveAttribute("data-selection-end");

		// verify end day attributes
		await expect.element(endDay).toHaveAttribute("data-selected", "");
		await expect.element(endDay).toHaveAttribute("data-selection-end", "");
		await expect.element(endDay).not.toHaveAttribute("data-selection-start");

		// verify middle days have data-selected
		const middleDay1 = page.getByTestId("date-1-6");
		const middleDay2 = page.getByTestId("date-1-7");
		await expect.element(middleDay1).toHaveAttribute("data-selected", "");
		await expect.element(middleDay2).toHaveAttribute("data-selected", "");
		await expect.element(middleDay1).not.toHaveAttribute("data-selection-start");
		await expect.element(middleDay1).not.toHaveAttribute("data-selection-end");
		await expect.element(middleDay2).not.toHaveAttribute("data-selection-start");
		await expect.element(middleDay2).not.toHaveAttribute("data-selection-end");

		// verify days outside range don't have selection attributes
		const beforeRange = page.getByTestId("date-1-4");
		const afterRange = page.getByTestId("date-1-9");
		await expect.element(beforeRange).not.toHaveAttribute("data-selected");
		await expect.element(beforeRange).not.toHaveAttribute("data-selection-start");
		await expect.element(beforeRange).not.toHaveAttribute("data-selection-end");
		await expect.element(afterRange).not.toHaveAttribute("data-selected");
		await expect.element(afterRange).not.toHaveAttribute("data-selection-start");
		await expect.element(afterRange).not.toHaveAttribute("data-selection-end");
	});

	it("should set correct data attributes for backward selection", async () => {
		setup({
			placeholder: new CalendarDate(1980, 1, 1),
		});

		// select "end" date first (Jan 8)
		const endDay = page.getByTestId("date-1-8");
		await endDay.click();
		await expect.element(endDay).toHaveAttribute("data-selected", "");
		await expect.element(endDay).toHaveAttribute("data-selection-start", "");

		// select "start" date (Jan 5) - should become the actual start
		const startDay = page.getByTestId("date-1-5");
		await startDay.click();

		// verify the range is properly ordered
		await expect.element(startDay).toHaveAttribute("data-selected", "");
		await expect.element(startDay).toHaveAttribute("data-selection-start", "");
		await expect.element(startDay).not.toHaveAttribute("data-selection-end");

		await expect.element(endDay).toHaveAttribute("data-selected", "");
		await expect.element(endDay).toHaveAttribute("data-selection-end", "");
		await expect.element(endDay).not.toHaveAttribute("data-selection-start");

		// verify middle days
		const middleDay1 = page.getByTestId("date-1-6");
		const middleDay2 = page.getByTestId("date-1-7");
		await expect.element(middleDay1).toHaveAttribute("data-selected", "");
		await expect.element(middleDay2).toHaveAttribute("data-selected", "");
	});

	it("should handle single day selection correctly", async () => {
		setup({
			placeholder: new CalendarDate(1980, 1, 1),
		});

		// select single date
		const singleDay = page.getByTestId("date-1-5");
		await singleDay.click();

		await expect.element(singleDay).toHaveAttribute("data-selected", "");
		await expect.element(singleDay).toHaveAttribute("data-selection-start", "");
		await expect.element(singleDay).not.toHaveAttribute("data-selection-end");

		// verify other days don't have selection attributes
		const otherDay = page.getByTestId("date-1-6");
		await expect.element(otherDay).not.toHaveAttribute("data-selected");
		await expect.element(otherDay).not.toHaveAttribute("data-selection-start");
		await expect.element(otherDay).not.toHaveAttribute("data-selection-end");
	});

	it("should clear data attributes when range is cleared", async () => {
		setup({
			value: {
				start: new CalendarDate(1980, 1, 5),
				end: new CalendarDate(1980, 1, 8),
			},
		});

		// verify initial selected range has attributes
		const startDay = page.getByTestId("date-1-5");
		const endDay = page.getByTestId("date-1-8");
		const middleDay = page.getByTestId("date-1-6");

		await expect.element(startDay).toHaveAttribute("data-selected", "");
		await expect.element(endDay).toHaveAttribute("data-selected", "");
		await expect.element(middleDay).toHaveAttribute("data-selected", "");

		// clear the range
		const clearButton = page.getByText("clear");
		await clearButton.click();

		// verify attributes are cleared
		await expect.element(startDay).not.toHaveAttribute("data-selected");
		await expect.element(startDay).not.toHaveAttribute("data-selection-start");
		await expect.element(startDay).not.toHaveAttribute("data-selection-end");
		await expect.element(endDay).not.toHaveAttribute("data-selected");
		await expect.element(endDay).not.toHaveAttribute("data-selection-start");
		await expect.element(endDay).not.toHaveAttribute("data-selection-end");
		await expect.element(middleDay).not.toHaveAttribute("data-selected");
	});

	it("should handle range reset correctly when selecting new dates", async () => {
		setup({
			value: {
				start: new CalendarDate(1980, 1, 5),
				end: new CalendarDate(1980, 1, 8),
			},
		});

		// verify initial range
		const initialStart = page.getByTestId("date-1-5");
		const initialEnd = page.getByTestId("date-1-8");
		await expect.element(initialStart).toHaveAttribute("data-selected", "");
		await expect.element(initialEnd).toHaveAttribute("data-selected", "");

		// select a new date to reset range
		const newStart = page.getByTestId("date-1-12");
		await newStart.click();

		// verify old range is cleared
		await expect.element(initialStart).not.toHaveAttribute("data-selected");
		await expect.element(initialEnd).not.toHaveAttribute("data-selected");

		// verify new selection
		await expect.element(newStart).toHaveAttribute("data-selected", "");
		await expect.element(newStart).toHaveAttribute("data-selection-start", "");
		await expect.element(newStart).not.toHaveAttribute("data-selection-end");
	});

	it("should set data-highlighted for preview range on hover", async () => {
		setup({
			placeholder: new CalendarDate(1980, 1, 1),
		});

		// select start date
		const startDay = page.getByTestId("date-1-5");
		await startDay.click();

		// hover over potential end date
		const endDay = page.getByTestId("date-1-8");
		await endDay.hover();

		// verify highlighted range (should include start through hovered day)
		await expect.element(startDay).toHaveAttribute("data-highlighted", "");
		await expect.element(page.getByTestId("date-1-6")).toHaveAttribute("data-highlighted", "");
		await expect.element(page.getByTestId("date-1-7")).toHaveAttribute("data-highlighted", "");
		await expect.element(endDay).toHaveAttribute("data-highlighted", "");

		// verify days outside preview range don't have data-highlighted
		await expect.element(page.getByTestId("date-1-4")).not.toHaveAttribute("data-highlighted");
		await expect.element(page.getByTestId("date-1-9")).not.toHaveAttribute("data-highlighted");
	});

	it("should handle highlighted range for backward hover selection", async () => {
		setup({
			placeholder: new CalendarDate(1980, 1, 1),
		});

		// select "end" date first
		const endDay = page.getByTestId("date-1-8");
		await endDay.click();

		// hover over earlier date (backward selection)
		const startDay = page.getByTestId("date-1-5");
		await startDay.hover();

		// verify highlighted range is properly ordered
		await expect.element(startDay).toHaveAttribute("data-highlighted", "");
		await expect.element(page.getByTestId("date-1-6")).toHaveAttribute("data-highlighted", "");
		await expect.element(page.getByTestId("date-1-7")).toHaveAttribute("data-highlighted", "");
		await expect.element(endDay).toHaveAttribute("data-highlighted", "");
	});
});

describe("excludeDisabled functionality", () => {
	it("should default to false and allow ranges with disabled dates", async () => {
		const t = setup({
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
		expect(t.getSelectedDays()).toHaveLength(4); // Jan 5, 6, 7, 8 (including disabled 6)
	});

	it("should reset range when excludeDisabled is true and range contains disabled dates", async () => {
		setup({
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
		const t = setup({
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
		expect(t.getSelectedDays()).toHaveLength(4); // Jan 5, 6, 7, 8
	});

	it("should reset range when selecting in reverse order with excludeDisabled true", async () => {
		setup({
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
		setup({
			placeholder: new CalendarDate(1980, 1, 1),
			excludeDisabled: true,
			isDateDisabled: (date) => date.day === 6 || date.day === 8, // Jan 6 and 8 disabled
		});

		const startValue = page.getByTestId("start-value");
		const endValue = page.getByTestId("end-value");

		// select start date (Jan 5)
		const startDay = page.getByTestId("date-1-5");
		await startDay.click();
		await expect.element(startValue).toHaveTextContent("1980-01-05");

		// select end date (Jan 10) - would include disabled Jan 6 and 8
		const endDay = page.getByTestId("date-1-10");
		await endDay.click();

		// should reset to just the end date
		await expect.element(startValue).toHaveTextContent("1980-01-10");
		await expect.element(endValue).toHaveTextContent("undefined");
	});

	it("should handle disabled start or end dates correctly", async () => {
		const t = setup({
			placeholder: new CalendarDate(1980, 1, 1),
			excludeDisabled: true,
			isDateDisabled: (date) => date.day === 5, // Jan 5 is disabled
		});

		const startValue = page.getByTestId("start-value");
		const endValue = page.getByTestId("end-value");

		// try to select disabled date - should be prevented by base calendar logic
		const disabledDay = page.getByTestId("date-1-5");
		await disabledDay.click({ force: true });
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
		expect(t.getSelectedDays()).toHaveLength(3); // Jan 6, 7, 8
	});

	it("should work with minDays and maxDays constraints together", async () => {
		setup({
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

	it("should handle single day selections correctly with excludeDisabled", async () => {
		const t = setup({
			placeholder: new CalendarDate(1980, 1, 1),
			excludeDisabled: true,
			isDateDisabled: (date) => date.day === 6,
		});

		const startValue = page.getByTestId("start-value");
		const endValue = page.getByTestId("end-value");

		// select single date (not disabled)
		const singleDay = page.getByTestId("date-1-5");
		await singleDay.click();

		await expect.element(startValue).toHaveTextContent("1980-01-05");
		await expect.element(endValue).toHaveTextContent("undefined");
		expect(t.getSelectedDays()).toHaveLength(1);

		// select another date that would include disabled date (Jan 6)
		const anotherDay = page.getByTestId("date-1-8");
		await anotherDay.click();

		// should reset to just the end date since the range would include disabled Jan 6
		await expect.element(startValue).toHaveTextContent("1980-01-08");
		await expect.element(endValue).toHaveTextContent("undefined");
		expect(t.getSelectedDays()).toHaveLength(1);
	});

	it("should handle range that becomes invalid when disabled dates change", async () => {
		const t = setup({
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

		// When we have startValue = "1980-01-08" and click Jan 10,
		// it will try to create a range from Jan 8 to Jan 10 (no disabled dates)
		// So it should successfully create a range
		const newDay = page.getByTestId("date-1-10");
		await newDay.click();

		// should create range from Jan 8 to Jan 10 since no disabled dates in between
		await expect.element(startValue).toHaveTextContent("1980-01-08");
		await expect.element(endValue).toHaveTextContent("1980-01-10");
		expect(t.getSelectedDays()).toHaveLength(3); // Jan 8, 9, 10
	});

	it("should not affect range when excludeDisabled is false even with disabled dates", async () => {
		const t = setup({
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
		expect(t.getSelectedDays()).toHaveLength(5); // includes disabled dates
	});
});

describe("RangeCalendar Select Components", () => {
	function setupWithSelects(
		props: {
			placeholder?: CalendarDate;
			value?: DateRange;
			months?: number[];
			years?: number[];
			monthFormat?: Intl.DateTimeFormatOptions["month"];
			yearFormat?: Intl.DateTimeFormatOptions["year"];
			disabled?: boolean;
			readonly?: boolean;
			minValue?: CalendarDate;
			maxValue?: CalendarDate;
		} = {}
	) {
		render(RangeCalendarSelectsTest, props);
		const calendar = page.getByTestId("calendar");
		const monthSelect = page.getByTestId("month-select");
		const yearSelect = page.getByTestId("year-select");
		expect(calendar).toBeVisible();
		return { calendar, monthSelect, yearSelect };
	}

	describe("RangeCalendar.MonthSelect", () => {
		it("should render month select with default months", async () => {
			const t = setupWithSelects({ placeholder: calendarDateRange.start });
			const monthSelect = t.monthSelect;
			const options = monthSelect.element().querySelectorAll("option");

			// should have 12 months
			expect(options).toHaveLength(12);
			await expect.element(options[0]).toHaveTextContent("January");
			await expect.element(options[11]).toHaveTextContent("December");
		});

		it("should respect custom months prop", async () => {
			const t = setupWithSelects({
				placeholder: calendarDateRange.start,
				months: [1, 2, 3], // Q1 months
			});
			const monthSelect = t.monthSelect;
			const options = monthSelect.element().querySelectorAll("option");

			expect(options).toHaveLength(3);
			await expect.element(options[0]).toHaveTextContent("January");
			await expect.element(options[1]).toHaveTextContent("February");
			await expect.element(options[2]).toHaveTextContent("March");
		});

		it("should respect monthFormat prop - short", async () => {
			const t = setupWithSelects({
				placeholder: calendarDateRange.start,
				monthFormat: "short",
			});
			const monthSelect = t.monthSelect;
			const options = monthSelect.element().querySelectorAll("option");

			await expect.element(options[0]).toHaveTextContent("Jan");
			await expect.element(options[1]).toHaveTextContent("Feb");
		});

		it("should have correct selected option for current month", async () => {
			const t = setupWithSelects({ placeholder: calendarDateRange.start }); // January 1980
			const monthSelect = t.monthSelect;
			const selectedOption = monthSelect.element().querySelector("option[selected]");

			await expect.element(selectedOption).toHaveTextContent("January");
			await expect.element(selectedOption).toHaveValue("1");
		});

		it("should update calendar when month is changed", async () => {
			const t = setupWithSelects({ placeholder: calendarDateRange.start }); // January 1980
			const monthSelect = t.monthSelect;

			// Change to March (value="3")
			await userEvent.selectOptions(monthSelect.element(), "3");

			// Calendar should show March 1980
			const grid = page.getByTestId("grid-3");
			await expect.element(grid).toBeVisible();
		});

		it("should be disabled when calendar is disabled", async () => {
			const t = setupWithSelects({
				placeholder: calendarDateRange.start,
				disabled: true,
			});
			const monthSelect = t.monthSelect;

			expect(monthSelect).toHaveAttribute("disabled");
		});
	});

	describe("RangeCalendar.YearSelect", () => {
		it("should render year select with default years", async () => {
			const t = setupWithSelects({ placeholder: calendarDateRange.start });
			const yearSelect = t.yearSelect;
			const options = yearSelect.element().querySelectorAll("option");

			// default range is 111 years when placeholder is within normal bounds
			expect(options.length).toBeGreaterThanOrEqual(111);
		});

		it("should use minValue year as exact starting boundary", async () => {
			const currentYear = new Date().getFullYear();
			const t = setupWithSelects({
				placeholder: new CalendarDate(2000, 6, 15),
				minValue: new CalendarDate(2020, 1, 1),
			});
			const yearSelect = t.yearSelect;
			const options = yearSelect.element().querySelectorAll("option");

			// should start exactly at minValue year (2020)
			const firstYear = parseInt(options[0].getAttribute("value") || "0");
			expect(firstYear).toBe(2020);

			// should end at current year + 10 (since no maxValue specified)
			const lastYear = parseInt(options[options.length - 1].getAttribute("value") || "0");
			expect(lastYear).toBe(Math.max(2000, currentYear) + 10);

			// verify range is exactly from 2020 to expected end
			const expectedLength = Math.max(2000, currentYear) + 10 - 2020 + 1;
			expect(options).toHaveLength(expectedLength);
		});

		it("should use maxValue year as exact ending boundary", async () => {
			const currentYear = new Date().getFullYear();
			const t = setupWithSelects({
				placeholder: new CalendarDate(currentYear, 6, 15),
				maxValue: new CalendarDate(2025, 12, 31),
			});
			const yearSelect = t.yearSelect;
			const options = yearSelect.element().querySelectorAll("option");

			// should end exactly at maxValue year (2025)
			const lastYear = parseInt(options[options.length - 1].getAttribute("value") || "0");
			expect(lastYear).toBe(2025);

			// should start at default minimum (since no minValue specified)
			const latestYear = Math.max(currentYear, currentYear);
			const expectedStartYear = latestYear - 100;
			const firstYear = parseInt(options[0].getAttribute("value") || "0");
			expect(firstYear).toBe(expectedStartYear);

			// verify range is exactly from expected start to 2025
			const expectedLength = 2025 - expectedStartYear + 1;
			expect(options).toHaveLength(expectedLength);
		});

		it("should use exact range defined by both minValue and maxValue", async () => {
			const t = setupWithSelects({
				placeholder: new CalendarDate(2000, 6, 15),
				minValue: new CalendarDate(2020, 1, 1),
				maxValue: new CalendarDate(2025, 12, 31),
			});
			const yearSelect = t.yearSelect;
			const options = yearSelect.element().querySelectorAll("option");

			// should have exactly years 2020-2025 (6 years)
			expect(options).toHaveLength(6);
			expect(options[0]).toHaveValue("2020");
			expect(options[5]).toHaveValue("2025");

			// verify the complete sequence 2020, 2021, 2022, 2023, 2024, 2025
			const allYears = Array.from(options).map((option) =>
				parseInt(option.getAttribute("value") || "0")
			);
			expect(allYears).toEqual([2020, 2021, 2022, 2023, 2024, 2025]);
		});

		it("should handle edge case when minValue year equals maxValue year", async () => {
			const t = setupWithSelects({
				placeholder: new CalendarDate(2000, 6, 15),
				minValue: new CalendarDate(2023, 1, 1),
				maxValue: new CalendarDate(2023, 12, 31),
			});
			const yearSelect = t.yearSelect;
			const options = yearSelect.element().querySelectorAll("option");

			// should only have one year
			expect(options).toHaveLength(1);
			expect(options[0]).toHaveValue("2023");
		});

		it("should use default range when no minValue/maxValue provided", async () => {
			const currentYear = new Date().getFullYear();
			const placeholderYear = 2010;
			const t = setupWithSelects({
				placeholder: new CalendarDate(placeholderYear, 6, 15),
			});
			const yearSelect = t.yearSelect;
			const options = yearSelect.element().querySelectorAll("option");

			// should use default logic: latestYear - 100 to latestYear + 10
			const latestYear = Math.max(placeholderYear, currentYear);
			const expectedStartYear = latestYear - 100;
			const expectedEndYear = latestYear + 10;
			const expectedLength = expectedEndYear - expectedStartYear + 1;

			expect(options).toHaveLength(expectedLength);
			expect(options[0]).toHaveValue(String(expectedStartYear));
			expect(options[options.length - 1]).toHaveValue(String(expectedEndYear));
		});

		it("should respect custom years prop", async () => {
			const t = setupWithSelects({
				placeholder: calendarDateRange.start,
				years: [2020, 2021, 2022],
			});
			const yearSelect = t.yearSelect;
			const options = yearSelect.element().querySelectorAll("option");

			expect(options).toHaveLength(3);
			expect(options[0]).toHaveTextContent("2020");
			expect(options[1]).toHaveTextContent("2021");
			expect(options[2]).toHaveTextContent("2022");
		});

		it("should have correct selected option for current year", async () => {
			const t = setupWithSelects({ placeholder: calendarDateRange.start }); // 1980
			const yearSelect = t.yearSelect;
			const selectedOption = yearSelect.element().querySelector("option[selected]");

			await expect.element(selectedOption).toHaveTextContent("1980");
			await expect.element(selectedOption).toHaveValue("1980");
		});

		it("should update calendar when year is changed", async () => {
			const t = setupWithSelects({
				placeholder: calendarDateRange.start,
				years: [1979, 1980, 1981],
			});
			const yearSelect = t.yearSelect;

			// Change to 1981
			await userEvent.selectOptions(yearSelect.element(), "1981");

			// Should still show January but now 1981
			const grid = page.getByTestId("grid-1");
			await expect.element(grid).toBeVisible();
		});

		it("should be disabled when calendar is disabled", async () => {
			const t = setupWithSelects({
				placeholder: calendarDateRange.start,
				disabled: true,
			});
			const yearSelect = t.yearSelect;

			await expect.element(yearSelect).toHaveAttribute("disabled");
		});

		it("should respect yearFormat prop - 2-digit", async () => {
			const t = setupWithSelects({
				placeholder: calendarDateRange.start,
				yearFormat: "2-digit",
				years: [1980, 1981, 1982],
			});
			const yearSelect = t.yearSelect;
			const options = yearSelect.element().querySelectorAll("option");

			expect(options[0]).toHaveTextContent("80");
			expect(options[1]).toHaveTextContent("81");
			expect(options[2]).toHaveTextContent("82");
		});

		it("should respect yearFormat prop - numeric (default)", async () => {
			const t = setupWithSelects({
				placeholder: calendarDateRange.start,
				yearFormat: "numeric",
				years: [1980, 1981, 1982],
			});
			const yearSelect = t.yearSelect;
			const options = yearSelect.element().querySelectorAll("option");

			expect(options[0]).toHaveTextContent("1980");
			expect(options[1]).toHaveTextContent("1981");
			expect(options[2]).toHaveTextContent("1982");
		});
	});

	describe("Integration with Range Selection", () => {
		it("should work together to navigate to specific month/year", async () => {
			const t = setupWithSelects({
				placeholder: calendarDateRange.start, // January 1980
				years: [1979, 1980, 1981],
			});

			// Change to March 1981
			await userEvent.selectOptions(t.monthSelect.element(), "3");
			await userEvent.selectOptions(t.yearSelect.element(), "1981");

			// Should show March 1981
			const grid = page.getByTestId("grid-3");
			await expect.element(grid).toBeVisible();
		});

		it("should maintain range selection when navigating months", async () => {
			const t = setupWithSelects({
				value: calendarDateRange, // January 20-25, 1980
			});

			// Should have a range selected initially
			await expect.element(page.getByTestId("date-1-20")).toHaveAttribute("data-selected");
			await expect.element(page.getByTestId("date-1-25")).toHaveAttribute("data-selected");

			// Change to February
			await userEvent.selectOptions(t.monthSelect.element(), "2");

			// Range should still be selected (though not visible in February)
			// Navigate back to January to verify
			await userEvent.selectOptions(t.monthSelect.element(), "1");
			await expect.element(page.getByTestId("date-1-20")).toHaveAttribute("data-selected");
			await expect.element(page.getByTestId("date-1-25")).toHaveAttribute("data-selected");
		});

		it("should allow selecting new ranges after navigation", async () => {
			const t = setupWithSelects({
				placeholder: calendarDateRange.start,
			});

			// Navigate to March
			await userEvent.selectOptions(t.monthSelect.element(), "3");

			// Select a new range in March
			const startDay = page.getByTestId("date-3-5");
			const endDay = page.getByTestId("date-3-10");

			await startDay.click();
			await endDay.click();

			// should have selected range in March
			await expect.element(startDay).toHaveAttribute("data-selected");
			await expect.element(endDay).toHaveAttribute("data-selected");
		});

		it("should handle edge cases with limited month/year arrays", async () => {
			const t = setupWithSelects({
				placeholder: new CalendarDate(2020, 6, 15),
				months: [6],
				years: [2020],
			});

			const monthOptions = t.monthSelect.element().querySelectorAll("option");
			const yearOptions = t.yearSelect.element().querySelectorAll("option");

			expect(monthOptions).toHaveLength(1);
			expect(yearOptions).toHaveLength(1);
			expect(monthOptions[0]).toHaveAttribute("selected");
			expect(yearOptions[0]).toHaveAttribute("selected");
		});
	});
});
