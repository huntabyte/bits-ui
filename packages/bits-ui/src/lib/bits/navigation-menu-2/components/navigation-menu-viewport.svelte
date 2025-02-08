<script lang="ts">
	import type { NavigationMenuViewportProps } from "../types.js";
	import { useNavigationMenuViewport } from "../navigation-menu.svelte.js";
	import NavigationMenuViewportImpl from "./navigation-menu-viewport-impl.svelte";
	import { useId } from "$lib/internal/use-id.js";
	import PresenceLayer from "$lib/bits/utilities/presence-layer/presence-layer.svelte";

	let {
		id = useId(),
		ref = $bindable(null),
		forceMount = false,
		...restProps
	}: NavigationMenuViewportProps = $props();

	const viewportState = useNavigationMenuViewport();
</script>

<PresenceLayer {id} present={forceMount || viewportState.open}>
	{#snippet presence()}
		<NavigationMenuViewportImpl {forceMount} {id} bind:ref {...restProps} />
	{/snippet}
</PresenceLayer>
