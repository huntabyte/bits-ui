<script lang="ts">
	import { box } from "svelte-toolbelt";
	import type { TagProps } from "../index.js";
	import { useTagsInputTag } from "../tags-input.svelte.js";
	import TagsInputTagHiddenInput from "./tags-input-tag-hidden-input.svelte";
	import { useId } from "$lib/internal/useId.js";
	import { mergeProps } from "$lib/internal/mergeProps.js";
	import { srOnlyStyles } from "$lib/internal/style.js";

	let {
		id = useId(),
		ref = $bindable(null),
		value,
		index,
		children,
		child,
		...restProps
	}: TagProps = $props();

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
	});

	const mergedProps = $derived(mergeProps(restProps, tagState.props));
	const mergedBtnProps = $derived(mergeProps({ style: srOnlyStyles }));
</script>

{#snippet EditButton()}
	{#if tagState.root.editable.current}
		<button
			tabindex={-1}
			onclick={tagState.startEditing}
			aria-label="Edit {tagState.value.current}"
			{...mergedBtnProps}
		>
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
