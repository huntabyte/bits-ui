<script lang="ts">
	import { box } from "svelte-toolbelt";
	import type { ScrollUpButtonProps } from "../index.js";
	import { useSelectScrollUpButton } from "../select.svelte.js";
	import { useId } from "$lib/internal/useId.svelte.js";
	import { mergeProps } from "$lib/internal/mergeProps.js";

	let {
		id = useId(),
		asChild,
		child,
		children,
		el = $bindable(),
		...restProps
	}: ScrollUpButtonProps = $props();

	const state = useSelectScrollUpButton({
		id: box.with(() => id),
	});

	const mergedProps = $derived(mergeProps(restProps, state.props));
</script>

{#if state.canScrollUp}
	{#if asChild}
		{@render child?.({ props: mergedProps })}
	{:else}
		<div {...mergedProps} bind:this={el}>
			{@render children?.()}
		</div>
	{/if}
{/if}
