import { CalendarDate, CalendarDateTime, toZoned } from "@internationalized/date";
import { getTestKbd, setupUserEvents } from "../utils";
import { fireEvent, render, waitFor } from "@testing-library/svelte";
import DateRangePickerTest, {
	type DateRangePickerTestProps,
} from "./date-range-picker-test.svelte";
import { axe } from "jest-axe";
import { getSelectedDays } from "../helpers/calendar";
import { tick } from "svelte";

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
	const user = setupUserEvents();
	const returned = render(DateRangePickerTest, { ...props });
	const trigger = returned.getByTestId("trigger");
	const start = {
		month: returned.getByTestId("start-month"),
		day: returned.getByTestId("start-day"),
		year: returned.getByTestId("start-year"),
		value: returned.getByTestId("start-value"),
	};

	const end = {
		month: returned.getByTestId("end-month"),
		day: returned.getByTestId("end-day"),
		year: returned.getByTestId("end-year"),
		value: returned.getByTestId("end-value"),
	};
	const startInput = returned.getByTestId("start-input");
	const endInput = returned.getByTestId("end-input");
	const label = returned.getByTestId("label");

	function getSelectedDays(calendar: HTMLElement) {
		return calendar.querySelectorAll<HTMLElement>(SELECTED_DAY_SELECTOR);
	}

	function getContent() {
		return returned.queryByTestId("content");
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
	const { trigger, getByTestId, queryByTestId, user, getContent, ...returned } = setup(props);
	expect(getContent()).toBeNull();
	if (openWith === "click") {
		await user.pointerDownUp(trigger);
	} else {
		trigger.focus();
		await user.keyboard(openWith);
	}
	await waitFor(() => expect(getContent()).not.toBeNull());
	const content = getByTestId("content");
	const calendar = getByTestId("calendar");

	function getSelectedDays() {
		return calendar.querySelectorAll<HTMLElement>(SELECTED_DAY_SELECTOR);
	}
	return {
		trigger,
		getByTestId,
		queryByTestId,
		user,
		content,
		getContent,
		calendar,
		...returned,
		getSelectedDays,
	};
}

it("should have no accessibility violations", async () => {
	const { container } = render(DateRangePickerTest);
	expect(await axe(container)).toHaveNoViolations();
});

it("should open on click", async () => {
	await open();
});

it.each([kbd.ENTER, kbd.SPACE])("should open on %s", async (key) => {
	await open({}, key);
});

it("should populate segment with value - `CalendarDate`", async () => {
	const { start, end } = setup({
		value: calendarDate,
	});

	expect(start.month).toHaveTextContent(String(calendarDate.start.month));
	expect(start.day).toHaveTextContent(String(calendarDate.start.day));
	expect(start.year).toHaveTextContent(String(calendarDate.start.year));
	expect(start.value).toHaveTextContent(calendarDate.start.toString());

	expect(end.month).toHaveTextContent(String(calendarDate.end.month));
	expect(end.day).toHaveTextContent(String(calendarDate.end.day));
	expect(end.year).toHaveTextContent(String(calendarDate.end.year));
	expect(end.value).toHaveTextContent(calendarDate.end.toString());
});

it("should populate segment with value - `CalendarDateTime`", async () => {
	const { start, end, getByTestId } = setup({
		value: calendarDateTime,
		granularity: "second",
	});

	expect(start.month).toHaveTextContent(String(calendarDateTime.start.month));
	expect(start.day).toHaveTextContent(String(calendarDateTime.start.day));
	expect(start.year).toHaveTextContent(String(calendarDateTime.start.year));
	expect(getByTestId("start-hour")).toHaveTextContent(String(calendarDateTime.start.hour));
	expect(getByTestId("start-minute")).toHaveTextContent(String(calendarDateTime.start.minute));
	expect(getByTestId("start-second")).toHaveTextContent(String(calendarDateTime.start.second));
	expect(start.value).toHaveTextContent(calendarDateTime.start.toString());

	expect(end.month).toHaveTextContent(String(calendarDateTime.end.month));
	expect(end.day).toHaveTextContent(String(calendarDateTime.end.day));
	expect(end.year).toHaveTextContent(String(calendarDateTime.end.year));
	expect(getByTestId("end-hour")).toHaveTextContent(String(calendarDateTime.end.hour));
	expect(getByTestId("end-minute")).toHaveTextContent(String(calendarDateTime.end.minute));
	expect(getByTestId("end-second")).toHaveTextContent(String(calendarDateTime.end.second));
	expect(end.value).toHaveTextContent(calendarDateTime.end.toString());
});

it("should populate segment with value - `ZonedDateTime`", async () => {
	const { start, end, getByTestId } = setup({
		value: zonedDateTime,
		granularity: "second",
	});

	expect(start.month).toHaveTextContent(String(calendarDateTime.start.month));
	expect(start.day).toHaveTextContent(String(calendarDateTime.start.day));
	expect(start.year).toHaveTextContent(String(calendarDateTime.start.year));
	expect(getByTestId("start-hour")).toHaveTextContent(String(calendarDateTime.start.hour));
	expect(getByTestId("start-minute")).toHaveTextContent(String(calendarDateTime.start.minute));
	expect(getByTestId("start-second")).toHaveTextContent(String(calendarDateTime.start.second));
	expect(start.value).toHaveTextContent(calendarDateTime.start.toString());

	expect(end.month).toHaveTextContent(String(calendarDateTime.end.month));
	expect(end.day).toHaveTextContent(String(calendarDateTime.end.day));
	expect(end.year).toHaveTextContent(String(calendarDateTime.end.year));
	expect(getByTestId("end-hour")).toHaveTextContent(String(calendarDateTime.end.hour));
	expect(getByTestId("end-minute")).toHaveTextContent(String(calendarDateTime.end.minute));
	expect(getByTestId("end-second")).toHaveTextContent(String(calendarDateTime.end.second));
	expect(end.value).toHaveTextContent(calendarDateTime.end.toString());
});

it("should navigate between the fields", async () => {
	const { getByTestId, user } = setup({
		value: calendarDate,
	});

	const fields = ["start", "end"] as const;
	const segments = ["month", "day", "year"] as const;

	await user.click(getByTestId("start-month"));

	for (const field of fields) {
		for (const segment of segments) {
			if (field === "start" && segment === "month") continue;
			const seg = getByTestId(`${field}-${segment}`);
			await user.keyboard(kbd.ARROW_RIGHT);
			expect(seg).toHaveFocus();
		}
	}

	await user.click(getByTestId("start-month"));

	for (const field of fields) {
		for (const segment of segments) {
			if (field === "start" && segment === "month") continue;
			const seg = getByTestId(`${field}-${segment}`);
			await user.keyboard(kbd.TAB);
			expect(seg).toHaveFocus();
		}
	}
});

it("should navigate between the fields - right to left", async () => {
	const { getByTestId, user } = setup({
		value: calendarDate,
	});

	const fields = ["end", "start"] as const;
	const segments = ["year", "day", "month"] as const;

	await user.click(getByTestId("end-year"));

	for (const field of fields) {
		for (const segment of segments) {
			if (field === "end" && segment === "year") continue;
			const seg = getByTestId(`${field}-${segment}`);
			await user.keyboard(kbd.ARROW_LEFT);
			expect(seg).toHaveFocus();
		}
	}

	await user.click(getByTestId("end-year"));

	for (const field of fields) {
		for (const segment of segments) {
			if (field === "end" && segment === "year") continue;
			const seg = getByTestId(`${field}-${segment}`);
			await user.keyboard(kbd.SHIFT_TAB);
			expect(seg).toHaveFocus();
		}
	}
});

it("should respect `bind:value` to the value", async () => {
	const { start, end, user } = setup({
		value: calendarDate,
	});
	expect(start.value).toHaveTextContent(calendarDate.start.toString());
	expect(end.value).toHaveTextContent(calendarDate.end.toString());

	await user.click(start.month);
	await user.keyboard("2");
	expect(start.value).toHaveTextContent("2022-02-01");
	expect(end.value).toHaveTextContent(calendarDate.end.toString());
});

it("should render an input for the start and end", async () => {
	const { container } = setup({
		startProps: {
			name: "start-hidden-input",
		},
		endProps: {
			name: "end-hidden-input",
		},
	});
	expect(container.querySelector('input[name="start-hidden-input"]')).toBeInTheDocument();
	expect(container.querySelector('input[name="end-hidden-input"]')).toBeInTheDocument();
});

describe("respects default value if provided", () => {
	it("CalendarDate", async () => {
		const { getSelectedDays, getByTestId } = await open({ value: calendarDateRange });

		expect(getSelectedDays()).toHaveLength(6);

		const heading = getByTestId("heading");
		expect(heading).toHaveTextContent("January 1980");
	});

	it("CalendarDateTime", async () => {
		const { getSelectedDays, getByTestId } = await open({ value: calendarDateTimeRange });

		expect(getSelectedDays()).toHaveLength(6);

		const heading = getByTestId("heading");
		expect(heading).toHaveTextContent("January 1980");
	});

	it("ZonedDateTime", async () => {
		const { getSelectedDays, getByTestId } = await open({ value: zonedDateTimeRange });

		expect(getSelectedDays()).toHaveLength(6);

		const heading = getByTestId("heading");
		expect(heading).toHaveTextContent("January 1980");
	});
});

it("should allow clearing the selected range", async () => {
	const { getByText, getSelectedDays } = await open({
		value: calendarDateRange,
	});

	expect(getSelectedDays()).toHaveLength(6);

	const clearButton = getByText("clear");

	await fireEvent.click(clearButton);

	expect(getSelectedDays()).toHaveLength(0);
});

it("should reset range on select when a range is already selected", async () => {
	const { getByTestId, calendar, user } = await open({
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
	expect(startValue).toHaveTextContent(String(undefined));
	expect(endValue).toHaveTextContent(String(undefined));
	const seventhDayInMonth = getByTestId("date-1-7");
	await user.click(seventhDayInMonth);
	await tick();
	expect(getSelectedDays(calendar)).toHaveLength(3);
});

it("should navigate the months forward using the next button", async () => {
	const { getByTestId, user } = await open({ value: calendarDateTimeRange });

	const heading = getByTestId("heading");
	const nextBtn = getByTestId("next-button");

	for (const month of months) {
		expect(heading).toHaveTextContent(`${month} 1980`);
		await user.click(nextBtn);
	}
	expect(heading).toHaveTextContent("January 1981");
});

it("should navigate the months backwards using the prev button", async () => {
	const { getByTestId, user } = await open({ value: calendarDateTimeRange });

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
	const { getByTestId, calendar, user } = await open({
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
	const { getByTestId, user } = await open({
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
	const { getByTestId, user } = await open({
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
	const { getByTestId, user } = await open({
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
	const { getByTestId, user } = await open({
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
	const { getByTestId, user } = await open({
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

it("should sync the calendar with the input when input is changed", async () => {
	const { start, end, user, trigger, queryByTestId, getByTestId } = setup({
		value: calendarDate,
	});
	expect(start.value).toHaveTextContent(calendarDate.start.toString());
	expect(end.value).toHaveTextContent(calendarDate.end.toString());

	await user.click(start.month);
	await user.keyboard("2");
	expect(start.value).toHaveTextContent("2022-02-01");
	expect(end.value).toHaveTextContent(calendarDate.end.toString());
	await user.pointerDownUp(trigger);

	await waitFor(() => expect(queryByTestId("content")).not.toBeNull());

	const heading = getByTestId("heading");
	expect(heading).toHaveTextContent("February 2022");
});

describe("correct weekday label formatting", () => {
	it("narrow", async () => {
		const { getByTestId } = await open({
			placeholder: calendarDateRange.start,
			weekdayFormat: "narrow",
		});
		for (const [i, weekday] of narrowWeekdays.entries()) {
			const weekdayEl = getByTestId(`weekday-1-${i}`);
			expect(weekdayEl).toHaveTextContent(weekday);
		}
	});

	it("short", async () => {
		const { getByTestId } = await open({
			placeholder: calendarDateRange.start,
			weekdayFormat: "short",
		});
		for (const [i, weekday] of shortWeekdays.entries()) {
			const weekdayEl = getByTestId(`weekday-1-${i}`);
			expect(weekdayEl).toHaveTextContent(weekday);
		}
	});

	it("long`", async () => {
		const { getByTestId } = await open({
			placeholder: calendarDateRange.start,
			weekdayFormat: "long",
		});
		for (const [i, weekday] of longWeekdays.entries()) {
			const weekdayEl = getByTestId(`weekday-1-${i}`);
			expect(weekdayEl).toHaveTextContent(weekday);
		}
	});
});
