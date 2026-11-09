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
