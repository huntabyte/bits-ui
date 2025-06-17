import { expect, it, vi, describe } from "vitest";
import { render } from "vitest-browser-svelte";
import { getTestKbd } from "../utils.js";
import RadioGroupTest from "./radio-group-test.svelte";
import type { Item, RadioGroupTestProps } from "./radio-group-test.svelte";
import RadioGroupPopoverTest from "./radio-group-popover-test.svelte";
import { expectExists, setupBrowserUserEvents } from "../browser-utils";

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
	const user = setupBrowserUserEvents();
	const t = render(RadioGroupTest, { ...props, items });
	const input = document.querySelector("input") as HTMLInputElement;
	return { user, input, ...t };
}

function getRandomItemIndex(length = TEST_ITEMS.length) {
	return Math.floor(Math.random() * length);
}

describe("Data Attributes", () => {
	it("should have bits data attrs", async () => {
		const t = render(RadioGroupTest, {
			items: [TEST_ITEMS[0] as Item],
			value: TEST_ITEMS[0]?.value,
		});
		const root = t.getByTestId("root");
		const item = t.getByTestId(`${TEST_ITEMS[0]?.value}-item`);

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
		expect(t.getByTestId("b-indicator")).toHaveTextContent("false");
		const bindingIndic2 = t.getByTestId("a-indicator");
		expect(bindingIndic2).toHaveTextContent("true");
	});
});

describe("Keyboard Navigation", () => {
	it("should navigate through the items using the keyboard (up and down)", async () => {
		const t = setup();
		const [item0, item1, item2, item3] = ITEM_IDS.map((id) => t.getByTestId(id as string));

		(item0.element() as HTMLElement).focus();
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

		(item0.element() as HTMLElement).focus();
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

		(item0.element() as HTMLElement).focus();
		expect(item0).toHaveFocus();
		await t.user.keyboard(kbd.ARROW_UP);
		expect(item0).toHaveFocus();

		(item3.element() as HTMLElement).focus();
		expect(item3).toHaveFocus();
		await t.user.keyboard(kbd.ARROW_DOWN);
		expect(item3).toHaveFocus();
	});

	it("should respect the loop prop using arrow left and right keys", async () => {
		const t = setup({ loop: false });
		const [item0, _, __, item3] = ITEM_IDS.map((id) => t.getByTestId(id as string));

		(item0.element() as HTMLElement).focus();
		expect(item0).toHaveFocus();
		await t.user.keyboard(kbd.ARROW_LEFT);
		expect(item0).toHaveFocus();

		(item3.element() as HTMLElement).focus();
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
		(aItem.element() as HTMLElement).focus();
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

describe("Readonly Behavior", () => {
	it("should have readonly data attribute when readonly prop is true", async () => {
		const t = setup({ readonly: true });
		const item = t.getByTestId("a-item");
		expect(item).toHaveAttribute("data-readonly");
	});

	it("should not have readonly data attribute when readonly prop is false", async () => {
		const t = setup({ readonly: false });
		const item = t.getByTestId("a-item");
		expect(item).not.toHaveAttribute("data-readonly");
	});

	it("should have aria-readonly on root when readonly prop is true", async () => {
		const t = setup({ readonly: true });
		const root = t.getByTestId("root");
		expect(root).toHaveAttribute("aria-readonly", "true");
	});

	it("should not have aria-readonly on root when readonly prop is false", async () => {
		const t = setup({ readonly: false });
		const root = t.getByTestId("root");
		expect(root).not.toHaveAttribute("aria-readonly");
	});

	it("should not change value when readonly and item is clicked", async () => {
		const t = setup({ readonly: true, value: "b" });

		// verify initial state
		expect(t.getByTestId("b-indicator")).toHaveTextContent("true");
		expect(t.getByTestId("a-indicator")).toHaveTextContent("false");

		// click on different item
		await t.user.click(t.getByTestId("a-item"));

		// value should not change
		expect(t.getByTestId("b-indicator")).toHaveTextContent("true");
		expect(t.getByTestId("a-indicator")).toHaveTextContent("false");
	});

	it("should not change value when readonly and space key is pressed", async () => {
		const t = setup({ readonly: true, value: "b" });

		// verify initial state
		expect(t.getByTestId("b-indicator")).toHaveTextContent("true");
		expect(t.getByTestId("a-indicator")).toHaveTextContent("false");

		// focus and press space on different item
		const aItem = t.getByTestId("a-item");
		(aItem.element() as HTMLElement).focus();
		await t.user.keyboard(kbd.SPACE);

		// value should not change
		expect(t.getByTestId("b-indicator")).toHaveTextContent("true");
		expect(t.getByTestId("a-indicator")).toHaveTextContent("false");
	});

	it("should not change value when readonly and focus moves to different item", async () => {
		const t = setup({ readonly: true, value: "b" });

		// verify initial state
		expect(t.getByTestId("b-indicator")).toHaveTextContent("true");
		expect(t.getByTestId("a-indicator")).toHaveTextContent("false");

		// focus on different item
		const aItem = t.getByTestId("a-item");
		(aItem.element() as HTMLElement).focus();

		// value should not change
		expect(t.getByTestId("b-indicator")).toHaveTextContent("true");
		expect(t.getByTestId("a-indicator")).toHaveTextContent("false");
	});

	it("should allow keyboard navigation when readonly", async () => {
		const t = setup({ readonly: true, value: "b" });
		const [item0, item1, item2] = ITEM_IDS.map((id) => t.getByTestId(id as string));

		(item0.element() as HTMLElement).focus();
		expect(item0).toHaveFocus();
		await t.user.keyboard(kbd.ARROW_DOWN);
		expect(item1).toHaveFocus();
		await t.user.keyboard(kbd.ARROW_DOWN);
		expect(item2).toHaveFocus();
		await t.user.keyboard(kbd.ARROW_UP);
		expect(item1).toHaveFocus();
	});

	it("should allow focus when readonly", async () => {
		const t = setup({ readonly: true, value: "b" });

		await t.user.keyboard(kbd.TAB);
		await vi.waitFor(() => expect(t.getByTestId("b-item")).toHaveFocus());
	});

	it("should not change value when readonly and label is clicked", async () => {
		const t = setup({ readonly: true, value: "b" });

		// verify initial state
		expect(t.getByTestId("b-indicator")).toHaveTextContent("true");
		expect(t.getByTestId("a-indicator")).toHaveTextContent("false");

		// click on label of different item
		await t.user.click(t.getByTestId("a-label"));

		// value should not change
		expect(t.getByTestId("b-indicator")).toHaveTextContent("true");
		expect(t.getByTestId("a-indicator")).toHaveTextContent("false");
	});
});

describe("Focus Management", () => {
	it("should focus the first item when no value is set and focus enters the group", async () => {
		const t = setup();

		await t.user.keyboard(kbd.TAB);
		await vi.waitFor(() => expect(t.getByTestId("a-item")).toHaveFocus());
	});

	it("should focus the selected item when a value is set and focus enters the group", async () => {
		const t = setup({ value: "b" });

		await t.user.keyboard(kbd.TAB);
		await vi.waitFor(() => expect(t.getByTestId("b-item")).toHaveFocus());
	});

	it("should focus the selected item when a value is selected and focus leaves and comes back to the group", async () => {
		const t = setup();

		await t.user.click(t.getByTestId("b-item"));
		await t.user.keyboard(kbd.TAB);
		expect(t.getByTestId("binding")).toHaveFocus();
		await t.user.keyboard(kbd.SHIFT_TAB);
		await vi.waitFor(() => expect(t.getByTestId("b-item")).toHaveFocus());
	});

	it("should not change value when a value is set and an onOpenAutoFocus occurs", async () => {
		const user = setupBrowserUserEvents();
		const t = render(RadioGroupPopoverTest, {
			value: "b",
			items: TEST_ITEMS,
		});

		await user.click(t.getByTestId("trigger"));
		await expectExists(t.getByTestId("content"));

		expect(t.getByTestId("value")).toHaveTextContent("b");

		const item1 = t.getByTestId(`${TEST_ITEMS[1]?.value}-item`);
		expect(item1).toHaveFocus();
	});
});
