<script lang="ts">
	import type { NavigationMenuViewportProps } from "../types.js";
	import { NavigationMenuViewportState } from "../navigation-menu.svelte.js";
	import { createId } from "$lib/internal/create-id.js";
	import { getDataTransitionAttrs } from "$lib/internal/attrs.js";
	import PresenceLayer from "$lib/bits/utilities/presence-layer/presence-layer.svelte";
	import { boxWith, mergeProps } from "svelte-toolbelt";
	import { Mounted } from "$lib/bits/utilities/index.js";

	const uid = $props.id();

	let {
		id = createId(uid),
		ref = $bindable(null),
		forceMount = false,
		child,
		children,
		...restProps
	}: NavigationMenuViewportProps = $props();

	const viewportState = NavigationMenuViewportState.create({
		id: boxWith(() => id),
		ref: boxWith(
			() => ref,
			(v) => (ref = v)
		),
	});

	const mergedProps = $derived(mergeProps(restProps, viewportState.props));
</script>

<PresenceLayer open={forceMount || viewportState.open} ref={viewportState.opts.ref}>
	{#snippet presence({ transitionStatus })}
		{@const presenceProps = getDataTransitionAttrs(transitionStatus)}
		{#if child}
			{@render child({ props: mergeProps(mergedProps, presenceProps) })}
		{:else}
			<div {...mergeProps(mergedProps, presenceProps)}>
				{@render children?.()}
			</div>
		{/if}
		<Mounted bind:mounted={viewportState.mounted} />
	{/snippet}
</PresenceLayer>
