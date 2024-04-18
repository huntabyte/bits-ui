<script lang="ts">
	import type { ThumbProps } from "../index.js";
	import { getSwitchThumbState } from "../switch.svelte.js";
	import { styleToString } from "$lib/internal/style.js";

	let { asChild, child, el = $bindable(), style = {}, ...restProps }: ThumbProps = $props();

	const thumbState = getSwitchThumbState();

	const mergedProps = $derived({
		...restProps,
		...thumbState.props,
		style: styleToString(style),
	});
</script>

{#if asChild}
	{@render child?.({ props: mergedProps, checked: thumbState.root.checked.value })}
{:else}
	<span bind:this={el} {...mergedProps} />
{/if}
