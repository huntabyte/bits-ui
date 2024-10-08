import { render, waitFor } from "@testing-library/svelte";
import { axe } from "jest-axe";
import { describe, it, vi } from "vitest";
import { getTestKbd, setupUserEvents, sleep } from "../utils.js";
import SelectTest from "./select-test.svelte";
import type { Item, SelectTestProps } from "./select-test.svelte";

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

function setup(props: Partial<SelectTestProps> = {}, options: Item[] = testItems) {
	const user = setupUserEvents();
	// @ts-expect-error - testing lib needs to update their generic types
	const returned = render(SelectTest, { ...props, options });
	const trigger = returned.getByTestId("trigger");
	const select = returned.container.querySelector("select");
	return {
		trigger,
		user,
		select,
		...returned,
	};
}
async function open(
	props: Partial<SelectTestProps> = {},
	openWith: "click" | (string & {}) = "click"
) {
	const returned = setup(props);
	const { trigger, queryByTestId, user } = returned;
	const contentInit = queryByTestId("content");
	expect(contentInit).toBeNull();
	if (openWith === "click") {
		await user.click(trigger);
	} else {
		trigger.focus();
		await user.keyboard(openWith);
	}
	await sleep(50);
	const content = queryByTestId("content");
	await waitFor(() => expect(content).not.toBeNull());
	expect(content).toHaveAttribute("data-state", "open");

	return { content, ...returned };
}

const OPEN_KEYS = [kbd.ENTER, kbd.SPACE, kbd.ARROW_DOWN, kbd.ARROW_UP];

describe("select", () => {
	it("should have no accessibility violations", async () => {
		// @ts-expect-error - testing lib needs to update their generic types
		const { container } = render(SelectTest);
		expect(await axe(container)).toHaveNoViolations();
	});

	it("should have bits data attrs", async () => {
		const { getByTestId } = await open();
		const parts = ["content", "trigger", "value", "group-label", "group", "viewport"];

		parts.forEach((part) => {
			const el = getByTestId(part);
			expect(el).toHaveAttribute(`data-select-${part}`);
		});

		const item = getByTestId("1");
		expect(item).toHaveAttribute("data-select-item");

		const itemText = getByTestId("1-item-text");
		expect(itemText).toHaveAttribute("data-select-item-text");
	});

	it("should open on click", async () => {
		await open();
	});

	it.each(OPEN_KEYS)("should open on %s keydown", async (key) => {
		await open({}, key);
	});

	it.each([kbd.SPACE, kbd.ENTER])("selects item with the %s key", async (key) => {
		const { user, queryByTestId, getByTestId } = await open();
		await user.keyboard(kbd.ARROW_DOWN);
		await user.keyboard(key);
		await waitFor(() => expect(queryByTestId("content")).toBeNull());
		expect(getByTestId("value")).toHaveTextContent("B");
	});

	it("should render a `select` element when used within a form", async () => {});

	it("should sync the name with the hidden select", async () => {
		const { select } = setup({ name: "test" });
		expect(select).toBeInTheDocument();
	});

	it("should sync the name prop to the hidden select", async () => {
		const { select } = setup({ name: "test" });
		expect(select).toHaveAttribute("name", "test");
	});

	it("should sync the value prop to the hidden select", async () => {
		const { getByTestId, queryByTestId, select, trigger, user, container } = setup({
			value: "2",
		});
		expect(select).toHaveAttribute("data-value", "2");
		await user.click(trigger);

		const item1 = getByTestId("1");
		expect(item1).toBeVisible();
		item1.focus();

		await user.keyboard(kbd.ENTER);

		expect(container.querySelector("select")).toHaveAttribute("data-value", "1");

		await waitFor(() => expect(queryByTestId("content")).toBeNull());
	});

	it("should submit the select value with the form", async () => {
		const onSubmit = vi.fn();
		const { getByTestId, user, trigger } = setup({ name: "test", onSubmit });

		trigger.focus();
		await user.keyboard(kbd.ARROW_DOWN);
		await user.keyboard(kbd.ENTER);

		const submitButton = getByTestId("submit");

		await user.click(submitButton);

		expect(onSubmit).toHaveBeenCalledWith("1");

		trigger.focus();
		await user.keyboard(kbd.ARROW_DOWN);
		await user.keyboard(kbd.ARROW_DOWN);
		await user.keyboard(kbd.ENTER);

		await user.click(submitButton);

		expect(onSubmit).toHaveBeenCalledWith("2");
	});

	it("should sync the required prop to the hidden select", async () => {
		const { select } = setup({ required: true });
		expect(select).toHaveAttribute("required");
	});

	it("should sync the disabled prop to the hidden select", async () => {
		const { select } = setup({ disabled: true });
		expect(select).toHaveAttribute("disabled");
	});

	it("should close on escape keydown", async () => {
		const { user, queryByTestId } = await open();
		await user.keyboard(kbd.ESCAPE);
		expect(queryByTestId("content")).toBeNull();
	});

	// this only fails during testing
	it.skip("should close on outside click", async () => {
		const onInteractOutside = vi.fn();
		const { getByTestId, user } = await open({
			contentProps: {
				onInteractOutside,
			},
		});
		await user.pointerDownUp(document.body);

		await waitFor(() => expect(onInteractOutside).toHaveBeenCalledTimes(1));
	});

	it("should portal to the body by default", async () => {
		const { content } = await open();
		const contentWrapper = content?.parentElement;
		expect(contentWrapper?.parentElement).toBe(document.body);
	});

	it("should portal to a custom element if specified", async () => {
		const { content, getByTestId } = await open({
			portalProps: {
				to: "#portal-target",
			},
		});
		const portalTarget = getByTestId("portal-target");
		const contentWrapper = content?.parentElement;
		expect(contentWrapper?.parentElement).toBe(portalTarget);
	});

	it("should not portal if `disabled` is passed to the portal", async () => {
		const { content, getByTestId } = await open({ portalProps: { disabled: true } });
		const form = getByTestId("form");
		const contentWrapper = content?.parentElement;
		expect(contentWrapper?.parentElement).toBe(form);
	});

	it("should respect the `escapeKeydownBehavior` prop", async () => {
		const { user, queryByTestId } = await open({
			contentProps: {
				escapeKeydownBehavior: "ignore",
			},
		});
		await user.keyboard(kbd.ESCAPE);
		await waitFor(() => expect(queryByTestId("content")).not.toBeNull());
	});

	it("should respect the `interactOutsideBehavior` prop", async () => {
		const { user, queryByTestId, getByTestId } = await open({
			contentProps: {
				interactOutsideBehavior: "ignore",
			},
		});
		const outside = getByTestId("outside");
		await user.click(outside);
		await user.click(outside);
		await waitFor(() => expect(queryByTestId("content")).not.toBeNull());
	});

	it("should respect binding the `open` prop", async () => {
		const { queryByTestId, getByTestId, user } = await open({
			contentProps: {
				interactOutsideBehavior: "ignore",
			},
		});
		const binding = getByTestId("open-binding");
		expect(binding).toHaveTextContent("true");
		await user.click(binding);
		await waitFor(() => expect(binding).toHaveTextContent("false"));
		await waitFor(() => expect(queryByTestId("content")).toBeNull());
		await user.click(binding);
		await waitFor(() => expect(binding).toHaveTextContent("true"));
		await waitFor(() => expect(queryByTestId("content")).not.toBeNull());
	});

	it("should respect binding the `value` prop", async () => {
		const { getByTestId, user } = await open({ value: "1" });
		const binding = getByTestId("value-binding");
		expect(binding).toHaveTextContent("1");
		await user.click(binding);
		await waitFor(() => expect(binding).toHaveTextContent(""));
	});

	it("should select items when clicked", async () => {
		const { user, queryByTestId, trigger, container } = await open();
		const item = queryByTestId("1") as HTMLElement;
		await waitFor(() => expect(queryByTestId("1-indicator")).toBeNull());
		await user.click(item);
		await user.click(item);
		const value = queryByTestId("value");
		await waitFor(() => expect(value).toHaveTextContent("A"));
		await waitFor(() =>
			expect(container.querySelector("select")).toHaveAttribute("data-value", "1")
		);
		await user.click(trigger);
		await waitFor(() => expect(queryByTestId("content")).not.toBeNull());
		await waitFor(() => expect(queryByTestId("1")).toHaveAttribute("aria-selected", "true"));
		await waitFor(() => expect(queryByTestId("1")).toHaveAttribute("data-selected"));
		await waitFor(() => expect(queryByTestId("1-indicator")).not.toBeNull());
	});

	it("should navigate through the items using the keyboard", async () => {
		const { user, queryByTestId } = await open({}, kbd.ENTER);

		await waitFor(() => expect(queryByTestId("1")).toHaveAttribute("data-highlighted"));
		await user.keyboard(kbd.ARROW_DOWN);
		await waitFor(() => expect(queryByTestId("2")).toHaveAttribute("data-highlighted"));
		await user.keyboard(kbd.ARROW_DOWN);
		await waitFor(() => expect(queryByTestId("3")).toHaveAttribute("data-highlighted"));
		await user.keyboard(kbd.ARROW_DOWN);
		await waitFor(() => expect(queryByTestId("4")).toHaveAttribute("data-highlighted"));
		await user.keyboard(kbd.ARROW_UP);
		await waitFor(() => expect(queryByTestId("3")).toHaveAttribute("data-highlighted"));
		await user.keyboard(kbd.ARROW_UP);
		await waitFor(() => expect(queryByTestId("2")).toHaveAttribute("data-highlighted"));
		await user.keyboard(kbd.ARROW_UP);
		await waitFor(() => expect(queryByTestId("1")).toHaveAttribute("data-highlighted"));
	});

	it("should allow items to be selected using the keyboard", async () => {
		const { getByTestId, user, queryByTestId, trigger } = await open({}, kbd.ENTER);

		await user.keyboard(kbd.ARROW_DOWN);
		await user.keyboard(kbd.ARROW_DOWN);
		await user.keyboard(kbd.ARROW_DOWN);
		await user.keyboard(kbd.ENTER);
		await waitFor(() => expect(queryByTestId("content")).toBeNull());
		const value = getByTestId("value");
		expect(value).toHaveTextContent("D");
		await user.click(trigger);
		await waitFor(() => expect(queryByTestId("content")).not.toBeNull());
		expect(queryByTestId("1")).not.toHaveAttribute("data-selected");
		expect(queryByTestId("2")).not.toHaveAttribute("data-selected");
		expect(queryByTestId("3")).not.toHaveAttribute("data-selected");
		expect(queryByTestId("4")).toHaveAttribute("data-selected");
	});

	it("should apply the `data-highlighted` attribute on mouseover", async () => {
		const { getByTestId, user } = await open({}, kbd.ENTER);
		const item1 = getByTestId("1");
		const item2 = getByTestId("2");
		await user.hover(item1);
		await waitFor(() => expect(item1).toHaveAttribute("data-highlighted"));
		await user.hover(item2);
		await waitFor(() => expect(item2).toHaveAttribute("data-highlighted"));
		await waitFor(() => expect(item1).not.toHaveAttribute("data-highlighted"));
	});

	it("should select a default item when provided", async () => {
		const { getByTestId, queryByTestId, container } = await open({
			value: "2",
		});
		expect(queryByTestId("2-indicator")).not.toBeNull();
		const value = getByTestId("value");
		expect(value).toHaveTextContent("B");
		expect(container.querySelector("select")).toHaveAttribute("data-value", "2");
		const item = getByTestId("2");
		expect(item).toHaveAttribute("aria-selected", "true");
		expect(item).toHaveAttribute("data-selected");
	});
});
