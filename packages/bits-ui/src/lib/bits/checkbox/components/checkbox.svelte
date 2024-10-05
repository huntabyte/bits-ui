<script lang="ts">
	import { box } from "svelte-toolbelt";
	import type { CheckboxRootProps } from "../types.js";
	import { useCheckboxRoot } from "../checkbox.svelte.js";
	import CheckboxInput from "./checkbox-input.svelte";
	import { mergeProps } from "$lib/internal/merge-props.js";
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
	});

	const mergedProps = $derived(mergeProps({ ...restProps }, rootState.props));
</script>

{#if child}
	{@render child({ props: mergedProps, checked: rootState.checked.current })}
{:else}
	<button {...mergedProps}>
		{@render children?.({
			checked: rootState.checked.current,
		})}
	</button>
{/if}

<CheckboxInput />
