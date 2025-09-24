import { page } from "@vitest/browser/context";
import { describe, expect, it, vi } from "vitest";
import { render } from "vitest-browser-svelte";
import type { Component } from "svelte";
import type { Collapsible } from "bits-ui";
import CollapsibleTest from "./collapsible-test.svelte";
import CollapsibleForceMountTest from "./collapsible-force-mount-test.svelte";
import CollapsibleHiddenUntilFoundTest from "./collapsible-hidden-until-found-test.svelte";
import { expectExists, expectNotExists } from "../browser-utils";

function setup(
	props: Collapsible.RootProps & { withOpenCheck?: boolean } = {},
	component: Component = CollapsibleTest
) {
	render(component, props);
	const root = page.getByTestId("root");
	const trigger = page.getByTestId("trigger");
	const content = page.getByTestId("content");
	const binding = page.getByTestId("binding");
	return { root, trigger, content, binding };
}

describe("Collapsible ", () => {
	describe("Data Attributes", () => {
		it("should have bits data attrs", async () => {
			const t = setup();
			await expect.element(t.root).toHaveAttribute("data-collapsible-root");
			await expect.element(t.trigger).toHaveAttribute("data-collapsible-trigger");
			await expect.element(t.content).toHaveAttribute("data-collapsible-content");
		});
	});

	describe("State and Interaction", () => {
		it("should hide content when `open` is false", async () => {
			const t = setup();
			await expectExists(t.root);
			await expectExists(t.trigger);
			await expect.element(t.content).not.toBeVisible();
		});

		it("should toggle the `open` state when clicked", async () => {
			const t = setup();
			await expect.element(t.content).not.toBeVisible();
			await t.trigger.click();
			await expect.element(t.content).toBeVisible();
			await t.trigger.click();
			await expect.element(t.content).not.toBeVisible();
		});
	});

	describe("Props and Events", () => {
		it("should respect binds to the `open` prop", async () => {
			const t = setup({ open: false });
			await expect.element(t.binding).toHaveTextContent("false");
			await t.trigger.click();
			await expect.element(t.binding).toHaveTextContent("true");
			const altTrigger = page.getByTestId("alt-trigger");
			await altTrigger.click();
			await expect.element(t.binding).toHaveTextContent("false");
		});

		it("should call `onOpenChange` when the open state changes", async () => {
			const mock = vi.fn();
			const t = setup({ onOpenChange: mock });
			await t.trigger.click();
			expect(mock).toHaveBeenCalledWith(true);
			await t.trigger.click();
			expect(mock).toHaveBeenCalledWith(false);
		});
	});

	describe("Force Mount Behavior", () => {
		it("should forceMount the content when `forceMount` is true", async () => {
			setup({ withOpenCheck: false }, CollapsibleForceMountTest);
			const content = page.getByTestId("content");
			await expect.element(content).toBeVisible();
		});

		it("should forceMount the content when `forceMount` is true and the `open` snippet prop is used", async () => {
			const t = setup({ withOpenCheck: true }, CollapsibleForceMountTest);
			await expectNotExists(page.getByTestId("content"));
			await t.trigger.click();
			const content = page.getByTestId("content");
			await expect.element(content).toBeVisible();
		});
	});

	describe("Hidden Until Found Behavior", () => {
		function setupHiddenUntilFound(
			props: Collapsible.RootProps & { hiddenUntilFound?: boolean } = {}
		) {
			render(CollapsibleHiddenUntilFoundTest, props);
			const root = page.getByTestId("root");
			const trigger = page.getByTestId("trigger");
			const content = page.getByTestId("content");
			const searchableContent = page.getByTestId("searchable-content");
			const nestedContent = page.getByTestId("nested-content");
			const binding = page.getByTestId("binding");
			return {
				root,
				trigger,
				content,
				searchableContent,
				nestedContent,
				binding,
			};
		}

		it("should render content with hidden='until-found' when closed and hiddenUntilFound is true", async () => {
			const t = setupHiddenUntilFound({ open: false, hiddenUntilFound: true });
			await expect.element(t.content).toHaveAttribute("hidden", "until-found");
			await expect.element(t.binding).toHaveTextContent("false");
		});

		it("should not have hidden='until-found' when hiddenUntilFound is false", async () => {
			const t = setupHiddenUntilFound({ open: false, hiddenUntilFound: false });
			await expect.element(t.content).toHaveAttribute("hidden", "");
			await expect.element(t.binding).toHaveTextContent("false");
		});

		it("should open collapsible when beforematch event is triggered", async () => {
			const t = setupHiddenUntilFound({ open: false, hiddenUntilFound: true });
			await expect.element(t.binding).toHaveTextContent("false");
			await expect.element(t.content).toHaveAttribute("hidden", "until-found");

			// simulate the beforematch event that browsers fire when content is found during search
			const beforeMatchEvent = new Event("beforematch", { bubbles: true });
			t.content.element().dispatchEvent(beforeMatchEvent);

			await expect.element(t.binding).toHaveTextContent("true");
		});

		it("should call onOpenChange when beforematch event opens the collapsible", async () => {
			const mock = vi.fn();
			const t = setupHiddenUntilFound({
				open: false,
				hiddenUntilFound: true,
				onOpenChange: mock,
			});

			const beforeMatchEvent = new Event("beforematch", { bubbles: true });
			t.content.element().dispatchEvent(beforeMatchEvent);

			// wait for state to update
			await new Promise((resolve) => setTimeout(resolve, 10));

			expect(mock).toHaveBeenCalledWith(true);
		});

		it("should not trigger open change when already open and beforematch is fired", async () => {
			const mock = vi.fn();
			const t = setupHiddenUntilFound({
				open: true,
				hiddenUntilFound: true,
				onOpenChange: mock,
			});

			const beforeMatchEvent = new Event("beforematch", { bubbles: true });
			t.content.element().dispatchEvent(beforeMatchEvent);

			await new Promise((resolve) => setTimeout(resolve, 10));

			expect(mock).not.toHaveBeenCalled();
		});

		it("should maintain hidden='until-found' after closing when hiddenUntilFound is true", async () => {
			const t = setupHiddenUntilFound({ open: false, hiddenUntilFound: true });

			await t.trigger.click();
			await t.trigger.click();
			await expect.element(t.content).toHaveAttribute("hidden", "until-found");
		});
	});
});
