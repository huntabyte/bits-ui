import { render } from "@testing-library/svelte/svelte5";
import { axe } from "jest-axe";
import { describe, it, vi } from "vitest";
import { type ComponentProps, tick } from "svelte";
import { getTestKbd, setupUserEvents, sleep } from "../utils.js";
import AccordionSingleTest from "./accordion-single-test.svelte";
import AccordionMultiTest from "./accordion-multi-test.svelte";
import AccordionTestIsolated from "./accordion-test-isolated.svelte";
import AccordionSingleTestControlledSvelte from "./accordion-single-test-controlled.svelte";
import AccordionMultiTestControlled from "./accordion-multi-test-controlled.svelte";
import AccordionSingleForceMountTest from "./accordion-single-force-mount-test.svelte";

export type Item = {
	value: string;
	title: string;
	disabled: boolean;
	content: string;
	level: 1 | 2 | 3 | 4 | 5 | 6;
};

const kbd = getTestKbd();

const ITEMS: Item[] = [
	{ value: "item-0", title: "Item 0", content: "Content 0", disabled: false, level: 3 },
	{ value: "item-1", title: "Item 1", content: "Content 1", disabled: false, level: 3 },
	{ value: "item-2", title: "Item 2", content: "Content 2", disabled: false, level: 3 },
	{ value: "item-3", title: "Item 3", content: "Content 3", disabled: false, level: 3 },
];

const ITEMS_WITH_DISABLED = ITEMS.map((item) =>
	item.value === "item-1" ? { ...item, disabled: true } : item
);

function setupSingle(
	props: Partial<ComponentProps<typeof AccordionSingleTest>> = { items: ITEMS }
) {
	const user = setupUserEvents();
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	const returned = render(AccordionSingleTest, { ...(props as any) });
	const itemEls = ITEMS.map((item) => returned.getByTestId(`${item.value}-item`));
	const triggerEls = ITEMS.map((item) => returned.getByTestId(`${item.value}-trigger`));
	return { user, itemEls, triggerEls, ...returned };
}

function setupSingleForceMount(
	props: Partial<ComponentProps<typeof AccordionSingleForceMountTest>> = {
		items: ITEMS,
	}
) {
	const user = setupUserEvents();
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	const returned = render(AccordionSingleForceMountTest, { ...(props as any) });
	const itemEls = ITEMS.map((item) => returned.getByTestId(`${item.value}-item`));
	const triggerEls = ITEMS.map((item) => returned.getByTestId(`${item.value}-trigger`));
	return { user, itemEls, triggerEls, ...returned };
}

function setupMultiple(
	props: Partial<ComponentProps<typeof AccordionMultiTest>> = { items: ITEMS }
) {
	const user = setupUserEvents();
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	const returned = render(AccordionMultiTest, { ...(props as any) });
	const itemEls = ITEMS.map((item) => returned.getByTestId(`${item.value}-item`));
	const triggerEls = ITEMS.map((item) => returned.getByTestId(`${item.value}-trigger`));
	return { user, itemEls, triggerEls, ...returned };
}

function expectOpen(...itemEls: HTMLElement[]) {
	for (const itemEl of itemEls) {
		expect(itemEl).toHaveAttribute("data-state", "open");
	}
}

function expectClosed(...itemEls: HTMLElement[]) {
	for (const itemEl of itemEls) {
		expect(itemEl).toHaveAttribute("data-state", "closed");
	}
}

function expectDisabled(...triggerEls: HTMLElement[]) {
	for (const triggerEl of triggerEls) {
		expect(triggerEl).toHaveAttribute("data-disabled");
	}
}

function expectNotDisabled(...triggerEls: HTMLElement[]) {
	for (const triggerEl of triggerEls) {
		expect(triggerEl).not.toHaveAttribute("data-disabled");
	}
}

describe("Shared Behavior", () => {
	it("should have no accessibility violations (single)", async () => {
		const { container } = setupSingle();
		expect(await axe(container)).toHaveNoViolations();
	});

	it("should have bits data attrs", async () => {
		const t = render(AccordionTestIsolated);
		const root = t.getByTestId("root");
		const trigger = t.getByTestId("trigger");
		const item = t.getByTestId("item");
		const header = t.getByTestId("header");
		const content = t.getByTestId("content");
		expect(root).toHaveAttribute("data-accordion-root");
		expect(item).toHaveAttribute("data-accordion-item");
		expect(header).toHaveAttribute("data-accordion-header");
		expect(content).toHaveAttribute("data-accordion-content");
		expect(trigger).toHaveAttribute("data-accordion-trigger");
	});
});

describe("type='single'", () => {
	describe("Expansion Behavior", () => {
		it("should have expected data attributes", async () => {
			const t = setupSingle({ items: ITEMS_WITH_DISABLED });

			expectClosed(t.itemEls[0], t.triggerEls[0]);
			expectNotDisabled(t.itemEls[0], t.triggerEls[0]);

			await t.user.click(t.triggerEls[0]);
			await tick();
			expectOpen(t.itemEls[0], t.triggerEls[0]);
			expectDisabled(t.itemEls[1], t.triggerEls[1]);
		});

		it("should display content when an item is expanded", async () => {
			const t = setupSingle();

			for (const item of ITEMS) {
				const trigger = t.getByTestId(`${item.value}-trigger`);
				const content = t.getByTestId(`${item.value}-content`);
				const itemEl = t.getByTestId(`${item.value}-item`);
				expectClosed(itemEl, trigger);
				expect(content).not.toBeVisible();
				await t.user.click(trigger);
				const contentAfter = t.getByTestId(`${item.value}-content`);
				expect(contentAfter).toHaveTextContent(item.content);
				expectOpen(itemEl, trigger);
			}
		});

		it("should expand only one item at a time", async () => {
			const t = setupSingle();

			for (const item of ITEMS) {
				const trigger = t.getByTestId(`${item.value}-trigger`);
				const content = t.getByTestId(`${item.value}-content`);
				const itemEl = t.getByTestId(`${item.value}-item`);
				expectClosed(itemEl, trigger);
				expect(content).not.toBeVisible();
				await t.user.click(trigger);
				const contentAfter = t.getByTestId(`${item.value}-content`);
				expect(contentAfter).toHaveTextContent(item.content);
				expectOpen(itemEl, trigger);
			}
			const openItems = Array.from(
				document.querySelectorAll("[data-state='open'][data-accordion-item]")
			);
			expect(openItems.length).toBe(1);
		});

		it.each([kbd.ENTER, kbd.SPACE])(
			`should expand when the trigger is focused and "%s" key is pressed`,
			async (key) => {
				const t = setupSingle();

				for (const item of ITEMS) {
					const trigger = t.getByTestId(`${item.value}-trigger`);
					const content = t.getByTestId(`${item.value}-content`);
					const itemEl = t.getByTestId(`${item.value}-item`);
					expectClosed(itemEl, trigger);
					expect(content).not.toBeVisible();
					trigger.focus();
					await t.user.keyboard(key);
					const contentAfter = t.getByTestId(`${item.value}-content`);
					expect(contentAfter).toHaveTextContent(item.content);
					expectOpen(itemEl, trigger);
				}
			}
		);
	});

	describe("Keyboard Navigation", () => {
		it("should focus the next item when `ArrowDown` key is pressed", async () => {
			const t = setupSingle();

			t.triggerEls[0]?.focus();
			await t.user.keyboard(kbd.ARROW_DOWN);
			expect(t.triggerEls[1]).toHaveFocus();
			await t.user.keyboard(kbd.ARROW_DOWN);
			expect(t.triggerEls[2]).toHaveFocus();
			await t.user.keyboard(kbd.ARROW_DOWN);
			expect(t.triggerEls[3]).toHaveFocus();
			await t.user.keyboard(kbd.ARROW_DOWN);
			expect(t.triggerEls[0]).toHaveFocus();
		});

		it("should focus the previous item when the `ArrowUp` key is pressed", async () => {
			const t = setupSingle();

			t.triggerEls[0]?.focus();
			await t.user.keyboard(kbd.ARROW_UP);
			expect(t.triggerEls[3]).toHaveFocus();
			await t.user.keyboard(kbd.ARROW_UP);
			expect(t.triggerEls[2]).toHaveFocus();
			await t.user.keyboard(kbd.ARROW_UP);
			expect(t.triggerEls[1]).toHaveFocus();
			await t.user.keyboard(kbd.ARROW_UP);
			expect(t.triggerEls[0]).toHaveFocus();
		});

		it("should focus the first item when the `Home` key is pressed", async () => {
			const t = setupSingle();

			for (const trigger of t.triggerEls) {
				trigger.focus();
				await t.user.keyboard(kbd.HOME);
				expect(t.triggerEls[0]).toHaveFocus();
			}
		});

		it("should focus the last item when the `End` key is pressed", async () => {
			const t = setupSingle();

			for (const trigger of t.triggerEls) {
				trigger.focus();
				await t.user.keyboard(kbd.END);
				expect(t.triggerEls[3]).toHaveFocus();
			}
		});

		it("should skip over disabled items when navigating with Arrow Keys", async () => {
			const t = setupSingle({ items: ITEMS_WITH_DISABLED });

			t.triggerEls[0]?.focus();
			await t.user.keyboard(kbd.ARROW_DOWN);
			expect(t.triggerEls[1]).not.toHaveFocus();
			expect(t.triggerEls[2]).toHaveFocus();
		});

		it("should loop through the items when the `loop` prop is true", async () => {
			const t = setupSingle({ items: ITEMS, loop: true });

			t.triggerEls[0]?.focus();
			await t.user.keyboard(kbd.ARROW_UP);
			expect(t.triggerEls[3]).toHaveFocus();
			await t.user.keyboard(kbd.ARROW_DOWN);
			expect(t.triggerEls[0]).toHaveFocus();
		});

		it("should not loop through the items when the `loop` prop is false", async () => {
			const t = setupSingle({ items: ITEMS, loop: false });

			t.triggerEls[0]?.focus();
			await t.user.keyboard(kbd.ARROW_UP);
			expect(t.triggerEls[3]).not.toHaveFocus();
			expect(t.triggerEls[0]).toHaveFocus();
			await t.user.keyboard(kbd.ARROW_DOWN);
			expect(t.triggerEls[1]).toHaveFocus();
		});

		it("should navigate using ArrowLeft/Right when `orientation` is `horizontal`", async () => {
			const t = setupSingle({
				items: ITEMS,
				orientation: "horizontal",
			});

			t.triggerEls[0]?.focus();
			await t.user.keyboard(kbd.ARROW_LEFT);
			expect(t.triggerEls[3]).toHaveFocus();
			await t.user.keyboard(kbd.ARROW_RIGHT);
			expect(t.triggerEls[0]).toHaveFocus();
		});

		it("should loop using ArrowLeft/Right when `orientation` is `horizontal` and `loop` is true", async () => {
			const t = setupSingle({
				items: ITEMS,
				orientation: "horizontal",
				loop: true,
			});

			t.triggerEls[0]?.focus();
			await t.user.keyboard(kbd.ARROW_LEFT);
			expect(t.triggerEls[3]).toHaveFocus();
			await t.user.keyboard(kbd.ARROW_RIGHT);
			expect(t.triggerEls[0]).toHaveFocus();
		});

		it("should not loop using ArrowLeft/Right when `orientation` is `horizontal` and `loop` is false", async () => {
			const t = setupSingle({
				items: ITEMS,
				orientation: "horizontal",
				loop: false,
			});

			t.triggerEls[0]?.focus();
			await t.user.keyboard(kbd.ARROW_LEFT);
			expect(t.triggerEls[3]).not.toHaveFocus();
			expect(t.triggerEls[0]).toHaveFocus();
			await t.user.keyboard(kbd.ARROW_RIGHT);
			expect(t.triggerEls[1]).toHaveFocus();
		});
	});

	describe("Props and Bindings", () => {
		it("should forceMount the content when `forceMount` is true", async () => {
			const t = setupSingleForceMount({
				items: ITEMS_WITH_DISABLED,
			});
			const contentEls = ITEMS.map((item) => t.getByTestId(`${item.value}-content`));
			for (const content of contentEls) {
				expect(content).toBeVisible();
			}
		});

		it("works properly when `forceMount` is true and the `open` snippet prop is used to conditionally render the content", async () => {
			const t = setupSingleForceMount({
				items: ITEMS_WITH_DISABLED,
				withOpenCheck: true,
			});
			const initContentEls = ITEMS.map((item) => t.queryByTestId(`${item.value}-content`));
			for (const content of initContentEls) {
				expect(content).toBeNull();
			}

			await t.user.click(t.triggerEls[0]);
			const firstContentEl = t.getByTestId(`${ITEMS[0]!.value}-content`);
			expect(firstContentEl).toBeVisible();
			const secondContentEl = t.queryByTestId(`${ITEMS[1]!.value}-content`);
			expect(secondContentEl).toBeNull();
		});

		it("should disable everything when true on root", async () => {
			const t = setupSingle({ items: ITEMS, disabled: true });

			await t.user.click(t.triggerEls[0]);
			expectClosed(t.triggerEls[0]);
			expectDisabled(t.triggerEls[0]);
			await t.user.click(t.triggerEls[1]);
			expectClosed(t.triggerEls[1]);
			expectDisabled(t.triggerEls[1]);
			await t.user.click(t.triggerEls[2]);
			expectClosed(t.triggerEls[2]);
			expectDisabled(t.triggerEls[2]);
		});

		it("should respect the `disabled` prop for items", async () => {
			const t = setupSingle({ items: ITEMS_WITH_DISABLED });

			await t.user.click(t.triggerEls[0]);
			expect(t.triggerEls[0]).toHaveFocus();
			await t.user.keyboard(kbd.ARROW_DOWN);
			expect(t.triggerEls[1]).not.toHaveFocus();
			expect(t.triggerEls[2]).toHaveFocus();
		});

		it("should respect the `level` prop for headers", async () => {
			const itemsWithLevel = ITEMS.map((item, i) =>
				i === 0 ? ({ ...item, level: 1 } as const) : item
			);
			const t = setupSingle({ items: itemsWithLevel });

			const headers = ITEMS.map((item) => t.getByTestId(`${item.value}-header`));
			expect(headers[0]).toHaveAttribute("data-heading-level", "1");
			expect(headers[0]).toHaveAttribute("aria-level", "1");
			expect(headers[1]).toHaveAttribute("data-heading-level", "3");
			expect(headers[1]).toHaveAttribute("aria-level", "3");
		});

		it("should update the `bind:value` prop when the value changes", async () => {
			const user = setupUserEvents();
			const t = render(AccordionSingleTestControlledSvelte, { items: ITEMS });
			const trigger = t.getByTestId("item-0-trigger");
			const value = t.getByTestId("value");

			expect(value).toHaveTextContent("");
			await user.click(trigger);
			expect(value).toHaveTextContent("item-0");
		});

		it('should handle programmatic changes to the "value" prop', async () => {
			const user = setupUserEvents();
			const { getByTestId } = render(AccordionSingleTestControlledSvelte, { items: ITEMS });
			const updateButton = getByTestId("update-value");
			const value = getByTestId("value");

			expect(value).toHaveTextContent("");
			const itemOneItem = getByTestId("item-1-item");
			expectClosed(itemOneItem);
			await user.click(updateButton);
			expect(value).toHaveTextContent("item-1");
			expectOpen(itemOneItem);
		});

		it("should call `onValueChange` with the new value when an item is expanded", async () => {
			const mock = vi.fn();
			const t = setupSingle({
				items: ITEMS,
				onValueChange: mock,
			});

			t.triggerEls[0]?.focus();
			await t.user.keyboard(kbd.ENTER);
			expect(mock).toHaveBeenCalledWith(ITEMS[0].value);
			await t.user.keyboard(kbd.ARROW_DOWN);
			await t.user.keyboard(kbd.ENTER);
			expect(mock).toHaveBeenCalledWith(ITEMS[1].value);
			await t.user.keyboard(kbd.ENTER);
			expect(mock).toHaveBeenCalledWith("");
		});
	});
});

describe("type='multiple'", () => {
	describe("Expansion Behavior", () => {
		it("should have no accessibility violations", async () => {
			const t = setupMultiple();
			expect(await axe(t.container)).toHaveNoViolations();
		});

		it("should have expected data attributes", async () => {
			const t = setupMultiple({ items: ITEMS_WITH_DISABLED });

			expectClosed(t.itemEls[0], t.triggerEls[0]);
			expectNotDisabled(t.itemEls[0], t.triggerEls[0]);
			await t.user.click(t.triggerEls[0] as HTMLElement);
			expectOpen(t.itemEls[0], t.triggerEls[0]);
			expectDisabled(t.itemEls[1], t.triggerEls[1]);
		});

		it("should display content when an item is expanded", async () => {
			const t = setupMultiple();

			for (const item of ITEMS) {
				const trigger = t.getByTestId(`${item.value}-trigger`);
				const content = t.getByTestId(`${item.value}-content`);
				const itemEl = t.getByTestId(`${item.value}-item`);
				expectClosed(itemEl, trigger);
				expect(content).not.toBeVisible();
				await t.user.click(trigger);
				const contentAfter = t.getByTestId(`${item.value}-content`);
				expect(contentAfter).toHaveTextContent(item.content);
				expectOpen(itemEl, trigger);
			}
		});

		it("should allow expanding multiple items", async () => {
			const t = setupMultiple();

			for (const item of ITEMS) {
				const trigger = t.getByTestId(`${item.value}-trigger`);
				const content = t.getByTestId(`${item.value}-content`);
				const itemEl = t.getByTestId(`${item.value}-item`);
				expectClosed(itemEl, trigger);
				expect(content).not.toBeVisible();
				await t.user.click(trigger);
				const contentAfter = t.getByTestId(`${item.value}-content`);
				expect(contentAfter).toHaveTextContent(item.content);
				expectOpen(itemEl, trigger);
			}
			const openItems = Array.from(
				document.querySelectorAll("[data-state='open'][data-accordion-item]")
			);
			expect(openItems.length).toBe(4);
		});

		it("should expand when the trigger is focused and `Enter` key is pressed", async () => {
			const t = setupMultiple();

			for (const item of ITEMS) {
				const trigger = t.getByTestId(`${item.value}-trigger`);
				const content = t.getByTestId(`${item.value}-content`);
				const itemEl = t.getByTestId(`${item.value}-item`);
				expectClosed(itemEl, trigger);
				expect(content).not.toBeVisible();
				trigger.focus();
				await t.user.keyboard(kbd.ENTER);
				const contentAfter = t.getByTestId(`${item.value}-content`);
				expect(contentAfter).toHaveTextContent(item.content);
				expectOpen(itemEl, trigger);
			}
		});

		it("should expand when the trigger is focused and `Space` key is pressed", async () => {
			const t = setupMultiple();

			for (const item of ITEMS) {
				const trigger = t.getByTestId(`${item.value}-trigger`);
				const content = t.getByTestId(`${item.value}-content`);
				const itemEl = t.getByTestId(`${item.value}-item`);
				expectClosed(itemEl, trigger);
				expect(content).not.toBeVisible();
				trigger.focus();
				await t.user.keyboard(kbd.SPACE);
				await sleep(19);
				const contentAfter = t.getByTestId(`${item.value}-content`);
				expect(contentAfter).toHaveTextContent(item.content);
				expectOpen(itemEl, trigger);
			}
		});
	});

	describe("Keyboard Navigation", () => {
		it("should focus the next item when `ArrowDown` key is pressed", async () => {
			const t = setupMultiple();

			t.triggerEls[0]?.focus();
			await t.user.keyboard(kbd.ARROW_DOWN);
			expect(t.triggerEls[1]).toHaveFocus();
			await t.user.keyboard(kbd.ARROW_DOWN);
			expect(t.triggerEls[2]).toHaveFocus();
			await t.user.keyboard(kbd.ARROW_DOWN);
			expect(t.triggerEls[3]).toHaveFocus();
			await t.user.keyboard(kbd.ARROW_DOWN);
			expect(t.triggerEls[0]).toHaveFocus();
		});

		it("should focus the previous item when the `ArrowUp` key is pressed", async () => {
			const t = setupMultiple();

			t.triggerEls[0]?.focus();
			await t.user.keyboard(kbd.ARROW_UP);
			expect(t.triggerEls[3]).toHaveFocus();
			await t.user.keyboard(kbd.ARROW_UP);
			expect(t.triggerEls[2]).toHaveFocus();
			await t.user.keyboard(kbd.ARROW_UP);
			expect(t.triggerEls[1]).toHaveFocus();
			await t.user.keyboard(kbd.ARROW_UP);
			expect(t.triggerEls[0]).toHaveFocus();
		});

		it("should focus the first item when the `Home` key is pressed", async () => {
			const t = setupMultiple();

			for (const trigger of t.triggerEls) {
				trigger.focus();
				await t.user.keyboard(kbd.HOME);
				expect(t.triggerEls[0]).toHaveFocus();
			}
		});

		it("should focus the last item when the `End` key is pressed", async () => {
			const t = setupMultiple();

			for (const trigger of t.triggerEls) {
				trigger.focus();
				await t.user.keyboard(kbd.END);
				expect(t.triggerEls[3]).toHaveFocus();
			}
		});

		it("should respect the `disabled` prop for items", async () => {
			const t = setupMultiple({ items: ITEMS_WITH_DISABLED });

			await t.user.click(t.triggerEls[0]);
			await t.user.keyboard(kbd.ARROW_DOWN);
			expect(t.triggerEls[1]).not.toHaveFocus();
			expect(t.triggerEls[2]).toHaveFocus();
		});
	});

	describe("Props and Bindings", () => {
		it("should disable everything when the `disabled` prop is true", async () => {
			const t = setupMultiple({ items: ITEMS, disabled: true });

			await t.user.click(t.triggerEls[0]);
			expectClosed(t.triggerEls[0]);
			expectDisabled(t.triggerEls[0]);
			await t.user.click(t.triggerEls[1]);
			expectClosed(t.triggerEls[1]);
			expectDisabled(t.triggerEls[1]);
			await t.user.click(t.triggerEls[2]);
			expectClosed(t.triggerEls[2]);
			expectDisabled(t.triggerEls[2]);
		});

		it("should respect the `level` prop for headers", async () => {
			const itemsWithLevel = ITEMS.map((item, i) =>
				i === 0 ? ({ ...item, level: 1 } as const) : item
			);
			const t = setupMultiple({ items: itemsWithLevel });

			const headers = ITEMS.map((item) => t.getByTestId(`${item.value}-header`));
			expect(headers[0]).toHaveAttribute("data-heading-level", "1");
			expect(headers[0]).toHaveAttribute("aria-level", "1");
			expect(headers[1]).toHaveAttribute("data-heading-level", "3");
			expect(headers[1]).toHaveAttribute("aria-level", "3");
		});

		it("should update the `bind:value` prop when the value changes", async () => {
			const user = setupUserEvents();
			const t = render(AccordionMultiTestControlled, {
				items: ITEMS,
			});
			const trigger = t.getByTestId("item-0-trigger");
			const value = t.getByTestId("value");

			expect(value).toHaveTextContent("");
			await user.click(trigger);
			expect(t.queryByTestId("value")).toHaveTextContent("item-0");
		});

		it('should handle programmatic changes to the "value" prop', async () => {
			const user = setupUserEvents();
			const t = render(AccordionMultiTestControlled, { items: ITEMS });
			const updateButton = t.getByTestId("update-value");
			const value = t.getByTestId("value");

			expect(value).toHaveTextContent("");
			const itemOneItem = t.getByTestId("item-1-item");
			expectClosed(itemOneItem);
			await user.click(updateButton);
			expectOpen(itemOneItem);
		});

		it("should call `onValueChange` with the new value when an item is expanded/collapsed", async () => {
			const mock = vi.fn();
			const t = setupMultiple({
				items: ITEMS,
				onValueChange: mock,
			});

			t.triggerEls[0]?.focus();
			await t.user.keyboard(kbd.ENTER);
			expect(mock).toHaveBeenCalledWith([ITEMS[0].value]);
			await t.user.keyboard(kbd.ARROW_DOWN);
			await t.user.keyboard(kbd.ENTER);
			expect(mock).toHaveBeenCalledWith([ITEMS[0].value, ITEMS[1].value]);
			await t.user.keyboard(kbd.ENTER);
			expect(mock).toHaveBeenCalledWith([ITEMS[0].value]);
			await t.user.keyboard(kbd.ARROW_UP);
			await t.user.keyboard(kbd.ENTER);
			expect(mock).toHaveBeenCalledWith([]);
		});
	});
});
