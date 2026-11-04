import { flushSync } from "svelte";
import { afterEach, describe, expect, it, vi } from "vitest";
import { SvelteResizeObserver } from "./svelte-resize-observer.svelte.js";

type Stubbable = Window & typeof globalThis;

/** Installs a fake `ResizeObserver` on `win` and records the instances it creates. */
function stubResizeObserver(win: Stubbable) {
	const instances: Array<{
		callback: ResizeObserverCallback;
		observe: ReturnType<typeof vi.fn>;
		unobserve: ReturnType<typeof vi.fn>;
		disconnect: ReturnType<typeof vi.fn>;
	}> = [];
	const original = win.ResizeObserver;
	win.ResizeObserver = class {
		observe = vi.fn();
		unobserve = vi.fn();
		disconnect = vi.fn();
		callback: ResizeObserverCallback;
		constructor(callback: ResizeObserverCallback) {
			this.callback = callback;
			instances.push(this);
		}
	} as unknown as typeof ResizeObserver;
	return { instances, restore: () => (win.ResizeObserver = original) };
}

function observe(node: HTMLElement, onResize = vi.fn()) {
	const destroy = $effect.root(() => {
		new SvelteResizeObserver(() => node, onResize);
	});
	flushSync();
	return { onResize, destroy };
}

const cleanups: Array<() => void> = [];
afterEach(() => {
	while (cleanups.length) cleanups.pop()!();
});

describe("SvelteResizeObserver", () => {
	it("re-observes an already observed node for a second subscriber instead of calling back synchronously", () => {
		const ro = stubResizeObserver(window);
		cleanups.push(ro.restore);
		const raf = vi.spyOn(window, "requestAnimationFrame");
		cleanups.push(() => raf.mockRestore());
		const node = document.createElement("div");

		const a = observe(node);
		const b = observe(node);

		expect(ro.instances).toHaveLength(1);
		const [observer] = ro.instances;
		expect(observer!.observe).toHaveBeenCalledTimes(2);
		expect(observer!.unobserve).toHaveBeenCalledTimes(1);
		expect(raf).not.toHaveBeenCalled();

		a.destroy();
		expect(observer!.disconnect).not.toHaveBeenCalled();
		b.destroy();
		expect(observer!.disconnect).toHaveBeenCalledTimes(1);

		// the pool was dropped, so the next subscriber gets a fresh observer
		const c = observe(node);
		expect(ro.instances).toHaveLength(2);
		c.destroy();
	});

	it("observes a node with the ResizeObserver of its own window", () => {
		const iframe = document.createElement("iframe");
		document.body.appendChild(iframe);
		cleanups.push(() => iframe.remove());
		const iframeWindow = iframe.contentWindow as Stubbable;
		const main = stubResizeObserver(window);
		const other = stubResizeObserver(iframeWindow);
		cleanups.push(main.restore, other.restore);
		const node = iframeWindow.document.createElement("div");
		iframeWindow.document.body.appendChild(node);

		const spies = [
			vi.spyOn(window, "requestAnimationFrame"),
			vi.spyOn(window, "cancelAnimationFrame"),
			vi.spyOn(iframeWindow, "requestAnimationFrame"),
			vi.spyOn(iframeWindow, "cancelAnimationFrame"),
		];
		cleanups.push(() => spies.forEach((spy) => spy.mockRestore()));
		const [mainRaf, mainCancel, iframeRaf, iframeCancel] = spies;

		const { destroy } = observe(node);

		expect(main.instances).toHaveLength(0);
		expect(other.instances).toHaveLength(1);
		const [observer] = other.instances;
		expect(observer!.observe).toHaveBeenCalledWith(node);

		observer!.callback(
			[{ target: node } as unknown as ResizeObserverEntry],
			observer as unknown as ResizeObserver
		);
		expect(iframeRaf).toHaveBeenCalledTimes(1);
		expect(iframeCancel).toHaveBeenCalled();
		expect(mainRaf).not.toHaveBeenCalled();
		expect(mainCancel).not.toHaveBeenCalled();

		destroy();
		expect(observer!.disconnect).toHaveBeenCalledTimes(1);
	});
});
