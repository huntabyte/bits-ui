import { page } from "@vitest/browser/context";
import { expect, it } from "vitest";
import { render } from "vitest-browser-svelte";
import type { ComponentProps } from "svelte";
import { getTestKbd } from "../utils.js";
import CommandGridTest from "./command-grid-test.svelte";
import { expectExists, expectNotExists } from "../browser-utils";
import userEvent from "@testing-library/user-event";

const kbd = getTestKbd();

function setup(props: Partial<ComponentProps<typeof CommandGridTest>> = {}) {
	// oxlint-disable-next-line no-explicit-any
	const returned = render(CommandGridTest, props as any);
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

	await expect.element(page.getByText("Introduction")).toHaveAttribute("data-selected");
});

it("should allow forcing the selected value", async () => {
	setup({ value: "Introduction" });
	await expect.element(page.getByText("Introduction")).toHaveAttribute("data-selected");
});

it("should render the separator when search is empty and remove it when search is not empty", async () => {
	setup();

	const separator = page.getByTestId("separator");
	await expectExists(separator);
	await userEvent.type(page.getByTestId("input").element(), "a");
	await expectNotExists(separator);
});

it("should always render the separator when forceMount", async () => {
	setup({
		separatorProps: {
			forceMount: true,
		},
	});

	const separator = page.getByTestId("separator");
	await expectExists(separator);
	await userEvent.type(page.getByTestId("input").element(), "a");
	await expectExists(separator);
});

it("should show empty state when no items are found", async () => {
	const t = setup();

	await expectNotExists(page.getByTestId("empty"));
	const input = t.input.element() as HTMLElement;
	input.focus();

	await userEvent.type(input, "zzzzzzzz");
	await expectExists(page.getByTestId("empty"));
});

it("should restore original order when search is cleared", async () => {
	const t = setup();

	const input = t.input.element() as HTMLElement;

	input.focus();
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

	await userEvent.type(t.input.element(), "radio");
	await expect.element(page.getByTestId("group-a")).not.toBeVisible();
	await expect.element(page.getByTestId("group-b")).toBeVisible();
	await expect.element(page.getByText("Radio Group")).toHaveAttribute("data-selected");
});

it("should navigate to the correct column in the next row", async () => {
	const t = setup();
	await expect.element(page.getByText("Introduction")).toHaveAttribute("data-selected");
	await userEvent.type(t.input.element(), kbd.ARROW_DOWN);
	await expect.element(page.getByText("Calendar")).toHaveAttribute("data-selected");
	await userEvent.type(t.input.element(), kbd.ARROW_UP);
	await expect.element(page.getByText("Introduction")).toHaveAttribute("data-selected");
	await userEvent.type(t.input.element(), kbd.ARROW_RIGHT);
	await expect.element(page.getByText("Delegation")).toHaveAttribute("data-selected");
	await userEvent.type(t.input.element(), kbd.ARROW_DOWN);
	await expect.element(page.getByText("Radio Group")).toHaveAttribute("data-selected");
});
