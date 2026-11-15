import { describe, expect, it } from "vitest";
import { render } from "vitest-browser-svelte";
import { page, userEvent } from "vitest/browser";
import MenuSubDirectionTest from "./menu-sub-direction-test.svelte";

type Kind = "dropdown" | "context" | "menubar";

async function openSubmenu(kind: Kind, dir: "ltr" | "rtl") {
	await page.getByTestId("trigger").click({ button: kind === "context" ? "right" : "left" });
	const trigger = page.getByTestId("sub-trigger");
	await expect.element(trigger).toBeVisible();
	(trigger.element() as HTMLElement).focus();
	await userEvent.keyboard(dir === "rtl" ? "{ArrowLeft}" : "{ArrowRight}");
	await expect.element(page.getByTestId("sub-item")).toHaveFocus();
}

async function expectPlacement(side: "left" | "right" | "top" | "bottom") {
	const content = page.getByTestId("sub-content");
	await expect.element(content).toHaveAttribute("data-side", side);
	await expect
		.poll(() => {
			const anchor = page.getByTestId("sub-trigger").element().getBoundingClientRect();
			const floating = content.element().getBoundingClientRect();
			if (side === "left") return floating.right <= anchor.left + 1;
			if (side === "right") return floating.left >= anchor.right - 1;
			if (side === "top") return floating.bottom <= anchor.top + 1;
			return floating.top >= anchor.bottom - 1;
		})
		.toBe(true);
	expect(page.getByTestId("menu-container").element().contains(content.element())).toBe(false);
}

describe.each<Kind>(["dropdown", "context", "menubar"])("%s submenu direction", (kind) => {
	it("keeps the LTR fallback without a config", async () => {
		await render(MenuSubDirectionTest, { kind });
		await openSubmenu(kind, "ltr");
		await expectPlacement("right");
	});

	it.each([false, true])(
		"inherits reactive direction through portals (forceMount=%s)",
		async (forceMount) => {
			const { rerender } = await render(MenuSubDirectionTest, {
				kind,
				dir: "rtl",
				forceMount,
			});
			await openSubmenu(kind, "rtl");
			await expectPlacement("left");
			await rerender({ dir: "ltr" });
			await expectPlacement("right");
			await userEvent.keyboard("{ArrowLeft}");
			await expect.element(page.getByTestId("sub-trigger")).toHaveFocus();
			if (!forceMount) {
				await expect.element(page.getByTestId("sub-content")).not.toBeInTheDocument();
			}
			await userEvent.keyboard("{ArrowRight}");
			await expect.element(page.getByTestId("sub-item")).toHaveFocus();
			await rerender({ dir: "rtl" });
			await expectPlacement("left");
			await userEvent.keyboard("{ArrowRight}");
			await expect.element(page.getByTestId("sub-trigger")).toHaveFocus();
		}
	);

	it("respects nested config and component overrides", async () => {
		const { rerender } = await render(MenuSubDirectionTest, {
			kind,
			dir: "rtl",
			nestedDir: "ltr",
		});
		await openSubmenu(kind, "ltr");
		await expectPlacement("right");
		await rerender({ componentDir: "rtl" });
		await expectPlacement("left");
		await rerender({ componentDir: undefined });
		await expectPlacement("right");
		await rerender({ nestedDir: undefined });
		await expectPlacement("left");
	});

	it.each(["left", "right", "top", "bottom"] as const)(
		"preserves an explicit physical %s side",
		async (side) => {
			const { rerender } = await render(MenuSubDirectionTest, { kind, dir: "rtl", side });
			await openSubmenu(kind, "rtl");
			await expectPlacement(side);
			await rerender({ dir: "ltr" });
			await expectPlacement(side);
			await rerender({ side: undefined });
			await expectPlacement("right");
		}
	);
});
