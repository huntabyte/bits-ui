<script lang="ts">
	import { box } from "svelte-toolbelt";
	import type { TagRemoveProps } from "../index.js";
	import { useTagsInputTagRemove } from "../tags-input.svelte.js";
	import { useId } from "$lib/internal/useId.js";
	import { mergeProps } from "$lib/internal/mergeProps.js";

	let {
		id = useId(),
		ref = $bindable(null),
		child,
		children,
		...restProps
	}: TagRemoveProps = $props();

	const tagRemoveState = useTagsInputTagRemove({
		id: box.with(() => id),
		ref: box.with(
			() => ref,
			(v) => (ref = v)
		),
	});

	const mergedProps = $derived(mergeProps(restProps, tagRemoveState.props));
</script>

<div {...tagRemoveState.root.sharedGridCellProps}>
	{#if child}
		{@render child({ props: mergedProps })}
	{:else}
		<button {...mergedProps}>
			{@render children?.()}
		</button>
	{/if}
</div>
