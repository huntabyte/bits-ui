<script lang="ts">
	import { box, mergeProps } from "svelte-toolbelt";
	import type { MenuSubTriggerProps } from "../types.js";
	import { MenuSubTriggerState } from "../menu.svelte.js";
	import FloatingLayerAnchor from "$lib/bits/utilities/floating-layer/components/floating-layer-anchor.svelte";
	import { noop } from "$lib/internal/noop.js";
	import { createId } from "$lib/internal/create-id.js";

	const uid = $props.id();

	let {
		id = createId(uid),
		disabled = false,
		ref = $bindable(null),
		children,
		child,
		onSelect = noop,
		...restProps
	}: MenuSubTriggerProps = $props();

	const subTriggerState = MenuSubTriggerState.create({
		disabled: box.with(() => disabled),
		onSelect: box.with(() => onSelect),
		id: box.with(() => id),
		ref: box.with(
			() => ref,
			(v) => (ref = v)
		),
	});

	const mergedProps = $derived(mergeProps(restProps, subTriggerState.props));
</script>

<FloatingLayerAnchor {id} ref={subTriggerState.opts.ref}>
	{#if child}
		{@render child({ props: mergedProps })}
	{:else}
		<div {...mergedProps}>
			{@render children?.()}
		</div>
	{/if}
</FloatingLayerAnchor>
