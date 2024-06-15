<script lang="ts">
	import { box } from "svelte-toolbelt";
	import type { ListProps } from "../index.js";
	import { useNavigationMenuList } from "../navigation-menu.svelte.js";
	import { useId } from "$lib/internal/useId.svelte.js";
	import { mergeProps } from "$lib/internal/mergeProps.js";

	let {
		id = useId(),
		asChild,
		children,
		child,
		ref = $bindable(null),
		...restProps
	}: ListProps = $props();

	const listState = useNavigationMenuList({
		id: box.with(() => id),
		ref: box.with(
			() => ref,
			(v) => (ref = v)
		),
		indicatorTrackRef: box(null),
	});

	const mergedProps = $derived(mergeProps(restProps, listState.props));
	const indicatorTrackProps = $derived(mergeProps(listState.indicatorTrackProps, {}));
</script>

<div {...indicatorTrackProps}>
	{#if asChild}
		{@render child?.({ props: mergedProps })}
	{:else}
		<ul {...mergedProps} bind:this={ref}>
			{@render children?.()}
		</ul>
	{/if}
</div>
