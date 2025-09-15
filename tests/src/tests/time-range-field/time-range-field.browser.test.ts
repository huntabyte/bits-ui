import { expect, it } from "vitest";
import { render } from "vitest-browser-svelte";
import { CalendarDateTime, Time, toZoned } from "@internationalized/date";
import { getTestKbd } from "../utils.js";
import TimeRangeFieldTest, { type TimeRangeFieldTestProps } from "./time-range-field-test.svelte";
import type { TimeValue } from "bits-ui";
import { page, userEvent } from "@vitest/browser/context";

const kbd = getTestKbd();

const time = {
	start: new Time(12, 30),
	end: new Time(17, 30),
};

const calendarDateTime = {
	start: new CalendarDateTime(2022, 1, 1, 12, 30),
	end: new CalendarDateTime(2022, 3, 1, 12, 30),
};

const zonedDateTime = {
	start: toZoned(calendarDateTime.start, "America/New_York"),
	end: toZoned(calendarDateTime.end, "America/New_York"),
};

function setup<T extends TimeValue = Time>(props: TimeRangeFieldTestProps<T> = {}) {
	// oxlint-disable-next-line no-explicit-any
	const returned = render(TimeRangeFieldTest, { ...props } as any);

	const start = {
		input: page.getByTestId("start-input"),
		getHour: () => page.getByTestId("start-hour"),
		getMinute: () => page.getByTestId("start-minute"),
		getSecond: () => page.getByTestId("start-second"),
		getDayPeriod: () => page.getByTestId("start-dayPeriod"),
		getTimeZoneName: () => page.getByTestId("start-timeZoneName"),
		getHiddenInput: () =>
			returned.container.querySelector(
				"input[name='start-hidden-input']"
			) as HTMLInputElement,
		value: page.getByTestId("start-value"),
	};

	const end = {
		input: page.getByTestId("end-input"),
		getHour: () => page.getByTestId("end-hour"),
		getMinute: () => page.getByTestId("end-minute"),
		getSecond: () => page.getByTestId("end-second"),
		getDayPeriod: () => page.getByTestId("end-dayPeriod"),
		getTimeZoneName: () => page.getByTestId("end-timeZoneName"),
		getHiddenInput: () =>
			returned.container.querySelector("input[name='end-hidden-input']") as HTMLInputElement,
		value: page.getByTestId("end-value"),
	};

	const root = page.getByTestId("root").element() as HTMLElement;

	const label = page.getByTestId("label").element() as HTMLElement;

	return { start, end, root, label };
}

it("should populate segment with value - `Time`", async () => {
	const t = setup({
		value: time,
		granularity: "second",
	});

	expect(t.start.getHour()).toHaveTextContent(String(time.start.hour));
	expect(t.start.getMinute()).toHaveTextContent(String(time.start.minute));
	expect(t.start.getSecond()).toHaveTextContent(String(time.start.second));
	expect(t.start.getDayPeriod()).toHaveTextContent("PM");
	expect(t.start.value).toHaveTextContent("12");

	expect(t.end.getHour()).toHaveTextContent("05");
	expect(t.end.getMinute()).toHaveTextContent(String(time.end.minute));
	expect(t.end.getSecond()).toHaveTextContent(String(time.end.second));
	expect(t.end.getDayPeriod()).toHaveTextContent("PM");
	expect(t.end.value).toHaveTextContent("17:30:00");
});

it("should populate segment with value - `CalendarDateTime`", async () => {
	const t = setup({
		value: calendarDateTime,
		granularity: "second",
	});

	expect(t.start.getHour()).toHaveTextContent(String(calendarDateTime.start.hour));
	expect(t.start.getMinute()).toHaveTextContent(String(calendarDateTime.start.minute));
	expect(t.start.getSecond()).toHaveTextContent(String(calendarDateTime.start.second));
	expect(t.start.getDayPeriod()).toHaveTextContent("PM");
	expect(t.start.value).toHaveTextContent(calendarDateTime.start.toString());

	expect(t.end.getHour()).toHaveTextContent(String(calendarDateTime.end.hour));
	expect(t.end.getMinute()).toHaveTextContent(String(calendarDateTime.end.minute));
	expect(t.end.getSecond()).toHaveTextContent(String(calendarDateTime.end.second));
	expect(t.end.getDayPeriod()).toHaveTextContent("PM");
	expect(t.end.value).toHaveTextContent(calendarDateTime.end.toString());
});

it("should populate segment with value - `ZonedDateTime`", async () => {
	const t = setup({
		value: zonedDateTime,
		granularity: "second",
	});

	expect(t.start.getHour()).toHaveTextContent(String(calendarDateTime.start.hour));
	expect(t.start.getMinute()).toHaveTextContent(String(calendarDateTime.start.minute));
	expect(t.start.getSecond()).toHaveTextContent(String(calendarDateTime.start.second));
	expect(t.start.getDayPeriod()).toHaveTextContent("PM");
	expect(t.start.getTimeZoneName()).toHaveTextContent("EST");
	expect(t.start.value).toHaveTextContent(calendarDateTime.start.toString());

	expect(t.end.getHour()).toHaveTextContent(String(calendarDateTime.end.hour));
	expect(t.end.getMinute()).toHaveTextContent(String(calendarDateTime.end.minute));
	expect(t.end.getSecond()).toHaveTextContent(String(calendarDateTime.end.second));
	expect(t.end.getDayPeriod()).toHaveTextContent("PM");
	expect(t.end.getTimeZoneName()).toHaveTextContent("EST");
	expect(t.end.value).toHaveTextContent(calendarDateTime.end.toString());
});

it("should navigate between the fields", async () => {
	const t = setup({
		value: time,
		granularity: "second",
		locale: "en-US",
	});

	const fields = ["start", "end"] as const;
	const segments = ["hour", "minute", "second", "dayPeriod"] as const;

	await t.start.getHour().click();

	for (const field of fields) {
		for (const segment of segments) {
			if (field === "start" && segment === "hour") continue;
			const seg = page.getByTestId(`${field}-${segment}`);
			await userEvent.keyboard(kbd.ARROW_RIGHT);
			await expect.element(seg).toHaveFocus();
		}
	}

	await t.start.getHour().click();

	for (const field of fields) {
		for (const segment of segments) {
			if (field === "start" && segment === "hour") continue;
			const seg = page.getByTestId(`${field}-${segment}`);
			await userEvent.keyboard(kbd.TAB);
			await expect.element(seg).toHaveFocus();
		}
	}
});

it("should navigate between the fields - right to left", async () => {
	const t = setup({
		value: time,
		granularity: "second",
		locale: "en-US",
	});

	const fields = ["end", "start"] as const;
	const segments = ["dayPeriod", "second", "minute", "hour"] as const;

	await t.end.getDayPeriod().click();

	for (const field of fields) {
		for (const segment of segments) {
			if (field === "end" && segment === "dayPeriod") continue;
			const seg = page.getByTestId(`${field}-${segment}`);
			await userEvent.keyboard(kbd.ARROW_LEFT);
			await expect.element(seg).toHaveFocus();
		}
	}

	await t.end.getDayPeriod().click();

	for (const field of fields) {
		for (const segment of segments) {
			if (field === "end" && segment === "dayPeriod") continue;
			const seg = page.getByTestId(`${field}-${segment}`);
			await userEvent.keyboard(kbd.SHIFT_TAB);
			await expect.element(seg).toHaveFocus();
		}
	}
});

it("should respect `bind:value` to the value", async () => {
	const t = setup({
		value: time,
		granularity: "second",
	});
	await expect.element(t.start.value).toHaveTextContent(time.start.toString());
	await expect.element(t.end.value).toHaveTextContent(time.end.toString());

	await t.start.getHour().click();
	await userEvent.keyboard("2");
	await expect.element(t.start.value).toHaveTextContent("02:30:00");
	await expect.element(t.end.value).toHaveTextContent(time.end.toString());
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
	await expect.element(t.start.getHiddenInput()).toBeInTheDocument();
	await expect.element(t.end.getHiddenInput()).toBeInTheDocument();
});

it("should populate calendar date with keyboard", async () => {
	const t = setup({ value: time });

	await t.start.getHour().click();

	await userEvent.keyboard("{1}");
	await userEvent.keyboard("{2}");
	await expect.element(t.start.getMinute()).toHaveFocus();
	await userEvent.keyboard("{3}");
	await userEvent.keyboard("{4}");
	await expect.element(t.start.getDayPeriod()).toHaveFocus();
	await userEvent.keyboard("{P}");
	await userEvent.keyboard(kbd.ARROW_RIGHT);
	await expect.element(t.end.getHour()).toHaveFocus();
	await userEvent.keyboard("{1}");
	await userEvent.keyboard("{2}");
	await userEvent.keyboard("{3}");
	await userEvent.keyboard("{5}");
	await expect.element(t.end.getDayPeriod()).toHaveFocus();

	await expect.element(t.start.value).toHaveTextContent("12:34:00");
	await expect.element(t.end.value).toHaveTextContent("12:35:00");
});

// function extractTime(time: TimeValue): string {
// 	if (time instanceof Time) {
// 		return time.toString();
// 	}
// 	return new Time(time.hour, time.minute, time.second).toString();
// }
