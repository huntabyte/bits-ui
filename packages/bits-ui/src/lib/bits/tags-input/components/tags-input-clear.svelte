<script lang="ts">
	import { box, mergeProps } from "svelte-toolbelt";
	import type { TagsInputClearProps } from "../types.js";
	import { useTagsInputClear } from "../tags-input.svelte.js";
	import { useId } from "$lib/internal/use-id.js";

	let {
		id = useId(),
		ref = $bindable(null),
		children,
		child,
		...restProps
	}: TagsInputClearProps = $props();

	const clearState = useTagsInputClear({
		id: box.with(() => id),
		ref: box.with(
			() => ref,
			(v) => (ref = v)
		),
	});

	const mergedProps = $derived(mergeProps(restProps, clearState.props));
</script>

{#if child}
	{@render child({ props: mergedProps })}
{:else}
	<button {...mergedProps}>
		{@render children?.()}
	</button>
{/if}
