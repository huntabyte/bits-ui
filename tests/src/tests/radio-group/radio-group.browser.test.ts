import { expect, it, describe } from "vitest";
import { render } from "vitest-browser-svelte";
import { getTestKbd } from "../utils.js";
import RadioGroupTest from "./radio-group-test.svelte";
import type { Item, RadioGroupTestProps } from "./radio-group-test.svelte";
import RadioGroupPopoverTest from "./radio-group-popover-test.svelte";
import { expectExists } from "../browser-utils";
import { page, userEvent } from "@vitest/browser/context";

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
	render(RadioGroupTest, { ...props, items });
	const input = document.querySelector("input") as HTMLInputElement;
	return { input };
}

function getRandomItemIndex(length = TEST_ITEMS.length) {
	return Math.floor(Math.random() * length);
}

describe("Data Attributes", () => {
	it("should have bits data attrs", async () => {
		render(RadioGroupTest, {
			items: [TEST_ITEMS[0] as Item],
			value: TEST_ITEMS[0]?.value,
		});
		const root = page.getByTestId("root");
		const item = page.getByTestId(`${TEST_ITEMS[0]?.value}-item`);

		await expect.element(root).toHaveAttribute("data-radio-group-root");
		await expect.element(item).toHaveAttribute("data-radio-group-item");
	});
});

describe("Value Changes", () => {
	it("should change the value when an item is clicked", async () => {
		setup();

		for (const indicator of INDICATOR_IDS) {
			await expect.element(page.getByTestId(indicator)).toHaveTextContent("false");
		}
		const itemIdx = getRandomItemIndex();
		const item = page.getByTestId(ITEM_IDS[itemIdx] as string);
		await item.click();
		await expect
			.element(page.getByTestId(INDICATOR_IDS[itemIdx] as string))
			.toHaveTextContent("true");
	});

	it("should not change the value when a disabled item is clicked", async () => {
		setup({}, [...TEST_ITEMS, { value: "e", disabled: true }]);

		const item = page.getByTestId("e-item");
		await item.click({ force: true });
		await expect.element(page.getByTestId("e-indicator")).toHaveTextContent("false");
	});

	it("should change the value when a label associated with an item is clicked", async () => {
		setup();

		for (const indicator of INDICATOR_IDS) {
			await expect.element(page.getByTestId(indicator)).toHaveTextContent("false");
		}
		const itemIdx = getRandomItemIndex();
		const label = page.getByTestId(LABEL_IDS[itemIdx] as string);

		await label.click();
		await expect
			.element(page.getByTestId(INDICATOR_IDS[itemIdx] as string))
			.toHaveTextContent("true");
	});

	it("should respect the value prop & binding", async () => {
		setup({ value: "b" });
		const binding = page.getByTestId("binding");
		expect(binding).toHaveTextContent("b");
		const bindingIndic = page.getByTestId("b-indicator");
		expect(bindingIndic).toHaveTextContent("true");
		await binding.click();
		await expect.element(binding).toHaveTextContent("a");
		await expect.element(page.getByTestId("b-indicator")).toHaveTextContent("false");
		const bindingIndic2 = page.getByTestId("a-indicator");
		expect(bindingIndic2).toHaveTextContent("true");
	});
});

describe("Keyboard Navigation", () => {
	it("should navigate through the items using the keyboard (up and down)", async () => {
		setup();
		const [item0, item1, item2, item3] = ITEM_IDS.map((id) => page.getByTestId(id as string));

		(item0.element() as HTMLElement).focus();
		await expect.element(item0).toHaveFocus();
		await userEvent.keyboard(kbd.ARROW_DOWN);
		await expect.element(item1).toHaveFocus();
		await userEvent.keyboard(kbd.ARROW_DOWN);
		await expect.element(item2).toHaveFocus();
		await userEvent.keyboard(kbd.ARROW_DOWN);
		await expect.element(item3).toHaveFocus();
		await userEvent.keyboard(kbd.ARROW_UP);
		await expect.element(item2).toHaveFocus();
		await userEvent.keyboard(kbd.ARROW_UP);
		await expect.element(item1).toHaveFocus();
		await userEvent.keyboard(kbd.ARROW_UP);
		await expect.element(item0).toHaveFocus();
	});

	it("should navigate through the items using the keyboard (left and right)", async () => {
		setup();
		const [item0, item1, item2, item3] = ITEM_IDS.map((id) => page.getByTestId(id as string));

		(item0.element() as HTMLElement).focus();
		await expect.element(item0).toHaveFocus();
		await userEvent.keyboard(kbd.ARROW_RIGHT);
		await expect.element(item1).toHaveFocus();
		await userEvent.keyboard(kbd.ARROW_RIGHT);
		await expect.element(item2).toHaveFocus();
		await userEvent.keyboard(kbd.ARROW_RIGHT);
		await expect.element(item3).toHaveFocus();
		await userEvent.keyboard(kbd.ARROW_LEFT);
		await expect.element(item2).toHaveFocus();
		await userEvent.keyboard(kbd.ARROW_LEFT);
		await expect.element(item1).toHaveFocus();
		await userEvent.keyboard(kbd.ARROW_LEFT);
		await expect.element(item0).toHaveFocus();
	});

	it("should respect the loop prop using arrow up and down keys", async () => {
		setup({ loop: false });
		const [item0, _, __, item3] = ITEM_IDS.map((id) => page.getByTestId(id as string));

		(item0.element() as HTMLElement).focus();
		await expect.element(item0).toHaveFocus();
		await userEvent.keyboard(kbd.ARROW_UP);
		await expect.element(item0).toHaveFocus();

		(item3.element() as HTMLElement).focus();
		await expect.element(item3).toHaveFocus();
		await userEvent.keyboard(kbd.ARROW_DOWN);
		await expect.element(item3).toHaveFocus();
	});

	it("should respect the loop prop using arrow left and right keys", async () => {
		setup({ loop: false });
		const [item0, _, __, item3] = ITEM_IDS.map((id) => page.getByTestId(id as string));

		(item0.element() as HTMLElement).focus();
		await expect.element(item0).toHaveFocus();
		await userEvent.keyboard(kbd.ARROW_LEFT);
		await expect.element(item0).toHaveFocus();

		(item3.element() as HTMLElement).focus();
		await expect.element(item3).toHaveFocus();
		await userEvent.keyboard(kbd.ARROW_RIGHT);
		await expect.element(item3).toHaveFocus();
	});
});

describe("Input Behavior", () => {
	it("should not render an input if the `name` prop isn't passed", async () => {
		const t = setup();
		await expect.element(t.input).not.toBeInTheDocument();
	});

	it("should render an input if the `name` prop is passed", async () => {
		const t = setup({ name: "radio-group" });
		await expect.element(t.input).toBeInTheDocument();
	});

	it("should sync the input's value with the radio group value", async () => {
		const t = setup({ name: "radio-group" });

		await page.getByTestId("a-item").click();
		await expect.element(t.input).toHaveValue("a");
		await page.getByTestId("b-item").click();
		await expect.element(t.input).toHaveValue("b");
	});

	it("should make the input required if the radio group is required", async () => {
		const t = setup({ required: true, name: "radio-group" });
		await expect.element(t.input).toHaveAttribute("required");
	});

	it("should make the input disabled if the radio group is disabled", async () => {
		const t = setup({ disabled: true, name: "radio-group" });
		await expect.element(t.input).toHaveAttribute("disabled");
	});

	it("should not automatically select the first item focused when the radio group does not have a value", async () => {
		const t = setup({ name: "radio-group" });

		const aItem = page.getByTestId("a-item");
		(aItem.element() as HTMLElement).focus();
		await expect.element(t.input).toHaveValue("");
		await userEvent.keyboard(kbd.ARROW_DOWN);
		await expect.element(t.input).toHaveValue("");
		const bItem = page.getByTestId("b-item");
		await expect.element(bItem).toHaveFocus();
		await userEvent.keyboard(kbd.SPACE);
		await expect.element(t.input).toHaveValue("b");
		await userEvent.keyboard(kbd.ARROW_UP);
		await expect.element(aItem).toHaveFocus();
		await expect.element(t.input).toHaveValue("a");
	});
});

describe("Readonly Behavior", () => {
	it("should have readonly data attribute when readonly prop is true", async () => {
		setup({ readonly: true });
		const item = page.getByTestId("a-item");
		await expect.element(item).toHaveAttribute("data-readonly");
	});

	it("should not have readonly data attribute when readonly prop is false", async () => {
		setup({ readonly: false });
		const item = page.getByTestId("a-item");
		await expect.element(item).not.toHaveAttribute("data-readonly");
	});

	it("should have aria-readonly on root when readonly prop is true", async () => {
		setup({ readonly: true });
		const root = page.getByTestId("root");
		await expect.element(root).toHaveAttribute("aria-readonly", "true");
	});

	it("should not have aria-readonly on root when readonly prop is false", async () => {
		setup({ readonly: false });
		const root = page.getByTestId("root");
		await expect.element(root).not.toHaveAttribute("aria-readonly");
	});

	it("should not change value when readonly and item is clicked", async () => {
		setup({ readonly: true, value: "b" });

		// verify initial state
		await expect.element(page.getByTestId("b-indicator")).toHaveTextContent("true");
		await expect.element(page.getByTestId("a-indicator")).toHaveTextContent("false");

		// click on different item
		await page.getByTestId("a-item").click();

		// value should not change
		await expect.element(page.getByTestId("b-indicator")).toHaveTextContent("true");
		await expect.element(page.getByTestId("a-indicator")).toHaveTextContent("false");
	});

	it("should not change value when readonly and space key is pressed", async () => {
		setup({ readonly: true, value: "b" });

		// verify initial state
		await expect.element(page.getByTestId("b-indicator")).toHaveTextContent("true");
		await expect.element(page.getByTestId("a-indicator")).toHaveTextContent("false");

		// focus and press space on different item
		const aItem = page.getByTestId("a-item");
		(aItem.element() as HTMLElement).focus();
		await userEvent.keyboard(kbd.SPACE);

		// value should not change
		await expect.element(page.getByTestId("b-indicator")).toHaveTextContent("true");
		await expect.element(page.getByTestId("a-indicator")).toHaveTextContent("false");
	});

	it("should not change value when readonly and focus moves to different item", async () => {
		setup({ readonly: true, value: "b" });

		// verify initial state
		await expect.element(page.getByTestId("b-indicator")).toHaveTextContent("true");
		await expect.element(page.getByTestId("a-indicator")).toHaveTextContent("false");

		// focus on different item
		const aItem = page.getByTestId("a-item");
		(aItem.element() as HTMLElement).focus();

		// value should not change
		await expect.element(page.getByTestId("b-indicator")).toHaveTextContent("true");
		await expect.element(page.getByTestId("a-indicator")).toHaveTextContent("false");
	});

	it("should allow keyboard navigation when readonly", async () => {
		setup({ readonly: true, value: "b" });
		const [item0, item1, item2] = ITEM_IDS.map((id) => page.getByTestId(id as string));

		(item0.element() as HTMLElement).focus();
		await expect.element(item0).toHaveFocus();
		await userEvent.keyboard(kbd.ARROW_DOWN);
		await expect.element(item1).toHaveFocus();
		await userEvent.keyboard(kbd.ARROW_DOWN);
		await expect.element(item2).toHaveFocus();
		await userEvent.keyboard(kbd.ARROW_UP);
		await expect.element(item1).toHaveFocus();
	});

	it("should allow focus when readonly", async () => {
		setup({ readonly: true, value: "b" });

		await userEvent.keyboard(kbd.TAB);
		await expect.element(page.getByTestId("b-item")).toHaveFocus();
	});

	it("should not change value when readonly and label is clicked", async () => {
		setup({ readonly: true, value: "b" });

		// verify initial state
		await expect.element(page.getByTestId("b-indicator")).toHaveTextContent("true");
		await expect.element(page.getByTestId("a-indicator")).toHaveTextContent("false");

		// click on label of different item
		await page.getByTestId("a-label").click();

		// value should not change
		await expect.element(page.getByTestId("b-indicator")).toHaveTextContent("true");
		await expect.element(page.getByTestId("a-indicator")).toHaveTextContent("false");
	});
});

describe("Focus Management", () => {
	it("should focus the first item when no value is set and focus enters the group", async () => {
		setup();

		await userEvent.keyboard(kbd.TAB);
		await expect.element(page.getByTestId("a-item")).toHaveFocus();
	});

	it("should focus the selected item when a value is set and focus enters the group", async () => {
		setup({ value: "b" });

		await userEvent.keyboard(kbd.TAB);
		await expect.element(page.getByTestId("b-item")).toHaveFocus();
	});

	it("should focus the selected item when a value is selected and focus leaves and comes back to the group", async () => {
		setup();

		await page.getByTestId("b-item").click();
		await userEvent.keyboard(kbd.TAB);
		await expect.element(page.getByTestId("binding")).toHaveFocus();
		await userEvent.keyboard(kbd.SHIFT_TAB);
		await expect.element(page.getByTestId("b-item")).toHaveFocus();
	});

	it("should not change value when a value is set and an onOpenAutoFocus occurs", async () => {
		render(RadioGroupPopoverTest, {
			value: "b",
			items: TEST_ITEMS,
		});

		await page.getByTestId("trigger").click();
		await expectExists(page.getByTestId("content"));

		await expect.element(page.getByTestId("value")).toHaveTextContent("b");

		const item1 = page.getByTestId(`${TEST_ITEMS[1]?.value}-item`);
		await expect.element(item1).toHaveFocus();
	});
});
