<script lang="ts">
	import { box } from "runed";
	import type { RootProps } from "../index.js";
	import { useCollapsibleRoot } from "../collapsible.svelte.js";
	import { mergeProps } from "$lib/internal/mergeProps.js";

	let {
		asChild,
		children,
		child,
		el = $bindable(),
		open = $bindable(false),
		disabled = false,
		onOpenChange,
		...restProps
	}: RootProps = $props();

	const state = useCollapsibleRoot({
		open: box.with(
			() => open,
			(v) => {
				open = v;
				onOpenChange?.(v);
			}
		),
		disabled: box.with(() => disabled),
	});

	const mergedProps = $derived(mergeProps(restProps, state.props));
</script>

{#if asChild}
	{@render child?.({ props: mergedProps })}
{:else}
	<div bind:this={el} {...mergedProps}>
		{@render children?.()}
	</div>
{/if}
