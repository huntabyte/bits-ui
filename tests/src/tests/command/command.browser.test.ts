import { page, userEvent } from "vitest/browser";
import { expect, it } from "vitest";
import { render } from "vitest-browser-svelte";
import type { ComponentProps } from "svelte";
import { computeCommandScore } from "bits-ui";
import { getTestKbd } from "../utils.js";
import CommandTest from "./command-test.svelte";
import CommandRerenderTest from "./command-rerender-test.svelte";
import CommandFlatScrollTest from "./command-flat-scroll-test.svelte";
import CommandScrollTest from "./command-scroll-test.svelte";
import { expectExists, expectNotExists } from "../browser-utils";

const kbd = getTestKbd();

async function setup(props: Partial<ComponentProps<typeof CommandTest>> = {}) {
	// oxlint-disable-next-line no-explicit-any
	const returned = await render(CommandTest, props as any);
	const input = page.getByTestId("input");
	const root = page.getByTestId("root");
	const list = page.getByTestId("list");
	return {
		...returned,
		root,
		input,
		list,
	};
}

async function setupRerenderTest(props: Partial<ComponentProps<typeof CommandRerenderTest>> = {}) {
	// oxlint-disable-next-line no-explicit-any
	const returned = await render(CommandRerenderTest, props as any);
	const input = page.getByTestId("input");
	return {
		...returned,
		input,
	};
}

it("should select the first item by default", async () => {
	await setup();

	// since we aren't hardcoding a value for the item, we need to wait for
	// the component to render before we can check if the first item is selected
	await expect.element(page.getByText("Introduction")).toHaveAttribute("data-selected");
});

it("should allow forcing the selected value", async () => {
	await setup({ value: "Introduction" });

	await expect.element(page.getByText("Introduction")).toHaveAttribute("data-selected");
});

it("should respect initial value when it's not the first item", async () => {
	await setup({ value: "Radio Group" });

	// ensure the initial value is selected, not the first item
	await expect.element(page.getByText("Radio Group")).toHaveAttribute("data-selected");
	await expect.element(page.getByText("Introduction")).not.toHaveAttribute("data-selected");
});

it("should respect initial value for items in the first group", async () => {
	await setup({ value: "Styling" });

	// ensure the provided value is selected, not the first item
	await expect.element(page.getByText("Styling")).toHaveAttribute("data-selected");
	await expect.element(page.getByText("Introduction")).not.toHaveAttribute("data-selected");
});

it("should keep the clicked item active on initial click", async () => {
	const t = await setupRerenderTest();

	await userEvent.click(page.getByTestId("item-done"));
	await expect.element(page.getByTestId("selected-done")).toMatchTextContent("selected");
	await expect
		.element(page.getByRole("option", { name: /Done/ }))
		.toHaveAttribute("data-selected");
	await expect.element(page.getByText("Backlog")).not.toHaveAttribute("data-selected");

	(t.input.element() as HTMLElement).focus();
	await userEvent.keyboard(kbd.ARROW_DOWN);
	await expect.element(page.getByText("Canceled")).toHaveAttribute("data-selected");
});

it("should select the first item when searching with shouldFilter false", async () => {
	const t = await setup({ shouldFilter: false });

	(t.input.element() as HTMLElement).focus();
	await userEvent.keyboard(kbd.ARROW_DOWN);
	await userEvent.keyboard(kbd.ARROW_DOWN);
	await expect.element(page.getByText("Styling")).toHaveAttribute("data-selected");

	await userEvent.keyboard("a");
	await expect.element(t.input).toHaveValue("a");
	await expect.element(page.getByText("Introduction")).toHaveAttribute("data-selected");
	await expect.element(page.getByText("Styling")).not.toHaveAttribute("data-selected");
});

it("should not remount items when the first character is typed with shouldFilter false", async () => {
	const t = await setup({ shouldFilter: false });

	const item = page.getByText("Introduction").element();
	await userEvent.type(t.input, "a");
	await expect.element(t.input).toHaveValue("a");
	expect(page.getByText("Introduction").element()).toBe(item);

	await userEvent.clear(t.input);
	await expect.element(t.input).toHaveValue("");
	expect(page.getByText("Introduction").element()).toBe(item);
});

it("should render the separator when search is empty and remove it when search is not empty", async () => {
	const t = await setup();

	await expectExists(page.getByTestId("separator"));
	await userEvent.type(t.input, "a");
	await expectNotExists(page.getByTestId("separator"));
});

it("should always render the separator when forceMount", async () => {
	const t = await setup({
		separatorProps: {
			forceMount: true,
		},
	});

	await expectExists(page.getByTestId("separator"));
	await userEvent.type(t.input, "a");
	await expectExists(page.getByTestId("separator"));
});

it("should show empty state when no items are found", async () => {
	const t = await setup();

	await expectNotExists(page.getByTestId("empty"));

	(t.input.element() as HTMLElement).focus();
	await userEvent.type(t.input, "zzzzzzzz");
	await expectExists(page.getByTestId("empty"));
});

it("should restore original order when search is cleared", async () => {
	const t = await setup();

	(t.input.element() as HTMLElement).focus();
	await userEvent.keyboard("d");
	await expect.element(t.input).toHaveValue("d");
	await expect.element(page.getByText("Delegation")).toHaveAttribute("data-selected");
	await expect
		.element(page.getByTestId("group-a-items").element().children[0] as HTMLElement)
		.toMatchTextContent("Delegation");
	await userEvent.keyboard(kbd.BACKSPACE);
	await expect.element(t.input).toHaveValue("");
	await expect.element(page.getByText("Introduction")).toHaveAttribute("data-selected");
	await expect
		.element(page.getByTestId("group-a-items").element().children[0] as HTMLElement)
		.toMatchTextContent("Introduction");
});

it("should hide the group if all items are filtered out", async () => {
	const t = await setup();

	await userEvent.type(t.input, "radio");
	await expect.element(page.getByTestId("group-a")).not.toBeVisible();
	await expect.element(page.getByTestId("group-b")).toBeVisible();
	await expect.element(page.getByText("Radio Group")).toHaveAttribute("data-selected");
});

it("should scroll the first item back into view when there are no groups", async () => {
	await render(CommandFlatScrollTest);
	const viewport = page.getByTestId("viewport").element() as HTMLElement;
	(page.getByTestId("input").element() as HTMLElement).focus();

	await userEvent.keyboard(kbd.END);
	await expect.element(page.getByText("Item 9")).toHaveAttribute("data-selected");
	await expect.poll(() => viewport.scrollTop).toBeGreaterThan(0);

	await userEvent.keyboard(kbd.HOME);
	await expect.element(page.getByText("Item 0")).toHaveAttribute("data-selected");
	await expect.poll(() => viewport.scrollTop).toBe(0);
});

it("should select keyword matches when repeating searches across groups", async () => {
	const t = await setup();
	for (const [search, item] of [
		["tutorial", "item-introduction"],
		["forms", "item-radio-group"],
		["tutorial", "item-introduction"],
	] as const) {
		await userEvent.fill(t.input, search);
		await expect.element(page.getByTestId(item)).toHaveAttribute("data-selected");
	}
	await userEvent.clear(t.input);
	await expect.element(page.getByTestId("item-introduction")).toHaveAttribute("data-selected");
});

it("should keep invoking a custom filter when repeating searches", async () => {
	let included = "Introduction";
	const t = await setup({ filter: (value) => Number(value === included) });
	await userEvent.fill(t.input, "query");
	await expect.element(page.getByTestId("item-introduction")).toHaveAttribute("data-selected");
	included = "Radio Group";
	await userEvent.fill(t.input, "other query");
	await expect.element(page.getByTestId("item-radio-group")).toHaveAttribute("data-selected");
	await userEvent.fill(t.input, "query");
	await expect.element(page.getByTestId("item-radio-group")).toHaveAttribute("data-selected");
	await t.rerender({ filter: computeCommandScore });
	await userEvent.fill(t.input, "tutorial");
	await expect.element(page.getByTestId("item-introduction")).toHaveAttribute("data-selected");
});

it("should scroll the first item of a group into view along with its heading", async () => {
	await render(CommandScrollTest);
	const viewport = page.getByTestId("viewport").element() as HTMLElement;
	const heading = page.getByTestId("group-b-heading").element() as HTMLElement;
	const calendar = page.getByText("Calendar");
	(page.getByTestId("input").element() as HTMLElement).focus();

	function isInView(el: HTMLElement) {
		const rect = el.getBoundingClientRect();
		const viewportRect = viewport.getBoundingClientRect();
		return rect.top >= viewportRect.top - 1 && rect.bottom <= viewportRect.bottom + 1;
	}

	// moving down onto the first item of a group below the fold
	await userEvent.keyboard(kbd.ARROW_DOWN);
	await userEvent.keyboard(kbd.ARROW_DOWN);
	await userEvent.keyboard(kbd.ARROW_DOWN);
	await expect.element(calendar).toHaveAttribute("data-selected");
	await expect.poll(() => isInView(calendar.element() as HTMLElement)).toBe(true);
	await expect.poll(() => isInView(heading)).toBe(true);

	// moving up onto the first item of a group above the fold
	await userEvent.keyboard(kbd.END);
	await expect.element(page.getByText("Popover")).toHaveAttribute("data-selected");
	for (let i = 0; i < 5; i++) await userEvent.keyboard(kbd.ARROW_UP);
	await expect.element(calendar).toHaveAttribute("data-selected");
	await expect.poll(() => isInView(calendar.element() as HTMLElement)).toBe(true);
	await expect.poll(() => isInView(heading)).toBe(true);
});
