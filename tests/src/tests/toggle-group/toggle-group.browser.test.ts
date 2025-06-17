import { expect, it, describe } from "vitest";
import { render } from "vitest-browser-svelte";
import { getTestKbd, sleep } from "../utils.js";
import ToggleGroupTest from "./toggle-group-test.svelte";
import type { Item, SingleToggleGroupTestProps } from "./toggle-group-test.svelte";
import ToggleGroupMultipleTest, {
	type MultipleToggleGroupTestProps,
} from "./toggle-group-multi-test.svelte";
import { setupBrowserUserEvents } from "../browser-utils";

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
	const user = setupBrowserUserEvents();
	// @ts-expect-error - shh
	const t = render(ToggleGroupMultipleTest, { ...props, items });
	const root = t.getByTestId("root").element() as HTMLElement;
	const binding = t.getByTestId("binding").element() as HTMLElement;
	return {
		root,
		user,
		binding,
		...t,
	};
}

function setup(props: Partial<SingleToggleGroupTestProps> = {}) {
	const user = setupBrowserUserEvents();
	// @ts-expect-error - shh
	const t = render(ToggleGroupTest, { ...props, items });
	const root = t.getByTestId("root").element() as HTMLElement;
	const binding = t.getByTestId("binding");
	return {
		root,
		user,
		binding,
		...t,
	};
}

describe("Toggle Group", () => {
	it("should have bits data attrs", async () => {
		const t = setup();
		const item = t.getByTestId("item-1");
		expect(t.root).toHaveAttribute("data-toggle-group-root");
		expect(item).toHaveAttribute("data-toggle-group-item");
	});

	it("should toggle when clicked", async () => {
		const t = setup();
		expect(t.binding).toHaveTextContent("");
		const item = t.getByTestId("item-1");
		await t.user.click(item);
		expect(t.binding).toHaveTextContent("1");
		const item2 = t.getByTestId("item-2");
		await t.user.click(item2);
		expect(t.binding).toHaveTextContent("2");
	});

	it.each([kbd.ENTER, kbd.SPACE])("should toggle when the %s key is pressed", async (key) => {
		const t = setup();
		expect(t.binding).toHaveTextContent("");
		const item = t.getByTestId("item-1").element() as HTMLElement;
		item.focus();
		await t.user.keyboard(key);
		expect(t.binding).toHaveTextContent("1");
		const item2 = t.getByTestId("item-2").element() as HTMLElement;
		item2.focus();
		await t.user.keyboard(key);
		expect(t.binding).toHaveTextContent("2");
	});

	it("should navigate between the items using the arrow keys", async () => {
		const t = setup();
		expect(t.binding).toHaveTextContent("");
		const item1 = t.getByTestId("item-1").element() as HTMLElement;
		const item2 = t.getByTestId("item-2").element() as HTMLElement;
		const item3 = t.getByTestId("item-3").element() as HTMLElement;
		const item4 = t.getByTestId("item-4").element() as HTMLElement;
		item1.focus();
		await t.user.keyboard(kbd.ARROW_RIGHT);
		expect(item2).toHaveFocus();
		await t.user.keyboard(kbd.ARROW_RIGHT);
		expect(item3).toHaveFocus();
		await t.user.keyboard(kbd.ARROW_RIGHT);
		expect(item4).toHaveFocus();
	});

	it("should loop around when navigating with the arrow keys", async () => {
		const t = setup();
		expect(t.binding).toHaveTextContent("");
		const item1 = t.getByTestId("item-1").element() as HTMLElement;
		const item4 = t.getByTestId("item-4").element() as HTMLElement;
		item1.focus();
		await t.user.keyboard(kbd.ARROW_LEFT);
		expect(item4).toHaveFocus();
		await t.user.keyboard(kbd.ARROW_RIGHT);
		expect(item1).toHaveFocus();
	});

	it("should respect the loop prop", async () => {
		const t = setup({
			loop: false,
		});
		expect(t.binding).toHaveTextContent("");
		const item1 = t.getByTestId("item-1").element() as HTMLElement;
		const item4 = t.getByTestId("item-4").element() as HTMLElement;
		item1.focus();
		await t.user.keyboard(kbd.ARROW_LEFT);
		expect(item4).not.toHaveFocus();
		expect(item1).toHaveFocus();
		item4.focus();
		await t.user.keyboard(kbd.ARROW_RIGHT);
		expect(item1).not.toHaveFocus();
		expect(item4).toHaveFocus();
	});

	it("should be disabled then the `disabled` prop is set to true", async () => {
		const t = setup({ disabled: true });
		expect(t.getByTestId("item-1")).toBeDisabled();
		expect(t.getByTestId("item-2")).toBeDisabled();
		expect(t.getByTestId("item-3")).toBeDisabled();
		expect(t.getByTestId("item-4")).toBeDisabled();
	});

	it("should fire the `onChange` callback when changing", async () => {
		let newValue = "";
		function onValueChange(next: string) {
			newValue = next;
		}

		const t = setup({ onValueChange });
		expect(newValue).toBe("");
		await t.user.click(t.getByTestId("item-2"));
		expect(newValue).toBe("2");
	});

	it("should respect binding to the `value` prop", async () => {
		const t = setup();
		const binding = t.getByTestId("binding");
		expect(binding).toHaveTextContent("");
		await t.user.click(binding);
		expect(binding).toHaveTextContent("4");
		const item4 = t.getByTestId("item-4");
		expect(item4).toHaveAttribute("aria-checked", "true");
		expect(item4).toHaveAttribute("data-state", "on");
	});

	it("should allow multiple items to be selected when `kind` is `'multiple'`", async () => {
		const t = setupMultiple();
		await sleep(10);
		const item1 = t.getByTestId("item-1");
		const item2 = t.getByTestId("item-2");
		const item3 = t.getByTestId("item-3");
		const item4 = t.getByTestId("item-4");
		const binding = t.getByTestId("binding");
		await t.user.click(item1);
		await t.user.click(item2);
		expect(binding).toHaveTextContent("1,2");
		await t.user.click(item3);
		expect(binding).toHaveTextContent("1,2,3");
		await t.user.click(item4);
		expect(binding).toHaveTextContent("1,2,3,4");
		await t.user.click(item1);
		expect(binding).toHaveTextContent("2,3,4");
		await t.user.click(item2);
		expect(binding).toHaveTextContent("3,4");
		await t.user.click(item3);
		expect(binding).toHaveTextContent("4");
		await t.user.click(item4);
		expect(binding).toHaveTextContent("");
	});
});
