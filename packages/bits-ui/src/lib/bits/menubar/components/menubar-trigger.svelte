<script lang="ts">
	import { box } from "svelte-toolbelt";
	import type { TriggerProps } from "../index.js";
	import { useMenubarTrigger } from "../menubar.svelte.js";
	import { useId } from "$lib/internal/useId.svelte.js";
	import { mergeProps } from "$lib/internal/mergeProps.js";
	import FloatingLayerAnchor from "$lib/bits/utilities/floating-layer/components/floating-layer-anchor.svelte";
	import { useMenuDropdownTrigger } from "$lib/bits/menu/menu.svelte.js";

	let {
		id = useId(),
		disabled = false,
		asChild,
		children,
		child,
		ref = $bindable(),
		...restProps
	}: TriggerProps = $props();

	const triggerState = useMenubarTrigger({
		id: box.with(() => id),
		disabled: box.with(() => disabled),
	});

	useMenuDropdownTrigger({
		id: box.with(() => id),
		disabled: box.with(() => disabled),
	});

	const mergedProps = $derived(mergeProps(restProps, triggerState.props));
</script>

<FloatingLayerAnchor {id}>
	{#if asChild}
		{@render child?.({ props: mergedProps })}
	{:else}
		<button bind:this={ref} {...mergedProps}>
			{@render children?.()}
		</button>
	{/if}
</FloatingLayerAnchor>
