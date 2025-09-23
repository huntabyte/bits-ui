import { expect, it } from "vitest";
import { render } from "vitest-browser-svelte";
import { CalendarDate, CalendarDateTime, toZoned } from "@internationalized/date";
import { getTestKbd } from "../utils.js";
import DateRangeFieldTest, { type DateRangeFieldTestProps } from "./date-range-field-test.svelte";
import { setupBrowserUserEvents } from "../browser-utils";
import { page, userEvent } from "@vitest/browser/context";

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
		month: t.getByTestId("start-month"),
		day: t.getByTestId("start-day"),
		year: t.getByTestId("start-year"),
		value: t.getByTestId("start-value"),
	};

	const end = {
		month: t.getByTestId("end-month"),
		day: t.getByTestId("end-day"),
		year: t.getByTestId("end-year"),
		value: t.getByTestId("end-value"),
	};

	const root = t.getByTestId("root");
	const startInput = t.getByTestId("start-input");
	const endInput = t.getByTestId("end-input");

	const label = t.getByTestId("label");

	return { ...t, user, start, end, root, startInput, endInput, label };
}

it("should populate segment with value - `CalendarDate`", async () => {
	const t = setup({ value: calendarDate });

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
		.element(t.getByTestId("start-hour"))
		.toHaveTextContent(String(calendarDateTime.start.hour));
	await expect
		.element(t.getByTestId("start-minute"))
		.toHaveTextContent(String(calendarDateTime.start.minute));
	await expect
		.element(t.getByTestId("start-second"))
		.toHaveTextContent(String(calendarDateTime.start.second));
	await expect.element(t.start.value).toHaveTextContent(calendarDateTime.start.toString());

	await expect.element(t.end.month).toHaveTextContent(String(calendarDateTime.end.month));
	await expect.element(t.end.day).toHaveTextContent(String(calendarDateTime.end.day));
	await expect.element(t.end.year).toHaveTextContent(String(calendarDateTime.end.year));
	await expect
		.element(t.getByTestId("end-hour"))
		.toHaveTextContent(String(calendarDateTime.end.hour));
	await expect
		.element(t.getByTestId("end-minute"))
		.toHaveTextContent(String(calendarDateTime.end.minute));
	await expect
		.element(t.getByTestId("end-second"))
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
		.element(t.getByTestId("start-hour"))
		.toHaveTextContent(String(calendarDateTime.start.hour));
	await expect
		.element(t.getByTestId("start-minute"))
		.toHaveTextContent(String(calendarDateTime.start.minute));
	await expect
		.element(t.getByTestId("start-second"))
		.toHaveTextContent(String(calendarDateTime.start.second));
	await expect.element(t.start.value).toHaveTextContent(calendarDateTime.start.toString());

	await expect.element(t.end.month).toHaveTextContent(String(calendarDateTime.end.month));
	await expect.element(t.end.day).toHaveTextContent(String(calendarDateTime.end.day));
	await expect.element(t.end.year).toHaveTextContent(String(calendarDateTime.end.year));
	await expect
		.element(t.getByTestId("end-hour"))
		.toHaveTextContent(String(calendarDateTime.end.hour));
	await expect
		.element(t.getByTestId("end-minute"))
		.toHaveTextContent(String(calendarDateTime.end.minute));
	await expect
		.element(t.getByTestId("end-second"))
		.toHaveTextContent(String(calendarDateTime.end.second));
	await expect.element(t.end.value).toHaveTextContent(calendarDateTime.end.toString());
});

it("should navigate between the fields", async () => {
	setup({ value: calendarDate });

	const fields = ["start", "end"] as const;
	const segments = ["month", "day", "year"] as const;

	await page.getByTestId("start-month").click();

	for (const field of fields) {
		for (const segment of segments) {
			if (field === "start" && segment === "month") continue;
			const seg = page.getByTestId(`${field}-${segment}`);
			await userEvent.keyboard(kbd.ARROW_RIGHT);
			await expect.element(seg).toHaveFocus();
		}
	}

	await page.getByTestId("start-month").click();

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
	const t = setup({ value: calendarDate });

	const fields = ["end", "start"] as const;
	const segments = ["year", "day", "month"] as const;

	await page.getByTestId("end-year").click();

	for (const field of fields) {
		for (const segment of segments) {
			if (field === "end" && segment === "year") continue;
			const seg = page.getByTestId(`${field}-${segment}`);
			await userEvent.keyboard(kbd.ARROW_LEFT);
			await expect.element(seg).toHaveFocus();
		}
	}

	await page.getByTestId("end-year").click();
	await expect.element(t.end.year).toHaveFocus();

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
	const t = setup({ value: calendarDate });
	await expect.element(t.start.value).toHaveTextContent(calendarDate.start.toString());
	await expect.element(t.end.value).toHaveTextContent(calendarDate.end.toString());

	await t.start.month.click();
	await userEvent.keyboard("2");
	await expect.element(t.start.value).toHaveTextContent("2022-02-01");
	await expect.element(t.end.value).toHaveTextContent(calendarDate.end.toString());
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

it("should populate calendar date with keyboard", async () => {
	const t = setup({ value: calendarDate });

	await page.getByTestId("start-month").click();

	await userEvent.keyboard("2142020");
	await userEvent.keyboard("2152020");

	await expect.element(t.start.value).toHaveTextContent("2020-02-14");
	await expect.element(t.end.value).toHaveTextContent("2020-02-15");
});

it("should allow valid days in end month regardless of start month", async () => {
	const t = setup();

	await t.start.month.click();
	await userEvent.keyboard("2");
	await userEvent.keyboard("02");
	await userEvent.keyboard("2025");
	await userEvent.keyboard("12");
	await userEvent.keyboard("31");
	await userEvent.keyboard("2025");

	const seg = t.getByTestId(`end-day`);
	await expect.element(seg).toHaveTextContent("31");

	await expect.element(t.start.value).toHaveTextContent("2025-02-02");
	await expect.element(t.end.value).toHaveTextContent("2025-12-31");
});

it("should allow valid days in end month when a value is prepopulated", async () => {
	const t = setup({
		value: {
			start: new CalendarDate(2025, 2, 1),
			end: new CalendarDate(2025, 5, 31),
		},
	});

	const seg = t.getByTestId("end-day");
	await expect.element(seg).toHaveTextContent("31");

	(seg.element() as HTMLElement).focus();
	await userEvent.keyboard(kbd.ARROW_DOWN);
	await expect.element(seg).toHaveTextContent("30");
});
