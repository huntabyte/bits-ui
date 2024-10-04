<script lang="ts">
	import { box } from "svelte-toolbelt";
	import type { SelectTriggerProps } from "../types.js";
	import { useSelectTrigger } from "../select.svelte.js";
	import { useId } from "$lib/internal/useId.js";
	import { mergeProps } from "$lib/internal/mergeProps.js";
	import FloatingLayerAnchor from "$lib/bits/utilities/floating-layer/components/floating-layer-anchor.svelte";

	let {
		id = useId(),
		disabled = false,
		ref = $bindable(null),
		children,
		child,
		...restProps
	}: SelectTriggerProps = $props();

	const triggerState = useSelectTrigger({
		id: box.with(() => id),
		disabled: box.with(() => disabled ?? false),
		ref: box.with(
			() => ref,
			(v) => (ref = v)
		),
	});

	const mergedProps = $derived(mergeProps(restProps, triggerState.props));
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
