import { describe, it, expect } from "vitest";
import { render } from "vitest-browser-svelte";
import BitsConfigTest from "./bits-config-test.svelte";
import { page, userEvent } from "vitest/browser";
import DirectionTest from "./bits-config-direction-test.svelte";
import DirInheritTest from "./bits-config-dir-inherit-test.svelte";

it("should show undefined values when no config is set", async () => {
	await render(BitsConfigTest);

	const noConfigPortal = page.getByTestId("no-config-portal");
	const noConfigLocale = page.getByTestId("no-config-locale");
	await expect.element(noConfigPortal).toMatchTextContent("undefined");
	await expect.element(noConfigLocale).toMatchTextContent("undefined");
});

it("should show configured values at root level", async () => {
	await render(BitsConfigTest);

	const rootConfigPortal = page.getByTestId("root-config-portal");
	const rootConfigLocale = page.getByTestId("root-config-locale");

	await expect.element(rootConfigPortal).toMatchTextContent("#root-portal");
	await expect.element(rootConfigLocale).toMatchTextContent("en");
});

it("should inherit values from parent when child doesn't specify them", async () => {
	await render(BitsConfigTest);

	const childInheritsPortal = page.getByTestId("child-inherits-portal");
	const childInheritsLocale = page.getByTestId("child-inherits-locale");

	await expect.element(childInheritsPortal).toMatchTextContent("#parent-portal");
	await expect.element(childInheritsLocale).toMatchTextContent("en");
});

it("should allow child to override parent values", async () => {
	await render(BitsConfigTest);

	const childOverridesPortal = page.getByTestId("child-overrides-portal");
	const childOverridesLocale = page.getByTestId("child-overrides-locale");

	// child overrides portal but inherits locale
	await expect.element(childOverridesPortal).toMatchTextContent("#child-portal");
	await expect.element(childOverridesLocale).toMatchTextContent("en");
});

it("should handle deep nesting inheritance correctly", async () => {
	await render(BitsConfigTest);

	const deepNestingPortal = page.getByTestId("deep-nesting-portal");
	const deepNestingLocale = page.getByTestId("deep-nesting-locale");

	// inherits portal from level 1, locale from level 2
	await expect.element(deepNestingPortal).toMatchTextContent("#level1");
	await expect.element(deepNestingLocale).toMatchTextContent("es");
});

it("should handle partial override chains correctly", async () => {
	await render(BitsConfigTest);

	const partialOverridePortal = page.getByTestId("partial-override-portal");
	const partialOverrideLocale = page.getByTestId("partial-override-locale");

	// level 3 overrides portal, level 2 overrides locale
	await expect.element(partialOverridePortal).toMatchTextContent("#override");
	await expect.element(partialOverrideLocale).toMatchTextContent("fr");
});

describe("dir", () => {
	const roots = [
		"slider",
		"menubar",
		"navigation-menu",
		"scroll-area",
		"dropdown-menu",
		"context-menu",
	];

	function directionElement(id: string) {
		const node = page.getByTestId(id).element();
		return id === "dropdown-menu" || id === "context-menu" ? node.parentElement! : node;
	}

	it("inherits direction through nested configs and updates descendants", async () => {
		const { rerender } = await render(DirectionTest);
		await expect.element(page.getByTestId("fallback-slider")).not.toHaveAttribute("dir");
		await expect.element(page.getByTestId("outside")).toHaveTextContent("undefined");
		for (const id of ["parent", "inherited", "nested"]) {
			await expect.element(page.getByTestId(id)).toHaveTextContent("rtl");
		}
		for (const id of roots) {
			await expect.element(directionElement(id)).toHaveAttribute("dir", "rtl");
		}
		await expect
			.element(page.getByTestId("popover").element().parentElement!)
			.toHaveAttribute("dir", "rtl");
		await rerender({ dir: "ltr" });
		for (const id of roots) {
			await expect.element(directionElement(id)).toHaveAttribute("dir", "ltr");
		}
		await expect.element(page.getByTestId("inherited")).toHaveTextContent("ltr");
		await expect
			.element(page.getByTestId("popover").element().parentElement!)
			.toHaveAttribute("dir", "ltr");
	});

	it("lets nested configs and explicit component props override the default", async () => {
		const { rerender } = await render(DirectionTest, { nestedDir: "ltr", componentDir: "ltr" });
		await expect.element(page.getByTestId("parent")).toHaveTextContent("rtl");
		await expect.element(page.getByTestId("nested")).toHaveTextContent("ltr");
		for (const id of roots) {
			await expect.element(directionElement(id)).toHaveAttribute("dir", "ltr");
		}
		await expect
			.element(page.getByTestId("popover").element().parentElement!)
			.toHaveAttribute("dir", "ltr");
		await rerender({ nestedDir: undefined, componentDir: undefined });
		await expect.element(page.getByTestId("nested")).toHaveTextContent("rtl");
		await expect.element(page.getByTestId("slider")).toHaveAttribute("dir", "rtl");
	});

	it("uses the configured direction for slider keyboard behavior", async () => {
		const { rerender } = await render(DirectionTest, { showFloating: false });
		const thumb = page.getByTestId("thumb");
		(thumb.element() as HTMLElement).focus();
		await userEvent.keyboard("{ArrowRight}");
		await expect.element(thumb).toHaveAttribute("aria-valuenow", "49");
		await rerender({ dir: "ltr" });
		await userEvent.keyboard("{ArrowRight}");
		await expect.element(thumb).toHaveAttribute("aria-valuenow", "50");
	});

	it("uses the configured direction for menubar keyboard navigation", async () => {
		const { rerender } = await render(DirectionTest, { showFloating: false });
		const first = page.getByTestId("first-menu");
		const second = page.getByTestId("second-menu");
		(first.element() as HTMLElement).focus();
		await userEvent.keyboard("{ArrowLeft}");
		await expect.element(second).toHaveFocus();
		await rerender({ dir: "ltr" });
		(first.element() as HTMLElement).focus();
		await userEvent.keyboard("{ArrowRight}");
		await expect.element(second).toHaveFocus();
	});

	it("inherits DOM direction when no dir prop or config is set", async () => {
		await render(DirInheritTest);
		const menubar = page.getByTestId("menubar").element();
		expect(menubar.getAttribute("dir")).toBeNull();
		expect(getComputedStyle(menubar).direction).toBe("rtl");
		(page.getByTestId("first").element() as HTMLElement).focus();
		await userEvent.keyboard("{ArrowLeft}");
		await expect.element(page.getByTestId("second")).toHaveFocus();
	});
});
