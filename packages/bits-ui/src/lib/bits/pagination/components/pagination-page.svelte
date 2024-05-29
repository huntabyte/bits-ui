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
		el = $bindable(),
		...restProps
	}: PageProps = $props();

	const state = usePaginationPage({
		id: box.with(() => id),
		page: box.with(() => page),
	});

	const mergedProps = $derived(mergeProps(restProps, state.props, { type }));
</script>

{#if asChild}
	{@render child?.({ props: mergedProps })}
{:else}
	<button bind:this={el} {...mergedProps}>
		{#if children}
			{@render children?.()}
		{:else}
			{page.value}
		{/if}
	</button>
{/if}
