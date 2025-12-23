import { page, userEvent } from "@vitest/browser/context";
import { describe, expect, it, vi } from "vitest";
import { render } from "vitest-browser-svelte";
import { tick, type Component } from "svelte";
import { getTestKbd } from "../utils.js";
import ComboboxTest from "./combobox-test.svelte";
import type { ComboboxSingleTestProps, Item } from "./combobox-test.svelte";
import type { ComboboxMultipleTestProps } from "./combobox-multi-test.svelte";
import ComboboxMultiTest from "./combobox-multi-test.svelte";
import ComboboxForceMountTest, {
	type ComboboxForceMountTestProps,
} from "./combobox-force-mount-test.svelte";
import ComboboxChipsTest, { type ComboboxChipsTestProps } from "./combobox-chips-test.svelte";
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
	// oxlint-disable-next-line no-explicit-any
	component: Component<any, any, any> = ComboboxTest
) {
	const user = userEvent;
	const returned = render(component, { name: "test", ...props, items });
	const input = page.getByTestId("input");
	const trigger = page.getByTestId("trigger");
	const openBinding = page.getByTestId("open-binding");
	const valueBinding = page.getByTestId("value-binding");
	const outside = page.getByTestId("outside");

	function getContent() {
		return page.getByTestId("content");
	}

	function getHiddenInput(name = "test") {
		return returned.container.querySelector(`input[name="${name}"]`) as HTMLInputElement;
	}

	return {
		user,
		input,
		trigger,
		valueBinding,
		openBinding,
		outside,
		getHiddenInput,
		getContent,
		...returned,
	};
}

function setupMultiple(props: Partial<ComboboxMultipleTestProps> = {}, items: Item[] = testItems) {
	const user = userEvent;
	const returned = render(ComboboxMultiTest, { name: "test", ...props, items });
	const input = page.getByTestId("input");
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
		user,
		input,
		trigger,
		openBinding,
		valueBinding,
		outside,
		submit,
		getHiddenInputs,
		getContent,
		...returned,
	};
}

async function openSingle(
	props: Partial<ComboboxSingleTestProps> = {},
	openWith: "click" | "type" | (string & {}) = "click",
	searchValue?: string
) {
	const returned = setupSingle(props);

	await expectNotExists(page.getByTestId("content"));
	if (openWith === "click") {
		await returned.trigger.click({ force: true });
	} else if (openWith === "type" && searchValue) {
		await returned.user.type(returned.input, searchValue);
	} else {
		(returned.input.element() as HTMLElement).focus();
		await returned.user.keyboard(openWith);
	}
	await expectExists(page.getByTestId("content"));
	const content = page.getByTestId("content");
	const group = page.getByTestId("group");
	const groupHeading = page.getByTestId("group-label");
	await tick();
	return {
		...returned,
		group,
		groupHeading,
		content,
	};
}

async function openMultiple(
	props: Partial<ComboboxMultipleTestProps> = {},
	openWith: "click" | "type" | (string & {}) = "click",
	searchValue?: string
) {
	const returned = setupMultiple(props);
	await expectNotExists(page.getByTestId("content"));

	if (openWith === "click") {
		await returned.user.click(returned.trigger, { force: true });
	} else if (openWith === "type" && searchValue) {
		await returned.user.type(returned.input, searchValue);
	} else {
		(returned.input.element() as HTMLElement).focus();
		await returned.user.keyboard(openWith);
	}
	await expectExists(page.getByTestId("content"));
	const content = page.getByTestId("content");
	return {
		...returned,
		content,
	};
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
		await openSingle();
		await expect.element(page.getByTestId("input")).toHaveFocus();
		await expect.element(page.getByTestId("content")).toBeVisible();
		await userEvent.keyboard(kbd.ARROW_DOWN);

		await expect.element(page.getByTestId("2")).toHaveAttribute("data-highlighted");
		await expect.element(page.getByTestId("1")).not.toHaveAttribute("data-highlighted");
		await userEvent.keyboard(kbd.ENTER);
		await expect.element(page.getByTestId("input")).toHaveValue("B");
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
		const portalTarget = page.getByTestId("portal-target").element();
		expect(t.content.element().parentElement?.parentElement).toBe(portalTarget);
	});

	it("should not portal if `disabled` is passed as portal prop", async () => {
		const t = await openSingle({ portalProps: { disabled: true } });
		const main = page.getByTestId("main").element();
		expect(t.content.element().parentElement?.parentElement).toBe(main);
	});

	it("should respect binding the `open` prop", async () => {
		const t = setupSingle();
		await expect.element(t.openBinding).toHaveTextContent("false");
		await t.openBinding.click();
		await expect.element(t.openBinding).toHaveTextContent("true");
		await expectExists(t.getContent());
		await userEvent.keyboard(kbd.ESCAPE);
		await expectNotExists(t.getContent());
		await expect.element(t.openBinding).toHaveTextContent("false");
	});

	it("should respect binding the `value` prop", async () => {
		const t = await openSingle({ value: "1" });
		await expect.element(t.valueBinding).toHaveTextContent("1");
		await t.valueBinding.click();
		await expect.element(t.valueBinding).toHaveTextContent("empty");
	});

	it("should call `onValueChange` when the value changes", async () => {
		const mock = vi.fn();
		await openSingle({
			onValueChange: mock,
		});
		const [item1] = getItems(page.getByTestId);
		await item1.click();
		expect(mock).toHaveBeenCalledWith("1");
	});

	it("should select items when clicked", async () => {
		const t = await openSingle();
		const item1 = page.getByTestId("1");
		await expectNotExists(page.getByTestId("1-indicator"));
		await item1.click();
		await expect.element(t.input).toHaveValue("A");
		await expect.element(t.getHiddenInput()).toHaveValue("1");
		await t.trigger.click();
		await expectSelected(item1);
	});

	it("should navigate through the items using the keyboard (loop = false)", async () => {
		await openSingle({}, kbd.ARROW_DOWN);

		const [item0, item1, item2, item3] = getItems(page.getByTestId);

		await expectHighlighted(item0);
		await userEvent.keyboard(kbd.ARROW_DOWN);
		await expectHighlighted(item1);
		await userEvent.keyboard(kbd.ARROW_DOWN);
		await expectHighlighted(item2);
		await userEvent.keyboard(kbd.ARROW_DOWN);
		await expectHighlighted(item3);
		await userEvent.keyboard(kbd.ARROW_DOWN);
		await expectHighlighted(item3);
		await userEvent.keyboard(kbd.ARROW_UP);
		await expectHighlighted(item2);
		await userEvent.keyboard(kbd.ARROW_UP);
		await expectHighlighted(item1);
		await userEvent.keyboard(kbd.ARROW_UP);
		await expectHighlighted(item0);
		await userEvent.keyboard(kbd.ARROW_UP);
		await expectHighlighted(item0);
	});

	it("should navigate through the items using the keyboard (loop = true)", async () => {
		await openSingle(
			{
				loop: true,
			},
			kbd.ARROW_DOWN
		);

		const [item0, item1, item2, item3] = getItems(page.getByTestId);

		await expectHighlighted(item0);
		await userEvent.keyboard(kbd.ARROW_DOWN);
		await expectHighlighted(item1);
		await userEvent.keyboard(kbd.ARROW_DOWN);
		await expectHighlighted(item2);
		await userEvent.keyboard(kbd.ARROW_DOWN);
		await expectHighlighted(item3);
		await userEvent.keyboard(kbd.ARROW_DOWN);
		expectNotHighlighted(item3);
		await expectHighlighted(item0);
		await userEvent.keyboard(kbd.ARROW_UP);
		await expectHighlighted(item3);
		await userEvent.keyboard(kbd.ARROW_UP);
		await expectHighlighted(item2);
		await userEvent.keyboard(kbd.ARROW_UP);
		await expectHighlighted(item1);
		await userEvent.keyboard(kbd.ARROW_UP);
		await expectHighlighted(item0);
		await userEvent.keyboard(kbd.ARROW_UP);
		await expectHighlighted(item3);
	});

	it("should allow items to be selected using the keyboard", async () => {
		const t = await openSingle({}, kbd.ARROW_DOWN);
		const item1 = page.getByTestId("1");
		const item2 = page.getByTestId("2");
		const item3 = page.getByTestId("3");
		const item4 = page.getByTestId("4");

		await userEvent.keyboard(kbd.ARROW_DOWN);
		await userEvent.keyboard(kbd.ARROW_DOWN);
		await userEvent.keyboard(kbd.ARROW_DOWN);
		await userEvent.keyboard(kbd.ENTER);
		await expect.element(t.input).toHaveValue("D");
		await expect.element(t.getHiddenInput()).toHaveValue("4");
		await t.trigger.click();
		await expectNotSelected([item1, item2, item3]);
		await expectSelected(item4);
	});

	it("should apply the `data-highlighted` attribute on mouseover", async () => {
		await openSingle({}, kbd.ARROW_DOWN);
		const [item1, item2] = getItems(page.getByTestId);
		await item1.hover();
		await expectHighlighted(item1);
		await item2.hover();
		await expectHighlighted(item2);
		await expectNotHighlighted(item1);
	});

	it("should start keyboard navigation at the highlighted item even if hovered with mouse", async () => {
		const t = await openSingle({}, kbd.ARROW_DOWN);
		const [item1, item2, item3] = getItems(page.getByTestId);
		await t.input.click();
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
			inputProps: {
				defaultValue: "B",
			},
		});
		await expect.element(page.getByTestId("2-indicator")).toBeInTheDocument();
		await expect.element(t.input).toHaveValue("B");
		await expect.element(t.getHiddenInput()).toHaveValue("2");
		const [_, item2] = getItems(page.getByTestId);
		await expectSelected(item2);
	});

	it("should allow navigating after navigating to the bottom, closing, and reopening the menu", async () => {
		const t = await openSingle();
		const item1 = page.getByTestId("1");
		const item2 = page.getByTestId("2");
		const item3 = page.getByTestId("3");
		const item4 = page.getByTestId("4");
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
		await expect.element(t.input).toHaveFocus();

		await userEvent.keyboard(kbd.ARROW_DOWN);
		await expectExists(t.getContent());
		await expectHighlighted(item1);
		await userEvent.keyboard(kbd.ARROW_DOWN);
		await expectHighlighted(item2);
	});

	it("should forceMount the content when `forceMount` is true", async () => {
		setupSingle({}, [], ComboboxForceMountTest);

		await expect.element(page.getByTestId("content")).toBeVisible();
	});

	it("should forceMount the content when `forceMount` is true and the `open` snippet prop is used to conditionally render the content", async () => {
		const t = setupSingle({ withOpenCheck: true }, [], ComboboxForceMountTest);

		await expectNotExists(page.getByTestId("content"));
		await t.trigger.click();

		await expectExists(page.getByTestId("content"));
	});

	it("should not allow deselecting an item when `allowDeselect` is false", async () => {
		const t = await openSingle({
			allowDeselect: false,
		});

		const item1 = page.getByTestId("1");
		await item1.click();
		await t.trigger.click();

		await expectSelected(item1);

		await item1.click();
		await t.trigger.click();
		await expectSelected(item1);
	});

	it("should clear the input when the selected item is deselected when `clearOnDeselect` is `true`", async () => {
		const t = await openSingle({
			inputProps: {
				clearOnDeselect: true,
			},
		});
		const item1 = page.getByTestId("1");

		await item1.click();
		await expect.element(t.input).toHaveValue("A");
		await t.trigger.click();
		await expectSelected(item1);

		await item1.click();

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

// ////////////////////////////////////
// // MULTIPLE
// ////////////////////////////////////
describe("combobox - multiple", () => {
	it("should open on click", async () => {
		await openMultiple();
	});

	it.each(OPEN_KEYS)("should open on %s keydown", async (key) => {
		await openMultiple({}, key);
	});

	it("should select item with the enter key", async () => {
		const t = await openMultiple();
		await userEvent.keyboard(kbd.ARROW_DOWN);
		await userEvent.keyboard(kbd.ENTER);
		await expect.element(t.input).toHaveValue("B");
	});

	it("should not render a hidden input if the `name` prop is passed and a value is not selected", async () => {
		const t = setupMultiple();
		expect(t.getHiddenInputs()).toHaveLength(0);
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
		await t.openBinding.click();
		await expect.element(t.openBinding).toHaveTextContent("false");
		await expectNotExists(t.getContent());
		await t.openBinding.click();
		await expect.element(t.openBinding).toHaveTextContent("true");
		await expect.element(page.getByTestId("content")).toBeInTheDocument();
	});

	it("should respect binding the `value` prop", async () => {
		const t = await openMultiple({ value: ["1", "2"] });
		await expect.element(t.valueBinding).toHaveTextContent(/^1,2$/);
		await t.valueBinding.click();
		await expect.element(t.valueBinding).toHaveTextContent("empty");
	});

	it("should call `onValueChange` when the value changes", async () => {
		const mock = vi.fn();
		await openMultiple({ value: ["1", "2"], onValueChange: mock });
		const [item1] = getItems(page.getByTestId);
		await item1.click();
		expect(mock).toHaveBeenCalledWith(["2"]);
	});

	it("should select items when clicked", async () => {
		const t = await openMultiple();
		const [item] = getItems(page.getByTestId);
		await expectNotExists(page.getByTestId("1-indicator"));
		await item.click();
		await expect.element(t.input).toHaveValue("A");
		expect(t.getHiddenInputs()).toHaveLength(1);
		expect(t.getHiddenInputs()[0]).toHaveValue("1");
		await t.input.click();

		await expectSelected(item);
		await expectExists(page.getByTestId("1-indicator"));
	});

	it("should navigate through the items using the keyboard (loop = false)", async () => {
		await openMultiple({}, kbd.ARROW_DOWN);

		const [item0, item1, item2, item3] = getItems(page.getByTestId);

		await expectHighlighted(item0);
		await userEvent.keyboard(kbd.ARROW_DOWN);
		await expectHighlighted(item1);
		await userEvent.keyboard(kbd.ARROW_DOWN);
		await expectHighlighted(item2);
		await userEvent.keyboard(kbd.ARROW_DOWN);
		await expectHighlighted(item3);
		await userEvent.keyboard(kbd.ARROW_DOWN);
		await expectHighlighted(item3);
		await userEvent.keyboard(kbd.ARROW_UP);
		await expectHighlighted(item2);
		await userEvent.keyboard(kbd.ARROW_UP);
		await expectHighlighted(item1);
		await userEvent.keyboard(kbd.ARROW_UP);
		await expectHighlighted(item0);
		await userEvent.keyboard(kbd.ARROW_UP);
		await expectHighlighted(item0);
	});

	it("should navigate through the items using the keyboard (loop = true)", async () => {
		await openMultiple(
			{
				loop: true,
			},
			kbd.ARROW_DOWN
		);

		const [item0, item1, item2, item3] = getItems(page.getByTestId);

		await expectHighlighted(item0);
		await userEvent.keyboard(kbd.ARROW_DOWN);
		await expectHighlighted(item1);
		await userEvent.keyboard(kbd.ARROW_DOWN);
		await expectHighlighted(item2);
		await userEvent.keyboard(kbd.ARROW_DOWN);
		await expectHighlighted(item3);
		await userEvent.keyboard(kbd.ARROW_DOWN);
		await expectNotHighlighted(item3);
		await expectHighlighted(item0);
		await userEvent.keyboard(kbd.ARROW_UP);
		await expectHighlighted(item3);
		await userEvent.keyboard(kbd.ARROW_UP);
		await expectHighlighted(item2);
		await userEvent.keyboard(kbd.ARROW_UP);
		await expectHighlighted(item1);
		await userEvent.keyboard(kbd.ARROW_UP);
		await expectHighlighted(item0);
		await userEvent.keyboard(kbd.ARROW_UP);
		await expectHighlighted(item3);
	});

	it("should allow items to be selected using the keyboard", async () => {
		const t = await openMultiple({}, kbd.ARROW_DOWN);
		const [item1, item2, item3, item4] = getItems(page.getByTestId);

		await userEvent.keyboard(kbd.ARROW_DOWN);
		await userEvent.keyboard(kbd.ARROW_DOWN);
		await userEvent.keyboard(kbd.ARROW_DOWN);
		await userEvent.keyboard(kbd.ENTER);
		await expect.element(t.input).toHaveValue("D");
		const hiddenInputs = t.getHiddenInputs();
		expect(hiddenInputs).toHaveLength(1);
		await expect.element(hiddenInputs[0]).toHaveValue("4");
		await t.input.click();
		await expectNotSelected([item1, item2, item3]);
		await expectSelected(item4);
	});

	it("should allow multiple items to be selected using the keyboard", async () => {
		const t = await openMultiple({});

		const [item0, item1, item2, item3] = getItems(page.getByTestId);

		await userEvent.keyboard(kbd.ARROW_DOWN);
		await userEvent.keyboard(kbd.ARROW_DOWN);
		await userEvent.keyboard(kbd.ARROW_DOWN);
		await userEvent.keyboard(kbd.ENTER);
		await expect.element(t.input).toHaveValue("D");
		const hiddenInputs = t.getHiddenInputs();
		expect(hiddenInputs).toHaveLength(1);
		await expect.element(hiddenInputs[0]).toHaveValue("4");
		await expectSelected(item3);
		await expectNotSelected([item0, item1, item2]);
		await userEvent.keyboard(kbd.ARROW_UP);
		await expectHighlighted(item2);
		await userEvent.keyboard(kbd.ENTER);
		await expectSelected([item3, item2]);
		await expectNotSelected([item0, item1]);
	});

	it("should apply the `data-highlighted` attribute on mouseover", async () => {
		await openMultiple({}, kbd.ARROW_DOWN);
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
			inputProps: {
				defaultValue: "B",
			},
		});
		await expectExists(page.getByTestId("2-indicator"));
		await expect.element(t.input).toHaveValue("B");

		await expect.element(t.getHiddenInputs()[0]).toHaveValue("2");
		const [_, item2] = getItems(page.getByTestId);
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
		const [item, item2, item3] = getItems(page.getByTestId);
		await expectNotExists(page.getByTestId("1-indicator"));
		await item.click();
		await expect.element(t.input).toHaveValue("A");
		expect(t.getHiddenInputs()).toHaveLength(1);
		await expect.element(t.getHiddenInputs()[0]).toHaveValue("1");
		await t.input.click();

		await expectSelected(item);
		await expectExists(page.getByTestId("1-indicator"));
		await item.click();
		await expect.element(t.input).toHaveValue("");
		await expect.element(t.input).not.toHaveValue("A");
		await item2.click();
		await item3.click();
		expect(t.getHiddenInputs()).toHaveLength(2);
		await expect.element(t.getHiddenInputs()[0]).toHaveValue("2");
		await expect.element(t.getHiddenInputs()[1]).toHaveValue("3");
		await item3.click();
		expect(t.getHiddenInputs()).toHaveLength(1);
		await expect.element(t.getHiddenInputs()[0]).toHaveValue("2");
		await item2.click();
		await expect.element(t.input).toHaveValue("");
		expect(t.getHiddenInputs()).toHaveLength(0);
	});

	it("should not update the input value when the item is deselected", async () => {
		const t = await openMultiple({});
		const [item1, item2] = getItems(page.getByTestId);
		await expectNotSelected([item1, item2]);
		await item1.click();
		await item2.click();
		await expectSelected([item1, item2]);
		await expect.element(t.input).toHaveValue("B");
		await item1.click();
		await expectNotSelected(item1);
		await expect.element(t.input).toHaveValue("A");
	});
});

function getItems(getter: typeof page.getByTestId, items = testItems) {
	const itemsArr: ReturnType<typeof page.getByTestId>[] = [];
	for (const item of items) {
		itemsArr.push(getter(item.value));
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

////////////////////////////////////
// CHIPS TESTS
////////////////////////////////////

function setupChips(props: Partial<ComboboxChipsTestProps> = {}, items: Item[] = testItems) {
	const user = userEvent;
	const returned = render(ComboboxChipsTest, { ...props, items });
	const input = page.getByTestId("input");
	const chipsContainer = page.getByTestId("chips-container");
	const valueBinding = page.getByTestId("value-binding");
	const outside = page.getByTestId("outside");

	function getContent() {
		return page.getByTestId("content");
	}

	function getChip(value: string) {
		return page.getByTestId(`chip-${value}`);
	}

	function getChipRemove(value: string) {
		return page.getByTestId(`chip-remove-${value}`);
	}

	return {
		user,
		input,
		chipsContainer,
		valueBinding,
		outside,
		getContent,
		getChip,
		getChipRemove,
		...returned,
	};
}

async function openChips(
	props: Partial<ComboboxChipsTestProps> = {},
	openWith: "click" | "type" | (string & {}) = "click"
) {
	const returned = setupChips(props);
	await expectNotExists(page.getByTestId("content"));

	if (openWith === "click") {
		await returned.input.click();
	} else {
		(returned.input.element() as HTMLElement).focus();
		await returned.user.keyboard(openWith);
	}
	await expectExists(page.getByTestId("content"));
	const content = page.getByTestId("content");
	return {
		...returned,
		content,
	};
}

describe("combobox - chips", () => {
	it("should render chips for selected values", async () => {
		const t = setupChips({ value: ["1", "2"] });
		await expectExists(t.getChip("1"));
		await expectExists(t.getChip("2"));
		await expect.element(page.getByTestId("chip-label-1")).toHaveTextContent("A");
		await expect.element(page.getByTestId("chip-label-2")).toHaveTextContent("B");
	});

	it("should have data-focus-within on chips container when input is focused", async () => {
		const t = setupChips({ value: ["1"] });
		await expect.element(t.chipsContainer).not.toHaveAttribute("data-focus-within");
		await t.input.click();
		await expect.element(t.chipsContainer).toHaveAttribute("data-focus-within");
	});

	it("chips should have tabindex=-1", async () => {
		const t = setupChips({ value: ["1"] });
		await expect.element(t.getChip("1")).toHaveAttribute("tabindex", "-1");
	});

	it("chip remove buttons should have tabindex=-1", async () => {
		const t = setupChips({ value: ["1"] });
		await expect.element(t.getChipRemove("1")).toHaveAttribute("tabindex", "-1");
	});

	it("should remove chip when remove button is clicked", async () => {
		const t = setupChips({ value: ["1", "2"] });
		await expectExists(t.getChip("1"));
		await t.getChipRemove("1").click();
		await expectNotExists(t.getChip("1"));
		await expectExists(t.getChip("2"));
		await expect.element(t.input).toHaveFocus();
	});

	it("should navigate to last chip with ArrowLeft when cursor at start", async () => {
		const t = setupChips({ value: ["1", "2"] });
		await t.input.click();
		await expect.element(t.input).toHaveFocus();

		await t.user.keyboard(kbd.ARROW_LEFT);
		await expect.element(t.getChip("2")).toHaveFocus();
		await expect.element(t.getChip("2")).toHaveAttribute("data-highlighted");
	});

	it("should navigate to last chip with Backspace when input is empty", async () => {
		const t = setupChips({ value: ["1", "2"] });
		await t.input.click();
		await expect.element(t.input).toHaveFocus();

		await t.user.keyboard(kbd.BACKSPACE);
		await expect.element(t.getChip("2")).toHaveFocus();
	});

	it("should navigate between chips with arrow keys", async () => {
		const t = setupChips({ value: ["1", "2", "3"] });
		await t.input.click();
		await t.user.keyboard(kbd.ARROW_LEFT);
		await expect.element(t.getChip("3")).toHaveFocus();

		await t.user.keyboard(kbd.ARROW_LEFT);
		await expect.element(t.getChip("2")).toHaveFocus();

		await t.user.keyboard(kbd.ARROW_LEFT);
		await expect.element(t.getChip("1")).toHaveFocus();

		// stay on first chip
		await t.user.keyboard(kbd.ARROW_LEFT);
		await expect.element(t.getChip("1")).toHaveFocus();

		// go back right
		await t.user.keyboard(kbd.ARROW_RIGHT);
		await expect.element(t.getChip("2")).toHaveFocus();

		await t.user.keyboard(kbd.ARROW_RIGHT);
		await expect.element(t.getChip("3")).toHaveFocus();

		// right from last chip goes to input
		await t.user.keyboard(kbd.ARROW_RIGHT);
		await expect.element(t.input).toHaveFocus();
	});

	it("should remove chip with Backspace key and focus next chip", async () => {
		const t = setupChips({ value: ["1", "2", "3"] });
		await t.input.click();
		await t.user.keyboard(kbd.ARROW_LEFT);
		await t.user.keyboard(kbd.ARROW_LEFT);
		await expect.element(t.getChip("2")).toHaveFocus();

		await t.user.keyboard(kbd.BACKSPACE);
		await expectNotExists(t.getChip("2"));
		// should focus next chip (which is now "3" at index 1)
		await expect.element(t.getChip("3")).toHaveFocus();
	});

	it("should remove chip with Delete key", async () => {
		const t = setupChips({ value: ["1", "2"] });
		await t.input.click();
		await t.user.keyboard(kbd.ARROW_LEFT);
		await expect.element(t.getChip("2")).toHaveFocus();

		await t.user.keyboard(kbd.DELETE);
		await expectNotExists(t.getChip("2"));
		// should focus previous chip or input
		await expect.element(t.getChip("1")).toHaveFocus();
	});

	it("should focus input after removing last chip", async () => {
		const t = setupChips({ value: ["1"] });
		await t.input.click();
		await t.user.keyboard(kbd.ARROW_LEFT);
		await expect.element(t.getChip("1")).toHaveFocus();

		await t.user.keyboard(kbd.BACKSPACE);
		await expectNotExists(t.getChip("1"));
		await expect.element(t.input).toHaveFocus();
	});

	it("should focus input when Tab is pressed on chip", async () => {
		const t = setupChips({ value: ["1", "2"] });
		await t.input.click();
		await t.user.keyboard(kbd.ARROW_LEFT);
		await expect.element(t.getChip("2")).toHaveFocus();

		await t.user.keyboard(kbd.TAB);
		await expect.element(t.input).toHaveFocus();
	});

	it("should focus input when Enter is pressed on chip", async () => {
		const t = setupChips({ value: ["1", "2"] });
		await t.input.click();
		await t.user.keyboard(kbd.ARROW_LEFT);
		await expect.element(t.getChip("2")).toHaveFocus();

		await t.user.keyboard(kbd.ENTER);
		await expect.element(t.input).toHaveFocus();
	});

	it("should focus input when Space is pressed on chip", async () => {
		const t = setupChips({ value: ["1", "2"] });
		await t.input.click();
		await t.user.keyboard(kbd.ARROW_LEFT);
		await expect.element(t.getChip("2")).toHaveFocus();

		await t.user.keyboard(kbd.SPACE);
		await expect.element(t.input).toHaveFocus();
	});

	it("should open popup and focus input when ArrowDown is pressed on chip", async () => {
		const t = setupChips({ value: ["1"] });
		await t.input.click();
		await t.user.keyboard(kbd.ARROW_LEFT);
		await expect.element(t.getChip("1")).toHaveFocus();
		await expectNotExists(t.getContent());

		await t.user.keyboard(kbd.ARROW_DOWN);
		await expectExists(t.getContent());
		await expect.element(t.input).toHaveFocus();
	});

	it("should focus input when clicking on a chip", async () => {
		const t = setupChips({ value: ["1", "2"] });
		await t.getChip("1").click();
		await expect.element(t.input).toHaveFocus();
	});

	it("should focus input and start typing when printable key is pressed on chip", async () => {
		const t = setupChips({ value: ["1"] });
		await t.input.click();
		await t.user.keyboard(kbd.ARROW_LEFT);
		await expect.element(t.getChip("1")).toHaveFocus();

		await t.user.keyboard("a");
		await expect.element(t.input).toHaveFocus();
		await expect.element(t.input).toHaveValue("a");
	});

	it("should update value binding when chip is removed", async () => {
		const t = setupChips({ value: ["1", "2"] });
		await expect.element(t.valueBinding).toHaveTextContent("1,2");
		await t.getChipRemove("1").click();
		await expect.element(t.valueBinding).toHaveTextContent("2");
	});

	it("should add chips when items are selected", async () => {
		const t = await openChips({ value: [] });
		await expectNotExists(t.getChip("1"));

		const item1 = page.getByTestId("1");
		await item1.click();
		await expectExists(t.getChip("1"));
	});
});
