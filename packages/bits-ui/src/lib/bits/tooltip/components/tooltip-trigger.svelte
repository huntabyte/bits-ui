<script lang="ts">
	import { boxWith, mergeProps } from "svelte-toolbelt";
	import type { TooltipTriggerProps } from "../types.js";
	import { TooltipTriggerState } from "../tooltip.svelte.js";
	import { createId } from "$lib/internal/create-id.js";
	import FloatingLayerAnchor from "$lib/bits/utilities/floating-layer/components/floating-layer-anchor.svelte";

	const uid = $props.id();

	let {
		children,
		child,
		id = createId(uid),
		disabled = false,
		type = "button",
		tabindex = 0,
		ref = $bindable(null),
		...restProps
	}: TooltipTriggerProps = $props();

	const triggerState = TooltipTriggerState.create({
		id: boxWith(() => id),
		disabled: boxWith(() => disabled ?? false),
		tabindex: boxWith(() => tabindex ?? 0),
		ref: boxWith(
			() => ref,
			(v) => (ref = v)
		),
	});

	const mergedProps = $derived(mergeProps(restProps, triggerState.props, { type }));
</script>

<FloatingLayerAnchor {id} ref={triggerState.opts.ref} tooltip={true}>
	{#if child}
		{@render child({ props: mergedProps })}
	{:else}
		<button {...mergedProps}>
			{@render children?.()}
		</button>
	{/if}
</FloatingLayerAnchor>
