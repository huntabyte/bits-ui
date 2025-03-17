<script lang="ts">
	import { box, mergeProps, srOnlyStylesString } from "svelte-toolbelt";
	import type { TagsInputTagProps } from "../types.js";
	import { useTagsInputTag } from "../tags-input.svelte.js";
	import TagsInputTagHiddenInput from "./tags-input-tag-hidden-input.svelte";
	import { useId } from "$lib/internal/use-id.js";

	let {
		id = useId(),
		ref = $bindable(null),
		value,
		index,
		editMode = "none",
		removable = true,
		children,
		child,
		...restProps
	}: TagsInputTagProps = $props();

	const tagState = useTagsInputTag({
		id: box.with(() => id),
		ref: box.with(
			() => ref,
			(v) => (ref = v)
		),
		value: box.with(
			() => value,
			(v) => (value = v)
		),
		index: box.with(() => index),
		editMode: box.with(() => editMode),
		removable: box.with(() => removable),
	});

	const mergedProps = $derived(mergeProps(restProps, tagState.props));
</script>

{#snippet EditButton()}
	{#if tagState.opts.editMode.current !== "none"}
		<button tabindex={-1} onclick={tagState.startEditing} style={srOnlyStylesString}>
			Edit {value}
		</button>
	{/if}
{/snippet}

{#if child}
	{@render child({ props: mergedProps })}
	{@render EditButton()}
{:else}
	<div {...mergedProps}>
		{@render children?.()}
		{@render EditButton()}
	</div>
{/if}

<TagsInputTagHiddenInput />
