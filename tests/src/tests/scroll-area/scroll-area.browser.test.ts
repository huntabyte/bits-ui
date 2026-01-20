import { expect, it, vi, describe } from "vitest";
import { render } from "vitest-browser-svelte";
import { getTestKbd } from "../utils.js";
import ScrollAreaTest, { type ScrollAreaTestProps } from "./scroll-area-test.svelte";
import ScrollAreaStyleOverrideTest, {
	type ScrollAreaStyleOverrideTestProps,
} from "./scroll-area-style-override-test.svelte";
import { expectExists, expectNotExists } from "../browser-utils";
import { page, userEvent } from "@vitest/browser/context";

const kbd = getTestKbd();

function setup(props: ScrollAreaTestProps = {}) {
	render(ScrollAreaTest, { ...props });

	const root = page.getByTestId("root");
	const viewport = page.getByTestId("viewport");
	const typeSelect = page.getByTestId("type");
	const heightInput = page.getByTestId("height");
	const widthInput = page.getByTestId("width");
	const numParagraphsInput = page.getByTestId("numParagraphs");

	function getScrollbarX() {
		return page.getByTestId("scrollbar-x");
	}

	function getScrollbarY() {
		return page.getByTestId("scrollbar-y");
	}

	function getThumbX() {
		return page.getByTestId("thumb-x");
	}

	function getThumbY() {
		return page.getByTestId("thumb-y");
	}

	function getCorner() {
		return page.getByTestId("corner");
	}

	return {
		root,
		viewport,
		typeSelect,
		heightInput,
		widthInput,
		numParagraphsInput,
		getScrollbarX,
		getScrollbarY,
		getThumbX,
		getThumbY,
		getCorner,
	};
}

describe("ScrollArea", () => {
	// if (navigator.userAgent.includes("WebKit")) {
	// 	it.skip("skipped on webkit");
	// 	return;
	// }

	it("should have bits data attrs", async () => {
		setup({ type: "always", height: 5, numParagraphs: 10, wrapText: false });
		const parts = [
			"root",
			"viewport",
			"scrollbar-x",
			"scrollbar-y",
			"thumb-x",
			"thumb-y",
			"corner",
		];

		for (const part of parts) {
			const el = page.getByTestId(part);
			if (part.startsWith("scrollbar")) {
				await expect.element(el).toHaveAttribute("data-scroll-area-scrollbar");
			} else if (part.startsWith("thumb")) {
				await expect.element(el).toHaveAttribute("data-scroll-area-thumb");
			} else {
				await expect.element(el).toHaveAttribute(`data-scroll-area-${part}`);
			}
		}
	});

	it("should render the root and viewport elements", async () => {
		const t = setup();
		await expect.element(t.root).toBeInTheDocument();
		await expect.element(t.viewport).toBeInTheDocument();
	});

	it("should show scrollbars when content overflows", async () => {
		const t = setup({ numParagraphs: 20, height: 100 });

		await t.root.hover();

		await expectExists(t.getScrollbarY());
		await expectExists(t.getThumbY());
	});

	it("should hide scrollbars when content fits", async () => {
		const t = setup({ numParagraphs: 1, height: 400 });

		await t.root.hover();

		await expectNotExists(t.getScrollbarY());
		await expectNotExists(t.getThumbY());
	});

	it("should show horizontal scrollbar when text doesn't wrap", async () => {
		const t = setup({ wrapText: false, numParagraphs: 1, width: 50 });

		await t.root.hover();

		await expectExists(t.getScrollbarX());
		await expectExists(t.getThumbX());
	});

	it("should hide horizontal scrollbar when text wraps", async () => {
		const t = setup({ wrapText: true, numParagraphs: 1, width: 100 });

		await t.root.hover();

		await expectNotExists(t.getScrollbarX());
		await expectNotExists(t.getThumbX());
	});

	it("should show corner when both scrollbars are visible", async () => {
		const t = setup({ wrapText: false, numParagraphs: 20, height: 100, width: 50 });

		await t.root.hover();

		await expectExists(t.getCorner());
	});

	it("should hide corner when only one scrollbar is visible", async () => {
		const t = setup({ wrapText: true, numParagraphs: 20, height: 100 });

		await t.root.hover();

		await expectNotExists(t.getCorner());
	});

	it("should show scrollbars on hover when type is 'hover'", async () => {
		const t = setup({ type: "hover", numParagraphs: 20, height: 100 });

		await expectNotExists(t.getScrollbarY());

		await t.root.hover();
		await expectExists(t.getScrollbarY());

		// scrollbars should hide when leaving
		await t.root.unhover();
		await expectNotExists(t.getScrollbarY());
	});

	it("should always show scrollbars when type is 'always'", async () => {
		const t = setup({ type: "always", numParagraphs: 20, height: 100 });

		await expectExists(t.getScrollbarY());

		await t.root.hover();
		await expectExists(t.getScrollbarY());
		await t.root.unhover();
		await expectExists(t.getScrollbarY());
	});

	it("should show scrollbars on scroll when type is 'scroll'", async () => {
		const t = setup({ type: "scroll", numParagraphs: 20, height: 100 });

		expectNotExists(t.getScrollbarY());

		await t.viewport.click({ position: { x: 50, y: 50 } });
		await userEvent.keyboard(kbd.ARROW_DOWN);
		await expectExists(t.getScrollbarY());
	});

	it("should show scrollbars when content overflows when type is `auto`", async () => {
		const t = setup({ type: "auto", numParagraphs: 20, height: 100, width: 100 });

		await expectExists(t.getScrollbarY());
	});

	it("should respond to dynamic content changes", async () => {
		const t = setup({ numParagraphs: 1, height: 100 });

		await expectNotExists(t.getScrollbarY());

		await t.numParagraphsInput.click();
		await userEvent.keyboard("20");
		await userEvent.keyboard(kbd.ENTER);

		await t.root.hover();

		await expectExists(t.getScrollbarY());
	});

	it("should respond to size changes", async () => {
		const t = setup({ numParagraphs: 20, height: 400 });

		await expectNotExists(t.getScrollbarY());

		await t.heightInput.click();
		await t.heightInput.fill("100");
		await userEvent.keyboard(kbd.ENTER);

		await t.root.hover();

		await expectExists(t.getScrollbarY());
	});

	it("should allow wheel scrolling", async () => {
		if (navigator.userAgent.includes("WebKit")) {
			expect(true);
			return;
		}

		const t = setup({ numParagraphs: 20, height: 100 });

		await t.viewport.hover({ position: { x: 50, y: 50 } });
		await expectExists(t.getScrollbarY());

		const initialScrollTop = t.viewport.element().scrollTop;

		await t.viewport.click({ position: { x: 50, y: 50 } });
		await userEvent.keyboard(kbd.ARROW_DOWN);

		await vi.waitFor(() =>
			expect(t.viewport.element().scrollTop).toBeGreaterThan(initialScrollTop)
		);
	});

	it("should handle both scrollbars simultaneously", async () => {
		if (navigator.userAgent.includes("WebKit")) {
			expect(true);
			return;
		}

		const t = setup({ wrapText: false, numParagraphs: 20, height: 100, width: 50 });

		await t.root.hover();

		await expectExists(t.getScrollbarX());
		await expectExists(t.getScrollbarY());
		await expectExists(t.getCorner());

		const initialScrollTop = t.viewport.element().scrollTop;
		const initialScrollLeft = t.viewport.element().scrollLeft;

		await t.viewport.click();
		await userEvent.keyboard(kbd.ARROW_DOWN);
		await userEvent.keyboard(kbd.ARROW_RIGHT);

		await vi.waitFor(() =>
			expect(t.viewport.element().scrollTop).toBeGreaterThan(initialScrollTop)
		);
		await vi.waitFor(() =>
			expect(t.viewport.element().scrollLeft).toBeGreaterThan(initialScrollLeft)
		);
	});

	it("should handle keyboard navigation", async () => {
		if (navigator.userAgent.includes("WebKit")) {
			expect(true);
			return;
		}
		const t = setup({ numParagraphs: 20, height: 100 });

		await t.root.hover({ position: { x: 10, y: 10 } });
		await expectExists(t.getScrollbarY());

		await t.viewport.click();

		const initialScrollTop = t.viewport.element().scrollTop;

		await userEvent.keyboard(kbd.ARROW_DOWN);
		await vi.waitFor(() =>
			expect(t.viewport.element().scrollTop).toBeGreaterThan(initialScrollTop)
		);

		await userEvent.keyboard(kbd.PAGE_DOWN);
		await vi.waitFor(() =>
			expect(t.viewport.element().scrollTop).toBeGreaterThan(initialScrollTop)
		);

		await userEvent.keyboard(kbd.END);
		await vi.waitFor(() =>
			expect(t.viewport.element().scrollTop).toBeGreaterThan(initialScrollTop)
		);

		await userEvent.keyboard(kbd.HOME);
		await vi.waitFor(() => expect(t.viewport.element().scrollTop).toBe(0));
	});

	it("should handle RTL direction", async () => {
		if (navigator.userAgent.includes("WebKit")) {
			expect(true);
			return;
		}

		const t = setup({ dir: "rtl", wrapText: false, numParagraphs: 1, width: 50 });

		await t.root.hover();
		const scrollbarX = t.getScrollbarX();
		await expectExists(scrollbarX);

		const initialScrollLeft = t.viewport.element().scrollLeft;

		await t.viewport.click();
		await userEvent.keyboard(kbd.ARROW_LEFT);

		await vi.waitFor(() => expect(t.viewport.element().scrollLeft).not.toBe(initialScrollLeft));
	});

	it("should allow overriding predefined scrollbar styles via style prop", async () => {
		render(ScrollAreaStyleOverrideTest, { scrollbarYStyle: "top: 20px;" });

		const scrollbarY = page.getByTestId("scrollbar-y");
		await expectExists(scrollbarY);

		const element = scrollbarY.element() as HTMLElement;
		expect(element.style.top).toBe("20px");
	});
});
