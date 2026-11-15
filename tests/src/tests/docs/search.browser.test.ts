import { afterEach, beforeEach, expect, it, vi } from "vitest";
import { render } from "vitest-browser-svelte";
import { page, userEvent } from "vitest/browser";
import Search from "../../../../docs/src/lib/components/search.svelte";
import "../../../../docs/src/lib/styles/app.css";

beforeEach(async () => {
	await page.viewport(390, 844);
	vi.stubGlobal(
		"fetch",
		vi.fn(async () => ({ json: async () => [] }))
	);
});

afterEach(() => vi.unstubAllGlobals());

it("focuses search during the mobile trigger's click event, before timers run", async () => {
	await render(Search);
	let focusedDuringClick = false;
	window.addEventListener(
		"click",
		() => {
			focusedDuringClick = document.activeElement?.matches("[data-command-input]") ?? false;
		},
		{ once: true }
	);
	await page.getByRole("button", { name: "Search Docs" }).click();
	expect(focusedDuringClick).toBe(true);
	const input = page.getByRole("combobox");
	await expect.element(input).toHaveFocus();
	await userEvent.keyboard("dialog");
	await expect.element(input).toHaveValue("dialog");
});

it("focuses search again when the mobile trigger reopens it", async () => {
	await render(Search);
	const trigger = page.getByRole("button", { name: "Search Docs" });
	await trigger.click();
	await userEvent.keyboard("{Escape}");
	await expect.element(page.getByRole("combobox")).not.toBeInTheDocument();
	let focusedDuringClick = false;
	window.addEventListener(
		"click",
		() => {
			focusedDuringClick = document.activeElement?.matches("[data-command-input]") ?? false;
		},
		{ once: true }
	);
	await trigger.click();
	expect(focusedDuringClick).toBe(true);
	await expect.element(page.getByRole("combobox")).toHaveFocus();
});

// Reopen inside the 300ms close-reset window. Check synchronously: expect.element polls,
// which would wait out the reset and hide the race.
it.each(["Control", "Meta"])(
	"keeps new typing when search reopens before the close reset (%s+K)",
	async (modifier) => {
		await render(Search);
		await userEvent.keyboard(`{${modifier}>}k{/${modifier}}`);
		const input = page.getByRole("combobox");
		await expect.element(input).toHaveFocus();
		await userEvent.keyboard("old");
		await userEvent.keyboard("{Escape}");
		await expect.element(input).not.toBeInTheDocument();
		await userEvent.keyboard(`{${modifier}>}k{/${modifier}}`);
		await expect.element(input).toBeInTheDocument();
		expect((input.element() as HTMLInputElement).value).toBe("");
		await userEvent.keyboard("new");
		// Wait past the 300ms close reset to prove it cannot erase the new query.
		await new Promise((resolve) => setTimeout(resolve, 350));
		expect((input.element() as HTMLInputElement).value).toBe("new");
	}
);

it("focuses and accepts typing from the desktop trigger", async () => {
	await page.viewport(1280, 800);
	await render(Search);
	await page.getByRole("button", { name: /Search Docs/ }).click();
	const input = page.getByRole("combobox");
	await expect.element(input).toHaveFocus();
	await userEvent.keyboard("tabs");
	await expect.element(input).toHaveValue("tabs");
});

it.each(["Control", "Meta"])("focuses from the %s+K shortcut", async (modifier) => {
	await render(Search, { showTrigger: false });
	await userEvent.keyboard(`{${modifier}>}k{/${modifier}}`);
	const input = page.getByRole("combobox");
	await expect.element(input).toHaveFocus();
	await userEvent.keyboard("slider");
	await expect.element(input).toHaveValue("slider");
});

it("shows mobile navigation only while the query is empty and restores focus on close", async () => {
	await render(Search);
	const trigger = page.getByRole("button", { name: "Search Docs" });
	await trigger.click();
	const home = page.getByRole("option", { name: "Home", exact: true });
	await expect.element(home).toBeInTheDocument();
	await userEvent.keyboard("no-matching-document");
	await expect.element(home).not.toBeInTheDocument();
	await expect.element(page.getByText("No results found", { exact: true })).toBeInTheDocument();
	await userEvent.clear(page.getByRole("combobox"));
	await expect.element(home).toBeInTheDocument();
	await page.getByRole("button", { name: "Close search" }).click();
	await expect.element(page.getByRole("combobox")).not.toBeInTheDocument();
	await expect.element(trigger).toHaveFocus();
});

it("keeps an open search usable when crossing the desktop breakpoint", async () => {
	await render(Search);
	await page.getByRole("button", { name: "Search Docs" }).click();
	await userEvent.keyboard("tabs");
	await page.viewport(1280, 800);
	await expect.element(page.getByRole("combobox")).toHaveValue("tabs");
	await expect.element(page.getByRole("combobox")).toHaveFocus();
	await page.viewport(390, 844);
	await expect.element(page.getByRole("combobox")).toHaveValue("tabs");
	await expect.element(page.getByRole("combobox")).toHaveFocus();
	await page.getByRole("button", { name: "Close search" }).click();
	await expect.element(page.getByRole("combobox")).not.toBeInTheDocument();
});

it("keeps the sheet anchored while reserving space for a simulated software keyboard", async () => {
	const visualViewport = window.visualViewport!;
	const originalHeight = visualViewport.height;
	const height = vi.spyOn(visualViewport, "height", "get").mockReturnValue(originalHeight);
	try {
		await render(Search);
		await page.getByRole("button", { name: "Search Docs" }).click();
		const viewport = document.querySelector<HTMLElement>("[data-drawer-viewport]")!;
		const popup = document.querySelector<HTMLElement>("[data-drawer-popup]")!;
		await expect.poll(() => popup.hasAttribute("data-starting-style")).toBe(false);
		await Promise.all(popup.getAnimations().map((animation) => animation.finished));
		const top = popup.getBoundingClientRect().top;
		height.mockReturnValue(originalHeight - 300);
		visualViewport.dispatchEvent(new Event("resize"));
		await expect
			.poll(() =>
				getComputedStyle(viewport).getPropertyValue("--drawer-keyboard-inset").trim()
			)
			.toBe("300px");
		expect(popup.getBoundingClientRect().top).toBeCloseTo(top);
		height.mockReturnValue(originalHeight);
		visualViewport.dispatchEvent(new Event("resize"));
		await expect
			.poll(() =>
				getComputedStyle(viewport).getPropertyValue("--drawer-keyboard-inset").trim()
			)
			.toBe("0px");
	} finally {
		height.mockRestore();
	}
});
