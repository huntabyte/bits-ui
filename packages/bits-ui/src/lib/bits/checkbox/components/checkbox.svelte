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

	const state = useCheckboxRoot({
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

	const mergedProps = $derived(mergeProps({ ...restProps }, state.props));
</script>

{#if asChild}
	{@render child?.({ props: mergedProps, checked: state.checked.value })}
{:else}
	<button bind:this={el} {...mergedProps}>
		{@render children?.({
			checked: state.checked.value,
		})}
	</button>
{/if}

<CheckboxInput />
