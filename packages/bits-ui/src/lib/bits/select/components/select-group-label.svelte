<script lang="ts">
	import { box } from "svelte-toolbelt";
	import type { GroupLabelProps } from "../index.js";
	import { useSelectGroupLabel } from "../select.svelte.js";
	import { useId } from "$lib/internal/useId.svelte.js";
	import { mergeProps } from "$lib/internal/mergeProps.js";

	let {
		asChild,
		children,
		child,
		ref = $bindable(),
		id = useId(),
		...restProps
	}: GroupLabelProps = $props();

	const groupLabelState = useSelectGroupLabel({
		id: box.with(() => id),
	});

	const mergedProps = $derived(mergeProps(restProps, groupLabelState.props));
</script>

{#if asChild}
	{@render child?.({ props: mergedProps })}
{:else}
	<div {...mergedProps} bind:this={ref}>
		{@render children?.()}
	</div>
{/if}
