import { page, userEvent, type Locator } from "@vitest/browser/context";
import { describe, expect, it, vi } from "vitest";
import { render } from "vitest-browser-svelte";
import AccordionSingleTest from "./accordion-single-test.svelte";
import AccordionMultiTest from "./accordion-multi-test.svelte";
import AccordionTestIsolated from "./accordion-test-isolated.svelte";
import AccordionSingleTestControlledSvelte from "./accordion-single-test-controlled.svelte";
import AccordionMultiTestControlled from "./accordion-multi-test-controlled.svelte";
import AccordionSingleForceMountTest from "./accordion-single-force-mount-test.svelte";
import AccordionHiddenUntilFoundTest from "./accordion-hidden-until-found-test.svelte";
import AccordionMultiHiddenUntilFoundTest from "./accordion-multi-hidden-until-found-test.svelte";
import type { ComponentProps } from "svelte";
import { getTestKbd } from "../utils.js";
import { expectNotExists } from "../browser-utils";

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
	// oxlint-disable-next-line no-explicit-any
	render(AccordionSingleTest, { ...(props as any) });
	const itemEls = ITEMS.map((item) => page.getByTestId(`${item.value}-item`));
	const triggerEls = ITEMS.map((item) => page.getByTestId(`${item.value}-trigger`));
	return { itemEls, triggerEls };
}

function setupSingleForceMount(
	props: Partial<ComponentProps<typeof AccordionSingleForceMountTest>> = {
		items: ITEMS,
	}
) {
	// oxlint-disable-next-line no-explicit-any
	render(AccordionSingleForceMountTest, { ...(props as any) });
	const itemEls = ITEMS.map((item) => page.getByTestId(`${item.value}-item`));
	const triggerEls = ITEMS.map((item) => page.getByTestId(`${item.value}-trigger`));
	return { itemEls, triggerEls };
}

function setupMultiple(
	props: Partial<ComponentProps<typeof AccordionMultiTest>> = { items: ITEMS }
) {
	const user = userEvent;
	// oxlint-disable-next-line no-explicit-any
	const returned = render(AccordionMultiTest, { ...(props as any) });
	const itemEls = ITEMS.map((item) => returned.getByTestId(`${item.value}-item`));
	const triggerEls = ITEMS.map((item) => returned.getByTestId(`${item.value}-trigger`));
	return { user, itemEls, triggerEls, ...returned };
}

async function expectOpen(...itemEls: Locator[]) {
	for (const itemEl of itemEls) {
		await expect.element(itemEl).toHaveAttribute("data-state", "open");
	}
}

async function expectClosed(...itemEls: Locator[]) {
	for (const itemEl of itemEls) {
		await expect.element(itemEl).toHaveAttribute("data-state", "closed");
	}
}

async function expectDisabled(...triggerEls: Locator[]) {
	for (const triggerEl of triggerEls) {
		await expect.element(triggerEl).toHaveAttribute("data-disabled");
	}
}

async function expectNotDisabled(...triggerEls: Locator[]) {
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

	it("should respect custom tabindex on trigger", async () => {
		render(AccordionTestIsolated, { triggerProps: { tabindex: -1 } });
		const trigger = page.getByTestId("trigger");
		await expect.element(trigger).toHaveAttribute("tabindex", "-1");
	});

	it("should have default tabindex of 0 on trigger", async () => {
		render(AccordionTestIsolated);
		const trigger = page.getByTestId("trigger");
		await expect.element(trigger).toHaveAttribute("tabindex", "0");
	});
});

describe("type='single'", () => {
	describe("Expansion Behavior", () => {
		it("should have expected data attributes", async () => {
			const t = setupSingle({ items: ITEMS_WITH_DISABLED });

			await expectClosed(t.itemEls[0], t.triggerEls[0]);
			await expectNotDisabled(t.itemEls[0], t.triggerEls[0]);

			await t.triggerEls[0].click();

			await expectOpen(t.itemEls[0], t.triggerEls[0]);
			await expectDisabled(t.itemEls[1], t.triggerEls[1]);
		});

		it("should display content when an item is expanded", async () => {
			setupSingle();

			for (const item of ITEMS) {
				const trigger = page.getByTestId(`${item.value}-trigger`);
				const content = page.getByTestId(`${item.value}-content`);
				const itemEl = page.getByTestId(`${item.value}-item`);
				await expectClosed(itemEl, trigger);
				await expect.element(content).not.toBeVisible();
				await trigger.click();
				const contentAfter = page.getByTestId(`${item.value}-content`);
				await expect.element(contentAfter).toHaveTextContent(item.content);
				await expectOpen(itemEl, trigger);
			}
		});

		it("should expand only one item at a time", async () => {
			setupSingle();

			for (const item of ITEMS) {
				const trigger = page.getByTestId(`${item.value}-trigger`);
				const content = page.getByTestId(`${item.value}-content`);
				const itemEl = page.getByTestId(`${item.value}-item`);
				await expectClosed(itemEl, trigger);
				await expect.element(content).not.toBeVisible();
				await trigger.click();
				const contentAfter = page.getByTestId(`${item.value}-content`);
				await expect.element(contentAfter).toHaveTextContent(item.content);
				await expectOpen(itemEl, trigger);
			}
			const openItems = Array.from(
				document.querySelectorAll("[data-state='open'][data-accordion-item]")
			);
			expect(openItems.length).toBe(1);
		});

		it.each([kbd.ENTER, kbd.SPACE])(
			`should expand when the trigger is focused and "%s" key is pressed`,
			async (key) => {
				setupSingle();

				for (const item of ITEMS) {
					const trigger = page.getByTestId(`${item.value}-trigger`);
					const content = page.getByTestId(`${item.value}-content`);
					const itemEl = page.getByTestId(`${item.value}-item`);
					await expectClosed(itemEl, trigger);
					await expect.element(content).not.toBeVisible();
					(trigger.element() as HTMLElement).focus();
					await userEvent.keyboard(key);
					const contentAfter = page.getByTestId(`${item.value}-content`);
					await expect.element(contentAfter).toHaveTextContent(item.content);
					await expectOpen(itemEl, trigger);
				}
			}
		);
	});

	describe("Keyboard Navigation", () => {
		it("should focus the next item when `ArrowDown` key is pressed", async () => {
			const t = setupSingle();

			(t.triggerEls[0].element() as HTMLElement).focus();
			await userEvent.keyboard(kbd.ARROW_DOWN);
			await expect.element(t.triggerEls[1]).toHaveFocus();
			await userEvent.keyboard(kbd.ARROW_DOWN);
			await expect.element(t.triggerEls[2]).toHaveFocus();
			await userEvent.keyboard(kbd.ARROW_DOWN);
			await expect.element(t.triggerEls[3]).toHaveFocus();
			await userEvent.keyboard(kbd.ARROW_DOWN);
			await expect.element(t.triggerEls[0]).toHaveFocus();
		});

		it("should focus the previous item when the `ArrowUp` key is pressed", async () => {
			const t = setupSingle();

			(t.triggerEls[0].element() as HTMLElement).focus();
			await userEvent.keyboard(kbd.ARROW_UP);
			await expect.element(t.triggerEls[3]).toHaveFocus();
			await userEvent.keyboard(kbd.ARROW_UP);
			await expect.element(t.triggerEls[2]).toHaveFocus();
			await userEvent.keyboard(kbd.ARROW_UP);
			await expect.element(t.triggerEls[1]).toHaveFocus();
			await userEvent.keyboard(kbd.ARROW_UP);
			await expect.element(t.triggerEls[0]).toHaveFocus();
		});

		it("should focus the first item when the `Home` key is pressed", async () => {
			const t = setupSingle();

			for (const trigger of t.triggerEls) {
				(trigger.element() as HTMLElement).focus();
				await userEvent.keyboard(kbd.HOME);
				await expect.element(t.triggerEls[0]).toHaveFocus();
			}
		});

		it("should focus the last item when the `End` key is pressed", async () => {
			const t = setupSingle();

			for (const trigger of t.triggerEls) {
				(trigger.element() as HTMLElement).focus();
				await userEvent.keyboard(kbd.END);
				await expect.element(t.triggerEls[3]).toHaveFocus();
			}
		});

		it("should skip over disabled items when navigating with Arrow Keys", async () => {
			const t = setupSingle({ items: ITEMS_WITH_DISABLED });

			(t.triggerEls[0].element() as HTMLElement).focus();
			await userEvent.keyboard(kbd.ARROW_DOWN);
			await expect.element(t.triggerEls[1]).not.toHaveFocus();
			await expect.element(t.triggerEls[2]).toHaveFocus();
		});

		it("should loop through the items when the `loop` prop is true", async () => {
			const t = setupSingle({ items: ITEMS, loop: true });

			(t.triggerEls[0].element() as HTMLElement).focus();
			await userEvent.keyboard(kbd.ARROW_UP);
			await expect.element(t.triggerEls[3]).toHaveFocus();
			await userEvent.keyboard(kbd.ARROW_DOWN);
			await expect.element(t.triggerEls[0]).toHaveFocus();
		});

		it("should not loop through the items when the `loop` prop is false", async () => {
			const t = setupSingle({ items: ITEMS, loop: false });

			(t.triggerEls[0].element() as HTMLElement).focus();
			await userEvent.keyboard(kbd.ARROW_UP);
			await expect.element(t.triggerEls[3]).not.toHaveFocus();
			await expect.element(t.triggerEls[0]).toHaveFocus();
			await userEvent.keyboard(kbd.ARROW_DOWN);
			await expect.element(t.triggerEls[1]).toHaveFocus();
		});

		it("should navigate using ArrowLeft/Right when `orientation` is `horizontal`", async () => {
			const t = setupSingle({
				items: ITEMS,
				orientation: "horizontal",
			});

			(t.triggerEls[0].element() as HTMLElement).focus();
			await userEvent.keyboard(kbd.ARROW_LEFT);
			await expect.element(t.triggerEls[3]).toHaveFocus();
			await userEvent.keyboard(kbd.ARROW_RIGHT);
			await expect.element(t.triggerEls[0]).toHaveFocus();
		});

		it("should loop using ArrowLeft/Right when `orientation` is `horizontal` and `loop` is true", async () => {
			const t = setupSingle({
				items: ITEMS,
				orientation: "horizontal",
				loop: true,
			});

			(t.triggerEls[0].element() as HTMLElement).focus();
			await userEvent.keyboard(kbd.ARROW_LEFT);
			await expect.element(t.triggerEls[3]).toHaveFocus();
			await userEvent.keyboard(kbd.ARROW_RIGHT);
			await expect.element(t.triggerEls[0]).toHaveFocus();
		});

		it("should not loop using ArrowLeft/Right when `orientation` is `horizontal` and `loop` is false", async () => {
			const t = setupSingle({
				items: ITEMS,
				orientation: "horizontal",
				loop: false,
			});

			(t.triggerEls[0].element() as HTMLElement).focus();
			await userEvent.keyboard(kbd.ARROW_LEFT);
			await expect.element(t.triggerEls[3]).not.toHaveFocus();
			await expect.element(t.triggerEls[0]).toHaveFocus();
			await userEvent.keyboard(kbd.ARROW_RIGHT);
			await expect.element(t.triggerEls[1]).toHaveFocus();
		});
	});

	describe("Props and Bindings", () => {
		it("should forceMount the content when `forceMount` is true", async () => {
			setupSingleForceMount({
				items: ITEMS_WITH_DISABLED,
			});
			const contentEls = ITEMS.map((item) => page.getByTestId(`${item.value}-content`));
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
				await expectNotExists(page.getByTestId(`${item.value}-content`));
			}

			await t.triggerEls[0].click();
			const firstContentEl = page.getByTestId(`${ITEMS[0]!.value}-content`).element();
			await expect.element(firstContentEl).toBeVisible();
			await expectNotExists(page.getByTestId(`${ITEMS[1]!.value}-content`));
		});

		it("should disable everything when true on root", async () => {
			const t = setupSingle({ items: ITEMS, disabled: true });

			await userEvent.click(t.triggerEls[0], { force: true });
			await expectClosed(t.triggerEls[0]);
			await expectDisabled(t.triggerEls[0]);
			await userEvent.click(t.triggerEls[1], { force: true });
			await expectClosed(t.triggerEls[1]);
			await expectDisabled(t.triggerEls[1]);
			await userEvent.click(t.triggerEls[2], { force: true });
			await expectClosed(t.triggerEls[2]);
			await expectDisabled(t.triggerEls[2]);
		});

		it("should respect the `disabled` prop for items", async () => {
			const t = setupSingle({ items: ITEMS_WITH_DISABLED });

			await userEvent.click(t.triggerEls[0], { force: true });
			await expect.element(t.triggerEls[0]).toHaveFocus();
			await userEvent.keyboard(kbd.ARROW_DOWN);
			await expect.element(t.triggerEls[1]).not.toHaveFocus();
			await expect.element(t.triggerEls[2]).toHaveFocus();
		});

		it("should respect the `level` prop for headers", async () => {
			const itemsWithLevel = ITEMS.map((item, i) =>
				i === 0 ? ({ ...item, level: 1 } as const) : item
			);
			setupSingle({ items: itemsWithLevel });

			const headers = ITEMS.map((item) => page.getByTestId(`${item.value}-header`));
			await expect.element(headers[0]).toHaveAttribute("data-heading-level", "1");
			await expect.element(headers[0]).toHaveAttribute("aria-level", "1");
			await expect.element(headers[1]).toHaveAttribute("data-heading-level", "3");
			await expect.element(headers[1]).toHaveAttribute("aria-level", "3");
		});

		it("should update the `bind:value` prop when the value changes", async () => {
			render(AccordionSingleTestControlledSvelte, { items: ITEMS });
			const trigger = page.getByTestId("item-0-trigger");
			const value = page.getByTestId("value");

			await expect.element(value).toHaveTextContent("");
			await trigger.click();
			await expect.element(value).toHaveTextContent("item-0");
		});

		it('should handle programmatic changes to the "value" prop', async () => {
			render(AccordionSingleTestControlledSvelte, { items: ITEMS });
			const updateButton = page.getByTestId("update-value");
			const value = page.getByTestId("value");

			await expect.element(value).toHaveTextContent("");
			const itemOneItem = page.getByTestId("item-1-item");
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

			(t.triggerEls[0].element() as HTMLElement).focus();
			await userEvent.keyboard(kbd.ENTER);
			expect(mock).toHaveBeenCalledWith(ITEMS[0].value);
			await userEvent.keyboard(kbd.ARROW_DOWN);
			await userEvent.keyboard(kbd.ENTER);
			expect(mock).toHaveBeenCalledWith(ITEMS[1].value);
			await userEvent.keyboard(kbd.ENTER);
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
				await expectClosed(itemEl, trigger);
				await expect.element(content).not.toBeVisible();
				await trigger.click();
				const contentAfter = page.getByTestId(`${item.value}-content`);
				await expect.element(contentAfter).toHaveTextContent(item.content);
				await expectOpen(itemEl, trigger);
			}
		});

		it("should allow expanding multiple items", async () => {
			setupMultiple();

			for (const item of ITEMS) {
				const trigger = page.getByTestId(`${item.value}-trigger`);
				const content = page.getByTestId(`${item.value}-content`);
				const itemEl = page.getByTestId(`${item.value}-item`);
				await expectClosed(itemEl, trigger);
				await expect.element(content).not.toBeVisible();
				await trigger.click();
				const contentAfter = page.getByTestId(`${item.value}-content`);
				await expect.element(contentAfter).toHaveTextContent(item.content);
				await expectOpen(itemEl, trigger);
			}
			const openItems = Array.from(
				document.querySelectorAll("[data-state='open'][data-accordion-item]")
			);
			expect(openItems.length).toBe(4);
		});

		it("should expand when the trigger is focused and `Enter` key is pressed", async () => {
			setupMultiple();

			for (const item of ITEMS) {
				const trigger = page.getByTestId(`${item.value}-trigger`);
				const content = page.getByTestId(`${item.value}-content`);
				const itemEl = page.getByTestId(`${item.value}-item`);
				await expectClosed(itemEl, trigger);
				await expect.element(content).not.toBeVisible();
				(trigger.element() as HTMLElement).focus();
				await userEvent.keyboard(kbd.ENTER);
				const contentAfter = page.getByTestId(`${item.value}-content`);
				await expect.element(contentAfter).toHaveTextContent(item.content);
				await expectOpen(itemEl, trigger);
			}
		});

		it("should expand when the trigger is focused and `Space` key is pressed", async () => {
			setupMultiple();

			for (const item of ITEMS) {
				const trigger = page.getByTestId(`${item.value}-trigger`);
				const content = page.getByTestId(`${item.value}-content`);
				const itemEl = page.getByTestId(`${item.value}-item`);
				await expectClosed(itemEl, trigger);
				await expect.element(content).not.toBeVisible();
				(trigger.element() as HTMLElement).focus();
				await userEvent.keyboard(kbd.SPACE);
				const contentAfter = page.getByTestId(`${item.value}-content`);
				await expect.element(contentAfter).toHaveTextContent(item.content);
				await expectOpen(itemEl, trigger);
			}
		});
	});

	describe("Keyboard Navigation", () => {
		it("should focus the next item when `ArrowDown` key is pressed", async () => {
			const t = setupMultiple();

			(t.triggerEls[0].element() as HTMLElement).focus();
			await userEvent.keyboard(kbd.ARROW_DOWN);
			await expect.element(t.triggerEls[1]).toHaveFocus();
			await userEvent.keyboard(kbd.ARROW_DOWN);
			await expect.element(t.triggerEls[2]).toHaveFocus();
			await userEvent.keyboard(kbd.ARROW_DOWN);
			await expect.element(t.triggerEls[3]).toHaveFocus();
			await userEvent.keyboard(kbd.ARROW_DOWN);
			await expect.element(t.triggerEls[0]).toHaveFocus();
		});

		it("should focus the previous item when the `ArrowUp` key is pressed", async () => {
			const t = setupMultiple();

			(t.triggerEls[0].element() as HTMLElement).focus();
			await userEvent.keyboard(kbd.ARROW_UP);
			await expect.element(t.triggerEls[3]).toHaveFocus();
			await userEvent.keyboard(kbd.ARROW_UP);
			await expect.element(t.triggerEls[2]).toHaveFocus();
			await userEvent.keyboard(kbd.ARROW_UP);
			await expect.element(t.triggerEls[1]).toHaveFocus();
			await userEvent.keyboard(kbd.ARROW_UP);
			await expect.element(t.triggerEls[0]).toHaveFocus();
		});

		it("should focus the first item when the `Home` key is pressed", async () => {
			const t = setupMultiple();

			for (const trigger of t.triggerEls) {
				(trigger.element() as HTMLElement).focus();
				await userEvent.keyboard(kbd.HOME);
				await expect.element(t.triggerEls[0]).toHaveFocus();
			}
		});

		it("should focus the last item when the `End` key is pressed", async () => {
			const t = setupMultiple();

			for (const trigger of t.triggerEls) {
				(trigger.element() as HTMLElement).focus();
				await userEvent.keyboard(kbd.END);
				await expect.element(t.triggerEls[3]).toHaveFocus();
			}
		});

		it("should respect the `disabled` prop for items", async () => {
			const t = setupMultiple({ items: ITEMS_WITH_DISABLED });

			await t.triggerEls[0].click();
			await userEvent.keyboard(kbd.ARROW_DOWN);
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
			const itemOneItem = page.getByTestId("item-1-item");
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

			(t.triggerEls[0].element() as HTMLElement).focus();
			await userEvent.keyboard(kbd.ENTER);
			expect(mock).toHaveBeenCalledWith([ITEMS[0].value]);
			await userEvent.keyboard(kbd.ARROW_DOWN);
			await userEvent.keyboard(kbd.ENTER);
			expect(mock).toHaveBeenCalledWith([ITEMS[0].value, ITEMS[1].value]);
			await userEvent.keyboard(kbd.ENTER);
			expect(mock).toHaveBeenCalledWith([ITEMS[0].value]);
			await userEvent.keyboard(kbd.ARROW_UP);
			await userEvent.keyboard(kbd.ENTER);
			expect(mock).toHaveBeenCalledWith([]);
		});
	});
});

describe("Hidden Until Found Behavior", () => {
	function setupHiddenUntilFound(
		props: {
			value?: string;
			hiddenUntilFound?: boolean;
			items?: Item[];
			onValueChange?: (v: string) => void;
		} = {}
	) {
		const defaultItems = ITEMS.slice(0, 1); // use just one item for simplicity
		render(AccordionHiddenUntilFoundTest, {
			items: defaultItems,
			...props,
		});
		const root = page.getByTestId("root");
		const item = defaultItems[0];
		const trigger = page.getByTestId(`${item.value}-trigger`);
		const content = page.getByTestId(`${item.value}-content`);
		const searchableContent = page.getByTestId(`${item.value}-searchable-content`);
		const nestedContent = page.getByTestId(`${item.value}-nested-content`);
		const binding = page.getByTestId("binding");
		return {
			root,
			trigger,
			content,
			searchableContent,
			nestedContent,
			binding,
			item,
		};
	}

	it("should render content with hidden='until-found' when closed and hiddenUntilFound is true", async () => {
		const t = setupHiddenUntilFound({ value: "", hiddenUntilFound: true });
		await expect.element(t.content).toHaveAttribute("hidden", "until-found");
		await expect.element(t.binding).toHaveTextContent("");
	});

	it("should not have hidden='until-found' when hiddenUntilFound is false", async () => {
		const t = setupHiddenUntilFound({ value: "", hiddenUntilFound: false });
		await expect.element(t.content).toHaveAttribute("hidden");
		await expect.element(t.binding).toHaveTextContent("");
	});

	it("should open accordion when beforematch event is triggered", async () => {
		const t = setupHiddenUntilFound({ value: "", hiddenUntilFound: true });
		await expect.element(t.content).toHaveAttribute("hidden", "until-found");

		// simulate the beforematch event that browsers fire when content is found during search
		const beforeMatchEvent = new Event("beforematch", { bubbles: true });
		t.content.element().dispatchEvent(beforeMatchEvent);

		await new Promise((resolve) => setTimeout(resolve, 10));

		await expect.element(t.content).not.toHaveAttribute("hidden");
	});

	it("should call onValueChange when beforematch event opens the accordion", async () => {
		const mock = vi.fn();
		const t = setupHiddenUntilFound({
			value: "",
			hiddenUntilFound: true,
			onValueChange: mock,
		});

		const beforeMatchEvent = new Event("beforematch", { bubbles: true });
		t.content.element().dispatchEvent(beforeMatchEvent);

		// wait for state to update
		await new Promise((resolve) => setTimeout(resolve, 10));

		expect(mock).toHaveBeenCalledWith(t.item.value);
	});

	it("should not trigger value change when already open and beforematch is fired", async () => {
		const mock = vi.fn();
		const t = setupHiddenUntilFound({
			value: ITEMS[0].value, // accordion should already be open
			hiddenUntilFound: true,
			onValueChange: mock,
		});

		const beforeMatchEvent = new Event("beforematch", { bubbles: true });
		t.content.element().dispatchEvent(beforeMatchEvent);

		await new Promise((resolve) => setTimeout(resolve, 10));

		expect(mock).not.toHaveBeenCalled();
	});

	it("should maintain hidden='until-found' after closing when hiddenUntilFound is true", async () => {
		const t = setupHiddenUntilFound({ value: "", hiddenUntilFound: true });

		await t.trigger.click();
		await t.trigger.click();
		await expect.element(t.content).toHaveAttribute("hidden", "until-found");
	});

	describe("type='multiple'", () => {
		function setupMultipleHiddenUntilFound(
			props: {
				value?: string[];
				hiddenUntilFound?: boolean;
				items?: Item[];
				onValueChange?: (v: string[]) => void;
			} = {}
		) {
			const defaultItems = ITEMS.slice(0, 2); // use two items for multiple testing
			render(AccordionMultiHiddenUntilFoundTest, {
				items: defaultItems,
				...props,
			});
			const root = page.getByTestId("root");
			const items = defaultItems.map((item) => ({
				item,
				trigger: page.getByTestId(`${item.value}-trigger`),
				content: page.getByTestId(`${item.value}-content`),
				searchableContent: page.getByTestId(`${item.value}-searchable-content`),
				nestedContent: page.getByTestId(`${item.value}-nested-content`),
			}));
			const binding = page.getByTestId("binding");
			return {
				root,
				items,
				binding,
			};
		}

		it("should render content with hidden='until-found' when closed and hiddenUntilFound is true", async () => {
			const t = setupMultipleHiddenUntilFound({ value: [], hiddenUntilFound: true });
			await expect.element(t.items[0].content).toHaveAttribute("hidden", "until-found");
			await expect.element(t.items[1].content).toHaveAttribute("hidden", "until-found");
			await expect.element(t.binding).toHaveTextContent("[]");
		});

		it("should not have hidden='until-found' when hiddenUntilFound is false", async () => {
			const t = setupMultipleHiddenUntilFound({ value: [], hiddenUntilFound: false });
			await expect.element(t.items[0].content).toHaveAttribute("hidden", "");
			await expect.element(t.items[1].content).toHaveAttribute("hidden", "");
			await expect.element(t.binding).toHaveTextContent("[]");
		});

		it("should open accordion item when beforematch event is triggered on first item", async () => {
			const t = setupMultipleHiddenUntilFound({ value: [], hiddenUntilFound: true });
			await expect.element(t.binding).toHaveTextContent("[]");
			await expect.element(t.items[0].content).toHaveAttribute("hidden", "until-found");

			// simulate the beforematch event that browsers fire when content is found during search
			const beforeMatchEvent = new Event("beforematch", { bubbles: true });
			t.items[0].content.element().dispatchEvent(beforeMatchEvent);

			// wait for requestAnimationFrame and state update
			await new Promise((resolve) => setTimeout(resolve, 10));

			await expect.element(t.binding).toHaveTextContent(`["${t.items[0].item.value}"]`);
		});

		it("should open accordion item when beforematch event is triggered on second item", async () => {
			const t = setupMultipleHiddenUntilFound({ value: [], hiddenUntilFound: true });
			await expect.element(t.binding).toHaveTextContent("[]");
			await expect.element(t.items[1].content).toHaveAttribute("hidden", "until-found");

			// simulate the beforematch event that browsers fire when content is found during search
			const beforeMatchEvent = new Event("beforematch", { bubbles: true });
			t.items[1].content.element().dispatchEvent(beforeMatchEvent);

			await expect.element(t.binding).toHaveTextContent(`["${t.items[1].item.value}"]`);
		});

		it("should call onValueChange when beforematch event opens an accordion item", async () => {
			const mock = vi.fn();
			const t = setupMultipleHiddenUntilFound({
				value: [],
				hiddenUntilFound: true,
				onValueChange: mock,
			});

			const beforeMatchEvent = new Event("beforematch", { bubbles: true });
			t.items[0].content.element().dispatchEvent(beforeMatchEvent);

			await new Promise((resolve) => setTimeout(resolve, 10));

			expect(mock).toHaveBeenCalledWith([t.items[0].item.value]);
		});

		it("should not trigger value change when already open and beforematch is fired", async () => {
			const mock = vi.fn();
			const firstItemValue = ITEMS[0].value;
			const t = setupMultipleHiddenUntilFound({
				value: [firstItemValue],
				hiddenUntilFound: true,
				onValueChange: mock,
			});

			const beforeMatchEvent = new Event("beforematch", { bubbles: true });
			t.items[0].content.element().dispatchEvent(beforeMatchEvent);

			expect(mock).not.toHaveBeenCalled();
		});

		it("should maintain hidden='until-found' after closing when hiddenUntilFound is true", async () => {
			const t = setupMultipleHiddenUntilFound({ value: [], hiddenUntilFound: true });

			await t.items[0].trigger.click();
			await t.items[0].trigger.click();
			await expect.element(t.items[0].content).toHaveAttribute("hidden", "until-found");
		});

		it("should allow multiple items to be opened via beforematch events", async () => {
			const t = setupMultipleHiddenUntilFound({ value: [], hiddenUntilFound: true });
			await expect.element(t.binding).toHaveTextContent("[]");

			// trigger beforematch on first item
			const beforeMatchEvent1 = new Event("beforematch", { bubbles: true });
			t.items[0].content.element().dispatchEvent(beforeMatchEvent1);

			await expect.element(t.binding).toHaveTextContent(`["${t.items[0].item.value}"]`);

			// trigger beforematch on second item
			const beforeMatchEvent2 = new Event("beforematch", { bubbles: true });
			t.items[1].content.element().dispatchEvent(beforeMatchEvent2);

			await expect
				.element(t.binding)
				.toHaveTextContent(`["${t.items[0].item.value}","${t.items[1].item.value}"]`);
		});
	});
});
