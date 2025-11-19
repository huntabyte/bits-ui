import { page } from "@vitest/browser/context";
import { expect, it } from "vitest";
import { render } from "vitest-browser-svelte";
import type { ComponentProps } from "svelte";
import CommandScrollTest from "./command-scroll-test.svelte";

function setup(props: Partial<ComponentProps<typeof CommandScrollTest>> = {}) {
	// oxlint-disable-next-line no-explicit-any
	const returned = render(CommandScrollTest, props as any);
	const input = page.getByTestId("input");
	const root = page.getByTestId("root");
	const list = page.getByTestId("list");
	const viewport = page.getByTestId("viewport");
	return {
		...returned,
		root,
		input,
		list,
		viewport,
	};
}

it("should scroll initial value into view when it's not the first item", async () => {
	setup({ value: "Popover" });

	const item = page.getByText("Popover");
	await expect.element(item).toHaveAttribute("data-selected");

	// check that the item is visible in the viewport
	const itemElement = item.element() as HTMLElement;
	const viewport = page.getByTestId("viewport").element() as HTMLElement;

	// wait for any scroll animations to complete
	await new Promise((resolve) => setTimeout(resolve, 150));

	const itemRect = itemElement.getBoundingClientRect();
	const viewportRect = viewport.getBoundingClientRect();

	// verify the selected item is within the viewport bounds
	expect(itemRect.top).toBeGreaterThanOrEqual(viewportRect.top - 1); // allow 1px tolerance
	expect(itemRect.bottom).toBeLessThanOrEqual(viewportRect.bottom + 1); // allow 1px tolerance
});

it("should scroll initial value in the middle of the list into view", async () => {
	setup({ value: "Radio Group" });

	const item = page.getByText("Radio Group");
	await expect.element(item).toHaveAttribute("data-selected");

	const itemElement = item.element() as HTMLElement;
	const viewport = page.getByTestId("viewport").element() as HTMLElement;

	// wait for any scroll animations to complete
	await new Promise((resolve) => setTimeout(resolve, 150));

	const itemRect = itemElement.getBoundingClientRect();
	const viewportRect = viewport.getBoundingClientRect();

	// verify the selected item is within the viewport bounds
	expect(itemRect.top).toBeGreaterThanOrEqual(viewportRect.top - 1);
	expect(itemRect.bottom).toBeLessThanOrEqual(viewportRect.bottom + 1);
});

it("should respect disableInitialScroll prop and not scroll", async () => {
	setup({ value: "Popover", disableInitialScroll: true });

	const item = page.getByText("Popover");
	await expect.element(item).toHaveAttribute("data-selected");

	const viewport = page.getByTestId("viewport").element() as HTMLElement;

	// wait a bit to ensure no scrolling happens
	await new Promise((resolve) => setTimeout(resolve, 150));

	// with disableInitialScroll, viewport should remain at the top
	expect(viewport.scrollTop).toBe(0);
});

it("should not scroll when initial value is the first item", async () => {
	setup({ value: "Introduction" });

	const item = page.getByText("Introduction");
	await expect.element(item).toHaveAttribute("data-selected");

	const viewport = page.getByTestId("viewport").element() as HTMLElement;

	// wait a bit
	await new Promise((resolve) => setTimeout(resolve, 150));

	// viewport should remain at the top since first item is already visible
	expect(viewport.scrollTop).toBe(0);
});
