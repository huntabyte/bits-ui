import { expect, it, vi, describe, beforeEach } from "vitest";
import { render } from "vitest-browser-svelte";
import type { Component } from "svelte";
import { getTestId } from "../helpers/select.js";
import { getTestKbd } from "../utils.js";
import type { SelectForceMountTestProps } from "./select-force-mount-test.svelte";
import SelectForceMountTest from "./select-force-mount-test.svelte";
import type { SelectMultipleTestProps } from "./select-multi-test.svelte";
import SelectMultiTest from "./select-multi-test.svelte";
import type { Item, SelectSingleTestProps } from "./select-test.svelte";
import SelectTest from "./select-test.svelte";
import SelectViewportTest from "./select-viewport-test.svelte";
import { expectExists, expectNotExists } from "../browser-utils";
import { page, userEvent } from "@vitest/browser/context";

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
	// oxlint-disable-next-line no-explicit-any
	component: Component<any, any, any> = SelectTest
) {
	const returned = render(component, { name: "test", ...props, items });
	const trigger = page.getByTestId("trigger");
	const openBinding = page.getByTestId("open-binding");
	const valueBinding = page.getByTestId("value-binding");
	const outside = page.getByTestId("outside");

	function getContent() {
		return page.getByTestId("content");
	}

	function getHiddenInput(name = "test") {
		return returned.container.querySelector(`input[name="${name}"]`);
	}

	return {
		trigger,
		valueBinding,
		openBinding,
		outside,
		getHiddenInput,
		getContent,
	};
}

function setupMultiple(props: Partial<SelectMultipleTestProps> = {}, items: Item[] = testItems) {
	// @ts-expect-error - this is fine
	const returned = render(SelectMultiTest, { name: "test", ...props, items });
	const trigger = page.getByTestId("trigger");
	const openBinding = page.getByTestId("open-binding");
	const valueBinding = page.getByTestId("value-binding");
	const outside = page.getByTestId("outside");
	const submit = page.getByTestId("submit");

	function getHiddenInputs(name = "test") {
		return Array.from(
			returned.container.querySelectorAll<HTMLElement>(`input[name="${name}"]`)
		);
	}

	function getContent() {
		return page.getByTestId("content");
	}

	return {
		trigger,
		openBinding,
		valueBinding,
		outside,
		submit,
		getHiddenInputs,
		getContent,
	};
}

async function openSingle(
	props: Partial<SelectSingleTestProps> = {},
	openWith: "click" | "type" | (string & {}) = "click",
	_searchValue?: string
) {
	const t = setupSingle(props);

	await expectNotExists(t.getContent());

	if (openWith === "click") {
		await t.trigger.click();
	} else {
		(t.trigger.element() as HTMLElement).focus();
		await userEvent.keyboard(openWith);
	}
	await expectExists(t.getContent());
	const content = t.getContent();
	const group = page.getByTestId("group");
	const groupHeading = page.getByTestId("group-label");

	return {
		...t,
		group,
		groupHeading,
		content,
	};
}

async function openMultiple(
	props: Partial<SelectMultipleTestProps> = {},
	openWith: "click" | "type" | (string & {}) = "click",
	_searchValue?: string
) {
	const t = setupMultiple(props);
	await expectNotExists(t.getContent());
	if (openWith === "click") {
		await t.trigger.click();
	} else {
		(t.trigger.element() as HTMLElement).focus();
		await userEvent.keyboard(openWith);
	}
	await expectExists(t.getContent());
	const content = t.getContent();
	return {
		...t,
		content,
	};
}

const OPEN_KEYS = [kbd.ARROW_DOWN, kbd.ARROW_UP];

describe("select - single", () => {
	it("should open on click", async () => {
		await openSingle();
	});

	it.each(OPEN_KEYS)("should open on %s keydown", async (key) => {
		await openSingle({}, key);
	});

	it("should apply custom style prop to content", async () => {
		const t = await openSingle({
			contentProps: {
				style: { backgroundColor: "rgb(255, 0, 0)" },
			},
		});
		const contentEl = t.getContent().element() as HTMLElement;
		expect(contentEl.style.backgroundColor).toBe("rgb(255, 0, 0)");
	});

	it("should apply the appropriate `aria-labelledby` attribute to the group", async () => {
		const t = await openSingle();

		await expect
			.element(t.group)
			.toHaveAttribute("aria-labelledby", t.groupHeading.element().id);
	});

	it("should select item with the enter key", async () => {
		const t = await openSingle();
		(t.trigger.element() as HTMLElement).focus();
		await userEvent.keyboard(kbd.ARROW_DOWN);
		await userEvent.keyboard(kbd.ENTER);
		await expect.element(t.trigger).toHaveTextContent("A");
	});

	it("should have the placeholder attribute when empty and not when not empty", async () => {
		const t = await openSingle();
		(t.trigger.element() as HTMLElement).focus();
		await expect.element(t.trigger).toHaveAttribute("data-placeholder");
		await userEvent.keyboard(kbd.ARROW_DOWN);
		await userEvent.keyboard(kbd.ENTER);
		await expect.element(t.trigger).toHaveTextContent("A");
		await expect.element(t.trigger).not.toHaveAttribute("data-placeholder");
	});

	it("should render an input if the `name` prop is passed", async () => {
		const t = setupSingle();
		await expect.element(t.getHiddenInput()).toBeInTheDocument();
	});

	it("should not render an input if the `name` prop isn't passed or is an empty string/undefined", async () => {
		const t = setupSingle({ name: "" });
		await expect.element(t.getHiddenInput()).not.toBeInTheDocument();
	});

	it("should sync the value prop to the hidden input", async () => {
		const t = setupSingle({ value: "test" });
		await expect.element(t.getHiddenInput()).toHaveValue("test");
	});

	it("should sync the required prop to the hidden input", async () => {
		const t = setupSingle({ required: true });
		await expect.element(t.getHiddenInput()).toHaveAttribute("required");
	});

	it("should sync the disabled prop to the hidden input", async () => {
		const t = setupSingle({ disabled: true });
		await expect.element(t.getHiddenInput()).toHaveAttribute("disabled");
	});

	it("should close on escape keydown", async () => {
		const t = await openSingle();
		await userEvent.keyboard(kbd.ESCAPE);
		await expectNotExists(t.getContent());
	});

	it("should close on outside click", async () => {
		const t = await openSingle();

		await t.outside.click({ force: true });
		await expectNotExists(t.getContent());
	});

	it("should portal to the body by default", async () => {
		const t = await openSingle();
		expect(t.content.element().parentElement?.parentElement).toBe(document.body);
	});

	it("should portal to a custom element if specified", async () => {
		const t = await openSingle({
			portalProps: { to: "#portal-target" },
		});
		const portalTarget = page.getByTestId("portal-target").element() as HTMLElement;
		expect(t.content.element().parentElement?.parentElement).toBe(portalTarget);
	});

	it("should not portal if `disabled` is passed as portal prop", async () => {
		const t = await openSingle({ portalProps: { disabled: true } });
		const main = page.getByTestId("main").element() as HTMLElement;
		expect(t.content.element().parentElement?.parentElement).toBe(main);
	});

	it("should respect binding the `open` prop", async () => {
		const t = await openSingle();
		await expect.element(t.openBinding).toHaveTextContent("true");
		await userEvent.keyboard(kbd.ESCAPE);
		await expect.element(t.openBinding).toHaveTextContent("false");
		await expectNotExists(t.getContent());
		await t.openBinding.click();
		await expect.element(t.openBinding).toHaveTextContent("true");
		await expectExists(t.getContent());
	});

	it("should respect binding the `value` prop", async () => {
		const t = await openSingle({ value: "1" });
		await expect.element(t.valueBinding).toHaveTextContent("1");
		await userEvent.keyboard(kbd.ESCAPE);
		await t.valueBinding.click();
		await expect.element(t.valueBinding).toHaveTextContent("empty");
	});

	it("should select items when clicked", async () => {
		const t = await openSingle();
		const [_, item1] = getItems(page.getByTestId);
		await expectNotExists(page.getByTestId("1-indicator"));
		await item1.click();
		await expect.element(t.trigger).toHaveTextContent("A");
		await expect.element(t.getHiddenInput()).toHaveValue("1");
		await t.trigger.click();
		await expectSelected(item1);
		await expectExists(page.getByTestId("1-indicator"));
	});

	it("should navigate through the items using the keyboard (loop = false)", async () => {
		await openSingle({}, kbd.ARROW_DOWN);

		const [item0, item1, item2, item3, item4] = getItems(page.getByTestId);

		await expectHighlighted(item0);
		await userEvent.keyboard(kbd.ARROW_DOWN);
		await expectHighlighted(item1);
		await userEvent.keyboard(kbd.ARROW_DOWN);
		await expectHighlighted(item2);
		await userEvent.keyboard(kbd.ARROW_DOWN);
		await expectHighlighted(item3);
		await userEvent.keyboard(kbd.ARROW_DOWN);
		await expectHighlighted(item4);
		await userEvent.keyboard(kbd.ARROW_UP);
		await expectHighlighted(item3);
		await userEvent.keyboard(kbd.ARROW_UP);
		await expectHighlighted(item2);
		await userEvent.keyboard(kbd.ARROW_UP);
		await expectHighlighted(item1);
		await userEvent.keyboard(kbd.ARROW_UP);
		await expectHighlighted(item0);
	});
	it("should navigate through the items using the keyboard (loop = true)", async () => {
		await openSingle({
			loop: true,
		});

		const [item0, item1, item2, item3, item4] = getItems(page.getByTestId);

		await expectHighlighted(item0);
		await userEvent.keyboard(kbd.ARROW_DOWN);
		await expectHighlighted(item1);
		await userEvent.keyboard(kbd.ARROW_DOWN);
		await expectHighlighted(item2);
		await userEvent.keyboard(kbd.ARROW_DOWN);
		await expectHighlighted(item3);
		await userEvent.keyboard(kbd.ARROW_DOWN);
		await expectHighlighted(item4);
		await userEvent.keyboard(kbd.ARROW_DOWN);
		await expectNotHighlighted(item4);
		await expectHighlighted(item0);

		await userEvent.keyboard(kbd.ARROW_UP);
		await expectHighlighted(item4);
		await userEvent.keyboard(kbd.ARROW_UP);
		await expectHighlighted(item3);
		await userEvent.keyboard(kbd.ARROW_UP);
		await expectHighlighted(item2);
		await userEvent.keyboard(kbd.ARROW_UP);
		await expectHighlighted(item1);
		await userEvent.keyboard(kbd.ARROW_UP);
		await expectHighlighted(item0);
		await userEvent.keyboard(kbd.ARROW_UP);
		await expectHighlighted(item4);
	});

	it("should allow items to be selected using the keyboard", async () => {
		const t = await openSingle({}, kbd.ARROW_DOWN);

		const [item0, item1, item2, item3, item4] = getItems(page.getByTestId);

		await expectHighlighted(item0);
		await userEvent.keyboard(kbd.ARROW_DOWN);
		await expectHighlighted(item1);
		await userEvent.keyboard(kbd.ARROW_DOWN);
		await expectHighlighted(item2);
		await userEvent.keyboard(kbd.ARROW_DOWN);
		await expectHighlighted(item3);
		await userEvent.keyboard(kbd.ARROW_DOWN);
		await expectHighlighted(item4);
		await userEvent.keyboard(kbd.ENTER);
		await expect.element(t.trigger).toHaveTextContent("D");
		await expect.element(t.getHiddenInput()).toHaveValue("4");
		await t.trigger.click();
		await expectSelected(item4);
		await expectNotSelected([item0, item1, item2, item3]);
	});

	it("should select first item with empty string value when pressing Enter", async () => {
		const t = await openSingle();
		(t.trigger.element() as HTMLElement).focus();
		await userEvent.keyboard(kbd.ENTER); // first item ("")
		await expect.element(t.valueBinding).toHaveTextContent("empty");
		await expect.element(t.trigger).toHaveTextContent("Open Listbox");
	});

	it("should select empty string value after navigating through items", async () => {
		const t = await openSingle();
		(t.trigger.element() as HTMLElement).focus();
		await userEvent.keyboard(kbd.ARROW_DOWN); // to "1"
		await userEvent.keyboard(kbd.ARROW_UP); // back to ""
		await userEvent.keyboard(kbd.ENTER);
		await expect.element(t.valueBinding).toHaveTextContent("empty");
		await expect.element(t.trigger).toHaveTextContent("Open Listbox");
	});

	it("should select empty string value in loop navigation", async () => {
		const t = await openSingle({ loop: true });
		(t.trigger.element() as HTMLElement).focus();
		await userEvent.keyboard(kbd.ARROW_DOWN); // to "1"
		await userEvent.keyboard(kbd.ARROW_DOWN); // to "2"
		await userEvent.keyboard(kbd.ARROW_DOWN); // to "3"
		await userEvent.keyboard(kbd.ARROW_DOWN); // to "4"
		await userEvent.keyboard(kbd.ARROW_DOWN); // back to ""
		await userEvent.keyboard(kbd.ENTER);
		await expect.element(t.valueBinding).toHaveTextContent("empty");
		await expect.element(t.trigger).toHaveTextContent("Open Listbox");
	});

	it("should revert to empty state when deselecting a value", async () => {
		const t = await openSingle();
		(t.trigger.element() as HTMLElement).focus();
		// First select a non-empty value
		await userEvent.keyboard(kbd.ARROW_DOWN); // to "1"
		await userEvent.keyboard(kbd.ENTER);
		await expect.element(t.valueBinding).not.toHaveTextContent("empty");

		// Then deselect by selecting empty value
		await t.trigger.click();
		await userEvent.keyboard(kbd.ARROW_UP); // back to ""
		await userEvent.keyboard(kbd.ENTER);
		await expect.element(t.valueBinding).toHaveTextContent("empty");
		await expect.element(t.trigger).toHaveTextContent("Open Listbox");
	});

	it("should maintain empty value after reopening", async () => {
		const t = await openSingle();
		// Select empty value
		await userEvent.keyboard(kbd.ENTER);
		await expect.element(t.valueBinding).toHaveTextContent("empty");

		// Close and reopen
		await userEvent.keyboard(kbd.ESCAPE);
		await t.trigger.click();
		await expect.element(t.valueBinding).toHaveTextContent("empty");
		await expect.element(t.trigger).toHaveTextContent("Open Listbox");
	});

	it("should apply the `data-highlighted` attribute on mouseover", async () => {
		await openSingle({});
		const [item1, item2] = getItems(page.getByTestId);
		await item1.hover();
		await expectHighlighted(item1);
		await item2.hover();
		await expectHighlighted(item2);
		await expectNotHighlighted(item1);
	});

	it("should start keyboard navigation at the highlighted item even if hovered with mouse", async () => {
		await openSingle({}, kbd.ARROW_DOWN);
		const [item1, item2, item3] = getItems(page.getByTestId);
		await item1.hover();
		await expectHighlighted(item1);
		await item2.hover();
		await expectHighlighted(item2);
		await expectNotHighlighted(item1);
		await userEvent.keyboard(kbd.ARROW_DOWN);
		await expectHighlighted(item3);
		await expectNotHighlighted(item2);
	});

	it("should select a default item when provided", async () => {
		const t = await openSingle({
			value: "2",
		});
		await expect.element(page.getByTestId("2-indicator")).toBeInTheDocument();
		await expect.element(t.trigger).toHaveTextContent("B");
		await expect.element(t.getHiddenInput()).toHaveValue("2");
		const [_, __, item2] = getItems(page.getByTestId);
		await expectSelected(item2);
	});

	it("should allow navigating after navigating to the bottom, closing, and reopening the menu", async () => {
		const t = await openSingle();
		(t.trigger.element() as HTMLElement).focus();

		const [item0, item1, item2, item3, item4] = getItems(page.getByTestId);
		await expectHighlighted(item0);
		await userEvent.keyboard(kbd.ARROW_DOWN);
		await expectHighlighted(item1);
		await userEvent.keyboard(kbd.ARROW_DOWN);
		await expectHighlighted(item2);
		await userEvent.keyboard(kbd.ARROW_DOWN);
		await expectHighlighted(item3);
		await userEvent.keyboard(kbd.ARROW_DOWN);
		await expectHighlighted(item4);
		await userEvent.keyboard(kbd.ARROW_DOWN);
		await expectHighlighted(item4);
		await userEvent.keyboard(kbd.ESCAPE);
		await expectNotExists(t.getContent());
		await expect.element(t.trigger).toHaveFocus();

		await userEvent.keyboard(kbd.ARROW_DOWN);
		await expectExists(t.getContent());
		const [i0, i1] = getItems(page.getByTestId);
		await expectHighlighted(i0);
		await userEvent.keyboard(kbd.ARROW_DOWN);
		await expectHighlighted(i1);
	});

	it("should forceMount the content when `forceMount` is true", async () => {
		setupSingle({}, [], SelectForceMountTest);

		const content = page.getByTestId("content");
		await expect.element(content).toBeVisible();
	});

	it("should forceMount the content when `forceMount` is true and the `open` snippet prop is used to conditionally render the content", async () => {
		const t = setupSingle({ withOpenCheck: true }, [], SelectForceMountTest);

		await expectNotExists(page.getByTestId("content"));

		await t.trigger.click();

		await expectExists(page.getByTestId("content"));
	});

	it("should not deselect the selected item when the user clicks on the selected item", async () => {
		const t = await openSingle();

		const [item0] = getItems(page.getByTestId);
		await item0.click();
		await t.trigger.click();
		await expectSelected(item0);

		const [item0v2] = getItems(page.getByTestId);
		await item0v2.click();
		await t.trigger.click();
		await expectSelected(item0v2);

		const [item0v3] = getItems(page.getByTestId);
		await expectSelected(item0v3);
	});

	it("should allow deselecting an item when `allowDeselect` is true", async () => {
		const t = await openSingle({
			allowDeselect: true,
		});
		const [_, item1] = getItems(page.getByTestId);
		await item1.click({ force: true });
		await expectNotExists(t.getContent());
		await t.trigger.click();
		await expectSelected(item1);

		await item1.click();
		await expectExists(t.getContent());
		await expectNotSelected(item1);
	});

	it("should forward the `autocomplete` prop to the hidden input", async () => {
		const t = await openSingle({
			autocomplete: "one-time-code",
		});
		await expect.element(t.getHiddenInput()).toHaveAttribute("autocomplete", "one-time-code");
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

	it("should highlight the first item when Select.Viewport has no padding", async () => {
		const t = setupSingle({}, testItems, SelectViewportTest);

		await expectNotExists(t.getContent());
		await t.trigger.click();
		await expectExists(t.getContent());

		await expectHighlighted(page.getByTestId("empty"));
		await expectNotHighlighted(page.getByTestId("1"));
	});
});

////////////////////////////////////
// MULTIPLE
////////////////////////////////////
describe("select - multiple", () => {
	beforeEach(() => {
		vi.resetAllMocks();
	});

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
		(t.trigger.element() as HTMLElement).focus();
		await userEvent.keyboard(kbd.ARROW_DOWN);
		mockFn.mockClear();
		await userEvent.keyboard(kbd.ENTER);
		expect(mockFn).toHaveBeenCalledWith("A");
	});

	it("should have the placeholder attribute when empty and not when not empty", async () => {
		const mockFn = vi.fn();
		const t = await openMultiple({
			onSelectedLabelChange: mockFn,
		});
		(t.trigger.element() as HTMLElement).focus();
		await expect.element(t.trigger).toHaveAttribute("data-placeholder");
		await userEvent.keyboard(kbd.ARROW_DOWN);
		mockFn.mockClear();
		await userEvent.keyboard(kbd.ENTER);
		expect(mockFn).toHaveBeenCalledWith("A");
		await expect.element(t.trigger).not.toHaveAttribute("data-placeholder");
	});

	it("should render a hidden input for each value in the `value` array, each with the same `name` prop", async () => {
		const t = setupMultiple({ value: ["a", "b"] });
		const hiddenInputs = t.getHiddenInputs();
		expect(hiddenInputs).toHaveLength(2);
		await expect.element(hiddenInputs[0]).toHaveAttribute("name", "test");
		await expect.element(hiddenInputs[1]).toHaveAttribute("name", "test");
	});

	it("should sync the value prop to the hidden inputs", async () => {
		const t = setupMultiple({ value: ["a", "b"] });
		const hiddenInputs = t.getHiddenInputs();
		expect(hiddenInputs).toHaveLength(2);
		await expect.element(hiddenInputs[0]).toHaveValue("a");
		await expect.element(hiddenInputs[1]).toHaveValue("b");
	});

	it("should sync the required prop to the hidden inputs", async () => {
		const t = setupMultiple({ required: true, value: ["a", "b"] });
		const hiddenInputs = t.getHiddenInputs();
		expect(hiddenInputs).toHaveLength(2);

		for (const hiddenInput of hiddenInputs) {
			await expect.element(hiddenInput).toHaveAttribute("required");
		}
	});

	it("should sync the disabled prop to the hidden inputs", async () => {
		const t = setupMultiple({ disabled: true, value: ["a", "b"] });
		const hiddenInputs = t.getHiddenInputs();
		expect(hiddenInputs).toHaveLength(2);

		for (const hiddenInput of hiddenInputs) {
			await expect.element(hiddenInput).toHaveAttribute("disabled");
		}
	});

	it("should close on escape keydown", async () => {
		const t = await openMultiple();
		await userEvent.keyboard(kbd.ESCAPE);
		await expectNotExists(t.getContent());
	});

	it("should close on outside click", async () => {
		const t = await openMultiple();
		await t.outside.click({ force: true });
		await expectNotExists(t.getContent());
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
		await userEvent.keyboard(kbd.ESCAPE);
		await expectNotExists(t.getContent());
		await expect.element(t.openBinding).toHaveTextContent("false");
		await t.openBinding.click();
		await expect.element(t.openBinding).toHaveTextContent("true");
		await expectExists(t.getContent());
	});

	it("should respect binding the `value` prop", async () => {
		const t = await openMultiple({ value: ["1", "2"] });
		await expect.element(t.valueBinding).toHaveTextContent("1,2");
		await t.valueBinding.click();
		await expect.element(t.valueBinding).toHaveTextContent("empty");
	});

	it("should select items when clicked", async () => {
		const t = await openMultiple();
		const [_, item] = getItems(page.getByTestId);
		await expectNotExists(page.getByTestId("1-indicator"));
		await item.click();
		await expect.element(t.trigger).toHaveTextContent("A");
		expect(t.getHiddenInputs()).toHaveLength(1);
		await expect.element(t.getHiddenInputs()[0]).toHaveValue("1");

		await expectSelected(item);
		await expectExists(page.getByTestId("1-indicator"));
	});

	it("should navigate through the items using the keyboard (loop = false)", async () => {
		await openMultiple({});

		const [item0, item1, item2, item3, item4] = getItems(page.getByTestId);

		await expectHighlighted(item0);
		await userEvent.keyboard(kbd.ARROW_DOWN);
		await expectHighlighted(item1);
		await userEvent.keyboard(kbd.ARROW_DOWN);
		await expectHighlighted(item2);
		await userEvent.keyboard(kbd.ARROW_DOWN);
		await expectHighlighted(item3);
		await userEvent.keyboard(kbd.ARROW_DOWN);
		await expectHighlighted(item4);
		await userEvent.keyboard(kbd.ARROW_DOWN);
		await expectHighlighted(item4);
		await userEvent.keyboard(kbd.ARROW_UP);
		await expectHighlighted(item3);
		await userEvent.keyboard(kbd.ARROW_UP);
		await expectHighlighted(item2);
		await userEvent.keyboard(kbd.ARROW_UP);
		await expectHighlighted(item1);
		await userEvent.keyboard(kbd.ARROW_UP);
		await expectHighlighted(item0);
	});
	it("should navigate through the items using the keyboard (loop = true)", async () => {
		await openSingle({
			loop: true,
		});

		const [item0, item1, item2, item3, item4] = getItems(page.getByTestId);

		await expectHighlighted(item0);
		await userEvent.keyboard(kbd.ARROW_DOWN);
		await expectHighlighted(item1);
		await userEvent.keyboard(kbd.ARROW_DOWN);
		await expectHighlighted(item2);
		await userEvent.keyboard(kbd.ARROW_DOWN);
		await expectHighlighted(item3);
		await userEvent.keyboard(kbd.ARROW_DOWN);
		await expectHighlighted(item4);
		await userEvent.keyboard(kbd.ARROW_DOWN);
		expectNotHighlighted(item4);
		await expectHighlighted(item0);
		await userEvent.keyboard(kbd.ARROW_UP);
		await expectHighlighted(item4);
		await userEvent.keyboard(kbd.ARROW_UP);
		await expectHighlighted(item3);
		await userEvent.keyboard(kbd.ARROW_UP);
		await expectHighlighted(item2);
		await userEvent.keyboard(kbd.ARROW_UP);
		await expectHighlighted(item1);
		await userEvent.keyboard(kbd.ARROW_UP);
		await expectHighlighted(item0);
		await userEvent.keyboard(kbd.ARROW_UP);
		await expectHighlighted(item4);
	});

	it("should allow items to be selected using the keyboard", async () => {
		const t = await openMultiple({});

		const [item0, item1, item2, item3, item4] = getItems(page.getByTestId);

		await expectHighlighted(item0);
		await userEvent.keyboard(kbd.ARROW_DOWN);
		await expectHighlighted(item1);
		await userEvent.keyboard(kbd.ARROW_DOWN);
		await expectHighlighted(item2);
		await userEvent.keyboard(kbd.ARROW_DOWN);
		await expectHighlighted(item3);
		await userEvent.keyboard(kbd.ARROW_DOWN);
		await expectHighlighted(item4);
		await userEvent.keyboard(kbd.ENTER);
		await expect.element(t.trigger).toHaveTextContent("D");
		const hiddenInputs = t.getHiddenInputs();
		expect(hiddenInputs).toHaveLength(1);
		await expectSelected(item4);
		await expectNotSelected([item0, item1, item2, item3]);
	});

	it("should allow multiple items to be selected using the keyboard", async () => {
		const t = await openMultiple({});

		const [item0, item1, item2, item3, item4] = getItems(page.getByTestId);

		await userEvent.keyboard(kbd.ARROW_DOWN);
		await userEvent.keyboard(kbd.ARROW_DOWN);
		await userEvent.keyboard(kbd.ARROW_DOWN);
		await userEvent.keyboard(kbd.ARROW_DOWN);
		await userEvent.keyboard(kbd.ENTER);
		await expect.element(t.trigger).toHaveTextContent("D");
		const hiddenInputs = t.getHiddenInputs();
		expect(hiddenInputs).toHaveLength(1);
		await expect.element(hiddenInputs[0]).toHaveValue("4");
		await expectSelected(item4);
		await expectNotSelected([item0, item1, item2, item3]);
		await userEvent.keyboard(kbd.ARROW_UP);
		await expectHighlighted(item3);
		await userEvent.keyboard(kbd.ENTER);
		await expectSelected([item4, item3]);
		await expectNotSelected([item0, item1, item2]);
	});

	it("should apply the `data-highlighted` attribute on mouseover", async () => {
		await openMultiple({});
		const [item1, item2] = getItems(page.getByTestId);
		await item1.hover();
		await expectHighlighted(item1);
		await item2.hover();
		await expectHighlighted(item2);
		await expectNotHighlighted(item1);
	});

	it("should select a default item when provided", async () => {
		const t = await openMultiple({
			value: ["2"],
		});
		await expect.element(page.getByTestId("2-indicator")).not.toBeNull();
		await expect.element(t.trigger).toHaveTextContent("B");

		await expect.element(t.getHiddenInputs()[0]).toHaveValue("2");
		const [_, __, item2] = getItems(page.getByTestId);
		await expectSelected(item2);
	});

	it("should submit an array with a single empty string when the user submits the form without selecting any items", async () => {
		let submittedValues: string[] | undefined;
		const t = setupMultiple({
			onFormSubmit: (fd: FormData) => {
				submittedValues = fd.getAll("themes") as string[];
			},
			name: "themes",
		});

		await t.submit.click();
		expect(submittedValues).toHaveLength(1);
		expect(submittedValues![0]).toBe("");
	});

	it("should not open when disabled on touch devices", async () => {
		const t = setupMultiple({ disabled: true });

		// simulate touch pointerup event (which is what touch devices use)
		const touchEvent = new PointerEvent("pointerup", {
			pointerType: "touch",
		});
		t.trigger.element().dispatchEvent(touchEvent);

		await expectNotExists(t.getContent());
	});

	it("should not open when disabled on mouse/pointer devices", async () => {
		const t = setupMultiple({ disabled: true });

		await t.trigger.click({ force: true });

		await expectNotExists(t.getContent());
	});

	it("should not submit an array with a single empty string when the `name` prop is passed but no items are selected", async () => {
		let submittedValues: string[] | undefined;
		const t = setupMultiple({
			onFormSubmit: (fd: FormData) => {
				submittedValues = fd.getAll("themes") as string[];
			},
		});
		await t.submit.click();
		expect(submittedValues).toHaveLength(0);
	});
});

function getItems(getter: typeof page.getByTestId, items = testItems) {
	const itemsArr: ReturnType<typeof page.getByTestId>[] = [];
	for (const item of items) {
		itemsArr.push(getter(getTestId(item)));
	}
	return itemsArr;
}

////////////////////////////////////
// HELPERS
////////////////////////////////////

type MaybeArray<T> = T | T[];
async function expectSelected(node: MaybeArray<ReturnType<typeof page.getByTestId>>) {
	if (Array.isArray(node)) {
		for (const n of node) {
			await expect.element(n).toHaveAttribute("data-selected");
			await expect.element(n).toHaveAttribute("aria-selected", "true");
		}
	} else {
		await expect.element(node).toHaveAttribute("data-selected");
		await expect.element(node).toHaveAttribute("aria-selected", "true");
	}
}

async function expectNotSelected(node: MaybeArray<ReturnType<typeof page.getByTestId>>) {
	if (Array.isArray(node)) {
		for (const n of node) {
			await expect.element(n).not.toHaveAttribute("data-selected");
			await expect.element(n).not.toHaveAttribute("aria-selected");
		}
	} else {
		await expect.element(node).not.toHaveAttribute("data-selected");
		await expect.element(node).not.toHaveAttribute("aria-selected");
	}
}

async function expectHighlighted(node: MaybeArray<ReturnType<typeof page.getByTestId>>) {
	if (Array.isArray(node)) {
		for (const n of node) {
			await expect.element(n).toHaveAttribute("data-highlighted");
		}
	} else {
		await expect.element(node).toHaveAttribute("data-highlighted");
	}
}

async function expectNotHighlighted(node: MaybeArray<ReturnType<typeof page.getByTestId>>) {
	if (Array.isArray(node)) {
		for (const n of node) {
			await expect.element(n).not.toHaveAttribute("data-highlighted");
		}
	} else {
		await expect.element(node).not.toHaveAttribute("data-highlighted");
	}
}
