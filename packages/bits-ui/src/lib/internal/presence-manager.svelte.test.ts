import { flushSync, tick } from "svelte";
import { box } from "svelte-toolbelt";
import { describe, expect, it, vi } from "vitest";
import { PresenceManager } from "./presence-manager.svelte.js";

/**
 * Mirrors how the components use `PresenceManager`: the content node is only
 * available once the content has been rendered and its ref has been attached,
 * which happens *after* the `open` box flips to `true`.
 */
function createManager(initialOpen: boolean) {
	const open = box(initialOpen);
	const ref = box<HTMLElement | null>(null);
	const onComplete = vi.fn();
	let destroy: (() => void) | undefined;

	destroy = $effect.root(() => {
		new PresenceManager({ open, ref, onComplete });
	});
	flushSync();

	return {
		open,
		ref,
		onComplete,
		/** Simulates the content element mounting. */
		mountContent: () => {
			ref.current = document.createElement("div");
		},
		/** Simulates the content element unmounting. */
		unmountContent: () => {
			ref.current = null;
		},
		cleanup: () => destroy?.(),
	};
}

/** Waits for the rAF chain in `AnimationsComplete` to settle. */
async function settleAnimations() {
	await tick();
	await new Promise((resolve) => requestAnimationFrame(resolve));
	await tick();
	await new Promise((resolve) => requestAnimationFrame(resolve));
	await tick();
}

describe("PresenceManager", () => {
	it("calls onComplete when a closed component is opened for the first time", async () => {
		const { open, onComplete, mountContent, cleanup } = createManager(false);

		open.current = true;
		flushSync();
		// The content renders as a result of opening, so its ref attaches here.
		mountContent();
		await settleAnimations();

		expect(onComplete).toHaveBeenCalledTimes(1);
		cleanup();
	});

	it("calls onComplete when an open component is closed for the first time", async () => {
		const { open, onComplete, mountContent, cleanup } = createManager(true);
		mountContent();

		open.current = false;
		flushSync();
		await settleAnimations();

		expect(onComplete).toHaveBeenCalledTimes(1);
		cleanup();
	});

	it("calls onComplete on every subsequent open and close", async () => {
		const { open, onComplete, mountContent, cleanup } = createManager(false);

		open.current = true;
		flushSync();
		mountContent();
		await settleAnimations();
		expect(onComplete).toHaveBeenCalledTimes(1);

		open.current = false;
		flushSync();
		await settleAnimations();
		expect(onComplete).toHaveBeenCalledTimes(2);

		open.current = true;
		flushSync();
		mountContent();
		await settleAnimations();
		expect(onComplete).toHaveBeenCalledTimes(3);

		cleanup();
	});

	it("renders when opened in the same flush it was created in", async () => {
		const open = box(false);
		const ref = box<HTMLElement | null>(null);
		const onComplete = vi.fn();
		let manager!: PresenceManager;

		const destroy = $effect.root(() => {
			manager = new PresenceManager({ open, ref, onComplete });
		});
		// flip `open` before the watcher's first run
		open.current = true;
		flushSync();

		expect(manager.shouldRender).toBe(true);
		ref.current = document.createElement("div");
		await settleAnimations();
		expect(onComplete).toHaveBeenCalledTimes(1);
		destroy();
	});

	it("exits when closed in the same flush it was created in", async () => {
		const open = box(true);
		const ref = box<HTMLElement | null>(document.createElement("div"));
		const onComplete = vi.fn();
		let manager!: PresenceManager;

		const destroy = $effect.root(() => {
			manager = new PresenceManager({ open, ref, onComplete });
		});
		open.current = false;
		flushSync();

		expect(manager.transitionStatus).toBe("ending");
		await settleAnimations();
		expect(manager.shouldRender).toBe(false);
		expect(onComplete).toHaveBeenCalledTimes(1);
		destroy();
	});

	it("skips the exit animation when closed in the same flush it was created in", () => {
		const open = box(true);
		const ref = box<HTMLElement | null>(document.createElement("div"));
		const onComplete = vi.fn();
		let manager!: PresenceManager;

		const destroy = $effect.root(() => {
			manager = new PresenceManager({
				open,
				ref,
				onComplete,
				shouldSkipExitAnimation: () => true,
			});
		});
		open.current = false;
		flushSync();

		expect(manager.shouldRender).toBe(false);
		expect(manager.transitionStatus).toBe(undefined);
		expect(onComplete).toHaveBeenCalledTimes(1);
		destroy();
	});

	it("reports the open state that triggered the callback", async () => {
		const open = box(false);
		const ref = box<HTMLElement | null>(null);
		const seen: boolean[] = [];
		let destroy: (() => void) | undefined;

		destroy = $effect.root(() => {
			new PresenceManager({
				open,
				ref,
				onComplete: () => seen.push(open.current),
			});
		});
		flushSync();

		open.current = true;
		flushSync();
		ref.current = document.createElement("div");
		await settleAnimations();

		open.current = false;
		flushSync();
		await settleAnimations();

		expect(seen).toEqual([true, false]);
		destroy?.();
	});
});
