import { render } from "@testing-library/svelte/svelte5";
import { axe } from "jest-axe";
import { it } from "vitest";
import type { ComponentProps } from "svelte";
import { getTestKbd, setupUserEvents, sleep } from "../utils.js";
import CommandGridTest from "./command-grid-test.svelte";

const kbd = getTestKbd();

function setup(props: Partial<ComponentProps<typeof CommandGridTest>> = {}) {
	const user = setupUserEvents();

	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	const returned = render(CommandGridTest, props as any);
	const input = returned.getByTestId("input");
	const root = returned.getByTestId("root");
	const list = returned.getByTestId("list");
	return {
		...returned,
		root,
		input,
		list,
		user,
	};
}

it("should have no accessibility violations", async () => {
	const { container } = render(CommandGridTest);
	expect(await axe(container)).toHaveNoViolations();
});

it("should select the first item by default", async () => {
	const t = setup();

	// since we aren't hardcoding a value for the item, we need to wait for
	// the component to render before we can check if the first item is selected
	await sleep(0);
	expect(t.queryByText("Introduction")).toHaveAttribute("data-selected");
});

it("should allow forcing the selected value", async () => {
	const t = setup({ value: "Introduction" });

	expect(t.queryByText("Introduction")).toHaveAttribute("data-selected");
});

it("should render the separator when search is empty and remove it when search is not empty", async () => {
	const t = setup();

	expect(t.queryByTestId("separator")).toBeInTheDocument();
	await t.user.type(t.input, "a");
	expect(t.queryByTestId("separator")).not.toBeInTheDocument();
});

it("should always render the separator when forceMount", async () => {
	const t = setup({
		separatorProps: {
			forceMount: true,
		},
	});

	expect(t.queryByTestId("separator")).toBeInTheDocument();
	await t.user.type(t.input, "a");
	expect(t.queryByTestId("separator")).toBeInTheDocument();
});

it("should show empty state when no items are found", async () => {
	const t = setup();

	expect(t.queryByTestId("empty")).not.toBeInTheDocument();

	t.input.focus();
	await t.user.type(t.input, "zzzzzzzz");
	expect(t.queryByTestId("empty")).toBeInTheDocument();
});

it("should restore original order when search is cleared", async () => {
	const t = setup();

	t.input.focus();
	await t.user.keyboard("d");
	expect(t.input).toHaveValue("d");
	expect(t.queryByText("Delegation")).toHaveAttribute("data-selected");
	expect(t.getByTestId("group-a-items").children[0]).toHaveTextContent("Delegation");
	await t.user.keyboard(kbd.BACKSPACE);
	expect(t.input).toHaveValue("");
	expect(t.queryByText("Introduction")).toHaveAttribute("data-selected");
	expect(t.getByTestId("group-a-items").children[0]).toHaveTextContent("Introduction");
});

it("should hide the group if all items are filtered out", async () => {
	const t = setup();

	await t.user.type(t.input, "radio");
	expect(t.queryByTestId("group-a")).not.toBeVisible();
	expect(t.queryByTestId("group-b")).toBeVisible();
	expect(t.queryByText("Radio Group")).toHaveAttribute("data-selected");
});

it("should navigate to the correct column in the next row", async () => {
	const t = setup();

	await sleep(0);

	expect(t.queryByText("Introduction")).toHaveAttribute("data-selected");
	await t.user.type(t.input, kbd.ARROW_DOWN);
	expect(t.queryByText("Calendar")).toHaveAttribute("data-selected");
	await t.user.type(t.input, kbd.ARROW_UP);
	expect(t.queryByText("Introduction")).toHaveAttribute("data-selected");
	await t.user.type(t.input, kbd.ARROW_RIGHT);
	expect(t.queryByText("Delegation")).toHaveAttribute("data-selected");
	await t.user.type(t.input, kbd.ARROW_DOWN);
	expect(t.queryByText("Radio Group")).toHaveAttribute("data-selected");
});
