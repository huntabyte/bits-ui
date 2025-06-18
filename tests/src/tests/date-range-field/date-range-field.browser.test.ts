import { expect, it } from "vitest";
import { render } from "vitest-browser-svelte";
import { CalendarDate, CalendarDateTime, toZoned } from "@internationalized/date";
import { getTestKbd } from "../utils.js";
import DateRangeFieldTest, { type DateRangeFieldTestProps } from "./date-range-field-test.svelte";
import { setupBrowserUserEvents } from "../browser-utils";

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

function setup(props: DateRangeFieldTestProps = {}) {
	const user = setupBrowserUserEvents();
	const t = render(DateRangeFieldTest, { ...props });

	const start = {
		month: t.getByTestId("start-month").element() as HTMLElement,
		day: t.getByTestId("start-day").element() as HTMLElement,
		year: t.getByTestId("start-year").element() as HTMLElement,
		value: t.getByTestId("start-value").element() as HTMLElement,
	};

	const end = {
		month: t.getByTestId("end-month").element() as HTMLElement,
		day: t.getByTestId("end-day").element() as HTMLElement,
		year: t.getByTestId("end-year").element() as HTMLElement,
		value: t.getByTestId("end-value").element() as HTMLElement,
	};

	const root = t.getByTestId("root").element() as HTMLElement;
	const startInput = t.getByTestId("start-input").element() as HTMLElement;
	const endInput = t.getByTestId("end-input").element() as HTMLElement;

	const label = t.getByTestId("label").element() as HTMLElement;

	return { ...t, user, start, end, root, startInput, endInput, label };
}

it("should populate segment with value - `CalendarDate`", async () => {
	const t = setup({ value: calendarDate });

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
	const t = setup({ value: calendarDate });

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
	const t = setup({ value: calendarDate });

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
	expect(t.end.year).toHaveFocus();

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
	const t = setup({ value: calendarDate });
	expect(t.start.value).toHaveTextContent(calendarDate.start.toString());
	expect(t.end.value).toHaveTextContent(calendarDate.end.toString());

	await t.user.click(t.start.month);
	await t.user.keyboard("2");
	expect(t.start.value).toHaveTextContent("2022-02-01");
	expect(t.end.value).toHaveTextContent(calendarDate.end.toString());
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

it("should populate calendar date with keyboard", async () => {
	const t = setup({ value: calendarDate });

	await t.user.click(t.start.month);

	await t.user.keyboard("2142020");
	await t.user.keyboard("2152020");

	expect(t.start.value).toHaveTextContent("2020-02-14");
	expect(t.end.value).toHaveTextContent("2020-02-15");
});

it("should allow valid days in end month regardless of start month", async () => {
	const t = setup();

	await t.user.click(t.start.month);
	await t.user.keyboard("2");
	await t.user.keyboard("02");
	await t.user.keyboard("2025");
	await t.user.keyboard("12");
	await t.user.keyboard("31");
	await t.user.keyboard("2025");

	const seg = t.getByTestId(`end-day`);
	expect(seg).toHaveTextContent("31");

	expect(t.start.value).toHaveTextContent("2025-02-02");
	expect(t.end.value).toHaveTextContent("2025-12-31");
});

it("should allow valid days in end month when a value is prepopulated", async () => {
	const t = setup({
		value: {
			start: new CalendarDate(2025, 2, 1),
			end: new CalendarDate(2025, 5, 31),
		},
	});

	const seg = t.getByTestId("end-day").element() as HTMLElement;
	expect(seg).toHaveTextContent("31");

	seg.focus();
	await t.user.keyboard(kbd.ARROW_DOWN);
	expect(seg).toHaveTextContent("30");
});
