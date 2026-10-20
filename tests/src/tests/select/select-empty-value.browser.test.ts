import { expect, it, describe } from "vitest";
import { render } from "vitest-browser-svelte";
import type { Component } from "svelte";
import { page, userEvent } from "@vitest/browser/context";
import { getTestKbd } from "../utils.js";
import type { Item } from "./select-test.svelte";
import SelectTest from "./select-test.svelte";
import SelectViewportTest from "./select-viewport-test.svelte";
import SelectMultiTest from "./select-multi-test.svelte";
import ComboboxTest from "../combobox/combobox-test.svelte";

const kbd = getTestKbd();

const itemsEmptyFirst: Item[] = [
	{ value: "", label: "All" },
	{ value: "1", label: "A" },
	{ value: "2", label: "B" },
];

const itemsEmptyLast: Item[] = [
	{ value: "1", label: "A" },
	{ value: "2", label: "B" },
	{ value: "", label: "All" },
];

// oxlint-disable-next-line no-explicit-any
const components: [string, Component<any, any, any>][] = [
	["without viewport", SelectTest],
	["with viewport", SelectViewportTest],
];

describe.each(components)("Select with an empty string item value (%s)", (_, component) => {
	describe.each([
		["first", itemsEmptyFirst],
		["last", itemsEmptyLast],
	])("empty item %s", (_, items) => {
		it("highlights the selected empty value item when reopened via keyboard (#1858)", async () => {
			render(component, { items, value: "1" });
			const trigger = page.getByTestId("trigger");
			(trigger.element() as HTMLElement).focus();

			await userEvent.keyboard(kbd.ENTER);
			await expect.element(page.getByTestId("1")).toHaveAttribute("data-highlighted");

			// move to the "All" item and select it
			const allIndex = items.findIndex((i) => i.value === "");
			const steps = allIndex - items.findIndex((i) => i.value === "1");
			for (let i = 0; i < Math.abs(steps); i++) {
				await userEvent.keyboard(steps < 0 ? kbd.ARROW_UP : kbd.ARROW_DOWN);
			}
			await expect.element(page.getByTestId("empty")).toHaveAttribute("data-highlighted");
			await userEvent.keyboard(kbd.ENTER);
			await expect.element(page.getByTestId("content")).not.toBeInTheDocument();

			// reopen: the selected "All" item should be highlighted
			await userEvent.keyboard(kbd.ENTER);
			await expect.element(page.getByTestId("content")).toBeInTheDocument();
			await expect.element(page.getByTestId("empty")).toHaveAttribute("data-highlighted");
			await expect.element(page.getByTestId("empty")).toHaveAttribute("data-selected");

			// and keyboard navigation still works from there
			await userEvent.keyboard(allIndex === 0 ? kbd.ARROW_DOWN : kbd.ARROW_UP);
			await expect
				.element(page.getByTestId(allIndex === 0 ? "1" : "2"))
				.toHaveAttribute("data-highlighted");
		});
	});
});

it("highlights a selected empty value item on open in a multiple select (#1858)", async () => {
	render(SelectMultiTest, { items: itemsEmptyLast, value: [""] });
	(page.getByTestId("trigger").element() as HTMLElement).focus();

	await userEvent.keyboard(kbd.ENTER);
	await expect.element(page.getByTestId("empty")).toHaveAttribute("data-highlighted");
});

it("selects a highlighted empty value item with Enter in a combobox (#1858)", async () => {
	render(ComboboxTest, { items: itemsEmptyLast, value: "1" });
	const input = page.getByTestId("input");
	const allItem = page.getByRole("option", { name: "All" });
	(input.element() as HTMLElement).focus();

	await userEvent.keyboard(kbd.ARROW_DOWN);
	await expect.element(page.getByTestId("1")).toHaveAttribute("data-highlighted");
	await userEvent.keyboard(kbd.ARROW_DOWN);
	await userEvent.keyboard(kbd.ARROW_DOWN);
	await expect.element(allItem).toHaveAttribute("data-highlighted");
	await userEvent.keyboard(kbd.ENTER);
	await expect.element(page.getByTestId("content")).not.toBeInTheDocument();

	await userEvent.keyboard(kbd.ARROW_DOWN);
	await expect.element(allItem).toHaveAttribute("data-selected");
	await expect.element(allItem).toHaveAttribute("data-highlighted");
});
