import { render, waitFor } from "@testing-library/svelte";
import userEvent from "@testing-library/user-event";
import { axe } from "jest-axe";
import { describe, it } from "vitest";
import RadioGroupTest from "./RadioGroupTest.svelte";
import type { Item } from "./RadioGroupTest.svelte";
import { testKbd as kbd } from "../utils.js";
import type { RadioGroup } from "$lib";

const testItems: Item[] = [
	{
		value: "a",
		disabled: false
	},
	{
		value: "b",
		disabled: false
	},
	{
		value: "c",
		disabled: false
	},
	{
		value: "d",
		disabled: false
	}
];

const itemIds = testItems.map((item) => item.value + "-item");
const indicatorIds = testItems.map((item) => item.value + "-indicator");

function setup(props: RadioGroup.Props = {}, items: Item[] = testItems) {
	const user = userEvent.setup();
	const returned = render(RadioGroupTest, { ...props, items });
	return {
		user,
		...returned
	};
}

function randItem() {
	return Math.floor(Math.random() * 3);
}

describe("Radio Group", () => {
	it("has no accessibility violations", async () => {
		const { container } = render(RadioGroupTest);
		expect(await axe(container)).toHaveNoViolations();
	});

	it("has bits data attrs", async () => {
		const { getByTestId } = render(RadioGroupTest, {
			items: [testItems[0]],
			value: testItems[0].value
		});
		const root = getByTestId("root");
		const item = getByTestId(testItems[0].value + "-item");

		expect(root).toHaveAttribute("data-radio-group-root");
		expect(item).toHaveAttribute("data-radio-group-item");
	});

	it("changes the value when an item is clicked", async () => {
		const { getByTestId, queryByTestId, user } = setup();

		for (const indicator of indicatorIds) {
			expect(queryByTestId(indicator)).toBeNull();
		}
		const itemIdx = randItem();
		const item = getByTestId(itemIds[itemIdx]);
		await user.click(item);
		await waitFor(() => expect(queryByTestId(indicatorIds[itemIdx])).not.toBeNull());
	});

	it("doesnt change the value when a disabled item is clicked", async () => {
		const { getByTestId, queryByTestId, user } = setup({}, [
			...testItems,
			{ value: "e", disabled: true }
		]);

		const item = getByTestId("e-item");
		await user.click(item);
		await waitFor(() => expect(queryByTestId("e-indicator")).toBeNull());
	});

	it("navigates through the items using the keyboard", async () => {
		const { getByTestId, user } = setup();

		const item0 = getByTestId(itemIds[0]);
		const item1 = getByTestId(itemIds[1]);
		const item2 = getByTestId(itemIds[2]);
		const item3 = getByTestId(itemIds[3]);
		item0.focus();
		await waitFor(() => expect(item0).toHaveFocus());
		await user.keyboard(kbd.ARROW_DOWN);
		await waitFor(() => expect(item1).toHaveFocus());
		await user.keyboard(kbd.ARROW_DOWN);
		await waitFor(() => expect(item2).toHaveFocus());
		await user.keyboard(kbd.ARROW_DOWN);
		await waitFor(() => expect(item3).toHaveFocus());
		await user.keyboard(kbd.ARROW_UP);
		await waitFor(() => expect(item2).toHaveFocus());
		await user.keyboard(kbd.ARROW_UP);
		await waitFor(() => expect(item1).toHaveFocus());
		await user.keyboard(kbd.ARROW_UP);
		await waitFor(() => expect(item0).toHaveFocus());
	});

	it("respects the loop prop", async () => {
		const { getByTestId, user } = setup({
			loop: false
		});

		const item0 = getByTestId(itemIds[0]);
		const item3 = getByTestId(itemIds[3]);
		item0.focus();
		await waitFor(() => expect(item0).toHaveFocus());
		await user.keyboard(kbd.ARROW_UP);
		await waitFor(() => expect(item0).toHaveFocus());

		item3.focus();
		await waitFor(() => expect(item3).toHaveFocus());
		await user.keyboard(kbd.ARROW_DOWN);
		await waitFor(() => expect(item3).toHaveFocus());
	});

	it("respects the value prop & binding", async () => {
		const { getByTestId, user, queryByTestId } = setup({
			value: "b"
		});
		const binding = getByTestId("binding");
		expect(binding).toHaveTextContent("b");
		const bindingIndic = getByTestId("b-indicator");
		expect(bindingIndic).not.toBeNull();
		await user.click(binding);
		expect(binding).toHaveTextContent("a");
		expect(queryByTestId("b-indicator")).toBeNull();
		const bindingIndic2 = getByTestId("a-indicator");
		expect(bindingIndic2).not.toBeNull();
	});

	it("modifies keyboard navigation when the orientation is horizontal", async () => {
		const { getByTestId, user } = setup({
			orientation: "horizontal"
		});

		const item0 = getByTestId(itemIds[0]);
		const item1 = getByTestId(itemIds[1]);
		const item2 = getByTestId(itemIds[2]);
		const item3 = getByTestId(itemIds[3]);
		item0.focus();
		await waitFor(() => expect(item0).toHaveFocus());
		await user.keyboard(kbd.ARROW_RIGHT);
		await waitFor(() => expect(item1).toHaveFocus());
		await user.keyboard(kbd.ARROW_RIGHT);
		await waitFor(() => expect(item2).toHaveFocus());
		await user.keyboard(kbd.ARROW_RIGHT);
		await waitFor(() => expect(item3).toHaveFocus());
		await user.keyboard(kbd.ARROW_LEFT);
		await waitFor(() => expect(item2).toHaveFocus());
		await user.keyboard(kbd.ARROW_LEFT);
		await waitFor(() => expect(item1).toHaveFocus());
		await user.keyboard(kbd.ARROW_LEFT);
		await waitFor(() => expect(item0).toHaveFocus());
		await user.keyboard(kbd.ARROW_LEFT);
		await waitFor(() => expect(item3).toHaveFocus());
	});

	it("respects the loop prop when orientation is horizontal", async () => {
		const { getByTestId, user } = setup({
			loop: false,
			orientation: "horizontal"
		});

		const item0 = getByTestId(itemIds[0]);
		const item3 = getByTestId(itemIds[3]);
		item0.focus();
		await waitFor(() => expect(item0).toHaveFocus());
		await user.keyboard(kbd.ARROW_LEFT);
		await waitFor(() => expect(item0).toHaveFocus());

		item3.focus();
		await waitFor(() => expect(item3).toHaveFocus());
		await user.keyboard(kbd.ARROW_RIGHT);
		await waitFor(() => expect(item3).toHaveFocus());
	});

	it("syncs the inputs value with the radio group value", async () => {
		const { getByTestId, user } = setup();

		const input = getByTestId("input");
		expect(input).toHaveValue("");
		await user.click(getByTestId("a-item"));
		expect(input).toHaveValue("a");
		await user.click(getByTestId("b-item"));
		expect(input).toHaveValue("b");
	});

	it("makes the input required if the radio group is required", async () => {
		const { getByTestId } = setup({
			required: true
		});

		const input = getByTestId("input");
		expect(input).toHaveAttribute("required");
	});

	it("disables the input if the radio group is disabled", async () => {
		const { getByTestId } = setup({
			disabled: true
		});

		const input = getByTestId("input");
		expect(input).toHaveAttribute("disabled");
	});
});
