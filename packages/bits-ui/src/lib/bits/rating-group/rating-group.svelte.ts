import { attachRef } from "svelte-toolbelt";
import { Context } from "runed";
import type { ReadableBoxedValues, WritableBoxedValues } from "$lib/internal/box.svelte.js";
import type {
	BitsKeyboardEvent,
	BitsMouseEvent,
	BitsPointerEvent,
	WithRefProps,
} from "$lib/internal/types.js";
import { getAriaRequired, getDataDisabled } from "$lib/internal/attrs.js";
import type {
	RatingGroupAriaValuetext,
	RatingGroupItemState as RatingGroupItemStateType,
} from "./types.js";
import type { Orientation } from "$lib/shared/index.js";
import { kbd } from "$lib/internal/kbd.js";

const RATING_GROUP_ROOT_ATTR = "data-rating-group-root";
const RATING_GROUP_ITEM_ATTR = "data-rating-group-item";

type RatingGroupRootStateProps = WithRefProps<
	ReadableBoxedValues<{
		disabled: boolean;
		required: boolean;
		orientation: Orientation;
		name: string | undefined;
		min: number;
		max: number;
		allowHalf: boolean;
		readonly: boolean;
		hoverPreview: boolean;
		ariaValuetext: NonNullable<RatingGroupAriaValuetext>;
	}> &
		WritableBoxedValues<{ value: number }>
>;

class RatingGroupRootState {
	readonly opts: RatingGroupRootStateProps;

	// State
	#hoverValue = $state<number | null>(null);
	#keySequence = $state<string>("");
	#keySequenceTimeout: ReturnType<typeof setTimeout> | null = $state(null);

	// Derived values
	hasValue = $derived.by(() => this.opts.value.current > 0);
	valueToUse = $derived.by(() => this.#hoverValue ?? this.opts.value.current);

	readonly ariaValuetext = $derived.by(() => {
		const { ariaValuetext, value, max } = this.opts;
		return typeof ariaValuetext.current === "function"
			? ariaValuetext.current(value.current, max.current)
			: ariaValuetext.current;
	});

	items = $derived.by(() => {
		const { max, allowHalf } = this.opts;
		const value = this.valueToUse;

		return Array.from({ length: max.current }, (_, i) => {
			const itemValue = i + 1;
			const halfValue = itemValue - 0.5;

			const state: RatingGroupItemStateType =
				value >= itemValue
					? "active"
					: allowHalf.current && value >= halfValue
						? "partial"
						: "inactive";

			return { index: i, state };
		});
	});

	constructor(opts: RatingGroupRootStateProps) {
		this.opts = opts;
		this.onkeydown = this.onkeydown.bind(this);
		this.onpointerleave = this.onpointerleave.bind(this);
	}

	isActive(itemIndex: number): boolean {
		return this.valueToUse >= itemIndex + 1;
	}

	isPartial(itemIndex: number): boolean {
		if (!this.opts.allowHalf.current) return false;
		const itemValue = itemIndex + 1;
		return this.valueToUse >= itemValue - 0.5 && this.valueToUse < itemValue;
	}

	setHoverValue(value: number | null): void {
		const { readonly, disabled, hoverPreview } = this.opts;
		if (readonly.current || disabled.current || !hoverPreview.current) return;
		this.#hoverValue = value;
	}

	setValue(value: number): void {
		const { readonly, disabled, min, max } = this.opts;
		if (readonly.current || disabled.current) return;
		this.opts.value.current = Math.max(min.current, Math.min(max.current, value));
	}

	calculateRatingFromPointer(
		itemIndex: number,
		event: { clientX: number; clientY: number; currentTarget: HTMLElement }
	): number {
		const ratingValue = itemIndex + 1;
		if (!this.opts.allowHalf.current) return ratingValue;

		const rect = event.currentTarget.getBoundingClientRect();
		const style = getComputedStyle(event.currentTarget);
		const isHorizontal = this.opts.orientation.current === "horizontal";

		const position = isHorizontal
			? (event.clientX - rect.left) / rect.width
			: (event.clientY - rect.top) / rect.height;

		const normalizedPosition = style.direction === "rtl" ? 1 - position : position;

		return normalizedPosition < 0.5 ? ratingValue - 0.5 : ratingValue;
	}

	onpointerleave(): void {
		this.setHoverValue(null);
	}

	handlers: Record<string, () => void> = {
		[kbd.ARROW_UP]: () => this.#adjustValue(this.opts.allowHalf.current ? 0.5 : 1),
		[kbd.ARROW_RIGHT]: () => this.#adjustValue(this.opts.allowHalf.current ? 0.5 : 1),
		[kbd.ARROW_DOWN]: () => this.#adjustValue(this.opts.allowHalf.current ? -0.5 : -1),
		[kbd.ARROW_LEFT]: () => this.#adjustValue(this.opts.allowHalf.current ? -0.5 : -1),
		[kbd.HOME]: () => this.setValue(this.opts.min.current),
		[kbd.END]: () => this.setValue(this.opts.max.current),
		[kbd.PAGE_UP]: () => this.#adjustValue(1),
		[kbd.PAGE_DOWN]: () => this.#adjustValue(-1),
	};

	// Keyboard handling
	onkeydown(e: BitsKeyboardEvent): void {
		if (this.opts.disabled.current || this.opts.readonly.current) return;

		if (this.handlers[e.key]) {
			e.preventDefault();
			this.#clearKeySequence();
			this.handlers[e.key]?.();
			return;
		}

		if (this.opts.allowHalf.current && this.#handleDecimalInput(e)) return;

		// handle direct number input
		const num = parseInt(e.key || "");
		if (!isNaN(num) && e.key) {
			e.preventDefault();
			if (num >= this.opts.min.current && num <= this.opts.max.current) {
				this.setValue(num);
				if (this.opts.allowHalf.current) {
					this.#startDecimalListening(num);
				}
			}
			return;
		}

		this.#clearKeySequence();
	}

	#adjustValue(delta: number): void {
		this.setValue(this.opts.value.current + delta);
	}

	#handleDecimalInput(e: BitsKeyboardEvent): boolean {
		if (!e.key) return false;

		if (e.key === ".") {
			e.preventDefault();
			this.#keySequence += e.key;
			return true;
		}

		if (e.key === "5" && this.#keySequence.match(/^\d+\.$/)) {
			e.preventDefault();
			this.#keySequence += e.key;

			const match = this.#keySequence.match(/^(\d+)\.5$/);
			if (match?.[1]) {
				const value = parseFloat(this.#keySequence);
				if (value >= this.opts.min.current && value <= this.opts.max.current) {
					this.setValue(value);
					this.#clearKeySequence();
				}
			}
			return true;
		}

		return false;
	}

	#startDecimalListening(baseValue: number): void {
		this.#keySequence = baseValue.toString();

		if (this.#keySequenceTimeout) {
			clearTimeout(this.#keySequenceTimeout);
		}

		this.#keySequenceTimeout = setTimeout(() => this.#clearKeySequence(), 1000);
	}

	#clearKeySequence(): void {
		this.#keySequence = "";
		if (this.#keySequenceTimeout) {
			clearTimeout(this.#keySequenceTimeout);
			this.#keySequenceTimeout = null;
		}
	}

	snippetProps = $derived.by(() => ({
		items: this.items,
		value: this.opts.value.current,
		max: this.opts.max.current,
	}));

	props = $derived.by(() => {
		return {
			id: this.opts.id.current,
			role: "slider",
			"aria-valuenow": this.opts.value.current,
			"aria-valuemin": this.opts.min.current,
			"aria-valuemax": this.opts.max.current,
			"aria-valuetext": this.ariaValuetext,
			"aria-orientation": this.opts.orientation.current,
			"aria-required": getAriaRequired(this.opts.required.current),
			"aria-disabled": this.opts.disabled.current ? "true" : undefined,
			"aria-label": "Rating",
			"data-disabled": getDataDisabled(this.opts.disabled.current),
			"data-readonly": this.opts.readonly.current ? "" : undefined,
			"data-orientation": this.opts.orientation.current,
			"data-max": this.opts.max.current,
			"data-value": this.opts.value.current,
			tabindex: this.opts.disabled.current ? -1 : 0,
			[RATING_GROUP_ROOT_ATTR]: "",
			onkeydown: this.onkeydown,
			onpointerleave: this.onpointerleave,
			...attachRef(this.opts.ref),
		} as const;
	});
}

type RatingGroupItemStateProps = WithRefProps<
	ReadableBoxedValues<{
		disabled: boolean;
		index: number;
	}>
>;

class RatingGroupItemState {
	readonly opts: RatingGroupItemStateProps;
	readonly root: RatingGroupRootState;
	#isDisabled = $derived.by(() => this.opts.disabled.current || this.root.opts.disabled.current);
	#isActive = $derived.by(() => this.root.isActive(this.opts.index.current));
	#isPartial = $derived.by(() => this.root.isPartial(this.opts.index.current));
	#state: RatingGroupItemStateType = $derived.by(() => {
		if (this.#isActive) return "active";
		if (this.#isPartial) return "partial";
		return "inactive";
	});

	constructor(opts: RatingGroupItemStateProps, root: RatingGroupRootState) {
		this.opts = opts;
		this.root = root;

		this.onclick = this.onclick.bind(this);
		this.onpointermove = this.onpointermove.bind(this);
	}

	onclick(e: BitsMouseEvent) {
		if (this.#isDisabled || this.root.opts.readonly.current) return;

		const newValue = this.root.calculateRatingFromPointer(this.opts.index.current, e);
		this.root.setValue(newValue);

		if (this.root.opts.ref.current) {
			this.root.opts.ref.current.focus();
		}
	}

	onpointermove(e: BitsPointerEvent) {
		if (
			this.#isDisabled ||
			this.root.opts.readonly.current ||
			!this.root.opts.hoverPreview.current
		)
			return;

		// skip hover preview for touch devices
		if (e.pointerType === "touch") return;

		const hoverValue = this.root.calculateRatingFromPointer(this.opts.index.current, e);
		this.root.setHoverValue(hoverValue);
	}

	snippetProps = $derived.by(() => {
		return {
			index: this.opts.index.current,
			state: this.#state,
		} as const;
	});

	props = $derived.by(
		() =>
			({
				id: this.opts.id.current,
				role: "presentation",
				"data-value": this.opts.index.current + 1,
				"data-orientation": this.root.opts.orientation.current,
				"data-disabled": getDataDisabled(this.#isDisabled),
				"data-readonly": this.root.opts.readonly.current ? "" : undefined,
				"data-state": this.#state,
				[RATING_GROUP_ITEM_ATTR]: "",
				//
				onclick: this.onclick,
				onpointermove: this.onpointermove,
				...attachRef(this.opts.ref),
			}) as const
	);
}

class RatingGroupHiddenInputState {
	readonly root: RatingGroupRootState;
	shouldRender = $derived.by(() => this.root.opts.name.current !== undefined);
	props = $derived.by(
		() =>
			({
				name: this.root.opts.name.current,
				value: this.root.opts.value.current,
				required: this.root.opts.required.current,
				disabled: this.root.opts.disabled.current,
			}) as const
	);

	constructor(root: RatingGroupRootState) {
		this.root = root;
	}
}

const RatingGroupRootContext = new Context<RatingGroupRootState>("RatingGroup.Root");

export function useRatingGroupRoot(props: RatingGroupRootStateProps) {
	return RatingGroupRootContext.set(new RatingGroupRootState(props));
}

export function useRatingGroupItem(props: RatingGroupItemStateProps) {
	return new RatingGroupItemState(props, RatingGroupRootContext.get());
}

export function useRatingGroupHiddenInput() {
	return new RatingGroupHiddenInputState(RatingGroupRootContext.get());
}
