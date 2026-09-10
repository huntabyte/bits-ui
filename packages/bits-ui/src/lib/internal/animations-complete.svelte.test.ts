import { flushSync, tick } from "svelte";
import { simpleBox } from "svelte-toolbelt";
import { afterEach, describe, expect, it, vi } from "vitest";
import { AnimationsComplete } from "./animations-complete.js";

describe("AnimationsComplete", () => {
	let destroy: (() => void) | undefined;

	afterEach(() => {
		destroy?.();
		destroy = undefined;
		vi.useRealTimers();
	});

	function setup(afterTick: boolean, node: HTMLElement | null = null) {
		vi.useFakeTimers();
		const ref = simpleBox(node);
		let complete: AnimationsComplete | undefined;
		destroy = $effect.root(() => {
			complete = new AnimationsComplete({ ref, afterTick: simpleBox(afterTick) });
		});
		flushSync();
		if (!complete) throw new Error("AnimationsComplete was not initialized");
		return { ref, complete };
	}

	async function advanceFrames() {
		vi.advanceTimersToNextFrame();
		vi.advanceTimersToNextFrame();
		await tick();
	}

	it.each([true, false])(
		"resolves a ref mounted after run (afterTick: %s)",
		async (afterTick) => {
			const { ref, complete } = setup(afterTick);
			const callback = vi.fn();
			complete.run(callback);
			const node = document.createElement("div");
			node.getAnimations = vi.fn(() => []);
			ref.current = node;
			await advanceFrames();
			expect(node.getAnimations).toHaveBeenCalledOnce();
			expect(callback).toHaveBeenCalledOnce();
		}
	);

	it("checks the current ref when content is replaced before the frame", async () => {
		const original = document.createElement("div");
		original.getAnimations = vi.fn(() => []);
		const replacement = document.createElement("div");
		replacement.getAnimations = vi.fn(() => []);
		const { ref, complete } = setup(false, original);
		const callback = vi.fn();
		complete.run(callback);
		ref.current = replacement;
		await advanceFrames();
		expect(original.getAnimations).not.toHaveBeenCalled();
		expect(replacement.getAnimations).toHaveBeenCalledOnce();
		expect(callback).toHaveBeenCalledOnce();
	});

	it("waits for starting styles to clear on newly mounted content", async () => {
		const { ref, complete } = setup(true);
		const callback = vi.fn();
		complete.run(callback);
		const node = document.createElement("div");
		node.getAnimations = vi.fn(() => []);
		node.setAttribute("data-starting-style", "");
		ref.current = node;
		await advanceFrames();
		expect(callback).not.toHaveBeenCalled();
		node.removeAttribute("data-starting-style");
		await tick();
		await advanceFrames();
		expect(callback).toHaveBeenCalledOnce();
	});

	it("skips completion if the ref is still absent at the frame", async () => {
		const { complete } = setup(true);
		const callback = vi.fn();
		complete.run(callback);
		await advanceFrames();
		expect(callback).not.toHaveBeenCalled();
	});

	it("supports newly mounted elements without getAnimations", async () => {
		const { ref, complete } = setup(false);
		const callback = vi.fn();
		complete.run(callback);
		ref.current = document.createElement("div");
		await advanceFrames();
		expect(callback).toHaveBeenCalledOnce();
	});

	it("cancels a pending run when another run starts", async () => {
		const { ref, complete } = setup(false);
		const previous = vi.fn();
		const current = vi.fn();
		complete.run(previous);
		ref.current = document.createElement("div");
		complete.run(current);
		await advanceFrames();
		expect(previous).not.toHaveBeenCalled();
		expect(current).toHaveBeenCalledOnce();
	});

	it("cancels a pending run on destruction", async () => {
		const { ref, complete } = setup(false);
		const callback = vi.fn();
		complete.run(callback);
		ref.current = document.createElement("div");
		destroy?.();
		destroy = undefined;
		await advanceFrames();
		expect(callback).not.toHaveBeenCalled();
	});
});
