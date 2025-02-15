<script lang="ts">
	import { box, mergeProps } from "svelte-toolbelt";
	import type { TagsInputTagEditProps } from "../types.js";
	import { useTagsInputTagEdit } from "../tags-input.svelte.js";
	import { useId } from "$lib/internal/use-id.js";

	let {
		id = useId(),
		ref = $bindable(null),
		child,
		children,
		disabled = false,
		...restProps
	}: TagsInputTagEditProps = $props();

	const tagEditState = useTagsInputTagEdit({
		id: box.with(() => id),
		ref: box.with(
			() => ref,
			(v) => (ref = v)
		),
		disabled: box.with(() => disabled),
	});

	const mergedProps = $derived(mergeProps(restProps, tagEditState.props));
</script>

{#if child}
	{@render child({ props: mergedProps })}
{:else}
	<button {...mergedProps}>
		{@render children?.()}
	</button>
{/if}
