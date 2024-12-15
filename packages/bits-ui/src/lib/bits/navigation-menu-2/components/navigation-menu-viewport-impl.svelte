<script lang="ts">
	import { box, mergeProps } from "svelte-toolbelt";
	import type { NavigationMenuViewportProps } from "../types.js";
	import { useNavigationMenuViewportImpl } from "../navigation-menu.svelte.js";
	import NavigationMenuContentImpl from "./navigation-menu-content-impl.svelte";
	import { useId } from "$lib/internal/use-id.js";
	import PresenceLayer from "$lib/bits/utilities/presence-layer/presence-layer.svelte";

	let {
		id = useId(),
		ref = $bindable(null),
		forceMount = false,
		...restProps
	}: NavigationMenuViewportProps = $props();

	const viewportState = useNavigationMenuViewportImpl({
		id: box.with(() => id),
		ref: box.with(
			() => ref,
			(v) => (ref = v)
		),
	});

	const mergedProps = $derived(mergeProps(restProps, viewportState.props));
</script>

<div {...mergedProps}>
	{#each Array.from(viewportState.context.viewportContent) as [value, item]}
		{@const isActive = viewportState.activeContentValue === value}
		<PresenceLayer id={item.id.current} present={forceMount || isActive}>
			{#snippet presence()}
				<NavigationMenuContentImpl {...item.props} />
			{/snippet}
		</PresenceLayer>
	{/each}
</div>
