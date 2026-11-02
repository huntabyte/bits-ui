import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { render } from "vitest-browser-svelte";
import { page } from "@vitest/browser/context";
import CollapsibleMountAnimationTest from "./collapsible-mount-animation-test.svelte";

const CONTENT = "[data-collapsible-content]";

describe("Collapsible mount animation", () => {
	let style: HTMLStyleElement;
	let started: string[];
	const onStart = (e: AnimationEvent) =>
		started.push(`${(e.target as HTMLElement).dataset.testid}:${e.animationName}`);

	beforeEach(() => {
		style = document.createElement("style");
		style.textContent = `
			${CONTENT}[data-state="open"] { animation: slide-down 300ms linear; }
			${CONTENT}[data-state="closed"] { animation: slide-up 300ms linear; }
			@keyframes slide-down { from { height: 0; } to { height: var(--bits-collapsible-content-height); } }
			@keyframes slide-up { from { height: var(--bits-collapsible-content-height); } to { height: 0; } }
		`;
		document.head.append(style);
		started = [];
		document.addEventListener("animationstart", onStart);
	});

	afterEach(() => {
		document.removeEventListener("animationstart", onStart);
		style.remove();
	});

	const settle = async () => {
		await new Promise(requestAnimationFrame);
		await new Promise(requestAnimationFrame);
		await new Promise((r) => setTimeout(r, 50));
	};

	it("does not play the open animation for several contents mounted open", async () => {
		render(CollapsibleMountAnimationTest, { count: 3, busyMs: 50 });
		await settle();
		expect(started).toEqual([]);
		for (let i = 0; i < 3; i++) {
			expect(page.getByTestId(`content-${i}`).element().getAnimations()).toHaveLength(0);
		}
	});

	it("still animates closing and reopening after mounting open", async () => {
		render(CollapsibleMountAnimationTest, { count: 1, busyMs: 0 });
		await settle();
		await page.getByTestId("trigger-0").click();
		await vi.waitFor(() => expect(started).toEqual(["content-0:slide-up"]));
		await expect.element(page.getByTestId("content-0")).not.toBeVisible();
		await page.getByTestId("trigger-0").click();
		await vi.waitFor(() =>
			expect(started).toEqual(["content-0:slide-up", "content-0:slide-down"])
		);
	});
});
