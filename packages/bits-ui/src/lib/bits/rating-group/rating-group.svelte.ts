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
	hasValue = $derived.by(() => this.opts.value.current > 0);
	#hoverValue = $state<number | null>(null);
	readonly ariaValuetext = $derived.by(() => {
		if (typeof this.opts.ariaValuetext.current === "function") {
			return this.opts.ariaValuetext.current(this.opts.value.current, this.opts.max.current);
		}
		return this.opts.ariaValuetext.current;
	});
	valueToUse = $derived.by(() => this.#hoverValue ?? this.opts.value.current);

	constructor(opts: RatingGroupRootStateProps) {
		this.opts = opts;
		this.onkeydown = this.onkeydown.bind(this);
		this.onpointerleave = this.onpointerleave.bind(this);
	}

	items = $derived.by(() => {
		const items: Array<{
			index: number;
			state: RatingGroupItemStateType;
		}> = [];
		const valueToUse = this.#hoverValue ?? this.opts.value.current;

		for (let i = 0; i < this.opts.max.current; i++) {
			const itemValue = i + 1;
			const isActive = valueToUse >= itemValue;
			const isPartial =
				this.opts.allowHalf.current &&
				valueToUse >= itemValue - 0.5 &&
				valueToUse < itemValue;

			const state: RatingGroupItemStateType = isActive
				? "active"
				: isPartial
					? "partial"
					: "inactive";

			items.push({
				index: i,
				state,
			});
		}
		return items;
	});

	isActive(itemIndex: number) {
		const itemValue = this.#getRatingValue(itemIndex);
		return this.valueToUse >= itemValue;
	}

	isPartial(itemIndex: number) {
		if (!this.opts.allowHalf.current) return false;
		const itemValue = this.#getRatingValue(itemIndex);
		return this.valueToUse >= itemValue - 0.5 && this.valueToUse < itemValue;
	}

	setHoverValue(value: number | null) {
		if (
			this.opts.readonly.current ||
			this.opts.disabled.current ||
			!this.opts.hoverPreview.current
		)
			return;
		this.#hoverValue = value;
	}

	/**
	 * Convert 0-based index to 1-based rating value
	 * @param index - The index of the item
	 * @returns The rating value
	 */
	#getRatingValue(index: number) {
		return index + 1;
	}

	calculateRatingFromPointer(
		itemIndex: number,
		event: { clientX: number; clientY: number; currentTarget: HTMLElement }
	): number {
		let ratingValue = this.#getRatingValue(itemIndex);
		if (!this.opts.allowHalf.current) return ratingValue;

		const rect = event.currentTarget.getBoundingClientRect();
		const isRtl = getComputedStyle(event.currentTarget).direction === "rtl";
		const pointerPosition =
			this.opts.orientation.current === "horizontal"
				? (event.clientX - rect.left) / rect.width
				: (event.clientY - rect.top) / rect.height;

		const normalizedPosition = isRtl ? 1 - pointerPosition : pointerPosition;

		if (normalizedPosition < 0.5) {
			ratingValue = this.#getRatingValue(itemIndex) - 0.5;
		}

		return ratingValue;
	}

	onpointerleave() {
		this.setHoverValue(null);
	}

	setValue(value: number) {
		if (this.opts.readonly.current || this.opts.disabled.current) return;
		const clampedValue = Math.max(
			this.opts.min.current,
			Math.min(this.opts.max.current, value)
		);
		this.opts.value.current = clampedValue;
	}

	onkeydown(e: BitsKeyboardEvent) {
		if (this.opts.disabled.current || this.opts.readonly.current) return;

		const step = this.opts.allowHalf.current ? 0.5 : 1;
		const currentValue = this.opts.value.current;

		if (e.key === kbd.ARROW_UP || e.key === kbd.ARROW_RIGHT) {
			e.preventDefault();
			this.setValue(currentValue + step);
			return;
		}

		if (e.key === kbd.ARROW_DOWN || e.key === kbd.ARROW_LEFT) {
			e.preventDefault();
			this.setValue(currentValue - step);
			return;
		}

		if (e.key === kbd.HOME) {
			e.preventDefault();
			this.setValue(this.opts.min.current);
			return;
		}

		if (e.key === kbd.END) {
			e.preventDefault();
			this.setValue(this.opts.max.current);
			return;
		}

		if (e.key === kbd.PAGE_UP) {
			e.preventDefault();
			this.setValue(currentValue + 1);
			return;
		}

		if (e.key === kbd.PAGE_DOWN) {
			e.preventDefault();
			this.setValue(currentValue - 1);
			return;
		}

		// handle number keys for direct rating
		const numKey = parseInt(e.key);
		if (!isNaN(numKey) && numKey >= this.opts.min.current && numKey <= this.opts.max.current) {
			e.preventDefault();
			this.setValue(numKey);
			return;
		}
	}

	snippetProps = $derived.by(() => ({
		items: this.items,
		value: this.opts.value.current,
		max: this.opts.max.current,
	}));

	props = $derived.by(
		() =>
			({
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
			}) as const
	);
}

//
// RATING GROUP ITEM
//

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
