import { expect, it } from "vitest";
import { render } from "vitest-browser-svelte";
import { page, userEvent } from "vitest/browser";
import DirectionTest from "./bits-config-direction-test.svelte";

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
	await expect.element(page.getByTestId("fallback-slider")).toHaveAttribute("dir", "ltr");
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
