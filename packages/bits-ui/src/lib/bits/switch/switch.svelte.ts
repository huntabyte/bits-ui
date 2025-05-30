import { attachRef } from "svelte-toolbelt";
import { Context } from "runed";
import {
	getAriaChecked,
	getAriaRequired,
	getDataChecked,
	getDataDisabled,
	getDataRequired,
	getDisabled,
	createBitsAttrs,
} from "$lib/internal/attrs.js";
import type { ReadableBoxedValues, WritableBoxedValues } from "$lib/internal/box.svelte.js";
import { kbd } from "$lib/internal/kbd.js";
import type { BitsKeyboardEvent, BitsPointerEvent, WithRefProps } from "$lib/internal/types.js";

const switchAttrs = createBitsAttrs({
	component: "switch",
	parts: ["root", "thumb"],
});

type SwitchRootStateProps = WithRefProps<
	ReadableBoxedValues<{
		disabled: boolean;
		required: boolean;
		name: string | undefined;
		value: string;
	}> &
		WritableBoxedValues<{
			checked: boolean;
		}>
>;
class SwitchRootState {
	readonly opts: SwitchRootStateProps;

	constructor(opts: SwitchRootStateProps) {
		this.opts = opts;

		this.onkeydown = this.onkeydown.bind(this);
		this.onclick = this.onclick.bind(this);
	}

	#toggle() {
		this.opts.checked.current = !this.opts.checked.current;
	}

	onkeydown(e: BitsKeyboardEvent) {
		if (!(e.key === kbd.ENTER || e.key === kbd.SPACE) || this.opts.disabled.current) return;
		e.preventDefault();
		this.#toggle();
	}

	onclick(_: BitsPointerEvent) {
		if (this.opts.disabled.current) return;
		this.#toggle();
	}

	readonly sharedProps = $derived.by(() => ({
		"data-disabled": getDataDisabled(this.opts.disabled.current),
		"data-state": getDataChecked(this.opts.checked.current),
		"data-required": getDataRequired(this.opts.required.current),
	}));

	readonly snippetProps = $derived.by(() => ({
		checked: this.opts.checked.current,
	}));

	readonly props = $derived.by(
		() =>
			({
				...this.sharedProps,
				id: this.opts.id.current,
				role: "switch",
				disabled: getDisabled(this.opts.disabled.current),
				"aria-checked": getAriaChecked(this.opts.checked.current, false),
				"aria-required": getAriaRequired(this.opts.required.current),
				[switchAttrs.root]: "",
				//
				onclick: this.onclick,
				onkeydown: this.onkeydown,
				...attachRef(this.opts.ref),
			}) as const
	);
}

class SwitchInputState {
	readonly root: SwitchRootState;
	readonly shouldRender = $derived.by(() => this.root.opts.name.current !== undefined);

	constructor(root: SwitchRootState) {
		this.root = root;
	}

	props = $derived.by(
		() =>
			({
				type: "checkbox",
				name: this.root.opts.name.current,
				value: this.root.opts.value.current,
				checked: this.root.opts.checked.current,
				disabled: this.root.opts.disabled.current,
				required: this.root.opts.required.current,
			}) as const
	);
}

type SwitchThumbStateProps = WithRefProps;

class SwitchThumbState {
	readonly opts: SwitchThumbStateProps;
	readonly root: SwitchRootState;

	constructor(opts: SwitchThumbStateProps, root: SwitchRootState) {
		this.opts = opts;
		this.root = root;
	}

	readonly snippetProps = $derived.by(() => ({
		checked: this.root.opts.checked.current,
	}));

	readonly props = $derived.by(
		() =>
			({
				...this.root.sharedProps,
				id: this.opts.id.current,
				[switchAttrs.thumb]: "",
				...attachRef(this.opts.ref),
			}) as const
	);
}

const SwitchRootContext = new Context<SwitchRootState>("Switch.Root");

export function useSwitchRoot(props: SwitchRootStateProps) {
	return SwitchRootContext.set(new SwitchRootState(props));
}

export function useSwitchInput(): SwitchInputState {
	return new SwitchInputState(SwitchRootContext.get());
}

export function useSwitchThumb(props: SwitchThumbStateProps): SwitchThumbState {
	return new SwitchThumbState(props, SwitchRootContext.get());
}
