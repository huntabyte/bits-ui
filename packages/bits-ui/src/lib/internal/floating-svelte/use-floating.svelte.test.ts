import { flushSync } from "svelte";
import { box } from "svelte-toolbelt";
import { describe, expect, it, vi } from "vitest";
import { useFloating } from "./use-floating.svelte.js";
import type { UseFloatingReturn } from "./types.js";

describe("useFloating", () => {
	it("ignores an update scheduled by whileElementsMounted after the owning effect is destroyed", () => {
		const referenceNode = document.createElement("button");
		const floatingNode = document.createElement("div");
		document.body.append(referenceNode, floatingNode);
		let placement = $state<"top" | "bottom">("bottom");
		// Every read of the `placement` option — the `$derived` in `useFloating`
		// only calls this while it is dirty and being re-run.
		const readPlacement = vi.fn(() => placement);
		let scheduledUpdate: (() => void) | undefined;
		let floating: UseFloatingReturn | undefined;

		const destroy = $effect.root(() => {
			floating = useFloating({
				reference: box.with(() => referenceNode),
				placement: readPlacement,
				// Stands in for floating-ui's `autoUpdate`, which hands `update` to
				// observers of its own.
				whileElementsMounted: (_reference, _floating, update) => {
					scheduledUpdate = update;
					return () => {};
				},
			});
			floating.floating.current = floatingNode;
		});

		try {
			flushSync();
			expect(scheduledUpdate).toBeTypeOf("function");

			destroy();
			// An option changes after teardown, as a prop does while the parent
			// re-renders, then an observer fires — floating-ui's
			// IntersectionObserver still can after `disconnect()`.
			placement = "top";
			flushSync();
			readPlacement.mockClear();
			expect(() => scheduledUpdate?.()).not.toThrow();

			expect(readPlacement).not.toHaveBeenCalled();
		} finally {
			referenceNode.remove();
			floatingNode.remove();
		}
	});

	it("updates when an option changes without whileElementsMounted", async () => {
		const referenceNode = document.createElement("button");
		const floatingNode = document.createElement("div");
		document.body.append(referenceNode, floatingNode);
		let placement = $state<"top" | "bottom">("bottom");
		let floating: UseFloatingReturn | undefined;
		// jsdom has no layout, and `update` ignores a reference without client rects.
		vi.spyOn(referenceNode, "getClientRects").mockReturnValue([{}] as unknown as DOMRectList);

		const destroy = $effect.root(() => {
			floating = useFloating({
				reference: box.with(() => referenceNode),
				placement: () => placement,
			});
			floating.floating.current = floatingNode;
		});

		try {
			flushSync();
			await vi.waitFor(() => expect(floating?.placement).toBe("bottom"));

			placement = "top";
			flushSync();

			await vi.waitFor(() => expect(floating?.placement).toBe("top"));
		} finally {
			destroy();
			referenceNode.remove();
			floatingNode.remove();
		}
	});

	it("reattaches whileElementsMounted when an option changes", () => {
		const referenceNode = document.createElement("button");
		const floatingNode = document.createElement("div");
		document.body.append(referenceNode, floatingNode);
		let placement = $state<"top" | "bottom">("bottom");
		// floating-ui's `autoUpdate` calls `update` once as it attaches.
		const whileElementsMounted = vi.fn(
			(_reference: unknown, _floating: unknown, update: () => void) => {
				update();
				return () => {};
			}
		);

		const destroy = $effect.root(() => {
			const floating = useFloating({
				reference: box.with(() => referenceNode),
				placement: () => placement,
				whileElementsMounted,
			});
			floating.floating.current = floatingNode;
		});

		try {
			flushSync();
			expect(whileElementsMounted).toHaveBeenCalledTimes(1);

			placement = "top";
			flushSync();

			expect(whileElementsMounted).toHaveBeenCalledTimes(2);
		} finally {
			destroy();
			referenceNode.remove();
			floatingNode.remove();
		}
	});
});
