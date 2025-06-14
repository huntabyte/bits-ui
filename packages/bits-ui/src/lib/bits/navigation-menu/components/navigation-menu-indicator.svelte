<script lang="ts">
	import { box, mergeProps } from "svelte-toolbelt";
	import type { NavigationMenuIndicatorProps } from "../types.js";
	import { NavigationMenuIndicatorState } from "../navigation-menu.svelte.js";
	import NavigationMenuIndicatorImpl from "./navigation-menu-indicator-impl.svelte";
	import { createId } from "$lib/internal/create-id.js";
	import PresenceLayer from "$lib/bits/utilities/presence-layer/presence-layer.svelte";
	import Portal from "$lib/bits/utilities/portal/portal.svelte";

	const uid = $props.id();

	let {
		id = createId(uid),
		ref = $bindable(null),
		children,
		child,
		forceMount = false,
		...restProps
	}: NavigationMenuIndicatorProps = $props();

	const indicatorState = NavigationMenuIndicatorState.create();
	const mergedProps = $derived(mergeProps(restProps));
</script>

{#if indicatorState.context.indicatorTrackRef.current}
	<Portal to={indicatorState.context.indicatorTrackRef.current}>
		<PresenceLayer open={forceMount || indicatorState.isVisible} ref={box.with(() => ref)}>
			{#snippet presence()}
				<NavigationMenuIndicatorImpl {...mergedProps} {children} {child} {id} bind:ref />
			{/snippet}
		</PresenceLayer>
	</Portal>
{/if}
