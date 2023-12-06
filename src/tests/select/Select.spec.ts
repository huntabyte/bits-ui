import { render, waitFor } from "@testing-library/svelte";
import userEvent from "@testing-library/user-event";
import { axe } from "jest-axe";
import { describe, it } from "vitest";
import SelectTest from "./SelectTest.svelte";
import type { Item } from "./SelectTest.svelte";
import { testKbd as kbd } from "../utils.js";
import type { Select } from "$lib";

const testItems: Item[] = [
	{
		value: "1",
		label: "A"
	},
	{
		value: "2",
		label: "B"
	},
	{
		value: "3",
		label: "C"
	},
	{
		value: "4",
		label: "D"
	}
];

function setup(props: Select.Props<unknown, false> = {}, options: Item[] = testItems) {
	const user = userEvent.setup();
	const returned = render(SelectTest, { ...props, options });
	const trigger = returned.getByTestId("trigger");
	const input = returned.getByTestId("input");
	return {
		trigger,
		user,
		input,
		...returned
	};
}
async function open(
	props: Select.Props<unknown, false> = {},
	openWith: "click" | (string & {}) = "click"
) {
	const returned = setup(props);
	const { trigger, getByTestId, queryByTestId, user } = returned;
	expect(queryByTestId("content")).toBeNull();
	if (openWith === "click") {
		await user.click(trigger);
	} else {
		trigger.focus();
		await user.keyboard(openWith);
	}
	await waitFor(() => expect(queryByTestId("content")).not.toBeNull());
	const content = getByTestId("content");
	return { content, ...returned };
}

const OPEN_KEYS = [kbd.ENTER, kbd.SPACE, kbd.ARROW_DOWN, kbd.ARROW_UP];

describe("Select", () => {
	it("has no accessibility violations", async () => {
		const { container } = render(SelectTest);
		expect(await axe(container)).toHaveNoViolations();
	});

	it("has bits data attrs", async () => {
		const { getByTestId } = await open();
		const parts = ["content", "trigger", "value", "label", "group"];

		parts.forEach((part) => {
			const el = getByTestId(part);
			expect(el).toHaveAttribute(`data-select-${part}`);
		});

		const item = getByTestId("1");
		expect(item).toHaveAttribute("data-select-item");
		1;
	});

	it("opens on click", async () => {
		await open();
	});

	it.each(OPEN_KEYS)("opens on %s keydown", async (key) => {
		await open({}, key);
	});

	it("doesnt display the hidden input", async () => {
		const { input } = await open();
		expect(input).not.toBeVisible();
	});

	it.each([kbd.SPACE, kbd.ENTER])("selects item with the %s key", async (key) => {
		const { user, queryByTestId, getByTestId } = await open();
		await user.keyboard(kbd.ARROW_DOWN);
		await user.keyboard(key);
		await waitFor(() => expect(queryByTestId("content")).toBeNull());
		expect(getByTestId("value")).toHaveTextContent("A");
	});

	it("syncs the name prop to the hidden input", async () => {
		const { input } = setup({ name: "test" });
		expect(input).toHaveAttribute("name", "test");
	});

	it("syncs the value prop to the hidden input", async () => {
		const { input } = setup({ selected: { value: "test" } });
		expect(input).toHaveValue("test");
	});

	it("syncs the required prop to the hidden input", async () => {
		const { input } = setup({ required: true });
		expect(input).toHaveAttribute("required");
	});

	it("syncs the disabled prop to the hidden input", async () => {
		const { input } = setup({ disabled: true });
		await waitFor(() => expect(input).toHaveAttribute("disabled", ""));
	});

	it("closes on escape keydown", async () => {
		const { user, queryByTestId } = await open();
		await user.keyboard(kbd.ESCAPE);
		expect(queryByTestId("content")).toBeNull();
	});

	it("closes on outside click", async () => {
		const { user, queryByTestId, getByTestId } = await open();
		const outside = getByTestId("outside");
		await user.click(outside);
		expect(queryByTestId("content")).toBeNull();
	});

	it("portals to the body by default", async () => {
		const { content } = await open();
		expect(content.parentElement).toBe(document.body);
	});

	it("portals to a custom element if specified", async () => {
		const { content, getByTestId } = await open({ portal: "#portal-target" });
		const portalTarget = getByTestId("portal-target");
		expect(content.parentElement).toBe(portalTarget);
	});

	it("does not portal if `null` is passed as portal prop", async () => {
		const { content, getByTestId } = await open({ portal: null });
		const main = getByTestId("main");
		expect(content.parentElement).toBe(main);
	});

	it("respects the `closeOnEscape` prop", async () => {
		const { user, queryByTestId } = await open({ closeOnEscape: false });
		await user.keyboard(kbd.ESCAPE);
		await waitFor(() => expect(queryByTestId("content")).not.toBeNull());
	});

	it('respects the "closeOnOutsideClick" prop', async () => {
		const { user, queryByTestId, getByTestId } = await open({
			closeOnOutsideClick: false
		});
		const outside = getByTestId("outside");
		await user.click(outside);
		await waitFor(() => expect(queryByTestId("content")).not.toBeNull());
	});

	it("respects binding the `open` prop", async () => {
		const { queryByTestId, getByTestId, user } = await open({ closeOnOutsideClick: false });
		const binding = getByTestId("open-binding");
		expect(binding).toHaveTextContent("true");
		await user.click(binding);
		expect(binding).toHaveTextContent("false");
		await waitFor(() => expect(queryByTestId("content")).toBeNull());
		await user.click(binding);
		expect(binding).toHaveTextContent("true");
		await waitFor(() => expect(queryByTestId("content")).not.toBeNull());
	});

	it("respects binding the `selected` prop", async () => {
		const { getByTestId, user } = await open({ selected: { value: "1" } });
		const binding = getByTestId("selected-binding");
		expect(binding).toHaveTextContent("1");
		await user.click(binding);
		expect(binding).toHaveTextContent("undefined");
	});

	it("selects items when clicked", async () => {
		const { getByTestId, user, queryByTestId, input, trigger } = await open();
		const item = getByTestId("1");
		await waitFor(() => expect(queryByTestId("1-indicator")).toBeNull());
		await user.click(item);
		await waitFor(() => expect(queryByTestId("content")).toBeNull());
		const value = getByTestId("value");
		expect(value).toHaveTextContent("A");
		expect(input).toHaveValue("1");
		await user.click(trigger);
		await waitFor(() => expect(queryByTestId("content")).not.toBeNull());
		expect(item).toHaveAttribute("aria-selected", "true");
		expect(item).toHaveAttribute("data-selected");
		await waitFor(() => expect(queryByTestId("1-indicator")).not.toBeNull());
	});

	it("navigates through the items using the keyboard", async () => {
		const { getByTestId, user } = await open({}, kbd.ENTER);

		const item0 = getByTestId("1");
		const item1 = getByTestId("2");
		const item2 = getByTestId("3");
		const item3 = getByTestId("4");
		await user.keyboard(kbd.ARROW_DOWN);
		await waitFor(() => expect(item0).toHaveAttribute("data-highlighted"));
		await user.keyboard(kbd.ARROW_DOWN);
		await waitFor(() => expect(item1).toHaveAttribute("data-highlighted"));
		await user.keyboard(kbd.ARROW_DOWN);
		await waitFor(() => expect(item2).toHaveAttribute("data-highlighted"));
		await user.keyboard(kbd.ARROW_DOWN);
		await waitFor(() => expect(item3).toHaveAttribute("data-highlighted"));
		await user.keyboard(kbd.ARROW_UP);
		await waitFor(() => expect(item2).toHaveAttribute("data-highlighted"));
		await user.keyboard(kbd.ARROW_UP);
		await waitFor(() => expect(item1).toHaveAttribute("data-highlighted"));
		await user.keyboard(kbd.ARROW_UP);
		await waitFor(() => expect(item0).toHaveAttribute("data-highlighted"));
	});

	it("allows items to be selected using the keyboard", async () => {
		const { getByTestId, user, queryByTestId, input, trigger } = await open({}, kbd.ENTER);

		const item0 = getByTestId("1");
		const item1 = getByTestId("2");
		const item2 = getByTestId("3");
		const item3 = getByTestId("4");
		await user.keyboard(kbd.ARROW_DOWN);
		await user.keyboard(kbd.ARROW_DOWN);
		await user.keyboard(kbd.ARROW_DOWN);
		await user.keyboard(kbd.ENTER);
		await waitFor(() => expect(queryByTestId("content")).toBeNull());
		const value = getByTestId("value");
		expect(value).toHaveTextContent("C");
		expect(input).toHaveValue("3");
		await user.click(trigger);
		await waitFor(() => expect(queryByTestId("content")).not.toBeNull());
		expect(item0).not.toHaveAttribute("data-selected");
		expect(item1).not.toHaveAttribute("data-selected");
		expect(item2).toHaveAttribute("data-selected");
		expect(item3).not.toHaveAttribute("data-selected");
	});

	it("applies the `data-highlighted` attribute on mouseover", async () => {
		const { getByTestId, user } = await open({}, kbd.ENTER);
		const item1 = getByTestId("1");
		const item2 = getByTestId("2");
		await user.hover(item1);
		await waitFor(() => expect(item1).toHaveAttribute("data-highlighted"));
		await user.hover(item2);
		await waitFor(() => expect(item2).toHaveAttribute("data-highlighted"));
		await waitFor(() => expect(item1).not.toHaveAttribute("data-highlighted"));
	});

	it("selects a default item when provided", async () => {
		const { getByTestId, queryByTestId, input } = await open({
			selected: { value: "2", label: "B" }
		});
		expect(queryByTestId("2-indicator")).not.toBeNull();
		const value = getByTestId("value");
		expect(value).toHaveTextContent("B");
		expect(input).toHaveValue("2");
		const item = getByTestId("2");
		expect(item).toHaveAttribute("aria-selected", "true");
		expect(item).toHaveAttribute("data-selected");
	});
});
