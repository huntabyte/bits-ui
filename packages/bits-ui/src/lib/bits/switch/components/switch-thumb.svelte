<script lang="ts">
	import type { ThumbProps } from "../index.js";
	import { useSwitchThumb } from "../switch.svelte.js";
	import { mergeProps } from "$lib/internal/mergeProps.js";

	let { asChild, child, el = $bindable(), ...restProps }: ThumbProps = $props();

	const thumbState = useSwitchThumb();
	const mergedProps = $derived(mergeProps(restProps, thumbState.props));
</script>

{#if asChild}
	{@render child?.({ props: mergedProps, checked: thumbState.root.checked.value })}
{:else}
	<span bind:this={el} {...mergedProps}></span>
{/if}
