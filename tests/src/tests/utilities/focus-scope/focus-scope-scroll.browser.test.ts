import { expect, it } from "vitest";
import { render } from "vitest-browser-svelte";
import { page, userEvent } from "@vitest/browser/context";
import FocusScopeScrollTest from "./focus-scope-scroll-test.svelte";

// https://github.com/huntabyte/bits-ui/issues/2117
async function openDialog() {
	render(FocusScopeScrollTest);
	window.scrollTo(0, 0);
	await page.getByTestId("trigger").click();
	await expect.poll(() => document.activeElement?.getAttribute("data-testid")).toBe("close");
}

it("should not scroll the page when auto-focusing on open", async () => {
	await openDialog();
	expect(window.scrollY).toBe(0);
});

it("should not scroll the page when the trap pulls focus back inside", async () => {
	await openDialog();
	window.scrollTo(0, 0);
	(page.getByTestId("outside").element() as HTMLElement).focus({ preventScroll: true });
	expect(document.activeElement?.getAttribute("data-testid")).toBe("close");
	expect(window.scrollY).toBe(0);
});

it("should not scroll the page when restoring focus on close", async () => {
	await openDialog();
	window.scrollTo(0, 2000);
	await userEvent.keyboard("{Escape}");
	await expect.poll(() => document.activeElement?.getAttribute("data-testid")).toBe("trigger");
	expect(window.scrollY).toBe(2000);
});
