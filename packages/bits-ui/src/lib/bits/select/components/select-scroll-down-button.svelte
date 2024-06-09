<script lang="ts">
	import { box } from "svelte-toolbelt";
	import type { ScrollUpButtonProps } from "../index.js";
	import { useSelectScrollDownButton } from "../select.svelte.js";
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

	const state = useSelectScrollDownButton({
		id: box.with(() => id),
	});

	const mergedProps = $derived(mergeProps(restProps, state.props));
</script>

{#if state.canScrollDown}
	{#if asChild}
		{@render child?.({ props: mergedProps })}
	{:else}
		<div {...mergedProps} bind:this={el}>
			{@render children?.()}
		</div>
	{/if}
{/if}
