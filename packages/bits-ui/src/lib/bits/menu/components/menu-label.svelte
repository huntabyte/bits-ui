<script lang="ts">
	import type { LabelProps } from "../index.js";
	import { useMenuLabel } from "../menu.svelte.js";
	import { mergeProps } from "$lib/internal/mergeProps.js";

	let { asChild, children, child, el = $bindable(), ...restProps }: LabelProps = $props();

	const state = useMenuLabel();
	const mergedProps = $derived(mergeProps(restProps, state.props));
</script>

{#if asChild}
	{@render child?.({ props: mergedProps })}
{:else}
	<div {...mergedProps} bind:this={el}>
		{@render children?.()}
	</div>
{/if}
