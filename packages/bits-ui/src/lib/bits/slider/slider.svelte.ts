/**
 * This logic is adapted from the @melt-ui/svelte slider, which was mostly written by
 * Abdelrahman (https://github.com/abdel-17)
 */
import { untrack } from "svelte";
import {
	executeCallbacks,
	onMountEffect,
	attachRef,
	type Box,
	type ReadableBox,
	DOMContext,
	type ReadableBoxedValues,
	type WritableBoxedValues,
} from "svelte-toolbelt";
import { on } from "svelte/events";
import { Context, watch } from "runed";
import {
	getRangeStyles,
	getThumbStyles,
	getTickStyles,
	normalizeSteps,
	snapValueToCustomSteps,
	getAdjacentStepValue,
	getTickLabelStyles,
	getThumbLabelStyles,
} from "./helpers.js";
import {
	createBitsAttrs,
	getAriaDisabled,
	getAriaOrientation,
	getDataDisabled,
	getDataOrientation,
} from "$lib/internal/attrs.js";
import { kbd } from "$lib/internal/kbd.js";
import { isElementOrSVGElement } from "$lib/internal/is.js";
import { isValidIndex } from "$lib/internal/arrays.js";
import type {
	BitsKeyboardEvent,
	OnChangeFn,
	RefAttachment,
	WithRefOpts,
} from "$lib/internal/types.js";
import type { Direction, Orientation, SliderThumbPositioning } from "$lib/shared/index.js";
import { linearScale } from "$lib/internal/math.js";
import type { SliderLabelPosition } from "./types.js";

const sliderAttrs = createBitsAttrs({
	component: "slider",
	parts: ["root", "thumb", "range", "tick", "tick-label", "thumb-label"],
});

export const SliderRootContext = new Context<SliderRoot>("Slider.Root");

interface SliderBaseRootStateOpts
	extends WithRefOpts,
		ReadableBoxedValues<{
			disabled: boolean;
			orientation: Orientation;
			min: number;
			max: number;
			step: number | number[];
			dir: Direction;
			autoSort: boolean;
			thumbPositioning: SliderThumbPositioning;
			trackPadding?: number;
		}> {}

abstract class SliderBaseRootState {
	readonly opts: SliderBaseRootStateOpts;
	readonly attachment: RefAttachment;
	isActive = $state(false);
	readonly direction: "rl" | "lr" | "tb" | "bt" = $derived.by(() => {
		if (this.opts.orientation.current === "horizontal") {
			return this.opts.dir.current === "rtl" ? "rl" : "lr";
		} else {
			return this.opts.dir.current === "rtl" ? "tb" : "bt";
		}
	});

	// Normalized steps array for consistent handling
	readonly normalizedSteps = $derived.by(() => {
		return normalizeSteps(this.opts.step.current, this.opts.min.current, this.opts.max.current);
	});
	domContext: DOMContext;

	constructor(opts: SliderBaseRootStateOpts) {
		this.opts = opts;
		this.attachment = attachRef(opts.ref);
		this.domContext = new DOMContext(this.opts.ref);
	}

	isThumbActive(_index: number) {
		return this.isActive;
	}

	readonly #touchAction = $derived.by(() => {
		if (this.opts.disabled.current) return undefined;
		return this.opts.orientation.current === "horizontal" ? "pan-y" : "pan-x";
	});

	getAllThumbs = () => {
		const node = this.opts.ref.current;
		if (!node) return [];
		return Array.from(node.querySelectorAll<HTMLElement>(sliderAttrs.selector("thumb")));
	};

	getThumbScale = (): [number, number] => {
		// If trackPadding is explicitly set, use it directly instead of calculating from thumb size
		const trackPadding = this.opts.trackPadding?.current;
		if (trackPadding !== undefined && trackPadding > 0) {
			return [trackPadding, 100 - trackPadding];
		}

		if (this.opts.thumbPositioning.current === "exact") {
			// User opted out of containment
			return [0, 100];
		}

		const isVertical = this.opts.orientation.current === "vertical";

		// this assumes all thumbs are the same width
		const activeThumb = this.getAllThumbs()[0];

		const thumbSize = isVertical ? activeThumb?.offsetHeight : activeThumb?.offsetWidth;
		// if thumb size is undefined or 0, fallback to a 0-100 scale
		if (thumbSize === undefined || Number.isNaN(thumbSize) || thumbSize === 0) return [0, 100];

		const trackSize = isVertical
			? this.opts.ref.current?.offsetHeight
			: this.opts.ref.current?.offsetWidth;

		// if track size is undefined or 0, fallback to a 0-100 scale
		if (trackSize === undefined || Number.isNaN(trackSize) || trackSize === 0) return [0, 100];

		// the padding on either side
		// half the width of the thumb
		const percentPadding = (thumbSize / 2 / trackSize) * 100;

		const min = percentPadding;
		const max = 100 - percentPadding;

		return [min, max];
	};

	getPositionFromValue = (thumbValue: number) => {
		const thumbScale = this.getThumbScale();

		const scale = linearScale([this.opts.min.current, this.opts.max.current], thumbScale);

		return scale(thumbValue);
	};

	readonly props = $derived.by(
		() =>
			({
				id: this.opts.id.current,
				"data-orientation": getDataOrientation(this.opts.orientation.current),
				"data-disabled": getDataDisabled(this.opts.disabled.current),
				style: {
					touchAction: this.#touchAction,
				},
				[sliderAttrs.root]: "",
				...this.attachment,
			}) as const
	);
}

interface SliderSingleRootStateOpts
	extends SliderBaseRootStateOpts,
		ReadableBoxedValues<{
			onValueCommit: OnChangeFn<number>;
		}>,
		WritableBoxedValues<{
			value: number;
		}> {}

class SliderSingleRootState extends SliderBaseRootState {
	readonly opts: SliderSingleRootStateOpts;
	isMulti = false as const;

	constructor(opts: SliderSingleRootStateOpts) {
		super(opts);
		this.opts = opts;

		onMountEffect(() => {
			return executeCallbacks(
				on(this.domContext.getDocument(), "pointerdown", this.handlePointerDown),
				on(this.domContext.getDocument(), "pointerup", this.handlePointerUp),
				on(this.domContext.getDocument(), "pointermove", this.handlePointerMove),
				on(this.domContext.getDocument(), "pointerleave", this.handlePointerUp)
			);
		});

		watch(
			[
				() => this.opts.step.current,
				() => this.opts.min.current,
				() => this.opts.max.current,
				() => this.opts.value.current,
			],
			([step, min, max, value]) => {
				const steps = normalizeSteps(step, min, max);

				const isValidValue = (v: number) => {
					return steps.includes(v);
				};

				const gcv = (v: number) => {
					return snapValueToCustomSteps(v, steps);
				};

				if (!isValidValue(value)) {
					this.opts.value.current = gcv(value);
				}
			}
		);
	}

	isTickValueSelected = (tickValue: number) => {
		return this.opts.value.current === tickValue;
	};

	applyPosition({ clientXY, start, end }: { clientXY: number; start: number; end: number }) {
		const min = this.opts.min.current;
		const max = this.opts.max.current;
		const percent = (clientXY - start) / (end - start);
		const val = percent * (max - min) + min;

		if (val < min) {
			this.updateValue(min);
		} else if (val > max) {
			this.updateValue(max);
		} else {
			const steps = this.normalizedSteps;
			const newValue = snapValueToCustomSteps(val, steps);
			this.updateValue(newValue);
		}
	}

	updateValue = (newValue: number) => {
		this.opts.value.current = snapValueToCustomSteps(newValue, this.normalizedSteps);
	};

	handlePointerMove = (e: PointerEvent) => {
		if (!this.isActive || this.opts.disabled.current) return;
		e.preventDefault();
		e.stopPropagation();

		const sliderNode = this.opts.ref.current;
		const activeThumb = this.getAllThumbs()[0];
		if (!sliderNode || !activeThumb) return;

		activeThumb.focus();

		const { left, right, top, bottom } = sliderNode.getBoundingClientRect();

		if (this.direction === "lr") {
			this.applyPosition({
				clientXY: e.clientX,
				start: left,
				end: right,
			});
		} else if (this.direction === "rl") {
			this.applyPosition({
				clientXY: e.clientX,
				start: right,
				end: left,
			});
		} else if (this.direction === "bt") {
			this.applyPosition({
				clientXY: e.clientY,
				start: bottom,
				end: top,
			});
		} else if (this.direction === "tb") {
			this.applyPosition({
				clientXY: e.clientY,
				start: top,
				end: bottom,
			});
		}
	};

	handlePointerDown = (e: PointerEvent) => {
		if (e.button !== 0 || this.opts.disabled.current) return;
		const sliderNode = this.opts.ref.current;
		const closestThumb = this.getAllThumbs()[0];
		if (!closestThumb || !sliderNode) return;

		const target = e.composedPath()[0] ?? e.target;
		if (!isElementOrSVGElement(target) || !sliderNode.contains(target)) return;
		e.preventDefault();

		closestThumb.focus();
		this.isActive = true;

		this.handlePointerMove(e);
	};

	handlePointerUp = () => {
		if (this.opts.disabled.current) return;
		if (this.isActive) {
			this.opts.onValueCommit.current(untrack(() => this.opts.value.current));
		}
		this.isActive = false;
	};

	readonly thumbsPropsArr = $derived.by(() => {
		const currValue = this.opts.value.current;
		return Array.from({ length: 1 }, () => {
			const thumbValue = currValue;
			const thumbPosition = this.getPositionFromValue(thumbValue);
			const style = getThumbStyles(this.direction, thumbPosition);

			return {
				role: "slider",
				"aria-valuemin": this.opts.min.current,
				"aria-valuemax": this.opts.max.current,
				"aria-valuenow": thumbValue,
				"aria-disabled": getAriaDisabled(this.opts.disabled.current),
				"aria-orientation": getAriaOrientation(this.opts.orientation.current),
				"data-value": thumbValue,
				"data-orientation": getDataOrientation(this.opts.orientation.current),
				style,
				[sliderAttrs.thumb]: "",
			} as const;
		});
	});

	readonly thumbsRenderArr = $derived.by(() => {
		return this.thumbsPropsArr.map((_, i) => i);
	});

	readonly ticksPropsArr = $derived.by(() => {
		const steps = this.normalizedSteps;
		const currValue = this.opts.value.current;

		return steps.map((tickValue, i) => {
			// Calculate position relative to the range
			const tickPosition = this.getPositionFromValue(tickValue);

			const isFirst = i === 0;
			const isLast = i === steps.length - 1;
			const offsetPercentage = isFirst ? 0 : isLast ? -100 : -50;

			const style = getTickStyles(this.direction, tickPosition, offsetPercentage);
			const bounded = tickValue <= currValue;

			return {
				"data-disabled": getDataDisabled(this.opts.disabled.current),
				"data-orientation": getDataOrientation(this.opts.orientation.current),
				"data-bounded": bounded ? "" : undefined,
				"data-value": tickValue,
				"data-selected": this.isTickValueSelected(tickValue) ? "" : undefined,
				style,
				[sliderAttrs.tick]: "",
			} as const;
		});
	});

	readonly ticksRenderArr = $derived.by(() => {
		return this.ticksPropsArr.map((_, i) => i);
	});

	readonly tickItemsArr = $derived.by(() => {
		return this.ticksPropsArr.map((tick, i) => ({
			value: tick["data-value"],
			index: i,
		}));
	});

	readonly thumbItemsArr = $derived.by(() => {
		const currValue = this.opts.value.current;
		return [
			{
				value: currValue,
				index: 0,
			},
		];
	});

	readonly snippetProps = $derived.by(
		() =>
			({
				ticks: this.ticksRenderArr,
				thumbs: this.thumbsRenderArr,
				tickItems: this.tickItemsArr,
				thumbItems: this.thumbItemsArr,
			}) as const
	);
}

interface SliderMultiRootStateOpts
	extends SliderBaseRootStateOpts,
		ReadableBoxedValues<{
			onValueCommit: OnChangeFn<number[]>;
		}>,
		WritableBoxedValues<{
			value: number[];
		}> {}

class SliderMultiRootState extends SliderBaseRootState {
	readonly opts: SliderMultiRootStateOpts;
	isMulti = true as const;
	activeThumb = $state<{ node: HTMLElement; idx: number } | null>(null);
	currentThumbIdx = $state(0);

	constructor(opts: SliderMultiRootStateOpts) {
		super(opts);
		this.opts = opts;

		onMountEffect(() => {
			return executeCallbacks(
				on(this.domContext.getDocument(), "pointerdown", this.handlePointerDown),
				on(this.domContext.getDocument(), "pointerup", this.handlePointerUp),
				on(this.domContext.getDocument(), "pointermove", this.handlePointerMove),
				on(this.domContext.getDocument(), "pointerleave", this.handlePointerUp)
			);
		});

		watch(
			[
				() => this.opts.step.current,
				() => this.opts.min.current,
				() => this.opts.max.current,
				() => this.opts.value.current,
			],
			([step, min, max, value]) => {
				const steps = normalizeSteps(step, min, max);

				const isValidValue = (v: number) => {
					return steps.includes(v);
				};

				const gcv = (v: number) => {
					return snapValueToCustomSteps(v, steps);
				};

				if (value.some((v) => !isValidValue(v))) {
					this.opts.value.current = value.map(gcv);
				}
			}
		);
	}

	isTickValueSelected = (tickValue: number) => {
		return this.opts.value.current.includes(tickValue);
	};

	isThumbActive(index: number): boolean {
		return this.isActive && this.activeThumb?.idx === index;
	}

	applyPosition({
		clientXY,
		activeThumbIdx,
		start,
		end,
	}: {
		clientXY: number;
		activeThumbIdx: number;
		start: number;
		end: number;
	}) {
		const min = this.opts.min.current;
		const max = this.opts.max.current;
		const percent = (clientXY - start) / (end - start);
		const val = percent * (max - min) + min;

		if (val < min) {
			this.updateValue(min, activeThumbIdx);
		} else if (val > max) {
			this.updateValue(max, activeThumbIdx);
		} else {
			const steps = this.normalizedSteps;
			const newValue = snapValueToCustomSteps(val, steps);
			this.updateValue(newValue, activeThumbIdx);
		}
	}

	#getClosestThumb = (e: PointerEvent) => {
		const thumbs = this.getAllThumbs();
		if (!thumbs.length) return;
		for (const thumb of thumbs) {
			thumb.blur();
		}

		const distances = thumbs.map((thumb) => {
			if (this.opts.orientation.current === "horizontal") {
				const { left, right } = thumb.getBoundingClientRect();
				return Math.abs(e.clientX - (left + right) / 2);
			} else {
				const { top, bottom } = thumb.getBoundingClientRect();
				return Math.abs(e.clientY - (top + bottom) / 2);
			}
		});

		const node = thumbs[distances.indexOf(Math.min(...distances))]!;
		const idx = thumbs.indexOf(node);
		return {
			node,
			idx,
		};
	};

	handlePointerMove = (e: PointerEvent) => {
		if (!this.isActive || this.opts.disabled.current) return;
		e.preventDefault();
		e.stopPropagation();

		const sliderNode = this.opts.ref.current;
		const activeThumb = this.activeThumb;
		if (!sliderNode || !activeThumb) return;

		activeThumb.node.focus();

		const { left, right, top, bottom } = sliderNode.getBoundingClientRect();

		const direction = this.direction;
		if (direction === "lr") {
			this.applyPosition({
				clientXY: e.clientX,
				activeThumbIdx: activeThumb.idx,
				start: left,
				end: right,
			});
		} else if (direction === "rl") {
			this.applyPosition({
				clientXY: e.clientX,
				activeThumbIdx: activeThumb.idx,
				start: right,
				end: left,
			});
		} else if (direction === "bt") {
			this.applyPosition({
				clientXY: e.clientY,
				activeThumbIdx: activeThumb.idx,
				start: bottom,
				end: top,
			});
		} else if (direction === "tb") {
			this.applyPosition({
				clientXY: e.clientY,
				activeThumbIdx: activeThumb.idx,
				start: top,
				end: bottom,
			});
		}
	};

	handlePointerDown = (e: PointerEvent) => {
		if (e.button !== 0 || this.opts.disabled.current) return;
		const sliderNode = this.opts.ref.current;
		const closestThumb = this.#getClosestThumb(e);
		if (!closestThumb || !sliderNode) return;

		const target = e.composedPath()[0] ?? e.target;
		if (!isElementOrSVGElement(target) || !sliderNode.contains(target)) return;
		e.preventDefault();

		this.activeThumb = closestThumb;
		closestThumb.node.focus();
		this.isActive = true;

		this.handlePointerMove(e);
	};

	handlePointerUp = () => {
		if (this.opts.disabled.current) return;
		if (this.isActive) {
			this.opts.onValueCommit.current(untrack(() => this.opts.value.current));
		}
		this.isActive = false;
	};

	getAllThumbs = () => {
		const node = this.opts.ref.current;
		if (!node) return [];
		const thumbs = Array.from(
			node.querySelectorAll<HTMLElement>(sliderAttrs.selector("thumb"))
		);
		return thumbs;
	};

	updateValue = (thumbValue: number, idx: number) => {
		const currValue = this.opts.value.current;
		if (!currValue.length) {
			this.opts.value.current.push(thumbValue);
			return;
		}
		const valueAtIndex = currValue[idx];
		if (valueAtIndex === thumbValue) return;

		const newValue = [...currValue];

		if (!isValidIndex(idx, newValue)) return;

		const direction = newValue[idx]! > thumbValue ? -1 : +1;

		const swap = () => {
			const diffIndex = idx + direction;
			newValue[idx] = newValue[diffIndex]!;
			newValue[diffIndex] = thumbValue;
			const thumbs = this.getAllThumbs();
			if (!thumbs.length) return;
			thumbs[diffIndex]?.focus();
			this.activeThumb = { node: thumbs[diffIndex]!, idx: diffIndex };
		};

		if (
			this.opts.autoSort.current &&
			((direction === -1 && thumbValue < newValue[idx - 1]!) ||
				(direction === 1 && thumbValue > newValue[idx + 1]!))
		) {
			swap();
			this.opts.value.current = newValue;
			return;
		}

		const steps = this.normalizedSteps;
		newValue[idx] = snapValueToCustomSteps(thumbValue, steps);

		this.opts.value.current = newValue;
	};

	readonly thumbsPropsArr = $derived.by(() => {
		const currValue = this.opts.value.current;
		return Array.from({ length: currValue.length || 1 }, (_, i) => {
			const currThumb = untrack(() => this.currentThumbIdx);

			if (currThumb < currValue.length) {
				untrack(() => {
					this.currentThumbIdx = currThumb + 1;
				});
			}

			const thumbValue = currValue[i];
			const thumbPosition = this.getPositionFromValue(thumbValue ?? 0);
			const style = getThumbStyles(this.direction, thumbPosition);

			return {
				role: "slider",
				"aria-valuemin": this.opts.min.current,
				"aria-valuemax": this.opts.max.current,
				"aria-valuenow": thumbValue,
				"aria-disabled": getAriaDisabled(this.opts.disabled.current),
				"aria-orientation": getAriaOrientation(this.opts.orientation.current),
				"data-value": thumbValue,
				"data-orientation": getDataOrientation(this.opts.orientation.current),
				style,
				[sliderAttrs.thumb]: "",
			} as const;
		});
	});

	readonly thumbsRenderArr = $derived.by(() => {
		return this.thumbsPropsArr.map((_, i) => i);
	});

	readonly ticksPropsArr = $derived.by(() => {
		const steps = this.normalizedSteps;
		const currValue = this.opts.value.current;

		return steps.map((tickValue, i) => {
			// Calculate position relative to the range
			const tickPosition = this.getPositionFromValue(tickValue);

			const isFirst = i === 0;
			const isLast = i === steps.length - 1;
			const offsetPercentage = isFirst ? 0 : isLast ? -100 : -50;

			const style = getTickStyles(this.direction, tickPosition, offsetPercentage);
			const bounded =
				currValue.length === 1
					? tickValue <= currValue[0]!
					: currValue[0]! <= tickValue && tickValue <= currValue[currValue.length - 1]!;

			return {
				"data-disabled": getDataDisabled(this.opts.disabled.current),
				"data-orientation": getDataOrientation(this.opts.orientation.current),
				"data-bounded": bounded ? "" : undefined,
				"data-value": tickValue,
				style,
				[sliderAttrs.tick]: "",
			} as const;
		});
	});

	readonly ticksRenderArr = $derived.by(() => {
		return this.ticksPropsArr.map((_, i) => i);
	});

	readonly tickItemsArr = $derived.by(() => {
		return this.ticksPropsArr.map((tick, i) => ({
			value: tick["data-value"],
			index: i,
		}));
	});

	readonly thumbItemsArr = $derived.by(() => {
		const currValue = this.opts.value.current;
		return currValue.map((value, index) => ({
			value,
			index,
		}));
	});

	readonly snippetProps = $derived.by(
		() =>
			({
				ticks: this.ticksRenderArr,
				thumbs: this.thumbsRenderArr,
				tickItems: this.tickItemsArr,
				thumbItems: this.thumbItemsArr,
			}) as const
	);
}

type SliderRoot = SliderSingleRootState | SliderMultiRootState;

interface SliderRootStateOpts extends Omit<SliderBaseRootStateOpts, "type"> {
	type: "single" | "multiple";
	value: Box<number> | Box<number[]>;
	onValueCommit: ReadableBox<OnChangeFn<number>> | ReadableBox<OnChangeFn<number[]>>;
}

export class SliderRootState {
	static create(opts: SliderRootStateOpts): SliderRoot {
		const { type, ...rest } = opts;
		const rootState =
			type === "single"
				? new SliderSingleRootState(rest as SliderSingleRootStateOpts)
				: new SliderMultiRootState(rest as SliderMultiRootStateOpts);
		return SliderRootContext.set(rootState);
	}
}

const VALID_SLIDER_KEYS = [
	kbd.ARROW_LEFT,
	kbd.ARROW_RIGHT,
	kbd.ARROW_UP,
	kbd.ARROW_DOWN,
	kbd.HOME,
	kbd.END,
];

interface SliderRangeStateOpts extends WithRefOpts {}

export class SliderRangeState {
	static create(opts: SliderRangeStateOpts) {
		return new SliderRangeState(opts, SliderRootContext.get());
	}
	readonly opts: SliderRangeStateOpts;
	readonly root: SliderRoot;
	readonly attachment: RefAttachment;

	constructor(opts: SliderRangeStateOpts, root: SliderRoot) {
		this.opts = opts;
		this.root = root;
		this.attachment = attachRef(opts.ref);
	}

	readonly rangeStyles = $derived.by(() => {
		if (Array.isArray(this.root.opts.value.current)) {
			// Multi-slider: range between min and max thumbs
			const min =
				this.root.opts.value.current.length > 1
					? this.root.getPositionFromValue(Math.min(...this.root.opts.value.current) ?? 0)
					: 0;
			const max =
				100 -
				this.root.getPositionFromValue(Math.max(...this.root.opts.value.current) ?? 0);

			return {
				position: "absolute",
				...getRangeStyles(this.root.direction, min, max),
			};
		} else {
			// Single slider: range from start to current value
			const trackPadding = this.root.opts.trackPadding?.current;
			const currentValue = this.root.opts.value.current;
			const maxValue = this.root.opts.max.current;

			// Always start from 0% (beginning of track container)
			const min = 0;

			// If trackPadding is set and we're at max value, extend to fill the container
			// Otherwise use the thumb position
			const max =
				trackPadding !== undefined && trackPadding > 0 && currentValue === maxValue
					? 0 // 100% - 0% = full width
					: 100 - this.root.getPositionFromValue(currentValue);

			return {
				position: "absolute",
				...getRangeStyles(this.root.direction, min, max),
			};
		}
	});

	readonly props = $derived.by(
		() =>
			({
				id: this.opts.id.current,
				"data-orientation": getDataOrientation(this.root.opts.orientation.current),
				"data-disabled": getDataDisabled(this.root.opts.disabled.current),
				style: this.rangeStyles,
				[sliderAttrs.range]: "",
				...this.attachment,
			}) as const
	);
}

interface SliderThumbStateOpts
	extends WithRefOpts,
		ReadableBoxedValues<{
			index: number;
			disabled: boolean;
		}> {}

export class SliderThumbState {
	static create(opts: SliderThumbStateOpts) {
		return new SliderThumbState(opts, SliderRootContext.get());
	}
	readonly opts: SliderThumbStateOpts;
	readonly root: SliderRoot;
	readonly attachment: RefAttachment;
	readonly #isDisabled = $derived.by(
		() => this.root.opts.disabled.current || this.opts.disabled.current
	);

	constructor(opts: SliderThumbStateOpts, root: SliderRoot) {
		this.opts = opts;
		this.root = root;
		this.attachment = attachRef(opts.ref);
		this.onkeydown = this.onkeydown.bind(this);
	}

	#updateValue(newValue: number) {
		if (this.root.isMulti) {
			this.root.updateValue(newValue, this.opts.index.current);
		} else {
			this.root.updateValue(newValue);
		}
	}

	onkeydown(e: BitsKeyboardEvent) {
		if (this.#isDisabled) return;
		const currNode = this.opts.ref.current;
		if (!currNode) return;
		const thumbs = this.root.getAllThumbs();
		if (!thumbs.length) return;

		const idx = thumbs.indexOf(currNode);
		if (this.root.isMulti) {
			this.root.currentThumbIdx = idx;
		}

		if (!VALID_SLIDER_KEYS.includes(e.key)) return;

		e.preventDefault();

		const min = this.root.opts.min.current;
		const max = this.root.opts.max.current;
		const value = this.root.opts.value.current;
		const thumbValue = Array.isArray(value) ? value[idx]! : value;
		const orientation = this.root.opts.orientation.current;
		const direction = this.root.direction;
		const steps = this.root.normalizedSteps;

		switch (e.key) {
			case kbd.HOME:
				this.#updateValue(min);
				break;
			case kbd.END:
				this.#updateValue(max);
				break;
			case kbd.ARROW_LEFT:
				if (orientation !== "horizontal") break;
				if (e.metaKey) {
					const newValue = direction === "rl" ? max : min;
					this.#updateValue(newValue);
				} else {
					const stepDirection = direction === "rl" ? "next" : "prev";
					const newValue = getAdjacentStepValue(thumbValue, steps, stepDirection);
					this.#updateValue(newValue);
				}
				break;
			case kbd.ARROW_RIGHT:
				if (orientation !== "horizontal") break;
				if (e.metaKey) {
					const newValue = direction === "rl" ? min : max;
					this.#updateValue(newValue);
				} else {
					const stepDirection = direction === "rl" ? "prev" : "next";
					const newValue = getAdjacentStepValue(thumbValue, steps, stepDirection);
					this.#updateValue(newValue);
				}
				break;
			case kbd.ARROW_UP:
				if (e.metaKey) {
					const newValue = direction === "tb" ? min : max;
					this.#updateValue(newValue);
				} else {
					const stepDirection = direction === "tb" ? "prev" : "next";
					const newValue = getAdjacentStepValue(thumbValue, steps, stepDirection);
					this.#updateValue(newValue);
				}
				break;
			case kbd.ARROW_DOWN:
				if (e.metaKey) {
					const newValue = direction === "tb" ? max : min;
					this.#updateValue(newValue);
				} else {
					const stepDirection = direction === "tb" ? "next" : "prev";
					const newValue = getAdjacentStepValue(thumbValue, steps, stepDirection);
					this.#updateValue(newValue);
				}
				break;
		}
		// @ts-expect-error - this is fine
		this.root.opts.onValueCommit.current(this.root.opts.value.current);
	}

	readonly props = $derived.by(
		() =>
			({
				...this.root.thumbsPropsArr[this.opts.index.current]!,
				id: this.opts.id.current,
				onkeydown: this.onkeydown,
				"data-active": this.root.isThumbActive(this.opts.index.current) ? "" : undefined,
				"data-disabled": getDataDisabled(
					this.opts.disabled.current || this.root.opts.disabled.current
				),
				tabindex: this.opts.disabled.current || this.root.opts.disabled.current ? -1 : 0,
				...this.attachment,
			}) as const
	);
}

interface SliderTickStateOpts
	extends WithRefOpts,
		ReadableBoxedValues<{
			index: number;
		}> {}

export class SliderTickState {
	static create(opts: SliderTickStateOpts) {
		return new SliderTickState(opts, SliderRootContext.get());
	}
	readonly opts: SliderTickStateOpts;
	readonly root: SliderRoot;
	readonly attachment: RefAttachment;

	constructor(opts: SliderTickStateOpts, root: SliderRoot) {
		this.opts = opts;
		this.root = root;
		this.attachment = attachRef(opts.ref);
	}

	readonly props = $derived.by(
		() =>
			({
				...this.root.ticksPropsArr[this.opts.index.current]!,
				id: this.opts.id.current,
				...this.attachment,
			}) as const
	);
}

interface SliderTickLabelStateOpts
	extends WithRefOpts,
		ReadableBoxedValues<{
			index: number;
			position?: SliderLabelPosition;
		}> {}

export class SliderTickLabelState {
	static create(opts: SliderTickLabelStateOpts) {
		return new SliderTickLabelState(opts, SliderRootContext.get());
	}
	readonly opts: SliderTickLabelStateOpts;
	readonly root: SliderRoot;
	readonly attachment: RefAttachment;

	constructor(opts: SliderTickLabelStateOpts, root: SliderRoot) {
		this.opts = opts;
		this.root = root;
		this.attachment = attachRef(opts.ref);
	}

	readonly props = $derived.by(() => {
		const tickProps = this.root.ticksPropsArr[this.opts.index.current]!;
		const steps = this.root.normalizedSteps;
		const tickValue = steps[this.opts.index.current]!;
		const tickPosition = this.root.getPositionFromValue(tickValue);

		const labelPosition = this.opts.position?.current ?? "top";
		const style = getTickLabelStyles(this.root.direction, tickPosition, labelPosition);

		return {
			id: this.opts.id.current,
			"data-orientation": getDataOrientation(this.root.opts.orientation.current),
			"data-disabled": getDataDisabled(this.root.opts.disabled.current),
			"data-bounded": tickProps["data-bounded"],
			"data-value": tickValue,
			"data-selected": this.root.isTickValueSelected(tickValue) ? "" : undefined,
			"data-position": labelPosition,
			style,
			[sliderAttrs["tick-label"]]: "",
			...this.attachment,
		} as const;
	});
}

interface SliderThumbLabelStateOpts
	extends WithRefOpts,
		ReadableBoxedValues<{
			index: number;
			position?: SliderLabelPosition;
		}> {}

export class SliderThumbLabelState {
	static create(opts: SliderThumbLabelStateOpts) {
		return new SliderThumbLabelState(opts, SliderRootContext.get());
	}
	readonly opts: SliderThumbLabelStateOpts;
	readonly root: SliderRoot;
	readonly attachment: RefAttachment;

	constructor(opts: SliderThumbLabelStateOpts, root: SliderRoot) {
		this.opts = opts;
		this.root = root;
		this.attachment = attachRef(opts.ref);
	}

	readonly props = $derived.by(() => {
		const value = this.root.opts.value.current;
		const thumbValue = Array.isArray(value) ? value[this.opts.index.current]! : value;
		const thumbPosition = this.root.getPositionFromValue(thumbValue);

		const labelPosition = this.opts.position?.current ?? "top";
		const style = getThumbLabelStyles(this.root.direction, thumbPosition, labelPosition);

		return {
			id: this.opts.id.current,
			"data-orientation": getDataOrientation(this.root.opts.orientation.current),
			"data-disabled": getDataDisabled(this.root.opts.disabled.current),
			"data-value": thumbValue,
			"data-active": this.root.isThumbActive(this.opts.index.current) ? "" : undefined,
			"data-position": labelPosition,
			style,
			[sliderAttrs["thumb-label"]]: "",
			...this.attachment,
		} as const;
	});
}
