<script lang="ts">
	import type { SeparatorProps } from "../index.js";
	import { useSelectSeparator } from "../select.svelte.js";
	import { mergeProps } from "$lib/internal/mergeProps.js";
	import { useId } from "$lib/internal/useId.svelte.js";
	import { box } from "svelte-toolbelt";

	let {
		asChild,
		child,
		children,
		id = useId(),
		ref = $bindable(null),
		...restProps
	}: SeparatorProps = $props();

	const separatorState = useSelectSeparator({
		id: box.with(() => id),
		ref: box.with(
			() => ref,
			(v) => (ref = v)
		),
	});

	const mergedProps = $derived(mergeProps(restProps, separatorState.props));
</script>

{#if asChild}
	{@render child?.({ props: mergedProps })}
{:else}
	<div {...mergedProps}>
		{@render children?.()}
	</div>
{/if}
