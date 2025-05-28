import { attachRef } from "svelte-toolbelt";
import { Context } from "runed";
import type { ReadableBoxedValues, WritableBoxedValues } from "$lib/internal/box.svelte.js";
import type {
	BitsFocusEvent,
	BitsKeyboardEvent,
	BitsMouseEvent,
	WithRefProps,
} from "$lib/internal/types.js";
import { getAriaRequired, getDataDisabled } from "$lib/internal/attrs.js";
import type { Orientation } from "$lib/shared/index.js";
import {
	type UseRovingFocusReturn,
	useRovingFocus,
} from "$lib/internal/use-roving-focus.svelte.js";
import { kbd } from "$lib/internal/kbd.js";

const RATING_GROUP_ROOT_ATTR = "data-rating-group-root";
const RATING_GROUP_ITEM_ATTR = "data-rating-group-item";

type RatingGroupRootStateProps = WithRefProps<
	ReadableBoxedValues<{
		disabled: boolean;
		required: boolean;
		loop: boolean;
		orientation: Orientation;
		name: string | undefined;
		max: number;
		allowHalf: boolean;
		readonly: boolean;
	}> &
		WritableBoxedValues<{ value: number }>
>;

class RatingGroupRootState {
	readonly opts: RatingGroupRootStateProps;
	rovingFocusGroup: UseRovingFocusReturn;
	hasValue = $derived.by(() => this.opts.value.current > 0);

	constructor(opts: RatingGroupRootStateProps) {
		this.opts = opts;
		this.rovingFocusGroup = useRovingFocus({
			rootNode: this.opts.ref,
			candidateAttr: RATING_GROUP_ITEM_ATTR,
			loop: this.opts.loop,
			orientation: this.opts.orientation,
		});
	}

	// Generate items for snippet
	items = $derived.by(() => {
		const items: Array<{
			value: number;
			active: boolean;
			partial: boolean;
			state: "active" | "partial" | "inactive";
		}> = [];
		for (let i = 1; i <= this.opts.max.current; i++) {
			const isActive = this.opts.value.current >= i;
			const isPartial =
				this.opts.allowHalf.current &&
				this.opts.value.current >= i - 0.5 &&
				this.opts.value.current < i;

			const state: "active" | "partial" | "inactive" = isActive
				? "active"
				: isPartial
					? "partial"
					: "inactive";

			items.push({
				value: i,
				active: isActive,
				partial: isPartial,
				state,
			});
		}
		return items;
	});

	isActive(itemValue: number) {
		const currentValue = this.opts.value.current;
		if (this.opts.allowHalf.current) {
			return currentValue >= itemValue;
		}
		return currentValue >= itemValue;
	}

	isPartial(itemValue: number) {
		if (!this.opts.allowHalf.current) return false;
		const currentValue = this.opts.value.current;
		return currentValue >= itemValue - 0.5 && currentValue < itemValue;
	}

	setValue(value: number) {
		if (this.opts.readonly.current) return;
		// Clamp value between 0 and max
		const clampedValue = Math.max(0, Math.min(this.opts.max.current, value));
		this.opts.value.current = clampedValue;
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
				role: "radiogroup",
				"aria-required": getAriaRequired(this.opts.required.current),
				"data-disabled": getDataDisabled(this.opts.disabled.current),
				"data-readonly": this.opts.readonly.current ? "" : undefined,
				"data-orientation": this.opts.orientation.current,
				"data-max": this.opts.max.current,
				"data-value": this.opts.value.current,
				"aria-label": `Rating ${this.opts.value.current} out of ${this.opts.max.current}`,
				[RATING_GROUP_ROOT_ATTR]: "",
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
		value: number;
	}>
>;

class RatingGroupItemState {
	readonly opts: RatingGroupItemStateProps;
	readonly root: RatingGroupRootState;
	#isDisabled = $derived.by(() => this.opts.disabled.current || this.root.opts.disabled.current);
	#isActive = $derived.by(() => this.root.isActive(this.opts.value.current));
	#isPartial = $derived.by(() => this.root.isPartial(this.opts.value.current));
	#tabIndex = $state(-1);

	constructor(opts: RatingGroupItemStateProps, root: RatingGroupRootState) {
		this.opts = opts;
		this.root = root;

		// Set initial tab index
		if (this.opts.value.current === 1) {
			this.#tabIndex = 0;
		}

		$effect(() => {
			this.#tabIndex = this.root.rovingFocusGroup.getTabIndex(this.opts.ref.current);
		});

		this.onclick = this.onclick.bind(this);
		this.onmouseenter = this.onmouseenter.bind(this);
		this.onkeydown = this.onkeydown.bind(this);
		this.onfocus = this.onfocus.bind(this);
	}

	onclick(e: BitsMouseEvent) {
		if (this.#isDisabled || this.root.opts.readonly.current) return;

		let newValue = this.opts.value.current;

		if (this.root.opts.allowHalf.current && e.currentTarget instanceof HTMLElement) {
			const rect = e.currentTarget.getBoundingClientRect();
			const isRtl = getComputedStyle(e.currentTarget).direction === "rtl";
			const clickPosition =
				this.root.opts.orientation.current === "horizontal"
					? (e.clientX - rect.left) / rect.width
					: (e.clientY - rect.top) / rect.height;

			// Adjust for RTL
			const normalizedPosition = isRtl ? 1 - clickPosition : clickPosition;

			if (normalizedPosition < 0.5) {
				newValue = this.opts.value.current - 0.5;
			}
		}

		this.root.setValue(newValue);
	}

	onmouseenter(_: BitsMouseEvent) {
		if (this.#isDisabled || this.root.opts.readonly.current) return;
		// Optional: could implement hover preview here
	}

	onfocus(_: BitsFocusEvent) {
		// Focus handling for keyboard navigation
	}

	onkeydown(e: BitsKeyboardEvent) {
		if (this.#isDisabled || this.root.opts.readonly.current) return;

		if (e.key === kbd.SPACE || e.key === kbd.ENTER) {
			e.preventDefault();
			this.root.setValue(this.opts.value.current);
			return;
		}

		if (e.key === kbd.ARROW_UP || e.key === kbd.ARROW_RIGHT) {
			e.preventDefault();
			const increment = this.root.opts.allowHalf.current ? 0.5 : 1;
			this.root.setValue(this.root.opts.value.current + increment);
			return;
		}

		if (e.key === kbd.ARROW_DOWN || e.key === kbd.ARROW_LEFT) {
			e.preventDefault();
			const decrement = this.root.opts.allowHalf.current ? 0.5 : 1;
			this.root.setValue(this.root.opts.value.current - decrement);
			return;
		}

		if (e.key === kbd.HOME) {
			e.preventDefault();
			this.root.setValue(0);
			return;
		}

		if (e.key === kbd.END) {
			e.preventDefault();
			this.root.setValue(this.root.opts.max.current);
			return;
		}

		// Handle number keys for direct rating
		const numKey = parseInt(e.key);
		if (!isNaN(numKey) && numKey >= 0 && numKey <= this.root.opts.max.current) {
			e.preventDefault();
			this.root.setValue(numKey);
			return;
		}

		this.root.rovingFocusGroup.handleKeydown(this.opts.ref.current, e, true);
	}

	snippetProps = $derived.by(() => ({
		active: this.#isActive,
		partial: this.#isPartial,
		value: this.opts.value.current,
		rootValue: this.root.opts.value.current,
	}));

	props = $derived.by(
		() =>
			({
				id: this.opts.id.current,
				disabled: this.#isDisabled ? true : undefined,
				"data-value": this.opts.value.current,
				"data-orientation": this.root.opts.orientation.current,
				"data-disabled": getDataDisabled(this.#isDisabled),
				"data-readonly": this.root.opts.readonly.current ? "" : undefined,
				"data-state": this.#isActive ? "active" : this.#isPartial ? "partial" : "inactive",
				"aria-label": `Rate ${this.opts.value.current} out of ${this.root.opts.max.current}`,
				[RATING_GROUP_ITEM_ATTR]: "",
				type: "button",
				role: "radio",
				tabindex: this.#tabIndex,
				//
				onkeydown: this.onkeydown,
				onfocus: this.onfocus,
				onclick: this.onclick,
				onmouseenter: this.onmouseenter,
				...attachRef(this.opts.ref),
			}) as const
	);
}

//
// INPUT
//

class RatingGroupInputState {
	readonly root: RatingGroupRootState;
	shouldRender = $derived.by(() => this.root.opts.name.current !== undefined);
	props = $derived.by(
		() =>
			({
				name: this.root.opts.name.current,
				value: this.root.opts.value.current.toString(),
				required: this.root.opts.required.current,
				disabled: this.root.opts.disabled.current,
				type: "hidden",
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

export function useRatingGroupInput() {
	return new RatingGroupInputState(RatingGroupRootContext.get());
}
