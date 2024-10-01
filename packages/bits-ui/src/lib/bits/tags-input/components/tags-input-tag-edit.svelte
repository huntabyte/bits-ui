<script lang="ts">
	import { box } from "svelte-toolbelt";
	import type { TagEditProps } from "../index.js";
	import { useTagsInputTagEdit } from "../tags-input.svelte.js";
	import { useId } from "$lib/internal/useId.js";
	import { mergeProps } from "$lib/internal/mergeProps.js";

	let { id = useId(), ref = $bindable(null), child, ...restProps }: TagEditProps = $props();

	const tagEditState = useTagsInputTagEdit({
		id: box.with(() => id),
		ref: box.with(
			() => ref,
			(v) => (ref = v)
		),
	});

	const mergedProps = $derived(mergeProps(restProps, tagEditState.props));
</script>

{#if child}
	{@render child({ props: mergedProps })}
{:else}
	<input {...mergedProps} />
{/if}
