<script lang="ts">
	import { boxWith, mergeProps } from "svelte-toolbelt";
	import type { CheckboxRootProps } from "../types.js";
	import { CheckboxGroupContext, CheckboxRootState } from "../checkbox.svelte.js";
	import CheckboxInput from "./checkbox-input.svelte";
	import { createId } from "$lib/internal/create-id.js";
	import { watch } from "runed";

	const uid = $props.id();

	let {
		checked = $bindable(false),
		ref = $bindable(null),
		onCheckedChange,
		children,
		disabled = false,
		required = false,
		name = undefined,
		value = "on",
		id = createId(uid),
		indeterminate = $bindable(false),
		onIndeterminateChange,
		child,
		type = "button",
		readonly,
		...restProps
	}: CheckboxRootProps = $props();

	const group = CheckboxGroupContext.getOr(null);

	if (group && value) {
		if (group.opts.value.current.includes(value)) {
			checked = true;
		} else {
			checked = false;
		}
	}

	watch.pre(
		() => value,
		() => {
			if (group && value) {
				if (group.opts.value.current.includes(value)) {
					checked = true;
				} else {
					checked = false;
				}
			}
		}
	);

	const rootState = CheckboxRootState.create(
		{
			checked: boxWith(
				() => checked,
				(v) => {
					checked = v;
					onCheckedChange?.(v);
				}
			),
			disabled: boxWith(() => disabled ?? false),
			required: boxWith(() => required),
			name: boxWith(() => name),
			value: boxWith(() => value),
			id: boxWith(() => id),
			ref: boxWith(
				() => ref,
				(v) => (ref = v)
			),
			indeterminate: boxWith(
				() => indeterminate,
				(v) => {
					indeterminate = v;
					onIndeterminateChange?.(v);
				}
			),
			type: boxWith(() => type),
			readonly: boxWith(() => Boolean(readonly)),
		},
		group
	);

	const mergedProps = $derived(mergeProps({ ...restProps }, rootState.props));
</script>

{#if child}
	{@render child({
		props: mergedProps,
		...rootState.snippetProps,
	})}
{:else}
	<button {...mergedProps}>
		{@render children?.(rootState.snippetProps)}
	</button>
{/if}

<CheckboxInput />
