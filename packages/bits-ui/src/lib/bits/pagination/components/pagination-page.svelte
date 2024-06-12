<script lang="ts">
	import { box } from "svelte-toolbelt";
	import type { PageProps } from "../index.js";
	import { usePaginationPage } from "../pagination.svelte.js";
	import { mergeProps, useId } from "$lib/internal/index.js";

	let {
		id = useId(),
		page,
		asChild,
		child,
		children,
		type = "button",
		ref = $bindable(),
		...restProps
	}: PageProps = $props();

	const pageState = usePaginationPage({
		id: box.with(() => id),
		page: box.with(() => page),
	});

	const mergedProps = $derived(mergeProps(restProps, pageState.props, { type }));
</script>

{#if asChild}
	{@render child?.({ props: mergedProps })}
{:else}
	<button bind:this={ref} {...mergedProps}>
		{#if children}
			{@render children?.()}
		{:else}
			{page.value}
		{/if}
	</button>
{/if}
