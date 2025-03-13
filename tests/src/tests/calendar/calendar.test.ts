import { render } from "@testing-library/svelte/svelte5";
import { axe } from "jest-axe";
import { describe, it } from "vitest";
import { CalendarDate, CalendarDateTime, toZoned } from "@internationalized/date";
import { getTestKbd, setupUserEvents } from "../utils.js";
import { getSelectedDay, getSelectedDays } from "../helpers/calendar.js";
import CalendarTest, { type CalendarSingleTestProps } from "./calendar-test.svelte";
import CalendarMultiTest, { type CalendarMultiTestProps } from "./calendar-multi-test.svelte";

const kbd = getTestKbd();

const calendarDate = new CalendarDate(1980, 1, 20);
const calendarDateTime = new CalendarDateTime(1980, 1, 20, 12, 30, 0, 0);
const zonedDateTime = toZoned(calendarDateTime, "America/New_York");

const narrowWeekdays = ["S", "M", "T", "W", "T", "F", "S"];
const shortWeekdays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const longWeekdays = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
// prettier-ignore
const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

function setup(props: Partial<CalendarSingleTestProps> = {}) {
	const user = setupUserEvents();
	const returned = render(CalendarTest, { ...props, type: "single" });
	const calendar = returned.getByTestId("calendar");
	const prevButton = returned.getByTestId("prev-button");
	const nextButton = returned.getByTestId("next-button");
	expect(calendar).toBeVisible();
	return { ...returned, user, calendar, prevButton, nextButton };
}

function setupMulti(props: Partial<CalendarMultiTestProps> = {}) {
	const user = setupUserEvents();
	const returned = render(CalendarMultiTest, { ...props, type: "multiple" });
	const calendar = returned.getByTestId("calendar");
	const prevButton = returned.getByTestId("prev-button");
	const nextButton = returned.getByTestId("next-button");
	expect(calendar).toBeVisible();
	return { ...returned, user, calendar, prevButton, nextButton };
}

describe("Shared Behavior", () => {
	it("should have no accessibility violations", async () => {
		const { container } = render(CalendarTest);
		expect(await axe(container)).toHaveNoViolations();
	});
});

describe("type='single'", () => {
	describe("Value Handling", () => {
		it("should respect a default value if provided - `CalendarDate`", async () => {
			const t = setup({ value: calendarDate });
			expect(getSelectedDay(t.calendar)).toHaveTextContent(String(calendarDate.day));
			expect(t.getByTestId("heading")).toHaveTextContent("January 1980");
		});

		it("should respect a default value if provided - `CalendarDateTime`", async () => {
			const t = setup({ value: calendarDateTime });
			expect(getSelectedDay(t.calendar)).toHaveTextContent(String(calendarDateTime.day));
			expect(t.getByTestId("heading")).toHaveTextContent("January 1980");
		});

		it("should respect a default value if provided - `ZonedDateTime`", async () => {
			const t = setup({ value: zonedDateTime });
			expect(getSelectedDay(t.calendar)).toHaveTextContent(String(zonedDateTime.day));
			expect(t.getByTestId("heading")).toHaveTextContent("January 1980");
		});

		it("should bind to `value` - `CalendarDate`", async () => {
			const t = setup({ value: calendarDate });
			const addDayBtn = t.getByTestId("add-day");
			await t.user.click(addDayBtn);
			const valueEl = t.getByTestId("value");
			expect(valueEl).toHaveTextContent("1980-01-21");
			const addMonthBtn = t.getByTestId("add-month");
			await t.user.click(addMonthBtn);
			expect(valueEl).toHaveTextContent("1980-02-21");
			const addYearBtn = t.getByTestId("add-year");
			await t.user.click(addYearBtn);
			expect(valueEl).toHaveTextContent("1981-02-21");
		});

		it("should bind to `value` - `CalendarDateTime`", async () => {
			const t = setup({ value: calendarDateTime });
			const addDayBtn = t.getByTestId("add-day");
			await t.user.click(addDayBtn);
			const valueEl = t.getByTestId("value");
			expect(valueEl).toHaveTextContent("1980-01-21");
			const addMonthBtn = t.getByTestId("add-month");
			await t.user.click(addMonthBtn);
			expect(valueEl).toHaveTextContent("1980-02-21");
			const addYearBtn = t.getByTestId("add-year");
			await t.user.click(addYearBtn);
			expect(valueEl).toHaveTextContent("1981-02-21");
		});

		it("properly binds to `value` - `ZonedDateTime`", async () => {
			const t = setup({ value: zonedDateTime });
			const addDayBtn = t.getByTestId("add-day");
			await t.user.click(addDayBtn);
			const valueEl = t.getByTestId("value");
			expect(valueEl).toHaveTextContent("1980-01-21");
			const addMonthBtn = t.getByTestId("add-month");
			await t.user.click(addMonthBtn);
			expect(valueEl).toHaveTextContent("1980-02-21");
			const addYearBtn = t.getByTestId("add-year");
			await t.user.click(addYearBtn);
			expect(valueEl).toHaveTextContent("1981-02-21");
		});

		it("should update the selected date when value controlled externally", async () => {
			const t = setup({ value: calendarDate });
			const selectedDate = getSelectedDay(t.calendar);
			expect(selectedDate).toHaveTextContent("20");
			expect(getSelectedDays(t.calendar).length).toBe(1);
			const addDayBtn = t.getByTestId("add-day");
			await t.user.click(addDayBtn);
			expect(getSelectedDay(t.calendar)).toHaveTextContent("21");
			expect(getSelectedDays(t.calendar).length).toBe(1);
		});
	});

	describe("Navigation", () => {
		it("should navigate the months forward using the next button", async () => {
			const t = setup({ value: calendarDate });
			const heading = t.getByTestId("heading");
			const nextBtn = t.getByTestId("next-button");
			for (const month of months) {
				expect(heading).toHaveTextContent(`${month} 1980`);
				await t.user.click(nextBtn);
			}
			expect(heading).toHaveTextContent("January 1981");
		});

		it("should navigate the months backwards using the prev button", async () => {
			const t = setup({ value: calendarDate });
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

		it("should not allow navigation before the `minValue` (prev button)", async () => {
			const t = setup({
				value: calendarDate,
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
			const t = setup({
				value: calendarDate,
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
			const t = setup({
				value: calendarDate,
				maxValue: new CalendarDate(1980, 3, 31),
			});
			const firstDayInMonth = t.getByTestId("date-1-1");
			firstDayInMonth.focus();
			expect(firstDayInMonth).toHaveFocus();
			const heading = t.getByTestId("heading");
			expect(heading).toHaveTextContent("January 1980");
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
			await t.user.keyboard(kbd.ARROW_DOWN);
			expect(t.getByTestId("date-2-12")).toHaveFocus();
			await t.user.keyboard(kbd.ARROW_DOWN);
			expect(t.getByTestId("date-2-19")).toHaveFocus();
			await t.user.keyboard(kbd.ARROW_DOWN);
			expect(t.getByTestId("date-2-26")).toHaveFocus();
			await t.user.keyboard(kbd.ARROW_DOWN);
			expect(t.getByTestId("date-3-4")).toHaveFocus();
			expect(heading).toHaveTextContent("March 1980");
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
			const t = setup({
				value: calendarDate,
				minValue: new CalendarDate(1979, 12, 1),
			});
			const firstDayInMonth = t.getByTestId("date-1-1");
			firstDayInMonth.focus();
			expect(firstDayInMonth).toHaveFocus();
			const heading = t.getByTestId("heading");
			expect(heading).toHaveTextContent("January 1980");
			await t.user.keyboard(kbd.ARROW_UP);
			expect(t.getByTestId("date-12-25")).toHaveFocus();
			expect(heading).toHaveTextContent("December 1979");
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

		it("should change view when controlled placeholder changes", async () => {
			const t = setup({ placeholder: calendarDate });
			const heading = t.getByTestId("heading");
			expect(heading).toHaveTextContent("January 1980");
			const addMonthBtn = t.getByTestId("add-month");
			await t.user.click(addMonthBtn);
			expect(heading).toHaveTextContent("February 1980");
			const addYearBtn = t.getByTestId("add-year");
			await t.user.click(addYearBtn);
			expect(heading).toHaveTextContent("February 1981");
			await t.user.click(addMonthBtn);
			await t.user.click(addMonthBtn);
			await t.user.click(addMonthBtn);
			expect(heading).toHaveTextContent("May 1981");
		});
	});

	describe("Selection and Deselection", () => {
		it("should allow dates to be deselected by clicking the selected date", async () => {
			const t = setup({ value: calendarDate });
			const value = t.getByTestId("value");
			expect(value).toHaveTextContent("1980-01-20");
			const selectedDay = getSelectedDay(t.calendar);
			expect(selectedDay).toHaveTextContent(String(calendarDate.day));
			await t.user.click(selectedDay);
			expect(value).toHaveTextContent("undefined");
		});

		it.each([kbd.ENTER, kbd.SPACE])("should allow deselection with %s key", async (key) => {
			const t = setup({ value: calendarDate });
			const value = t.getByTestId("value");
			expect(value).toHaveTextContent("1980-01-20");
			const selectedDay = getSelectedDay(t.calendar);
			expect(selectedDay).toHaveTextContent(String(calendarDate.day));
			selectedDay.focus();
			await t.user.keyboard(key);
			expect(value).toHaveTextContent("undefined");
		});

		it("should allow selection with mouse", async () => {
			const t = setup({ placeholder: zonedDateTime });
			const secondDayInMonth = t.getByTestId("date-1-2");
			expect(secondDayInMonth).toHaveTextContent("2");
			await t.user.click(secondDayInMonth);
			const newDate = zonedDateTime.set({ day: 2 });
			expect(t.getByTestId("value")).toHaveTextContent(newDate.toString());
		});

		it.each([kbd.SPACE, kbd.ENTER])("should allow selection with %s key", async (key) => {
			const t = setup({ placeholder: zonedDateTime });
			const secondDayInMonth = t.getByTestId("date-1-2");
			expect(secondDayInMonth).toHaveTextContent("2");
			secondDayInMonth.focus();
			await t.user.keyboard(key);
			const newDate = zonedDateTime.set({ day: 2 });
			expect(t.getByTestId("value")).toHaveTextContent(newDate.toString());
		});
	});

	describe("Multi-Month Display", () => {
		it("should display multiple months when `numberOfMonths` is greater than 1", async () => {
			const t = setup({
				value: calendarDateTime,
				numberOfMonths: 2,
			});
			const selectedDay = getSelectedDay(t.calendar);
			expect(selectedDay).toHaveTextContent(String(calendarDateTime.day));
			const heading = t.getByTestId("heading");
			expect(heading).toHaveTextContent("January - February 1980");
			const firstMonthDayDateStr = calendarDateTime.set({ day: 12 }).toString();
			const firstMonthDay = t.getByTestId("date-1-12");
			expect(firstMonthDay).toHaveTextContent("12");
			expect(firstMonthDay).toHaveAttribute("data-value", firstMonthDayDateStr);
			const secondMonthDay = t.getByTestId("date-2-15");
			const secondMonthDayDateStr = calendarDateTime.set({ day: 15, month: 2 }).toString();
			expect(secondMonthDay).toHaveTextContent("15");
			expect(secondMonthDay).toHaveAttribute("data-value", secondMonthDayDateStr);
			const prevButton = t.getByTestId("prev-button");
			const nextButton = t.getByTestId("next-button");
			await t.user.click(nextButton);
			expect(heading).toHaveTextContent("February - March 1980");
			expect(firstMonthDay).not.toHaveAttribute("data-value", firstMonthDayDateStr);
			await t.user.click(prevButton);
			expect(heading).toHaveTextContent("January - February 1980");
			expect(firstMonthDay).toHaveAttribute("data-value", firstMonthDayDateStr);
			await t.user.click(prevButton);
			expect(heading).toHaveTextContent("December 1979 - January 1980");
			expect(firstMonthDay).not.toHaveAttribute("data-value", firstMonthDayDateStr);
		});

		it("should handle `pagedNavigation` with multiple months", async () => {
			const t = setup({
				value: calendarDateTime,
				numberOfMonths: 2,
				pagedNavigation: true,
			});
			const selectedDay = getSelectedDay(t.calendar);
			expect(selectedDay).toHaveTextContent(String(calendarDateTime.day));
			const heading = t.getByTestId("heading");
			expect(heading).toHaveTextContent("January - February 1980");
			const firstMonthDayDateStr = calendarDateTime.set({ day: 12 }).toString();
			const firstMonthDay = t.getByTestId("date-1-12");
			expect(firstMonthDay).toHaveTextContent("12");
			expect(firstMonthDay).toHaveAttribute("data-value", firstMonthDayDateStr);
			const secondMonthDay = t.getByTestId("date-2-15");
			const secondMonthDayDateStr = calendarDateTime.set({ day: 15, month: 2 }).toString();
			expect(secondMonthDay).toHaveTextContent("15");
			expect(secondMonthDay).toHaveAttribute("data-value", secondMonthDayDateStr);
			const prevButton = t.getByTestId("prev-button");
			const nextButton = t.getByTestId("next-button");
			await t.user.click(nextButton);
			expect(heading).toHaveTextContent("March - April 1980");
			expect(firstMonthDay).not.toHaveAttribute("data-value", firstMonthDayDateStr);
			await t.user.click(prevButton);
			expect(heading).toHaveTextContent("January - February 1980");
			expect(firstMonthDay).toHaveAttribute("data-value", firstMonthDayDateStr);
			await t.user.click(prevButton);
			expect(heading).toHaveTextContent("November - December 1979");
			expect(firstMonthDay).not.toHaveAttribute("data-value", firstMonthDayDateStr);
		});
	});

	describe("Rendering Options", () => {
		it("should render six weeks when `fixedWeeks` is `true`", async () => {
			const t = setup({
				value: calendarDate,
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

		it("should format the weekday labels correctly - `'narrow'`", async () => {
			const t = setup({
				placeholder: calendarDate,
				weekdayFormat: "narrow",
			});
			for (const [i, weekday] of narrowWeekdays.entries()) {
				const weekdayEl = t.getByTestId(`weekday-1-${i}`);
				expect(weekdayEl).toHaveTextContent(weekday);
			}
		});

		it("should format the weekday labels correctly - `'short'`", async () => {
			const t = setup({
				placeholder: calendarDate,
				weekdayFormat: "short",
			});
			for (const [i, weekday] of shortWeekdays.entries()) {
				const weekdayEl = t.getByTestId(`weekday-1-${i}`);
				expect(weekdayEl).toHaveTextContent(weekday);
			}
		});

		it("should format the weekday labels correctly - `'long'`", async () => {
			const t = setup({ placeholder: calendarDate, weekdayFormat: "long" });
			for (const [i, weekday] of longWeekdays.entries()) {
				const weekdayEl = t.getByTestId(`weekday-1-${i}`);
				expect(weekdayEl).toHaveTextContent(weekday);
			}
		});
	});

	describe("Availability and Interaction", () => {
		it("should handle unavailable dates appropriately", async () => {
			const t = setup({
				placeholder: calendarDate,
				isDateUnavailable: (date) => date.day === 3,
			});
			const thirdDayInMonth = t.getByTestId("date-1-3");
			expect(thirdDayInMonth).toHaveTextContent("3");
			expect(thirdDayInMonth).toHaveAttribute("data-unavailable");
			expect(thirdDayInMonth).toHaveAttribute("aria-disabled", "true");
			await t.user.click(thirdDayInMonth);
			expect(thirdDayInMonth).not.toHaveAttribute("data-selected");
		});

		it("should not allow focus or interaction when `disabled` is `true`", async () => {
			const t = setup({ placeholder: calendarDate, disabled: true });
			const grid = t.getByTestId("grid-1");
			expect(grid).toHaveAttribute("aria-disabled", "true");
			expect(grid).toHaveAttribute("data-disabled");
			const firstDayOfMonth = t.getByTestId("date-1-1");
			expect(firstDayOfMonth).toHaveAttribute("aria-disabled", "true");
			expect(firstDayOfMonth).toHaveAttribute("data-disabled");
			await t.user.click(firstDayOfMonth);
			expect(firstDayOfMonth).not.toHaveAttribute("data-selected");
			firstDayOfMonth.focus();
			expect(firstDayOfMonth).not.toHaveFocus();
			const tenthDayOfMonth = t.getByTestId("date-1-10");
			expect(tenthDayOfMonth).toHaveAttribute("aria-disabled", "true");
			expect(tenthDayOfMonth).toHaveAttribute("data-disabled");
			await t.user.click(tenthDayOfMonth);
			expect(tenthDayOfMonth).not.toHaveAttribute("data-selected");
			tenthDayOfMonth.focus();
			expect(tenthDayOfMonth).not.toHaveFocus();
		});

		it("should prevent selection but allow focus when `readonly` is `true`", async () => {
			const t = setup({ placeholder: calendarDate, readonly: true });
			const grid = t.getByTestId("grid-1");
			expect(grid).toHaveAttribute("aria-readonly", "true");
			expect(grid).toHaveAttribute("data-readonly");
			const firstDayOfMonth = t.getByTestId("date-1-1");
			await t.user.click(firstDayOfMonth);
			expect(firstDayOfMonth).not.toHaveAttribute("data-selected");
			firstDayOfMonth.focus();
			expect(firstDayOfMonth).toHaveFocus();
			const tenthDayOfMonth = t.getByTestId("date-1-10");
			await t.user.click(tenthDayOfMonth);
			expect(tenthDayOfMonth).not.toHaveAttribute("data-selected");
			tenthDayOfMonth.focus();
			expect(tenthDayOfMonth).toHaveFocus();
		});

		it("should not allow focusing on disabled dates, even if selected, falling back to first available date", async () => {
			const t = setup({
				value: new CalendarDate(1980, 1, 3),
				isDateDisabled: (date) => date.day === 3,
			});
			expect(document.body).toHaveFocus();
			await t.user.keyboard(kbd.TAB);
			expect(t.prevButton).toHaveFocus();
			await t.user.keyboard(kbd.TAB);
			expect(t.nextButton).toHaveFocus();
			await t.user.keyboard(kbd.TAB);
			expect(t.getByTestId("date-1-1")).toHaveFocus();
		});
	});
});

describe("type='multiple'", () => {
	describe("Value Handling", () => {
		it("should handle default value when `value` prop is provided - `CalendarDate[]`", async () => {
			const d1 = new CalendarDate(1980, 1, 2);
			const d2 = new CalendarDate(1980, 1, 5);
			const t = setupMulti({ value: [d1, d2] });
			const selectedDays = getSelectedDays(t.calendar);
			expect(selectedDays.length).toBe(2);
			expect(selectedDays[0]).toHaveTextContent(String(d1.day));
			expect(selectedDays[1]).toHaveTextContent(String(d2.day));
		});

		it("should handle default value when `value` prop is provided - `CalendarDateTime[]`", async () => {
			const d1 = new CalendarDateTime(1980, 1, 2);
			const d2 = new CalendarDateTime(1980, 1, 5);
			const t = setupMulti({ value: [d1, d2] });
			const selectedDays = getSelectedDays(t.calendar);
			expect(selectedDays.length).toBe(2);
			expect(selectedDays[0]).toHaveTextContent(String(d1.day));
			expect(selectedDays[1]).toHaveTextContent(String(d2.day));
		});

		it("should handle default value when `value` prop is provided - `ZonedDateTime[]`", async () => {
			const d1 = toZoned(new CalendarDateTime(1980, 1, 2), "America/New_York");
			const d2 = toZoned(new CalendarDateTime(1980, 1, 5), "America/New_York");
			const t = setupMulti({ value: [d1, d2] });
			const selectedDays = getSelectedDays(t.calendar);
			expect(selectedDays.length).toBe(2);
			expect(selectedDays[0]).toHaveTextContent(String(d1.day));
			expect(selectedDays[1]).toHaveTextContent(String(d2.day));
		});

		it("should set placeholder to last value in `value` prop", async () => {
			const d1 = new CalendarDate(1980, 1, 2);
			const d2 = new CalendarDate(1980, 5, 5);
			const t = setupMulti({ value: [d1, d2] });
			const selectedDays = getSelectedDays(t.calendar);
			expect(selectedDays.length).toBe(1);
			expect(t.getByTestId("heading")).toHaveTextContent("May 1980");
		});
	});

	describe("Selection and Deselection", () => {
		it("should allow deselection", async () => {
			const d1 = new CalendarDate(1980, 1, 2);
			const d2 = new CalendarDate(1980, 1, 5);
			const t = setupMulti({ value: [d1, d2] });
			const selectedDays = getSelectedDays(t.calendar);
			expect(selectedDays.length).toBe(2);
			await t.user.click(selectedDays[0] as HTMLElement);
			expect(getSelectedDays(t.calendar).length).toBe(1);
		});

		it("should prevent deselection when only one date is selected and `preventDeselect` is `true`", async () => {
			const d1 = new CalendarDate(1980, 1, 2);
			const t = setupMulti({ value: [d1], preventDeselect: true });
			const selectedDays = getSelectedDays(t.calendar);
			await t.user.click(selectedDays[0] as HTMLElement);
			const selectedDays2 = getSelectedDays(t.calendar);
			expect(selectedDays2.length).toBe(1);
			await t.user.click(selectedDays2[0] as HTMLElement);
			expect(getSelectedDays(t.calendar).length).toBe(1);
		});
	});

	describe("Availability and Interaction", () => {
		it("should not allow focusing on disabled dates, even if selected, falling back to first available date", async () => {
			const t = setupMulti({
				value: [new CalendarDate(1980, 1, 3)],
				isDateDisabled: (date) => date.day === 3,
			});
			expect(document.body).toHaveFocus();
			await t.user.keyboard(kbd.TAB);
			expect(t.prevButton).toHaveFocus();
			await t.user.keyboard(kbd.TAB);
			expect(t.nextButton).toHaveFocus();
			await t.user.keyboard(kbd.TAB);
			expect(t.getByTestId("date-1-1")).toHaveFocus();
		});
	});
});
