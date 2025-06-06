import { fireEvent, render } from "@testing-library/svelte/svelte5";
import { userEvent } from "@testing-library/user-event";
import { axe } from "jest-axe";
import { describe, it } from "vitest";
import { CalendarDate, CalendarDateTime, toZoned } from "@internationalized/date";
import { tick } from "svelte";
import { getTestKbd } from "../utils.js";
import { getSelectedDays } from "../helpers/calendar.js";
import RangeCalendarTest, { type RangeCalendarTestProps } from "./range-calendar-test.svelte";

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
	const user = userEvent.setup();
	const returned = render(RangeCalendarTest, { ...props });
	const calendar = returned.getByTestId("calendar");
	const prevButton = returned.getByTestId("prev-button");
	const nextButton = returned.getByTestId("next-button");
	expect(calendar).toBeVisible();

	function getSelectedDays() {
		return calendar.querySelectorAll<HTMLElement>(SELECTED_DAY_SELECTOR);
	}

	return { ...returned, user, calendar, getSelectedDays, prevButton, nextButton };
}

it("should have no accessibility violations", async () => {
	const { container } = render(RangeCalendarTest);
	expect(await axe(container)).toHaveNoViolations();
});

describe("respects default value if provided", () => {
	it("CalendarDate", async () => {
		const { getSelectedDays, getByTestId } = setup({ value: calendarDateRange });

		expect(getSelectedDays()).toHaveLength(6);

		const heading = getByTestId("heading");
		expect(heading).toHaveTextContent("January 1980");
	});

	it("CalendarDateTime", async () => {
		const { getSelectedDays, getByTestId } = setup({ value: calendarDateTimeRange });

		expect(getSelectedDays()).toHaveLength(6);

		const heading = getByTestId("heading");
		expect(heading).toHaveTextContent("January 1980");
	});

	it("ZonedDateTime", async () => {
		const { getSelectedDays, getByTestId } = setup({ value: zonedDateTimeRange });

		expect(getSelectedDays()).toHaveLength(6);

		const heading = getByTestId("heading");
		expect(heading).toHaveTextContent("January 1980");
	});
});

it("should allow clearing the selected range", async () => {
	const { getByText, getSelectedDays } = setup({
		value: calendarDateRange,
	});

	expect(getSelectedDays()).toHaveLength(6);

	const clearButton = getByText("clear");

	await fireEvent.click(clearButton);

	expect(getSelectedDays()).toHaveLength(0);
});

it("should reset range on select when a range is already selected", async () => {
	const { getByTestId, calendar, user } = setup({
		value: calendarDateRange,
	});

	const startValue = getByTestId("start-value");
	const endValue = getByTestId("end-value");

	expect(startValue).toHaveTextContent(String(calendarDateRange.start));
	expect(endValue).toHaveTextContent(String(calendarDateRange.end));

	const fifthDayInMonth = getByTestId("date-1-5");
	await user.click(fifthDayInMonth);
	expect(fifthDayInMonth).toHaveFocus();

	const selectedDays = getSelectedDays(calendar);
	expect(selectedDays).toHaveLength(1);
	expect(startValue).toHaveTextContent("1980-01-05");
	expect(endValue).toHaveTextContent("undefined");
	const seventhDayInMonth = getByTestId("date-1-7");
	await user.click(seventhDayInMonth);
	await tick();
	expect(getSelectedDays(calendar)).toHaveLength(3);
});

it("should navigate the months forward using the next button", async () => {
	const { getByTestId, user } = setup({ value: calendarDateTimeRange });

	const heading = getByTestId("heading");
	const nextBtn = getByTestId("next-button");

	for (const month of months) {
		expect(heading).toHaveTextContent(`${month} 1980`);
		await user.click(nextBtn);
	}
	expect(heading).toHaveTextContent("January 1981");
});

it("should navigate the months backwards using the prev button", async () => {
	const { getByTestId, user } = setup({ value: calendarDateTimeRange });

	const heading = getByTestId("heading");
	const prevBtn = getByTestId("prev-button");
	const newMonths = [...months].reverse();
	newMonths.pop();

	expect(heading).toHaveTextContent("January 1980");
	await user.click(prevBtn);

	for (const month of newMonths) {
		expect(heading).toHaveTextContent(`${month} 1979`);
		await user.click(prevBtn);
	}
	expect(heading).toHaveTextContent("January 1979");
});

it("should renders six weeks when `fixedWeeks` is `true`", async () => {
	const { getByTestId, calendar, user } = setup({
		value: calendarDateTimeRange,
		fixedWeeks: true,
	});

	function getNumberOfWeeks() {
		return calendar.querySelectorAll("[data-week]").length;
	}

	const nextButton = getByTestId("next-button");

	for (let i = 0; i < 12; i++) {
		expect(getNumberOfWeeks()).toBe(6);
		await user.click(nextButton);
	}

	for (let i = 0; i < 24; i++) {
		expect(getNumberOfWeeks()).toBe(6);
		await user.click(nextButton);
	}
});

it("should not allow navigation before the `minValue` (prev button)", async () => {
	const { getByTestId, user } = setup({
		value: calendarDateRange,
		minValue: new CalendarDate(1979, 11, 25),
	});

	const prevBtn = getByTestId("prev-button");
	await user.click(prevBtn);
	const heading = getByTestId("heading");
	expect(heading).toHaveTextContent("December 1979");
	expect(prevBtn).not.toHaveAttribute("aria-disabled", "true");
	expect(prevBtn).not.toHaveAttribute("data-disabled");

	await user.click(prevBtn);
	expect(heading).toHaveTextContent("November 1979");
	expect(prevBtn).toHaveAttribute("aria-disabled", "true");
	expect(prevBtn).toHaveAttribute("data-disabled");

	await user.click(prevBtn);
	expect(heading).toHaveTextContent("November 1979");
});

it("should not allow navigation after the `maxValue` (next button)", async () => {
	const { getByTestId, user } = setup({
		value: calendarDateRange,
		maxValue: new CalendarDate(1980, 3, 25),
	});

	const nextBtn = getByTestId("next-button");
	await user.click(nextBtn);
	const heading = getByTestId("heading");
	expect(heading).toHaveTextContent("February 1980");
	expect(nextBtn).not.toHaveAttribute("aria-disabled", "true");
	expect(nextBtn).not.toHaveAttribute("data-disabled");

	await user.click(nextBtn);
	expect(heading).toHaveTextContent("March 1980");
	expect(nextBtn).toHaveAttribute("aria-disabled", "true");
	expect(nextBtn).toHaveAttribute("data-disabled");

	await user.click(nextBtn);
	expect(heading).toHaveTextContent("March 1980");
});

it("should not navigate after `maxValue` (with keyboard)", async () => {
	const { getByTestId, user } = setup({
		value: calendarDateRange,
		maxValue: new CalendarDate(1980, 3, 31),
	});

	const firstDayInMonth = getByTestId("date-1-1");
	firstDayInMonth.focus();
	expect(firstDayInMonth).toHaveFocus();

	const heading = getByTestId("heading");
	expect(heading).toHaveTextContent("January 1980");

	// five keypresses to February 1980
	await user.keyboard(kbd.ARROW_DOWN);
	expect(getByTestId("date-1-8")).toHaveFocus();
	await user.keyboard(kbd.ARROW_DOWN);
	expect(getByTestId("date-1-15")).toHaveFocus();
	await user.keyboard(kbd.ARROW_DOWN);
	expect(getByTestId("date-1-22")).toHaveFocus();
	await user.keyboard(kbd.ARROW_DOWN);
	expect(getByTestId("date-1-29")).toHaveFocus();
	await user.keyboard(kbd.ARROW_DOWN);
	expect(getByTestId("date-2-5")).toHaveFocus();
	expect(heading).toHaveTextContent("February 1980");

	// four keypresses to March 1980
	await user.keyboard(kbd.ARROW_DOWN);
	expect(getByTestId("date-2-12")).toHaveFocus();
	await user.keyboard(kbd.ARROW_DOWN);
	expect(getByTestId("date-2-19")).toHaveFocus();
	await user.keyboard(kbd.ARROW_DOWN);
	expect(getByTestId("date-2-26")).toHaveFocus();
	await user.keyboard(kbd.ARROW_DOWN);
	expect(getByTestId("date-3-4")).toHaveFocus();
	expect(heading).toHaveTextContent("March 1980");

	// four keypresses to April 1980
	await user.keyboard(kbd.ARROW_DOWN);
	expect(getByTestId("date-3-11")).toHaveFocus();
	await user.keyboard(kbd.ARROW_DOWN);
	expect(getByTestId("date-3-18")).toHaveFocus();
	await user.keyboard(kbd.ARROW_DOWN);
	expect(getByTestId("date-3-25")).toHaveFocus();
	await user.keyboard(kbd.ARROW_DOWN);
	expect(getByTestId("date-3-25")).toHaveFocus();
	expect(heading).toHaveTextContent("March 1980");
});

it("should not navigate before `minValue` (with keyboard)", async () => {
	const { getByTestId, user } = setup({
		value: calendarDateRange,
		minValue: new CalendarDate(1979, 12, 1),
	});

	const firstDayInMonth = getByTestId("date-1-1");
	firstDayInMonth.focus();
	expect(firstDayInMonth).toHaveFocus();

	const heading = getByTestId("heading");
	expect(heading).toHaveTextContent("January 1980");

	// one keypress to get to December 1979
	await user.keyboard(kbd.ARROW_UP);
	expect(getByTestId("date-12-25")).toHaveFocus();
	expect(heading).toHaveTextContent("December 1979");

	// four keypresses to November 1979
	await user.keyboard(kbd.ARROW_UP);
	expect(getByTestId("date-12-18")).toHaveFocus();
	await user.keyboard(kbd.ARROW_UP);
	expect(getByTestId("date-12-11")).toHaveFocus();
	await user.keyboard(kbd.ARROW_UP);
	expect(getByTestId("date-12-4")).toHaveFocus();
	await user.keyboard(kbd.ARROW_UP);
	expect(getByTestId("date-12-4")).toHaveFocus();
	expect(heading).toHaveTextContent("December 1979");
});

it("should handle unavailable dates appropriately", async () => {
	const { getByTestId, user } = setup({
		placeholder: calendarDateRange.start,
		isDateUnavailable: (date) => {
			return date.day === 3;
		},
	});

	const thirdDayInMonth = getByTestId("date-1-3");
	expect(thirdDayInMonth).toHaveTextContent("3");
	expect(thirdDayInMonth).toHaveAttribute("data-unavailable");
	expect(thirdDayInMonth).toHaveAttribute("aria-disabled", "true");
	await user.click(thirdDayInMonth);
	expect(thirdDayInMonth).not.toHaveAttribute(SELECTED_ATTR);
});

describe("correct weekday label formatting", () => {
	it("narrow", async () => {
		const { getByTestId } = setup({
			placeholder: calendarDateRange.start,
			weekdayFormat: "narrow",
		});
		for (const [i, weekday] of narrowWeekdays.entries()) {
			const weekdayEl = getByTestId(`weekday-1-${i}`);
			expect(weekdayEl).toHaveTextContent(weekday);
		}
	});

	it("short", async () => {
		const { getByTestId } = setup({
			placeholder: calendarDateRange.start,
			weekdayFormat: "short",
		});
		for (const [i, weekday] of shortWeekdays.entries()) {
			const weekdayEl = getByTestId(`weekday-1-${i}`);
			expect(weekdayEl).toHaveTextContent(weekday);
		}
	});

	it("long`", async () => {
		const { getByTestId } = setup({
			placeholder: calendarDateRange.start,
			weekdayFormat: "long",
		});
		for (const [i, weekday] of longWeekdays.entries()) {
			const weekdayEl = getByTestId(`weekday-1-${i}`);
			expect(weekdayEl).toHaveTextContent(weekday);
		}
	});
});

it("should not allow focusing on disabled dates, even if they are the only selected date, it should fallback to the first available date within the view", async () => {
	const { getByTestId, user, prevButton, nextButton } = setup({
		value: { start: new CalendarDate(1980, 1, 3), end: new CalendarDate(1980, 1, 3) },
		isDateDisabled: (date) => date.day === 3,
	});

	expect(document.body).toHaveFocus();
	await user.keyboard(kbd.TAB);
	expect(prevButton).toHaveFocus();
	await user.keyboard(kbd.TAB);
	expect(nextButton).toHaveFocus();
	await user.keyboard(kbd.TAB);
	expect(getByTestId("date-1-1")).toHaveFocus();
});

it("should respect the `weekStartsOn` prop regardless of locale", async () => {
	const t = setup({
		placeholder: new CalendarDate(1980, 1, 1),
		weekStartsOn: 2,
		weekdayFormat: "short",
		locale: "fr",
	});
	expect(t.getByTestId("weekday-1-0").textContent).toBe("mar.");
});

it("should default the first day of the week to the locale's first day of the week if `weekStartsOn` is not provided", async () => {
	const t = setup({
		placeholder: new CalendarDate(1980, 1, 1),
		weekdayFormat: "short",
		locale: "fr",
	});
	expect(t.getByTestId("weekday-1-0").textContent).toBe("lun.");
});

describe("minDays and maxDays constraints", () => {
	it("should reset range when selection violates minDays constraint", async () => {
		const { getByTestId, user } = setup({
			placeholder: new CalendarDate(1980, 1, 1),
			minDays: 5,
		});

		const startValue = getByTestId("start-value");
		const endValue = getByTestId("end-value");

		// select start date (Jan 5)
		const startDay = getByTestId("date-1-5");
		await user.click(startDay);
		expect(startValue).toHaveTextContent("1980-01-05");
		expect(endValue).toHaveTextContent("undefined");

		// select end date only 2 days later (Jan 7) - violates minDays of 5
		const endDay = getByTestId("date-1-7");
		await user.click(endDay);

		// should reset to just the end date since it was selected most recently
		expect(startValue).toHaveTextContent("1980-01-07");
		expect(endValue).toHaveTextContent("undefined");
	});

	it("should reset range when selection violates maxDays constraint", async () => {
		const { getByTestId, user } = setup({
			placeholder: new CalendarDate(1980, 1, 1),
			maxDays: 3,
		});

		const startValue = getByTestId("start-value");
		const endValue = getByTestId("end-value");

		// select start date (Jan 5)
		const startDay = getByTestId("date-1-5");
		await user.click(startDay);
		expect(startValue).toHaveTextContent("1980-01-05");
		expect(endValue).toHaveTextContent("undefined");

		// select end date 5 days later (Jan 10) - violates maxDays of 3 (6 days total)
		const endDay = getByTestId("date-1-10");
		await user.click(endDay);

		// should reset to just the end date since it was selected most recently
		expect(startValue).toHaveTextContent("1980-01-10");
		expect(endValue).toHaveTextContent("undefined");
	});

	it("should allow valid ranges within minDays constraint", async () => {
		const { getByTestId, user, getSelectedDays } = setup({
			placeholder: new CalendarDate(1980, 1, 1),
			minDays: 3,
		});

		const startValue = getByTestId("start-value");
		const endValue = getByTestId("end-value");

		// select start date (Jan 5)
		const startDay = getByTestId("date-1-5");
		await user.click(startDay);
		expect(startValue).toHaveTextContent("1980-01-05");

		// select end date 3 days later (Jan 8) - exactly meets minDays of 3 (4 days total)
		const endDay = getByTestId("date-1-8");
		await user.click(endDay);

		// should keep the valid range
		expect(startValue).toHaveTextContent("1980-01-05");
		expect(endValue).toHaveTextContent("1980-01-08");
		expect(getSelectedDays()).toHaveLength(4); // Jan 5, 6, 7, 8
	});

	it("should allow valid ranges within maxDays constraint", async () => {
		const { getByTestId, user, getSelectedDays } = setup({
			placeholder: new CalendarDate(1980, 1, 1),
			maxDays: 5,
		});

		const startValue = getByTestId("start-value");
		const endValue = getByTestId("end-value");

		// select start date (Jan 5)
		const startDay = getByTestId("date-1-5");
		await user.click(startDay);
		expect(startValue).toHaveTextContent("1980-01-05");

		// select end date 4 days later (Jan 9) - exactly meets maxDays of 5 (5 days total)
		const endDay = getByTestId("date-1-9");
		await user.click(endDay);

		// should keep the valid range
		expect(startValue).toHaveTextContent("1980-01-05");
		expect(endValue).toHaveTextContent("1980-01-09");
		expect(getSelectedDays()).toHaveLength(5); // Jan 5, 6, 7, 8, 9
	});

	it("should handle constraints when selecting dates in reverse order", async () => {
		const { getByTestId, user } = setup({
			placeholder: new CalendarDate(1980, 1, 1),
			maxDays: 3,
		});

		const startValue = getByTestId("start-value");
		const endValue = getByTestId("end-value");

		// select "end" date first (Jan 10)
		const endDay = getByTestId("date-1-10");
		await user.click(endDay);
		expect(startValue).toHaveTextContent("1980-01-10");
		expect(endValue).toHaveTextContent("undefined");

		// select "start" date 5 days earlier (Jan 5) - violates maxDays of 3 (6 days total)
		const startDay = getByTestId("date-1-5");
		await user.click(startDay);

		// should reset to just the start date since it was selected most recently
		expect(startValue).toHaveTextContent("1980-01-05");
		expect(endValue).toHaveTextContent("undefined");
	});

	it("should work with both minDays and maxDays constraints together", async () => {
		const { getByTestId, user, getSelectedDays } = setup({
			placeholder: new CalendarDate(1980, 1, 1),
			minDays: 3,
			maxDays: 5,
		});

		const startValue = getByTestId("start-value");
		const endValue = getByTestId("end-value");

		// select start date (Jan 5)
		const startDay = getByTestId("date-1-5");
		await user.click(startDay);
		expect(startValue).toHaveTextContent("1980-01-05");

		// try selecting too close (Jan 6) - violates minDays
		const tooCloseDay = getByTestId("date-1-6");
		await user.click(tooCloseDay);
		expect(startValue).toHaveTextContent("1980-01-06");
		expect(endValue).toHaveTextContent("undefined");

		// select valid range (Jan 8) - 3 days total, meets minDays
		const validDay = getByTestId("date-1-8");
		await user.click(validDay);
		expect(startValue).toHaveTextContent("1980-01-06");
		expect(endValue).toHaveTextContent("1980-01-08");
		expect(getSelectedDays()).toHaveLength(3);

		// try extending beyond maxDays by selecting a new start
		const tooFarDay = getByTestId("date-1-1");
		await user.click(tooFarDay);
		expect(startValue).toHaveTextContent("1980-01-01");
		expect(endValue).toHaveTextContent("undefined");
	});
});
