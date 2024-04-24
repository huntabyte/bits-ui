<script lang="ts">
	import type { ThumbProps } from "../index.js";
	import { getSwitchThumbState } from "../switch.svelte.js";
	import { mergeProps } from "$lib/internal/mergeProps.js";

	let { asChild, child, el = $bindable(), ...restProps }: ThumbProps = $props();

	const state = getSwitchThumbState();

	const mergedProps = $derived(mergeProps(restProps, state.props));
</script>

{#if asChild}
	{@render child?.({ props: mergedProps, checked: state.root.checked.value })}
{:else}
	<span bind:this={el} {...mergedProps}></span>
{/if}
