import { expect, it, vi, describe } from "vitest";
import { page, type Locator } from "@vitest/browser/context";
import { render } from "vitest-browser-svelte";
import type { Component } from "svelte";
import SelectTest from "./select-test.svelte";
import SelectMultiTest from "./select-multi-test.svelte";
import SelectForceMountTest from "./select-force-mount-test.svelte";
import { getTestId } from "../helpers/select.js";
import { getTestKbd } from "../utils.js";
import { expectExists, expectNotExists, setupBrowserUserEvents } from "../browser-utils";
import type { SelectForceMountTestProps } from "./select-force-mount-test.svelte";
import type { SelectMultipleTestProps } from "./select-multi-test.svelte";
import type { Item, SelectSingleTestProps } from "./select-test.svelte";

const kbd = getTestKbd();

const testItems: Item[] = [
	{
		value: "",
		label: "None",
	},
	{
		value: "1",
		label: "A",
	},
	{
		value: "2",
		label: "B",
	},
	{
		value: "3",
		label: "C",
	},
	{
		value: "4",
		label: "D",
	},
];

function setupSingle(
	props: Partial<SelectSingleTestProps | SelectForceMountTestProps> = {},
	items: Item[] = testItems,
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	component: Component<any, any, any> = SelectTest
) {
	const user = setupBrowserUserEvents();
	render(component, { name: "test", ...props, items });

	return {
		user,
		trigger: page.getByTestId("trigger"),
		openBinding: page.getByTestId("open-binding"),
		valueBinding: page.getByTestId("value-binding"),
		outside: page.getByTestId("outside"),
		content: page.getByTestId("content"),
		hiddenInput: page.getHiddenInputs("test").first(),
	};
}

function setupMultiple(props: Partial<SelectMultipleTestProps> = {}, items: Item[] = testItems) {
	const user = setupBrowserUserEvents();
	// @ts-expect-error - testing lib needs to update their generic types
	render(SelectMultiTest, { name: "test", ...props, items });

	return {
		user,
		trigger: page.getByTestId("trigger"),
		openBinding: page.getByTestId("open-binding"),
		valueBinding: page.getByTestId("value-binding"),
		outside: page.getByTestId("outside"),
		submit: page.getByTestId("submit"),
		content: page.getByTestId("content"),
		hiddenInputs: page.getHiddenInputs("test"),
	};
}

async function openSingle(
	props: Partial<SelectSingleTestProps> = {},
	openWith: "click" | "type" | (string & {}) = "click"
) {
	const t = setupSingle(props);

	await expectNotExists(t.content);

	if (openWith === "click") {
		await t.trigger.click();
	} else {
		t.trigger.element().focus();
		await t.user.keyboard(openWith);
	}

	await expectExists(t.content);

	const group = page.getByTestId("group");
	const groupHeading = page.getByTestId("group-label");

	return Object.assign(t, { group, groupHeading });
}

async function openMultiple(
	props: Partial<SelectMultipleTestProps> = {},
	openWith: "click" | "type" | (string & {}) = "click"
) {
	const t = setupMultiple(props);

	await expectNotExists(t.content);

	if (openWith === "click") {
		await t.trigger.click();
	} else {
		t.trigger.element().focus();
		await t.user.keyboard(openWith);
	}

	await expectExists(t.content);

	return t;
}

const OPEN_KEYS = [kbd.ARROW_DOWN, kbd.ARROW_UP];

describe("select - single", () => {
	it("should open on click", async () => {
		await openSingle();
	});

	it.each(OPEN_KEYS)("should open on %s keydown", async (key) => {
		await openSingle({}, key);
	});

	it("should apply the appropriate `aria-labelledby` attribute to the group", async () => {
		const t = await openSingle();

		await expect
			.element(t.group)
			.toHaveAttribute("aria-labelledby", t.groupHeading.element().id);
	});

	it("should select item with the enter key", async () => {
		const t = await openSingle();
		t.trigger.element().focus();
		await t.user.keyboard(kbd.ARROW_DOWN);
		await t.user.keyboard(kbd.ENTER);
		await expect.element(t.trigger).toHaveTextContent("A");
	});

	it("should have the placeholder attribute when empty and not when not empty", async () => {
		const t = await openSingle();
		t.trigger.element().focus();
		await expect.element(t.trigger).toHaveAttribute("data-placeholder");
		await t.user.keyboard(kbd.ARROW_DOWN);
		await t.user.keyboard(kbd.ENTER);
		await expect.element(t.trigger).toHaveTextContent("A");
		await expect.element(t.trigger).not.toHaveAttribute("data-placeholder");
	});

	it("should render an input if the `name` prop is passed", async () => {
		const t = setupSingle();
		await expect.element(t.hiddenInput).toBeInTheDocument();
	});

	it("should not render an input if the `name` prop isn't passed or is an empty string/undefined", async () => {
		const t = setupSingle({ name: "" });
		await expect.element(t.hiddenInput).not.toBeInTheDocument();
	});

	it("should sync the value prop to the hidden input", async () => {
		const t = setupSingle({ value: "test" });
		await expect.element(t.hiddenInput).toHaveValue("test");
	});

	it("should sync the required prop to the hidden input", async () => {
		const t = setupSingle({ required: true });
		await expect.element(t.hiddenInput).toHaveAttribute("required");
	});

	it("should sync the disabled prop to the hidden input", async () => {
		const t = setupSingle({ disabled: true });
		await expect.element(t.hiddenInput).toHaveAttribute("disabled");
	});

	it("should close on escape keydown", async () => {
		const t = await openSingle();
		await t.user.keyboard(kbd.ESCAPE);
		await expectNotExists(t.content);
	});

	it("should close on outside click", async () => {
		const t = await openSingle();
		await t.outside.click();
		await expectNotExists(t.content);
	});

	it("should portal to the body by default", async () => {
		const t = await openSingle();
		expect(t.content.element().parentElement?.parentElement).toBe(document.body);
	});

	it("should portal to a custom element if specified", async () => {
		const t = await openSingle({
			portalProps: { to: "#portal-target" },
		});
		const portalTarget = page.getByTestId("portal-target").element();
		expect(t.content.element().parentElement?.parentElement).toBe(portalTarget);
	});

	it("should not portal if `disabled` is passed as portal prop", async () => {
		const t = await openSingle({ portalProps: { disabled: true } });
		const main = page.getByTestId("main").element();
		expect(t.content.element().parentElement?.parentElement).toBe(main);
	});

	it("should respect binding the `open` prop", async () => {
		const t = await openSingle();
		await expect.element(t.openBinding).toHaveTextContent("true");
		await t.openBinding.click();
		await expect.element(t.openBinding).toHaveTextContent("false");
		await vi.waitFor(() => expectNotExists(t.content));
		await t.openBinding.click();
		await expect.element(t.openBinding).toHaveTextContent("true");
		await expect.element(t.content).toBeInTheDocument();
	});

	it("should respect binding the `value` prop", async () => {
		const t = await openSingle({ value: "1" });
		await expect.element(t.valueBinding).toHaveTextContent("1");
		await t.valueBinding.click();
		await expect.element(t.valueBinding).toHaveTextContent("empty");
	});

	it("should select items when clicked", async () => {
		const t = await openSingle();
		const [, item1] = getItems();
		await expectNotExists(page.getByTestId("1-indicator"));
		await item1.click();
		await expect.element(t.trigger).toHaveTextContent("A");
		await expect.element(t.hiddenInput).toHaveValue("1");
		await t.trigger.click();
		await expectSelected(item1);
		await expectExists(page.getByTestId("1-indicator"));
	});

	it("should navigate through the items using the keyboard (loop = false)", async () => {
		const t = await openSingle({}, kbd.ARROW_DOWN);

		const [item0, item1, item2, item3, item4] = getItems();

		await expectHighlighted(item0);
		await t.user.keyboard(kbd.ARROW_DOWN);
		await expectHighlighted(item1);
		await t.user.keyboard(kbd.ARROW_DOWN);
		await expectHighlighted(item2);
		await t.user.keyboard(kbd.ARROW_DOWN);
		await expectHighlighted(item3);
		await t.user.keyboard(kbd.ARROW_DOWN);
		await expectHighlighted(item4);
		await t.user.keyboard(kbd.ARROW_UP);
		await expectHighlighted(item3);
		await t.user.keyboard(kbd.ARROW_UP);
		await expectHighlighted(item2);
		await t.user.keyboard(kbd.ARROW_UP);
		await expectHighlighted(item1);
		await t.user.keyboard(kbd.ARROW_UP);
		await expectHighlighted(item0);
	});
	it("should navigate through the items using the keyboard (loop = true)", async () => {
		const t = await openSingle(
			{
				loop: true,
			},
			kbd.ARROW_DOWN
		);

		const items = getItems();

		for (const item of items) {
			await expectHighlighted(item);
			await t.user.keyboard(kbd.ARROW_DOWN);
		}

		await expectNotHighlighted(items.at(-1)!);
		await expectHighlighted(items.at(0)!);

		for (const item of items.toReversed()) {
			await t.user.keyboard(kbd.ARROW_UP);
			await expectHighlighted(item);
		}

		await t.user.keyboard(kbd.ARROW_UP);
		await expectHighlighted(items.at(-1)!);
	});

	it("should allow items to be selected using the keyboard", async () => {
		const t = await openSingle({}, kbd.ARROW_DOWN);

		const [item0, item1, item2, item3, item4] = getItems();

		await expectHighlighted(item0);
		await t.user.keyboard(kbd.ARROW_DOWN);
		await expectHighlighted(item1);
		await t.user.keyboard(kbd.ARROW_DOWN);
		await expectHighlighted(item2);
		await t.user.keyboard(kbd.ARROW_DOWN);
		await expectHighlighted(item3);
		await t.user.keyboard(kbd.ARROW_DOWN);
		await expectHighlighted(item4);
		await t.user.keyboard(kbd.ENTER);
		await expect.element(t.trigger).toHaveTextContent("D");
		await expect.element(t.hiddenInput).toHaveValue("4");
		await t.trigger.click();
		await expectSelected(item4);
		await expectNotSelected([item0, item1, item2, item3]);
	});

	it("should select first item with empty string value when pressing Enter", async () => {
		const t = await openSingle();
		t.trigger.element().focus();
		await t.user.keyboard(kbd.ENTER); // first item ("")
		await expect.element(t.valueBinding).toHaveTextContent("empty");
		await expect.element(t.trigger).toHaveTextContent("Open Listbox");
	});

	it("should select empty string value after navigating through items", async () => {
		const t = await openSingle();
		t.trigger.element().focus();
		await t.user.keyboard(kbd.ARROW_DOWN); // to "1"
		await t.user.keyboard(kbd.ARROW_UP); // back to ""
		await t.user.keyboard(kbd.ENTER);
		await expect.element(t.valueBinding).toHaveTextContent("empty");
		await expect.element(t.trigger).toHaveTextContent("Open Listbox");
	});

	it("should select empty string value in loop navigation", async () => {
		const t = await openSingle({ loop: true });
		t.trigger.element().focus();
		await t.user.keyboard(kbd.ARROW_DOWN); // to "1"
		await t.user.keyboard(kbd.ARROW_DOWN); // to "2"
		await t.user.keyboard(kbd.ARROW_DOWN); // to "3"
		await t.user.keyboard(kbd.ARROW_DOWN); // to "4"
		await t.user.keyboard(kbd.ARROW_DOWN); // back to ""
		await t.user.keyboard(kbd.ENTER);
		await expect.element(t.valueBinding).toHaveTextContent("empty");
		await expect.element(t.trigger).toHaveTextContent("Open Listbox");
	});

	it("should revert to empty state when deselecting a value", async () => {
		const t = await openSingle();
		t.trigger.element().focus();
		// First select a non-empty value
		await t.user.keyboard(kbd.ARROW_DOWN); // to "1"
		await t.user.keyboard(kbd.ENTER);
		await expect.element(t.valueBinding).not.toHaveTextContent("empty");

		// Then deselect by selecting empty value
		await t.trigger.click();
		await t.user.keyboard(kbd.ARROW_UP); // back to ""
		await t.user.keyboard(kbd.ENTER);
		await expect.element(t.valueBinding).toHaveTextContent("empty");
		await expect.element(t.trigger).toHaveTextContent("Open Listbox");
	});

	it("should maintain empty value after reopening", async () => {
		const t = await openSingle();
		// Select empty value
		await t.user.keyboard(kbd.ENTER);
		await expect.element(t.valueBinding).toHaveTextContent("empty");

		// Close and reopen
		await t.user.keyboard(kbd.ESCAPE);
		await t.trigger.click();
		await expect.element(t.valueBinding).toHaveTextContent("empty");
		await expect.element(t.trigger).toHaveTextContent("Open Listbox");
	});

	it("should apply the `data-highlighted` attribute on mouseover", async () => {
		const t = await openSingle({}, kbd.ARROW_DOWN);
		const [item1, item2] = getItems();
		await t.user.hover(item1);
		await expectHighlighted(item1);
		await t.user.hover(item2);
		await expectHighlighted(item2);
		await expectNotHighlighted(item1);
	});

	it("should start keyboard navigation at the highlighted item even if hovered with mouse", async () => {
		const t = await openSingle({}, kbd.ARROW_DOWN);
		const [item1, item2, item3] = getItems();
		await t.user.hover(item1);
		await expectHighlighted(item1);
		await t.user.hover(item2);
		await expectHighlighted(item2);
		await expectNotHighlighted(item1);
		await t.user.keyboard(kbd.ARROW_DOWN);
		await expectHighlighted(item3);
		await expectNotHighlighted(item2);
	});

	it("should select a default item when provided", async () => {
		const t = await openSingle({
			value: "2",
		});
		await expect.element(page.getByTestId("2-indicator")).not.toBeNull();
		await expect.element(t.trigger).toHaveTextContent("B");
		await expect.element(t.hiddenInput).toHaveValue("2");
		const [_, __, item2] = getItems();
		await expectSelected(item2);
	});

	it("should allow navigating after navigating to the bottom, closing, and reopening the menu", async () => {
		const t = await openSingle();
		t.trigger.element().focus();

		const [item0, item1, item2, item3, item4] = getItems();
		await expectHighlighted(item0);
		await t.user.keyboard(kbd.ARROW_DOWN);
		await expectHighlighted(item1);
		await t.user.keyboard(kbd.ARROW_DOWN);
		await expectHighlighted(item2);
		await t.user.keyboard(kbd.ARROW_DOWN);
		await expectHighlighted(item3);
		await t.user.keyboard(kbd.ARROW_DOWN);
		await expectHighlighted(item4);
		await t.user.keyboard(kbd.ARROW_DOWN);
		await expectHighlighted(item4);
		await t.user.keyboard(kbd.ESCAPE);
		await expectNotExists(t.content);

		await t.user.keyboard(kbd.ARROW_DOWN);
		await expectExists(t.content);
		const [i0, i1] = getItems();
		await expectHighlighted(i0);
		await t.user.keyboard(kbd.ARROW_DOWN);
		await expectHighlighted(i1);
	});

	it("should forceMount the content when `forceMount` is true", async () => {
		const t = setupSingle({}, [], SelectForceMountTest);

		await expect.element(t.content).toBeVisible();
	});

	it("should forceMount the content when `forceMount` is true and the `open` snippet prop is used to conditionally render the content", async () => {
		const t = setupSingle({ withOpenCheck: true }, [], SelectForceMountTest);

		await expectNotExists(t.content);

		await t.trigger.click();

		await expectExists(t.content);
	});

	it("should not deselect the selected item when the user clicks on the selected item", async () => {
		const t = await openSingle();

		const [item0] = getItems();
		await item0.click();
		await t.trigger.click();
		await expectSelected(item0);

		const [item0v2] = getItems();
		await item0v2.click();
		await t.trigger.click();
		await expectSelected(item0v2);

		const [item0v3] = getItems();
		await expectSelected(item0v3);
	});

	it("should allow deselecting an item when `allowDeselect` is true", async () => {
		const t = await openSingle({
			allowDeselect: true,
		});
		const [, item1] = getItems();
		await item1.click();
		await t.trigger.click();
		await expectSelected(item1);

		const [, item1v2] = getItems();

		await item1v2.click();
		await expectNotSelected(item1v2);
	});

	it("should forward the `autocomplete` prop to the hidden input", async () => {
		const t = await openSingle({
			autocomplete: "one-time-code",
		});
		await expect.element(t.hiddenInput).toHaveAttribute("autocomplete", "one-time-code");
	});

	it("should not open when disabled on touch devices", async () => {
		const t = setupSingle({ disabled: true });

		// simulate touch pointerup event (which is what touch devices use)
		const touchEvent = new PointerEvent("pointerup", {
			pointerType: "touch",
		});
		t.trigger.element().dispatchEvent(touchEvent);

		await expectNotExists(page.getByTestId("content"));
	});

	it("should not open when disabled on mouse/pointer devices", async () => {
		const t = setupSingle({ disabled: true });

		// simulate mouse pointerdown event
		const mouseEvent = new PointerEvent("pointerdown", {
			pointerType: "mouse",
		});
		t.trigger.element().dispatchEvent(mouseEvent);

		await expectNotExists(page.getByTestId("content"));
	});
});

////////////////////////////////////
// MULTIPLE
////////////////////////////////////
describe("select - multiple", () => {
	it("should open on click", async () => {
		await openMultiple();
	});

	it.each(OPEN_KEYS)("should open on %s keydown", async (key) => {
		await openMultiple({}, key);
	});

	it("should select item with the enter key", async () => {
		const mockFn = vi.fn();
		const t = await openMultiple({
			onSelectedLabelChange: mockFn,
		});
		t.trigger.element().focus();
		await t.user.keyboard(kbd.ARROW_DOWN);
		await t.user.keyboard(kbd.ENTER);
		expect(mockFn).toHaveBeenCalledWith("A");
	});

	it("should have the placeholder attribute when empty and not when not empty", async () => {
		const mockFn = vi.fn();
		const t = await openMultiple({
			onSelectedLabelChange: mockFn,
		});
		t.trigger.element().focus();
		await expect.element(t.trigger).toHaveAttribute("data-placeholder");
		await t.user.keyboard(kbd.ARROW_DOWN);
		await t.user.keyboard(kbd.ENTER);
		expect(mockFn).toHaveBeenCalledWith("A");
		await expect.element(t.trigger).not.toHaveAttribute("data-placeholder");
	});

	it("should not render a hidden input if the `name` prop is passed and a value is not selected", async () => {
		const t = setupMultiple();
		expect(t.hiddenInputs.all()).toHaveLength(0);
	});

	it("should render a hidden input for each value in the `value` array, each with the same `name` prop", async () => {
		const t = setupMultiple({ value: ["a", "b"] });
		expect(t.hiddenInputs.all()).toHaveLength(2);
		await expect.element(t.hiddenInputs.nth(0)).toHaveAttribute("name", "test");
		await expect.element(t.hiddenInputs.nth(1)).toHaveAttribute("name", "test");
	});

	it("should sync the value prop to the hidden inputs", async () => {
		const t = setupMultiple({ value: ["a", "b"] });
		expect(t.hiddenInputs.all()).toHaveLength(2);
		await expect.element(t.hiddenInputs.nth(0)).toHaveValue("a");
		await expect.element(t.hiddenInputs.nth(1)).toHaveValue("b");
	});

	it("should sync the required prop to the hidden inputs", async () => {
		const t = setupMultiple({ required: true, value: ["a", "b"] });
		expect(t.hiddenInputs.all()).toHaveLength(2);

		for (const hiddenInput of t.hiddenInputs.all()) {
			await expect.element(hiddenInput).toHaveAttribute("required");
		}
	});

	it("should sync the disabled prop to the hidden inputs", async () => {
		const t = setupMultiple({ disabled: true, value: ["a", "b"] });
		expect(t.hiddenInputs.all()).toHaveLength(2);

		for (const hiddenInput of t.hiddenInputs.all()) {
			await expect.element(hiddenInput).toHaveAttribute("disabled");
		}
	});

	it("should close on escape keydown", async () => {
		const t = await openMultiple();
		await t.user.keyboard(kbd.ESCAPE);
		await expectNotExists(t.content);
	});

	it("should close on outside click", async () => {
		const t = await openMultiple();
		await t.outside.click();
		await expectNotExists(t.content);
	});

	it("should portal to the body by default", async () => {
		const t = await openMultiple();
		expect(t.content.element().parentElement?.parentElement).toBe(document.body);
	});

	it("should portal to a custom element if specified", async () => {
		const t = await openMultiple({
			portalProps: { to: "#portal-target" },
		});
		const portalTarget = page.getByTestId("portal-target").element();
		expect(t.content.element().parentElement?.parentElement).toBe(portalTarget);
	});

	it("should not portal if `disabled` is passed as portal prop", async () => {
		const t = await openMultiple({ portalProps: { disabled: true } });
		const form = page.getByTestId("form").element();
		expect(t.content.element().parentElement?.parentElement).toBe(form);
	});

	it("should respect binding the `open` prop", async () => {
		const t = await openMultiple();
		await expect.element(t.openBinding).toHaveTextContent("true");
		await t.openBinding.click();
		await expect.element(t.openBinding).toHaveTextContent("false");
		await expectNotExists(t.content);
		await t.openBinding.click();
		await expect.element(t.openBinding).toHaveTextContent("true");
		await vi.waitFor(() => expectExists(t.content));
	});

	it("should respect binding the `value` prop", async () => {
		const t = await openMultiple({ value: ["1", "2"] });
		await expect.element(t.valueBinding).toHaveTextContent("1,2");
		await t.valueBinding.click();
		await expect.element(t.valueBinding).toHaveTextContent("empty");
	});

	it("should select items when clicked", async () => {
		const t = await openMultiple();
		const [_, item] = getItems();
		await expectNotExists(page.getByTestId("1-indicator"));
		await item.click();
		await expect.element(t.trigger).toHaveTextContent("A");
		expect(t.hiddenInputs.all()).toHaveLength(1);
		await expect.element(t.hiddenInputs.nth(0)).toHaveValue("1");

		await expectSelected(item);
		await expectExists(page.getByTestId("1-indicator"));
	});

	it("should navigate through the items using the keyboard (loop = false)", async () => {
		const t = await openMultiple({}, kbd.ARROW_DOWN);

		const [item0, item1, item2, item3, item4] = getItems();

		await expectHighlighted(item0);
		await t.user.keyboard(kbd.ARROW_DOWN);
		await expectHighlighted(item1);
		await t.user.keyboard(kbd.ARROW_DOWN);
		await expectHighlighted(item2);
		await t.user.keyboard(kbd.ARROW_DOWN);
		await expectHighlighted(item3);
		await t.user.keyboard(kbd.ARROW_DOWN);
		await expectHighlighted(item4);
		await t.user.keyboard(kbd.ARROW_DOWN);
		await expectHighlighted(item4);
		await t.user.keyboard(kbd.ARROW_UP);
		await expectHighlighted(item3);
		await t.user.keyboard(kbd.ARROW_UP);
		await expectHighlighted(item2);
		await t.user.keyboard(kbd.ARROW_UP);
		await expectHighlighted(item1);
		await t.user.keyboard(kbd.ARROW_UP);
		await expectHighlighted(item0);
	});
	it("should navigate through the items using the keyboard (loop = true)", async () => {
		const t = await openSingle(
			{
				loop: true,
			},
			kbd.ARROW_DOWN
		);

		const [item0, item1, item2, item3, item4] = getItems();

		await expectHighlighted(item0);
		await t.user.keyboard(kbd.ARROW_DOWN);
		await expectHighlighted(item1);
		await t.user.keyboard(kbd.ARROW_DOWN);
		await expectHighlighted(item2);
		await t.user.keyboard(kbd.ARROW_DOWN);
		await expectHighlighted(item3);
		await t.user.keyboard(kbd.ARROW_DOWN);
		await expectHighlighted(item4);
		await t.user.keyboard(kbd.ARROW_DOWN);
		await expectNotHighlighted(item4);
		await expectHighlighted(item0);
		await t.user.keyboard(kbd.ARROW_UP);
		await expectHighlighted(item4);
		await t.user.keyboard(kbd.ARROW_UP);
		await expectHighlighted(item3);
		await t.user.keyboard(kbd.ARROW_UP);
		await expectHighlighted(item2);
		await t.user.keyboard(kbd.ARROW_UP);
		await expectHighlighted(item1);
		await t.user.keyboard(kbd.ARROW_UP);
		await expectHighlighted(item0);
		await t.user.keyboard(kbd.ARROW_UP);
		await expectHighlighted(item4);
	});

	it("should allow items to be selected using the keyboard", async () => {
		const t = await openMultiple({}, kbd.ARROW_DOWN);

		const [item0, item1, item2, item3, item4] = getItems();

		await expectHighlighted(item0);
		await t.user.keyboard(kbd.ARROW_DOWN);
		await expectHighlighted(item1);
		await t.user.keyboard(kbd.ARROW_DOWN);
		await expectHighlighted(item2);
		await t.user.keyboard(kbd.ARROW_DOWN);
		await expectHighlighted(item3);
		await t.user.keyboard(kbd.ARROW_DOWN);
		await expectHighlighted(item4);
		await t.user.keyboard(kbd.ENTER);
		await expect.element(t.trigger).toHaveTextContent("D");
		expect(t.hiddenInputs.all()).toHaveLength(1);
		await expectSelected(item4);
		await expectNotSelected([item0, item1, item2, item3]);
	});

	it("should allow multiple items to be selected using the keyboard", async () => {
		const t = await openMultiple({}, kbd.ARROW_DOWN);

		const [item0, item1, item2, item3, item4] = getItems();

		await t.user.keyboard(kbd.ARROW_DOWN);
		await t.user.keyboard(kbd.ARROW_DOWN);
		await t.user.keyboard(kbd.ARROW_DOWN);
		await t.user.keyboard(kbd.ARROW_DOWN);
		await t.user.keyboard(kbd.ENTER);
		await expect.element(t.trigger).toHaveTextContent("D");
		expect(t.hiddenInputs.all()).toHaveLength(1);
		await expect.element(t.hiddenInputs.nth(0)).toHaveValue("4");
		await expectSelected(item4);
		await expectNotSelected([item0, item1, item2, item3]);
		await t.user.keyboard(kbd.ARROW_UP);
		await expectHighlighted(item3);
		await t.user.keyboard(kbd.ENTER);
		await expectSelected([item4, item3]);
		await expectNotSelected([item0, item1, item2]);
	});

	it("should apply the `data-highlighted` attribute on mouseover", async () => {
		const t = await openMultiple({}, kbd.ARROW_DOWN);
		const [item1, item2] = getItems();
		await t.user.hover(item1);
		await expectHighlighted(item1);
		await t.user.hover(item2);
		await expectHighlighted(item2);
		await expectNotHighlighted(item1);
	});

	it("should select a default item when provided", async () => {
		const t = await openMultiple({
			value: ["2"],
		});
		await expect.element(page.getByTestId("2-indicator")).not.toBeNull();
		await expect.element(t.trigger).toHaveTextContent("B");

		await expect.element(t.hiddenInputs.nth(0)).toHaveValue("2");
		const [, , item2] = getItems();
		await expectSelected(item2);
	});

	it("should submit an empty array when the user submits the form without selecting any items", async () => {
		let submittedValues: string[] | undefined;
		const t = setupMultiple({
			onFormSubmit: (fd) => {
				submittedValues = fd.getAll("themes") as string[];
			},
			name: "themes",
		});

		await t.submit.click();
		expect(submittedValues).toHaveLength(0);
	});

	it("should not open when disabled on touch devices", async () => {
		const t = setupMultiple({ disabled: true });

		// simulate touch pointerup event (which is what touch devices use)
		const touchEvent = new PointerEvent("pointerup", {
			pointerType: "touch",
		});
		t.trigger.element().dispatchEvent(touchEvent);

		await expectNotExists(t.content);
	});

	it("should not open when disabled on mouse/pointer devices", async () => {
		const t = setupMultiple({ disabled: true });

		// simulate mouse pointerdown event
		const mouseEvent = new PointerEvent("pointerdown", {
			pointerType: "mouse",
		});
		t.trigger.element().dispatchEvent(mouseEvent);

		await expectNotExists(t.content);
	});
});

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function getItems() {
	const itemsArr: Locator[] = [];
	for (const item of testItems) {
		itemsArr.push(page.getByTestId(getTestId(item)));
	}
	return itemsArr;
}

////////////////////////////////////
// HELPERS
////////////////////////////////////

async function expectSelected(loc: Locator | Locator[]) {
	if (!Array.isArray(loc)) {
		loc = [loc];
	}
	const expects = loc.map(async (l) => {
		await expect.element(l).toHaveAttribute("data-selected");
		await expect.element(l).toHaveAttribute("aria-selected", "true");
	});

	await Promise.all(expects);
}

async function expectNotSelected(loc: Locator | Locator[]) {
	if (!Array.isArray(loc)) {
		loc = [loc];
	}
	const expects = loc.map(async (l) => {
		await expect.element(l).not.toHaveAttribute("data-selected");
		await expect.element(l).not.toHaveAttribute("aria-selected");
	});

	await Promise.all(expects);
}

async function expectHighlighted(loc: Locator | Locator[]) {
	if (!Array.isArray(loc)) {
		loc = [loc];
	}

	const expects = loc.map(async (l) => {
		await expect.element(l).toHaveAttribute("data-highlighted");
	});

	await Promise.all(expects);
}

async function expectNotHighlighted(loc: Locator | Locator[]) {
	if (!Array.isArray(loc)) {
		loc = [loc];
	}

	const expects = loc.map(async (l) => {
		await expect.element(l).not.toHaveAttribute("data-highlighted");
	});

	await Promise.all(expects);
}
