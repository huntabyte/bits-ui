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
		ref = $bindable(null),
		type = "button",
		...restProps
	}: TriggerProps = $props();

	const triggerState = usePopoverTrigger({
		id: box.with(() => id),
		ref: box.with(
			() => ref,
			(v) => (ref = v)
		),
	});

	const mergedProps = $derived(mergeProps(restProps, triggerState.props, { type }));
</script>

<FloatingLayer.Anchor {id}>
	{#if asChild}
		{@render child?.({ props: mergedProps })}
	{:else}
		<button {...mergedProps}>
			{@render children?.()}
		</button>
	{/if}
</FloatingLayer.Anchor>
