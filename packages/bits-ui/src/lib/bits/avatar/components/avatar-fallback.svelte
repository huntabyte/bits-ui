<script lang="ts">
	import type { FallbackProps } from "../index.js";
	import { useAvatarFallback } from "../avatar.svelte.js";
	import { mergeProps } from "$lib/internal/mergeProps.js";

	let { asChild, children, child, ref = $bindable(), ...restProps }: FallbackProps = $props();

	const fallbackState = useAvatarFallback();

	const mergedProps = $derived(mergeProps(restProps, fallbackState.props));
</script>

{#if asChild}
	{@render child?.({ props: mergedProps })}
{:else}
	<span bind:this={ref} {...mergedProps}>
		{@render children?.()}
	</span>
{/if}
