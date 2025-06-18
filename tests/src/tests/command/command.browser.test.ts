import { page, userEvent } from "@vitest/browser/context";
import { expect, it } from "vitest";
import { render } from "vitest-browser-svelte";
import type { ComponentProps } from "svelte";
import { getTestKbd, sleep } from "../utils.js";
import CommandTest from "./command-test.svelte";
import { expectExists, expectNotExists, setupBrowserUserEvents } from "../browser-utils";

const kbd = getTestKbd();

function setup(props: Partial<ComponentProps<typeof CommandTest>> = {}) {
	const user = setupBrowserUserEvents();

	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	const returned = render(CommandTest, props as any);
	const input = page.getByTestId("input").element() as HTMLInputElement;
	const root = page.getByTestId("root").element() as HTMLElement;
	const list = page.getByTestId("list").element() as HTMLElement;
	return {
		...returned,
		root,
		input,
		list,
		user,
	};
}

it("should select the first item by default", async () => {
	setup();

	// since we aren't hardcoding a value for the item, we need to wait for
	// the component to render before we can check if the first item is selected
	await sleep(0);
	expect(page.getByText("Introduction")).toHaveAttribute("data-selected");
});

it("should allow forcing the selected value", async () => {
	const t = setup({ value: "Introduction" });

	expect(t.getByText("Introduction")).toHaveAttribute("data-selected");
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

	t.input.focus();
	await userEvent.type(t.input, "zzzzzzzz");
	await expectExists(page.getByTestId("empty"));
});

it("should restore original order when search is cleared", async () => {
	const t = setup();

	t.input.focus();
	await t.user.keyboard("d");
	expect(t.input).toHaveValue("d");
	expect(page.getByText("Delegation")).toHaveAttribute("data-selected");
	expect(page.getByTestId("group-a-items").element().children[0]).toHaveTextContent("Delegation");
	await t.user.keyboard(kbd.BACKSPACE);
	expect(t.input).toHaveValue("");
	expect(page.getByText("Introduction")).toHaveAttribute("data-selected");
	expect(page.getByTestId("group-a-items").element().children[0]).toHaveTextContent(
		"Introduction"
	);
});

it("should hide the group if all items are filtered out", async () => {
	const t = setup();

	await t.user.type(t.input, "radio");
	expect(page.getByTestId("group-a")).not.toBeVisible();
	expect(page.getByTestId("group-b")).toBeVisible();
	expect(page.getByText("Radio Group")).toHaveAttribute("data-selected");
});
