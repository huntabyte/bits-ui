<script lang="ts">
	import { box } from "svelte-toolbelt";
	import type { RootProps } from "../index.js";
	import { useCheckboxRoot } from "../checkbox.svelte.js";
	import CheckboxInput from "./checkbox-input.svelte";
	import { mergeProps } from "$lib/internal/mergeProps.js";

	let {
		checked = $bindable(false),
		onCheckedChange,
		children,
		disabled = false,
		required = false,
		name,
		value = "on",
		el = $bindable(),
		asChild,
		child,
		...restProps
	}: RootProps = $props();

	const rootState = useCheckboxRoot({
		checked: box.with(
			() => checked,
			(v) => {
				if (checked !== v) {
					checked = v;
					onCheckedChange?.(v);
				}
			}
		),
		disabled: box.with(() => disabled),
		required: box.with(() => required),
		name: box.with(() => name),
		value: box.with(() => value),
	});

	const mergedProps = $derived(mergeProps({ ...restProps }, rootState.props));
</script>

{#if asChild}
	{@render child?.({ props: mergedProps, checked: rootState.checked.value })}
{:else}
	<button bind:this={el} {...mergedProps}>
		{@render children?.({
			checked: rootState.checked.value,
		})}
	</button>
{/if}

<CheckboxInput />
