import { page, userEvent } from "@vitest/browser/context";
import { describe, expect, it, vi } from "vitest";
import { render } from "vitest-browser-svelte";
import type { Component } from "svelte";
import type { Collapsible } from "bits-ui";
import CollapsibleTest from "./collapsible-test.svelte";
import CollapsibleForceMountTest from "./collapsible-force-mount-test.svelte";
import CollapsibleHiddenUntilFoundTest from "./collapsible-hidden-until-found-test.svelte";

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

	describe("Hidden Until Found Behavior", () => {
		function setupHiddenUntilFound(
			props: Collapsible.RootProps & { hiddenUntilFound?: boolean } = {}
		) {
			const user = userEvent;
			const returned = render(CollapsibleHiddenUntilFoundTest, props);
			const root = page.getByTestId("root");
			const trigger = page.getByTestId("trigger");
			const content = page.getByTestId("content");
			const searchableContent = page.getByTestId("searchable-content");
			const nestedContent = page.getByTestId("nested-content");
			const binding = page.getByTestId("binding");
			return {
				...returned,
				root,
				trigger,
				content,
				searchableContent,
				nestedContent,
				binding,
				user,
			};
		}

		it("should render content with hidden='until-found' when closed and hiddenUntilFound is true", async () => {
			const t = setupHiddenUntilFound({ open: false, hiddenUntilFound: true });
			expect(t.content).toHaveAttribute("hidden", "until-found");
			expect(t.binding).toHaveTextContent("false");
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

			await t.user.click(t.trigger);
			await t.user.click(t.trigger);
			await expect.element(t.content).toHaveAttribute("hidden", "until-found");
		});
	});
});
