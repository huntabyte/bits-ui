<script lang="ts">
	import { box } from "svelte-toolbelt";
	import { useDialogDescription } from "../dialog.svelte.js";
	import type { DescriptionProps } from "../index.js";
	import { mergeProps } from "$lib/internal/mergeProps.js";
	import { useId } from "$lib/internal/useId.svelte.js";

	let {
		id = useId(),
		asChild,
		children,
		child,
		el = $bindable(),
		...restProps
	}: DescriptionProps = $props();

	const state = useDialogDescription({
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
