import { expect, it, vi, describe } from "vitest";
import { render } from "vitest-browser-svelte";
import { getTestKbd } from "../utils.js";
import ScrollAreaTest, { type ScrollAreaTestProps } from "./scroll-area-test.svelte";
import { expectExists, expectNotExists, setupBrowserUserEvents } from "../browser-utils";

const kbd = getTestKbd();

function setup(props: ScrollAreaTestProps = {}) {
	const user = setupBrowserUserEvents();
	const returned = render(ScrollAreaTest, { ...props });

	const root = returned.getByTestId("root");
	const viewport = returned.getByTestId("viewport");
	const typeSelect = returned.getByTestId("type");
	const heightInput = returned.getByTestId("height");
	const widthInput = returned.getByTestId("width");
	const numParagraphsInput = returned.getByTestId("numParagraphs");

	function getScrollbarX() {
		return returned.getByTestId("scrollbar-x");
	}

	function getScrollbarY() {
		return returned.getByTestId("scrollbar-y");
	}

	function getThumbX() {
		return returned.getByTestId("thumb-x");
	}

	function getThumbY() {
		return returned.getByTestId("thumb-y");
	}

	function getCorner() {
		return returned.getByTestId("corner");
	}

	return {
		...returned,
		root,
		viewport,
		typeSelect,
		heightInput,
		widthInput,
		numParagraphsInput,
		user,
		getScrollbarX,
		getScrollbarY,
		getThumbX,
		getThumbY,
		getCorner,
	};
}

describe("ScrollArea", () => {
	if (navigator.userAgent.includes("WebKit")) {
		it.skip("skipped on webkit");
		return;
	}

	it("should have bits data attrs", async () => {
		const t = setup({ type: "always", height: 5, numParagraphs: 10, wrapText: false });
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
			const el = t.getByTestId(part);
			if (part.startsWith("scrollbar")) {
				expect(el).toHaveAttribute("data-scroll-area-scrollbar");
			} else if (part.startsWith("thumb")) {
				expect(el).toHaveAttribute("data-scroll-area-thumb");
			} else {
				expect(el).toHaveAttribute(`data-scroll-area-${part}`);
			}
		}
	});

	it("should render the root and viewport elements", async () => {
		const t = setup();
		expect(t.root).toBeInTheDocument();
		expect(t.viewport).toBeInTheDocument();
	});

	it("should show scrollbars when content overflows", async () => {
		const t = setup({ numParagraphs: 20, height: 100 });

		await t.user.hover(t.root);

		expectExists(t.getScrollbarY());
		expectExists(t.getThumbY());
	});

	it("should hide scrollbars when content fits", async () => {
		const t = setup({ numParagraphs: 1, height: 400 });

		await t.user.hover(t.root);

		expectNotExists(t.getScrollbarY());
		expectNotExists(t.getThumbY());
	});

	it("should show horizontal scrollbar when text doesn't wrap", async () => {
		const t = setup({ wrapText: false, numParagraphs: 1, width: 50 });

		await t.user.hover(t.root);

		expectExists(t.getScrollbarX());
		expectExists(t.getThumbX());
	});

	it("should hide horizontal scrollbar when text wraps", async () => {
		const t = setup({ wrapText: true, numParagraphs: 1, width: 100 });

		await t.user.hover(t.root);

		expectNotExists(t.getScrollbarX());
		expectNotExists(t.getThumbX());
	});

	it("should show corner when both scrollbars are visible", async () => {
		const t = setup({ wrapText: false, numParagraphs: 20, height: 100, width: 50 });

		await t.user.hover(t.root);

		expectExists(t.getCorner());
	});

	it("should hide corner when only one scrollbar is visible", async () => {
		const t = setup({ wrapText: true, numParagraphs: 20, height: 100 });

		await t.user.hover(t.root);

		expectNotExists(t.getCorner());
	});

	it("should show scrollbars on hover when type is 'hover'", async () => {
		const t = setup({ type: "hover", numParagraphs: 20, height: 100 });

		expectNotExists(t.getScrollbarY());

		await t.user.hover(t.root);
		expectExists(t.getScrollbarY());

		// scrollbars should hide when leaving
		await t.user.unhover(t.root);
		await vi.waitFor(() => expectNotExists(t.getScrollbarY()));
	});

	it("should always show scrollbars when type is 'always'", async () => {
		const t = setup({ type: "always", numParagraphs: 20, height: 100 });

		expectExists(t.getScrollbarY());

		await t.user.hover(t.root);
		expectExists(t.getScrollbarY());
		await t.user.unhover(t.root);
		expectExists(t.getScrollbarY());
	});

	it("should show scrollbars on scroll when type is 'scroll'", async () => {
		const t = setup({ type: "scroll", numParagraphs: 20, height: 100 });

		expectNotExists(t.getScrollbarY());

		await t.user.click(t.viewport, { position: { x: 50, y: 50 } });
		await t.user.keyboard(kbd.ARROW_DOWN);
		await vi.waitFor(() => expectExists(t.getScrollbarY()));
	});

	it("should show scrollbars when content overflows when type is `auto`", async () => {
		const t = setup({ type: "auto", numParagraphs: 20, height: 100, width: 100 });

		await vi.waitFor(() => expectExists(t.getScrollbarY()));
	});

	it("should respond to dynamic content changes", async () => {
		const t = setup({ numParagraphs: 1, height: 100 });

		expectNotExists(t.getScrollbarY());

		await t.user.click(t.numParagraphsInput);
		await t.user.keyboard("20");
		await t.user.keyboard(kbd.ENTER);

		await t.user.hover(t.root);

		expectExists(t.getScrollbarY());
	});

	it("should respond to size changes", async () => {
		const t = setup({ numParagraphs: 20, height: 400 });

		expectNotExists(t.getScrollbarY());

		await t.user.click(t.heightInput);
		await t.user.fill(t.heightInput, "100");
		await t.user.keyboard(kbd.ENTER);

		await t.user.hover(t.root);

		await vi.waitFor(() => expectExists(t.getScrollbarY()));
	});

	it("should allow wheel scrolling", async () => {
		if (navigator.userAgent.includes("WebKit")) {
			expect(true);
			return;
		}

		const t = setup({ numParagraphs: 20, height: 100 });

		await t.user.hover(t.viewport, { position: { x: 50, y: 50 } });
		await vi.waitFor(() => expectExists(t.getScrollbarY()));

		const initialScrollTop = t.viewport.element().scrollTop;

		await t.user.click(t.viewport, { position: { x: 50, y: 50 } });
		await t.user.keyboard(kbd.ARROW_DOWN);

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

		await t.user.hover(t.root);

		await vi.waitFor(() => expectExists(t.getScrollbarX()));
		await vi.waitFor(() => expectExists(t.getScrollbarY()));
		await vi.waitFor(() => expectExists(t.getCorner()));

		const initialScrollTop = t.viewport.element().scrollTop;
		const initialScrollLeft = t.viewport.element().scrollLeft;

		await t.user.click(t.viewport);
		await t.user.keyboard(kbd.ARROW_DOWN);
		await t.user.keyboard(kbd.ARROW_RIGHT);

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

		await t.user.hover(t.root, { position: { x: 10, y: 10 } });
		await vi.waitFor(() => expectExists(t.getScrollbarY()));

		await t.user.click(t.viewport);

		const initialScrollTop = t.viewport.element().scrollTop;

		await t.user.keyboard(kbd.ARROW_DOWN);
		await vi.waitFor(() =>
			expect(t.viewport.element().scrollTop).toBeGreaterThan(initialScrollTop)
		);

		await t.user.keyboard(kbd.PAGE_DOWN);
		await vi.waitFor(() =>
			expect(t.viewport.element().scrollTop).toBeGreaterThan(initialScrollTop)
		);

		await t.user.keyboard(kbd.END);
		await vi.waitFor(() =>
			expect(t.viewport.element().scrollTop).toBeGreaterThan(initialScrollTop)
		);

		await t.user.keyboard(kbd.HOME);
		await vi.waitFor(() => expect(t.viewport.element().scrollTop).toBe(0));
	});

	it("should handle RTL direction", async () => {
		if (navigator.userAgent.includes("WebKit")) {
			expect(true);
			return;
		}

		const t = setup({ dir: "rtl", wrapText: false, numParagraphs: 1, width: 50 });

		await t.user.hover(t.root);
		const scrollbarX = t.getScrollbarX();
		expectExists(scrollbarX);

		const initialScrollLeft = t.viewport.element().scrollLeft;

		await t.user.click(t.viewport);
		await t.user.keyboard(kbd.ARROW_LEFT);

		await vi.waitFor(() => expect(t.viewport.element().scrollLeft).not.toBe(initialScrollLeft));
	});
});
