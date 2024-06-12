<script lang="ts">
	import { box } from "svelte-toolbelt";
	import type { TriggerProps } from "../index.js";
	import { usePopoverTrigger } from "../popover.svelte.js";
	import { mergeProps, useId } from "$lib/internal/index.js";
	import { FloatingLayer } from "$lib/bits/utilities/floating-layer/index.js";

	let {
		asChild,
		children,
		child,
		id = useId(),
		ref = $bindable(),
		type = "button",
		...restProps
	}: TriggerProps = $props();

	const triggerState = usePopoverTrigger({
		id: box.with(() => id),
	});

	const mergedProps = $derived(mergeProps(restProps, triggerState.props, { type }));
</script>

<FloatingLayer.Anchor {id}>
	{#if asChild}
		{@render child?.({ props: mergedProps })}
	{:else}
		<button {...mergedProps} bind:this={ref}>
			{@render children?.()}
		</button>
	{/if}
</FloatingLayer.Anchor>
