<script lang="ts">
	import { box, mergeProps } from "svelte-toolbelt";
	import type { SelectSeparatorProps } from "../types.js";
	import { useSelectSeparator } from "../select.svelte.js";
	import { useId } from "$lib/internal/use-id.js";

	let {
		child,
		children,
		id = useId(),
		ref = $bindable(null),
		...restProps
	}: SelectSeparatorProps = $props();

	const separatorState = useSelectSeparator({
		id: box.with(() => id),
		ref: box.with(
			() => ref,
			(v) => (ref = v)
		),
	});

	const mergedProps = $derived(mergeProps(restProps, separatorState.props));
</script>

{#if child}
	{@render child({ props: mergedProps })}
{:else}
	<div {...mergedProps}>
		{@render children?.()}
	</div>
{/if}
