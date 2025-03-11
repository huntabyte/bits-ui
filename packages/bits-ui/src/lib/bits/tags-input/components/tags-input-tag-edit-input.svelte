<script lang="ts">
	import { box, mergeProps } from "svelte-toolbelt";
	import type { TagsInputTagEditInputProps } from "../types.js";
	import { useTagsInputTagEditInput } from "../tags-input.svelte.js";
	import { useId } from "$lib/internal/use-id.js";

	let {
		id = useId(),
		ref = $bindable(null),
		child,
		...restProps
	}: TagsInputTagEditInputProps = $props();

	const tagEditState = useTagsInputTagEditInput({
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
