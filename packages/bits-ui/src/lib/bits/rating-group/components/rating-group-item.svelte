<script lang="ts">
	import { box, mergeProps } from "svelte-toolbelt";
	import type { RatingGroupItemProps } from "../types.js";
	import { RatingGroupItemState } from "../rating-group.svelte.js";
	import { createId } from "$lib/internal/create-id.js";

	const uid = $props.id();

	let {
		disabled = false,
		index,
		children,
		child,
		ref = $bindable(null),
		id = createId(uid),
		...restProps
	}: RatingGroupItemProps = $props();

	const itemState = RatingGroupItemState.create({
		disabled: box.with(() => Boolean(disabled)),
		index: box.with(() => index),
		id: box.with(() => id),
		ref: box.with(
			() => ref,
			(v) => (ref = v)
		),
	});

	const mergedProps = $derived(mergeProps(restProps, itemState.props));
</script>

{#if child}
	{@render child({ props: mergedProps, ...itemState.snippetProps })}
{:else}
	<div {...mergedProps}>
		{@render children?.(itemState.snippetProps)}
	</div>
{/if}
