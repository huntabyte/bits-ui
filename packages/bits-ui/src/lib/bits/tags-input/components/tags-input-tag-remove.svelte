<script lang="ts">
	import { box, mergeProps } from "svelte-toolbelt";
	import type { TagsInputTagRemoveProps } from "../types.js";
	import { useTagsInputTagRemove } from "../tags-input.svelte.js";
	import { useId } from "$lib/internal/use-id.js";

	let {
		id = useId(),
		ref = $bindable(null),
		child,
		children,
		...restProps
	}: TagsInputTagRemoveProps = $props();

	const tagRemoveState = useTagsInputTagRemove({
		id: box.with(() => id),
		ref: box.with(
			() => ref,
			(v) => (ref = v)
		),
	});

	const mergedProps = $derived(mergeProps(restProps, tagRemoveState.props));
</script>

{#if child}
	{@render child({ props: mergedProps })}
{:else}
	<button {...mergedProps}>
		{@render children?.()}
	</button>
{/if}
