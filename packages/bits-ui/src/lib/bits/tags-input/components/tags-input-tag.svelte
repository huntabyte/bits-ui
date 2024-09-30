<script lang="ts">
	import { box } from "svelte-toolbelt";
	import type { TagProps } from "../index.js";
	import { useTagsInputTag } from "../tags-input.svelte.js";
	import { useId } from "$lib/internal/useId.js";
	import { mergeProps } from "$lib/internal/mergeProps.js";

	let {
		id = useId(),
		ref = $bindable(null),
		value,
		index,
		child,
		children,
		...restProps
	}: TagProps = $props();

	const tagState = useTagsInputTag({
		id: box.with(() => id),
		ref: box.with(
			() => ref,
			(v) => (ref = v)
		),
		value: box.with(() => value),
		index: box.with(() => index),
	});

	const mergedProps = $derived(mergeProps(restProps, tagState.props));
</script>

{#if child}
	{@render child({ props: mergedProps })}
{:else}
	<div {...mergedProps}>
		{@render children?.()}
	</div>
{/if}
