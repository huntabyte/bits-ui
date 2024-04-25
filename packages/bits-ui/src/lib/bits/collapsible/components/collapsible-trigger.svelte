<script lang="ts">
	import type { TriggerProps } from "../index.js";
	import { useCollapsibleTrigger } from "../collapsible.svelte.js";
	import { mergeProps } from "$lib/internal/mergeProps.js";

	let { asChild, children, child, el = $bindable(), ...restProps }: TriggerProps = $props();

	const state = useCollapsibleTrigger();
	const mergedProps = $derived(mergeProps(restProps, state.props));
</script>

{#if asChild}
	{@render child?.({ props: mergedProps })}
{:else}
	<button bind:this={el} {...mergedProps}>
		{@render children?.()}
	</button>
{/if}
