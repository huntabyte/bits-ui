import { render } from "@testing-library/svelte";
import userEvent from "@testing-library/user-event";
import { axe } from "jest-axe";
import { describe, it } from "vitest";
import AccordionTest from "./AccordionTest.svelte";
import type { Item } from "./AccordionTest.svelte";
import { testKbd as kbd } from "../utils";

const items: Item[] = [
	{
		value: "item-1",
		title: "Item 1",
		content: "Content 1",
		disabled: false
	},
	{
		value: "item-2",
		title: "Item 2",
		content: "Content 2",
		disabled: false
	},
	{
		value: "item-3",
		title: "Item 3",
		content: "Content 3",
		disabled: false
	},
	{
		value: "item-4",
		title: "Item 4",
		content: "Content 4",
		disabled: false
	}
];

describe("Accordion", () => {
	it("has no accessibility violations", async () => {
		const { container } = render(AccordionTest, { items });
		expect(await axe(container)).toHaveNoViolations();
	});

	it("displays content when an item is expanded", async () => {
		const user = userEvent.setup();
		const { getByTestId, queryByTestId } = render(AccordionTest, { items });

		for (const item of items) {
			const trigger = getByTestId(`${item.value}-trigger`);
			const content = queryByTestId(`${item.value}-content`);
			const itemEl = getByTestId(`${item.value}-item`);
			expect(itemEl).toHaveAttribute("data-state", "closed");
			expect(itemEl).toHaveAttribute("data-state", "closed");
			expect(content).toBeNull();
			await user.click(trigger);
			const contentAfter = getByTestId(`${item.value}-content`);
			expect(contentAfter).toHaveTextContent(item.content);
			expect(itemEl).toHaveAttribute("data-state", "open");
		}
	});

	it("expands only one item at a time when `multiple` is false", async () => {
		const user = userEvent.setup();
		const { getByTestId, queryByTestId } = render(AccordionTest, { items });

		for (const item of items) {
			const trigger = getByTestId(`${item.value}-trigger`);
			const content = queryByTestId(`${item.value}-content`);
			const itemEl = getByTestId(`${item.value}-item`);
			expect(itemEl).toHaveAttribute("data-state", "closed");
			expect(itemEl).toHaveAttribute("data-state", "closed");
			expect(content).toBeNull();
			await user.click(trigger);
			const contentAfter = getByTestId(`${item.value}-content`);
			expect(contentAfter).toHaveTextContent(item.content);
			expect(itemEl).toHaveAttribute("data-state", "open");
		}
		const openItems = Array.from(
			document.querySelectorAll("[data-state='open'][data-bits-accordion-item]")
		);
		expect(openItems.length).toBe(1);
	});

	it("expands multiple items when `multiple` is true", async () => {
		const user = userEvent.setup();
		const { getByTestId, queryByTestId } = render(AccordionTest, { items, multiple: true });

		for (const item of items) {
			const trigger = getByTestId(`${item.value}-trigger`);
			const content = queryByTestId(`${item.value}-content`);
			const itemEl = getByTestId(`${item.value}-item`);
			expect(itemEl).toHaveAttribute("data-state", "closed");
			expect(itemEl).toHaveAttribute("data-state", "closed");
			expect(content).toBeNull();
			await user.click(trigger);
			const contentAfter = getByTestId(`${item.value}-content`);
			expect(contentAfter).toHaveTextContent(item.content);
			expect(itemEl).toHaveAttribute("data-state", "open");
		}
		const openItems = Array.from(
			document.querySelectorAll("[data-state='open'][data-bits-accordion-item]")
		);
		expect(openItems.length).toBe(4);
	});

	it("expands when the trigger is focused and `Enter` key is pressed", async () => {
		const user = userEvent.setup();
		const { getByTestId, queryByTestId } = render(AccordionTest, { items, multiple: true });

		for (const item of items) {
			const trigger = getByTestId(`${item.value}-trigger`);
			const content = queryByTestId(`${item.value}-content`);
			const itemEl = getByTestId(`${item.value}-item`);
			expect(itemEl).toHaveAttribute("data-state", "closed");
			expect(itemEl).toHaveAttribute("data-state", "closed");
			expect(content).toBeNull();
			trigger.focus();
			await user.keyboard(kbd.ENTER);
			const contentAfter = getByTestId(`${item.value}-content`);
			expect(contentAfter).toHaveTextContent(item.content);
			expect(itemEl).toHaveAttribute("data-state", "open");
		}
	});

	it("expands when the trigger is focused and `Space` key is pressed", async () => {
		const user = userEvent.setup();
		const { getByTestId, queryByTestId } = render(AccordionTest, { items, multiple: true });

		for (const item of items) {
			const trigger = getByTestId(`${item.value}-trigger`);
			const content = queryByTestId(`${item.value}-content`);
			const itemEl = getByTestId(`${item.value}-item`);
			expect(itemEl).toHaveAttribute("data-state", "closed");
			expect(itemEl).toHaveAttribute("data-state", "closed");
			expect(content).toBeNull();
			trigger.focus();
			await user.keyboard(kbd.SPACE);
			const contentAfter = getByTestId(`${item.value}-content`);
			expect(contentAfter).toHaveTextContent(item.content);
			expect(itemEl).toHaveAttribute("data-state", "open");
		}
	});

	it("focuses the next item when `ArrowDown` key is pressed", async () => {
		const user = userEvent.setup();
		const { getByTestId } = render(AccordionTest, { items });

		const triggers = items.map((item) => getByTestId(`${item.value}-trigger`));
		triggers[0].focus();
		await user.keyboard(kbd.ARROW_DOWN);
		expect(triggers[1]).toHaveFocus();
		await user.keyboard(kbd.ARROW_DOWN);
		expect(triggers[2]).toHaveFocus();
		await user.keyboard(kbd.ARROW_DOWN);
		expect(triggers[3]).toHaveFocus();
		await user.keyboard(kbd.ARROW_DOWN);
		expect(triggers[0]).toHaveFocus();
	});

	it("focuses the previous item when the `ArrowUp` key is pressed", async () => {
		const user = userEvent.setup();
		const { getByTestId } = render(AccordionTest, { items });

		const triggers = items.map((item) => getByTestId(`${item.value}-trigger`));
		triggers[0].focus();
		await user.keyboard(kbd.ARROW_UP);
		expect(triggers[3]).toHaveFocus();
		await user.keyboard(kbd.ARROW_UP);
		expect(triggers[2]).toHaveFocus();
		await user.keyboard(kbd.ARROW_UP);
		expect(triggers[1]).toHaveFocus();
		await user.keyboard(kbd.ARROW_UP);
		expect(triggers[0]).toHaveFocus();
	});

	it("focuses the first item when the `Home` key is pressed", async () => {
		const user = userEvent.setup();
		const { getByTestId } = render(AccordionTest, { items });

		const triggers = items.map((item) => getByTestId(`${item.value}-trigger`));

		for (const trigger of triggers) {
			trigger.focus();
			await user.keyboard(kbd.HOME);
			expect(triggers[0]).toHaveFocus();
		}
	});
	it("focuses the last item when the `End` key is pressed", async () => {
		const user = userEvent.setup();
		const { getByTestId } = render(AccordionTest, { items });

		const triggers = items.map((item) => getByTestId(`${item.value}-trigger`));

		for (const trigger of triggers) {
			trigger.focus();
			await user.keyboard(kbd.END);
			expect(triggers[3]).toHaveFocus();
		}
	});
});
