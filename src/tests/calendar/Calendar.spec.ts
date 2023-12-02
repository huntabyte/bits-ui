import { render, waitFor } from "@testing-library/svelte";
import userEvent from "@testing-library/user-event";
import { axe } from "jest-axe";
import { describe, it } from "vitest";
import { testKbd as kbd } from "../utils.js";
import CalendarTest from "./CalendarTest.svelte";
import type { Calendar } from "$lib";
import { CalendarDate, CalendarDateTime, toZoned } from "@internationalized/date";
import { get } from "svelte/store";

const calendarDate = new CalendarDate(1980, 1, 20);
const calendarDateTime = new CalendarDateTime(1980, 1, 20, 12, 30, 0, 0);
const zonedDateTime = toZoned(calendarDateTime, "America/New_York");

const narrowWeekdays = ["S", "M", "T", "W", "T", "F", "S"];
const shortWeekdays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const longWeekdays = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
// prettier-ignore
const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October" ,"November", "December"];

function setup(props: Calendar.Props = {}) {
	const user = userEvent.setup();
	const returned = render(CalendarTest, { ...props });
	const calendar = returned.getByTestId("calendar");
	expect(calendar).toBeVisible();
	return { ...returned, user, calendar };
}

describe("Calendar", () => {
	it("has no accessibility violations", async () => {
		const { container } = render(CalendarTest);
		expect(await axe(container)).toHaveNoViolations();
	});

	it("respects a default value if provided - `CalendarDate`", async () => {
		const { calendar, getByTestId } = setup({ value: calendarDate });

		const selectedDay = calendar.querySelector("[data-selected]");
		expect(selectedDay).toHaveTextContent(String(calendarDate.day));

		expect(getByTestId("heading")).toHaveTextContent("January 1980");
	});

	it("respects a default value if provided - `CalendarDateTime`", async () => {
		const { calendar, getByTestId } = setup({ value: calendarDateTime });

		const selectedDay = calendar.querySelector("[data-selected]");
		expect(selectedDay).toHaveTextContent(String(calendarDateTime.day));

		expect(getByTestId("heading")).toHaveTextContent("January 1980");
	});

	it("respects a default value if provided - `ZonedDateTime`", async () => {
		const { calendar, getByTestId } = setup({ value: zonedDateTime });

		const selectedDay = calendar.querySelector("[data-selected]");
		expect(selectedDay).toHaveTextContent(String(zonedDateTime.day));

		expect(getByTestId("heading")).toHaveTextContent("January 1980");
	});

	it("properly binds to `value` - `CalendarDate`", async () => {
		const { getByTestId, user } = setup({ value: calendarDate });

		const addDayBtn = getByTestId("add-day");
		await user.click(addDayBtn);
		const valueEl = getByTestId("value");
		expect(valueEl).toHaveTextContent("1980-01-21");

		const addMonthBtn = getByTestId("add-month");
		await user.click(addMonthBtn);
		expect(valueEl).toHaveTextContent("1980-02-21");

		const addYearBtn = getByTestId("add-year");
		await user.click(addYearBtn);
		expect(valueEl).toHaveTextContent("1981-02-21");
	});

	it("properly binds to `value` - `CalendarDateTime`", async () => {
		const { getByTestId, user } = setup({ value: calendarDateTime });

		const addDayBtn = getByTestId("add-day");
		await user.click(addDayBtn);
		const valueEl = getByTestId("value");
		expect(valueEl).toHaveTextContent("1980-01-21");

		const addMonthBtn = getByTestId("add-month");
		await user.click(addMonthBtn);
		expect(valueEl).toHaveTextContent("1980-02-21");

		const addYearBtn = getByTestId("add-year");
		await user.click(addYearBtn);
		expect(valueEl).toHaveTextContent("1981-02-21");
	});

	it("properly binds to `value` - `ZonedDateTime`", async () => {
		const { getByTestId, user } = setup({ value: zonedDateTime });

		const addDayBtn = getByTestId("add-day");
		await user.click(addDayBtn);
		const valueEl = getByTestId("value");
		expect(valueEl).toHaveTextContent("1980-01-21");

		const addMonthBtn = getByTestId("add-month");
		await user.click(addMonthBtn);
		expect(valueEl).toHaveTextContent("1980-02-21");

		const addYearBtn = getByTestId("add-year");
		await user.click(addYearBtn);
		expect(valueEl).toHaveTextContent("1981-02-21");
	});

	it("navigates the months forward using the next button", async () => {
		const { getByTestId, user } = setup({ value: calendarDate });

		const heading = getByTestId("heading");
		const nextBtn = getByTestId("next-button");

		for (const month of months) {
			expect(heading).toHaveTextContent(month + " 1980");
			await user.click(nextBtn);
		}
		expect(heading).toHaveTextContent("January 1981");
	});

	it("navigates the months backwards using the prev button", async () => {
		const { getByTestId, user } = setup({ value: calendarDate });

		const heading = getByTestId("heading");
		const prevBtn = getByTestId("prev-button");
		const newMonths = [...months].reverse();
		newMonths.pop();

		expect(heading).toHaveTextContent("January 1980");
		await user.click(prevBtn);

		for (const month of newMonths) {
			expect(heading).toHaveTextContent(month + " 1979");
			await user.click(prevBtn);
		}
		expect(heading).toHaveTextContent("January 1979");
	});

	it("allows dates to be deselected by clicking the selected date", async () => {
		const { getByTestId, user, calendar } = setup({
			value: calendarDate
		});

		const value = getByTestId("value");
		expect(value).toHaveTextContent("1980-01-20");

		const selectedDay = calendar.querySelector("[data-selected]") as HTMLElement;
		expect(selectedDay).toHaveTextContent(String(calendarDate.day));

		await user.click(selectedDay);
		expect(value).toHaveTextContent("undefined");
	});

	it.each([kbd.ENTER, kbd.SPACE])("allows deselection with %s key", async (key) => {
		const { getByTestId, user, calendar } = setup({
			value: calendarDate
		});

		const value = getByTestId("value");
		expect(value).toHaveTextContent("1980-01-20");

		const selectedDay = calendar.querySelector("[data-selected]") as HTMLElement;
		expect(selectedDay).toHaveTextContent(String(calendarDate.day));
		selectedDay.focus();
		await user.keyboard(key);
		expect(value).toHaveTextContent("undefined");
	});

	it("allows selection with mouse", async () => {
		const { getByTestId, user } = setup({
			placeholder: zonedDateTime
		});

		const secondDayInMonth = getByTestId("date-1-2");
		expect(secondDayInMonth).toHaveTextContent("2");
		await user.click(secondDayInMonth);

		const newDate = zonedDateTime.set({ day: 2 });
		expect(getByTestId("value")).toHaveTextContent(newDate.toString());
	});

	it.each([kbd.SPACE, kbd.ENTER])("allows selection with %s key", async (key) => {
		const { getByTestId, user } = setup({
			placeholder: zonedDateTime
		});

		const secondDayInMonth = getByTestId("date-1-2");
		expect(secondDayInMonth).toHaveTextContent("2");
		secondDayInMonth.focus();
		await user.keyboard(key);

		const newDate = zonedDateTime.set({ day: 2 });
		expect(getByTestId("value")).toHaveTextContent(newDate.toString());
	});

	it("displays multiple months when `numberOfMonths` is greater than 1", async () => {
		const { getByTestId, calendar, user } = setup({ value: calendarDateTime, numberOfMonths: 2 });

		const selectedDay = calendar.querySelector("[data-selected]") as HTMLElement;
		expect(selectedDay).toHaveTextContent(String(calendarDateTime.day));

		const heading = getByTestId("heading");
		expect(heading).toHaveTextContent("January - February 1980");

		const firstMonthDayDateStr = calendarDateTime.set({ day: 12 }).toString();
		const firstMonthDay = getByTestId("date-1-12");
		expect(firstMonthDay).toHaveTextContent("12");
		expect(firstMonthDay).toHaveAttribute("data-value", firstMonthDayDateStr);

		const secondMonthDay = getByTestId("date-2-15");
		const secondMonthDayDateStr = calendarDateTime.set({ day: 15, month: 2 }).toString();
		expect(secondMonthDay).toHaveTextContent("15");
		expect(secondMonthDay).toHaveAttribute("data-value", secondMonthDayDateStr);

		const prevButton = getByTestId("prev-button");
		const nextButton = getByTestId("next-button");

		await user.click(nextButton);
		expect(heading).toHaveTextContent("February - March 1980");
		expect(firstMonthDay).not.toHaveAttribute("data-value", firstMonthDayDateStr);

		await user.click(prevButton);
		expect(heading).toHaveTextContent("January - February 1980");
		expect(firstMonthDay).toHaveAttribute("data-value", firstMonthDayDateStr);

		await user.click(prevButton);
		expect(heading).toHaveTextContent("December 1979 - January 1980");
		expect(firstMonthDay).not.toHaveAttribute("data-value", firstMonthDayDateStr);
	});
});
