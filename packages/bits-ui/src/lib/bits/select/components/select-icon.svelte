<script lang="ts">
	import type { IconProps } from "../index.js";
	import { useSelectIcon } from "../select.svelte.js";
	import { mergeProps } from "$lib/internal/mergeProps.js";
	import { useId } from "$lib/internal/useId.svelte.js";
	import { box } from "svelte-toolbelt";

	let {
		asChild,
		children,
		child,
		id = useId(),
		ref = $bindable(null),
		...restProps
	}: IconProps = $props();

	const iconState = useSelectIcon({
		id: box.with(() => id),
		ref: box.with(
			() => ref,
			(v) => (ref = v)
		),
	});

	const mergedProps = $derived(mergeProps(restProps, iconState.props));
</script>

{#if asChild}
	{@render child?.({ props: mergedProps })}
{:else}
	<span {...mergedProps} bind:this={ref}>
		{#if children}
			{@render children()}
		{:else}
			▼
		{/if}
	</span>
{/if}
