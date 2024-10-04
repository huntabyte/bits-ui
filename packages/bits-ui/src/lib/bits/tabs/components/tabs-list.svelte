<script lang="ts">
	import { box } from "svelte-toolbelt";
	import type { TabsListProps } from "../types.js";
	import { useTabsList } from "../tabs.svelte.js";
	import { mergeProps } from "$lib/internal/mergeProps.js";
	import { useId } from "$lib/internal/useId.js";

	let {
		child,
		children,
		id = useId(),
		ref = $bindable(null),
		...restProps
	}: TabsListProps = $props();

	const listState = useTabsList({
		id: box.with(() => id),
		ref: box.with(
			() => ref,
			(v) => (ref = v)
		),
	});

	const mergedProps = $derived(mergeProps(restProps, listState.props));
</script>

{#if child}
	{@render child({ props: mergedProps })}
{:else}
	<div {...mergedProps}>
		{@render children?.()}
	</div>
{/if}
