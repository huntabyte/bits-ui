<script lang="ts">
	import { box, mergeProps } from "svelte-toolbelt";
	import { DialogOverlayState } from "../dialog.svelte.js";
	import type { DialogOverlayProps } from "../types.js";
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
	}: DialogOverlayProps = $props();

	const overlayState = DialogOverlayState.create({
		id: box.with(() => id),
		ref: box.with(
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
