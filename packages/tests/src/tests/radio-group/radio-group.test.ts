import { render, waitFor } from "@testing-library/svelte/svelte5";
import { userEvent } from "@testing-library/user-event";
import { axe } from "jest-axe";
import { describe, it } from "vitest";
import { getTestKbd } from "../utils.js";
import RadioGroupTest from "./radio-group-test.svelte";
import type { Item, RadioGroupTestProps } from "./radio-group-test.svelte";
import type { RadioGroup } from "bits-ui";

const kbd = getTestKbd();

const testItems: Item[] = [
	{
		value: "a",
		disabled: false,
	},
	{
		value: "b",
		disabled: false,
	},
	{
		value: "c",
		disabled: false,
	},
	{
		value: "d",
		disabled: false,
	},
];

const itemIds = testItems.map((item) => `${item.value}-item`);
const indicatorIds = testItems.map((item) => `${item.value}-indicator`);

function setup(props: Partial<RadioGroupTestProps> = {}, items: Item[] = testItems) {
	const user = userEvent.setup();
	// @ts-expect-error - testing lib needs to update their generic types
	const returned = render(RadioGroupTest, { ...props, items });
	const input = document.querySelector("input") as HTMLInputElement;
	return {
		user,
		input,
		...returned,
	};
}

function randItem() {
	return Math.floor(Math.random() * 3);
}

describe("radio group", () => {
	it("should have no accessibility violations", async () => {
		// @ts-expect-error - testing lib needs to update their generic types
		const { container } = render(RadioGroupTest);
		expect(await axe(container)).toHaveNoViolations();
	});

	it("should have bits data attrs", async () => {
		// @ts-expect-error - testing lib needs to update their generic types
		const { getByTestId } = render(RadioGroupTest, {
			items: [testItems[0] as Item],
			value: testItems[0]?.value,
		});
		const root = getByTestId("root");
		const item = getByTestId(`${testItems[0]?.value}-item`);

		expect(root).toHaveAttribute("data-radio-group-root");
		expect(item).toHaveAttribute("data-radio-group-item");
	});

	it("should change the value when an item is clicked", async () => {
		const { getByTestId, user } = setup();

		for (const indicator of indicatorIds) {
			expect(getByTestId(indicator)).toHaveTextContent("false");
		}
		const itemIdx = randItem();
		const item = getByTestId(itemIds[itemIdx] as string);
		await user.click(item);
		expect(getByTestId(indicatorIds[itemIdx] as string)).toHaveTextContent("true");
	});

	it("should not change the value when a disabled item is clicked", async () => {
		const { getByTestId, user } = setup({}, [...testItems, { value: "e", disabled: true }]);

		const item = getByTestId("e-item");
		await user.click(item);
		expect(getByTestId("e-indicator")).toHaveTextContent("false");
	});

	it("should navigate through the items using the keyboard", async () => {
		const { getByTestId, user } = setup();

		const item0 = getByTestId(itemIds[0] as string);
		const item1 = getByTestId(itemIds[1] as string);
		const item2 = getByTestId(itemIds[2] as string);
		const item3 = getByTestId(itemIds[3] as string);
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

	it("should respect the loop prop", async () => {
		const { getByTestId, user } = setup({
			loop: false,
		});

		const item0 = getByTestId(itemIds[0] as string);
		const item3 = getByTestId(itemIds[3] as string);
		item0.focus();
		await waitFor(() => expect(item0).toHaveFocus());
		await user.keyboard(kbd.ARROW_UP);
		await waitFor(() => expect(item0).toHaveFocus());

		item3.focus();
		await waitFor(() => expect(item3).toHaveFocus());
		await user.keyboard(kbd.ARROW_DOWN);
		await waitFor(() => expect(item3).toHaveFocus());
	});

	it("should respect the value prop & binding", async () => {
		const { getByTestId, user, queryByTestId } = setup({
			value: "b",
		});
		const binding = getByTestId("binding");
		expect(binding).toHaveTextContent("b");
		const bindingIndic = getByTestId("b-indicator");
		expect(bindingIndic).toHaveTextContent("true");
		await user.click(binding);
		expect(binding).toHaveTextContent("a");
		expect(queryByTestId("b-indicator")).toHaveTextContent("false");
		const bindingIndic2 = getByTestId("a-indicator");
		expect(bindingIndic2).toHaveTextContent("true");
	});

	it("should modify keyboard navigation when the orientation is horizontal", async () => {
		const { getByTestId, user } = setup({
			orientation: "horizontal",
		});

		const item0 = getByTestId(itemIds[0] as string);
		const item1 = getByTestId(itemIds[1] as string);
		const item2 = getByTestId(itemIds[2] as string);
		const item3 = getByTestId(itemIds[3] as string);
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

	it("should respect the loop prop when orientation is horizontal", async () => {
		const { getByTestId, user } = setup({
			loop: false,
			orientation: "horizontal",
		});

		const item0 = getByTestId(itemIds[0] as string);
		const item3 = getByTestId(itemIds[3] as string);
		item0.focus();
		await waitFor(() => expect(item0).toHaveFocus());
		await user.keyboard(kbd.ARROW_LEFT);
		await waitFor(() => expect(item0).toHaveFocus());

		item3.focus();
		await waitFor(() => expect(item3).toHaveFocus());
		await user.keyboard(kbd.ARROW_RIGHT);
		await waitFor(() => expect(item3).toHaveFocus());
	});

	it("should not render an input if the `name` prop isn't passed", async () => {
		const { input } = setup();

		expect(input).not.toBeInTheDocument();
	});

	it("should render an input if the `name` prop is passed", async () => {
		const { input } = setup({
			name: "radio-group",
		});

		expect(input).toBeInTheDocument();
	});

	it("should syncs the inputs value with the radio group value", async () => {
		const { getByTestId, user, input } = setup({ name: "radio-group" });

		await user.click(getByTestId("a-item"));
		expect(input).toHaveValue("a");
		await user.click(getByTestId("b-item"));
		expect(input).toHaveValue("b");
	});

	it("should make the input required if the radio group is required", async () => {
		const { input } = setup({
			required: true,
			name: "radio-group",
		});

		expect(input).toHaveAttribute("required");
	});

	it("should make the input disabled if the radio group is disabled", async () => {
		const { input } = setup({
			disabled: true,
			name: "radio-group",
		});

		expect(input).toHaveAttribute("disabled");
	});
});
