<script lang="ts">
	import { box } from "svelte-toolbelt";
	import { useDialogOverlay } from "../dialog.svelte.js";
	import type { OverlayProps } from "../index.js";
	import { useId } from "$lib/internal/useId.svelte.js";
	import { mergeProps } from "$lib/internal/mergeProps.js";
	import PresenceLayer from "$lib/bits/utilities/presence-layer/presence-layer.svelte";

	let {
		id = useId(),
		forceMount = false,
		asChild,
		child,
		children,
		ref = $bindable(),
		...restProps
	}: OverlayProps = $props();

	const overlayState = useDialogOverlay({
		id: box.with(() => id),
	});

	const mergedProps = $derived(mergeProps(restProps, overlayState.props));
</script>

<PresenceLayer {id} present={overlayState.root.open.value || forceMount}>
	{#snippet presence({ present })}
		{#if asChild}
			{@render child?.({ props: mergeProps(mergedProps, { hidden: !present.value }) })}
		{:else}
			<div {...mergeProps(mergedProps, { hidden: !present.value })} bind:this={ref}>
				{@render children?.()}
			</div>
		{/if}
	{/snippet}
</PresenceLayer>
