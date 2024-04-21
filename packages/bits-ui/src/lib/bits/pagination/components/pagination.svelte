<script lang="ts">
	import type { RootProps } from "../index.js";
	import { setPaginationRootState } from "../pagination.svelte.js";
	import { box, readonlyBox } from "$lib/internal/box.svelte.js";
	import { generateId } from "$lib/internal/id.js";
	import { styleToString } from "$lib/internal/style.js";

	let {
		id = generateId(),
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

	const state = setPaginationRootState({
		id: readonlyBox(() => id),
		count: readonlyBox(() => count),
		perPage: readonlyBox(() => perPage),
		page: box(
			() => page,
			(v) => {
				page = v;
				onPageChange?.(v);
			}
		),
		loop: readonlyBox(() => loop),
		siblingCount: readonlyBox(() => siblingCount),
		orientation: readonlyBox(() => orientation),
	});

	const mergedProps = $derived({
		...restProps,
		...state.props,
		style: styleToString(style),
	});
</script>

{#if asChild}
	{@render child?.({ props: mergedProps, pages: state.pages, range: state.range })}
{:else}
	<div bind:this={el} {...mergedProps}>
		{@render children?.({ pages: state.pages, range: state.range })}
	</div>
{/if}
