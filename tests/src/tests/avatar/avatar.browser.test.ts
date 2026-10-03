import { page } from "@vitest/browser/context";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { render } from "vitest-browser-svelte";
import { flushSync } from "svelte";
import AvatarTest from "./avatar-test.svelte";

const src = "https://github.com/huntabyte.png";

function setup(props: { src: string }) {
	render(AvatarTest, { ...props });
}

describe("Data Attributes", () => {
	it("should have bits data attrs", async () => {
		setup({ src });
		const root = page.getByTestId("root");
		const image = page.getByTestId("image");
		const fallback = page.getByTestId("fallback");
		await expect.element(root).toHaveAttribute("data-avatar-root");
		await expect.element(image).toHaveAttribute("data-avatar-image");
		await expect.element(fallback).toHaveAttribute("data-avatar-fallback");
	});
});

describe("Rendering Behavior", () => {
	it("should render the image with the correct src", async () => {
		setup({ src });
		const avatar = page.getByAltText("huntabyte");
		await expect.element(avatar).toHaveAttribute("src", "https://github.com/huntabyte.png");
	});

	it("should render the fallback when an invalid image src is provided", async () => {
		setup({ src: "invalid" });
		const avatar = page.getByAltText("huntabyte");
		await expect.element(avatar).not.toBeVisible();
		const fallback = page.getByText("HJ");
		await expect.element(fallback).toBeVisible();
	});

	it("should remove the avatar when the src is removed", async () => {
		setup({ src });
		const avatar = page.getByAltText("huntabyte");
		await expect.element(avatar).toHaveAttribute("src", "https://github.com/huntabyte.png");
		const clearButton = page.getByTestId("clear-button");
		await clearButton.click();
		await expect.element(avatar).not.toBeVisible();
		await expect.element(page.getByText("HJ")).toBeVisible();
	});

	it("should not have invalid style on the fallback if the image is not loaded", async () => {
		setup({ src: "invalid" });
		const fallback = page.getByText("HJ");
		await expect.element(fallback).not.toHaveStyle({ display: "undefined" });
	});
});

describe("Image load cleanup", () => {
	let images: EventTarget[];

	beforeEach(() => {
		images = [];
		vi.useFakeTimers({ toFake: ["setTimeout", "clearTimeout"] });
		vi.stubGlobal(
			"Image",
			class extends EventTarget {
				onload: ((event: Event) => void) | null = null;
				onerror: ((event: Event) => void) | null = null;

				constructor() {
					super();
					images.push(this);
					this.addEventListener("load", (event) => this.onload?.(event));
					this.addEventListener("error", (event) => this.onerror?.(event));
				}
			}
		);
	});

	afterEach(() => {
		vi.useRealTimers();
		vi.unstubAllGlobals();
	});

	it.each(["replacement.png", ""])(
		"ignores obsolete image events after src becomes %j",
		async (nextSrc) => {
			const onLoadingStatusChange = vi.fn();
			const view = render(AvatarTest, { src: "first.png", onLoadingStatusChange });
			await view.rerender({ src: nextSrc });
			onLoadingStatusChange.mockClear();

			images[0]!.dispatchEvent(new Event("error"));
			images[0]!.dispatchEvent(new Event("load"));
			vi.advanceTimersByTime(1);
			flushSync();
			expect(onLoadingStatusChange).not.toHaveBeenCalled();
			expect(page.getByTestId("root").element().getAttribute("data-status")).toBe(
				nextSrc ? "loading" : "error"
			);

			if (nextSrc) {
				images[1]!.dispatchEvent(new Event("load"));
				vi.advanceTimersByTime(1);
				flushSync();
				expect(onLoadingStatusChange).toHaveBeenCalledExactlyOnceWith("loaded");
			}
			await view.unmount();
		}
	);

	it("cancels a pending display delay when src changes", async () => {
		const onLoadingStatusChange = vi.fn();
		const view = render(AvatarTest, { src: "first.png", delayMs: 100, onLoadingStatusChange });
		images[0]!.dispatchEvent(new Event("load"));
		await view.rerender({ src: "replacement.png" });
		vi.advanceTimersByTime(100);
		flushSync();
		expect(onLoadingStatusChange).not.toHaveBeenCalled();
		expect(page.getByTestId("root").element().getAttribute("data-status")).toBe("loading");
		images[1]!.dispatchEvent(new Event("load"));
		vi.advanceTimersByTime(99);
		expect(onLoadingStatusChange).not.toHaveBeenCalled();
		vi.advanceTimersByTime(1);
		flushSync();
		expect(onLoadingStatusChange).toHaveBeenCalledExactlyOnceWith("loaded");
		await view.unmount();
	});

	it.each([false, true])(
		"cancels image work on destroy (load already fired: %s)",
		async (loaded) => {
			const onLoadingStatusChange = vi.fn();
			const view = render(AvatarTest, {
				src: "first.png",
				delayMs: 100,
				onLoadingStatusChange,
			});
			if (loaded) images[0]!.dispatchEvent(new Event("load"));
			await view.unmount();
			images[0]!.dispatchEvent(new Event("error"));
			images[0]!.dispatchEvent(new Event("load"));
			vi.advanceTimersByTime(100);
			expect(onLoadingStatusChange).not.toHaveBeenCalled();
		}
	);
});
