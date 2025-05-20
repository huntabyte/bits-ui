<script lang="ts">
	import type { NavigationMenuViewportProps } from "../types.js";
	import { useNavigationMenuViewport } from "../navigation-menu.svelte.js";
	import { createId } from "$lib/internal/create-id.js";
	import PresenceLayer from "$lib/bits/utilities/presence-layer/presence-layer.svelte";
	import { box, mergeProps } from "svelte-toolbelt";

	const uid = $props.id();

	let {
		id = createId(uid),
		ref = $bindable(null),
		forceMount = false,
		child,
		children,
		...restProps
	}: NavigationMenuViewportProps = $props();

	const viewportState = useNavigationMenuViewport({
		id: box.with(() => id),
		ref: box.with(
			() => ref,
			(v) => (ref = v)
		),
	});

	const mergedProps = $derived(mergeProps(restProps, viewportState.props));
</script>

<PresenceLayer {id} present={forceMount || viewportState.open}>
	{#snippet presence()}
		{#if child}
			{@render child({ props: mergedProps })}
		{:else}
			<div {...mergedProps}>
				{@render children?.()}
			</div>
		{/if}
	{/snippet}
</PresenceLayer>
