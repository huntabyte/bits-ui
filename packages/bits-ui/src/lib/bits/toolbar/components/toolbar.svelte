<script lang="ts">
	import { box } from "svelte-toolbelt";
	import type { RootProps } from "../index.js";
	import { useToolbarRoot } from "../toolbar.svelte.js";
	import { mergeProps } from "$lib/internal/mergeProps.js";
	import { useId } from "$lib/internal/useId.svelte.js";

	let {
		asChild,
		child,
		children,
		el = $bindable(),
		id = useId(),
		orientation = "horizontal",
		loop = true,
		...restProps
	}: RootProps = $props();

	const rootState = useToolbarRoot({
		id: box.with(() => id),
		orientation: box.with(() => orientation),
		loop: box.with(() => loop),
	});

	const mergedProps = $derived(mergeProps(restProps, rootState.props));
</script>

{#if asChild}
	{@render child?.({ props: mergedProps })}
{:else}
	<div {...mergedProps} bind:this={el}>
		{@render children?.()}
	</div>
{/if}
