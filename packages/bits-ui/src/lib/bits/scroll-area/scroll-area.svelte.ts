import type { ReadableBoxedValues } from "$lib/internal/box.svelte.js";
import { executeCallbacks } from "$lib/internal/callbacks.js";
import { addEventListener } from "$lib/internal/events.js";
import type { WithRefProps } from "$lib/internal/types.js";
import { useRefById } from "$lib/internal/useRefById.svelte.js";
import type { Direction, Orientation } from "$lib/shared/index.js";
import { useDebounce } from "runed";
import type { ScrollAreaType } from "./types.js";
import { useStateMachine } from "$lib/internal/useStateMachine.svelte.js";
import { clamp } from "$lib/internal/clamp.js";
import { useResizeObserver } from "$lib/internal/useResizeObserver.svelte.js";

const SCROLL_AREA_ROOT_ATTR = "data-scroll-area-root";
const SCROLL_AREA_VIEWPORT_ATTR = "data-scroll-area-viewport";
const SCROLL_AREA_CONTENT_ATTR = "data-scroll-area-content";
const SCROLL_AREA_CORNER_ATTR = "data-scroll-area-corner";

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
	#id: ScrollAreaRootStateProps["id"];
	#ref: ScrollAreaRootStateProps["ref"];
	dir: ScrollAreaRootStateProps["dir"];
	type: ScrollAreaRootStateProps["type"];
	scrollHideDelay: ScrollAreaRootStateProps["scrollHideDelay"];
	scrollAreaNode = $state<HTMLElement | null>(null);
	viewportNode = $state<HTMLElement | null>(null);
	contentNode = $state<HTMLElement | null>(null);
	scrollbarXNode = $state<HTMLElement | null>(null);
	scrollbarYNode = $state<HTMLElement | null>(null);
	cornerWidth = $state<number>(0);
	cornerHeight = $state<number>(0);
	scrollbarXEnabled = $state(false);
	scrollbarYEnabled = $state(false);

	constructor(props: ScrollAreaRootStateProps) {
		this.#id = props.id;
		this.#ref = props.ref;
		this.dir = props.dir;
		this.type = props.type;
		this.scrollHideDelay = props.scrollHideDelay;

		useRefById({
			id: this.#id,
			ref: this.#ref,
			onRefChange: (node) => {
				this.scrollAreaNode = node;
			},
		});
	}

	props = $derived.by(
		() =>
			({
				id: this.#id.value,
				dir: this.dir.value,
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
	#id: ScrollAreaViewportStateProps["id"];
	#ref: ScrollAreaViewportStateProps["ref"];
	root: ScrollAreaRootState;

	constructor(props: ScrollAreaViewportStateProps, root: ScrollAreaRootState) {
		this.#id = props.id;
		this.#ref = props.ref;
		this.root = root;

		useRefById({
			id: this.#id,
			ref: this.#ref,
			onRefChange: (node) => {
				this.root.viewportNode = node;
			},
		});
	}

	props = $derived.by(
		() =>
			({
				id: this.#id.value,
				style: {
					overflowX: this.root.scrollbarXEnabled ? "scroll" : "hidden",
					overflowY: this.root.scrollbarYEnabled ? "scroll" : "hidden",
				},
				[SCROLL_AREA_VIEWPORT_ATTR]: "",
			}) as const
	);
}

type ScrollAreaContentStateProps = WithRefProps;

class ScrollAreaContentState {
	#id: ScrollAreaContentStateProps["id"];
	#ref: ScrollAreaContentStateProps["ref"];
	root: ScrollAreaRootState;

	constructor(props: ScrollAreaContentStateProps, root: ScrollAreaRootState) {
		this.#id = props.id;
		this.#ref = props.ref;
		this.root = root;

		useRefById({
			id: this.#id,
			ref: this.#ref,
			onRefChange: (node) => {
				this.root.contentNode = node;
			},
		});
	}

	props = $derived.by(
		() =>
			({
				id: this.#id.value,
				style: {
					minWidth: "100%",
					display: "table",
				},
			}) as const
	);
}

type ScrollAreaScrollbarStateProps = WithRefProps<
	ReadableBoxedValues<{
		orientation: Orientation;
	}>
>;

class ScrollAreaScrollbarState {
	root: ScrollAreaRootState;
	orientation: ScrollAreaScrollbarStateProps["orientation"];
	isHorizontal = $derived.by(() => this.orientation.value === "horizontal");

	constructor(props: ScrollAreaScrollbarStateProps, root: ScrollAreaRootState) {
		this.root = root;
		this.orientation = props.orientation;

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

	constructor(scrollbar: ScrollAreaScrollbarState) {
		this.root = scrollbar.root;

		$effect(() => {
			const scrollAreaNode = this.root.scrollAreaNode;
			const hideDelay = this.root.scrollHideDelay.value;
			let hideTimer = 0;
			if (scrollAreaNode) {
				const handlePointerEnter = () => {
					window.clearTimeout(hideTimer);
					this.isVisible = true;
				};

				const handlePointerLeave = () => {
					hideTimer = window.setTimeout(() => {
						this.isVisible = false;
					}, hideDelay);
				};

				const unsubListeners = executeCallbacks(
					addEventListener(scrollAreaNode, "pointerenter", handlePointerEnter),
					addEventListener(scrollAreaNode, "pointerleave", handlePointerLeave)
				);

				return () => {
					window.clearTimeout(hideTimer);
					unsubListeners();
				};
			}
		});
	}

	props = $derived.by(
		() =>
			({
				"data-state": this.isVisible ? "visible" : "hidden",
			}) as const
	);
}

type ScrollAreaScrolbarScrollStateProps = WithRefProps &
	ReadableBoxedValues<{
		orientation: Orientation;
	}>;

class ScrollAreaScrollbarScrollState {
	orientation: ScrollAreaScrolbarScrollStateProps["orientation"];
	root: ScrollAreaRootState;
	scrollbar: ScrollAreaScrollbarState;
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

	constructor(props: ScrollAreaScrolbarScrollStateProps, scrollbar: ScrollAreaScrollbarState) {
		this.scrollbar = scrollbar;
		this.root = scrollbar.root;
		this.orientation = props.orientation;

		const debounceScrollend = useDebounce(() => this.machine.dispatch("SCROLL_END"), 100);

		$effect(() => {
			const _state = this.machine.state.value;
			const scrollHideDelay = this.root.scrollHideDelay.value;
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
	}

	#onpointerenter = () => {
		this.machine.dispatch("POINTER_ENTER");
	};

	#onpointerleave = () => {
		this.machine.dispatch("POINTER_LEAVE");
	};

	props = $derived.by(
		() =>
			({
				"data-state": this.machine.state.value === "hidden" ? "hidden" : "visible",
				onpointerenter: this.#onpointerenter,
				onpointerleave: this.#onpointerleave,
			}) as const
	);
}

type ScrollAreaScrollbarAutoStateProps = WithRefProps;

class ScrollAreaScrollbarAutoState {
	scrollbar: ScrollAreaScrollbarState;
	root: ScrollAreaRootState;
	isVisible = $state(false);

	constructor(props: ScrollAreaScrollbarAutoStateProps, scrollbar: ScrollAreaScrollbarState) {
		this.scrollbar = scrollbar;
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
	scrollbar: ScrollAreaScrollbarState;
	root: ScrollAreaRootState;
	thumbNode = $state<HTMLElement | null>(null);
	pointerOffset = $state(0);
	sizes = $state<Sizes>({
		content: 0,
		viewport: 0,
		scrollbar: { size: 0, paddingStart: 0, paddingEnd: 0 },
	});
	thumbRatio = getThumbRatio(this.sizes.viewport, this.sizes.content);
	hasThumb = $derived.by(() => Boolean(this.thumbRatio > 0 && this.thumbRatio < 1));

	constructor(scrollbar: ScrollAreaScrollbarState) {
		this.scrollbar = scrollbar;
		this.root = scrollbar.root;
	}

	getScrollPosition = (pointerPos: number, dir?: Direction) => {
		return getScrollPositionFromPointer({
			pointerPos,
			pointerOffset: this.pointerOffset,
			sizes: this.sizes,
			dir,
		});
	};

	onThumbPointerUp = () => {
		this.pointerOffset = 0;
	};

	onThumbPointerDown = (pointerPos: number) => {
		this.pointerOffset = pointerPos;
	};

	xOnThumbPositionChange = () => {
		if (!(this.root.viewportNode && this.thumbNode)) return;
		const scrollPos = this.root.viewportNode.scrollLeft;
		const offset = getThumbOffsetFromScroll({
			scrollPos,
			sizes: this.sizes,
			dir: this.root.dir.value,
		});
		this.thumbNode.style.transform = `translate3d(${offset}px, 0, 0)`;
	};

	xOnWheelScroll = (scrollPos: number) => {
		if (!this.root.viewportNode) return;
		this.root.viewportNode.scrollLeft = scrollPos;
	};

	xOnDragScroll = (pointerPos: number) => {
		if (!this.root.viewportNode) return;
		this.root.viewportNode.scrollLeft = this.getScrollPosition(pointerPos, this.root.dir.value);
	};

	yOnThumbPositionChange = () => {
		if (!(this.root.viewportNode && this.thumbNode)) return;
		const scrollPos = this.root.viewportNode.scrollTop;
		const offset = getThumbOffsetFromScroll({ scrollPos, sizes: this.sizes });
		this.thumbNode.style.transform = `translate3d(0, ${offset}px, 0)`;
	};

	yOnWheelScroll = (scrollPos: number) => {
		if (!this.root.viewportNode) return;
		this.root.viewportNode.scrollTop = scrollPos;
	};

	yOnDragScroll = (pointerPos: number) => {
		if (!this.root.viewportNode) return;
		this.root.viewportNode.scrollTop = this.getScrollPosition(pointerPos);
	};
}

function toInt(value?: string) {
	return value ? parseInt(value, 10) : 0;
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
