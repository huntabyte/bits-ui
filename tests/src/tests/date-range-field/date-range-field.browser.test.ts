import { expect, it } from "vitest";
import { render } from "vitest-browser-svelte";
import { CalendarDate, CalendarDateTime, toZoned } from "@internationalized/date";
import { getTestKbd } from "../utils.js";
import DateRangeFieldTest, { type DateRangeFieldTestProps } from "./date-range-field-test.svelte";
import { page, userEvent } from "vitest/browser";

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

async function setup(props: DateRangeFieldTestProps = {}) {
	const t = await render(DateRangeFieldTest, { ...props });

	const start = {
		month: page.getByTestId("start-month"),
		day: page.getByTestId("start-day"),
		year: page.getByTestId("start-year"),
		value: page.getByTestId("start-value"),
	};

	const end = {
		month: page.getByTestId("end-month"),
		day: page.getByTestId("end-day"),
		year: page.getByTestId("end-year"),
		value: page.getByTestId("end-value"),
	};

	const root = page.getByTestId("root");
	const startInput = page.getByTestId("start-input");
	const endInput = page.getByTestId("end-input");

	const label = page.getByTestId("label");

	return { ...t, start, end, root, startInput, endInput, label };
}

it("should populate segment with value - `CalendarDate`", async () => {
	const t = await setup({ value: calendarDate });

	await expect.element(t.start.month).toMatchTextContent(String(calendarDate.start.month));
	await expect.element(t.start.day).toMatchTextContent(String(calendarDate.start.day));
	await expect.element(t.start.year).toMatchTextContent(String(calendarDate.start.year));
	await expect.element(t.start.value).toMatchTextContent(calendarDate.start.toString());

	await expect.element(t.end.month).toMatchTextContent(String(calendarDate.end.month));
	await expect.element(t.end.day).toMatchTextContent(String(calendarDate.end.day));
	await expect.element(t.end.year).toMatchTextContent(String(calendarDate.end.year));
	await expect.element(t.end.value).toMatchTextContent(calendarDate.end.toString());
});

it("should populate segment with value - `CalendarDateTime`", async () => {
	const t = await setup({
		value: calendarDateTime,
		granularity: "second",
	});

	await expect.element(t.start.month).toMatchTextContent(String(calendarDateTime.start.month));
	await expect.element(t.start.day).toMatchTextContent(String(calendarDateTime.start.day));
	await expect.element(t.start.year).toMatchTextContent(String(calendarDateTime.start.year));
	await expect
		.element(page.getByTestId("start-hour"))
		.toMatchTextContent(String(calendarDateTime.start.hour));
	await expect
		.element(page.getByTestId("start-minute"))
		.toMatchTextContent(String(calendarDateTime.start.minute));
	await expect
		.element(page.getByTestId("start-second"))
		.toMatchTextContent(String(calendarDateTime.start.second));
	await expect.element(t.start.value).toMatchTextContent(calendarDateTime.start.toString());

	await expect.element(t.end.month).toMatchTextContent(String(calendarDateTime.end.month));
	await expect.element(t.end.day).toMatchTextContent(String(calendarDateTime.end.day));
	await expect.element(t.end.year).toMatchTextContent(String(calendarDateTime.end.year));
	await expect
		.element(page.getByTestId("end-hour"))
		.toMatchTextContent(String(calendarDateTime.end.hour));
	await expect
		.element(page.getByTestId("end-minute"))
		.toMatchTextContent(String(calendarDateTime.end.minute));
	await expect
		.element(page.getByTestId("end-second"))
		.toMatchTextContent(String(calendarDateTime.end.second));
	await expect.element(t.end.value).toMatchTextContent(calendarDateTime.end.toString());
});

it("should populate segment with value - `ZonedDateTime`", async () => {
	const t = await setup({
		value: zonedDateTime,
		granularity: "second",
	});

	await expect.element(t.start.month).toMatchTextContent(String(calendarDateTime.start.month));
	await expect.element(t.start.day).toMatchTextContent(String(calendarDateTime.start.day));
	await expect.element(t.start.year).toMatchTextContent(String(calendarDateTime.start.year));
	await expect
		.element(page.getByTestId("start-hour"))
		.toMatchTextContent(String(calendarDateTime.start.hour));
	await expect
		.element(page.getByTestId("start-minute"))
		.toMatchTextContent(String(calendarDateTime.start.minute));
	await expect
		.element(page.getByTestId("start-second"))
		.toMatchTextContent(String(calendarDateTime.start.second));
	await expect.element(t.start.value).toMatchTextContent(calendarDateTime.start.toString());

	await expect.element(t.end.month).toMatchTextContent(String(calendarDateTime.end.month));
	await expect.element(t.end.day).toMatchTextContent(String(calendarDateTime.end.day));
	await expect.element(t.end.year).toMatchTextContent(String(calendarDateTime.end.year));
	await expect
		.element(page.getByTestId("end-hour"))
		.toMatchTextContent(String(calendarDateTime.end.hour));
	await expect
		.element(page.getByTestId("end-minute"))
		.toMatchTextContent(String(calendarDateTime.end.minute));
	await expect
		.element(page.getByTestId("end-second"))
		.toMatchTextContent(String(calendarDateTime.end.second));
	await expect.element(t.end.value).toMatchTextContent(calendarDateTime.end.toString());
});

it("should navigate between the fields", async () => {
	await setup({ value: calendarDate });

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
	const t = await setup({ value: calendarDate });

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
	const t = await setup({ value: calendarDate });
	await expect.element(t.start.value).toMatchTextContent(calendarDate.start.toString());
	await expect.element(t.end.value).toMatchTextContent(calendarDate.end.toString());

	await t.start.month.click();
	await userEvent.keyboard("2");
	await expect.element(t.start.value).toMatchTextContent("2022-02-01");
	await expect.element(t.end.value).toMatchTextContent(calendarDate.end.toString());
});

it("should render an input for the start and end", async () => {
	const t = await setup({
		startProps: {
			name: "start-hidden-input",
		},
		endProps: {
			name: "end-hidden-input",
		},
	});
	await expect
		.element(t.container.querySelector<HTMLInputElement>('input[name="start-hidden-input"]'))
		.toBeInTheDocument();
	await expect
		.element(t.container.querySelector<HTMLInputElement>('input[name="end-hidden-input"]'))
		.toBeInTheDocument();
});

it("should populate calendar date with keyboard", async () => {
	const t = await setup({ value: calendarDate });

	await page.getByTestId("start-month").click();

	await userEvent.keyboard("2142020");
	await userEvent.keyboard("2152020");

	await expect.element(t.start.value).toMatchTextContent("2020-02-14");
	await expect.element(t.end.value).toMatchTextContent("2020-02-15");
});

it("should allow valid days in end month regardless of start month", async () => {
	const t = await setup();

	await t.start.month.click();
	await userEvent.keyboard("2");
	await userEvent.keyboard("02");
	await userEvent.keyboard("2025");
	await userEvent.keyboard("12");
	await userEvent.keyboard("31");
	await userEvent.keyboard("2025");

	const seg = page.getByTestId(`end-day`);
	await expect.element(seg).toMatchTextContent("31");

	await expect.element(t.start.value).toMatchTextContent("2025-02-02");
	await expect.element(t.end.value).toMatchTextContent("2025-12-31");
});

it("should allow valid days in end month when a value is prepopulated", async () => {
	await setup({
		value: {
			start: new CalendarDate(2025, 2, 1),
			end: new CalendarDate(2025, 5, 31),
		},
	});

	const seg = page.getByTestId("end-day");
	await expect.element(seg).toMatchTextContent("31");

	(seg.element() as HTMLElement).focus();
	await userEvent.keyboard(kbd.ARROW_DOWN);
	await expect.element(seg).toMatchTextContent("30");
});
