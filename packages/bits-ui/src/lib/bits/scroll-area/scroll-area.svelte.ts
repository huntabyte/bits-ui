/**
 * This logic is adapted from Radix UI ScrollArea component.
 * https://github.com/radix-ui/primitives/blob/main/packages/react/scroll-area/src/ScrollArea.tsx
 * Credit to Jenna Smith (@jjenzz) for the original implementation.
 * Incredible thought must have went into solving all the intricacies of this component.
 */

import { Context, useDebounce, watch } from "runed";
import { untrack } from "svelte";
import {
	box,
	executeCallbacks,
	attachRef,
	DOMContext,
	getWindow,
	type ReadableBoxedValues,
} from "svelte-toolbelt";
import type { ScrollAreaType } from "./types.js";
import { addEventListener } from "$lib/internal/events.js";
import type { BitsPointerEvent, RefAttachment, WithRefOpts } from "$lib/internal/types.js";
import { type Direction, type Orientation, mergeProps, useId } from "$lib/shared/index.js";
import { clamp } from "$lib/internal/clamp.js";
import { on } from "svelte/events";
import { createBitsAttrs } from "$lib/internal/attrs.js";
import { StateMachine } from "$lib/internal/state-machine.js";
import { SvelteResizeObserver } from "$lib/internal/svelte-resize-observer.svelte.js";

const scrollAreaAttrs = createBitsAttrs({
	component: "scroll-area",
	parts: ["root", "viewport", "corner", "thumb", "scrollbar"],
});

export const ScrollAreaRootContext = new Context<ScrollAreaRootState>("ScrollArea.Root");
export const ScrollAreaScrollbarContext = new Context<ScrollAreaScrollbarState>(
	"ScrollArea.Scrollbar"
);
export const ScrollAreaScrollbarVisibleContext = new Context<ScrollAreaScrollbarVisibleState>(
	"ScrollArea.ScrollbarVisible"
);
export const ScrollAreaScrollbarAxisContext = new Context<ScrollbarAxis>(
	"ScrollArea.ScrollbarAxis"
);
export const ScrollAreaScrollbarSharedContext = new Context<ScrollAreaScrollbarSharedState>(
	"ScrollArea.ScrollbarShared"
);

interface Sizes {
	content: number;
	viewport: number;
	scrollbar: {
		size: number;
		paddingStart: number;
		paddingEnd: number;
	};
}

interface ScrollAreaRootStateOpts
	extends WithRefOpts,
		ReadableBoxedValues<{
			dir: Direction;
			type: ScrollAreaType;
			scrollHideDelay: number;
		}> {}

export class ScrollAreaRootState {
	static create(opts: ScrollAreaRootStateOpts) {
		return ScrollAreaRootContext.set(new ScrollAreaRootState(opts));
	}

	readonly opts: ScrollAreaRootStateOpts;
	readonly attachment: RefAttachment;
	scrollAreaNode = $state<HTMLElement | null>(null);
	viewportNode = $state<HTMLElement | null>(null);
	contentNode = $state<HTMLElement | null>(null);
	scrollbarXNode = $state<HTMLElement | null>(null);
	scrollbarYNode = $state<HTMLElement | null>(null);
	cornerWidth = $state<number>(0);
	cornerHeight = $state<number>(0);
	scrollbarXEnabled = $state(false);
	scrollbarYEnabled = $state(false);
	domContext: DOMContext;

	constructor(opts: ScrollAreaRootStateOpts) {
		this.opts = opts;
		this.attachment = attachRef(opts.ref, (v) => (this.scrollAreaNode = v));
		this.domContext = new DOMContext(opts.ref);
	}

	readonly props = $derived.by(
		() =>
			({
				id: this.opts.id.current,
				dir: this.opts.dir.current,
				style: {
					position: "relative",
					"--bits-scroll-area-corner-height": `${this.cornerHeight}px`,
					"--bits-scroll-area-corner-width": `${this.cornerWidth}px`,
				},
				[scrollAreaAttrs.root]: "",
				...this.attachment,
			}) as const
	);
}

interface ScrollAreaViewportStateOpts extends WithRefOpts {}

export class ScrollAreaViewportState {
	static create(opts: ScrollAreaViewportStateOpts) {
		return new ScrollAreaViewportState(opts, ScrollAreaRootContext.get());
	}

	readonly opts: ScrollAreaViewportStateOpts;
	readonly root: ScrollAreaRootState;
	readonly attachment: RefAttachment;
	#contentId = box(useId());
	#contentRef = box<HTMLElement | null>(null);
	readonly contentAttachment: RefAttachment = attachRef(
		this.#contentRef,
		(v) => (this.root.contentNode = v)
	);

	constructor(opts: ScrollAreaViewportStateOpts, root: ScrollAreaRootState) {
		this.opts = opts;
		this.root = root;
		this.attachment = attachRef(opts.ref, (v) => (this.root.viewportNode = v));
	}

	readonly props = $derived.by(
		() =>
			({
				id: this.opts.id.current,
				style: {
					overflowX: this.root.scrollbarXEnabled ? "scroll" : "hidden",
					overflowY: this.root.scrollbarYEnabled ? "scroll" : "hidden",
				},
				[scrollAreaAttrs.viewport]: "",
				...this.attachment,
			}) as const
	);

	readonly contentProps = $derived.by(
		() =>
			({
				id: this.#contentId.current,
				"data-scroll-area-content": "",
				/**
				 * When horizontal scrollbar is visible: this element should be at least
				 * as wide as its children for size calculations to work correctly.
				 *
				 * When horizontal scrollbar is NOT visible: this element's width should
				 * be constrained by the parent container to enable `text-overflow: ellipsis`
				 */
				style: { minWidth: this.root.scrollbarXEnabled ? "fit-content" : undefined },
				...this.contentAttachment,
			}) as const
	);
}

interface ScrollAreaScrollbarStateOpts
	extends WithRefOpts,
		ReadableBoxedValues<{
			orientation: Orientation;
		}> {}

export class ScrollAreaScrollbarState {
	static create(opts: ScrollAreaScrollbarStateOpts) {
		return ScrollAreaScrollbarContext.set(
			new ScrollAreaScrollbarState(opts, ScrollAreaRootContext.get())
		);
	}
	readonly opts: ScrollAreaScrollbarStateOpts;
	readonly root: ScrollAreaRootState;
	readonly isHorizontal = $derived.by(() => this.opts.orientation.current === "horizontal");
	hasThumb = $state(false);

	constructor(opts: ScrollAreaScrollbarStateOpts, root: ScrollAreaRootState) {
		this.opts = opts;
		this.root = root;

		watch(
			() => this.isHorizontal,
			(isHorizontal) => {
				if (isHorizontal) {
					this.root.scrollbarXEnabled = true;
					return () => {
						this.root.scrollbarXEnabled = false;
					};
				} else {
					this.root.scrollbarYEnabled = true;
					return () => {
						this.root.scrollbarYEnabled = false;
					};
				}
			}
		);
	}
}

export class ScrollAreaScrollbarHoverState {
	static create() {
		return new ScrollAreaScrollbarHoverState(ScrollAreaScrollbarContext.get());
	}
	readonly scrollbar: ScrollAreaScrollbarState;
	root: ScrollAreaRootState;
	isVisible = $state(false);

	constructor(scrollbar: ScrollAreaScrollbarState) {
		this.scrollbar = scrollbar;
		this.root = scrollbar.root;

		$effect(() => {
			const scrollAreaNode = this.root.scrollAreaNode;
			const hideDelay = this.root.opts.scrollHideDelay.current;
			let hideTimer = 0;
			if (!scrollAreaNode) return;
			const handlePointerEnter = () => {
				this.root.domContext.clearTimeout(hideTimer);
				untrack(() => (this.isVisible = true));
			};

			const handlePointerLeave = () => {
				if (hideTimer) this.root.domContext.clearTimeout(hideTimer);
				hideTimer = this.root.domContext.setTimeout(() => {
					untrack(() => {
						this.scrollbar.hasThumb = false;
						this.isVisible = false;
					});
				}, hideDelay);
			};

			const unsubListeners = executeCallbacks(
				on(scrollAreaNode, "pointerenter", handlePointerEnter),
				on(scrollAreaNode, "pointerleave", handlePointerLeave)
			);

			return () => {
				this.root.domContext.getWindow().clearTimeout(hideTimer);
				unsubListeners();
			};
		});
	}

	readonly props = $derived.by(
		() =>
			({
				"data-state": this.isVisible ? "visible" : "hidden",
			}) as const
	);
}

export class ScrollAreaScrollbarScrollState {
	static create() {
		return new ScrollAreaScrollbarScrollState(ScrollAreaScrollbarContext.get());
	}
	readonly scrollbar: ScrollAreaScrollbarState;
	readonly root: ScrollAreaRootState;
	readonly machine = new StateMachine("hidden", {
		hidden: {
			SCROLL: "scrolling",
		},
		scrolling: {
			SCROLL_END: "idle",
			POINTER_ENTER: "interacting",
		},
		interacting: {
			SCROLL: "interacting",
			POINTER_LEAVE: "idle",
		},
		idle: {
			HIDE: "hidden",
			SCROLL: "scrolling",
			POINTER_ENTER: "interacting",
		},
	});
	readonly isHidden = $derived.by(() => this.machine.state.current === "hidden");

	constructor(scrollbar: ScrollAreaScrollbarState) {
		this.scrollbar = scrollbar;
		this.root = scrollbar.root;

		const debounceScrollend = useDebounce(() => this.machine.dispatch("SCROLL_END"), 100);

		$effect(() => {
			const _state = this.machine.state.current;
			const scrollHideDelay = this.root.opts.scrollHideDelay.current;
			if (_state === "idle") {
				const hideTimer = this.root.domContext.setTimeout(
					() => this.machine.dispatch("HIDE"),
					scrollHideDelay
				);
				return () => this.root.domContext.clearTimeout(hideTimer);
			}
		});

		$effect(() => {
			const viewportNode = this.root.viewportNode;
			if (!viewportNode) return;
			const scrollDirection = this.scrollbar.isHorizontal ? "scrollLeft" : "scrollTop";

			let prevScrollPos = viewportNode[scrollDirection];
			const handleScroll = () => {
				const scrollPos = viewportNode[scrollDirection];
				const hasScrollInDirectionChanged = prevScrollPos !== scrollPos;
				if (hasScrollInDirectionChanged) {
					this.machine.dispatch("SCROLL");
					debounceScrollend();
				}
				prevScrollPos = scrollPos;
			};

			const unsubListener = addEventListener(viewportNode, "scroll", handleScroll);
			return unsubListener;
		});

		this.onpointerenter = this.onpointerenter.bind(this);
		this.onpointerleave = this.onpointerleave.bind(this);
	}

	onpointerenter(_: BitsPointerEvent) {
		this.machine.dispatch("POINTER_ENTER");
	}

	onpointerleave(_: BitsPointerEvent) {
		this.machine.dispatch("POINTER_LEAVE");
	}

	readonly props = $derived.by(
		() =>
			({
				"data-state": this.machine.state.current === "hidden" ? "hidden" : "visible",
				onpointerenter: this.onpointerenter,
				onpointerleave: this.onpointerleave,
			}) as const
	);
}

export class ScrollAreaScrollbarAutoState {
	static create() {
		return new ScrollAreaScrollbarAutoState(ScrollAreaScrollbarContext.get());
	}
	readonly scrollbar: ScrollAreaScrollbarState;
	readonly root: ScrollAreaRootState;
	isVisible = $state(false);

	constructor(scrollbar: ScrollAreaScrollbarState) {
		this.scrollbar = scrollbar;
		this.root = scrollbar.root;

		const handleResize = useDebounce(() => {
			const viewportNode = this.root.viewportNode;
			if (!viewportNode) return;
			const isOverflowX = viewportNode.offsetWidth < viewportNode.scrollWidth;
			const isOverflowY = viewportNode.offsetHeight < viewportNode.scrollHeight;
			this.isVisible = this.scrollbar.isHorizontal ? isOverflowX : isOverflowY;
		}, 10);

		new SvelteResizeObserver(() => this.root.viewportNode, handleResize);
		new SvelteResizeObserver(() => this.root.contentNode, handleResize);
	}

	readonly props = $derived.by(
		() =>
			({
				"data-state": this.isVisible ? "visible" : "hidden",
			}) as const
	);
}

export class ScrollAreaScrollbarVisibleState {
	static create() {
		return ScrollAreaScrollbarVisibleContext.set(
			new ScrollAreaScrollbarVisibleState(ScrollAreaScrollbarContext.get())
		);
	}
	readonly scrollbar: ScrollAreaScrollbarState;
	readonly root: ScrollAreaRootState;
	thumbNode = $state<HTMLElement | null>(null);
	pointerOffset = $state(0);
	sizes = $state.raw<Sizes>({
		content: 0,
		viewport: 0,
		scrollbar: { size: 0, paddingStart: 0, paddingEnd: 0 },
	});
	readonly thumbRatio = $derived.by(() => getThumbRatio(this.sizes.viewport, this.sizes.content));
	readonly hasThumb = $derived.by(() => Boolean(this.thumbRatio > 0 && this.thumbRatio < 1));
	// this needs to be a $state to properly restore the transform style when the scrollbar
	// goes from a hidden to visible state, otherwise it will start at the beginning of the
	// scrollbar and flicker to the correct position after
	prevTransformStyle = $state("");

	constructor(scrollbar: ScrollAreaScrollbarState) {
		this.scrollbar = scrollbar;
		this.root = scrollbar.root;

		$effect(() => {
			this.scrollbar.hasThumb = this.hasThumb;
		});

		$effect(() => {
			if (!this.scrollbar.hasThumb && this.thumbNode) {
				this.prevTransformStyle = this.thumbNode.style.transform;
			}
		});
	}

	setSizes(sizes: Sizes) {
		this.sizes = sizes;
	}

	getScrollPosition(pointerPos: number, dir?: Direction) {
		return getScrollPositionFromPointer({
			pointerPos,
			pointerOffset: this.pointerOffset,
			sizes: this.sizes,
			dir,
		});
	}

	onThumbPointerUp() {
		this.pointerOffset = 0;
	}

	onThumbPointerDown(pointerPos: number) {
		this.pointerOffset = pointerPos;
	}

	xOnThumbPositionChange() {
		if (!(this.root.viewportNode && this.thumbNode)) return;
		const scrollPos = this.root.viewportNode.scrollLeft;
		const offset = getThumbOffsetFromScroll({
			scrollPos,
			sizes: this.sizes,
			dir: this.root.opts.dir.current,
		});
		const transformStyle = `translate3d(${offset}px, 0, 0)`;
		this.thumbNode.style.transform = transformStyle;
		this.prevTransformStyle = transformStyle;
	}

	xOnWheelScroll(scrollPos: number) {
		if (!this.root.viewportNode) return;
		this.root.viewportNode.scrollLeft = scrollPos;
	}

	xOnDragScroll(pointerPos: number) {
		if (!this.root.viewportNode) return;
		this.root.viewportNode.scrollLeft = this.getScrollPosition(
			pointerPos,
			this.root.opts.dir.current
		);
	}

	yOnThumbPositionChange() {
		if (!(this.root.viewportNode && this.thumbNode)) return;
		const scrollPos = this.root.viewportNode.scrollTop;
		const offset = getThumbOffsetFromScroll({ scrollPos, sizes: this.sizes });
		const transformStyle = `translate3d(0, ${offset}px, 0)`;
		this.thumbNode.style.transform = transformStyle;
		this.prevTransformStyle = transformStyle;
	}

	yOnWheelScroll(scrollPos: number) {
		if (!this.root.viewportNode) return;
		this.root.viewportNode.scrollTop = scrollPos;
	}

	yOnDragScroll(pointerPos: number) {
		if (!this.root.viewportNode) return;
		this.root.viewportNode.scrollTop = this.getScrollPosition(
			pointerPos,
			this.root.opts.dir.current
		);
	}
}

interface ScrollbarAxisStateOpts extends ReadableBoxedValues<{ mounted: boolean }> {}

interface ScrollbarAxisState {
	onThumbPointerDown: (pointerPos: { x: number; y: number }) => void;
	onDragScroll: (pointerPos: { x: number; y: number }) => void;
	onWheelScroll: (e: WheelEvent, maxScrollPos: number) => void;
	onResize: () => void;
	onThumbPositionChange: () => void;
	onThumbPointerUp: () => void;
	props: {
		id: string;
		"data-orientation": "horizontal" | "vertical";
		style: Record<string, string | number | undefined>;
	};
}

export class ScrollAreaScrollbarXState implements ScrollbarAxisState {
	static create(opts: ScrollbarAxisStateOpts) {
		return ScrollAreaScrollbarAxisContext.set(
			new ScrollAreaScrollbarXState(opts, ScrollAreaScrollbarVisibleContext.get())
		);
	}
	readonly opts: ScrollbarAxisStateOpts;
	readonly scrollbarVis: ScrollAreaScrollbarVisibleState;
	readonly root: ScrollAreaRootState;
	readonly scrollbar: ScrollAreaScrollbarState;
	readonly attachment: RefAttachment;
	computedStyle = $state<CSSStyleDeclaration>();

	constructor(opts: ScrollbarAxisStateOpts, scrollbarVis: ScrollAreaScrollbarVisibleState) {
		this.opts = opts;
		this.scrollbarVis = scrollbarVis;
		this.root = scrollbarVis.root;
		this.scrollbar = scrollbarVis.scrollbar;
		this.attachment = attachRef(this.scrollbar.opts.ref, (v) => (this.root.scrollbarXNode = v));

		$effect(() => {
			if (!this.scrollbar.opts.ref.current) return;
			if (this.opts.mounted.current) {
				this.computedStyle = getComputedStyle(this.scrollbar.opts.ref.current!);
			}
		});

		$effect(() => {
			// Ensure when a user scrolls down and then the scrollbar is hidden
			// that when it shows again it will be positioned correctly.
			this.onResize();
		});
	}

	onThumbPointerDown = (pointerPos: { x: number; y: number }) => {
		this.scrollbarVis.onThumbPointerDown(pointerPos.x);
	};

	onDragScroll = (pointerPos: { x: number; y: number }) => {
		this.scrollbarVis.xOnDragScroll(pointerPos.x);
	};

	onThumbPointerUp = () => {
		this.scrollbarVis.onThumbPointerUp();
	};

	onThumbPositionChange = () => {
		this.scrollbarVis.xOnThumbPositionChange();
	};

	onWheelScroll = (e: WheelEvent, maxScrollPos: number) => {
		if (!this.root.viewportNode) return;
		const scrollPos = this.root.viewportNode.scrollLeft + e.deltaX;
		this.scrollbarVis.xOnWheelScroll(scrollPos);
		// prevent window scroll when wheeling scrollbar
		if (isScrollingWithinScrollbarBounds(scrollPos, maxScrollPos)) {
			e.preventDefault();
		}
	};

	onResize = () => {
		if (!(this.scrollbar.opts.ref.current && this.root.viewportNode && this.computedStyle))
			return;
		this.scrollbarVis.setSizes({
			content: this.root.viewportNode.scrollWidth,
			viewport: this.root.viewportNode.offsetWidth,
			scrollbar: {
				size: this.scrollbar.opts.ref.current.clientWidth,
				paddingStart: toInt(this.computedStyle.paddingLeft),
				paddingEnd: toInt(this.computedStyle.paddingRight),
			},
		});
	};

	readonly thumbSize = $derived.by(() => {
		return getThumbSize(this.scrollbarVis.sizes);
	});

	readonly props = $derived.by(
		() =>
			({
				id: this.scrollbar.opts.id.current,
				"data-orientation": "horizontal",
				style: {
					bottom: 0,
					left:
						this.root.opts.dir.current === "rtl"
							? "var(--bits-scroll-area-corner-width)"
							: 0,
					right:
						this.root.opts.dir.current === "ltr"
							? "var(--bits-scroll-area-corner-width)"
							: 0,
					"--bits-scroll-area-thumb-width": `${this.thumbSize}px`,
				},
				...this.attachment,
			}) as const
	);
}

export class ScrollAreaScrollbarYState implements ScrollbarAxisState {
	static create(opts: ScrollbarAxisStateOpts) {
		return ScrollAreaScrollbarAxisContext.set(
			new ScrollAreaScrollbarYState(opts, ScrollAreaScrollbarVisibleContext.get())
		);
	}
	readonly opts: ScrollbarAxisStateOpts;
	readonly scrollbarVis: ScrollAreaScrollbarVisibleState;
	readonly root: ScrollAreaRootState;
	readonly scrollbar: ScrollAreaScrollbarState;
	readonly attachment: RefAttachment;
	computedStyle = $state<CSSStyleDeclaration>();

	constructor(opts: ScrollbarAxisStateOpts, scrollbarVis: ScrollAreaScrollbarVisibleState) {
		this.opts = opts;
		this.scrollbarVis = scrollbarVis;
		this.root = scrollbarVis.root;
		this.scrollbar = scrollbarVis.scrollbar;
		this.attachment = attachRef(this.scrollbar.opts.ref, (v) => (this.root.scrollbarYNode = v));

		$effect(() => {
			if (!this.scrollbar.opts.ref.current) return;
			if (this.opts.mounted.current) {
				this.computedStyle = getComputedStyle(this.scrollbar.opts.ref.current!);
			}
		});

		$effect(() => {
			// Ensure when a user scrolls down and then the scrollbar is hidden
			// that when it shows again it will be positioned correctly.
			this.onResize();
		});

		this.onThumbPointerDown = this.onThumbPointerDown.bind(this);
		this.onDragScroll = this.onDragScroll.bind(this);
		this.onThumbPointerUp = this.onThumbPointerUp.bind(this);
		this.onThumbPositionChange = this.onThumbPositionChange.bind(this);
		this.onWheelScroll = this.onWheelScroll.bind(this);
		this.onResize = this.onResize.bind(this);
	}

	onThumbPointerDown(pointerPos: { x: number; y: number }) {
		this.scrollbarVis.onThumbPointerDown(pointerPos.y);
	}

	onDragScroll(pointerPos: { x: number; y: number }) {
		this.scrollbarVis.yOnDragScroll(pointerPos.y);
	}

	onThumbPointerUp() {
		this.scrollbarVis.onThumbPointerUp();
	}

	onThumbPositionChange() {
		this.scrollbarVis.yOnThumbPositionChange();
	}

	onWheelScroll(e: WheelEvent, maxScrollPos: number) {
		if (!this.root.viewportNode) return;
		const scrollPos = this.root.viewportNode.scrollTop + e.deltaY;
		this.scrollbarVis.yOnWheelScroll(scrollPos);
		// prevent window scroll when wheeling scrollbar
		if (isScrollingWithinScrollbarBounds(scrollPos, maxScrollPos)) {
			e.preventDefault();
		}
	}

	onResize() {
		if (!(this.scrollbar.opts.ref.current && this.root.viewportNode && this.computedStyle))
			return;
		this.scrollbarVis.setSizes({
			content: this.root.viewportNode.scrollHeight,
			viewport: this.root.viewportNode.offsetHeight,
			scrollbar: {
				size: this.scrollbar.opts.ref.current.clientHeight,
				paddingStart: toInt(this.computedStyle.paddingTop),
				paddingEnd: toInt(this.computedStyle.paddingBottom),
			},
		});
	}

	readonly thumbSize = $derived.by(() => {
		return getThumbSize(this.scrollbarVis.sizes);
	});

	readonly props = $derived.by(
		() =>
			({
				id: this.scrollbar.opts.id.current,
				"data-orientation": "vertical",
				style: {
					top: 0,
					right: this.root.opts.dir.current === "ltr" ? 0 : undefined,
					left: this.root.opts.dir.current === "rtl" ? 0 : undefined,
					bottom: "var(--bits-scroll-area-corner-height)",
					"--bits-scroll-area-thumb-height": `${this.thumbSize}px`,
				},
				...this.attachment,
			}) as const
	);
}

type ScrollbarAxis = ScrollAreaScrollbarXState | ScrollAreaScrollbarYState;

export class ScrollAreaScrollbarSharedState {
	static create() {
		return ScrollAreaScrollbarSharedContext.set(
			new ScrollAreaScrollbarSharedState(ScrollAreaScrollbarAxisContext.get())
		);
	}
	readonly scrollbarState: ScrollbarAxis;
	readonly root: ScrollAreaRootState;
	readonly scrollbarVis: ScrollAreaScrollbarVisibleState;
	readonly scrollbar: ScrollAreaScrollbarState;
	rect = $state.raw<DOMRect | null>(null);
	prevWebkitUserSelect = $state<string>("");
	handleResize: () => void;
	handleThumbPositionChange: () => void;
	handleWheelScroll: (e: WheelEvent, maxScrollPos: number) => void;
	handleThumbPointerDown: (pointerPos: { x: number; y: number }) => void;
	handleThumbPointerUp: () => void;
	readonly maxScrollPos = $derived.by(
		() => this.scrollbarVis.sizes.content - this.scrollbarVis.sizes.viewport
	);

	constructor(scrollbarState: ScrollbarAxis) {
		this.scrollbarState = scrollbarState;
		this.root = scrollbarState.root;
		this.scrollbarVis = scrollbarState.scrollbarVis;
		this.scrollbar = scrollbarState.scrollbarVis.scrollbar;
		this.handleResize = useDebounce(() => this.scrollbarState.onResize(), 10);
		this.handleThumbPositionChange = this.scrollbarState.onThumbPositionChange;
		this.handleWheelScroll = this.scrollbarState.onWheelScroll;
		this.handleThumbPointerDown = this.scrollbarState.onThumbPointerDown;
		this.handleThumbPointerUp = this.scrollbarState.onThumbPointerUp;

		$effect(() => {
			const maxScrollPos = this.maxScrollPos;
			const scrollbarNode = this.scrollbar.opts.ref.current;
			// we want to react to the viewport node changing so we leave this here
			this.root.viewportNode;
			const handleWheel = (e: WheelEvent) => {
				const node = e.target as HTMLElement;
				const isScrollbarWheel = scrollbarNode?.contains(node);
				if (isScrollbarWheel) this.handleWheelScroll(e, maxScrollPos);
			};

			const unsubListener = addEventListener(
				this.root.domContext.getDocument(),
				"wheel",
				handleWheel,
				{
					passive: false,
				}
			);

			return unsubListener;
		});

		$effect.pre(() => {
			// react to changes to this:
			this.scrollbarVis.sizes;
			untrack(() => this.handleThumbPositionChange());
		});

		// $effect.pre(() => {
		// 	this.handleThumbPositionChange();
		// });

		new SvelteResizeObserver(() => this.scrollbar.opts.ref.current, this.handleResize);
		new SvelteResizeObserver(() => this.root.contentNode, this.handleResize);

		this.onpointerdown = this.onpointerdown.bind(this);
		this.onpointermove = this.onpointermove.bind(this);
		this.onpointerup = this.onpointerup.bind(this);
	}

	handleDragScroll(e: PointerEvent) {
		if (!this.rect) return;
		const x = e.clientX - this.rect.left;
		const y = e.clientY - this.rect.top;
		this.scrollbarState.onDragScroll({ x, y });
	}

	onpointerdown(e: BitsPointerEvent) {
		if (e.button !== 0) return;
		const target = e.target as HTMLElement;
		target.setPointerCapture(e.pointerId);
		this.rect = this.scrollbar.opts.ref.current?.getBoundingClientRect() ?? null;
		// pointer capture doesn't prevent text selection in Safari
		// so we remove text selection manually when scrolling
		this.prevWebkitUserSelect = this.root.domContext.getDocument().body.style.webkitUserSelect;
		this.root.domContext.getDocument().body.style.webkitUserSelect = "none";
		if (this.root.viewportNode) this.root.viewportNode.style.scrollBehavior = "auto";
		this.handleDragScroll(e);
	}

	onpointermove(e: BitsPointerEvent) {
		this.handleDragScroll(e);
	}

	onpointerup(e: BitsPointerEvent) {
		const target = e.target as HTMLElement;
		if (target.hasPointerCapture(e.pointerId)) {
			target.releasePointerCapture(e.pointerId);
		}
		this.root.domContext.getDocument().body.style.webkitUserSelect = this.prevWebkitUserSelect;
		if (this.root.viewportNode) this.root.viewportNode.style.scrollBehavior = "";
		this.rect = null;
	}

	readonly props = $derived.by(() =>
		mergeProps({
			...this.scrollbarState.props,
			style: {
				position: "absolute",
				...this.scrollbarState.props.style,
			},
			[scrollAreaAttrs.scrollbar]: "",
			onpointerdown: this.onpointerdown,
			onpointermove: this.onpointermove,
			onpointerup: this.onpointerup,
		})
	);
}

interface ScrollAreaThumbImplStateOpts
	extends WithRefOpts,
		ReadableBoxedValues<{
			mounted: boolean;
		}> {}

export class ScrollAreaThumbImplState {
	static create(opts: ScrollAreaThumbImplStateOpts) {
		return new ScrollAreaThumbImplState(opts, ScrollAreaScrollbarSharedContext.get());
	}
	readonly opts: ScrollAreaThumbImplStateOpts;
	readonly scrollbarState: ScrollAreaScrollbarSharedState;
	readonly attachment: RefAttachment;
	readonly #root: ScrollAreaRootState;
	#removeUnlinkedScrollListener = $state<() => void>();
	readonly #debounceScrollEnd = useDebounce(() => {
		if (this.#removeUnlinkedScrollListener) {
			this.#removeUnlinkedScrollListener();
			this.#removeUnlinkedScrollListener = undefined;
		}
	}, 100);

	constructor(
		opts: ScrollAreaThumbImplStateOpts,
		scrollbarState: ScrollAreaScrollbarSharedState
	) {
		this.opts = opts;
		this.scrollbarState = scrollbarState;
		this.#root = scrollbarState.root;
		this.attachment = attachRef(
			this.opts.ref,
			(v) => (this.scrollbarState.scrollbarVis.thumbNode = v)
		);

		$effect(() => {
			const viewportNode = this.#root.viewportNode;
			if (!viewportNode) return;
			const handleScroll = () => {
				this.#debounceScrollEnd();
				if (!this.#removeUnlinkedScrollListener) {
					const listener = addUnlinkedScrollListener(
						viewportNode,
						this.scrollbarState.handleThumbPositionChange
					);
					this.#removeUnlinkedScrollListener = listener;
					this.scrollbarState.handleThumbPositionChange();
				}
			};
			untrack(() => this.scrollbarState.handleThumbPositionChange());
			const unsubListener = addEventListener(viewportNode, "scroll", handleScroll);
			return unsubListener;
		});

		this.onpointerdowncapture = this.onpointerdowncapture.bind(this);
		this.onpointerup = this.onpointerup.bind(this);
	}

	onpointerdowncapture(e: BitsPointerEvent) {
		const thumb = e.target as HTMLElement;
		if (!thumb) return;
		const thumbRect = thumb.getBoundingClientRect();
		const x = e.clientX - thumbRect.left;
		const y = e.clientY - thumbRect.top;
		this.scrollbarState.handleThumbPointerDown({ x, y });
	}

	onpointerup(_: BitsPointerEvent) {
		this.scrollbarState.handleThumbPointerUp();
	}

	readonly props = $derived.by(
		() =>
			({
				id: this.opts.id.current,
				"data-state": this.scrollbarState.scrollbarVis.hasThumb ? "visible" : "hidden",
				style: {
					width: "var(--bits-scroll-area-thumb-width)",
					height: "var(--bits-scroll-area-thumb-height)",
					transform: this.scrollbarState.scrollbarVis.prevTransformStyle,
				},
				onpointerdowncapture: this.onpointerdowncapture,
				onpointerup: this.onpointerup,
				[scrollAreaAttrs.thumb]: "",
				...this.attachment,
			}) as const
	);
}

interface ScrollAreaCornerImplStateOpts extends WithRefOpts {}

export class ScrollAreaCornerImplState {
	static create(opts: ScrollAreaCornerImplStateOpts) {
		return new ScrollAreaCornerImplState(opts, ScrollAreaRootContext.get());
	}

	readonly opts: ScrollAreaCornerImplStateOpts;
	readonly root: ScrollAreaRootState;
	readonly attachment: RefAttachment;
	#width = $state(0);
	#height = $state(0);
	readonly hasSize = $derived(Boolean(this.#width && this.#height));

	constructor(opts: ScrollAreaCornerImplStateOpts, root: ScrollAreaRootState) {
		this.opts = opts;
		this.root = root;
		this.attachment = attachRef(this.opts.ref);

		new SvelteResizeObserver(
			() => this.root.scrollbarXNode,
			() => {
				const height = this.root.scrollbarXNode?.offsetHeight || 0;
				this.root.cornerHeight = height;
				this.#height = height;
			}
		);

		new SvelteResizeObserver(
			() => this.root.scrollbarYNode,
			() => {
				const width = this.root.scrollbarYNode?.offsetWidth || 0;
				this.root.cornerWidth = width;
				this.#width = width;
			}
		);
	}

	readonly props = $derived.by(() => ({
		id: this.opts.id.current,
		style: {
			width: this.#width,
			height: this.#height,
			position: "absolute",
			right: this.root.opts.dir.current === "ltr" ? 0 : undefined,
			left: this.root.opts.dir.current === "rtl" ? 0 : undefined,
			bottom: 0,
		},
		[scrollAreaAttrs.corner]: "",
		...this.attachment,
	}));
}

function toInt(value?: string) {
	return value ? Number.parseInt(value, 10) : 0;
}

function getThumbRatio(viewportSize: number, contentSize: number) {
	const ratio = viewportSize / contentSize;
	return Number.isNaN(ratio) ? 0 : ratio;
}

function getThumbSize(sizes: Sizes) {
	const ratio = getThumbRatio(sizes.viewport, sizes.content);
	const scrollbarPadding = sizes.scrollbar.paddingStart + sizes.scrollbar.paddingEnd;
	const thumbSize = (sizes.scrollbar.size - scrollbarPadding) * ratio;
	return Math.max(thumbSize, 18);
}

type GetScrollPositionFromPointerProps = {
	pointerPos: number;
	pointerOffset: number;
	sizes: Sizes;
	dir?: Direction;
};

function getScrollPositionFromPointer({
	pointerPos,
	pointerOffset,
	sizes,
	dir = "ltr",
}: GetScrollPositionFromPointerProps) {
	const thumbSizePx = getThumbSize(sizes);
	const thumbCenter = thumbSizePx / 2;
	const offset = pointerOffset || thumbCenter;
	const thumbOffsetFromEnd = thumbSizePx - offset;
	const minPointerPos = sizes.scrollbar.paddingStart + offset;
	const maxPointerPos = sizes.scrollbar.size - sizes.scrollbar.paddingEnd - thumbOffsetFromEnd;
	const maxScrollPos = sizes.content - sizes.viewport;
	const scrollRange = dir === "ltr" ? [0, maxScrollPos] : [maxScrollPos * -1, 0];
	const interpolate = linearScale(
		[minPointerPos, maxPointerPos],
		scrollRange as [number, number]
	);
	return interpolate(pointerPos);
}

type GetThumbOffsetFromScrollProps = {
	scrollPos: number;
	sizes: Sizes;
	dir?: Direction;
};

function getThumbOffsetFromScroll({
	scrollPos,
	sizes,
	dir = "ltr",
}: GetThumbOffsetFromScrollProps) {
	const thumbSizePx = getThumbSize(sizes);
	const scrollbarPadding = sizes.scrollbar.paddingStart + sizes.scrollbar.paddingEnd;
	const scrollbar = sizes.scrollbar.size - scrollbarPadding;
	const maxScrollPos = sizes.content - sizes.viewport;
	const maxThumbPos = scrollbar - thumbSizePx;
	const scrollClampRange = dir === "ltr" ? [0, maxScrollPos] : [maxScrollPos * -1, 0];
	const scrollWithoutMomentum = clamp(scrollPos, scrollClampRange[0]!, scrollClampRange[1]!);
	const interpolate = linearScale([0, maxScrollPos], [0, maxThumbPos]);
	return interpolate(scrollWithoutMomentum);
}

// https://github.com/tmcw-up-for-adoption/simple-linear-scale/blob/master/index.js
function linearScale(input: readonly [number, number], output: readonly [number, number]) {
	return (value: number) => {
		if (input[0] === input[1] || output[0] === output[1]) return output[0];
		const ratio = (output[1] - output[0]) / (input[1] - input[0]);
		return output[0] + ratio * (value - input[0]);
	};
}

function isScrollingWithinScrollbarBounds(scrollPos: number, maxScrollPos: number) {
	return scrollPos > 0 && scrollPos < maxScrollPos;
}

function addUnlinkedScrollListener(node: HTMLElement, handler: () => void) {
	let prevPosition = { left: node.scrollLeft, top: node.scrollTop };
	let rAF = 0;
	const win = getWindow(node);

	(function loop() {
		const position = { left: node.scrollLeft, top: node.scrollTop };
		const isHorizontalScroll = prevPosition.left !== position.left;
		const isVerticalScroll = prevPosition.top !== position.top;
		if (isHorizontalScroll || isVerticalScroll) handler();
		prevPosition = position;
		rAF = win.requestAnimationFrame(loop);
	})();

	return () => win.cancelAnimationFrame(rAF);
}
