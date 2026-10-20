import { flushSync } from "svelte";
import { box } from "svelte-toolbelt";
import { describe, expect, it, vi } from "vitest";
import { AnimationsComplete } from "./animations-complete.js";

// Capture `afterTick` callbacks so the test controls when the deferred work runs.
const { queued } = vi.hoisted(() => ({ queued: [] as (() => void)[] }));
vi.mock("svelte-toolbelt", async (importOriginal) => ({
	...(await importOriginal<typeof import("svelte-toolbelt")>()),
	afterTick: (fn: () => void) => queued.push(fn),
}));

async function setup() {
	queued.length = 0;
	const node = document.createElement("div");
	node.getAnimations = () => [];
	const fn = vi.fn();
	let animations!: AnimationsComplete;
	const destroy = $effect.root(() => {
		animations = new AnimationsComplete({ ref: box(node), afterTick: box(true) });
	});
	flushSync();
	animations.run(fn);
	await vi.waitFor(() => expect(queued).toHaveLength(1));
	return { fn, destroy, flushQueued: () => queued.splice(0).forEach((cb) => cb()) };
}

describe("AnimationsComplete", () => {
	it("runs the callback after animations finish", async () => {
		const { fn, destroy, flushQueued } = await setup();
		flushQueued();
		expect(fn).toHaveBeenCalledTimes(1);
		destroy();
	});

	it("does not run a queued callback after the owner is destroyed", async () => {
		const { fn, destroy, flushQueued } = await setup();
		destroy();
		flushQueued();
		expect(fn).not.toHaveBeenCalled();
	});
});
