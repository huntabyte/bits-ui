/**
 * This logic is adapted from the @melt-ui/svelte slider, which was mostly written by
 * Abdelrahman (https://github.com/abdel-17)
 */
import { untrack } from "svelte";
import {
	executeCallbacks,
	onMountEffect,
	useRefById,
	type Box,
	type ReadableBox,
} from "svelte-toolbelt";
import { on } from "svelte/events";
import { Context, watch } from "runed";
import { getRangeStyles, getThumbStyles, getTickStyles } from "./helpers.js";
import {
	getAriaDisabled,
	getAriaOrientation,
	getDataDisabled,
	getDataOrientation,
} from "$lib/internal/attrs.js";
import { kbd } from "$lib/internal/kbd.js";
import { isElementOrSVGElement } from "$lib/internal/is.js";
import { isValidIndex } from "$lib/internal/arrays.js";
import type { ReadableBoxedValues, WritableBoxedValues } from "$lib/internal/box.svelte.js";
import type { BitsKeyboardEvent, OnChangeFn, WithRefProps } from "$lib/internal/types.js";
import type { Direction, Orientation, SliderThumbPositioning } from "$lib/shared/index.js";
import { linearScale, snapValueToStep } from "$lib/internal/math.js";

const SLIDER_ROOT_ATTR = "data-slider-root";
const SLIDER_THUMB_ATTR = "data-slider-thumb";
const SLIDER_RANGE_ATTR = "data-slider-range";
const SLIDER_TICK_ATTR = "data-slider-tick";

type SliderBaseRootStateProps = WithRefProps<
	ReadableBoxedValues<{
		disabled: boolean;
		orientation: Orientation;
		min: number;
		max: number;
		step: number;
		dir: Direction;
		autoSort: boolean;
		thumbPositioning: SliderThumbPositioning;
	}>
>;

class SliderBaseRootState {
	readonly opts: SliderBaseRootStateProps;
	isActive = $state(false);
	direction: "rl" | "lr" | "tb" | "bt" = $derived.by(() => {
		if (this.opts.orientation.current === "horizontal") {
			return this.opts.dir.current === "rtl" ? "rl" : "lr";
		} else {
			return this.opts.dir.current === "rtl" ? "tb" : "bt";
		}
	});

	constructor(opts: SliderBaseRootStateProps) {
		this.opts = opts;

		useRefById(opts);
	}

	isThumbActive(_index: number) {
		return this.isActive;
	}

	#touchAction = $derived.by(() => {
		if (this.opts.disabled.current) return undefined;
		return this.opts.orientation.current === "horizontal" ? "pan-y" : "pan-x";
	});

	getAllThumbs = () => {
		const node = this.opts.ref.current;
		if (!node) return [];
		return Array.from(node.querySelectorAll<HTMLElement>(`[${SLIDER_THUMB_ATTR}]`));
	};

	getThumbScale = (): [number, number] => {
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

	props = $derived.by(
		() =>
			({
				id: this.opts.id.current,
				"data-orientation": getDataOrientation(this.opts.orientation.current),
				"data-disabled": getDataDisabled(this.opts.disabled.current),
				style: {
					touchAction: this.#touchAction,
				},
				[SLIDER_ROOT_ATTR]: "",
			}) as const
	);
}

type SliderSingleRootStateProps = SliderBaseRootStateProps &
	ReadableBoxedValues<{
		onValueCommit: OnChangeFn<number>;
	}> &
	WritableBoxedValues<{
		value: number;
	}>;

class SliderSingleRootState extends SliderBaseRootState {
	readonly opts: SliderSingleRootStateProps;
	isMulti = false as const;

	constructor(opts: SliderSingleRootStateProps) {
		super(opts);

		this.opts = opts;

		onMountEffect(() => {
			return executeCallbacks(
				on(document, "pointerdown", this.handlePointerDown),
				on(document, "pointerup", this.handlePointerUp),
				on(document, "pointermove", this.handlePointerMove),
				on(document, "pointerleave", this.handlePointerUp)
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
				const isValidValue = (v: number) => {
					const snappedValue = snapValueToStep(v, min, max, step);
					return snappedValue === v;
				};

				const gcv = (v: number) => {
					return snapValueToStep(v, min, max, step);
				};

				if (!isValidValue(value)) {
					this.opts.value.current = gcv(value);
				}
			}
		);
	}

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
			const step = this.opts.step.current;

			const currStep = Math.floor((val - min) / step);
			const midpointOfCurrStep = min + currStep * step + step / 2;
			const midpointOfNextStep = min + (currStep + 1) * step + step / 2;
			const newValue =
				val >= midpointOfCurrStep && val < midpointOfNextStep
					? (currStep + 1) * step + min
					: currStep * step + min;

			if (newValue <= max) {
				this.updateValue(newValue);
			}
		}
	}

	updateValue = (newValue: number) => {
		this.opts.value.current = snapValueToStep(
			newValue,
			this.opts.min.current,
			this.opts.max.current,
			this.opts.step.current
		);
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

		const target = e.target;
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

	thumbsPropsArr = $derived.by(() => {
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
				tabindex: this.opts.disabled.current ? -1 : 0,
				style,
				[SLIDER_THUMB_ATTR]: "",
			} as const;
		});
	});

	thumbsRenderArr = $derived.by(() => {
		return this.thumbsPropsArr.map((_, i) => i);
	});

	ticksPropsArr = $derived.by(() => {
		const max = this.opts.max.current;
		const min = this.opts.min.current;
		const step = this.opts.step.current;
		const difference = max - min;

		let count = Math.ceil(difference / step);

		if (difference % step == 0) {
			count++;
		}
		const currValue = this.opts.value.current;

		return Array.from({ length: count }, (_, i) => {
			const tickPosition = i * step;

			const scale = linearScale([0, (count - 1) * step], this.getThumbScale());

			const isFirst = i === 0;
			const isLast = i === count - 1;
			const offsetPercentage = isFirst ? 0 : isLast ? -100 : -50;

			const style = getTickStyles(this.direction, scale(tickPosition), offsetPercentage);
			const tickValue = min + i * step;
			const bounded = tickValue <= currValue;

			return {
				"data-disabled": getDataDisabled(this.opts.disabled.current),
				"data-orientation": getDataOrientation(this.opts.orientation.current),
				"data-bounded": bounded ? "" : undefined,
				"data-value": tickValue,
				style,
				[SLIDER_TICK_ATTR]: "",
			} as const;
		});
	});

	ticksRenderArr = $derived.by(() => {
		return this.ticksPropsArr.map((_, i) => i);
	});

	snippetProps = $derived.by(
		() =>
			({
				ticks: this.ticksRenderArr,
				thumbs: this.thumbsRenderArr,
			}) as const
	);
}

type SliderMultiRootStateProps = SliderBaseRootStateProps &
	ReadableBoxedValues<{
		onValueCommit: OnChangeFn<number[]>;
	}> &
	WritableBoxedValues<{
		value: number[];
	}>;

class SliderMultiRootState extends SliderBaseRootState {
	readonly opts: SliderMultiRootStateProps;
	isMulti = true as const;
	activeThumb = $state<{ node: HTMLElement; idx: number } | null>(null);
	currentThumbIdx = $state(0);

	constructor(opts: SliderMultiRootStateProps) {
		super(opts);

		this.opts = opts;

		onMountEffect(() => {
			return executeCallbacks(
				on(document, "pointerdown", this.handlePointerDown),
				on(document, "pointerup", this.handlePointerUp),
				on(document, "pointermove", this.handlePointerMove),
				on(document, "pointerleave", this.handlePointerUp)
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
				const isValidValue = (v: number) => {
					const snappedValue = snapValueToStep(v, min, max, step);
					return snappedValue === v;
				};

				const gcv = (v: number) => {
					return snapValueToStep(v, min, max, step);
				};

				if (value.some((v) => !isValidValue(v))) {
					this.opts.value.current = value.map(gcv);
				}
			}
		);
	}

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
			const step = this.opts.step.current;

			const currStep = Math.floor((val - min) / step);
			const midpointOfCurrStep = min + currStep * step + step / 2;
			const midpointOfNextStep = min + (currStep + 1) * step + step / 2;
			const newValue =
				val >= midpointOfCurrStep && val < midpointOfNextStep
					? (currStep + 1) * step + min
					: currStep * step + min;

			if (newValue <= max) {
				this.updateValue(newValue, activeThumbIdx);
			}
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

		const target = e.target;
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
		const thumbs = Array.from(node.querySelectorAll<HTMLElement>(`[${SLIDER_THUMB_ATTR}]`));
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

		const min = this.opts.min.current;
		const max = this.opts.max.current;
		const step = this.opts.step.current;
		newValue[idx] = snapValueToStep(thumbValue, min, max, step);

		this.opts.value.current = newValue;
	};

	thumbsPropsArr = $derived.by(() => {
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
				tabindex: this.opts.disabled.current ? -1 : 0,
				style,
				[SLIDER_THUMB_ATTR]: "",
			} as const;
		});
	});

	thumbsRenderArr = $derived.by(() => {
		return this.thumbsPropsArr.map((_, i) => i);
	});

	ticksPropsArr = $derived.by(() => {
		const max = this.opts.max.current;
		const min = this.opts.min.current;
		const step = this.opts.step.current;
		const difference = max - min;

		let count = Math.ceil(difference / step);

		if (difference % step == 0) {
			count++;
		}
		const currValue = this.opts.value.current;

		return Array.from({ length: count }, (_, i) => {
			const tickPosition = i * step;

			const scale = linearScale([0, (count - 1) * step], this.getThumbScale());

			const isFirst = i === 0;
			const isLast = i === count - 1;
			const offsetPercentage = isFirst ? 0 : isLast ? -100 : -50;

			const style = getTickStyles(this.direction, scale(tickPosition), offsetPercentage);
			const tickValue = min + i * step;
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
				[SLIDER_TICK_ATTR]: "",
			} as const;
		});
	});

	ticksRenderArr = $derived.by(() => {
		return this.ticksPropsArr.map((_, i) => i);
	});

	snippetProps = $derived.by(
		() =>
			({
				ticks: this.ticksRenderArr,
				thumbs: this.thumbsRenderArr,
			}) as const
	);
}

const VALID_SLIDER_KEYS = [
	kbd.ARROW_LEFT,
	kbd.ARROW_RIGHT,
	kbd.ARROW_UP,
	kbd.ARROW_DOWN,
	kbd.HOME,
	kbd.END,
];

type SliderRangeStateProps = WithRefProps;

class SliderRangeState {
	readonly opts: SliderRangeStateProps;
	readonly root: SliderRootState;

	constructor(opts: SliderRangeStateProps, root: SliderRootState) {
		this.opts = opts;
		this.root = root;

		useRefById(opts);
	}

	rangeStyles = $derived.by(() => {
		const min = Array.isArray(this.root.opts.value.current)
			? this.root.opts.value.current.length > 1
				? this.root.getPositionFromValue(Math.min(...this.root.opts.value.current) ?? 0)
				: 0
			: 0;
		const max = Array.isArray(this.root.opts.value.current)
			? 100 - this.root.getPositionFromValue(Math.max(...this.root.opts.value.current) ?? 0)
			: 100 - this.root.getPositionFromValue(this.root.opts.value.current);
		return {
			position: "absolute",
			...getRangeStyles(this.root.direction, min, max),
		};
	});

	props = $derived.by(
		() =>
			({
				id: this.opts.id.current,
				"data-orientation": getDataOrientation(this.root.opts.orientation.current),
				"data-disabled": getDataDisabled(this.root.opts.disabled.current),
				style: this.rangeStyles,
				[SLIDER_RANGE_ATTR]: "",
			}) as const
	);
}

type SliderThumbStateProps = WithRefProps &
	ReadableBoxedValues<{
		index: number;
		disabled: boolean;
	}>;

class SliderThumbState {
	readonly opts: SliderThumbStateProps;
	readonly root: SliderRootState;
	#isDisabled = $derived.by(() => this.root.opts.disabled.current || this.opts.disabled.current);

	constructor(opts: SliderThumbStateProps, root: SliderRootState) {
		this.opts = opts;
		this.root = root;

		useRefById(opts);

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
		const step = this.root.opts.step.current;

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
				} else if (direction === "rl" && thumbValue < max) {
					this.#updateValue(thumbValue + step);
				} else if (direction === "lr" && thumbValue > min) {
					this.#updateValue(thumbValue - step);
				}
				break;
			case kbd.ARROW_RIGHT:
				if (orientation !== "horizontal") break;
				if (e.metaKey) {
					const newValue = direction === "rl" ? min : max;
					this.#updateValue(newValue);
				} else if (direction === "rl" && thumbValue > min) {
					this.#updateValue(thumbValue - step);
				} else if (direction === "lr" && thumbValue < max) {
					this.#updateValue(thumbValue + step);
				}
				break;
			case kbd.ARROW_UP:
				if (e.metaKey) {
					const newValue = direction === "tb" ? min : max;
					this.#updateValue(newValue);
				} else if (direction === "tb" && thumbValue > min) {
					this.#updateValue(thumbValue - step);
				} else if (direction !== "tb" && thumbValue < max) {
					this.#updateValue(thumbValue + step);
				}
				break;
			case kbd.ARROW_DOWN:
				if (e.metaKey) {
					const newValue = direction === "tb" ? max : min;
					this.#updateValue(newValue);
				} else if (direction === "tb" && thumbValue < max) {
					this.#updateValue(thumbValue + step);
				} else if (direction !== "tb" && thumbValue > min) {
					this.#updateValue(thumbValue - step);
				}
				break;
		}
		// @ts-expect-error - this is fine
		this.root.opts.onValueCommit.current(this.root.opts.value.current);
	}

	props = $derived.by(
		() =>
			({
				...this.root.thumbsPropsArr[this.opts.index.current]!,
				id: this.opts.id.current,
				onkeydown: this.onkeydown,
				"data-active": this.root.isThumbActive(this.opts.index.current) ? "" : undefined,
			}) as const
	);
}

type SliderTickStateProps = WithRefProps &
	ReadableBoxedValues<{
		index: number;
	}>;

class SliderTickState {
	readonly opts: SliderTickStateProps;
	readonly root: SliderRootState;

	constructor(opts: SliderTickStateProps, root: SliderRootState) {
		this.opts = opts;
		this.root = root;

		useRefById(opts);
	}

	props = $derived.by(
		() =>
			({
				...this.root.ticksPropsArr[this.opts.index.current]!,
				id: this.opts.id.current,
			}) as const
	);
}

type SliderRootState = SliderSingleRootState | SliderMultiRootState;

type InitSliderRootStateProps = {
	type: "single" | "multiple";
	value: Box<number> | Box<number[]>;
	onValueCommit: ReadableBox<OnChangeFn<number>> | ReadableBox<OnChangeFn<number[]>>;
} & Omit<SliderBaseRootStateProps, "type">;

const SliderRootContext = new Context<SliderRootState>("Slider.Root");

export function useSliderRoot(props: InitSliderRootStateProps) {
	const { type, ...rest } = props;
	const rootState =
		type === "single"
			? new SliderSingleRootState(rest as SliderSingleRootStateProps)
			: new SliderMultiRootState(rest as SliderMultiRootStateProps);
	return SliderRootContext.set(rootState);
}

export function useSliderRange(props: SliderRangeStateProps) {
	return new SliderRangeState(props, SliderRootContext.get());
}

export function useSliderThumb(props: SliderThumbStateProps) {
	return new SliderThumbState(props, SliderRootContext.get());
}

export function useSliderTick(props: SliderTickStateProps) {
	return new SliderTickState(props, SliderRootContext.get());
}
