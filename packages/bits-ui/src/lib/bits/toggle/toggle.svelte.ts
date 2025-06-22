import { attachRef, type ReadableBoxedValues, type WritableBoxedValues } from "svelte-toolbelt";
import {
	createBitsAttrs,
	getAriaPressed,
	getDataDisabled,
	getDisabled,
} from "$lib/internal/attrs.js";
import type { BitsMouseEvent, RefAttachment, WithRefOpts } from "$lib/internal/types.js";

export const toggleAttrs = createBitsAttrs({
	component: "toggle",
	parts: ["root"],
});

interface ToggleRootStateOpts
	extends WithRefOpts,
		ReadableBoxedValues<{
			disabled: boolean;
		}>,
		WritableBoxedValues<{
			pressed: boolean;
		}> {}

export class ToggleRootState {
	static create(opts: ToggleRootStateOpts) {
		return new ToggleRootState(opts);
	}
	readonly opts: ToggleRootStateOpts;
	readonly attachment: RefAttachment;

	constructor(opts: ToggleRootStateOpts) {
		this.opts = opts;
		this.attachment = attachRef(this.opts.ref);
		this.onclick = this.onclick.bind(this);
	}

	#togglePressed() {
		if (!this.opts.disabled.current) {
			this.opts.pressed.current = !this.opts.pressed.current;
		}
	}

	onclick(_: BitsMouseEvent) {
		if (this.opts.disabled.current) return;
		this.#togglePressed();
	}

	readonly snippetProps = $derived.by(() => ({
		pressed: this.opts.pressed.current,
	}));

	readonly props = $derived.by(
		() =>
			({
				[toggleAttrs.root]: "",
				id: this.opts.id.current,
				"data-disabled": getDataDisabled(this.opts.disabled.current),
				"aria-pressed": getAriaPressed(this.opts.pressed.current),
				"data-state": getToggleDataState(this.opts.pressed.current),
				disabled: getDisabled(this.opts.disabled.current),
				onclick: this.onclick,
				...this.attachment,
			}) as const
	);
}

export function getToggleDataState(condition: boolean): "on" | "off" {
	return condition ? "on" : "off";
}
