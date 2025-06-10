import { render } from "@testing-library/svelte/svelte5";
import { axe } from "jest-axe";
import { describe, it } from "vitest";
import { CalendarDate, CalendarDateTime, toZoned } from "@internationalized/date";
import { getTestKbd, setupUserEvents } from "../utils.js";
import { getSelectedDay, getSelectedDays } from "../helpers/calendar.js";
import CalendarTest, { type CalendarSingleTestProps } from "./calendar-test.svelte";
import CalendarMultiTest, { type CalendarMultiTestProps } from "./calendar-multi-test.svelte";
import CalendarSelectsTest from "./calendar-selects-test.svelte";

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

		it("should persist time when selecting a date (CalendarDateTime)", async () => {
			const t = setup({ value: calendarDateTime });
			const value = t.getByTestId("value");
			expect(value).toHaveTextContent(calendarDateTime.toString());
			await t.user.click(t.getByTestId("set-time"));
			expect(value).toHaveTextContent(
				calendarDateTime
					.set({ hour: 15, minute: 15, second: 15, millisecond: 15 })
					.toString()
			);
			const firstDayInMonth = t.getByTestId("date-1-1");
			await t.user.click(firstDayInMonth);
			expect(value).toHaveTextContent(
				calendarDateTime
					.set({ day: 1, hour: 15, minute: 15, second: 15, millisecond: 15 })
					.toString()
			);
		});

		it("should persist time when selecting a date (ZonedDateTime)", async () => {
			const t = setup({ value: zonedDateTime });
			const value = t.getByTestId("value");
			expect(value).toHaveTextContent(zonedDateTime.toString());
			await t.user.click(t.getByTestId("set-time"));
			expect(value).toHaveTextContent(
				zonedDateTime.set({ hour: 15, minute: 15, second: 15, millisecond: 15 }).toString()
			);
			const firstDayInMonth = t.getByTestId("date-1-1");
			await t.user.click(firstDayInMonth);
			expect(value).toHaveTextContent(
				zonedDateTime
					.set({ day: 1, hour: 15, minute: 15, second: 15, millisecond: 15 })
					.toString()
			);
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

		it("should respect the `weekStartsOn` prop", async () => {
			const t = setup({ placeholder: calendarDate, weekStartsOn: 2, weekdayFormat: "short" });
			expect(t.getByTestId("weekday-1-0").textContent).toBe("Tue");
		});

		it("should respect the `weekStartsOn` prop regardless of locale", async () => {
			const t = setup({
				placeholder: calendarDate,
				weekStartsOn: 2,
				weekdayFormat: "short",
				locale: "fr",
			});
			expect(t.getByTestId("weekday-1-0").textContent).toBe("mar.");
		});

		it("should default the first day of the week to the locale's first day of the week if `weekStartsOn` is not provided", async () => {
			const t = setup({
				placeholder: calendarDate,
				weekdayFormat: "short",
				locale: "fr",
			});
			expect(t.getByTestId("weekday-1-0").textContent).toBe("lun.");
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

	describe("maxDays constraints in multiple mode", () => {
		it("should reset selection when adding a date violates maxDays constraint", async () => {
			const d1 = new CalendarDate(1980, 1, 2);
			const d2 = new CalendarDate(1980, 1, 5);
			const t = setupMulti({ value: [d1, d2], maxDays: 2 });

			// initially should have 2 selected dates
			expect(getSelectedDays(t.calendar)).toHaveLength(2);

			// clicking a third date should reset selection to just that date
			const thirdDate = t.getByTestId("date-1-8");
			await t.user.click(thirdDate);

			const selectedDays = getSelectedDays(t.calendar);
			expect(selectedDays).toHaveLength(1);
			expect(selectedDays[0]).toHaveTextContent("8");
		});

		it("should allow valid selections within maxDays constraint", async () => {
			const d1 = new CalendarDate(1980, 1, 2);
			const t = setupMulti({ value: [d1], maxDays: 3 });

			// initially should have 1 selected date
			expect(getSelectedDays(t.calendar)).toHaveLength(1);

			// adding a second date should work
			const secondDate = t.getByTestId("date-1-5");
			await t.user.click(secondDate);
			expect(getSelectedDays(t.calendar)).toHaveLength(2);

			// adding a third date should work (exactly at maxDays)
			const thirdDate = t.getByTestId("date-1-8");
			await t.user.click(thirdDate);
			expect(getSelectedDays(t.calendar)).toHaveLength(3);
		});

		it("should work with maxDays constraint", async () => {
			const t = setupMulti({ maxDays: 3, placeholder: calendarDate });

			// select first date
			const firstDate = t.getByTestId("date-1-5");
			await t.user.click(firstDate);
			expect(getSelectedDays(t.calendar)).toHaveLength(1);

			// select second date (should work)
			const secondDate = t.getByTestId("date-1-8");
			await t.user.click(secondDate);
			expect(getSelectedDays(t.calendar)).toHaveLength(2);

			// select third date (should work - exactly at maxDays)
			const thirdDate = t.getByTestId("date-1-12");
			await t.user.click(thirdDate);
			expect(getSelectedDays(t.calendar)).toHaveLength(3);

			// select fourth date (violates maxDays, should reset to just that date)
			const fourthDate = t.getByTestId("date-1-15");
			await t.user.click(fourthDate);

			const selectedDays = getSelectedDays(t.calendar);
			expect(selectedDays).toHaveLength(1);
			expect(selectedDays[0]).toHaveTextContent("15");
		});

		it("should allow deselection even with constraints", async () => {
			const d1 = new CalendarDate(1980, 1, 2);
			const d2 = new CalendarDate(1980, 1, 5);
			const d3 = new CalendarDate(1980, 1, 8);
			const t = setupMulti({ value: [d1, d2, d3], maxDays: 5 });

			expect(getSelectedDays(t.calendar)).toHaveLength(3);

			// deselecting a date should work normally
			const firstDate = t.getByTestId("date-1-2");
			await t.user.click(firstDate);
			expect(getSelectedDays(t.calendar)).toHaveLength(2);

			// deselecting another date should work
			const secondDate = t.getByTestId("date-1-5");
			await t.user.click(secondDate);
			expect(getSelectedDays(t.calendar)).toHaveLength(1);
		});

		it("should handle constraints when no initial value is provided", async () => {
			const t = setupMulti({ maxDays: 2, placeholder: calendarDate });

			// select first date
			const firstDate = t.getByTestId("date-1-5");
			await t.user.click(firstDate);
			expect(getSelectedDays(t.calendar)).toHaveLength(1);

			// select second date (should work)
			const secondDate = t.getByTestId("date-1-8");
			await t.user.click(secondDate);
			expect(getSelectedDays(t.calendar)).toHaveLength(2);

			// select third date (violates maxDays, should reset to just that date)
			const thirdDate = t.getByTestId("date-1-12");
			await t.user.click(thirdDate);

			const selectedDays = getSelectedDays(t.calendar);
			expect(selectedDays).toHaveLength(1);
			expect(selectedDays[0]).toHaveTextContent("12");
		});
	});
});

describe("Calendar Select Components", () => {
	function setupWithSelects(
		props: {
			placeholder?: CalendarDate;
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
		const user = setupUserEvents();
		const returned = render(CalendarSelectsTest, props);
		const calendar = returned.getByTestId("calendar");
		const monthSelect = returned.getByTestId("month-select");
		const yearSelect = returned.getByTestId("year-select");
		expect(calendar).toBeVisible();
		return { ...returned, user, calendar, monthSelect, yearSelect };
	}

	describe("Calendar.MonthSelect", () => {
		it("should render month select with default months", async () => {
			const t = setupWithSelects({ placeholder: calendarDate });
			const monthSelect = t.monthSelect;
			const options = monthSelect.querySelectorAll("option");

			// should have 12 months
			expect(options).toHaveLength(12);
			expect(options[0]).toHaveTextContent("January");
			expect(options[11]).toHaveTextContent("December");
		});

		it("should respect custom months prop", async () => {
			const t = setupWithSelects({
				placeholder: calendarDate,
				months: [1, 2, 3], // Q1 months
			});
			const monthSelect = t.monthSelect;
			const options = monthSelect.querySelectorAll("option");

			expect(options).toHaveLength(3);
			expect(options[0]).toHaveTextContent("January");
			expect(options[1]).toHaveTextContent("February");
			expect(options[2]).toHaveTextContent("March");
		});

		it("should respect monthFormat prop - short", async () => {
			const t = setupWithSelects({
				placeholder: calendarDate,
				monthFormat: "short",
			});
			const monthSelect = t.monthSelect;
			const options = monthSelect.querySelectorAll("option");

			expect(options[0]).toHaveTextContent("Jan");
			expect(options[1]).toHaveTextContent("Feb");
		});

		it("should respect monthFormat prop - numeric", async () => {
			const t = setupWithSelects({
				placeholder: calendarDate,
				monthFormat: "numeric",
			});
			const monthSelect = t.monthSelect;
			const options = monthSelect.querySelectorAll("option");

			expect(options[0]).toHaveTextContent("1");
			expect(options[1]).toHaveTextContent("2");
		});

		it("should have correct selected option for current month", async () => {
			const t = setupWithSelects({ placeholder: calendarDate }); // January 1980
			const monthSelect = t.monthSelect;
			const selectedOption = monthSelect.querySelector("option[selected]");

			expect(selectedOption).toHaveTextContent("January");
			expect(selectedOption).toHaveValue("1");
		});

		it("should update calendar when month is changed", async () => {
			const t = setupWithSelects({ placeholder: calendarDate }); // January 1980
			const monthSelect = t.monthSelect;

			// Change to March (value="3")
			await t.user.selectOptions(monthSelect, "3");

			// Calendar should show March 1980
			const grid = t.getByTestId("grid-3");
			expect(grid).toBeVisible();
		});

		it("should be disabled when calendar is disabled", async () => {
			const t = setupWithSelects({
				placeholder: calendarDate,
				disabled: true,
			});
			const monthSelect = t.monthSelect;

			expect(monthSelect).toHaveAttribute("disabled");
		});
	});

	describe("Calendar.YearSelect", () => {
		it("should render year select with default years", async () => {
			const t = setupWithSelects({ placeholder: calendarDate });
			const yearSelect = t.yearSelect;
			const options = yearSelect.querySelectorAll("option");

			// default range is 111 years when placeholder is within normal bounds
			expect(options.length).toBeGreaterThanOrEqual(111);
		});

		it("should expand year range when placeholder year is below minimum", async () => {
			const currentYear = new Date().getFullYear();
			const lowYear = currentYear - 150; // well below the normal minimum
			const t = setupWithSelects({
				placeholder: new CalendarDate(lowYear, 6, 15),
			});
			const yearSelect = t.yearSelect;
			const options = yearSelect.querySelectorAll("option");

			// should have expanded range starting 10 years before the low placeholder year
			const expectedMinYear = lowYear - 10;
			const expectedMaxYear = Math.max(lowYear, currentYear) + 10;
			const expectedLength = expectedMaxYear - expectedMinYear + 1;

			expect(options.length).toBe(expectedLength);
			expect(options[0]).toHaveValue(String(expectedMinYear));
		});

		it("should maintain normal range when placeholder is within bounds", async () => {
			const currentYear = new Date().getFullYear();
			const normalYear = currentYear - 50; // within normal range
			const t = setupWithSelects({
				placeholder: new CalendarDate(normalYear, 6, 15),
			});
			const yearSelect = t.yearSelect;
			const options = yearSelect.querySelectorAll("option");

			// should have normal 111-year range
			const latestYear = Math.max(normalYear, currentYear);
			const expectedMinYear = latestYear - 100;
			const expectedMaxYear = latestYear + 10;
			const expectedLength = expectedMaxYear - expectedMinYear + 1;

			expect(options.length).toBe(expectedLength);
			expect(options[0]).toHaveValue(String(expectedMinYear));
		});

		it("should respect custom years prop", async () => {
			const t = setupWithSelects({
				placeholder: calendarDate,
				years: [2020, 2021, 2022],
			});
			const yearSelect = t.yearSelect;
			const options = yearSelect.querySelectorAll("option");

			expect(options).toHaveLength(3);
			expect(options[0]).toHaveTextContent("2020");
			expect(options[1]).toHaveTextContent("2021");
			expect(options[2]).toHaveTextContent("2022");
		});

		it("should use minValue year as exact starting boundary", async () => {
			const currentYear = new Date().getFullYear();
			const t = setupWithSelects({
				placeholder: new CalendarDate(2000, 6, 15),
				minValue: new CalendarDate(2020, 1, 1),
			});
			const yearSelect = t.yearSelect;
			const options = yearSelect.querySelectorAll("option");

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
			const options = yearSelect.querySelectorAll("option");

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
			const options = yearSelect.querySelectorAll("option");

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
			const options = yearSelect.querySelectorAll("option");

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
			const options = yearSelect.querySelectorAll("option");

			// should use default logic: latestYear - 100 to latestYear + 10
			const latestYear = Math.max(placeholderYear, currentYear);
			const expectedStartYear = latestYear - 100;
			const expectedEndYear = latestYear + 10;
			const expectedLength = expectedEndYear - expectedStartYear + 1;

			expect(options).toHaveLength(expectedLength);
			expect(options[0]).toHaveValue(String(expectedStartYear));
			expect(options[options.length - 1]).toHaveValue(String(expectedEndYear));
		});

		it("should have correct selected option for current year", async () => {
			const t = setupWithSelects({ placeholder: calendarDate }); // 1980
			const yearSelect = t.yearSelect;
			const selectedOption = yearSelect.querySelector("option[selected]");

			expect(selectedOption).toHaveTextContent("1980");
			expect(selectedOption).toHaveValue("1980");
		});

		it("should update calendar when year is changed", async () => {
			const t = setupWithSelects({
				placeholder: calendarDate,
				years: [1979, 1980, 1981],
			});
			const yearSelect = t.yearSelect;

			// Change to 1981
			await t.user.selectOptions(yearSelect, "1981");

			// Should still show January but now 1981
			const grid = t.getByTestId("grid-1");
			expect(grid).toBeVisible();
		});

		it("should be disabled when calendar is disabled", async () => {
			const t = setupWithSelects({
				placeholder: calendarDate,
				disabled: true,
			});
			const yearSelect = t.yearSelect;

			expect(yearSelect).toHaveAttribute("disabled");
		});

		it("should respect yearFormat prop - 2-digit", async () => {
			const t = setupWithSelects({
				placeholder: calendarDate,
				yearFormat: "2-digit",
				years: [1980, 1981, 1982],
			});
			const yearSelect = t.yearSelect;
			const options = yearSelect.querySelectorAll("option");

			expect(options[0]).toHaveTextContent("80");
			expect(options[1]).toHaveTextContent("81");
			expect(options[2]).toHaveTextContent("82");
		});

		it("should respect yearFormat prop - numeric (default)", async () => {
			const t = setupWithSelects({
				placeholder: calendarDate,
				yearFormat: "numeric",
				years: [1980, 1981, 1982],
			});
			const yearSelect = t.yearSelect;
			const options = yearSelect.querySelectorAll("option");

			expect(options[0]).toHaveTextContent("1980");
			expect(options[1]).toHaveTextContent("1981");
			expect(options[2]).toHaveTextContent("1982");
		});
	});

	describe("Integration", () => {
		it("should work together to navigate to specific month/year", async () => {
			const t = setupWithSelects({
				placeholder: calendarDate, // January 1980
				years: [1979, 1980, 1981],
			});

			// Change to March 1981
			await t.user.selectOptions(t.monthSelect, "3");
			await t.user.selectOptions(t.yearSelect, "1981");

			// Should show March 1981
			const grid = t.getByTestId("grid-3");
			expect(grid).toBeVisible();
		});

		it("should maintain selections when switching between months", async () => {
			const t = setupWithSelects({
				placeholder: calendarDate,
				months: [1, 2, 3, 4], // Q1 + April
			});

			// Change to February
			await t.user.selectOptions(t.monthSelect, "2");

			// February should be selected
			let selectedOption = t.monthSelect.querySelector("option[selected]");
			expect(selectedOption).toHaveTextContent("February");

			// Change to April
			await t.user.selectOptions(t.monthSelect, "4");

			// April should be selected
			selectedOption = t.monthSelect.querySelector("option[selected]");
			expect(selectedOption).toHaveTextContent("April");
		});

		it("should handle edge cases with limited month/year arrays", async () => {
			const t = setupWithSelects({
				placeholder: new CalendarDate(2020, 6, 15), // June 2020
				months: [6], // Only June
				years: [2020], // Only 2020
			});

			const monthOptions = t.monthSelect.querySelectorAll("option");
			const yearOptions = t.yearSelect.querySelectorAll("option");

			expect(monthOptions).toHaveLength(1);
			expect(yearOptions).toHaveLength(1);
			expect(monthOptions[0]).toHaveAttribute("selected");
			expect(yearOptions[0]).toHaveAttribute("selected");
		});
	});
});
