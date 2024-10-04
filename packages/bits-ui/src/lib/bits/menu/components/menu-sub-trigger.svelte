<script lang="ts">
	import { box } from "svelte-toolbelt";
	import type { MenuItemProps } from "../types.js";
	import { useMenuSubTrigger } from "../menu.svelte.js";
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
	}: MenuItemProps = $props();

	const subTriggerState = useMenuSubTrigger({
		disabled: box.with(() => disabled),
		id: box.with(() => id),
		ref: box.with(
			() => ref,
			(v) => (ref = v)
		),
	});

	const mergedProps = $derived(mergeProps(restProps, subTriggerState.props));
</script>

<FloatingLayerAnchor {id}>
	{#if child}
		{@render child({ props: mergedProps })}
	{:else}
		<div {...mergedProps}>
			{@render children?.()}
		</div>
	{/if}
</FloatingLayerAnchor>
