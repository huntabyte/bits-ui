<script lang="ts">
	import { box, mergeProps } from "svelte-toolbelt";
	import type { PopoverTriggerProps } from "../types.js";
	import { usePopoverTrigger } from "../popover.svelte.js";
	import { useId } from "$lib/internal/use-id.js";
	import FloatingLayerAnchor from "$lib/bits/utilities/floating-layer/components/floating-layer-anchor.svelte";

	let {
		children,
		child,
		id = useId(),
		ref = $bindable(null),
		type = "button",
		...restProps
	}: PopoverTriggerProps = $props();

	const triggerState = usePopoverTrigger({
		id: box.with(() => id),
		ref: box.with(
			() => ref,
			(v) => (ref = v)
		),
	});

	const mergedProps = $derived(mergeProps(restProps, triggerState.props, { type }));
</script>

<FloatingLayerAnchor {id}>
	{#if child}
		{@render child({ props: mergedProps })}
	{:else}
		<button {...mergedProps}>
			{@render children?.()}
		</button>
	{/if}
</FloatingLayerAnchor>
