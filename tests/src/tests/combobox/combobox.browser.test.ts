import { page, userEvent, type Locator } from "@vitest/browser/context";
import { describe, expect, it, vi } from "vitest";
import { render } from "vitest-browser-svelte";
import type { Component } from "svelte";
import { getTestKbd } from "../utils.js";
import ComboboxTest from "./combobox-test.svelte";
import type { ComboboxSingleTestProps, Item } from "./combobox-test.svelte";
import type { ComboboxMultipleTestProps } from "./combobox-multi-test.svelte";
import ComboboxMultiTest from "./combobox-multi-test.svelte";
import ComboboxForceMountTest, {
	type ComboboxForceMountTestProps,
} from "./combobox-force-mount-test.svelte";
import { expectExists, expectNotExists } from "../browser-utils";

const kbd = getTestKbd();

const testItems: Item[] = [
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
	props: Partial<ComboboxSingleTestProps | ComboboxForceMountTestProps> = {},
	items: Item[] = testItems,
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	component: Component<any, any, any> = ComboboxTest
) {
	const user = userEvent;
	render(component, { name: "test", ...props, items });

	return {
		user,
		input: page.getByTestId("input"),
		trigger: page.getByTestId("trigger"),
		openBinding: page.getByTestId("open-binding"),
		valueBinding: page.getByTestId("value-binding"),
		outside: page.getByTestId("outside"),
		hiddenInput: page.getHiddenInputs("test").first(),
		content: page.getByTestId("content"),
	};
}

function setupMultiple(props: Partial<ComboboxMultipleTestProps> = {}, items: Item[] = testItems) {
	const user = userEvent;
	render(ComboboxMultiTest, { name: "test", ...props, items });

	return {
		user,
		input: page.getByTestId("input"),
		trigger: page.getByTestId("trigger"),
		openBinding: page.getByTestId("open-binding"),
		valueBinding: page.getByTestId("value-binding"),
		outside: page.getByTestId("outside"),
		submit: page.getByTestId("submit"),
		hiddenInputs: page.getHiddenInputs("test"),
		content: page.getByTestId("content"),
	};
}

async function openSingle(
	props: Partial<ComboboxSingleTestProps> = {},
	openWith: "click" | "type" | (string & {}) = "click",
	searchValue?: string
) {
	const t = setupSingle(props);

	await expectNotExists(t.content);
	if (openWith === "click") {
		await t.user.click(t.trigger);
	} else if (openWith === "type" && searchValue) {
		await t.user.type(t.input, searchValue);
	} else {
		t.input.element().focus();
		await t.user.keyboard(openWith);
	}
	await expectExists(t.content);

	return {
		...t,
		group: page.getByTestId("group"),
		groupHeading: page.getByTestId("group-label"),
	};
}

async function openMultiple(
	props: Partial<ComboboxMultipleTestProps> = {},
	openWith: "click" | "type" | (string & {}) = "click",
	searchValue?: string
) {
	const t = setupMultiple(props);

	await expectNotExists(t.content);
	if (openWith === "click") {
		await t.user.click(t.trigger);
	} else if (openWith === "type" && searchValue) {
		await t.user.type(t.input, searchValue);
	} else {
		t.input.element().focus();
		await t.user.keyboard(openWith);
	}
	await expectExists(t.content);

	return t;
}

const OPEN_KEYS = [kbd.ARROW_DOWN, kbd.ARROW_UP];

describe("combobox - single", () => {
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
		await t.user.keyboard(kbd.ARROW_DOWN);
		await t.user.keyboard(kbd.ENTER);
		await expect.element(t.input).toHaveValue("B");
	});

	it("should render an input if the `name` prop is passed", async () => {
		const t = setupSingle();
		await expectExists(t.hiddenInput);
	});

	it("should not render an input if the `name` prop isn't passed or is an empty string/undefined", async () => {
		const t = setupSingle({ name: "" });
		await expectNotExists(t.hiddenInput);
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
		await expectNotExists(t.content);
		await t.openBinding.click();
		await expect.element(t.openBinding).toHaveTextContent("true");
		await expectExists(t.content);
	});

	it("should respect binding the `value` prop", async () => {
		const t = await openSingle({ value: "1" });
		await expect.element(t.valueBinding).toHaveTextContent("1");
		await t.valueBinding.click();
		await expect.element(t.valueBinding).toHaveTextContent("empty");
	});

	it("should call `onValueChange` when the value changes", async () => {
		const mock = vi.fn();
		const _ = await openSingle({ onValueChange: mock });
		const [item1] = getItems();
		await item1.click();
		expect(mock).toHaveBeenCalledWith("1");
	});

	it("should select items when clicked", async () => {
		const t = await openSingle();
		const item1 = page.getByTestId("1");
		await expectNotExists(page.getByTestId("1-indicator"));
		await item1.click();
		await expect.element(t.input).toHaveValue("A");
		await expect.element(t.hiddenInput).toHaveValue("1");
		await t.user.click(t.trigger);
		await expectSelected(item1);
	});

	it("should navigate through the items using the keyboard (loop = false)", async () => {
		const t = await openSingle({}, kbd.ARROW_DOWN);

		const [item0, item1, item2, item3] = getItems();

		await expectHighlighted(item0);
		await t.user.keyboard(kbd.ARROW_DOWN);
		await expectHighlighted(item1);
		await t.user.keyboard(kbd.ARROW_DOWN);
		await expectHighlighted(item2);
		await t.user.keyboard(kbd.ARROW_DOWN);
		await expectHighlighted(item3);
		await t.user.keyboard(kbd.ARROW_DOWN);
		await expectHighlighted(item3);
		await t.user.keyboard(kbd.ARROW_UP);
		await expectHighlighted(item2);
		await t.user.keyboard(kbd.ARROW_UP);
		await expectHighlighted(item1);
		await t.user.keyboard(kbd.ARROW_UP);
		await expectHighlighted(item0);
		await t.user.keyboard(kbd.ARROW_UP);
		await expectHighlighted(item0);
	});

	it("should navigate through the items using the keyboard (loop = true)", async () => {
		const t = await openSingle({ loop: true }, kbd.ARROW_DOWN);

		const [item0, item1, item2, item3] = getItems();

		await expectHighlighted(item0);
		await t.user.keyboard(kbd.ARROW_DOWN);
		await expectHighlighted(item1);
		await t.user.keyboard(kbd.ARROW_DOWN);
		await expectHighlighted(item2);
		await t.user.keyboard(kbd.ARROW_DOWN);
		await expectHighlighted(item3);
		await t.user.keyboard(kbd.ARROW_DOWN);
		expectNotHighlighted(item3);
		await expectHighlighted(item0);
		await t.user.keyboard(kbd.ARROW_UP);
		await expectHighlighted(item3);
		await t.user.keyboard(kbd.ARROW_UP);
		await expectHighlighted(item2);
		await t.user.keyboard(kbd.ARROW_UP);
		await expectHighlighted(item1);
		await t.user.keyboard(kbd.ARROW_UP);
		await expectHighlighted(item0);
		await t.user.keyboard(kbd.ARROW_UP);
		await expectHighlighted(item3);
	});

	it("should allow items to be selected using the keyboard", async () => {
		const t = await openSingle({}, kbd.ARROW_DOWN);
		const [item0, item1, item2, item3] = getItems();

		await t.user.keyboard(kbd.ARROW_DOWN);
		await t.user.keyboard(kbd.ARROW_DOWN);
		await t.user.keyboard(kbd.ARROW_DOWN);
		await t.user.keyboard(kbd.ENTER);
		await expect.element(t.input).toHaveValue("D");
		await expect.element(t.hiddenInput).toHaveValue("4");
		await t.trigger.click();
		await expectNotSelected([item0, item1, item2]);
		await expectSelected(item3);
	});

	it("should apply the `data-highlighted` attribute on mouseover", async () => {
		const _ = await openSingle({}, kbd.ARROW_DOWN);
		const [item1, item2] = getItems();
		await item1.hover();
		await expectHighlighted(item1);
		await item2.hover();
		await expectHighlighted(item2);
		await expectNotHighlighted(item1);
	});

	it("should start keyboard navigation at the highlighted item even if hovered with mouse", async () => {
		const t = await openSingle({}, kbd.ARROW_DOWN);
		const [item1, item2, item3] = getItems();
		await t.input.click();
		await item1.hover();
		await expectHighlighted(item1);
		await item2.hover();
		await expectHighlighted(item2);
		await expectNotHighlighted(item1);
		await t.user.keyboard(kbd.ARROW_DOWN);
		await expectHighlighted(item3);
		await expectNotHighlighted(item2);
	});

	it("should select a default item when provided", async () => {
		const t = await openSingle({
			value: "2",
			inputProps: {
				defaultValue: "B",
			},
		});

		await expectExists(page.getByTestId("2-indicator"));
		await expect.element(t.input).toHaveValue("B");
		await expect.element(t.hiddenInput).toHaveValue("2");
		const [, item2] = getItems();
		expectSelected(item2);
	});

	it("should allow navigating after navigating to the bottom, closing, and reopening the menu", async () => {
		const t = await openSingle();
		const [item0, item1, item2, item3] = getItems();

		await expectHighlighted(item0);
		await t.user.keyboard(kbd.ARROW_DOWN);
		await expectHighlighted(item1);
		await t.user.keyboard(kbd.ARROW_DOWN);
		await expectHighlighted(item2);
		await t.user.keyboard(kbd.ARROW_DOWN);
		await expectHighlighted(item3);
		await t.user.keyboard(kbd.ARROW_DOWN);
		await expectHighlighted(item3);
		await t.user.keyboard(kbd.ESCAPE);
		await expectNotExists(t.content);

		await t.user.keyboard(kbd.ARROW_DOWN);
		await expectExists(t.content);
		await expectHighlighted(item0);
		await t.user.keyboard(kbd.ARROW_DOWN);
		await expectHighlighted(item1);
	});

	it("should forceMount the content when `forceMount` is true", async () => {
		const t = setupSingle({}, [], ComboboxForceMountTest);

		await expect.element(t.content).toBeVisible();
	});

	it("should forceMount the content when `forceMount` is true and the `open` snippet prop is used to conditionally render the content", async () => {
		const t = setupSingle({ withOpenCheck: true }, [], ComboboxForceMountTest);

		await expectNotExists(t.content);

		await t.trigger.click();

		await expectExists(t.content);
	});

	it("should not allow deselecting an item when `allowDeselect` is false", async () => {
		const t = await openSingle({ allowDeselect: false });

		const [item0] = getItems();

		await item0.click();
		await t.trigger.click();
		await expectSelected(item0);

		await item0.click();
		await t.trigger.click();
		await expectSelected(item0);
	});

	it("should clear the input when the selected item is deselected when `clearOnDeselect` is `true`", async () => {
		const t = await openSingle({
			inputProps: {
				clearOnDeselect: true,
			},
		});
		const [item0] = getItems();

		await item0.click();
		await expect.element(t.input).toHaveValue("A");
		await t.trigger.click();
		await expectSelected(item0);

		await t.user.click(item0);

		await expect.element(t.input).toHaveValue("");
		await expect.element(t.input).not.toHaveValue("A");
	});

	it("should allow programmatic updates to the value alongside `inputValue`", async () => {
		const t = setupSingle();
		const setter = page.getByTestId("value-binding-3");
		await setter.click();
		await expect.element(t.input).toHaveValue("C");
	});
});

////////////////////////////////////
// MULTIPLE
////////////////////////////////////
describe("combobox - multiple", () => {
	it("should open on click", async () => {
		await openMultiple();
	});

	it.each(OPEN_KEYS)("should open on %s keydown", async (key) => {
		await openMultiple({}, key);
	});

	it("should select item with the enter key", async () => {
		const t = await openMultiple();
		await t.user.keyboard(kbd.ARROW_DOWN);
		await t.user.keyboard(kbd.ENTER);
		await expect.element(t.input).toHaveValue("B");
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
		await expectExists(t.content);
	});

	it("should respect binding the `value` prop", async () => {
		const t = await openMultiple({ value: ["1", "2"] });
		await expect.element(t.valueBinding).toHaveTextContent("1,2");
		await t.valueBinding.click();
		await expect.element(t.valueBinding).toHaveTextContent("empty");
	});

	it("should call `onValueChange` when the value changes", async () => {
		const mock = vi.fn();
		const _ = await openMultiple({ value: ["1", "2"], onValueChange: mock });
		const [item1] = getItems();
		await item1.click();
		expect(mock).toHaveBeenCalledWith(["2"]);
	});

	it("should select items when clicked", async () => {
		const t = await openMultiple();
		const [item] = getItems();
		await expectNotExists(page.getByTestId("1-indicator"));
		await item.click();
		await expect.element(t.input).toHaveValue("A");
		expect(t.hiddenInputs.all()).toHaveLength(1);
		await expect.element(t.hiddenInputs.first()).toHaveValue("1");
		await t.input.click();

		await expectSelected(item);
		await expectExists(page.getByTestId("1-indicator"));
	});

	it("should navigate through the items using the keyboard (loop = false)", async () => {
		const t = await openMultiple({}, kbd.ARROW_DOWN);

		const [item0, item1, item2, item3] = getItems();

		await expectHighlighted(item0);
		await t.user.keyboard(kbd.ARROW_DOWN);
		await expectHighlighted(item1);
		await t.user.keyboard(kbd.ARROW_DOWN);
		await expectHighlighted(item2);
		await t.user.keyboard(kbd.ARROW_DOWN);
		await expectHighlighted(item3);
		await t.user.keyboard(kbd.ARROW_DOWN);
		await expectHighlighted(item3);
		await t.user.keyboard(kbd.ARROW_UP);
		await expectHighlighted(item2);
		await t.user.keyboard(kbd.ARROW_UP);
		await expectHighlighted(item1);
		await t.user.keyboard(kbd.ARROW_UP);
		await expectHighlighted(item0);
		await t.user.keyboard(kbd.ARROW_UP);
		await expectHighlighted(item0);
	});

	it("should navigate through the items using the keyboard (loop = true)", async () => {
		const t = await openMultiple({ loop: true }, kbd.ARROW_DOWN);

		const [item0, item1, item2, item3] = getItems();

		await expectHighlighted(item0);
		await t.user.keyboard(kbd.ARROW_DOWN);
		await expectHighlighted(item1);
		await t.user.keyboard(kbd.ARROW_DOWN);
		await expectHighlighted(item2);
		await t.user.keyboard(kbd.ARROW_DOWN);
		await expectHighlighted(item3);
		await t.user.keyboard(kbd.ARROW_DOWN);
		await expectNotHighlighted(item3);
		await expectHighlighted(item0);
		await t.user.keyboard(kbd.ARROW_UP);
		await expectHighlighted(item3);
		await t.user.keyboard(kbd.ARROW_UP);
		await expectHighlighted(item2);
		await t.user.keyboard(kbd.ARROW_UP);
		await expectHighlighted(item1);
		await t.user.keyboard(kbd.ARROW_UP);
		await expectHighlighted(item0);
		await t.user.keyboard(kbd.ARROW_UP);
		await expectHighlighted(item3);
	});

	it("should allow items to be selected using the keyboard", async () => {
		const t = await openMultiple({}, kbd.ARROW_DOWN);
		const [item0, item1, item2, item3] = getItems();

		await t.user.keyboard(kbd.ARROW_DOWN);
		await t.user.keyboard(kbd.ARROW_DOWN);
		await t.user.keyboard(kbd.ARROW_DOWN);
		await t.user.keyboard(kbd.ENTER);
		await expect.element(t.input).toHaveValue("D");
		expect(t.hiddenInputs.all()).toHaveLength(1);
		await expect.element(t.hiddenInputs.first()).toHaveValue("4");
		await t.input.click();
		await expectNotSelected([item0, item1, item2]);
		await expectSelected(item3);
	});

	it("should allow multiple items to be selected using the keyboard", async () => {
		const t = await openMultiple({}, kbd.ARROW_DOWN);

		const [item0, item1, item2, item3] = getItems();

		await t.user.keyboard(kbd.ARROW_DOWN);
		await t.user.keyboard(kbd.ARROW_DOWN);
		await t.user.keyboard(kbd.ARROW_DOWN);
		await t.user.keyboard(kbd.ENTER);
		await expect.element(t.input).toHaveValue("D");
		expect(t.hiddenInputs.all()).toHaveLength(1);
		await expect.element(t.hiddenInputs.first()).toHaveValue("4");
		await expectSelected(item3);
		await expectNotSelected([item0, item1, item2]);
		await t.user.keyboard(kbd.ARROW_UP);
		await expectHighlighted(item2);
		await t.user.keyboard(kbd.ENTER);
		await expectSelected([item3, item2]);
		await expectNotSelected([item0, item1]);
	});

	it("should apply the `data-highlighted` attribute on mouseover", async () => {
		const _ = await openMultiple({}, kbd.ARROW_DOWN);
		const [item1, item2] = getItems();
		await item1.hover();
		await expectHighlighted(item1);
		await item2.hover();
		await expectHighlighted(item2);
		await expectNotHighlighted(item1);
	});

	it("should select a default item when provided", async () => {
		const t = await openMultiple({
			value: ["2"],
			inputProps: {
				defaultValue: "B",
			},
		});
		await expectExists(page.getByTestId("2-indicator"));
		await expect.element(t.input).toHaveValue("B");

		await expect.element(t.hiddenInputs.first()).toHaveValue("2");
		const [, item2] = getItems();
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

	it("should clear the input when the last item is deselected when `clearOnDeselect` is `true`", async () => {
		const t = await openMultiple({
			inputProps: {
				clearOnDeselect: true,
			},
		});
		const [item0, item1, item2] = getItems();
		await expectNotExists(page.getByTestId("1-indicator"));
		await item0.click();
		await expect.element(t.input).toHaveValue("A");
		expect(t.hiddenInputs.all()).toHaveLength(1);
		await expect.element(t.hiddenInputs.first()).toHaveValue("1");
		await t.input.click();

		await expectSelected(item0);
		await expectExists(page.getByTestId("1-indicator"));
		await item0.click();
		await expect.element(t.input).toHaveValue("");
		await expect.element(t.input).not.toHaveValue("A");
		await item1.click();
		await item2.click();
		expect(t.hiddenInputs.all()).toHaveLength(2);
		await expect.element(t.hiddenInputs.nth(0)).toHaveValue("2");
		await expect.element(t.hiddenInputs.nth(1)).toHaveValue("3");
		await item2.click();
		expect(t.hiddenInputs.all()).toHaveLength(1);
		await expect.element(t.hiddenInputs.first()).toHaveValue("2");
		await item1.click();
		await expect.element(t.input).toHaveValue("");
		expect(t.hiddenInputs.all()).toHaveLength(0);
	});
});

function getItems() {
	const itemsArr = testItems.map((i) => page.getByTestId(i.value));
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
