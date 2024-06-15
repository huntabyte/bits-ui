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
		ref = $bindable(),
		...restProps
	}: ListProps = $props();

	const listState = useNavigationMenuList({
		id: box.with(() => id),
	});

	const mergedProps = $derived(mergeProps(restProps, listState.props));
	const indicatorProps = $derived(mergeProps(listState.indicatorProps, {}));
</script>

<div {...indicatorProps}>
	{#if asChild}
		{@render child?.({ props: mergedProps })}
	{:else}
		<ul {...mergedProps} bind:this={ref}>
			{@render children?.()}
		</ul>
	{/if}
</div>
