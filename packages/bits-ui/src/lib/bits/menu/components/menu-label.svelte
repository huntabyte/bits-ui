<script lang="ts">
	import type { LabelProps } from "../index.js";
	import { useMenuLabel } from "../menu.svelte.js";
	import { mergeProps } from "$lib/internal/mergeProps.js";

	let { asChild, children, child, ref = $bindable(), ...restProps }: LabelProps = $props();

	const labelState = useMenuLabel();
	const mergedProps = $derived(mergeProps(restProps, labelState.props));
</script>

{#if asChild}
	{@render child?.({ props: mergedProps })}
{:else}
	<div {...mergedProps} bind:this={ref}>
		{@render children?.()}
	</div>
{/if}
