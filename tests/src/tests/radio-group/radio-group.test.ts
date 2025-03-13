import { render, waitFor } from "@testing-library/svelte/svelte5";
import { userEvent } from "@testing-library/user-event";
import { axe } from "jest-axe";
import { describe, it } from "vitest"; // Updated to include describe
import { getTestKbd, setupUserEvents } from "../utils.js";
import RadioGroupTest from "./radio-group-test.svelte";
import type { Item, RadioGroupTestProps } from "./radio-group-test.svelte";
import RadioGroupPopoverTest from "./radio-group-popover-test.svelte";

const kbd = getTestKbd();

const TEST_ITEMS: Item[] = [
	{ value: "a", disabled: false },
	{ value: "b", disabled: false },
	{ value: "c", disabled: false },
	{ value: "d", disabled: false },
];

const ITEM_IDS = TEST_ITEMS.map((item) => `${item.value}-item`);
const LABEL_IDS = TEST_ITEMS.map((item) => `${item.value}-label`);
const INDICATOR_IDS = TEST_ITEMS.map((item) => `${item.value}-indicator`);

function setup(props: Partial<RadioGroupTestProps> = {}, items: Item[] = TEST_ITEMS) {
	const user = userEvent.setup();
	const returned = render(RadioGroupTest, { ...props, items });
	const input = document.querySelector("input") as HTMLInputElement;
	return { user, input, ...returned };
}

function getRandomItemIndex(length = TEST_ITEMS.length) {
	return Math.floor(Math.random() * length);
}

describe("Accessibility", () => {
	it("should have no accessibility violations", async () => {
		const { container } = render(RadioGroupTest);
		expect(await axe(container)).toHaveNoViolations();
	});
});

describe("Data Attributes", () => {
	it("should have bits data attrs", async () => {
		const { getByTestId } = render(RadioGroupTest, {
			items: [TEST_ITEMS[0] as Item],
			value: TEST_ITEMS[0]?.value,
		});
		const root = getByTestId("root");
		const item = getByTestId(`${TEST_ITEMS[0]?.value}-item`);

		expect(root).toHaveAttribute("data-radio-group-root");
		expect(item).toHaveAttribute("data-radio-group-item");
	});
});

describe("Value Changes", () => {
	it("should change the value when an item is clicked", async () => {
		const t = setup();

		for (const indicator of INDICATOR_IDS) {
			expect(t.getByTestId(indicator)).toHaveTextContent("false");
		}
		const itemIdx = getRandomItemIndex();
		const item = t.getByTestId(ITEM_IDS[itemIdx] as string);
		await t.user.click(item);
		expect(t.getByTestId(INDICATOR_IDS[itemIdx] as string)).toHaveTextContent("true");
	});

	it("should not change the value when a disabled item is clicked", async () => {
		const t = setup({}, [...TEST_ITEMS, { value: "e", disabled: true }]);

		const item = t.getByTestId("e-item");
		await t.user.click(item);
		expect(t.getByTestId("e-indicator")).toHaveTextContent("false");
	});

	it("should change the value when a label associated with an item is clicked", async () => {
		const t = setup();

		for (const indicator of INDICATOR_IDS) {
			expect(t.getByTestId(indicator)).toHaveTextContent("false");
		}
		const itemIdx = getRandomItemIndex();
		const label = t.getByTestId(LABEL_IDS[itemIdx] as string);

		await t.user.click(label);
		expect(t.getByTestId(INDICATOR_IDS[itemIdx] as string)).toHaveTextContent("true");
	});

	it("should respect the value prop & binding", async () => {
		const t = setup({ value: "b" });
		const binding = t.getByTestId("binding");
		expect(binding).toHaveTextContent("b");
		const bindingIndic = t.getByTestId("b-indicator");
		expect(bindingIndic).toHaveTextContent("true");
		await t.user.click(binding);
		expect(binding).toHaveTextContent("a");
		expect(t.queryByTestId("b-indicator")).toHaveTextContent("false");
		const bindingIndic2 = t.getByTestId("a-indicator");
		expect(bindingIndic2).toHaveTextContent("true");
	});
});

describe("Keyboard Navigation", () => {
	it("should navigate through the items using the keyboard (up and down)", async () => {
		const t = setup();
		const [item0, item1, item2, item3] = ITEM_IDS.map((id) => t.getByTestId(id as string));

		item0.focus();
		expect(item0).toHaveFocus();
		await t.user.keyboard(kbd.ARROW_DOWN);
		expect(item1).toHaveFocus();
		await t.user.keyboard(kbd.ARROW_DOWN);
		expect(item2).toHaveFocus();
		await t.user.keyboard(kbd.ARROW_DOWN);
		expect(item3).toHaveFocus();
		await t.user.keyboard(kbd.ARROW_UP);
		expect(item2).toHaveFocus();
		await t.user.keyboard(kbd.ARROW_UP);
		expect(item1).toHaveFocus();
		await t.user.keyboard(kbd.ARROW_UP);
		expect(item0).toHaveFocus();
	});

	it("should navigate through the items using the keyboard (left and right)", async () => {
		const t = setup();
		const [item0, item1, item2, item3] = ITEM_IDS.map((id) => t.getByTestId(id as string));

		item0.focus();
		expect(item0).toHaveFocus();
		await t.user.keyboard(kbd.ARROW_RIGHT);
		expect(item1).toHaveFocus();
		await t.user.keyboard(kbd.ARROW_RIGHT);
		expect(item2).toHaveFocus();
		await t.user.keyboard(kbd.ARROW_RIGHT);
		expect(item3).toHaveFocus();
		await t.user.keyboard(kbd.ARROW_LEFT);
		expect(item2).toHaveFocus();
		await t.user.keyboard(kbd.ARROW_LEFT);
		expect(item1).toHaveFocus();
		await t.user.keyboard(kbd.ARROW_LEFT);
		expect(item0).toHaveFocus();
	});

	it("should respect the loop prop using arrow up and down keys", async () => {
		const t = setup({ loop: false });
		const [item0, _, __, item3] = ITEM_IDS.map((id) => t.getByTestId(id as string));

		item0.focus();
		expect(item0).toHaveFocus();
		await t.user.keyboard(kbd.ARROW_UP);
		expect(item0).toHaveFocus();

		item3.focus();
		expect(item3).toHaveFocus();
		await t.user.keyboard(kbd.ARROW_DOWN);
		expect(item3).toHaveFocus();
	});

	it("should respect the loop prop using arrow left and right keys", async () => {
		const t = setup({ loop: false });
		const [item0, _, __, item3] = ITEM_IDS.map((id) => t.getByTestId(id as string));

		item0.focus();
		expect(item0).toHaveFocus();
		await t.user.keyboard(kbd.ARROW_LEFT);
		expect(item0).toHaveFocus();

		item3.focus();
		expect(item3).toHaveFocus();
		await t.user.keyboard(kbd.ARROW_RIGHT);
		expect(item3).toHaveFocus();
	});
});

describe("Input Behavior", () => {
	it("should not render an input if the `name` prop isn't passed", async () => {
		const t = setup();
		expect(t.input).not.toBeInTheDocument();
	});

	it("should render an input if the `name` prop is passed", async () => {
		const t = setup({ name: "radio-group" });
		expect(t.input).toBeInTheDocument();
	});

	it("should sync the input's value with the radio group value", async () => {
		const t = setup({ name: "radio-group" });

		await t.user.click(t.getByTestId("a-item"));
		expect(t.input).toHaveValue("a");
		await t.user.click(t.getByTestId("b-item"));
		expect(t.input).toHaveValue("b");
	});

	it("should make the input required if the radio group is required", async () => {
		const t = setup({ required: true, name: "radio-group" });
		expect(t.input).toHaveAttribute("required");
	});

	it("should make the input disabled if the radio group is disabled", async () => {
		const t = setup({ disabled: true, name: "radio-group" });
		expect(t.input).toHaveAttribute("disabled");
	});

	it("should not automatically select the first item focused when the radio group does not have a value", async () => {
		const t = setup({ name: "radio-group" });

		const aItem = t.getByTestId("a-item");
		aItem.focus();
		expect(t.input).toHaveValue("");
		await t.user.keyboard(kbd.ARROW_DOWN);
		expect(t.input).toHaveValue("");
		const bItem = t.getByTestId("b-item");
		expect(bItem).toHaveFocus();
		await t.user.keyboard(kbd.SPACE);
		expect(t.input).toHaveValue("b");
		await t.user.keyboard(kbd.ARROW_UP);
		expect(aItem).toHaveFocus();
		expect(t.input).toHaveValue("a");
	});
});

describe("Focus Management", () => {
	it("should focus the first item when no value is set and focus enters the group", async () => {
		const t = setup();

		await t.user.keyboard(kbd.TAB);
		await waitFor(() => expect(t.getByTestId("a-item")).toHaveFocus());
	});

	it("should focus the selected item when a value is set and focus enters the group", async () => {
		const t = setup({ value: "b" });

		await t.user.keyboard(kbd.TAB);
		await waitFor(() => expect(t.getByTestId("b-item")).toHaveFocus());
	});

	it("should focus the selected item when a value is selected and focus leaves and comes back to the group", async () => {
		const t = setup();

		await t.user.click(t.getByTestId("b-item"));
		await t.user.keyboard(kbd.TAB);
		expect(t.getByTestId("binding")).toHaveFocus();
		await t.user.keyboard(kbd.SHIFT_TAB);
		await waitFor(() => expect(t.getByTestId("b-item")).toHaveFocus());
	});

	it("should not change value when a value is set and an onOpenAutoFocus occurs", async () => {
		const user = setupUserEvents();
		const t = render(RadioGroupPopoverTest, {
			value: "b",
			items: TEST_ITEMS,
		});

		await user.pointerDownUp(t.getByTestId("trigger"));
		await waitFor(() => expect(t.queryByTestId("content")).not.toBeNull());

		expect(t.getByTestId("value")).toHaveTextContent("b");

		const item1 = t.getByTestId(`${TEST_ITEMS[1]?.value}-item`);
		expect(item1).toHaveFocus();
	});
});
