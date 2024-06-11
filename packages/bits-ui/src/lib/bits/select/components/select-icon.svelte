<script lang="ts">
	import type { IconProps } from "../index.js";
	import { useSelectIcon } from "../select.svelte.js";
	import { mergeProps } from "$lib/internal/mergeProps.js";

	let { asChild, children, child, el = $bindable(), ...restProps }: IconProps = $props();

	const iconState = useSelectIcon();

	const mergedProps = $derived(mergeProps(restProps, iconState.props));
</script>

{#if asChild}
	{@render child?.({ props: mergedProps })}
{:else}
	<span {...mergedProps} bind:this={el}>
		{#if children}
			{@render children()}
		{:else}
			▼
		{/if}
	</span>
{/if}
