<script lang="ts">
	import { box, mergeProps } from "svelte-toolbelt";
	import type { RatingGroupItemProps } from "../types.js";
	import { useRatingGroupItem } from "../rating-group.svelte.js";
	import { createId } from "$lib/internal/create-id.js";

	const uid = $props.id();

	let {
		disabled = false,
		value,
		children,
		child,
		ref = $bindable(null),
		id = createId(uid),
		...restProps
	}: RatingGroupItemProps = $props();

	const itemState = useRatingGroupItem({
		disabled: box.with(() => Boolean(disabled)),
		value: box.with(() => value),
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
	<button {...mergedProps}>
		{@render children?.(itemState.snippetProps)}
	</button>
{/if}
