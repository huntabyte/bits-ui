import { getByTestId, render, waitFor } from "@testing-library/svelte";
import { axe } from "jest-axe";
import { describe, it } from "vitest";
import { getTestKbd, setupUserEvents } from "../utils.js";
import ComboboxTest from "./ComboboxTest.svelte";
import type { ComboboxSingleTestProps, Item } from "./ComboboxTest.svelte";
import { sleep, type AnyFn } from "$lib/internal/index.js";
import type { ComboboxMultipleTestProps } from "./ComboboxMultiTest.svelte";
import ComboboxMultiTest from "./ComboboxMultiTest.svelte";
import { tick } from "svelte";

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

function setupSingle(props: Partial<ComboboxSingleTestProps> = {}, items: Item[] = testItems) {
	const user = setupUserEvents();
	const returned = render(ComboboxTest, { ...props, items } as any);
	const input = returned.getByTestId("input");
	const trigger = returned.getByTestId("trigger");
	return {
		user,
		input,
		trigger,
		...returned,
	};
}

function setupMultiple(props: Partial<ComboboxMultipleTestProps> = {}, items: Item[] = testItems) {
	const user = setupUserEvents();
	const returned = render(ComboboxMultiTest, { ...props, items } as any);
	const input = returned.getByTestId("input");
	const trigger = returned.getByTestId("trigger");
	return {
		user,
		input,
		trigger,
		...returned,
	};
}

async function openSingle(
	props: Partial<ComboboxSingleTestProps> = {},
	openWith: "click" | "type" | (string & {}) = "click",
	inputValue?: string
) {
	const returned = setupSingle(props);
	const { queryByTestId, getByTestId, user, input, trigger } = returned;
	expect(queryByTestId("content")).toBeNull();
	if (openWith === "click") {
		await user.click(trigger);
	} else if (openWith === "type" && inputValue) {
		await user.type(input, inputValue);
	} else {
		input.focus();
		await user.keyboard(openWith);
	}
	await waitFor(() => expect(queryByTestId("content")).not.toBeNull());
	const content = getByTestId("content");
	return {
		...returned,
		content,
	};
}

async function openMultiple(
	props: Partial<ComboboxMultipleTestProps> = {},
	openWith: "click" | "type" | (string & {}) = "click",
	inputValue?: string
) {
	const returned = setupMultiple(props);
	const { queryByTestId, getByTestId, user, input, trigger } = returned;
	expect(queryByTestId("content")).toBeNull();
	if (openWith === "click") {
		await user.click(trigger);
	} else if (openWith === "type" && inputValue) {
		await user.type(input, inputValue);
	} else {
		input.focus();
		await user.keyboard(openWith);
	}
	await waitFor(() => expect(queryByTestId("content")).not.toBeNull());
	const content = getByTestId("content");
	return {
		...returned,
		content,
	};
}

const OPEN_KEYS = [kbd.ARROW_DOWN, kbd.ARROW_UP];

describe("combobox - single", () => {
	it("has no accessibility violations", async () => {
		const { container } = render(ComboboxTest);
		expect(await axe(container)).toHaveNoViolations();
	});

	it("opens on click", async () => {
		await openSingle();
	});

	it.each(OPEN_KEYS)("opens on %s keydown", async (key) => {
		await openSingle({}, key);
	});

	it("selects item with the enter key", async () => {
		const { user, input } = await openSingle();
		await user.keyboard(kbd.ARROW_DOWN);
		await user.keyboard(kbd.ENTER);
		await tick();
		expect(input).toHaveValue("B");
	});

	it("syncs the name prop to the hidden input", async () => {
		const { container } = setupSingle({ name: "test" });
		expect(container.querySelector('input[name="test"]')).toBeInTheDocument();
	});

	it("syncs the value prop to the hidden input", async () => {
		const { container } = setupSingle({ value: "test", name: "test" });
		expect(container.querySelector('input[name="test"]')).toHaveValue("test");
	});

	it("syncs the required prop to the hidden input", async () => {
		const { container } = setupSingle({ required: true, name: "test" });
		expect(container.querySelector('input[name="test"]')).toHaveAttribute("required");
	});

	it("syncs the disabled prop to the hidden input", async () => {
		const { container } = setupSingle({ name: "test", disabled: true });
		expect(container.querySelector('input[name="test"]')).toHaveAttribute("disabled");
	});

	it("closes on escape keydown", async () => {
		const { user, queryByTestId } = await openSingle();
		await user.keyboard(kbd.ESCAPE);
		expect(queryByTestId("content")).toBeNull();
	});

	it("closes on outside click", async () => {
		const { user, queryByTestId, getByTestId } = await openSingle();
		const outside = getByTestId("outside");
		await sleep(100);
		await user.click(outside);
		await sleep(100);
		expect(queryByTestId("content")).toBeNull();
	});

	it("portals to the body by default", async () => {
		const { content } = await openSingle();
		expect(content.parentElement?.parentElement).toBe(document.body);
	});

	it("portals to a custom element if specified", async () => {
		const { content, getByTestId } = await openSingle({
			portalProps: { to: "#portal-target" },
		});
		const portalTarget = getByTestId("portal-target");
		expect(content.parentElement?.parentElement).toBe(portalTarget);
	});

	it("does not portal if `disabled` is passed as portal prop", async () => {
		const { content, getByTestId } = await openSingle({ portalProps: { disabled: true } });
		const main = getByTestId("main");
		expect(content.parentElement?.parentElement).toBe(main);
	});

	it("respects binding the `open` prop", async () => {
		const { queryByTestId, getByTestId, user } = await openSingle();
		const binding = getByTestId("open-binding");
		expect(binding).toHaveTextContent("true");
		await user.click(binding);
		expect(binding).toHaveTextContent("false");
		await waitFor(() => expect(queryByTestId("content")).toBeNull());
		await user.click(binding);
		expect(binding).toHaveTextContent("true");
		await waitFor(() => expect(queryByTestId("content")).not.toBeNull());
	});

	it("respects binding the `value` prop", async () => {
		const { getByTestId, user } = await openSingle({ value: "1" });
		const binding = getByTestId("value-binding");
		expect(binding).toHaveTextContent("1");
		await user.click(binding);
		expect(binding).toHaveTextContent("empty");
	});

	it("selects items when clicked", async () => {
		const { getByTestId, user, queryByTestId, input, container } = await openSingle({
			name: "test",
		});
		const item = getByTestId("1");
		await waitFor(() => expect(queryByTestId("1-indicator")).toBeNull());
		await user.click(item);
		expect(input).toHaveValue("A");
		expect(container.querySelector('input[name="test"]')).toHaveValue("1");
		await user.click(input);
		expect(item).toHaveAttribute("aria-selected", "true");
		expectSelected(item);
		await waitFor(() => expect(queryByTestId("1-indicator")).not.toBeNull());
	});

	it("navigates through the items using the keyboard", async () => {
		const { getByTestId, user } = await openSingle({}, kbd.ARROW_DOWN);

		const [item0, item1, item2, item3] = getItems(getByTestId);

		expectHighlighted(item0!);
		await user.keyboard(kbd.ARROW_DOWN);
		expectHighlighted(item1!);
		await user.keyboard(kbd.ARROW_DOWN);
		expectHighlighted(item2!);
		await user.keyboard(kbd.ARROW_DOWN);
		expectHighlighted(item3!);
		await user.keyboard(kbd.ARROW_UP);
		expectHighlighted(item2!);
		await user.keyboard(kbd.ARROW_UP);
		expectHighlighted(item1!);
		await user.keyboard(kbd.ARROW_UP);
		expectHighlighted(item0!);
	});

	it("allows items to be selected using the keyboard", async () => {
		const { getByTestId, user, container, input } = await openSingle(
			{
				name: "test",
			},
			kbd.ARROW_DOWN
		);

		const [item0, item1, item2, item3] = getItems(getByTestId);

		await user.keyboard(kbd.ARROW_DOWN);
		await user.keyboard(kbd.ARROW_DOWN);
		await user.keyboard(kbd.ARROW_DOWN);
		await user.keyboard(kbd.ENTER);
		expect(input).toHaveValue("D");
		expect(container.querySelector('input[name="test"]')).toHaveValue("4");
		await user.click(input);
		expectNotSelected([item0!, item1!, item2!]);
		expectSelected(item3!);
	});

	it("applies the `data-highlighted` attribute on mouseover", async () => {
		const { getByTestId, user } = await openSingle({}, kbd.ARROW_DOWN);
		const [item1, item2] = getItems(getByTestId);
		await user.hover(item1!);
		expectHighlighted(item1!);
		await user.hover(item2!);
		expectHighlighted(item2!);
		expectNotHighlighted(item1!);
	});

	it("selects a default item when provided", async () => {
		const { getByTestId, queryByTestId, input, container } = await openSingle({
			value: "2",
			name: "test",
			inputProps: {
				value: "B",
			},
		});
		expect(queryByTestId("2-indicator")).not.toBeNull();
		expect(input).toHaveValue("B");
		expect(container.querySelector('input[name="test"]')).toHaveValue("2");
		const item = getByTestId("2");
		expect(item).toHaveAttribute("aria-selected", "true");
		expect(item).toHaveAttribute("data-selected");
	});
});

function getItems(getter: AnyFn, items = testItems) {
	const itemsArr: HTMLElement[] = [];
	for (const item of items) {
		itemsArr.push(getter(item.value));
	}
	return itemsArr as HTMLElement[];
}

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
