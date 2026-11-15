import { describe, expect, it } from "vitest";
import { render } from "vitest-browser-svelte";
import { page, userEvent } from "vitest/browser";
import LogicalSideTest from "./logical-side-test.svelte";

type Kind = "popover" | "dropdown" | "context" | "menubar";
type PhysicalSide = "top" | "right" | "bottom" | "left";

async function open(kind: Kind, dir: "ltr" | "rtl" = "ltr") {
	await page.getByTestId("trigger").click({ button: kind === "context" ? "right" : "left" });
	if (kind === "popover") return;
	const sub = page.getByTestId("sub-trigger");
	await expect.element(sub).toBeVisible();
	(sub.element() as HTMLElement).focus();
	await userEvent.keyboard(dir === "rtl" ? "{ArrowLeft}" : "{ArrowRight}");
	await expect.element(page.getByTestId("sub-item")).toHaveFocus();
}

async function expectPlacement(side: PhysicalSide, kind: Kind = "popover") {
	const content = page.getByTestId("content");
	await expect.element(content).toHaveAttribute("data-side", side);
	await expect.element(page.getByTestId("arrow")).toHaveAttribute("data-side", side);
	await expect
		.poll(() => {
			const anchor = page
				.getByTestId(kind === "popover" ? "trigger" : "sub-trigger")
				.element()
				.getBoundingClientRect();
			const floating = content.element().getBoundingClientRect();
			if (side === "left") return floating.right <= anchor.left + 1;
			if (side === "right") return floating.left >= anchor.right - 1;
			if (side === "top") return floating.bottom <= anchor.top + 1;
			return floating.top >= anchor.bottom - 1;
		})
		.toBe(true);
	const arrow = page.getByTestId("arrow").element() as HTMLElement;
	const opposite = { left: "right", right: "left", top: "bottom", bottom: "top" }[side];
	expect(arrow.style.getPropertyValue(opposite)).toBe("0px");
	expect(page.getByTestId("container").element().contains(content.element())).toBe(false);
	await expect
		.poll(() => {
			const wrapper = content.element().parentElement!;
			return getComputedStyle(wrapper).getPropertyValue("--bits-floating-transform-origin");
		})
		.toMatch(/^-?\d+(?:\.\d+)?px -?\d+(?:\.\d+)?px$/);
}

describe.each<Kind>(["popover", "dropdown", "context", "menubar"])("%s logical sides", (kind) => {
	it.each(["inline-start", "inline-end"] as const)(
		"defaults %s to LTR without config",
		async (side) => {
			await render(LogicalSideTest, { kind, side });
			await open(kind);
			await expectPlacement(side === "inline-start" ? "left" : "right", kind);
		}
	);

	it.each([false, true])(
		"reacts to config and explicit direction through portals (forceMount=%s)",
		async (forceMount) => {
			const { rerender } = await render(LogicalSideTest, {
				kind,
				dir: "rtl",
				side: "inline-end",
				forceMount,
			});
			await open(kind, "rtl");
			await expectPlacement("left", kind);
			await rerender({ dir: "ltr" });
			await expectPlacement("right", kind);
			await rerender({ nestedDir: "rtl" });
			await expectPlacement("left", kind);
			await rerender({ componentDir: "ltr" });
			await expectPlacement("right", kind);
			await rerender({ side: "inline-start" });
			await expectPlacement("left", kind);
			await rerender({ componentDir: undefined });
			await expectPlacement("right", kind);
			await rerender({ nestedDir: undefined });
			await expectPlacement("left", kind);
			await userEvent.keyboard(kind === "popover" ? "{Escape}" : "{ArrowLeft}");
			if (forceMount) await expect.element(page.getByTestId("content")).toBeInTheDocument();
			else await expect.element(page.getByTestId("content")).not.toBeInTheDocument();
			if (kind === "popover") await open(kind);
			else await userEvent.keyboard("{ArrowRight}");
			await expectPlacement("left", kind);
		}
	);

	it.each(["top", "right", "bottom", "left"] as const)(
		"keeps physical %s independent of direction",
		async (side) => {
			const { rerender } = await render(LogicalSideTest, { kind, side, dir: "rtl" });
			await open(kind, "rtl");
			await expectPlacement(side, kind);
			await rerender({ dir: "ltr" });
			await expectPlacement(side, kind);
		}
	);
});

it.each([
	{ dir: "ltr", side: "inline-start", edge: "left", placed: "right" },
	{ dir: "ltr", side: "inline-end", edge: "right", placed: "left" },
	{ dir: "rtl", side: "inline-start", edge: "right", placed: "left" },
	{ dir: "rtl", side: "inline-end", edge: "left", placed: "right" },
] as const)(
	"flips $side at the $edge edge in $dir, reporting physical sides",
	async ({ dir, side, edge, placed }) => {
		await render(LogicalSideTest, { dir, side, edge, avoidCollisions: true });
		await open("popover", dir);
		await expectPlacement(placed);
	}
);
