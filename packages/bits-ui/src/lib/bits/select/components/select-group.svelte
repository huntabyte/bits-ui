<script lang="ts">
	import type { GroupProps } from "../index.js";
	import { useSelectGroup } from "../select.svelte.js";
	import { mergeProps } from "$lib/internal/mergeProps.js";

	let { asChild, children, child, ref = $bindable(), ...restProps }: GroupProps = $props();

	const groupState = useSelectGroup();
	const mergedProps = $derived(mergeProps(restProps, groupState.props));
</script>

{#if asChild}
	{@render child?.({ props: mergedProps })}
{:else}
	<div {...mergedProps} bind:this={ref}>
		{@render children?.()}
	</div>
{/if}
