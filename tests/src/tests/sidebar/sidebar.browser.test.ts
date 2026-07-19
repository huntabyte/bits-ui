import { page, userEvent } from "@vitest/browser/context";
import { describe, expect, it, vi } from "vitest";
import { render } from "vitest-browser-svelte";
import type { Sidebar } from "bits-ui";
import SidebarTest from "./sidebar-test.svelte";

type TestProps = Sidebar.ProviderProps & {
	collapsible?: Sidebar.SidebarCollapsible;
	customTrigger?: boolean;
	menuButtonDisabled?: boolean;
};

function setup(props: TestProps = {}) {
	render(SidebarTest, { isMobile: false, ...props });
	return {
		provider: page.getByTestId("provider"),
		root: page.getByTestId("root"),
		trigger: page.getByTestId("trigger"),
		rail: page.getByTestId("rail"),
		open: page.getByTestId("binding-open"),
		openMobile: page.getByTestId("binding-open-mobile"),
	};
}

describe("Sidebar", () => {
	describe("data attributes and semantics", () => {
		it("adds Bits UI data attributes to every composition part", async () => {
			setup();
			const parts = [
				"provider",
				"root",
				"trigger",
				"rail",
				"inset",
				"input",
				"header",
				"footer",
				"separator",
				"content",
				"group",
				"group-label",
				"group-action",
				"group-content",
				"menu",
				"menu-item",
				"menu-button",
				"menu-action",
				"menu-badge",
				"menu-skeleton",
				"menu-sub",
				"menu-sub-item",
				"menu-sub-button",
			] as const;

			for (const part of parts) {
				await expect
					.element(page.getByTestId(part))
					.toHaveAttribute(`data-sidebar-${part}`);
			}
		});

		it("exposes side, variant, collapse, active, and size state", async () => {
			const t = setup();
			await expect.element(t.root).toHaveAttribute("data-side", "right");
			await expect.element(t.root).toHaveAttribute("data-variant", "inset");
			await expect.element(t.root).toHaveAttribute("data-collapsible", "offcanvas");

			const menuButton = page.getByTestId("menu-button");
			await expect.element(menuButton).toHaveAttribute("data-active");
			await expect.element(menuButton).toHaveAttribute("data-size", "lg");
			await expect.element(menuButton).toHaveAttribute("data-variant", "outline");
			await expect.element(menuButton).toHaveAttribute("aria-current", "page");

			const subButton = page.getByTestId("menu-sub-button");
			await expect.element(subButton).toHaveAttribute("data-active");
			await expect.element(subButton).toHaveAttribute("data-size", "sm");
			await expect.element(subButton).toHaveAttribute("aria-current", "page");
		});

		it("uses semantic elements and button defaults", async () => {
			setup();
			await expect.element(page.getByTestId("menu")).toHaveProperty("tagName", "UL");
			await expect.element(page.getByTestId("menu-item")).toHaveProperty("tagName", "LI");
			await expect.element(page.getByTestId("inset")).toHaveProperty("tagName", "MAIN");
			await expect.element(page.getByTestId("input")).toHaveProperty("tagName", "INPUT");
			await expect
				.element(page.getByTestId("group-action"))
				.toHaveAttribute("type", "button");
			await expect.element(page.getByTestId("menu-action")).toHaveAttribute("type", "button");
			await expect.element(page.getByTestId("separator")).toHaveAttribute("role", "none");
			await expect
				.element(page.getByTestId("menu-skeleton"))
				.toHaveAttribute("aria-hidden", "true");
		});
	});

	describe("state and interaction", () => {
		it("starts expanded and connects the trigger to the sidebar", async () => {
			const t = setup();
			await expect.element(t.root).toHaveAttribute("data-state", "expanded");
			await expect.element(t.trigger).toHaveAttribute("aria-expanded", "true");
			await expect.element(t.trigger).toHaveAttribute("aria-controls", t.root.element().id);
		});

		it("toggles desktop state from the trigger, rail, and context API", async () => {
			const t = setup();
			await t.trigger.click();
			await expect.element(t.open).toHaveTextContent("false");
			await expect.element(t.root).toHaveAttribute("data-state", "collapsed");

			(t.rail.element() as HTMLButtonElement).click();
			await expect.element(t.open).toHaveTextContent("true");

			await page.getByTestId("context-trigger").click();
			await expect.element(page.getByTestId("context-state")).toHaveTextContent("collapsed");
		});

		it("respects binding changes from outside the provider", async () => {
			const t = setup();
			await page.getByTestId("binding-trigger").click();
			await expect.element(t.open).toHaveTextContent("false");
			await expect.element(t.trigger).toHaveAttribute("aria-expanded", "false");
		});

		it("calls onOpenChange when desktop state changes", async () => {
			const onOpenChange = vi.fn();
			const t = setup({ onOpenChange });
			await t.trigger.click();
			expect(onOpenChange).toHaveBeenCalledWith(false);
		});

		it("toggles mobile state without changing desktop state", async () => {
			const onOpenMobileChange = vi.fn();
			const t = setup({
				open: false,
				openMobile: false,
				isMobile: true,
				onOpenMobileChange,
			});

			await expect.element(t.provider).toHaveAttribute("data-mobile");
			await t.trigger.click();
			await expect.element(t.open).toHaveTextContent("false");
			await expect.element(t.openMobile).toHaveTextContent("true");
			expect(onOpenMobileChange).toHaveBeenCalledWith(true);
		});

		it("toggles with the Command or Control shortcut", async () => {
			const t = setup();
			await userEvent.keyboard("{Control>}b{/Control}");
			await expect.element(t.open).toHaveTextContent("false");
			await userEvent.keyboard("{Meta>}b{/Meta}");
			await expect.element(t.open).toHaveTextContent("true");
		});

		it("supports a custom shortcut and disabling the shortcut", async () => {
			const custom = setup({ keyboardShortcut: "k" });
			await userEvent.keyboard("{Control>}b{/Control}");
			await expect.element(custom.open).toHaveTextContent("true");
			await userEvent.keyboard("{Control>}k{/Control}");
			await expect.element(custom.open).toHaveTextContent("false");
		});

		it("supports child snippet composition", async () => {
			const t = setup({ customTrigger: true });
			await t.trigger.click();
			await expect.element(t.open).toHaveTextContent("false");
		});

		it("disables toggling when the provider is disabled", async () => {
			const t = setup({ disabled: true });
			await expect.element(t.trigger).toBeDisabled();
			await expect.element(t.rail).toBeDisabled();
			await userEvent.keyboard("{Control>}b{/Control}");
			await expect.element(t.open).toHaveTextContent("true");
		});

		it("disables toggling for a non-collapsible sidebar", async () => {
			const t = setup({ collapsible: "none" });
			await expect.element(t.trigger).toBeDisabled();
			await expect.element(t.rail).toBeDisabled();
		});

		it("passes disabled state to menu buttons", async () => {
			setup({ menuButtonDisabled: true });
			const menuButton = page.getByTestId("menu-button");
			await expect.element(menuButton).toBeDisabled();
			await expect.element(menuButton).toHaveAttribute("data-disabled");
		});
	});
});
