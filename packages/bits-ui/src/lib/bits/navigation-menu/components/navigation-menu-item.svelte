<script lang="ts">
	import { box } from "svelte-toolbelt";
	import type { ItemProps } from "../index.js";
	import { useNavigationMenuItem } from "../navigation-menu.svelte.js";
	import { useId } from "$lib/internal/useId.svelte.js";
	import { mergeProps } from "$lib/internal/mergeProps.js";

	let {
		id = useId(),
		value = useId(),
		child,
		children,
		ref = $bindable(),
		...restProps
	}: ItemProps = $props();

	const itemState = useNavigationMenuItem({
		id: box.with(() => id),
		value: box.with(() => value),
	});

	const mergedProps = $derived(mergeProps(restProps, itemState.props));
</script>

{#if child}
	{@render child({ props: mergedProps })}
{:else}
	<li {...mergedProps} bind:this={ref}>
		{@render children?.()}
	</li>
{/if}
