import { expect, it, vi, describe } from "vitest";
import { render } from "vitest-browser-svelte";
import { getTestKbd } from "../utils.js";
import ScrollAreaTest, { type ScrollAreaTestProps } from "./scroll-area-test.svelte";
import { expectExists, expectNotExists, setupBrowserUserEvents } from "../browser-utils";

const kbd = getTestKbd();

function setup(props: ScrollAreaTestProps = {}) {
	const user = setupBrowserUserEvents();
	const t = render(ScrollAreaTest, { ...props });

	const root = t.getByTestId("root").element() as HTMLElement;
	const viewport = t.getByTestId("viewport").element() as HTMLElement;
	const typeSelect = t.getByTestId("type").element() as HTMLElement;
	const heightInput = t.getByTestId("height").element() as HTMLElement;
	const widthInput = t.getByTestId("width").element() as HTMLElement;
	const numParagraphsInput = t.getByTestId("numParagraphs").element() as HTMLElement;

	function getScrollbarX() {
		return t.getByTestId("scrollbar-x");
	}

	function getScrollbarY() {
		return t.getByTestId("scrollbar-y");
	}

	function getThumbX() {
		return t.getByTestId("thumb-x");
	}

	function getThumbY() {
		return t.getByTestId("thumb-y");
	}

	function getCorner() {
		return t.getByTestId("corner");
	}

	return {
		...t,
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

		await expectExists(t.getScrollbarY());
		await expectExists(t.getThumbY());
	});

	it("should hide scrollbars when content fits", async () => {
		const t = setup({ numParagraphs: 1, height: 400 });

		await t.user.hover(t.root);

		await expectNotExists(t.getScrollbarY());
		await expectNotExists(t.getThumbY());
	});

	it("should show horizontal scrollbar when text doesn't wrap", async () => {
		const t = setup({ wrapText: false, numParagraphs: 1, width: 50 });

		await t.user.hover(t.root);

		await expectExists(t.getScrollbarX());
		await expectExists(t.getThumbX());
	});

	it("should hide horizontal scrollbar when text wraps", async () => {
		const t = setup({ wrapText: true, numParagraphs: 1, width: 100 });

		await t.user.hover(t.root);

		await expectNotExists(t.getScrollbarX());
		await expectNotExists(t.getThumbX());
	});

	it("should show corner when both scrollbars are visible", async () => {
		const t = setup({ wrapText: false, numParagraphs: 20, height: 100, width: 50 });

		await t.user.hover(t.root);

		await expectExists(t.getCorner());
	});

	it("should hide corner when only one scrollbar is visible", async () => {
		const t = setup({ wrapText: true, numParagraphs: 20, height: 100 });

		await t.user.hover(t.root);

		await expectNotExists(t.getCorner());
	});

	it("should show scrollbars on hover when type is 'hover'", async () => {
		const t = setup({ type: "hover", numParagraphs: 20, height: 100 });

		await expectNotExists(t.getScrollbarY());

		await t.user.hover(t.root);
		await expectExists(t.getScrollbarY());

		// scrollbars should hide when leaving
		await t.user.unhover(t.root);
		await expectNotExists(t.getScrollbarY());
	});

	it("should always show scrollbars when type is 'always'", async () => {
		const t = setup({ type: "always", numParagraphs: 20, height: 100 });

		await expectExists(t.getScrollbarY());

		await t.user.hover(t.root);
		await expectExists(t.getScrollbarY());
		await t.user.unhover(t.root);
		await expectExists(t.getScrollbarY());
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

		await expectExists(t.getScrollbarY());
	});

	it("should respond to dynamic content changes", async () => {
		const t = setup({ numParagraphs: 1, height: 100 });

		await expectNotExists(t.getScrollbarY());

		await t.user.click(t.numParagraphsInput);
		await t.user.keyboard("20");
		await t.user.keyboard(kbd.ENTER);

		await t.user.hover(t.root);

		await expectExists(t.getScrollbarY());
	});

	it("should respond to size changes", async () => {
		const t = setup({ numParagraphs: 20, height: 400 });

		await expectNotExists(t.getScrollbarY());

		await t.user.click(t.heightInput);
		await t.user.fill(t.heightInput, "100");
		await t.user.keyboard(kbd.ENTER);

		await t.user.hover(t.root);

		await expectExists(t.getScrollbarY());
	});

	it("should allow wheel scrolling", async () => {
		if (navigator.userAgent.includes("WebKit")) {
			expect(true);
			return;
		}

		const t = setup({ numParagraphs: 20, height: 100 });

		await t.user.hover(t.viewport, { position: { x: 50, y: 50 } });
		await expectExists(t.getScrollbarY());

		const initialScrollTop = t.viewport.scrollTop;

		await t.user.click(t.viewport, { position: { x: 50, y: 50 } });
		await t.user.keyboard(kbd.ARROW_DOWN);

		await vi.waitFor(() => expect(t.viewport.scrollTop).toBeGreaterThan(initialScrollTop));
	});

	it("should handle both scrollbars simultaneously", async () => {
		if (navigator.userAgent.includes("WebKit")) {
			expect(true);
			return;
		}

		const t = setup({ wrapText: false, numParagraphs: 20, height: 100, width: 50 });

		await t.user.hover(t.root);

		await expectExists(t.getScrollbarX());
		await expectExists(t.getScrollbarY());
		await expectExists(t.getCorner());

		const initialScrollTop = t.viewport.scrollTop;
		const initialScrollLeft = t.viewport.scrollLeft;

		await t.user.click(t.viewport);
		await t.user.keyboard(kbd.ARROW_DOWN);
		await t.user.keyboard(kbd.ARROW_RIGHT);

		await vi.waitFor(() => expect(t.viewport.scrollTop).toBeGreaterThan(initialScrollTop));
		await vi.waitFor(() => expect(t.viewport.scrollLeft).toBeGreaterThan(initialScrollLeft));
	});

	it("should handle keyboard navigation", async () => {
		if (navigator.userAgent.includes("WebKit")) {
			expect(true);
			return;
		}
		const t = setup({ numParagraphs: 20, height: 100 });

		await t.user.hover(t.root, { position: { x: 10, y: 10 } });
		await expectExists(t.getScrollbarY());

		await t.user.click(t.viewport);

		const initialScrollTop = t.viewport.scrollTop;

		await t.user.keyboard(kbd.ARROW_DOWN);
		await vi.waitFor(() => expect(t.viewport.scrollTop).toBeGreaterThan(initialScrollTop));

		await t.user.keyboard(kbd.PAGE_DOWN);
		await vi.waitFor(() => expect(t.viewport.scrollTop).toBeGreaterThan(initialScrollTop));

		await t.user.keyboard(kbd.END);
		await vi.waitFor(() => expect(t.viewport.scrollTop).toBeGreaterThan(initialScrollTop));

		await t.user.keyboard(kbd.HOME);
		await vi.waitFor(() => expect(t.viewport.scrollTop).toBe(0));
	});

	it("should handle RTL direction", async () => {
		if (navigator.userAgent.includes("WebKit")) {
			expect(true);
			return;
		}

		const t = setup({ dir: "rtl", wrapText: false, numParagraphs: 1, width: 50 });

		await t.user.hover(t.root);
		const scrollbarX = t.getScrollbarX();
		await expectExists(scrollbarX);

		const initialScrollLeft = t.viewport.scrollLeft;

		await t.user.click(t.viewport);
		await t.user.keyboard(kbd.ARROW_LEFT);

		await vi.waitFor(() => expect(t.viewport.scrollLeft).not.toBe(initialScrollLeft));
	});
});
