import { describe, expect, it, vi } from "vitest";
import { render } from "vitest-browser-svelte";
import { flushSync, tick } from "svelte";
import { CollapsibleContentState } from "../../../../packages/bits-ui/dist/bits/collapsible/collapsible.svelte.js";
import CollapsibleTest from "./collapsible-test.svelte";
import CollapsibleReplacementTest from "./collapsible-replacement-test.svelte";
import { page } from "@vitest/browser/context";

describe("Collapsible deferred measurements", () => {
	it("does not read the content ref after unmount", async () => {
		const create = vi.spyOn(CollapsibleContentState, "create");
		const view = render(CollapsibleTest, { open: true });
		const state = create.mock.results[0]?.value;
		if (!state) throw new Error("Missing Collapsible content state");
		const ref = state.opts.ref;
		const readRef = vi.fn(() => ref.current);
		state.opts.ref = {
			get current() {
				return readRef();
			},
			set current(value) {
				ref.current = value;
			},
		};
		try {
			const unmounted = view.unmount();
			readRef.mockClear();
			await unmounted;
			await tick();
			expect(readRef).not.toHaveBeenCalled();
		} finally {
			state.opts.ref = ref;
			create.mockRestore();
		}
	});
	it("does not measure a replaced node and still measures its replacement", async () => {
		const view = render(CollapsibleReplacementTest);
		const oldNode = page.getByTestId("content").element();
		const measureOldNode = vi.spyOn(oldNode, "getBoundingClientRect");
		try {
			flushSync(() => {
				(page.getByTestId("replace").element() as HTMLButtonElement).click();
			});
			const newNode = page.getByTestId("content").element();
			expect(newNode).not.toBe(oldNode);
			await tick();
			expect(measureOldNode).not.toHaveBeenCalled();
			await vi.waitFor(() => {
				const style = getComputedStyle(newNode);
				expect(style.getPropertyValue("--bits-collapsible-content-width")).toBe("120px");
				expect(style.getPropertyValue("--bits-collapsible-content-height")).toBe("40px");
			});
		} finally {
			await view.unmount();
			measureOldNode.mockRestore();
		}
	});
	it("keeps measured dimensions available to opening and closing animations", async () => {
		const style = document.createElement("style");
		style.textContent = `
            [data-collapsible-content] { width: 120px; height: 40px; overflow: hidden; }
            [data-collapsible-content][data-state="open"] { animation: test-open 1s linear; }
            [data-collapsible-content][data-state="closed"] { animation: test-close 1s linear; }
            @keyframes test-open {
                from { height: 0; }
                to { height: var(--bits-collapsible-content-height); }
            }
            @keyframes test-close {
                from { height: var(--bits-collapsible-content-height); }
                to { height: 0; }
            }
        `;
		document.head.append(style);
		const view = render(CollapsibleTest);
		try {
			await page.getByTestId("trigger").click();
			const content = page.getByTestId("content").element();
			await vi.waitFor(() => {
				expect(
					getComputedStyle(content).getPropertyValue("--bits-collapsible-content-height")
				).toBe("40px");
			});
			const opening = content.getAnimations();
			expect(opening).toHaveLength(1);
			await Promise.all(opening.map((animation) => animation.finished));
			expect(content.getBoundingClientRect().height).toBe(40);
			await page.getByTestId("trigger").click();
			const closing = content.getAnimations();
			expect(closing).toHaveLength(1);
			await Promise.all(closing.map((animation) => animation.finished));
			await expect.element(page.getByTestId("content")).not.toBeVisible();
		} finally {
			await view.unmount();
			style.remove();
		}
	});
});
