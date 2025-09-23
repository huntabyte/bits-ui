<script lang="ts">
	import { boxWith, mergeProps } from "svelte-toolbelt";
	import type { MenuTriggerProps } from "../types.js";
	import { DropdownMenuTriggerState } from "../menu.svelte.js";
	import { createId } from "$lib/internal/create-id.js";
	import FloatingLayerAnchor from "$lib/bits/utilities/floating-layer/components/floating-layer-anchor.svelte";

	const uid = $props.id();

	let {
		id = createId(uid),
		ref = $bindable(null),
		child,
		children,
		disabled = false,
		type = "button",
		...restProps
	}: MenuTriggerProps = $props();

	const triggerState = DropdownMenuTriggerState.create({
		id: boxWith(() => id),
		disabled: boxWith(() => disabled ?? false),
		ref: boxWith(
			() => ref,
			(v) => (ref = v)
		),
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
