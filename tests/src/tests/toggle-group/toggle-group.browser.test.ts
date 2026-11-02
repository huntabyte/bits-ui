import { expect, it, describe } from "vitest";
import { render } from "vitest-browser-svelte";
import { getTestKbd } from "../utils.js";
import ToggleGroupTest from "./toggle-group-test.svelte";
import ToggleGroupNestedTest from "./toggle-group-nested-test.svelte";
import type { Item, SingleToggleGroupTestProps } from "./toggle-group-test.svelte";
import ToggleGroupMultipleTest, {
	type MultipleToggleGroupTestProps,
} from "./toggle-group-multi-test.svelte";
import { page, userEvent } from "@vitest/browser/context";

const kbd = getTestKbd();

const items: Item[] = [
	{
		value: "1",
		disabled: false,
	},
	{
		value: "2",
		disabled: false,
	},
	{
		value: "3",
		disabled: false,
	},
	{
		value: "4",
		disabled: false,
	},
];

function setupMultiple(props: Partial<MultipleToggleGroupTestProps> = {}) {
	// @ts-expect-error - shh
	render(ToggleGroupMultipleTest, { ...props, items });
	const root = page.getByTestId("root");
	const binding = page.getByTestId("binding");
	return {
		root,
		binding,
	};
}

function setup(props: Partial<SingleToggleGroupTestProps> = {}) {
	// @ts-expect-error - shh
	render(ToggleGroupTest, { ...props, items });
	const root = page.getByTestId("root");
	const binding = page.getByTestId("binding");
	return {
		root,
		binding,
	};
}

describe("Toggle Group", () => {
	it("should have bits data attrs", async () => {
		const t = setup();
		const item = page.getByTestId("item-1");
		await expect.element(t.root).toHaveAttribute("data-toggle-group-root");
		await expect.element(item).toHaveAttribute("data-toggle-group-item");
	});

	it("should toggle when clicked", async () => {
		const t = setup();
		await expect.element(t.binding).toHaveTextContent("");
		const item = page.getByTestId("item-1");
		await item.click();
		await expect.element(t.binding).toHaveTextContent("1");
		const item2 = page.getByTestId("item-2");
		await item2.click();
		await expect.element(t.binding).toHaveTextContent("2");
	});

	it.each([kbd.ENTER, kbd.SPACE])("should toggle when the %s key is pressed", async (key) => {
		const t = setup();
		await expect.element(t.binding).toHaveTextContent("");
		const item = page.getByTestId("item-1").element() as HTMLElement;
		item.focus();
		await userEvent.keyboard(key);
		await expect.element(t.binding).toHaveTextContent("1");
		const item2 = page.getByTestId("item-2").element() as HTMLElement;
		item2.focus();
		await userEvent.keyboard(key);
		await expect.element(t.binding).toHaveTextContent("2");
	});

	it("should navigate between the items using the arrow keys", async () => {
		const t = setup();
		await expect.element(t.binding).toHaveTextContent("");
		const item1 = page.getByTestId("item-1");
		const item2 = page.getByTestId("item-2");
		const item3 = page.getByTestId("item-3");
		const item4 = page.getByTestId("item-4");
		(item1.element() as HTMLElement).focus();
		await userEvent.keyboard(kbd.ARROW_RIGHT);
		await expect.element(item2).toHaveFocus();
		await userEvent.keyboard(kbd.ARROW_RIGHT);
		await expect.element(item3).toHaveFocus();
		await userEvent.keyboard(kbd.ARROW_RIGHT);
		await expect.element(item4).toHaveFocus();
	});

	it("should loop around when navigating with the arrow keys", async () => {
		const t = setup();
		await expect.element(t.binding).toHaveTextContent("");
		const item1 = page.getByTestId("item-1");
		const item4 = page.getByTestId("item-4");
		(item1.element() as HTMLElement).focus();
		await userEvent.keyboard(kbd.ARROW_LEFT);
		await expect.element(item4).toHaveFocus();
		await userEvent.keyboard(kbd.ARROW_RIGHT);
		await expect.element(item1).toHaveFocus();
	});

	it("should respect the loop prop", async () => {
		const t = setup({
			loop: false,
		});
		await expect.element(t.binding).toHaveTextContent("");
		const item1 = page.getByTestId("item-1");
		const item4 = page.getByTestId("item-4");
		(item1.element() as HTMLElement).focus();
		await userEvent.keyboard(kbd.ARROW_LEFT);
		await expect.element(item4).not.toHaveFocus();
		await expect.element(item1).toHaveFocus();
		(item4.element() as HTMLElement).focus();
		await userEvent.keyboard(kbd.ARROW_RIGHT);
		await expect.element(item1).not.toHaveFocus();
		await expect.element(item4).toHaveFocus();
	});

	it("should be disabled then the `disabled` prop is set to true", async () => {
		setup({ disabled: true });
		await expect.element(page.getByTestId("item-1")).toBeDisabled();
		await expect.element(page.getByTestId("item-2")).toBeDisabled();
		await expect.element(page.getByTestId("item-3")).toBeDisabled();
		await expect.element(page.getByTestId("item-4")).toBeDisabled();
	});

	it("should fire the `onChange` callback when changing", async () => {
		let newValue = "";
		function onValueChange(next: string) {
			newValue = next;
		}

		setup({ onValueChange });
		expect(newValue).toBe("");
		await page.getByTestId("item-2").click();
		expect(newValue).toBe("2");
	});

	it("should respect binding to the `value` prop", async () => {
		setup();
		const binding = page.getByTestId("binding");
		await expect.element(binding).toHaveTextContent("");
		await binding.click();
		await expect.element(binding).toHaveTextContent("4");
		const item4 = page.getByTestId("item-4");
		await expect.element(item4).toHaveAttribute("aria-checked", "true");
		await expect.element(item4).toHaveAttribute("data-state", "on");
	});

	it("should allow multiple items to be selected when `kind` is `'multiple'`", async () => {
		setupMultiple();
		const item1 = page.getByTestId("item-1");
		const item2 = page.getByTestId("item-2");
		const item3 = page.getByTestId("item-3");
		const item4 = page.getByTestId("item-4");
		const binding = page.getByTestId("binding");
		await item1.click();
		await item2.click();
		await expect.element(binding).toHaveTextContent("1,2");
		await item3.click();
		await expect.element(binding).toHaveTextContent("1,2,3");
		await item4.click();
		await expect.element(binding).toHaveTextContent("1,2,3,4");
		await item1.click();
		await expect.element(binding).toHaveTextContent("2,3,4");
		await item2.click();
		await expect.element(binding).toHaveTextContent("3,4");
		await item3.click();
		await expect.element(binding).toHaveTextContent("4");
		await item4.click();
		await expect.element(binding).toHaveTextContent("");
	});

	it("should ignore the items of a nested `ToggleGroup.Root` when navigating with the keyboard", async () => {
		render(ToggleGroupNestedTest);

		const outerItem1 = page.getByTestId("outer-item-1");
		const outerItem2 = page.getByTestId("outer-item-2");
		const innerItem1 = page.getByTestId("inner-item-1");
		const innerItem2 = page.getByTestId("inner-item-2");

		(outerItem1.element() as HTMLElement).focus();
		await userEvent.keyboard(kbd.ARROW_RIGHT);
		await expect.element(outerItem2).toHaveFocus();
		await userEvent.keyboard(kbd.ARROW_RIGHT);
		await expect.element(outerItem1).toHaveFocus();

		// the nested ToggleGroup.Root keeps navigating among its own items
		(innerItem1.element() as HTMLElement).focus();
		await userEvent.keyboard(kbd.ARROW_RIGHT);
		await expect.element(innerItem2).toHaveFocus();
		await userEvent.keyboard(kbd.ARROW_RIGHT);
		await expect.element(innerItem1).toHaveFocus();
	});
});
