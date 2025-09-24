import { page, userEvent } from "@vitest/browser/context";
import { expect, it } from "vitest";
import { render } from "vitest-browser-svelte";
import type { ComponentProps } from "svelte";
import { getTestKbd } from "../utils.js";
import CommandTest from "./command-test.svelte";
import { expectExists, expectNotExists } from "../browser-utils";

const kbd = getTestKbd();

function setup(props: Partial<ComponentProps<typeof CommandTest>> = {}) {
	// oxlint-disable-next-line no-explicit-any
	const returned = render(CommandTest, props as any);
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

it("should select the first item by default", async () => {
	setup();

	// since we aren't hardcoding a value for the item, we need to wait for
	// the component to render before we can check if the first item is selected
	await expect.element(page.getByText("Introduction")).toHaveAttribute("data-selected");
});

it("should allow forcing the selected value", async () => {
	setup({ value: "Introduction" });

	await expect.element(page.getByText("Introduction")).toHaveAttribute("data-selected");
});

it("should render the separator when search is empty and remove it when search is not empty", async () => {
	const t = setup();

	await expectExists(page.getByTestId("separator"));
	await userEvent.type(t.input, "a");
	await expectNotExists(page.getByTestId("separator"));
});

it("should always render the separator when forceMount", async () => {
	const t = setup({
		separatorProps: {
			forceMount: true,
		},
	});

	await expectExists(page.getByTestId("separator"));
	await userEvent.type(t.input, "a");
	await expectExists(page.getByTestId("separator"));
});

it("should show empty state when no items are found", async () => {
	const t = setup();

	await expectNotExists(page.getByTestId("empty"));

	(t.input.element() as HTMLElement).focus();
	await userEvent.type(t.input, "zzzzzzzz");
	await expectExists(page.getByTestId("empty"));
});

it("should restore original order when search is cleared", async () => {
	const t = setup();

	(t.input.element() as HTMLElement).focus();
	await userEvent.keyboard("d");
	await expect.element(t.input).toHaveValue("d");
	await expect.element(page.getByText("Delegation")).toHaveAttribute("data-selected");
	await expect
		.element(page.getByTestId("group-a-items").element().children[0])
		.toHaveTextContent("Delegation");
	await userEvent.keyboard(kbd.BACKSPACE);
	await expect.element(t.input).toHaveValue("");
	await expect.element(page.getByText("Introduction")).toHaveAttribute("data-selected");
	await expect
		.element(page.getByTestId("group-a-items").element().children[0])
		.toHaveTextContent("Introduction");
});

it("should hide the group if all items are filtered out", async () => {
	const t = setup();

	await userEvent.type(t.input, "radio");
	await expect.element(page.getByTestId("group-a")).not.toBeVisible();
	await expect.element(page.getByTestId("group-b")).toBeVisible();
	await expect.element(page.getByText("Radio Group")).toHaveAttribute("data-selected");
});
