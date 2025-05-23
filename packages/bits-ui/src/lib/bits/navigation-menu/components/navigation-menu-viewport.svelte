<script lang="ts">
	import type { NavigationMenuViewportProps } from "../types.js";
	import { useNavigationMenuViewport } from "../navigation-menu.svelte.js";
	import { useId } from "$lib/internal/use-id.js";
	import PresenceLayer from "$lib/bits/utilities/presence-layer/presence-layer.svelte";
	import { box, mergeProps } from "svelte-toolbelt";
	import { Mounted } from "$lib/bits/utilities/index.js";

	let {
		id = useId(),
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
		<Mounted bind:mounted={viewportState.mounted} />
	{/snippet}
</PresenceLayer>
