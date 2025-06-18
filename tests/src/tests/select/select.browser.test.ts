import { expect, it, vi, describe } from "vitest";
import { render } from "vitest-browser-svelte";
import { type Component } from "svelte";
import { getTestId } from "../helpers/select.js";
import { type AnyFn, getTestKbd, sleep } from "../utils.js";
import type { SelectForceMountTestProps } from "./select-force-mount-test.svelte";
import SelectForceMountTest from "./select-force-mount-test.svelte";
import type { SelectMultipleTestProps } from "./select-multi-test.svelte";
import SelectMultiTest from "./select-multi-test.svelte";
import type { Item, SelectSingleTestProps } from "./select-test.svelte";
import SelectTest from "./select-test.svelte";
import { expectExists, expectNotExists, setupBrowserUserEvents } from "../browser-utils";

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
	const returned = render(component, { name: "test", ...props, items });
	const trigger = returned.getByTestId("trigger").element() as HTMLElement;
	const openBinding = returned.getByTestId("open-binding").element() as HTMLElement;
	const valueBinding = returned.getByTestId("value-binding").element() as HTMLElement;
	const outside = returned.getByTestId("outside").element() as HTMLElement;

	function getContent() {
		return returned.getByTestId("content");
	}

	function getHiddenInput(name = "test") {
		return returned.container.querySelector(`input[name="${name}"]`);
	}

	return {
		user,
		trigger,
		valueBinding,
		openBinding,
		outside,
		getHiddenInput,
		getContent,
		...returned,
	};
}

function setupMultiple(props: Partial<SelectMultipleTestProps> = {}, items: Item[] = testItems) {
	const user = setupBrowserUserEvents();
	// @ts-expect-error - testing lib needs to update their generic types
	const returned = render(SelectMultiTest, { name: "test", ...props, items });
	const trigger = returned.getByTestId("trigger").element() as HTMLElement;
	const openBinding = returned.getByTestId("open-binding").element() as HTMLElement;
	const valueBinding = returned.getByTestId("value-binding").element() as HTMLElement;
	const outside = returned.getByTestId("outside").element() as HTMLElement;
	const submit = returned.getByTestId("submit").element() as HTMLElement;

	function getHiddenInputs(name = "test") {
		return Array.from(
			returned.container.querySelectorAll<HTMLElement>(`input[name="${name}"]`)
		);
	}

	function getContent() {
		return returned.getByTestId("content");
	}

	return {
		user,
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
	props: Partial<SelectSingleTestProps> = {},
	openWith: "click" | "type" | (string & {}) = "click",
	_searchValue?: string
) {
	const t = setupSingle(props);

	await expectNotExists(t.getContent());

	if (openWith === "click") {
		await t.user.click(t.trigger);
	} else {
		t.trigger.focus();
		await t.user.keyboard(openWith);
	}
	await expectExists(t.getContent());
	const content = t.getContent().element() as HTMLElement;
	const group = t.getByTestId("group").element() as HTMLElement;
	const groupHeading = t.getByTestId("group-label").element() as HTMLElement;

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
		await t.user.click(t.trigger);
	} else {
		t.trigger.focus();
		await t.user.keyboard(openWith);
	}
	await expectExists(t.getContent());
	const content = t.getContent().element() as HTMLElement;
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

	it("should apply the appropriate `aria-labelledby` attribute to the group", async () => {
		const t = await openSingle();

		expect(t.group).toHaveAttribute("aria-labelledby", t.groupHeading.id);
	});

	it("should select item with the enter key", async () => {
		const t = await openSingle();
		t.trigger.focus();
		await t.user.keyboard(kbd.ARROW_DOWN);
		await t.user.keyboard(kbd.ENTER);
		expect(t.trigger).toHaveTextContent("A");
	});

	it("should have the placeholder attribute when empty and not when not empty", async () => {
		const t = await openSingle();
		t.trigger.focus();
		expect(t.trigger).toHaveAttribute("data-placeholder");
		await t.user.keyboard(kbd.ARROW_DOWN);
		await t.user.keyboard(kbd.ENTER);
		expect(t.trigger).toHaveTextContent("A");
		expect(t.trigger).not.toHaveAttribute("data-placeholder");
	});

	it("should render an input if the `name` prop is passed", async () => {
		const t = setupSingle();
		expect(t.getHiddenInput()).toBeInTheDocument();
	});

	it("should not render an input if the `name` prop isn't passed or is an empty string/undefined", async () => {
		const t = setupSingle({ name: "" });
		expect(t.getHiddenInput()).not.toBeInTheDocument();
	});

	it("should sync the value prop to the hidden input", async () => {
		const t = setupSingle({ value: "test" });
		expect(t.getHiddenInput()).toHaveValue("test");
	});

	it("should sync the required prop to the hidden input", async () => {
		const t = setupSingle({ required: true });
		expect(t.getHiddenInput()).toHaveAttribute("required");
	});

	it("should sync the disabled prop to the hidden input", async () => {
		const t = setupSingle({ disabled: true });
		expect(t.getHiddenInput()).toHaveAttribute("disabled");
	});

	it("should close on escape keydown", async () => {
		const t = await openSingle();
		await t.user.keyboard(kbd.ESCAPE);
		await expectNotExists(t.getContent());
	});

	it("should close on outside click", async () => {
		const t = await openSingle();
		await sleep(100);

		await t.user.click(t.outside);
		await sleep(100);
		await expectNotExists(t.getContent());
	});

	it("should portal to the body by default", async () => {
		const t = await openSingle();
		expect(t.content.parentElement?.parentElement).toBe(document.body);
	});

	it("should portal to a custom element if specified", async () => {
		const t = await openSingle({
			portalProps: { to: "#portal-target" },
		});
		const portalTarget = t.getByTestId("portal-target").element() as HTMLElement;
		expect(t.content.parentElement?.parentElement).toBe(portalTarget);
	});

	it("should not portal if `disabled` is passed as portal prop", async () => {
		const t = await openSingle({ portalProps: { disabled: true } });
		const main = t.getByTestId("main").element() as HTMLElement;
		expect(t.content.parentElement?.parentElement).toBe(main);
	});

	it("should respect binding the `open` prop", async () => {
		const t = await openSingle();
		expect(t.openBinding).toHaveTextContent("true");
		await t.user.click(t.openBinding);
		expect(t.openBinding).toHaveTextContent("false");
		await vi.waitFor(() => expectNotExists(t.getContent()));
		await t.user.click(t.openBinding);
		expect(t.openBinding).toHaveTextContent("true");
		await vi.waitFor(() => expectExists(t.getContent()));
	});

	it("should respect binding the `value` prop", async () => {
		const t = await openSingle({ value: "1" });
		expect(t.valueBinding).toHaveTextContent("1");
		await t.user.click(t.valueBinding);
		expect(t.valueBinding).toHaveTextContent("empty");
	});

	it("should select items when clicked", async () => {
		const t = await openSingle();
		const [_, item1] = getItems(t.getByTestId);
		await expectNotExists(t.getByTestId("1-indicator"));
		await t.user.click(item1!);
		expect(t.trigger).toHaveTextContent("A");
		expect(t.getHiddenInput()).toHaveValue("1");
		await t.user.click(t.trigger);
		expectSelected(item1!);
		await expectExists(t.getByTestId("1-indicator"));
	});

	it("should navigate through the items using the keyboard (loop = false)", async () => {
		const t = await openSingle({}, kbd.ARROW_DOWN);

		const [item0, item1, item2, item3, item4] = getItems(t.getByTestId);

		expectHighlighted(item0!);
		await t.user.keyboard(kbd.ARROW_DOWN);
		expectHighlighted(item1!);
		await t.user.keyboard(kbd.ARROW_DOWN);
		expectHighlighted(item2!);
		await t.user.keyboard(kbd.ARROW_DOWN);
		expectHighlighted(item3!);
		await t.user.keyboard(kbd.ARROW_DOWN);
		expectHighlighted(item4!);
		await t.user.keyboard(kbd.ARROW_UP);
		expectHighlighted(item3!);
		await t.user.keyboard(kbd.ARROW_UP);
		expectHighlighted(item2!);
		await t.user.keyboard(kbd.ARROW_UP);
		expectHighlighted(item1!);
		await t.user.keyboard(kbd.ARROW_UP);
		expectHighlighted(item0!);
	});
	it("should navigate through the items using the keyboard (loop = true)", async () => {
		const t = await openSingle(
			{
				loop: true,
			},
			kbd.ARROW_DOWN
		);

		const [item0, item1, item2, item3, item4] = getItems(t.getByTestId);

		expectHighlighted(item0!);
		await t.user.keyboard(kbd.ARROW_DOWN);
		expectHighlighted(item1!);
		await t.user.keyboard(kbd.ARROW_DOWN);
		expectHighlighted(item2!);
		await t.user.keyboard(kbd.ARROW_DOWN);
		expectHighlighted(item3!);
		await t.user.keyboard(kbd.ARROW_DOWN);
		expectHighlighted(item4!);
		await t.user.keyboard(kbd.ARROW_DOWN);
		expectNotHighlighted(item4!);
		expectHighlighted(item0!);

		await t.user.keyboard(kbd.ARROW_UP);
		expectHighlighted(item4!);
		await t.user.keyboard(kbd.ARROW_UP);
		expectHighlighted(item3!);
		await t.user.keyboard(kbd.ARROW_UP);
		expectHighlighted(item2!);
		await t.user.keyboard(kbd.ARROW_UP);
		expectHighlighted(item1!);
		await t.user.keyboard(kbd.ARROW_UP);
		expectHighlighted(item0!);
		await t.user.keyboard(kbd.ARROW_UP);
		expectHighlighted(item4!);
	});

	it("should allow items to be selected using the keyboard", async () => {
		const t = await openSingle({}, kbd.ARROW_DOWN);

		const [item0, item1, item2, item3, item4] = getItems(t.getByTestId);

		expectHighlighted(item0!);
		await t.user.keyboard(kbd.ARROW_DOWN);
		expectHighlighted(item1!);
		await t.user.keyboard(kbd.ARROW_DOWN);
		expectHighlighted(item2!);
		await t.user.keyboard(kbd.ARROW_DOWN);
		expectHighlighted(item3!);
		await t.user.keyboard(kbd.ARROW_DOWN);
		expectHighlighted(item4!);
		await t.user.keyboard(kbd.ENTER);
		expect(t.trigger).toHaveTextContent("D");
		expect(t.getHiddenInput()).toHaveValue("4");
		await t.user.click(t.trigger);
		expectSelected(item4);
		expectNotSelected([item0!, item1!, item2!, item3!]);
	});

	it("should select first item with empty string value when pressing Enter", async () => {
		const t = await openSingle();
		t.trigger.focus();
		await t.user.keyboard(kbd.ENTER); // first item ("")
		expect(t.valueBinding).toHaveTextContent("empty");
		expect(t.trigger).toHaveTextContent("Open Listbox");
	});

	it("should select empty string value after navigating through items", async () => {
		const t = await openSingle();
		t.trigger.focus();
		await t.user.keyboard(kbd.ARROW_DOWN); // to "1"
		await t.user.keyboard(kbd.ARROW_UP); // back to ""
		await t.user.keyboard(kbd.ENTER);
		expect(t.valueBinding).toHaveTextContent("empty");
		expect(t.trigger).toHaveTextContent("Open Listbox");
	});

	it("should select empty string value in loop navigation", async () => {
		const t = await openSingle({ loop: true });
		t.trigger.focus();
		await t.user.keyboard(kbd.ARROW_DOWN); // to "1"
		await t.user.keyboard(kbd.ARROW_DOWN); // to "2"
		await t.user.keyboard(kbd.ARROW_DOWN); // to "3"
		await t.user.keyboard(kbd.ARROW_DOWN); // to "4"
		await t.user.keyboard(kbd.ARROW_DOWN); // back to ""
		await t.user.keyboard(kbd.ENTER);
		expect(t.valueBinding).toHaveTextContent("empty");
		expect(t.trigger).toHaveTextContent("Open Listbox");
	});

	it("should revert to empty state when deselecting a value", async () => {
		const t = await openSingle();
		t.trigger.focus();
		// First select a non-empty value
		await t.user.keyboard(kbd.ARROW_DOWN); // to "1"
		await t.user.keyboard(kbd.ENTER);
		expect(t.valueBinding).not.toHaveTextContent("empty");

		// Then deselect by selecting empty value
		await t.user.click(t.trigger);
		await t.user.keyboard(kbd.ARROW_UP); // back to ""
		await t.user.keyboard(kbd.ENTER);
		expect(t.valueBinding).toHaveTextContent("empty");
		expect(t.trigger).toHaveTextContent("Open Listbox");
	});

	it("should maintain empty value after reopening", async () => {
		const t = await openSingle();
		// Select empty value
		await t.user.keyboard(kbd.ENTER);
		expect(t.valueBinding).toHaveTextContent("empty");

		// Close and reopen
		await t.user.keyboard(kbd.ESCAPE);
		await t.user.click(t.trigger);
		expect(t.valueBinding).toHaveTextContent("empty");
		expect(t.trigger).toHaveTextContent("Open Listbox");
	});

	it("should apply the `data-highlighted` attribute on mouseover", async () => {
		const t = await openSingle({}, kbd.ARROW_DOWN);
		const [item1, item2] = getItems(t.getByTestId);
		await t.user.hover(item1!);
		expectHighlighted(item1!);
		await t.user.hover(item2!);
		expectHighlighted(item2!);
		expectNotHighlighted(item1!);
	});

	it("should start keyboard navigation at the highlighted item even if hovered with mouse", async () => {
		const t = await openSingle({}, kbd.ARROW_DOWN);
		const [item1, item2, item3] = getItems(t.getByTestId);
		await t.user.hover(item1!);
		expectHighlighted(item1!);
		await t.user.hover(item2!);
		expectHighlighted(item2!);
		expectNotHighlighted(item1!);
		await t.user.keyboard(kbd.ARROW_DOWN);
		expectHighlighted(item3!);
		expectNotHighlighted(item2!);
	});

	it("should select a default item when provided", async () => {
		const t = await openSingle({
			value: "2",
		});
		expect(t.getByTestId("2-indicator")).not.toBeNull();
		expect(t.trigger).toHaveTextContent("B");
		expect(t.getHiddenInput()).toHaveValue("2");
		const [_, __, item2] = getItems(t.getByTestId);
		expectSelected(item2!);
	});

	it("should allow navigating after navigating to the bottom, closing, and reopening the menu", async () => {
		const t = await openSingle();
		t.trigger.focus();

		const [item0, item1, item2, item3, item4] = getItems(t.getByTestId);
		expectHighlighted(item0!);
		await t.user.keyboard(kbd.ARROW_DOWN);
		expectHighlighted(item1!);
		await t.user.keyboard(kbd.ARROW_DOWN);
		expectHighlighted(item2!);
		await t.user.keyboard(kbd.ARROW_DOWN);
		expectHighlighted(item3!);
		await t.user.keyboard(kbd.ARROW_DOWN);
		expectHighlighted(item4!);
		await t.user.keyboard(kbd.ARROW_DOWN);
		expectHighlighted(item4!);
		await t.user.keyboard(kbd.ESCAPE);
		await expectNotExists(t.getContent());

		await t.user.keyboard(kbd.ARROW_DOWN);
		await expectExists(t.getContent());
		const [i0, i1] = getItems(t.getByTestId);
		expectHighlighted(i0!);
		await t.user.keyboard(kbd.ARROW_DOWN);
		expectHighlighted(i1!);
	});

	it("should forceMount the content when `forceMount` is true", async () => {
		const t = setupSingle({}, [], SelectForceMountTest);

		const content = t.getByTestId("content");
		expect(content).toBeVisible();
	});

	it("should forceMount the content when `forceMount` is true and the `open` snippet prop is used to conditionally render the content", async () => {
		const t = setupSingle({ withOpenCheck: true }, [], SelectForceMountTest);

		await expectNotExists(t.getByTestId("content"));

		await t.user.click(t.trigger);

		await expectExists(t.getByTestId("content"));
	});

	it("should not deselect the selected item when the user clicks on the selected item", async () => {
		const t = await openSingle();

		const [item0] = getItems(t.getByTestId);
		await t.user.click(item0!);
		await t.user.click(t.trigger);
		expectSelected(item0!);

		const [item0v2] = getItems(t.getByTestId);
		await t.user.click(item0v2!);
		await t.user.click(t.trigger);
		expectSelected(item0v2!);

		const [item0v3] = getItems(t.getByTestId);
		expectSelected(item0v3!);
	});

	it("should allow deselecting an item when `allowDeselect` is true", async () => {
		const t = await openSingle({
			allowDeselect: true,
		});
		const [_, item1] = getItems(t.getByTestId);
		await t.user.click(item1!);
		await t.user.click(t.trigger);
		expectSelected(item1!);

		const [__, item2] = getItems(t.getByTestId);

		await t.user.click(item2!);
		expectNotSelected(item2!);
	});

	it("should forward the `autocomplete` prop to the hidden input", async () => {
		const t = await openSingle({
			autocomplete: "one-time-code",
		});
		expect(t.getHiddenInput()).toHaveAttribute("autocomplete", "one-time-code");
	});

	it("should not open when disabled on touch devices", async () => {
		const t = setupSingle({ disabled: true });

		// simulate touch pointerup event (which is what touch devices use)
		const touchEvent = new PointerEvent("pointerup", {
			pointerType: "touch",
		});
		t.trigger.dispatchEvent(touchEvent);

		await expectNotExists(t.getByTestId("content"));
	});

	it("should not open when disabled on mouse/pointer devices", async () => {
		const t = setupSingle({ disabled: true });

		// simulate mouse pointerdown event
		const mouseEvent = new PointerEvent("pointerdown", {
			pointerType: "mouse",
		});
		t.trigger.dispatchEvent(mouseEvent);

		await expectNotExists(t.getByTestId("content"));
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
		t.trigger.focus();
		await t.user.keyboard(kbd.ARROW_DOWN);
		await t.user.keyboard(kbd.ENTER);
		expect(mockFn).toHaveBeenCalledWith("A");
	});

	it("should have the placeholder attribute when empty and not when not empty", async () => {
		const mockFn = vi.fn();
		const t = await openMultiple({
			onSelectedLabelChange: mockFn,
		});
		t.trigger.focus();
		expect(t.trigger).toHaveAttribute("data-placeholder");
		await t.user.keyboard(kbd.ARROW_DOWN);
		await t.user.keyboard(kbd.ENTER);
		expect(mockFn).toHaveBeenCalledWith("A");
		expect(t.trigger).not.toHaveAttribute("data-placeholder");
	});

	it("should not render a hidden input if the `name` prop is passed and a value is not selected", async () => {
		const t = setupMultiple();
		expect(t.getHiddenInputs()).toHaveLength(0);
	});

	it("should render a hidden input for each value in the `value` array, each with the same `name` prop", async () => {
		const t = setupMultiple({ value: ["a", "b"] });
		const hiddenInputs = t.getHiddenInputs();
		expect(hiddenInputs).toHaveLength(2);
		expect(hiddenInputs[0]).toHaveAttribute("name", "test");
		expect(hiddenInputs[1]).toHaveAttribute("name", "test");
	});

	it("should sync the value prop to the hidden inputs", async () => {
		const t = setupMultiple({ value: ["a", "b"] });
		const hiddenInputs = t.getHiddenInputs();
		expect(hiddenInputs).toHaveLength(2);
		expect(hiddenInputs[0]).toHaveValue("a");
		expect(hiddenInputs[1]).toHaveValue("b");
	});

	it("should sync the required prop to the hidden inputs", async () => {
		const t = setupMultiple({ required: true, value: ["a", "b"] });
		const hiddenInputs = t.getHiddenInputs();
		expect(hiddenInputs).toHaveLength(2);

		for (const hiddenInput of hiddenInputs) {
			expect(hiddenInput).toHaveAttribute("required");
		}
	});

	it("should sync the disabled prop to the hidden inputs", async () => {
		const t = setupMultiple({ disabled: true, value: ["a", "b"] });
		const hiddenInputs = t.getHiddenInputs();
		expect(hiddenInputs).toHaveLength(2);

		for (const hiddenInput of hiddenInputs) {
			expect(hiddenInput).toHaveAttribute("disabled");
		}
	});

	it("should close on escape keydown", async () => {
		const t = await openMultiple();
		await t.user.keyboard(kbd.ESCAPE);
		await expectNotExists(t.getContent());
	});

	it("should close on outside click", async () => {
		const t = await openMultiple();
		await sleep(100);
		await t.user.click(t.outside);
		await expectNotExists(t.getContent());
	});

	it("should portal to the body by default", async () => {
		const t = await openMultiple();
		expect(t.content.parentElement?.parentElement).toBe(document.body);
	});

	it("should portal to a custom element if specified", async () => {
		const t = await openMultiple({
			portalProps: { to: "#portal-target" },
		});
		const portalTarget = t.getByTestId("portal-target").element();
		expect(t.content.parentElement?.parentElement).toBe(portalTarget);
	});

	it("should not portal if `disabled` is passed as portal prop", async () => {
		const t = await openMultiple({ portalProps: { disabled: true } });
		const form = t.getByTestId("form").element();
		expect(t.content.parentElement?.parentElement).toBe(form);
	});

	it("should respect binding the `open` prop", async () => {
		const t = await openMultiple();
		expect(t.openBinding).toHaveTextContent("true");
		await t.user.click(t.openBinding);
		expect(t.openBinding).toHaveTextContent("false");
		await vi.waitFor(() => expectNotExists(t.getContent()));
		await t.user.click(t.openBinding);
		expect(t.openBinding).toHaveTextContent("true");
		await vi.waitFor(() => expectExists(t.getContent()));
	});

	it("should respect binding the `value` prop", async () => {
		const t = await openMultiple({ value: ["1", "2"] });
		expect(t.valueBinding).toHaveTextContent("1,2");
		await t.user.click(t.valueBinding);
		expect(t.valueBinding).toHaveTextContent("empty");
	});

	it("should select items when clicked", async () => {
		const t = await openMultiple();
		const [_, item] = getItems(t.getByTestId);
		await expectNotExists(t.getByTestId("1-indicator"));
		await t.user.click(item!);
		expect(t.trigger).toHaveTextContent("A");
		expect(t.getHiddenInputs()).toHaveLength(1);
		expect(t.getHiddenInputs()[0]).toHaveValue("1");

		expectSelected(item!);
		await expectExists(t.getByTestId("1-indicator"));
	});

	it("should navigate through the items using the keyboard (loop = false)", async () => {
		const t = await openMultiple({}, kbd.ARROW_DOWN);

		const [item0, item1, item2, item3, item4] = getItems(t.getByTestId);

		expectHighlighted(item0!);
		await t.user.keyboard(kbd.ARROW_DOWN);
		expectHighlighted(item1!);
		await t.user.keyboard(kbd.ARROW_DOWN);
		expectHighlighted(item2!);
		await t.user.keyboard(kbd.ARROW_DOWN);
		expectHighlighted(item3!);
		await t.user.keyboard(kbd.ARROW_DOWN);
		expectHighlighted(item4!);
		await t.user.keyboard(kbd.ARROW_DOWN);
		expectHighlighted(item4!);
		await t.user.keyboard(kbd.ARROW_UP);
		expectHighlighted(item3!);
		await t.user.keyboard(kbd.ARROW_UP);
		expectHighlighted(item2!);
		await t.user.keyboard(kbd.ARROW_UP);
		expectHighlighted(item1!);
		await t.user.keyboard(kbd.ARROW_UP);
		expectHighlighted(item0!);
	});
	it("should navigate through the items using the keyboard (loop = true)", async () => {
		const t = await openSingle(
			{
				loop: true,
			},
			kbd.ARROW_DOWN
		);

		const [item0, item1, item2, item3, item4] = getItems(t.getByTestId);

		expectHighlighted(item0!);
		await t.user.keyboard(kbd.ARROW_DOWN);
		expectHighlighted(item1!);
		await t.user.keyboard(kbd.ARROW_DOWN);
		expectHighlighted(item2!);
		await t.user.keyboard(kbd.ARROW_DOWN);
		expectHighlighted(item3!);
		await t.user.keyboard(kbd.ARROW_DOWN);
		expectHighlighted(item4!);
		await t.user.keyboard(kbd.ARROW_DOWN);
		expectNotHighlighted(item4!);
		expectHighlighted(item0!);
		await t.user.keyboard(kbd.ARROW_UP);
		expectHighlighted(item4!);
		await t.user.keyboard(kbd.ARROW_UP);
		expectHighlighted(item3!);
		await t.user.keyboard(kbd.ARROW_UP);
		expectHighlighted(item2!);
		await t.user.keyboard(kbd.ARROW_UP);
		expectHighlighted(item1!);
		await t.user.keyboard(kbd.ARROW_UP);
		expectHighlighted(item0!);
		await t.user.keyboard(kbd.ARROW_UP);
		expectHighlighted(item4!);
	});

	it("should allow items to be selected using the keyboard", async () => {
		const t = await openMultiple({}, kbd.ARROW_DOWN);

		const [item0, item1, item2, item3, item4] = getItems(t.getByTestId);

		expectHighlighted(item0);
		await t.user.keyboard(kbd.ARROW_DOWN);
		expectHighlighted(item1);
		await t.user.keyboard(kbd.ARROW_DOWN);
		expectHighlighted(item2);
		await t.user.keyboard(kbd.ARROW_DOWN);
		expectHighlighted(item3);
		await t.user.keyboard(kbd.ARROW_DOWN);
		expectHighlighted(item4);
		await t.user.keyboard(kbd.ENTER);
		expect(t.trigger).toHaveTextContent("D");
		const hiddenInputs = t.getHiddenInputs();
		expect(hiddenInputs).toHaveLength(1);
		expectSelected(item4);
		expectNotSelected([item0, item1, item2, item3]);
	});

	it("should allow multiple items to be selected using the keyboard", async () => {
		const t = await openMultiple({}, kbd.ARROW_DOWN);

		const [item0, item1, item2, item3, item4] = getItems(t.getByTestId);

		await t.user.keyboard(kbd.ARROW_DOWN);
		await t.user.keyboard(kbd.ARROW_DOWN);
		await t.user.keyboard(kbd.ARROW_DOWN);
		await t.user.keyboard(kbd.ARROW_DOWN);
		await t.user.keyboard(kbd.ENTER);
		expect(t.trigger).toHaveTextContent("D");
		const hiddenInputs = t.getHiddenInputs();
		expect(hiddenInputs).toHaveLength(1);
		expect(hiddenInputs[0]).toHaveValue("4");
		expectSelected(item4!);
		expectNotSelected([item0!, item1!, item2!, item3!]);
		await t.user.keyboard(kbd.ARROW_UP);
		expectHighlighted(item3!);
		await t.user.keyboard(kbd.ENTER);
		expectSelected([item4!, item3!]);
		expectNotSelected([item0!, item1!, item2!]);
	});

	it("should apply the `data-highlighted` attribute on mouseover", async () => {
		const t = await openMultiple({}, kbd.ARROW_DOWN);
		const [item1, item2] = getItems(t.getByTestId);
		await t.user.hover(item1!);
		expectHighlighted(item1!);
		await t.user.hover(item2!);
		expectHighlighted(item2!);
		expectNotHighlighted(item1!);
	});

	it("should select a default item when provided", async () => {
		const t = await openMultiple({
			value: ["2"],
		});
		expect(t.getByTestId("2-indicator")).not.toBeNull();
		expect(t.trigger).toHaveTextContent("B");

		expect(t.getHiddenInputs()[0]).toHaveValue("2");
		const [_, __, item2] = getItems(t.getByTestId);
		expectSelected(item2!);
	});

	it("should submit an empty array when the user submits the form without selecting any items", async () => {
		let submittedValues: string[] | undefined;
		const t = setupMultiple({
			onFormSubmit: (fd) => {
				submittedValues = fd.getAll("themes") as string[];
			},
			name: "themes",
		});

		await t.user.click(t.submit);
		expect(submittedValues).toHaveLength(0);
	});

	it("should not open when disabled on touch devices", async () => {
		const t = setupMultiple({ disabled: true });

		// simulate touch pointerup event (which is what touch devices use)
		const touchEvent = new PointerEvent("pointerup", {
			pointerType: "touch",
		});
		t.trigger.dispatchEvent(touchEvent);

		await expectNotExists(t.getContent());
	});

	it("should not open when disabled on mouse/pointer devices", async () => {
		const t = setupMultiple({ disabled: true });

		// simulate mouse pointerdown event
		const mouseEvent = new PointerEvent("pointerdown", {
			pointerType: "mouse",
		});
		t.trigger.dispatchEvent(mouseEvent);

		await expectNotExists(t.getContent());
	});
});

function getItems(getter: AnyFn, items = testItems) {
	const itemsArr: HTMLElement[] = [];
	for (const item of items) {
		itemsArr.push(getter(getTestId(item)));
	}
	return itemsArr as HTMLElement[];
}

////////////////////////////////////
// HELPERS
////////////////////////////////////

function expectSelected(node: HTMLElement | HTMLElement[]) {
	if (Array.isArray(node)) {
		for (const n of node) {
			expect(n).toHaveAttribute("data-selected");
			expect(n).toHaveAttribute("aria-selected", "true");
		}
	} else {
		expect(node).toHaveAttribute("data-selected");
		expect(node).toHaveAttribute("aria-selected", "true");
	}
}

function expectNotSelected(node: HTMLElement | HTMLElement[]) {
	if (Array.isArray(node)) {
		for (const n of node) {
			expect(n).not.toHaveAttribute("data-selected");
			expect(n).not.toHaveAttribute("aria-selected");
		}
	} else {
		expect(node).not.toHaveAttribute("data-selected");
		expect(node).not.toHaveAttribute("aria-selected");
	}
}

function expectHighlighted(node: HTMLElement | HTMLElement[]) {
	if (Array.isArray(node)) {
		for (const n of node) {
			expect(n).toHaveAttribute("data-highlighted");
		}
	} else {
		expect(node).toHaveAttribute("data-highlighted");
	}
}

function expectNotHighlighted(node: HTMLElement | HTMLElement[]) {
	if (Array.isArray(node)) {
		for (const n of node) {
			expect(n).not.toHaveAttribute("data-highlighted");
		}
	} else {
		expect(node).not.toHaveAttribute("data-highlighted");
	}
}
