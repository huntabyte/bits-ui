<script lang="ts">
	import { box, mergeProps } from "svelte-toolbelt";
	import type { CheckboxRootProps } from "../types.js";
	import { useCheckboxRoot } from "../checkbox.svelte.js";
	import CheckboxInput from "./checkbox-input.svelte";
	import { useId } from "$lib/internal/use-id.js";

	let {
		checked = $bindable(false),
		ref = $bindable(null),
		onCheckedChange,
		children,
		disabled = false,
		required = false,
		name = undefined,
		value = "on",
		id = useId(),
		controlledChecked = false,
		indeterminate = $bindable(false),
		controlledIndeterminate = false,
		onIndeterminateChange,
		child,
		...restProps
	}: CheckboxRootProps = $props();

	const rootState = useCheckboxRoot({
		checked: box.with(
			() => checked,
			(v) => {
				if (controlledChecked) {
					onCheckedChange?.(v);
				} else {
					checked = v;
					onCheckedChange?.(v);
				}
			}
		),
		disabled: box.with(() => disabled ?? false),
		required: box.with(() => required),
		name: box.with(() => name),
		value: box.with(() => value),
		id: box.with(() => id),
		ref: box.with(
			() => ref,
			(v) => (ref = v)
		),
		indeterminate: box.with(
			() => indeterminate,
			(v) => {
				if (controlledIndeterminate) {
					onIndeterminateChange?.(v);
				} else {
					indeterminate = v;
					onIndeterminateChange?.(v);
				}
			}
		),
	});

	const mergedProps = $derived(mergeProps({ ...restProps }, rootState.props));
</script>

{#if child}
	{@render child({
		props: mergedProps,
		checked: rootState.checked.current,
		indeterminate: rootState.indeterminate.current,
	})}
{:else}
	<button {...mergedProps}>
		{@render children?.({
			checked: rootState.checked.current,
			indeterminate: rootState.indeterminate.current,
		})}
	</button>
{/if}

<CheckboxInput />
