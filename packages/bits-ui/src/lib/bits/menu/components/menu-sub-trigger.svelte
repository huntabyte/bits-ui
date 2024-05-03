<script lang="ts">
	import { box } from "runed";
	import type { ItemProps } from "../index.js";
	import { useMenuSubTrigger } from "../menu.svelte.js";
	import { useId } from "$lib/internal/useId.svelte.js";
	import { mergeProps } from "$lib/internal/mergeProps.js";

	let {
		id = useId(),
		disabled = false,
		el = $bindable(),
		asChild,
		children,
		child,
		...restProps
	}: ItemProps = $props();

	const state = useMenuSubTrigger({
		disabled: box.with(() => disabled),
		id: box.with(() => id),
	});

	const mergedProps = $derived(mergeProps(restProps, state.props));
</script>

{#if asChild}
	{@render child?.({ props: mergedProps })}
{:else}
	<div {...mergedProps} bind:this={el}>
		{@render children?.()}
	</div>
{/if}
