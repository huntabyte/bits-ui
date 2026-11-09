import { page } from "vitest/browser";
import { flushSync, tick } from "svelte";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { render } from "vitest-browser-svelte";
import RegistrationLifecycleTest from "./registration-lifecycle-test.svelte";
import ParentOutroTest from "./parent-outro-test.svelte";
import { expectExists } from "../browser-utils";

const waitForDismissal = async (testId = "dismissals") => {
	await vi.waitFor(() => expect(page.getByTestId(testId).element().textContent).toBe("1"));
};

function dispatchPointerdown(target: HTMLElement, pointerType = "mouse") {
	target.dispatchEvent(
		new PointerEvent("pointerdown", {
			bubbles: true,
			cancelable: true,
			pointerType,
			button: 0,
			clientX: window.innerWidth - 1,
			clientY: 1,
		})
	);
}

describe("dismissible layer registration lifecycle", () => {
	it("keeps an in-flight outside interaction when the same ref rerenders", async () => {
		await render(RegistrationLifecycleTest);
		await expectExists(page.getByTestId("layer"));

		dispatchPointerdown(page.getByTestId("rerender-outside").element() as HTMLElement);
		await waitForDismissal();
		expect(page.getByTestId("revision-count").element().textContent).toBe("1");
	});

	it("registers the replacement ref after the previous node is removed", async () => {
		await render(RegistrationLifecycleTest);
		const initialLayer = page.getByTestId("layer").element();

		dispatchPointerdown(page.getByTestId("replace-ref").element() as HTMLElement);
		await vi.waitFor(() => expect(page.getByTestId("layer").element()).not.toBe(initialLayer));

		dispatchPointerdown(page.getByTestId("outside").element() as HTMLElement);
		await waitForDismissal();
	});

	it("does not dismiss from the pointerdown that synchronously mounts the layer", async () => {
		await render(RegistrationLifecycleTest, { mode: "opening" });

		dispatchPointerdown(page.getByTestId("open-during-pointerdown").element() as HTMLElement);
		await expectExists(page.getByTestId("layer"));
		await new Promise((resolve) => setTimeout(resolve, 20));
		expect(page.getByTestId("dismissals").element().textContent).toBe("0");

		dispatchPointerdown(page.getByTestId("outside").element() as HTMLElement);
		await waitForDismissal();
	});

	it("does not leave a layer registered when it unmounts from the opening mutation", async () => {
		const view = await render(RegistrationLifecycleTest, { mode: "opening" });
		type RegisteredLayer = { opts: { ref: { current: HTMLElement | null } } };
		const layers = (
			globalThis as {
				bitsDismissableLayers?: Map<RegisteredLayer, unknown>;
			}
		).bitsDismissableLayers!;
		let openedNode: HTMLElement | null = null;
		let destroyedLayer: RegisteredLayer | undefined;
		let originalRef: RegisteredLayer["opts"]["ref"] | undefined;
		const readRef = vi.fn();
		let unmounted = false;
		const observer = new MutationObserver(async () => {
			const node = document.querySelector<HTMLElement>('[data-testid="layer"]');
			if (!node) return;
			observer.disconnect();
			openedNode = node;
			destroyedLayer = [...layers.keys()].find((layer) => layer.opts.ref.current === node);
			if (destroyedLayer) {
				originalRef = destroyedLayer.opts.ref;
				destroyedLayer.opts.ref = {
					get current() {
						readRef();
						return originalRef!.current;
					},
					set current(value) {
						originalRef!.current = value;
					},
				};
			}
			await view.unmount();
			readRef.mockClear();
			unmounted = true;
		});

		observer.observe(document.body, { childList: true, subtree: true });
		try {
			dispatchPointerdown(
				page.getByTestId("open-during-pointerdown").element() as HTMLElement
			);
			await vi.waitFor(() => expect(unmounted).toBe(true));
			await tick();
			await new Promise((resolve) => setTimeout(resolve, 20));
			expect([...layers].some(([layer]) => layer.opts.ref.current === openedNode)).toBe(
				false
			);
			document.body.dispatchEvent(new PointerEvent("pointerdown", { bubbles: true }));
			expect(readRef).not.toHaveBeenCalled();
		} finally {
			observer.disconnect();
			if (destroyedLayer && originalRef) destroyedLayer.opts.ref = originalRef;
		}
	});

	it("does not dismiss an interaction whose delegated target stops propagation", async () => {
		await render(RegistrationLifecycleTest);
		await expectExists(page.getByTestId("layer"));

		dispatchPointerdown(page.getByTestId("intercepted-outside").element() as HTMLElement);
		await new Promise((resolve) => setTimeout(resolve, 20));
		expect(page.getByTestId("dismissals").element().textContent).toBe("0");

		dispatchPointerdown(page.getByTestId("outside").element() as HTMLElement);
		await waitForDismissal();
	});

	it("cancels a pending touch click when the layer is disabled", async () => {
		await render(RegistrationLifecycleTest);
		await expectExists(page.getByTestId("layer"));

		const outside = page.getByTestId("outside").element() as HTMLElement;
		dispatchPointerdown(outside, "touch");
		await new Promise((resolve) => setTimeout(resolve, 20));
		(page.getByTestId("disable").element() as HTMLElement).click();
		await tick();
		outside.dispatchEvent(new MouseEvent("click", { bubbles: true, button: 0 }));
		await new Promise((resolve) => setTimeout(resolve, 20));

		expect(page.getByTestId("dismissals").element().textContent).toBe("0");
	});
});

/**
 * Regression for https://github.com/huntabyte/bits-ui/issues/2294
 *
 * A parent's outro holds a layer that closes with it inert until the outro ends, so
 * nothing removes its `autoUpdate` or document listeners. Those used to read `$derived`s
 * whose dependencies had just changed, which warns `derived_inert`.
 *
 * Svelte warns on the first read of each stale `$derived` only, so each way in gets a
 * layer of its own.
 */
const parentOutroLayers = ["popover", "portalled-popover", "menu", "select"] as const;

const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

async function renderOpen(layer: (typeof parentOutroLayers)[number]) {
	await render(ParentOutroTest, { layer });
	await expectExists(page.getByTestId("content"));
	// Let the layer attach `autoUpdate` and its document listeners.
	await wait(20);
}

function closeBoth() {
	(page.getByTestId("close-both").element() as HTMLElement).click();
	flushSync();
	// The outro has started and hasn't ended.
	expect(page.getByTestId("panel").element()).toBeTruthy();
	expect(page.getByTestId("content").element()).toBeTruthy();
}

describe("a floating layer inside a closing parent", () => {
	let warnings: string[] = [];

	beforeEach(() => {
		warnings = [];
		const warn = console.warn.bind(console);
		vi.spyOn(console, "warn").mockImplementation((...args: unknown[]) => {
			const text = args.map(String).join(" ");
			if (text.includes("derived_inert")) warnings.push(text);
			else warn(...args);
		});
	});

	afterEach(() => {
		vi.restoreAllMocks();
	});

	for (const layer of parentOutroLayers) {
		it(`${layer} doesn't warn when autoUpdate fires during the outro`, async () => {
			await renderOpen(layer);
			closeBoth();

			window.dispatchEvent(new Event("resize"));
			await wait(50);

			expect(warnings).toEqual([]);
		});

		it(`${layer} doesn't warn when focus moves outside during the outro`, async () => {
			await renderOpen(layer);
			const content = page.getByTestId("content").element();
			closeBoth();

			// A blur out of the layer is what lets it report the focus outside.
			content.dispatchEvent(new FocusEvent("blur"));
			page.getByTestId("outside")
				.element()
				.dispatchEvent(new FocusEvent("focusin", { bubbles: true }));
			await wait(50);

			expect(warnings).toEqual([]);
		});
	}

	// `PopoverRootState.handleClose` still reads `opts.open` during this one, so it warns.
	for (const layer of ["menu", "select"] as const) {
		it(`${layer} doesn't warn when the press that closes both reaches it during the outro`, async () => {
			await renderOpen(layer);

			// A button that closes the parent also counts as a press outside the layer,
			// and the layer handles that press after the click.
			dispatchPointerdown(page.getByTestId("outside").element() as HTMLElement);
			closeBoth();
			await wait(50);

			expect(warnings).toEqual([]);
		});
	}
});

describe("a floating layer while open", () => {
	it("still reports an outside press to the latest callback", async () => {
		const first = vi.fn();
		const second = vi.fn();
		const view = await render(ParentOutroTest, {
			layer: "popover",
			onInteractOutside: first,
		});
		await expectExists(page.getByTestId("content"));
		await view.rerender({ onInteractOutside: second });

		dispatchPointerdown(page.getByTestId("outside").element() as HTMLElement);

		await vi.waitFor(() => expect(second).toHaveBeenCalledTimes(1));
		expect(first).not.toHaveBeenCalled();
	});

	it("still moves when its side offset changes", async () => {
		const view = await render(ParentOutroTest, { layer: "popover", sideOffset: 8 });
		await expectExists(page.getByTestId("content"));
		const gap = () =>
			page.getByTestId("content").element().getBoundingClientRect().top -
			page.getByTestId("trigger").element().getBoundingClientRect().bottom;
		await vi.waitFor(() => expect(gap()).toBeCloseTo(8, 0));

		await view.rerender({ sideOffset: 24 });

		await vi.waitFor(() => expect(gap()).toBeCloseTo(24, 0));
	});
});
