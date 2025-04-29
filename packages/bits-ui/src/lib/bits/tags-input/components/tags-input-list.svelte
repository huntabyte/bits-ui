<script lang="ts">
	import { box, mergeProps } from "svelte-toolbelt";
	import type { TagsInputListProps } from "../types.js";
	import { useTagsInputList } from "../tags-input.svelte.js";
	import { useId } from "$lib/internal/use-id.js";

	let {
		id = useId(),
		ref = $bindable(null),
		children,
		child,
		...restProps
	}: TagsInputListProps = $props();

	const listState = useTagsInputList({
		id: box.with(() => id),
		ref: box.with(
			() => ref,
			(v) => (ref = v)
		),
	});

	const mergedProps = $derived(mergeProps(restProps, listState.props));
	const mergedWrapperProps = $derived(mergeProps(listState.gridWrapperProps, {}));
</script>

<div {...mergedWrapperProps}>
	{#if child}
		{@render child({ props: mergedProps })}
	{:else}
		<div {...mergedProps}>
			{@render children?.()}
		</div>
	{/if}
</div>
