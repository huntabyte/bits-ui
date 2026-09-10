import { page } from "@vitest/browser/context";
import { tick } from "svelte";
import { describe, expect, it, vi } from "vitest";
import { render } from "vitest-browser-svelte";
import RegistrationLifecycleTest from "./registration-lifecycle-test.svelte";
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
		render(RegistrationLifecycleTest);
		await expectExists(page.getByTestId("layer"));

		dispatchPointerdown(page.getByTestId("rerender-outside").element() as HTMLElement);
		await waitForDismissal();
		expect(page.getByTestId("revision-count").element().textContent).toBe("1");
	});

	it("registers the replacement ref after the previous node is removed", async () => {
		render(RegistrationLifecycleTest);
		const initialLayer = page.getByTestId("layer").element();

		dispatchPointerdown(page.getByTestId("replace-ref").element() as HTMLElement);
		await vi.waitFor(() => expect(page.getByTestId("layer").element()).not.toBe(initialLayer));

		dispatchPointerdown(page.getByTestId("outside").element() as HTMLElement);
		await waitForDismissal();
	});

	it("does not dismiss from the pointerdown that synchronously mounts the layer", async () => {
		render(RegistrationLifecycleTest, { mode: "opening" });

		dispatchPointerdown(page.getByTestId("open-during-pointerdown").element() as HTMLElement);
		await expectExists(page.getByTestId("layer"));
		await new Promise((resolve) => setTimeout(resolve, 20));
		expect(page.getByTestId("dismissals").element().textContent).toBe("0");

		dispatchPointerdown(page.getByTestId("outside").element() as HTMLElement);
		await waitForDismissal();
	});

	it("does not leave a layer registered when it unmounts from the opening mutation", async () => {
		const view = render(RegistrationLifecycleTest, { mode: "opening" });
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
		const observer = new MutationObserver(() => {
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
			view.unmount();
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
		render(RegistrationLifecycleTest);
		await expectExists(page.getByTestId("layer"));

		dispatchPointerdown(page.getByTestId("intercepted-outside").element() as HTMLElement);
		await new Promise((resolve) => setTimeout(resolve, 20));
		expect(page.getByTestId("dismissals").element().textContent).toBe("0");

		dispatchPointerdown(page.getByTestId("outside").element() as HTMLElement);
		await waitForDismissal();
	});

	it("cancels a pending touch click when the layer is disabled", async () => {
		render(RegistrationLifecycleTest);
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
