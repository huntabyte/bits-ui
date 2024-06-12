<script lang="ts">
	import type { TriggerProps } from "../index.js";
	import { useCollapsibleTrigger } from "../collapsible.svelte.js";
	import { mergeProps } from "$lib/internal/mergeProps.js";

	let { asChild, children, child, ref = $bindable(), ...restProps }: TriggerProps = $props();

	const triggerState = useCollapsibleTrigger();
	const mergedProps = $derived(mergeProps(restProps, triggerState.props));
</script>

{#if asChild}
	{@render child?.({ props: mergedProps })}
{:else}
	<button bind:this={ref} {...mergedProps}>
		{@render children?.()}
	</button>
{/if}
