<script lang="ts">
	import { box } from "svelte-toolbelt";
	import type { RootProps } from "../index.js";
	import { usePaginationRoot } from "../pagination.svelte.js";
	import { styleToString, useId } from "$lib/internal/index.js";

	let {
		id = useId(),
		count,
		perPage = 1,
		page = $bindable(1),
		el = $bindable(),
		siblingCount = 1,
		onPageChange,
		asChild,
		loop = false,
		orientation = "horizontal",
		child,
		children,
		style = {},
		...restProps
	}: RootProps = $props();

	const rootState = usePaginationRoot({
		id: box.with(() => id),
		count: box.with(() => count),
		perPage: box.with(() => perPage),
		page: box.with(
			() => page,
			(v) => {
				page = v;
				onPageChange?.(v);
			}
		),
		loop: box.with(() => loop),
		siblingCount: box.with(() => siblingCount),
		orientation: box.with(() => orientation),
	});

	const mergedProps = $derived({
		...restProps,
		...rootState.props,
		style: styleToString(style),
	});
</script>

{#if asChild}
	{@render child?.({ props: mergedProps, pages: rootState.pages, range: rootState.range })}
{:else}
	<div bind:this={el} {...mergedProps}>
		{@render children?.({ pages: rootState.pages, range: rootState.range })}
	</div>
{/if}
