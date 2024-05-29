<script lang="ts">
	import { box } from "svelte-toolbelt";
	import { useDialogTitle } from "../dialog.svelte.js";
	import type { TitleProps } from "../index.js";
	import { mergeProps } from "$lib/internal/mergeProps.js";
	import { useId } from "$lib/internal/useId.svelte.js";

	let {
		id = useId(),
		el = $bindable(),
		asChild,
		child,
		children,
		level = 2,
		...restProps
	}: TitleProps = $props();

	const state = useDialogTitle({
		id: box.with(() => id),
		level: box.with(() => level),
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
