<script lang="ts">
	import { getCheckboxIndicatorState } from "../checkbox.svelte.js";
	import type { IndicatorProps } from "../index.js";

	let { child, asChild, children, el = $bindable(), ...restProps }: IndicatorProps = $props();

	const indicatorState = getCheckboxIndicatorState();

	const mergedProps = $derived({
		...indicatorState.props,
		...restProps,
	});
</script>

{#if asChild}
	{@render child?.(mergedProps)}
{:else}
	<div bind:this={el} {...mergedProps}>
		{@render children?.({ checked: indicatorState.root.checked })}
	</div>
{/if}
