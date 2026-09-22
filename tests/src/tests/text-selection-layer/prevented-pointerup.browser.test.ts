import { afterEach, expect, it } from "vitest";
import { render } from "vitest-browser-svelte";
import { page } from "@vitest/browser/context";
import PopoverTest from "../popover/popover-test.svelte";
import { expectExists } from "../browser-utils";

function getBodyUserSelect() {
	return document.body.style.userSelect;
}

afterEach(() => {
	// don't let a failing assertion strand the lock for the next test in the file
	document.body.style.userSelect = "";
	document.body.style.webkitUserSelect = "";
});

/** A press inside the content that something else cancels on `pointerup`. */
async function pressWithPreventedPointerup() {
	const preventDefault = (e: Event) => e.preventDefault();
	// capture phase: the layer's release is a bubble-phase listener on `document`,
	// so the flag has to be set before it runs
	document.addEventListener("pointerup", preventDefault, true);
	try {
		await page.getByTestId("content").click();
	} finally {
		document.removeEventListener("pointerup", preventDefault, true);
	}
}

it("should release the body lock when `pointerup` is `defaultPrevented`", async () => {
	render(PopoverTest);
	await page.getByTestId("trigger").click();
	await expectExists(page.getByTestId("content"));

	await pressWithPreventedPointerup();

	expect(getBodyUserSelect()).toBe("");
});

it("should not strand `user-select` on the body after the layer is dismissed", async () => {
	render(PopoverTest);
	await page.getByTestId("trigger").click();
	await expectExists(page.getByTestId("content"));

	// a skipped release leaves the lock armed; the next press must not snapshot it
	await pressWithPreventedPointerup();
	await page.getByTestId("content").click();
	await page.getByTestId("trigger").click();

	expect(getBodyUserSelect()).toBe("");
});
