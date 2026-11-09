import { page } from "vitest/browser";
import { flushSync } from "svelte";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { render } from "vitest-browser-svelte";
import ParentOutroTest from "./parent-outro-test.svelte";
import { expectExists } from "../browser-utils";

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
const layers = ["popover", "portalled-popover", "menu", "select"] as const;

const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

async function renderOpen(layer: (typeof layers)[number]) {
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

function pressOutside() {
	page.getByTestId("outside")
		.element()
		.dispatchEvent(
			new PointerEvent("pointerdown", {
				bubbles: true,
				cancelable: true,
				pointerType: "mouse",
				button: 0,
			})
		);
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

	for (const layer of layers) {
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
			pressOutside();
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

		pressOutside();

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
