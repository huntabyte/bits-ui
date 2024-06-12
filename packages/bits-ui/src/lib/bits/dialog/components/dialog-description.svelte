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
		ref = $bindable(),
		...restProps
	}: DescriptionProps = $props();

	const descriptionState = useDialogDescription({
		id: box.with(() => id),
	});

	const mergedProps = $derived(mergeProps(restProps, descriptionState.props));
</script>

{#if asChild}
	{@render child?.({ props: mergedProps })}
{:else}
	<div {...mergedProps} bind:this={ref}>
		{@render children?.()}
	</div>
{/if}
