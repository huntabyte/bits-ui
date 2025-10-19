<script lang="ts">
	import { boxWith, mergeProps } from "svelte-toolbelt";
	import { PopoverOverlayState } from "../popover.svelte.js";
	import type { PopoverOverlayProps } from "../types.js";
	import { createId } from "$lib/internal/create-id.js";
	import PresenceLayer from "$lib/bits/utilities/presence-layer/presence-layer.svelte";

	const uid = $props.id();

	let {
		id = createId(uid),
		forceMount = false,
		child,
		children,
		ref = $bindable(null),
		...restProps
	}: PopoverOverlayProps = $props();

	const overlayState = PopoverOverlayState.create({
		id: boxWith(() => id),
		ref: boxWith(
			() => ref,
			(v) => (ref = v)
		),
	});

	const mergedProps = $derived(mergeProps(restProps, overlayState.props));
</script>

<PresenceLayer open={overlayState.root.opts.open.current || forceMount} ref={overlayState.opts.ref}>
	{#snippet presence()}
		{#if child}
			{@render child({ props: mergeProps(mergedProps), ...overlayState.snippetProps })}
		{:else}
			<div {...mergeProps(mergedProps)}>
				{@render children?.(overlayState.snippetProps)}
			</div>
		{/if}
	{/snippet}
</PresenceLayer>
