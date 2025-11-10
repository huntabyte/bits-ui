import { page, userEvent } from "@vitest/browser/context";
import { describe, expect, it } from "vitest";
import { render } from "vitest-browser-svelte";
import { CalendarDate, CalendarDateTime, toZoned } from "@internationalized/date";
import { getTestKbd } from "../utils.js";
import { getSelectedDay, getSelectedDays } from "../helpers/calendar.js";
import CalendarTest, { type CalendarSingleTestProps } from "./calendar-test.svelte";
import CalendarMultiTest, { type CalendarMultiTestProps } from "./calendar-multi-test.svelte";
import CalendarSelectsTest from "./calendar-selects-test.svelte";
import { focusAndExpectToHaveFocus } from "../browser-utils";

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
	const returned = render(CalendarTest, { ...props, type: "single" });
	const calendar = returned.getByTestId("calendar");
	const prevButton = returned.getByTestId("prev-button");
	const nextButton = returned.getByTestId("next-button");
	expect(calendar).toBeVisible();
	return { ...returned, calendar, prevButton, nextButton };
}

function setupMulti(props: Partial<CalendarMultiTestProps> = {}) {
	const returned = render(CalendarMultiTest, { ...props, type: "multiple" });
	const calendar = returned.getByTestId("calendar");
	const prevButton = returned.getByTestId("prev-button");
	const nextButton = returned.getByTestId("next-button");
	expect(calendar).toBeVisible();
	return { ...returned, calendar, prevButton, nextButton };
}

describe("type='single'", () => {
	describe("Value Handling", () => {
		it("should respect a default value if provided - `CalendarDate`", async () => {
			const t = setup({ value: calendarDate });
			expect(getSelectedDay(t.calendar.element())).toHaveTextContent(
				String(calendarDate.day)
			);
			await expect.element(page.getByTestId("heading")).toHaveTextContent("January 1980");
		});

		it("should respect a default value if provided - `CalendarDateTime`", async () => {
			const t = setup({ value: calendarDateTime });
			expect(getSelectedDay(t.calendar.element())).toHaveTextContent(
				String(calendarDateTime.day)
			);
			await expect.element(page.getByTestId("heading")).toHaveTextContent("January 1980");
		});

		it("should respect a default value if provided - `ZonedDateTime`", async () => {
			const t = setup({ value: zonedDateTime });
			expect(getSelectedDay(t.calendar.element())).toHaveTextContent(
				String(zonedDateTime.day)
			);
			await expect.element(page.getByTestId("heading")).toHaveTextContent("January 1980");
		});

		it("should bind to `value` - `CalendarDate`", async () => {
			setup({ value: calendarDate });
			const addDayBtn = page.getByTestId("add-day");
			await addDayBtn.click();
			const valueEl = page.getByTestId("value");
			await expect.element(valueEl).toHaveTextContent("1980-01-21");
			const addMonthBtn = page.getByTestId("add-month");
			await addMonthBtn.click();
			await expect.element(valueEl).toHaveTextContent("1980-02-21");
			const addYearBtn = page.getByTestId("add-year");
			await addYearBtn.click();
			await expect.element(valueEl).toHaveTextContent("1981-02-21");
		});

		it("should bind to `value` - `CalendarDateTime`", async () => {
			setup({ value: calendarDateTime });
			const addDayBtn = page.getByTestId("add-day");
			await addDayBtn.click();
			const valueEl = page.getByTestId("value");
			await expect.element(valueEl).toHaveTextContent("1980-01-21");
			const addMonthBtn = page.getByTestId("add-month");
			await addMonthBtn.click();
			await expect.element(valueEl).toHaveTextContent("1980-02-21");
			const addYearBtn = page.getByTestId("add-year");
			await addYearBtn.click();
			await expect.element(valueEl).toHaveTextContent("1981-02-21");
		});

		it("properly binds to `value` - `ZonedDateTime`", async () => {
			setup({ value: zonedDateTime });
			const addDayBtn = page.getByTestId("add-day");
			await addDayBtn.click();
			const valueEl = page.getByTestId("value");
			await expect.element(valueEl).toHaveTextContent("1980-01-21");
			const addMonthBtn = page.getByTestId("add-month");
			await addMonthBtn.click();
			await expect.element(valueEl).toHaveTextContent("1980-02-21");
			const addYearBtn = page.getByTestId("add-year");
			await addYearBtn.click();
			await expect.element(valueEl).toHaveTextContent("1981-02-21");
		});

		it("should update the selected date when value controlled externally", async () => {
			const t = setup({ value: calendarDate });
			const selectedDate = getSelectedDay(t.calendar.element());
			await expect.element(selectedDate).toHaveTextContent("20");
			expect(getSelectedDays(t.calendar.element()).length).toBe(1);
			const addDayBtn = page.getByTestId("add-day");
			await addDayBtn.click();
			await expect.element(getSelectedDay(t.calendar.element())).toHaveTextContent("21");
			expect(getSelectedDays(t.calendar.element()).length).toBe(1);
		});

		it("should persist time when selecting a date (CalendarDateTime)", async () => {
			setup({ value: calendarDateTime });
			const value = page.getByTestId("value");
			expect(value).toHaveTextContent(calendarDateTime.toString());
			await page.getByTestId("set-time").click();
			expect(value).toHaveTextContent(
				calendarDateTime
					.set({ hour: 15, minute: 15, second: 15, millisecond: 15 })
					.toString()
			);
			const firstDayInMonth = page.getByTestId("date-1-1");
			await firstDayInMonth.click();
			expect(value).toHaveTextContent(
				calendarDateTime
					.set({ day: 1, hour: 15, minute: 15, second: 15, millisecond: 15 })
					.toString()
			);
		});

		it("should persist time when selecting a date (ZonedDateTime)", async () => {
			setup({ value: zonedDateTime });
			const value = page.getByTestId("value");
			expect(value).toHaveTextContent(zonedDateTime.toString());
			await page.getByTestId("set-time").click();
			expect(value).toHaveTextContent(
				zonedDateTime.set({ hour: 15, minute: 15, second: 15, millisecond: 15 }).toString()
			);
			const firstDayInMonth = page.getByTestId("date-1-1");
			await firstDayInMonth.click();
			expect(value).toHaveTextContent(
				zonedDateTime
					.set({ day: 1, hour: 15, minute: 15, second: 15, millisecond: 15 })
					.toString()
			);
		});
	});

	describe("Navigation", () => {
		it("should navigate the months forward using the next button", async () => {
			setup({ value: calendarDate });
			const heading = page.getByTestId("heading");
			const nextBtn = page.getByTestId("next-button");
			for (const month of months) {
				await expect.element(heading).toHaveTextContent(`${month} 1980`);
				await nextBtn.click();
			}
			await expect.element(heading).toHaveTextContent("January 1981");
		});

		it("should navigate the months backwards using the prev button", async () => {
			setup({ value: calendarDate });
			const heading = page.getByTestId("heading");
			const prevBtn = page.getByTestId("prev-button");
			const newMonths = [...months].reverse();
			newMonths.pop();
			await expect.element(heading).toHaveTextContent("January 1980");
			await prevBtn.click();
			for (const month of newMonths) {
				await expect.element(heading).toHaveTextContent(`${month} 1979`);
				await prevBtn.click({ force: true });
			}
			await expect.element(heading).toHaveTextContent("January 1979");
		});

		it("should not allow navigation before the `minValue` (prev button)", async () => {
			setup({
				value: calendarDate,
				minValue: new CalendarDate(1979, 11, 25),
			});
			const prevBtn = page.getByTestId("prev-button");
			await prevBtn.click({ force: true });
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
				value: calendarDate,
				maxValue: new CalendarDate(1980, 3, 25),
			});
			const nextBtn = page.getByTestId("next-button");
			await nextBtn.click({ force: true });
			const heading = page.getByTestId("heading");
			await expect.element(heading).toHaveTextContent("February 1980");
			await expect.element(nextBtn).not.toHaveAttribute("aria-disabled", "true");
			await expect.element(nextBtn).not.toHaveAttribute("data-disabled");
			await nextBtn.click({ force: true });
			await expect.element(heading).toHaveTextContent("March 1980");
			await expect.element(nextBtn).toHaveAttribute("aria-disabled", "true");
			await expect.element(nextBtn).toHaveAttribute("data-disabled");
			await nextBtn.click({ force: true });

			await expect.element(heading).toHaveTextContent("March 1980");
		});

		it("should not navigate after `maxValue` (with keyboard)", async () => {
			setup({
				value: calendarDate,
				maxValue: new CalendarDate(1980, 3, 31),
			});
			const firstDayInMonth = page.getByTestId("date-1-1");
			await focusAndExpectToHaveFocus(firstDayInMonth);
			await expect.element(firstDayInMonth).toHaveFocus();
			const heading = page.getByTestId("heading");
			await expect.element(heading).toHaveTextContent("January 1980");
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
			await userEvent.keyboard(kbd.ARROW_DOWN);
			await expect.element(page.getByTestId("date-2-12")).toHaveFocus();
			await userEvent.keyboard(kbd.ARROW_DOWN);
			await expect.element(page.getByTestId("date-2-19")).toHaveFocus();
			await userEvent.keyboard(kbd.ARROW_DOWN);
			await expect.element(page.getByTestId("date-2-26")).toHaveFocus();
			await userEvent.keyboard(kbd.ARROW_DOWN);
			await expect.element(page.getByTestId("date-3-4")).toHaveFocus();
			await expect.element(heading).toHaveTextContent("March 1980");
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
			setup({
				value: calendarDate,
				minValue: new CalendarDate(1979, 12, 1),
			});
			const firstDayInMonth = page.getByTestId("date-1-1");
			await focusAndExpectToHaveFocus(firstDayInMonth);
			await expect.element(firstDayInMonth).toHaveFocus();
			const heading = page.getByTestId("heading");
			await expect.element(heading).toHaveTextContent("January 1980");
			await userEvent.keyboard(kbd.ARROW_UP);
			await expect.element(page.getByTestId("date-12-25")).toHaveFocus();
			await expect.element(heading).toHaveTextContent("December 1979");
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

		it("should change view when controlled placeholder changes", async () => {
			setup({ placeholder: calendarDate });
			const heading = page.getByTestId("heading");
			await expect.element(heading).toHaveTextContent("January 1980");
			const addMonthBtn = page.getByTestId("add-month");
			await addMonthBtn.click();
			await expect.element(heading).toHaveTextContent("February 1980");
			const addYearBtn = page.getByTestId("add-year");
			await addYearBtn.click();
			await expect.element(heading).toHaveTextContent("February 1981");
			await addMonthBtn.click();
			await addMonthBtn.click();
			await addMonthBtn.click();
			await expect.element(heading).toHaveTextContent("May 1981");
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
	});

	describe("Selection and Deselection", () => {
		it("should allow dates to be deselected by clicking the selected date", async () => {
			const t = setup({ value: calendarDate });
			const value = page.getByTestId("value");
			await expect.element(value).toHaveTextContent("1980-01-20");
			const selectedDay = getSelectedDay(t.calendar.element());
			await expect.element(selectedDay).toHaveTextContent(String(calendarDate.day));
			await userEvent.click(selectedDay);
			await expect.element(value).toHaveTextContent("undefined");
		});

		it.each([kbd.ENTER, kbd.SPACE])("should allow deselection with %s key", async (key) => {
			const t = setup({ value: calendarDate });
			const value = page.getByTestId("value");
			await expect.element(value).toHaveTextContent("1980-01-20");
			const selectedDay = getSelectedDay(t.calendar.element());
			await expect.element(selectedDay).toHaveTextContent(String(calendarDate.day));
			selectedDay.focus();
			await userEvent.keyboard(key);
			await expect.element(value).toHaveTextContent("undefined");
		});

		it("should allow selection with mouse", async () => {
			setup({ placeholder: zonedDateTime });
			const secondDayInMonth = page.getByTestId("date-1-2");
			expect(secondDayInMonth).toHaveTextContent("2");
			await userEvent.click(secondDayInMonth);
			const newDate = zonedDateTime.set({ day: 2 });
			expect(page.getByTestId("value")).toHaveTextContent(newDate.toString());
		});

		it.each([kbd.SPACE, kbd.ENTER])("should allow selection with %s key", async (key) => {
			setup({ placeholder: zonedDateTime });
			const secondDayInMonth = page.getByTestId("date-1-2");
			await expect.element(secondDayInMonth).toHaveTextContent("2");
			await focusAndExpectToHaveFocus(secondDayInMonth);
			await userEvent.keyboard(key);
			const newDate = zonedDateTime.set({ day: 2 });
			await expect.element(page.getByTestId("value")).toHaveTextContent(newDate.toString());
		});
	});

	describe("Multi-Month Display", () => {
		it("should display multiple months when `numberOfMonths` is greater than 1", async () => {
			const t = setup({
				value: calendarDateTime,
				numberOfMonths: 2,
			});
			const selectedDay = getSelectedDay(t.calendar.element());
			expect(selectedDay).toHaveTextContent(String(calendarDateTime.day));
			const heading = page.getByTestId("heading");
			expect(heading).toHaveTextContent("January - February 1980");
			const firstMonthDayDateStr = calendarDateTime.set({ day: 12 }).toString();
			const firstMonthDay = page.getByTestId("date-1-12");
			expect(firstMonthDay).toHaveTextContent("12");
			expect(firstMonthDay).toHaveAttribute("data-value", firstMonthDayDateStr);
			const secondMonthDay = page.getByTestId("date-2-15");
			const secondMonthDayDateStr = calendarDateTime.set({ day: 15, month: 2 }).toString();
			expect(secondMonthDay).toHaveTextContent("15");
			expect(secondMonthDay).toHaveAttribute("data-value", secondMonthDayDateStr);
			const prevButton = page.getByTestId("prev-button");
			const nextButton = page.getByTestId("next-button");
			await nextButton.click();
			await expect.element(heading).toHaveTextContent("February - March 1980");
			await prevButton.click();
			await expect.element(heading).toHaveTextContent("January - February 1980");
			await prevButton.click();
			await expect.element(heading).toHaveTextContent("December 1979 - January 1980");
		});

		it("should handle `pagedNavigation` with multiple months", async () => {
			const t = setup({
				value: calendarDateTime,
				numberOfMonths: 2,
				pagedNavigation: true,
			});
			const selectedDay = getSelectedDay(t.calendar.element());
			await expect.element(selectedDay).toHaveTextContent(String(calendarDateTime.day));
			const heading = page.getByTestId("heading");
			await expect.element(heading).toHaveTextContent("January - February 1980");
			const firstMonthDayDateStr = calendarDateTime.set({ day: 12 }).toString();
			const firstMonthDay = page.getByTestId("date-1-12");
			await expect.element(firstMonthDay).toHaveTextContent("12");
			await expect.element(firstMonthDay).toHaveAttribute("data-value", firstMonthDayDateStr);
			const secondMonthDay = page.getByTestId("date-2-15");
			const secondMonthDayDateStr = calendarDateTime.set({ day: 15, month: 2 }).toString();
			await expect.element(secondMonthDay).toHaveTextContent("15");
			await expect
				.element(secondMonthDay)
				.toHaveAttribute("data-value", secondMonthDayDateStr);
			const prevButton = page.getByTestId("prev-button");
			const nextButton = page.getByTestId("next-button");
			await nextButton.click();
			await expect.element(heading).toHaveTextContent("March - April 1980");

			await prevButton.click();
			await expect.element(heading).toHaveTextContent("January - February 1980");
			await prevButton.click();
			await expect.element(heading).toHaveTextContent("November - December 1979");
		});
	});

	describe("Rendering Options", () => {
		it("should render six weeks when `fixedWeeks` is `true`", async () => {
			const t = setup({
				value: calendarDate,
				fixedWeeks: true,
			});
			function getNumberOfWeeks() {
				return t.calendar.element().querySelectorAll("[data-week]").length;
			}
			const nextButton = page.getByTestId("next-button");
			for (let i = 0; i < 12; i++) {
				expect(getNumberOfWeeks()).toBe(6);
				await nextButton.click({ force: true });
			}
		});

		it("should format the weekday labels correctly - `'narrow'`", async () => {
			setup({
				placeholder: calendarDate,
				weekdayFormat: "narrow",
			});
			for (const [i, weekday] of narrowWeekdays.entries()) {
				const weekdayEl = page.getByTestId(`weekday-1-${i}`);
				await expect.element(weekdayEl).toHaveTextContent(weekday);
			}
		});

		it("should format the weekday labels correctly - `'short'`", async () => {
			setup({
				placeholder: calendarDate,
				weekdayFormat: "short",
			});
			for (const [i, weekday] of shortWeekdays.entries()) {
				const weekdayEl = page.getByTestId(`weekday-1-${i}`);
				await expect.element(weekdayEl).toHaveTextContent(weekday);
			}
		});

		it("should format the weekday labels correctly - `'long'`", async () => {
			setup({ placeholder: calendarDate, weekdayFormat: "long" });
			for (const [i, weekday] of longWeekdays.entries()) {
				const weekdayEl = page.getByTestId(`weekday-1-${i}`);
				await expect.element(weekdayEl).toHaveTextContent(weekday);
			}
		});

		it("should respect the `weekStartsOn` prop", async () => {
			setup({ placeholder: calendarDate, weekStartsOn: 2, weekdayFormat: "short" });
			await expect.element(page.getByTestId("weekday-1-0")).toHaveTextContent(/^Tue$/);
		});

		it("should respect the `weekStartsOn` prop regardless of locale", async () => {
			setup({
				placeholder: calendarDate,
				weekStartsOn: 2,
				weekdayFormat: "short",
				locale: "fr",
			});
			await expect.element(page.getByTestId("weekday-1-0")).toHaveTextContent("mar.");
		});

		it("should default the first day of the week to the locale's first day of the week if `weekStartsOn` is not provided", async () => {
			setup({
				placeholder: calendarDate,
				weekdayFormat: "short",
				locale: "fr",
			});
			await expect.element(page.getByTestId("weekday-1-0")).toHaveTextContent("lun.");
		});
	});

	describe("Availability and Interaction", () => {
		it("should handle unavailable dates appropriately", async () => {
			setup({
				placeholder: calendarDate,
				isDateUnavailable: (date) => date.day === 3,
			});
			const thirdDayInMonth = page.getByTestId("date-1-3");
			await expect.element(thirdDayInMonth).toHaveTextContent("3");
			await expect.element(thirdDayInMonth).toHaveAttribute("data-unavailable");
			await expect.element(thirdDayInMonth).toHaveAttribute("aria-disabled", "true");
			await thirdDayInMonth.click({ force: true });
			await expect.element(thirdDayInMonth).not.toHaveAttribute("data-selected");
		});

		it("should not allow focus or interaction when `disabled` is `true`", async () => {
			setup({ placeholder: calendarDate, disabled: true });
			const grid = page.getByTestId("grid-1");
			await expect.element(grid).toHaveAttribute("aria-disabled", "true");
			await expect.element(grid).toHaveAttribute("data-disabled");
			const firstDayOfMonth = page.getByTestId("date-1-1");
			await expect.element(firstDayOfMonth).toHaveAttribute("aria-disabled", "true");
			await expect.element(firstDayOfMonth).toHaveAttribute("data-disabled");

			await firstDayOfMonth.click({ force: true });

			await expect.element(firstDayOfMonth).not.toHaveAttribute("data-selected");
			(firstDayOfMonth.element() as HTMLElement).focus();
			await expect.element(firstDayOfMonth).not.toHaveFocus();
			const tenthDayOfMonth = page.getByTestId("date-1-10");
			await expect.element(tenthDayOfMonth).toHaveAttribute("aria-disabled", "true");
			await expect.element(tenthDayOfMonth).toHaveAttribute("data-disabled");
			await tenthDayOfMonth.click({ force: true });
			await expect.element(tenthDayOfMonth).not.toHaveAttribute("data-selected");
			(tenthDayOfMonth.element() as HTMLElement).focus();
			await expect.element(tenthDayOfMonth).not.toHaveFocus();
		});

		it("should prevent selection but allow focus when `readonly` is `true`", async () => {
			setup({ placeholder: calendarDate, readonly: true });
			const grid = page.getByTestId("grid-1");
			await expect.element(grid).toHaveAttribute("aria-readonly", "true");
			await expect.element(grid).toHaveAttribute("data-readonly");
			const firstDayOfMonth = page.getByTestId("date-1-1");
			await firstDayOfMonth.click({ force: true });
			await expect.element(firstDayOfMonth).not.toHaveAttribute("data-selected");
			await focusAndExpectToHaveFocus(firstDayOfMonth);
			const tenthDayOfMonth = page.getByTestId("date-1-10");
			await tenthDayOfMonth.click({ force: true });
			await expect.element(tenthDayOfMonth).not.toHaveAttribute("data-selected");
			await focusAndExpectToHaveFocus(tenthDayOfMonth);
		});

		it("should not allow focusing on disabled dates, even if selected, falling back to first available date", async () => {
			const t = setup({
				value: new CalendarDate(1980, 1, 3),
				isDateDisabled: (date) => date.day === 3,
			});
			await expect.element(document.body).toHaveFocus();
			await userEvent.keyboard(kbd.TAB);
			await expect.element(t.prevButton).toHaveFocus();
			await userEvent.keyboard(kbd.TAB);
			await expect.element(t.nextButton).toHaveFocus();
			await userEvent.keyboard(kbd.TAB);
			await expect.element(page.getByTestId("date-1-1")).toHaveFocus();
		});
	});
});

describe("type='multiple'", () => {
	describe("Value Handling", () => {
		it("should handle default value when `value` prop is provided - `CalendarDate[]`", async () => {
			const d1 = new CalendarDate(1980, 1, 2);
			const d2 = new CalendarDate(1980, 1, 5);
			const t = setupMulti({ value: [d1, d2] });
			const selectedDays = getSelectedDays(t.calendar.element());
			expect(selectedDays.length).toBe(2);
			await expect.element(selectedDays[0]).toHaveTextContent(String(d1.day));
			await expect.element(selectedDays[1]).toHaveTextContent(String(d2.day));
		});

		it("should handle default value when `value` prop is provided - `CalendarDateTime[]`", async () => {
			const d1 = new CalendarDateTime(1980, 1, 2);
			const d2 = new CalendarDateTime(1980, 1, 5);
			const t = setupMulti({ value: [d1, d2] });
			const selectedDays = getSelectedDays(t.calendar.element());
			expect(selectedDays.length).toBe(2);
			await expect.element(selectedDays[0]).toHaveTextContent(String(d1.day));
			await expect.element(selectedDays[1]).toHaveTextContent(String(d2.day));
		});

		it("should handle default value when `value` prop is provided - `ZonedDateTime[]`", async () => {
			const d1 = toZoned(new CalendarDateTime(1980, 1, 2), "America/New_York");
			const d2 = toZoned(new CalendarDateTime(1980, 1, 5), "America/New_York");
			const t = setupMulti({ value: [d1, d2] });
			const selectedDays = getSelectedDays(t.calendar.element());
			expect(selectedDays.length).toBe(2);
			await expect.element(selectedDays[0]).toHaveTextContent(String(d1.day));
			await expect.element(selectedDays[1]).toHaveTextContent(String(d2.day));
		});

		it("should set placeholder to last value in `value` prop", async () => {
			const d1 = new CalendarDate(1980, 1, 2);
			const d2 = new CalendarDate(1980, 5, 5);
			const t = setupMulti({ value: [d1, d2] });
			const selectedDays = getSelectedDays(t.calendar.element());
			expect(selectedDays.length).toBe(1);
			await expect.element(page.getByTestId("heading")).toHaveTextContent("May 1980");
		});
	});

	describe("Selection and Deselection", () => {
		it("should allow deselection", async () => {
			const d1 = new CalendarDate(1980, 1, 2);
			const d2 = new CalendarDate(1980, 1, 5);
			const t = setupMulti({ value: [d1, d2] });
			const selectedDays = getSelectedDays(t.calendar.element());
			expect(selectedDays.length).toBe(2);
			await userEvent.click(selectedDays[0]);
			expect(getSelectedDays(t.calendar.element()).length).toBe(1);
		});

		it("should prevent deselection when only one date is selected and `preventDeselect` is `true`", async () => {
			const d1 = new CalendarDate(1980, 1, 2);
			const t = setupMulti({ value: [d1], preventDeselect: true });
			const selectedDays = getSelectedDays(t.calendar.element());
			await userEvent.click(selectedDays[0]);
			const selectedDays2 = getSelectedDays(t.calendar.element());
			expect(selectedDays2.length).toBe(1);
			await userEvent.click(selectedDays2[0]);
			expect(getSelectedDays(t.calendar.element()).length).toBe(1);
		});
	});

	describe("Availability and Interaction", () => {
		it("should not allow focusing on disabled dates, even if selected, falling back to first available date", async () => {
			const t = setupMulti({
				value: [new CalendarDate(1980, 1, 3)],
				isDateDisabled: (date) => date.day === 3,
			});
			await expect.element(document.body).toHaveFocus();
			await userEvent.keyboard(kbd.TAB);
			await expect.element(t.prevButton).toHaveFocus();
			await userEvent.keyboard(kbd.TAB);
			await expect.element(t.nextButton).toHaveFocus();
			await userEvent.keyboard(kbd.TAB);
			await expect.element(page.getByTestId("date-1-1")).toHaveFocus();
		});
	});

	describe("maxDays constraints in multiple mode", () => {
		it("should reset selection when adding a date violates maxDays constraint", async () => {
			const d1 = new CalendarDate(1980, 1, 2);
			const d2 = new CalendarDate(1980, 1, 5);
			const t = setupMulti({ value: [d1, d2], maxDays: 2 });

			// initially should have 2 selected dates
			expect(getSelectedDays(t.calendar.element())).toHaveLength(2);

			// clicking a third date should reset selection to just that date
			const thirdDate = page.getByTestId("date-1-8");
			await thirdDate.click();

			const selectedDays = getSelectedDays(t.calendar.element());
			expect(selectedDays).toHaveLength(1);
			await expect.element(selectedDays[0]).toHaveTextContent("8");
		});

		it("should allow valid selections within maxDays constraint", async () => {
			const d1 = new CalendarDate(1980, 1, 2);
			const t = setupMulti({ value: [d1], maxDays: 3 });

			// initially should have 1 selected date
			expect(getSelectedDays(t.calendar.element())).toHaveLength(1);

			// adding a second date should work
			const secondDate = page.getByTestId("date-1-5");
			await secondDate.click();
			expect(getSelectedDays(t.calendar.element())).toHaveLength(2);

			// adding a third date should work (exactly at maxDays)
			const thirdDate = page.getByTestId("date-1-8");
			await thirdDate.click();
			expect(getSelectedDays(t.calendar.element())).toHaveLength(3);
		});

		it("should work with maxDays constraint", async () => {
			const t = setupMulti({ maxDays: 3, placeholder: calendarDate });

			// select first date
			const firstDate = page.getByTestId("date-1-5");
			await firstDate.click();
			expect(getSelectedDays(t.calendar.element())).toHaveLength(1);

			// select second date (should work)
			const secondDate = page.getByTestId("date-1-8");
			await secondDate.click();
			expect(getSelectedDays(t.calendar.element())).toHaveLength(2);

			// select third date (should work - exactly at maxDays)
			const thirdDate = page.getByTestId("date-1-12");
			await thirdDate.click();
			expect(getSelectedDays(t.calendar.element())).toHaveLength(3);

			// select fourth date (violates maxDays, should reset to just that date)
			const fourthDate = page.getByTestId("date-1-15");
			await fourthDate.click({ force: true });

			const selectedDays = getSelectedDays(t.calendar.element());
			expect(selectedDays).toHaveLength(1);
			await expect.element(selectedDays[0]).toHaveTextContent("15");
		});

		it("should allow deselection even with constraints", async () => {
			const d1 = new CalendarDate(1980, 1, 2);
			const d2 = new CalendarDate(1980, 1, 5);
			const d3 = new CalendarDate(1980, 1, 8);
			const t = setupMulti({ value: [d1, d2, d3], maxDays: 5 });

			expect(getSelectedDays(t.calendar.element())).toHaveLength(3);

			// deselecting a date should work normally
			const firstDate = page.getByTestId("date-1-2");
			await firstDate.click();
			expect(getSelectedDays(t.calendar.element())).toHaveLength(2);

			// deselecting another date should work
			const secondDate = page.getByTestId("date-1-5");
			await secondDate.click();
			expect(getSelectedDays(t.calendar.element())).toHaveLength(1);
		});

		it("should handle constraints when no initial value is provided", async () => {
			const t = setupMulti({ maxDays: 2, placeholder: calendarDate });

			// select first date
			const firstDate = page.getByTestId("date-1-5");
			await firstDate.click();
			expect(getSelectedDays(t.calendar.element())).toHaveLength(1);

			// select second date (should work)
			const secondDate = page.getByTestId("date-1-8");
			await secondDate.click();
			expect(getSelectedDays(t.calendar.element())).toHaveLength(2);

			// select third date (violates maxDays, should reset to just that date)
			const thirdDate = page.getByTestId("date-1-12");
			await thirdDate.click({ force: true });

			const selectedDays = getSelectedDays(t.calendar.element());
			expect(selectedDays).toHaveLength(1);
			await expect.element(selectedDays[0]).toHaveTextContent("12");
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
		const user = userEvent;
		const returned = render(CalendarSelectsTest, props);
		const calendar = returned.getByTestId("calendar").element() as HTMLElement;
		const monthSelect = returned.getByTestId("month-select").element() as HTMLElement;
		const yearSelect = returned.getByTestId("year-select").element() as HTMLElement;
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
			await expect.element(options[0]).toHaveTextContent("January");
			await expect.element(options[11]).toHaveTextContent("December");
		});

		it("should respect custom months prop", async () => {
			const t = setupWithSelects({
				placeholder: calendarDate,
				months: [1, 2, 3], // Q1 months
			});
			const monthSelect = t.monthSelect;
			const options = monthSelect.querySelectorAll("option");

			expect(options).toHaveLength(3);
			await expect.element(options[0]).toHaveTextContent("January");
			await expect.element(options[1]).toHaveTextContent("February");
			await expect.element(options[2]).toHaveTextContent("March");
		});

		it("should respect monthFormat prop - short", async () => {
			const t = setupWithSelects({
				placeholder: calendarDate,
				monthFormat: "short",
			});
			const monthSelect = t.monthSelect;
			const options = monthSelect.querySelectorAll("option");

			await expect.element(options[0]).toHaveTextContent("Jan");
			await expect.element(options[1]).toHaveTextContent("Feb");
		});

		it("should respect monthFormat prop - numeric", async () => {
			const t = setupWithSelects({
				placeholder: calendarDate,
				monthFormat: "numeric",
			});
			const monthSelect = t.monthSelect;
			const options = monthSelect.querySelectorAll("option");

			await expect.element(options[0]).toHaveTextContent("1");
			await expect.element(options[1]).toHaveTextContent("2");
		});

		it("should have correct selected option for current month", async () => {
			const t = setupWithSelects({ placeholder: calendarDate }); // January 1980
			const monthSelect = t.monthSelect;
			const selectedOption = monthSelect.querySelector("option[selected]");

			await expect.element(selectedOption).toHaveTextContent("January");
			await expect.element(selectedOption).toHaveValue("1");
		});

		it("should update calendar when month is changed", async () => {
			const t = setupWithSelects({ placeholder: calendarDate }); // January 1980
			const monthSelect = t.monthSelect;

			// Change to March (value="3")
			await userEvent.selectOptions(monthSelect, "3");

			// Calendar should show March 1980
			const grid = page.getByTestId("grid-3");
			await expect.element(grid).toBeVisible();
		});

		it("should be disabled when calendar is disabled", async () => {
			const t = setupWithSelects({
				placeholder: calendarDate,
				disabled: true,
			});
			const monthSelect = t.monthSelect;

			await expect.element(monthSelect).toHaveAttribute("disabled");
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
			await expect.element(options[0]).toHaveTextContent("2020");
			await expect.element(options[1]).toHaveTextContent("2021");
			await expect.element(options[2]).toHaveTextContent("2022");
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
			await userEvent.selectOptions(yearSelect, "1981");

			// Should still show January but now 1981
			const grid = page.getByTestId("grid-1");
			await expect.element(grid).toBeVisible();
		});

		it("should be disabled when calendar is disabled", async () => {
			const t = setupWithSelects({
				placeholder: calendarDate,
				disabled: true,
			});
			const yearSelect = t.yearSelect;

			await expect.element(yearSelect).toHaveAttribute("disabled");
		});

		it("should respect yearFormat prop - 2-digit", async () => {
			const t = setupWithSelects({
				placeholder: calendarDate,
				yearFormat: "2-digit",
				years: [1980, 1981, 1982],
			});
			const yearSelect = t.yearSelect;
			const options = yearSelect.querySelectorAll("option");

			await expect.element(options[0]).toHaveTextContent("80");
			await expect.element(options[1]).toHaveTextContent("81");
			await expect.element(options[2]).toHaveTextContent("82");
		});

		it("should respect yearFormat prop - numeric (default)", async () => {
			const t = setupWithSelects({
				placeholder: calendarDate,
				yearFormat: "numeric",
				years: [1980, 1981, 1982],
			});
			const yearSelect = t.yearSelect;
			const options = yearSelect.querySelectorAll("option");

			await expect.element(options[0]).toHaveTextContent("1980");
			await expect.element(options[1]).toHaveTextContent("1981");
			await expect.element(options[2]).toHaveTextContent("1982");
		});
	});

	describe("Integration", () => {
		it("should work together to navigate to specific month/year", async () => {
			const t = setupWithSelects({
				placeholder: calendarDate, // January 1980
				years: [1979, 1980, 1981],
			});

			// Change to March 1981
			await userEvent.selectOptions(t.monthSelect, "3");
			await userEvent.selectOptions(t.yearSelect, "1981");

			// Should show March 1981
			const grid = page.getByTestId("grid-3");
			await expect.element(grid).toBeVisible();
		});

		it("should maintain selections when switching between months", async () => {
			const t = setupWithSelects({
				placeholder: calendarDate,
				months: [1, 2, 3, 4], // Q1 + April
			});

			// Change to February
			await userEvent.selectOptions(t.monthSelect, "2");

			// February should be selected
			let selectedOption = t.monthSelect.querySelector("option[selected]");
			await expect.element(selectedOption).toHaveTextContent("February");

			// Change to April
			await userEvent.selectOptions(t.monthSelect, "4");

			// April should be selected
			selectedOption = t.monthSelect.querySelector("option[selected]");
			await expect.element(selectedOption).toHaveTextContent("April");
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
			await expect.element(monthOptions[0]).toHaveAttribute("selected");
			await expect.element(yearOptions[0]).toHaveAttribute("selected");
		});
	});
});
