<script lang="ts">
	import { box, mergeProps } from "svelte-toolbelt";
	import type { PopoverTriggerProps } from "../types.js";
	import { PopoverTriggerState } from "../popover.svelte.js";
	import { createId } from "$lib/internal/create-id.js";
	import FloatingLayerAnchor from "$lib/bits/utilities/floating-layer/components/floating-layer-anchor.svelte";

	const uid = $props.id();

	let {
		children,
		child,
		id = createId(uid),
		ref = $bindable(null),
		type = "button",
		disabled = false,
		...restProps
	}: PopoverTriggerProps = $props();

	const triggerState = PopoverTriggerState.create({
		id: box.with(() => id),
		ref: box.with(
			() => ref,
			(v) => (ref = v)
		),
		disabled: box.with(() => Boolean(disabled)),
	});

	const mergedProps = $derived(mergeProps(restProps, triggerState.props, { type }));
</script>

<FloatingLayerAnchor {id} ref={triggerState.opts.ref}>
	{#if child}
		{@render child({ props: mergedProps })}
	{:else}
		<button {...mergedProps}>
			{@render children?.()}
		</button>
	{/if}
</FloatingLayerAnchor>
