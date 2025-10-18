import { CalendarDateTime } from "@internationalized/date";
import { getTestKbd } from "../utils";
import { expect, it, describe } from "vitest";
import { render } from "vitest-browser-svelte";
import DatePickerTest, { type DatePickerTestProps } from "./date-picker-test.svelte";
import { expectNotExists } from "../browser-utils";
import { page, userEvent, type Locator } from "@vitest/browser/context";

const kbd = getTestKbd();

function setup(props: Partial<DatePickerTestProps> = {}) {
	const t = render(DatePickerTest, { ...props });
	const month = page.getByTestId("month");
	const day = page.getByTestId("day");
	const year = page.getByTestId("year");
	const value = page.getByTestId("value");
	const input = page.getByTestId("input");
	const label = page.getByTestId("label");
	const trigger = page.getByTestId("trigger");

	return { ...t, month, day, year, value, input, label, trigger };
}

// oxlint-disable-next-line no-explicit-any
function getTimeSegments(getByTestId: (...args: any[]) => Locator) {
	return {
		getHour: () => getByTestId("hour"),
		getMinute: () => getByTestId("minute"),
		getSecond: () => getByTestId("second"),
		getDayPeriod: () => getByTestId("dayPeriod"),
		getTimeZoneName: () => getByTestId("timeZoneName"),
	};
}

describe("date picker - 24-hour format with locales", () => {
	it("should allow typing hours 0-23 with non en-US locales that use 24-hour format", async () => {
		if (navigator.userAgent.includes("WebKit")) {
			expect(true);
			return;
		}

		setup({
			granularity: "minute",
			locale: "de-DE", // german uses 24-hour format
		});

		const { getHour } = getTimeSegments(page.getByTestId);
		const hour = getHour();

		// should not have dayPeriod for 24-hour locales
		await expectNotExists(page.getByTestId("dayPeriod"));

		// test typing single digit hours > 2 (issue: these get clamped to 12-hour format)
		await hour.click();
		await userEvent.keyboard("3");
		await expect.element(hour).toHaveTextContent("03");

		// test typing hours 13-23 (issue: these should work but currently clamp)
		await hour.click();
		await userEvent.keyboard("15");
		await expect.element(hour).toHaveTextContent("15");

		await hour.click();
		await userEvent.keyboard("23");
		await expect.element(hour).toHaveTextContent("23");

		await hour.click();
		await userEvent.keyboard("18");
		await expect.element(hour).toHaveTextContent("18");
	});

	it("should allow arrow key navigation through full 0-23 range with 24-hour locales", async () => {
		if (navigator.userAgent.includes("WebKit")) {
			expect(true);
			return;
		}

		const value = new CalendarDateTime(2023, 10, 12, 14, 30, 30, 0);
		setup({
			value,
			granularity: "minute",
			locale: "fr-FR", // french uses 24-hour format
		});

		const { getHour } = getTimeSegments(page.getByTestId);
		const hour = getHour();

		await expect.element(hour).toHaveTextContent("14");

		// arrow up should go to 15, not clamp to 12
		await hour.click();
		await userEvent.keyboard(kbd.ARROW_UP);
		await expect.element(hour).toHaveTextContent("15");

		// continue to 23
		for (let i = 0; i < 8; i++) {
			await userEvent.keyboard(kbd.ARROW_UP);
		}
		await expect.element(hour).toHaveTextContent("23");

		// arrow up from 23 should cycle to 00
		await userEvent.keyboard(kbd.ARROW_UP);
		await expect.element(hour).toHaveTextContent("00");

		// arrow down from 00 should go to 23
		await userEvent.keyboard(kbd.ARROW_DOWN);
		await expect.element(hour).toHaveTextContent("23");
	});

	it("should display and allow typing hours > 12 with sv-SE locale (24-hour format)", async () => {
		if (navigator.userAgent.includes("WebKit")) {
			expect(true);
			return;
		}

		const value = new CalendarDateTime(2023, 10, 12, 18, 30, 30, 0);
		setup({
			value,
			granularity: "minute",
			locale: "sv-SE", // swedish uses 24-hour format
		});

		const { getHour } = getTimeSegments(page.getByTestId);
		const hour = getHour();

		// should display 18, not clamp to 12 or convert to 12-hour format
		await expect.element(hour).toHaveTextContent("18");

		// should not have dayPeriod segment
		await expectNotExists(page.getByTestId("dayPeriod"));

		// typing should allow values > 12
		await hour.click();
		await userEvent.keyboard("20");
		await expect.element(hour).toHaveTextContent("20");

		// arrow down should work correctly (not clamp to 1-12 range)
		await hour.click();
		await userEvent.keyboard(kbd.ARROW_DOWN);
		await expect.element(hour).toHaveTextContent("19");
	});

	it("should handle ja-JP locale (24-hour format) correctly", async () => {
		if (navigator.userAgent.includes("WebKit")) {
			expect(true);
			return;
		}

		const value = new CalendarDateTime(2023, 10, 12, 16, 30, 0, 0);
		setup({
			value,
			granularity: "minute",
			locale: "ja-JP", // japanese uses 24-hour format
		});

		const { getHour } = getTimeSegments(page.getByTestId);
		const hour = getHour();

		// should display 16
		await expect.element(hour).toHaveTextContent("16");

		// should not have dayPeriod segment
		await expectNotExists(page.getByTestId("dayPeriod"));

		// typing should allow values > 12
		await hour.click();
		await userEvent.keyboard("21");
		await expect.element(hour).toHaveTextContent("21");
	});
});
