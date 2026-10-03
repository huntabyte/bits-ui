<script lang="ts">
	import { boxWith, mergeProps } from "svelte-toolbelt";
	import { DrawerSwipeAreaState } from "../drawer.svelte.js";
	import type { DrawerSwipeAreaProps } from "../types.js";
	import { createId } from "$lib/internal/create-id.js";

	const uid = $props.id();

	let {
		id = createId(uid),
		ref = $bindable(null),
		child,
		children,
		disabled = false,
		swipeDirection,
		...restProps
	}: DrawerSwipeAreaProps = $props();

	const swipeAreaState = DrawerSwipeAreaState.create({
		id: boxWith(() => id),
		ref: boxWith(
			() => ref,
			(v) => (ref = v)
		),
		disabled: boxWith(() => Boolean(disabled)),
		swipeDirection: boxWith(() => swipeDirection),
	});

	const mergedProps = $derived(mergeProps(restProps, swipeAreaState.props));
</script>

{#if child}
	{@render child({ props: mergedProps })}
{:else}
	<div {...mergedProps}>
		{@render children?.()}
	</div>
{/if}
