<script lang="ts">
	import { box } from "svelte-toolbelt";
	import { useDialogOverlay } from "../dialog.svelte.js";
	import type { DialogOverlayProps } from "../types.js";
	import { useId } from "$lib/internal/useId.js";
	import { mergeProps } from "$lib/internal/mergeProps.js";
	import PresenceLayer from "$lib/bits/utilities/presence-layer/presence-layer.svelte";

	let {
		id = useId(),
		forceMount = false,
		child,
		children,
		ref = $bindable(null),
		...restProps
	}: DialogOverlayProps = $props();

	const overlayState = useDialogOverlay({
		id: box.with(() => id),
		ref: box.with(
			() => ref,
			(v) => (ref = v)
		),
	});

	const mergedProps = $derived(mergeProps(restProps, overlayState.props));
</script>

<PresenceLayer {id} present={overlayState.root.open.current || forceMount}>
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
