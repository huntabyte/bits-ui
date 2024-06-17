<script lang="ts">
	import type { SeparatorProps } from "../index.js";
	import { useMenuSeparator } from "../menu.svelte.js";
	import { mergeProps } from "$lib/internal/mergeProps.js";

	let { ref = $bindable(), asChild, child, children, ...restProps }: SeparatorProps = $props();

	const separatorState = useMenuSeparator();

	const mergedProps = $derived(mergeProps(restProps, separatorState.props));
</script>

{#if asChild}
	{@render child?.({ props: mergedProps })}
{:else}
	<div {...mergedProps}>
		{@render children?.()}
	</div>
{/if}
