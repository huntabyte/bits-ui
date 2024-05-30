<script lang="ts">
	import type { GroupProps } from "../index.js";
	import { useMenuGroup } from "../menu.svelte.js";
	import { mergeProps } from "$lib/internal/mergeProps.js";

	let { asChild, children, child, el = $bindable(), ...restProps }: GroupProps = $props();

	const state = useMenuGroup();
	const mergedProps = $derived(mergeProps(restProps, state.props));
</script>

{#if asChild}
	{@render child?.({ props: mergedProps })}
{:else}
	<div {...mergedProps} bind:this={el}>
		{@render children?.()}
	</div>
{/if}
