import { page, userEvent } from "@vitest/browser/context";
import { describe, expect, it, vi } from "vitest";
import { render } from "vitest-browser-svelte";
import AccordionSingleTest from "./accordion-single-test.svelte";
import AccordionMultiTest from "./accordion-multi-test.svelte";
import AccordionTestIsolated from "./accordion-test-isolated.svelte";
import AccordionSingleTestControlledSvelte from "./accordion-single-test-controlled.svelte";
import AccordionMultiTestControlled from "./accordion-multi-test-controlled.svelte";
import AccordionSingleForceMountTest from "./accordion-single-force-mount-test.svelte";
import type { ComponentProps } from "svelte";
import { getTestKbd } from "../utils.js";
import { setupBrowserUserEvents } from "../browser-utils";

export type Item = {
	value: string;
	title: string;
	disabled: boolean;
	content: string;
	level: 1 | 2 | 3 | 4 | 5 | 6;
};

const ITEMS: Item[] = [
	{ value: "item-0", title: "Item 0", content: "Content 0", disabled: false, level: 3 },
	{ value: "item-1", title: "Item 1", content: "Content 1", disabled: false, level: 3 },
	{ value: "item-2", title: "Item 2", content: "Content 2", disabled: false, level: 3 },
	{ value: "item-3", title: "Item 3", content: "Content 3", disabled: false, level: 3 },
];

const ITEMS_WITH_DISABLED = ITEMS.map((item) =>
	item.value === "item-1" ? { ...item, disabled: true } : item
);

const kbd = getTestKbd();

function setupSingle(
	props: Partial<ComponentProps<typeof AccordionSingleTest>> = { items: ITEMS }
) {
	const user = setupBrowserUserEvents();
	// oxlint-disable-next-line no-explicit-any
	const returned = render(AccordionSingleTest, { ...(props as any) });
	const itemEls = ITEMS.map(
		(item) => returned.getByTestId(`${item.value}-item`).element() as HTMLElement
	);
	const triggerEls = ITEMS.map(
		(item) => returned.getByTestId(`${item.value}-trigger`).element() as HTMLElement
	);
	return { user, itemEls, triggerEls, ...returned };
}

function setupSingleForceMount(
	props: Partial<ComponentProps<typeof AccordionSingleForceMountTest>> = {
		items: ITEMS,
	}
) {
	const user = setupBrowserUserEvents();
	// oxlint-disable-next-line no-explicit-any
	const returned = render(AccordionSingleForceMountTest, { ...(props as any) });
	const itemEls = ITEMS.map((item) => returned.getByTestId(`${item.value}-item`));
	const triggerEls = ITEMS.map((item) => returned.getByTestId(`${item.value}-trigger`));
	return { user, itemEls, triggerEls, ...returned };
}

function setupMultiple(
	props: Partial<ComponentProps<typeof AccordionMultiTest>> = { items: ITEMS }
) {
	const user = userEvent;
	// oxlint-disable-next-line no-explicit-any
	const returned = render(AccordionMultiTest, { ...(props as any) });
	const itemEls = ITEMS.map(
		(item) => returned.getByTestId(`${item.value}-item`).element() as HTMLElement
	);
	const triggerEls = ITEMS.map(
		(item) => returned.getByTestId(`${item.value}-trigger`).element() as HTMLElement
	);
	return { user, itemEls, triggerEls, ...returned };
}

async function expectOpen(...itemEls: Element[]) {
	for (const itemEl of itemEls) {
		await expect.element(itemEl).toHaveAttribute("data-state", "open");
	}
}

async function expectClosed(...itemEls: Element[]) {
	for (const itemEl of itemEls) {
		await expect.element(itemEl).toHaveAttribute("data-state", "closed");
	}
}

async function expectDisabled(...triggerEls: Element[]) {
	for (const triggerEl of triggerEls) {
		await expect.element(triggerEl).toHaveAttribute("data-disabled");
	}
}

async function expectNotDisabled(...triggerEls: Element[]) {
	for (const triggerEl of triggerEls) {
		await expect.element(triggerEl).not.toHaveAttribute("data-disabled");
	}
}

describe("Shared Behavior", () => {
	it("should have bits data attrs", async () => {
		render(AccordionTestIsolated);
		const root = page.getByTestId("root");
		const trigger = page.getByTestId("trigger");
		const item = page.getByTestId("item");
		const header = page.getByTestId("header");
		const content = page.getByTestId("content");
		await expect.element(root).toHaveAttribute("data-accordion-root");
		await expect.element(item).toHaveAttribute("data-accordion-item");
		await expect.element(header).toHaveAttribute("data-accordion-header");
		await expect.element(content).toHaveAttribute("data-accordion-content");
		await expect.element(trigger).toHaveAttribute("data-accordion-trigger");
	});
});

describe("type='single'", () => {
	describe("Expansion Behavior", () => {
		it("should have expected data attributes", async () => {
			const t = setupSingle({ items: ITEMS_WITH_DISABLED });

			await expectClosed(t.itemEls[0], t.triggerEls[0]);
			await expectNotDisabled(t.itemEls[0], t.triggerEls[0]);

			await t.user.click(t.triggerEls[0]);

			await expectOpen(t.itemEls[0], t.triggerEls[0]);
			await expectDisabled(t.itemEls[1], t.triggerEls[1]);
		});

		it("should display content when an item is expanded", async () => {
			setupSingle();

			for (const item of ITEMS) {
				const trigger = page.getByTestId(`${item.value}-trigger`);
				const content = page.getByTestId(`${item.value}-content`);
				const itemEl = page.getByTestId(`${item.value}-item`);
				await expectClosed(itemEl.element(), trigger.element());
				await expect.element(content).not.toBeVisible();
				await trigger.click();
				const contentAfter = page.getByTestId(`${item.value}-content`);
				await expect.element(contentAfter).toHaveTextContent(item.content);
				await expectOpen(itemEl.element(), trigger.element());
			}
		});

		it("should expand only one item at a time", async () => {
			setupSingle();

			for (const item of ITEMS) {
				const trigger = page.getByTestId(`${item.value}-trigger`);
				const content = page.getByTestId(`${item.value}-content`);
				const itemEl = page.getByTestId(`${item.value}-item`);
				await expectClosed(itemEl.element(), trigger.element());
				await expect.element(content).not.toBeVisible();
				await trigger.click();
				const contentAfter = page.getByTestId(`${item.value}-content`);
				await expect.element(contentAfter).toHaveTextContent(item.content);
				await expectOpen(itemEl.element(), trigger.element());
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
					const trigger = page
						.getByTestId(`${item.value}-trigger`)
						.element() as HTMLElement;
					const content = page.getByTestId(`${item.value}-content`).element();
					const itemEl = page.getByTestId(`${item.value}-item`).element();
					await expectClosed(itemEl, trigger);
					await expect.element(content).not.toBeVisible();
					trigger.focus();
					await t.user.keyboard(key);
					const contentAfter = t.getByTestId(`${item.value}-content`);
					await expect.element(contentAfter).toHaveTextContent(item.content);
					await expectOpen(itemEl, trigger);
				}
			}
		);
	});

	describe("Keyboard Navigation", () => {
		it("should focus the next item when `ArrowDown` key is pressed", async () => {
			const t = setupSingle();

			t.triggerEls[0]?.focus();
			await t.user.keyboard(kbd.ARROW_DOWN);
			await expect.element(t.triggerEls[1]).toHaveFocus();
			await t.user.keyboard(kbd.ARROW_DOWN);
			await expect.element(t.triggerEls[2]).toHaveFocus();
			await t.user.keyboard(kbd.ARROW_DOWN);
			await expect.element(t.triggerEls[3]).toHaveFocus();
			await t.user.keyboard(kbd.ARROW_DOWN);
			await expect.element(t.triggerEls[0]).toHaveFocus();
		});

		it("should focus the previous item when the `ArrowUp` key is pressed", async () => {
			const t = setupSingle();

			t.triggerEls[0]?.focus();
			await t.user.keyboard(kbd.ARROW_UP);
			await expect.element(t.triggerEls[3]).toHaveFocus();
			await t.user.keyboard(kbd.ARROW_UP);
			await expect.element(t.triggerEls[2]).toHaveFocus();
			await t.user.keyboard(kbd.ARROW_UP);
			await expect.element(t.triggerEls[1]).toHaveFocus();
			await t.user.keyboard(kbd.ARROW_UP);
			await expect.element(t.triggerEls[0]).toHaveFocus();
		});

		it("should focus the first item when the `Home` key is pressed", async () => {
			const t = setupSingle();

			for (const trigger of t.triggerEls) {
				trigger.focus();
				await t.user.keyboard(kbd.HOME);
				await expect.element(t.triggerEls[0]).toHaveFocus();
			}
		});

		it("should focus the last item when the `End` key is pressed", async () => {
			const t = setupSingle();

			for (const trigger of t.triggerEls) {
				trigger.focus();
				await t.user.keyboard(kbd.END);
				await expect.element(t.triggerEls[3]).toHaveFocus();
			}
		});

		it("should skip over disabled items when navigating with Arrow Keys", async () => {
			const t = setupSingle({ items: ITEMS_WITH_DISABLED });

			t.triggerEls[0]?.focus();
			await t.user.keyboard(kbd.ARROW_DOWN);
			await expect.element(t.triggerEls[1]).not.toHaveFocus();
			await expect.element(t.triggerEls[2]).toHaveFocus();
		});

		it("should loop through the items when the `loop` prop is true", async () => {
			const t = setupSingle({ items: ITEMS, loop: true });

			t.triggerEls[0]?.focus();
			await t.user.keyboard(kbd.ARROW_UP);
			await expect.element(t.triggerEls[3]).toHaveFocus();
			await t.user.keyboard(kbd.ARROW_DOWN);
			await expect.element(t.triggerEls[0]).toHaveFocus();
		});

		it("should not loop through the items when the `loop` prop is false", async () => {
			const t = setupSingle({ items: ITEMS, loop: false });

			t.triggerEls[0]?.focus();
			await t.user.keyboard(kbd.ARROW_UP);
			await expect.element(t.triggerEls[3]).not.toHaveFocus();
			await expect.element(t.triggerEls[0]).toHaveFocus();
			await t.user.keyboard(kbd.ARROW_DOWN);
			await expect.element(t.triggerEls[1]).toHaveFocus();
		});

		it("should navigate using ArrowLeft/Right when `orientation` is `horizontal`", async () => {
			const t = setupSingle({
				items: ITEMS,
				orientation: "horizontal",
			});

			t.triggerEls[0]?.focus();
			await t.user.keyboard(kbd.ARROW_LEFT);
			await expect.element(t.triggerEls[3]).toHaveFocus();
			await t.user.keyboard(kbd.ARROW_RIGHT);
			await expect.element(t.triggerEls[0]).toHaveFocus();
		});

		it("should loop using ArrowLeft/Right when `orientation` is `horizontal` and `loop` is true", async () => {
			const t = setupSingle({
				items: ITEMS,
				orientation: "horizontal",
				loop: true,
			});

			t.triggerEls[0]?.focus();
			await t.user.keyboard(kbd.ARROW_LEFT);
			await expect.element(t.triggerEls[3]).toHaveFocus();
			await t.user.keyboard(kbd.ARROW_RIGHT);
			await expect.element(t.triggerEls[0]).toHaveFocus();
		});

		it("should not loop using ArrowLeft/Right when `orientation` is `horizontal` and `loop` is false", async () => {
			const t = setupSingle({
				items: ITEMS,
				orientation: "horizontal",
				loop: false,
			});

			t.triggerEls[0]?.focus();
			await t.user.keyboard(kbd.ARROW_LEFT);
			await expect.element(t.triggerEls[3]).not.toHaveFocus();
			await expect.element(t.triggerEls[0]).toHaveFocus();
			await t.user.keyboard(kbd.ARROW_RIGHT);
			await expect.element(t.triggerEls[1]).toHaveFocus();
		});
	});

	describe("Props and Bindings", () => {
		it("should forceMount the content when `forceMount` is true", async () => {
			const t = setupSingleForceMount({
				items: ITEMS_WITH_DISABLED,
			});
			const contentEls = ITEMS.map((item) => t.getByTestId(`${item.value}-content`));
			for (const content of contentEls) {
				await expect.element(content).toBeVisible();
			}
		});

		it("works properly when `forceMount` is true and the `open` snippet prop is used to conditionally render the content", async () => {
			const t = setupSingleForceMount({
				items: ITEMS_WITH_DISABLED,
				withOpenCheck: true,
			});

			// check that content elements don't exist initially
			for (const item of ITEMS) {
				expect(() => t.getByTestId(`${item.value}-content`).element()).toThrow();
			}

			await t.user.click(t.triggerEls[0]);
			const firstContentEl = t.getByTestId(`${ITEMS[0]!.value}-content`).element();
			await expect.element(firstContentEl).toBeVisible();
			expect(() => t.getByTestId(`${ITEMS[1]!.value}-content`).element()).toThrow();
		});

		it("should disable everything when true on root", async () => {
			const t = setupSingle({ items: ITEMS, disabled: true });

			await t.user.click(t.triggerEls[0]);
			await expectClosed(t.triggerEls[0]);
			await expectDisabled(t.triggerEls[0]);
			await t.user.click(t.triggerEls[1]);
			await expectClosed(t.triggerEls[1]);
			await expectDisabled(t.triggerEls[1]);
			await t.user.click(t.triggerEls[2]);
			await expectClosed(t.triggerEls[2]);
			await expectDisabled(t.triggerEls[2]);
		});

		it("should respect the `disabled` prop for items", async () => {
			const t = setupSingle({ items: ITEMS_WITH_DISABLED });

			await t.user.click(t.triggerEls[0]);
			await expect.element(t.triggerEls[0]).toHaveFocus();
			await t.user.keyboard(kbd.ARROW_DOWN);
			await expect.element(t.triggerEls[1]).not.toHaveFocus();
			await expect.element(t.triggerEls[2]).toHaveFocus();
		});

		it("should respect the `level` prop for headers", async () => {
			const itemsWithLevel = ITEMS.map((item, i) =>
				i === 0 ? ({ ...item, level: 1 } as const) : item
			);
			const t = setupSingle({ items: itemsWithLevel });

			const headers = ITEMS.map((item) => t.getByTestId(`${item.value}-header`));
			await expect.element(headers[0]).toHaveAttribute("data-heading-level", "1");
			await expect.element(headers[0]).toHaveAttribute("aria-level", "1");
			await expect.element(headers[1]).toHaveAttribute("data-heading-level", "3");
			await expect.element(headers[1]).toHaveAttribute("aria-level", "3");
		});

		it("should update the `bind:value` prop when the value changes", async () => {
			const t = render(AccordionSingleTestControlledSvelte, { items: ITEMS });
			const trigger = t.getByTestId("item-0-trigger");
			const value = t.getByTestId("value");

			await expect.element(value).toHaveTextContent("");
			await trigger.click();
			await expect.element(value).toHaveTextContent("item-0");
		});

		it('should handle programmatic changes to the "value" prop', async () => {
			render(AccordionSingleTestControlledSvelte, { items: ITEMS });
			const updateButton = page.getByTestId("update-value");
			const value = page.getByTestId("value");

			await expect.element(value).toHaveTextContent("");
			const itemOneItem = page.getByTestId("item-1-item").element();
			await expectClosed(itemOneItem);
			await updateButton.click();
			await expect.element(value).toHaveTextContent("item-1");
			await expectOpen(itemOneItem);
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
		it("should have expected data attributes", async () => {
			const t = setupMultiple({ items: ITEMS_WITH_DISABLED });

			await expectClosed(t.itemEls[0], t.triggerEls[0]);
			await expectNotDisabled(t.itemEls[0], t.triggerEls[0]);
			await t.triggerEls[0].click();
			await expectOpen(t.itemEls[0], t.triggerEls[0]);
			await expectDisabled(t.itemEls[1], t.triggerEls[1]);
		});

		it("should display content when an item is expanded", async () => {
			setupMultiple();

			for (const item of ITEMS) {
				const trigger = page.getByTestId(`${item.value}-trigger`);
				const content = page.getByTestId(`${item.value}-content`);
				const itemEl = page.getByTestId(`${item.value}-item`);
				await expectClosed(itemEl.element(), trigger.element());
				await expect.element(content).not.toBeVisible();
				await trigger.click();
				const contentAfter = page.getByTestId(`${item.value}-content`);
				await expect.element(contentAfter).toHaveTextContent(item.content);
				await expectOpen(itemEl.element(), trigger.element());
			}
		});

		it("should allow expanding multiple items", async () => {
			setupMultiple();

			for (const item of ITEMS) {
				const trigger = page.getByTestId(`${item.value}-trigger`);
				const content = page.getByTestId(`${item.value}-content`);
				const itemEl = page.getByTestId(`${item.value}-item`);
				await expectClosed(itemEl.element(), trigger.element());
				await expect.element(content).not.toBeVisible();
				await trigger.click();
				const contentAfter = page.getByTestId(`${item.value}-content`);
				await expect.element(contentAfter).toHaveTextContent(item.content);
				await expectOpen(itemEl.element(), trigger.element());
			}
			const openItems = Array.from(
				document.querySelectorAll("[data-state='open'][data-accordion-item]")
			);
			expect(openItems.length).toBe(4);
		});

		it("should expand when the trigger is focused and `Enter` key is pressed", async () => {
			const t = setupMultiple();

			for (const item of ITEMS) {
				const trigger = page.getByTestId(`${item.value}-trigger`);
				const content = page.getByTestId(`${item.value}-content`);
				const itemEl = page.getByTestId(`${item.value}-item`);
				await expectClosed(itemEl.element(), trigger.element());
				await expect.element(content).not.toBeVisible();
				(trigger.element() as HTMLElement).focus();
				await t.user.keyboard(kbd.ENTER);
				const contentAfter = page.getByTestId(`${item.value}-content`);
				await expect.element(contentAfter).toHaveTextContent(item.content);
				await expectOpen(itemEl.element(), trigger.element());
			}
		});

		it("should expand when the trigger is focused and `Space` key is pressed", async () => {
			const t = setupMultiple();

			for (const item of ITEMS) {
				const trigger = page.getByTestId(`${item.value}-trigger`);
				const content = page.getByTestId(`${item.value}-content`);
				const itemEl = page.getByTestId(`${item.value}-item`);
				await expectClosed(itemEl.element(), trigger.element());
				await expect.element(content).not.toBeVisible();
				(trigger.element() as HTMLElement).focus();
				await t.user.keyboard(kbd.SPACE);
				const contentAfter = page.getByTestId(`${item.value}-content`);
				await expect.element(contentAfter).toHaveTextContent(item.content);
				await expectOpen(itemEl.element(), trigger.element());
			}
		});
	});

	describe("Keyboard Navigation", () => {
		it("should focus the next item when `ArrowDown` key is pressed", async () => {
			const t = setupMultiple();

			t.triggerEls[0]?.focus();
			await t.user.keyboard(kbd.ARROW_DOWN);
			await expect.element(t.triggerEls[1]).toHaveFocus();
			await t.user.keyboard(kbd.ARROW_DOWN);
			await expect.element(t.triggerEls[2]).toHaveFocus();
			await t.user.keyboard(kbd.ARROW_DOWN);
			await expect.element(t.triggerEls[3]).toHaveFocus();
			await t.user.keyboard(kbd.ARROW_DOWN);
			await expect.element(t.triggerEls[0]).toHaveFocus();
		});

		it("should focus the previous item when the `ArrowUp` key is pressed", async () => {
			const t = setupMultiple();

			t.triggerEls[0]?.focus();
			await t.user.keyboard(kbd.ARROW_UP);
			await expect.element(t.triggerEls[3]).toHaveFocus();
			await t.user.keyboard(kbd.ARROW_UP);
			await expect.element(t.triggerEls[2]).toHaveFocus();
			await t.user.keyboard(kbd.ARROW_UP);
			await expect.element(t.triggerEls[1]).toHaveFocus();
			await t.user.keyboard(kbd.ARROW_UP);
			await expect.element(t.triggerEls[0]).toHaveFocus();
		});

		it("should focus the first item when the `Home` key is pressed", async () => {
			const t = setupMultiple();

			for (const trigger of t.triggerEls) {
				trigger.focus();
				await t.user.keyboard(kbd.HOME);
				await expect.element(t.triggerEls[0]).toHaveFocus();
			}
		});

		it("should focus the last item when the `End` key is pressed", async () => {
			const t = setupMultiple();

			for (const trigger of t.triggerEls) {
				trigger.focus();
				await t.user.keyboard(kbd.END);
				await expect.element(t.triggerEls[3]).toHaveFocus();
			}
		});

		it("should respect the `disabled` prop for items", async () => {
			const t = setupMultiple({ items: ITEMS_WITH_DISABLED });

			await t.user.click(t.triggerEls[0]);
			await t.user.keyboard(kbd.ARROW_DOWN);
			await expect.element(t.triggerEls[1]).not.toHaveFocus();
			await expect.element(t.triggerEls[2]).toHaveFocus();
		});
	});

	describe("Props and Bindings", () => {
		it("should disable everything when the `disabled` prop is true", async () => {
			const t = setupMultiple({ items: ITEMS, disabled: true });

			await expectClosed(t.triggerEls[0]);
			await expectDisabled(t.triggerEls[0]);
			await expectClosed(t.triggerEls[1]);
			await expectDisabled(t.triggerEls[1]);
			await expectClosed(t.triggerEls[2]);
			await expectDisabled(t.triggerEls[2]);
		});

		it("should respect the `level` prop for headers", async () => {
			const itemsWithLevel = ITEMS.map((item, i) =>
				i === 0 ? ({ ...item, level: 1 } as const) : item
			);
			setupMultiple({ items: itemsWithLevel });

			const headers = ITEMS.map((item) => page.getByTestId(`${item.value}-header`));
			await expect.element(headers[0]).toHaveAttribute("data-heading-level", "1");
			await expect.element(headers[0]).toHaveAttribute("aria-level", "1");
			await expect.element(headers[1]).toHaveAttribute("data-heading-level", "3");
			await expect.element(headers[1]).toHaveAttribute("aria-level", "3");
		});

		it("should update the `bind:value` prop when the value changes", async () => {
			render(AccordionMultiTestControlled, {
				items: ITEMS,
			});
			const trigger = page.getByTestId("item-0-trigger");
			const value = page.getByTestId("value");

			await expect.element(value).toHaveTextContent("");
			await trigger.click();
			await expect.element(page.getByTestId("value").element()).toHaveTextContent("item-0");
		});

		it('should handle programmatic changes to the "value" prop', async () => {
			render(AccordionMultiTestControlled, { items: ITEMS });
			const updateButton = page.getByTestId("update-value");
			const value = page.getByTestId("value");

			await expect.element(value).toHaveTextContent("");
			const itemOneItem = page.getByTestId("item-1-item").element();
			await expectClosed(itemOneItem);
			await updateButton.click();
			await expectOpen(itemOneItem);
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
