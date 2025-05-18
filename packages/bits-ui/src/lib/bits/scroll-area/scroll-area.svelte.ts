/**
 * This logic is adapted from Radix UI ScrollArea component.
 * https://github.com/radix-ui/primitives/blob/main/packages/react/scroll-area/src/ScrollArea.tsx
 * Credit to Jenna Smith (@jjenzz) for the original implementation.
 * Incredible thought must have went into solving all the intricacies of this component.
 */

import { Context, useDebounce } from "runed";
import { untrack } from "svelte";
import { box, executeCallbacks, useRefById } from "svelte-toolbelt";
import type { ScrollAreaType } from "./types.js";
import type { ReadableBoxedValues } from "$lib/internal/box.svelte.js";
import { addEventListener } from "$lib/internal/events.js";
import type { BitsPointerEvent, WithRefProps } from "$lib/internal/types.js";
import { type Direction, type Orientation, mergeProps, useId } from "$lib/shared/index.js";
import { useStateMachine } from "$lib/internal/use-state-machine.svelte.js";
import { clamp } from "$lib/internal/clamp.js";
import { useResizeObserver } from "$lib/internal/use-resize-observer.svelte.js";
import { on } from "svelte/events";

const SCROLL_AREA_ROOT_ATTR = "data-scroll-area-root";
const SCROLL_AREA_VIEWPORT_ATTR = "data-scroll-area-viewport";
const SCROLL_AREA_CORNER_ATTR = "data-scroll-area-corner";
const SCROLL_AREA_THUMB_ATTR = "data-scroll-area-thumb";
const SCROLL_AREA_SCROLLBAR_ATTR = "data-scroll-area-scrollbar";

type Sizes = {
	content: number;
	viewport: number;
	scrollbar: {
		size: number;
		paddingStart: number;
		paddingEnd: number;
	};
};

type ScrollAreaRootStateProps = WithRefProps<
	ReadableBoxedValues<{
		dir: Direction;
		type: ScrollAreaType;
		scrollHideDelay: number;
	}>
>;

class ScrollAreaRootState {
	scrollAreaNode = $state<HTMLElement | null>(null);
	viewportNode = $state<HTMLElement | null>(null);
	contentNode = $state<HTMLElement | null>(null);
	scrollbarXNode = $state<HTMLElement | null>(null);
	scrollbarYNode = $state<HTMLElement | null>(null);
	cornerWidth = $state<number>(0);
	cornerHeight = $state<number>(0);
	scrollbarXEnabled = $state(false);
	scrollbarYEnabled = $state(false);

	constructor(readonly opts: ScrollAreaRootStateProps) {
		useRefById({
			...opts,
			onRefChange: (node) => {
				this.scrollAreaNode = node;
			},
		});
	}

	props = $derived.by(
		() =>
			({
				id: this.opts.id.current,
				dir: this.opts.dir.current,
				style: {
					position: "relative",
					"--bits-scroll-area-corner-height": `${this.cornerHeight}px`,
					"--bits-scroll-area-corner-width": `${this.cornerWidth}px`,
				},
				[SCROLL_AREA_ROOT_ATTR]: "",
			}) as const
	);
}

type ScrollAreaViewportStateProps = WithRefProps;

class ScrollAreaViewportState {
	#contentId = box(useId());
	#contentRef = box<HTMLElement | null>(null);

	constructor(
		readonly opts: ScrollAreaViewportStateProps,
		readonly root: ScrollAreaRootState
	) {
		useRefById({
			...opts,
			onRefChange: (node) => {
				this.root.viewportNode = node;
			},
		});

		useRefById({
			id: this.#contentId,
			ref: this.#contentRef,
			onRefChange: (node) => {
				this.root.contentNode = node;
			},
		});
	}

	props = $derived.by(
		() =>
			({
				id: this.opts.id.current,
				style: {
					overflowX: this.root.scrollbarXEnabled ? "scroll" : "hidden",
					overflowY: this.root.scrollbarYEnabled ? "scroll" : "hidden",
				},
				[SCROLL_AREA_VIEWPORT_ATTR]: "",
			}) as const
	);

	contentProps = $derived.by(
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
			}) as const
	);
}

type ScrollAreaScrollbarStateProps = WithRefProps<
	ReadableBoxedValues<{
		orientation: Orientation;
	}>
>;

class ScrollAreaScrollbarState {
	isHorizontal = $derived.by(() => this.opts.orientation.current === "horizontal");
	hasThumb = $state(false);

	constructor(
		readonly opts: ScrollAreaScrollbarStateProps,
		readonly root: ScrollAreaRootState
	) {
		$effect(() => {
			this.isHorizontal
				? (this.root.scrollbarXEnabled = true)
				: (this.root.scrollbarYEnabled = true);

			return () => {
				this.isHorizontal
					? (this.root.scrollbarXEnabled = false)
					: (this.root.scrollbarYEnabled = false);
			};
		});
	}
}

class ScrollAreaScrollbarHoverState {
	root: ScrollAreaRootState;
	isVisible = $state(false);

	constructor(readonly scrollbar: ScrollAreaScrollbarState) {
		this.root = scrollbar.root;

		$effect(() => {
			const scrollAreaNode = this.root.scrollAreaNode;
			const hideDelay = this.root.opts.scrollHideDelay.current;
			let hideTimer = 0;
			if (!scrollAreaNode) return;
			const handlePointerEnter = () => {
				window.clearTimeout(hideTimer);
				untrack(() => (this.isVisible = true));
			};

			const handlePointerLeave = () => {
				if (hideTimer) window.clearTimeout(hideTimer);
				hideTimer = window.setTimeout(() => {
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
				window.clearTimeout(hideTimer);
				unsubListeners();
			};
		});
	}

	props = $derived.by(
		() =>
			({
				"data-state": this.isVisible ? "visible" : "hidden",
			}) as const
	);
}

class ScrollAreaScrollbarScrollState {
	root: ScrollAreaRootState;
	machine = useStateMachine("hidden", {
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
	isHidden = $derived.by(() => this.machine.state.current === "hidden");

	constructor(readonly scrollbar: ScrollAreaScrollbarState) {
		this.root = scrollbar.root;

		const debounceScrollend = useDebounce(() => this.machine.dispatch("SCROLL_END"), 100);

		$effect(() => {
			const _state = this.machine.state.current;
			const scrollHideDelay = this.root.opts.scrollHideDelay.current;
			if (_state === "idle") {
				const hideTimer = window.setTimeout(
					() => this.machine.dispatch("HIDE"),
					scrollHideDelay
				);
				return () => window.clearTimeout(hideTimer);
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

	props = $derived.by(
		() =>
			({
				"data-state": this.machine.state.current === "hidden" ? "hidden" : "visible",
				onpointerenter: this.onpointerenter,
				onpointerleave: this.onpointerleave,
			}) as const
	);
}

class ScrollAreaScrollbarAutoState {
	root: ScrollAreaRootState;
	isVisible = $state(false);

	constructor(readonly scrollbar: ScrollAreaScrollbarState) {
		this.root = scrollbar.root;

		const handleResize = useDebounce(() => {
			const viewportNode = this.root.viewportNode;
			if (!viewportNode) return;
			const isOverflowX = viewportNode.offsetWidth < viewportNode.scrollWidth;
			const isOverflowY = viewportNode.offsetHeight < viewportNode.scrollHeight;
			this.isVisible = this.scrollbar.isHorizontal ? isOverflowX : isOverflowY;
		}, 10);

		useResizeObserver(() => this.root.viewportNode, handleResize);
		useResizeObserver(() => this.root.contentNode, handleResize);
	}

	props = $derived.by(
		() =>
			({
				"data-state": this.isVisible ? "visible" : "hidden",
			}) as const
	);
}

class ScrollAreaScrollbarVisibleState {
	root: ScrollAreaRootState;
	thumbNode = $state<HTMLElement | null>(null);
	pointerOffset = $state(0);
	sizes = $state.raw<Sizes>({
		content: 0,
		viewport: 0,
		scrollbar: { size: 0, paddingStart: 0, paddingEnd: 0 },
	});
	thumbRatio = $derived.by(() => getThumbRatio(this.sizes.viewport, this.sizes.content));
	hasThumb = $derived.by(() => Boolean(this.thumbRatio > 0 && this.thumbRatio < 1));
	// this needs to be a $state to properly restore the transform style when the scrollbar
	// goes from a hidden to visible state, otherwise it will start at the beginning of the
	// scrollbar and flicker to the correct position after
	prevTransformStyle = $state("");

	constructor(readonly scrollbar: ScrollAreaScrollbarState) {
		this.root = scrollbar.root;

		$effect(() => {
			this.scrollbar.hasThumb = this.hasThumb;
		});

		$effect.pre(() => {
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

type ScrollbarAxisStateProps = ReadableBoxedValues<{ mounted: boolean }>;

type ScrollbarAxisState = {
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
};

class ScrollAreaScrollbarXState implements ScrollbarAxisState {
	root: ScrollAreaRootState;
	computedStyle = $state<CSSStyleDeclaration>();
	scrollbar: ScrollAreaScrollbarState;

	constructor(
		readonly opts: ScrollbarAxisStateProps,
		readonly scrollbarVis: ScrollAreaScrollbarVisibleState
	) {
		this.scrollbarVis = scrollbarVis;
		this.root = scrollbarVis.root;
		this.scrollbar = scrollbarVis.scrollbar;

		useRefById({
			...this.scrollbar.opts,
			onRefChange: (node) => {
				this.root.scrollbarXNode = node;
			},
			deps: () => this.opts.mounted.current,
		});

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

	thumbSize = $derived.by(() => {
		return getThumbSize(this.scrollbarVis.sizes);
	});

	props = $derived.by(
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
			}) as const
	);
}

class ScrollAreaScrollbarYState implements ScrollbarAxisState {
	root: ScrollAreaRootState;
	scrollbar: ScrollAreaScrollbarState;
	computedStyle = $state<CSSStyleDeclaration>();

	constructor(
		readonly opts: ScrollbarAxisStateProps,
		readonly scrollbarVis: ScrollAreaScrollbarVisibleState
	) {
		this.root = scrollbarVis.root;
		this.scrollbar = scrollbarVis.scrollbar;

		useRefById({
			...this.scrollbar.opts,
			onRefChange: (node) => {
				this.root.scrollbarYNode = node;
			},
			deps: () => this.opts.mounted.current,
		});

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

	thumbSize = $derived.by(() => {
		return getThumbSize(this.scrollbarVis.sizes);
	});

	props = $derived.by(
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
			}) as const
	);
}

type ScrollbarAxis = ScrollAreaScrollbarXState | ScrollAreaScrollbarYState;

class ScrollAreaScrollbarSharedState {
	root: ScrollAreaRootState;
	scrollbarVis: ScrollAreaScrollbarVisibleState;
	scrollbar: ScrollAreaScrollbarState;
	rect = $state.raw<DOMRect | null>(null);
	prevWebkitUserSelect = $state<string>("");
	handleResize: () => void;
	handleThumbPositionChange: () => void;
	handleWheelScroll: (e: WheelEvent, maxScrollPos: number) => void;
	handleThumbPointerDown: (pointerPos: { x: number; y: number }) => void;
	handleThumbPointerUp: () => void;
	maxScrollPos = $derived.by(
		() => this.scrollbarVis.sizes.content - this.scrollbarVis.sizes.viewport
	);

	constructor(readonly scrollbarState: ScrollbarAxis) {
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

			const unsubListener = addEventListener(document, "wheel", handleWheel, {
				passive: false,
			});

			return unsubListener;
		});

		$effect.pre(() => {
			// react to changes to this:
			this.scrollbarVis.sizes;
			untrack(() => this.handleThumbPositionChange());
		});

		$effect.pre(() => {
			this.handleThumbPositionChange();
		});

		useResizeObserver(() => this.scrollbar.opts.ref.current, this.handleResize);
		useResizeObserver(() => this.root.contentNode, this.handleResize);

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
		this.prevWebkitUserSelect = document.body.style.webkitUserSelect;
		document.body.style.webkitUserSelect = "none";
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
		document.body.style.webkitUserSelect = this.prevWebkitUserSelect;
		if (this.root.viewportNode) this.root.viewportNode.style.scrollBehavior = "";
		this.rect = null;
	}

	props = $derived.by(() =>
		mergeProps({
			...this.scrollbarState.props,
			style: {
				position: "absolute",
				...this.scrollbarState.props.style,
			},
			[SCROLL_AREA_SCROLLBAR_ATTR]: "",
			onpointerdown: this.onpointerdown,
			onpointermove: this.onpointermove,
			onpointerup: this.onpointerup,
		})
	);
}

type ScrollAreaThumbImplStateProps = WithRefProps &
	ReadableBoxedValues<{
		mounted: boolean;
	}>;
class ScrollAreaThumbImplState {
	#root: ScrollAreaRootState;
	#removeUnlinkedScrollListener = $state<() => void>();
	#debounceScrollEnd = useDebounce(() => {
		if (this.#removeUnlinkedScrollListener) {
			this.#removeUnlinkedScrollListener();
			this.#removeUnlinkedScrollListener = undefined;
		}
	}, 100);

	constructor(
		readonly opts: ScrollAreaThumbImplStateProps,
		readonly scrollbarState: ScrollAreaScrollbarSharedState
	) {
		this.#root = scrollbarState.root;

		useRefById({
			...opts,
			onRefChange: (node) => {
				this.scrollbarState.scrollbarVis.thumbNode = node;
			},
			deps: () => this.opts.mounted.current,
		});

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
			this.scrollbarState.handleThumbPositionChange();
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

	props = $derived.by(
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
				[SCROLL_AREA_THUMB_ATTR]: "",
			}) as const
	);
}

type ScrollAreaCornerImplStateProps = WithRefProps;

class ScrollAreaCornerImplState {
	#width = $state(0);
	#height = $state(0);
	hasSize = $derived(Boolean(this.#width && this.#height));

	constructor(
		readonly opts: ScrollAreaCornerImplStateProps,
		readonly root: ScrollAreaRootState
	) {
		useResizeObserver(
			() => this.root.scrollbarXNode,
			() => {
				const height = this.root.scrollbarXNode?.offsetHeight || 0;
				this.root.cornerHeight = height;
				this.#height = height;
			}
		);

		useResizeObserver(
			() => this.root.scrollbarYNode,
			() => {
				const width = this.root.scrollbarYNode?.offsetWidth || 0;
				this.root.cornerWidth = width;
				this.#width = width;
			}
		);

		useRefById(opts);
	}

	props = $derived.by(() => ({
		id: this.opts.id.current,
		style: {
			width: this.#width,
			height: this.#height,
			position: "absolute",
			right: this.root.opts.dir.current === "ltr" ? 0 : undefined,
			left: this.root.opts.dir.current === "rtl" ? 0 : undefined,
			bottom: 0,
		},
		[SCROLL_AREA_CORNER_ATTR]: "",
	}));
}

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

export function useScrollAreaRoot(props: ScrollAreaRootStateProps) {
	return ScrollAreaRootContext.set(new ScrollAreaRootState(props));
}

export function useScrollAreaViewport(props: ScrollAreaViewportStateProps) {
	return new ScrollAreaViewportState(props, ScrollAreaRootContext.get());
}

export function useScrollAreaScrollbar(props: ScrollAreaScrollbarStateProps) {
	return ScrollAreaScrollbarContext.set(
		new ScrollAreaScrollbarState(props, ScrollAreaRootContext.get())
	);
}

export function useScrollAreaScrollbarVisible() {
	return ScrollAreaScrollbarVisibleContext.set(
		new ScrollAreaScrollbarVisibleState(ScrollAreaScrollbarContext.get())
	);
}

export function useScrollAreaScrollbarAuto() {
	return new ScrollAreaScrollbarAutoState(ScrollAreaScrollbarContext.get());
}

export function useScrollAreaScrollbarScroll() {
	return new ScrollAreaScrollbarScrollState(ScrollAreaScrollbarContext.get());
}

export function useScrollAreaScrollbarHover() {
	return new ScrollAreaScrollbarHoverState(ScrollAreaScrollbarContext.get());
}

export function useScrollAreaScrollbarX(props: ScrollbarAxisStateProps) {
	return ScrollAreaScrollbarAxisContext.set(
		new ScrollAreaScrollbarXState(props, ScrollAreaScrollbarVisibleContext.get())
	);
}

export function useScrollAreaScrollbarY(props: ScrollbarAxisStateProps) {
	return ScrollAreaScrollbarAxisContext.set(
		new ScrollAreaScrollbarYState(props, ScrollAreaScrollbarVisibleContext.get())
	);
}

export function useScrollAreaScrollbarShared() {
	return ScrollAreaScrollbarSharedContext.set(
		new ScrollAreaScrollbarSharedState(ScrollAreaScrollbarAxisContext.get())
	);
}

export function useScrollAreaThumb(props: ScrollAreaThumbImplStateProps) {
	return new ScrollAreaThumbImplState(props, ScrollAreaScrollbarSharedContext.get());
}

export function useScrollAreaCorner(props: ScrollAreaCornerImplStateProps) {
	return new ScrollAreaCornerImplState(props, ScrollAreaRootContext.get());
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
	(function loop() {
		const position = { left: node.scrollLeft, top: node.scrollTop };
		const isHorizontalScroll = prevPosition.left !== position.left;
		const isVerticalScroll = prevPosition.top !== position.top;
		if (isHorizontalScroll || isVerticalScroll) handler();
		prevPosition = position;
		rAF = window.requestAnimationFrame(loop);
	})();

	return () => window.cancelAnimationFrame(rAF);
}
