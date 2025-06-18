import {
	attachRef,
	DOMContext,
	type ReadableBoxedValues,
	type WritableBoxedValues,
} from "svelte-toolbelt";
import { Context } from "runed";
import type {
	BitsKeyboardEvent,
	BitsMouseEvent,
	BitsPointerEvent,
	RefAttachment,
	WithRefOpts,
} from "$lib/internal/types.js";
import { createBitsAttrs, getAriaRequired, getDataDisabled } from "$lib/internal/attrs.js";
import type {
	RatingGroupAriaValuetext,
	RatingGroupItemState as RatingGroupItemStateType,
} from "./types.js";
import type { Orientation } from "$lib/shared/index.js";
import { kbd } from "$lib/internal/kbd.js";

const ratingGroupAttrs = createBitsAttrs({
	component: "rating-group",
	parts: ["root", "item"],
});

const RatingGroupRootContext = new Context<RatingGroupRootState>("RatingGroup.Root");

interface RatingGroupRootStateOpts
	extends WithRefOpts,
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
		}>,
		WritableBoxedValues<{ value: number }> {}

export class RatingGroupRootState {
	static create(opts: RatingGroupRootStateOpts) {
		return RatingGroupRootContext.set(new RatingGroupRootState(opts));
	}

	readonly opts: RatingGroupRootStateOpts;
	readonly attachment: RefAttachment;

	#hoverValue = $state<number | null>(null);
	#keySequence = $state<string>("");
	#keySequenceTimeout: number | null = null;
	domContext: DOMContext;

	readonly hasValue = $derived.by(() => this.opts.value.current > 0);
	readonly valueToUse = $derived.by(() => this.#hoverValue ?? this.opts.value.current);
	readonly isRTL = $derived.by(() => {
		const element = this.opts.ref.current;
		if (!element) return false;
		const style = getComputedStyle(element);
		return style.direction === "rtl";
	});

	readonly ariaValuetext = $derived.by(() => {
		return typeof this.opts.ariaValuetext.current === "function"
			? this.opts.ariaValuetext.current(this.opts.value.current, this.opts.max.current)
			: this.opts.ariaValuetext.current;
	});

	readonly items = $derived.by(() => {
		const value = this.valueToUse;

		return Array.from({ length: this.opts.max.current }, (_, i) => {
			const itemValue = i + 1;
			const halfValue = itemValue - 0.5;

			const state: RatingGroupItemStateType =
				value >= itemValue
					? "active"
					: this.opts.allowHalf.current && value >= halfValue
						? "partial"
						: "inactive";

			return { index: i, state };
		});
	});

	constructor(opts: RatingGroupRootStateOpts) {
		this.opts = opts;
		this.attachment = attachRef(opts.ref);
		this.onkeydown = this.onkeydown.bind(this);
		this.onpointerleave = this.onpointerleave.bind(this);
		this.domContext = new DOMContext(this.opts.ref);
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
		if (
			this.opts.readonly.current ||
			this.opts.disabled.current ||
			!this.opts.hoverPreview.current
		)
			return;

		this.#hoverValue =
			value === null
				? null
				: Math.max(this.opts.min.current, Math.min(this.opts.max.current, value));
	}

	setValue(value: number): void {
		if (this.opts.readonly.current || this.opts.disabled.current) return;
		this.opts.value.current = Math.max(
			this.opts.min.current,
			Math.min(this.opts.max.current, value)
		);
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

	readonly handlers: Record<string, () => void> = {
		[kbd.ARROW_UP]: () => {
			this.setHoverValue(null);
			this.#adjustValue(this.opts.allowHalf.current ? 0.5 : 1);
		},
		[kbd.ARROW_RIGHT]: () => {
			this.setHoverValue(null);
			const increment = this.opts.allowHalf.current ? 0.5 : 1;
			// in RTL mode, right arrow should decrement
			this.#adjustValue(this.isRTL ? -increment : increment);
		},
		[kbd.ARROW_DOWN]: () => {
			this.setHoverValue(null);
			this.#adjustValue(this.opts.allowHalf.current ? -0.5 : -1);
		},
		[kbd.ARROW_LEFT]: () => {
			this.setHoverValue(null);
			const increment = this.opts.allowHalf.current ? 0.5 : 1;
			// in RTL mode, left arrow should increment
			this.#adjustValue(this.isRTL ? increment : -increment);
		},
		[kbd.HOME]: () => {
			this.setHoverValue(null);
			this.setValue(this.opts.min.current);
		},
		[kbd.END]: () => {
			this.setHoverValue(null);
			this.setValue(this.opts.max.current);
		},
		[kbd.PAGE_UP]: () => {
			this.setHoverValue(null);
			this.#adjustValue(1);
		},
		[kbd.PAGE_DOWN]: () => {
			this.setHoverValue(null);
			this.#adjustValue(-1);
		},
	};

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
			this.domContext.clearTimeout(this.#keySequenceTimeout);
		}

		this.#keySequenceTimeout = this.domContext.setTimeout(() => this.#clearKeySequence(), 1000);
	}

	#clearKeySequence(): void {
		this.#keySequence = "";
		if (this.#keySequenceTimeout) {
			this.domContext.clearTimeout(this.#keySequenceTimeout);
			this.#keySequenceTimeout = null;
		}
	}

	readonly snippetProps = $derived.by(() => ({
		items: this.items,
		value: this.opts.value.current,
		max: this.opts.max.current,
	}));

	readonly props = $derived.by(() => {
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
			tabindex: this.opts.disabled.current ? -1 : 0,
			[ratingGroupAttrs.root]: "",
			onkeydown: this.onkeydown,
			onpointerleave: this.onpointerleave,
			...this.attachment,
		} as const;
	});
}

interface RatingGroupItemStateOpts
	extends WithRefOpts,
		ReadableBoxedValues<{
			disabled: boolean;
			index: number;
		}> {}

export class RatingGroupItemState {
	static create(opts: RatingGroupItemStateOpts) {
		return new RatingGroupItemState(opts, RatingGroupRootContext.get());
	}

	readonly opts: RatingGroupItemStateOpts;
	readonly root: RatingGroupRootState;
	readonly attachment: RefAttachment;
	readonly #isDisabled = $derived.by(
		() => this.opts.disabled.current || this.root.opts.disabled.current
	);
	readonly #isActive = $derived.by(() => this.root.isActive(this.opts.index.current));
	readonly #isPartial = $derived.by(() => this.root.isPartial(this.opts.index.current));
	readonly #state: RatingGroupItemStateType = $derived.by(() => {
		if (this.#isActive) return "active";
		if (this.#isPartial) return "partial";
		return "inactive";
	});

	constructor(opts: RatingGroupItemStateOpts, root: RatingGroupRootState) {
		this.opts = opts;
		this.root = root;
		this.attachment = attachRef(opts.ref);

		this.onclick = this.onclick.bind(this);
		this.onpointermove = this.onpointermove.bind(this);
	}

	onclick(e: BitsMouseEvent) {
		if (this.#isDisabled || this.root.opts.readonly.current) return;

		// handle clearing when clicking on first item (index 0) that's already
		// active and min is 0
		if (
			this.opts.index.current === 0 &&
			this.root.opts.min.current === 0 &&
			this.root.opts.value.current > 0
		) {
			const newValue = this.root.calculateRatingFromPointer(this.opts.index.current, e);
			const currentValue = this.root.opts.value.current;

			// only clear if the calculated rating exactly matches current value
			if (newValue === currentValue) {
				this.root.setValue(0);
				if (this.root.opts.ref.current) {
					this.root.opts.ref.current.focus();
				}
				return;
			}
		}

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

	readonly snippetProps = $derived.by(() => {
		return {
			state: this.#state,
		} as const;
	});

	readonly props = $derived.by(
		() =>
			({
				id: this.opts.id.current,
				role: "presentation",
				"data-value": this.opts.index.current + 1,
				"data-orientation": this.root.opts.orientation.current,
				"data-disabled": getDataDisabled(this.#isDisabled),
				"data-readonly": this.root.opts.readonly.current ? "" : undefined,
				"data-state": this.#state,
				[ratingGroupAttrs.item]: "",
				//
				onclick: this.onclick,
				onpointermove: this.onpointermove,
				...this.attachment,
			}) as const
	);
}

export class RatingGroupHiddenInputState {
	static create() {
		return new RatingGroupHiddenInputState(RatingGroupRootContext.get());
	}
	readonly root: RatingGroupRootState;
	readonly shouldRender = $derived.by(() => this.root.opts.name.current !== undefined);
	readonly props = $derived.by(
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
