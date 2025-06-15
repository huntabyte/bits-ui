import { page, userEvent } from "@vitest/browser/context";
import { describe, expect, it, vi } from "vitest";
import { render } from "vitest-browser-svelte";
import type { Component } from "svelte";
import type { Collapsible } from "bits-ui";
import CollapsibleTest from "./collapsible-test.svelte";
import CollapsibleForceMountTest from "./collapsible-force-mount-test.svelte";

function setup(
	props: Collapsible.RootProps & { withOpenCheck?: boolean } = {},
	component: Component = CollapsibleTest
) {
	const user = userEvent;
	const returned = render(component, props);
	const root = page.getByTestId("root");
	const trigger = page.getByTestId("trigger");
	const content = page.getByTestId("content");
	const binding = page.getByTestId("binding");
	return { ...returned, root, trigger, content, binding, user };
}

describe("Collapsible ", () => {
	describe("Data Attributes", () => {
		it("should have bits data attrs", async () => {
			const t = setup();
			expect(t.root).toHaveAttribute("data-collapsible-root");
			expect(t.trigger).toHaveAttribute("data-collapsible-trigger");
			expect(t.content).toHaveAttribute("data-collapsible-content");
		});
	});

	describe("State and Interaction", () => {
		it("should hide content when `open` is false", async () => {
			const t = setup();
			expect(t.root).not.toBeNull();
			expect(t.trigger).not.toBeNull();
			expect(t.content).not.toBeVisible();
		});

		it("should toggle the `open` state when clicked", async () => {
			const t = setup();
			expect(t.content).not.toBeVisible();
			await t.user.click(t.trigger);
			expect(t.content).toBeVisible();
			await t.user.click(t.trigger);
			expect(t.content).not.toBeVisible();
		});
	});

	describe("Props and Events", () => {
		it("should respect binds to the `open` prop", async () => {
			const t = setup({ open: false });
			expect(t.binding).toHaveTextContent("false");
			await t.user.click(t.trigger);
			expect(t.binding).toHaveTextContent("true");
			const altTrigger = t.getByTestId("alt-trigger");
			await t.user.click(altTrigger);
			expect(t.binding).toHaveTextContent("false");
		});

		it("should call `onOpenChange` when the open state changes", async () => {
			const mock = vi.fn();
			const t = setup({ onOpenChange: mock });
			await t.user.click(t.trigger);
			expect(mock).toHaveBeenCalledWith(true);
			await t.user.click(t.trigger);
			expect(mock).toHaveBeenCalledWith(false);
		});
	});

	describe("Force Mount Behavior", () => {
		it("should forceMount the content when `forceMount` is true", async () => {
			const t = setup({ withOpenCheck: false }, CollapsibleForceMountTest);
			const content = t.getByTestId("content");
			expect(content).toBeVisible();
		});

		it("should forceMount the content when `forceMount` is true and the `open` snippet prop is used", async () => {
			const t = setup({ withOpenCheck: true }, CollapsibleForceMountTest);
			expect(() => page.getByTestId("content").element()).toThrow();
			await t.user.click(t.trigger);
			const content = t.getByTestId("content");
			expect(content).toBeVisible();
		});
	});
});
