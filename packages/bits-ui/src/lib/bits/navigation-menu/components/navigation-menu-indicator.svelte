<script lang="ts">
	import { mergeProps } from "$lib/internal/mergeProps.js";
	import { useId } from "$lib/internal/useId.svelte.js";
	import { box } from "svelte-toolbelt";
	import type { IndicatorProps } from "../index.js";
	import { useNavigationMenuIndicator } from "../navigation-menu.svelte.js";
	import PresenceLayer from "$lib/bits/utilities/presence-layer/presence-layer.svelte";
	import Portal from "$lib/bits/utilities/portal/portal.svelte";

	let {
		id = useId(),
		ref = $bindable(),
		asChild,
		children,
		child,
		forceMount = false,
		...restProps
	}: IndicatorProps = $props();

	const indicatorState = useNavigationMenuIndicator({
		id: box.with(() => id),
	});

	const mergedProps = $derived(mergeProps(restProps, indicatorState.props));
</script>

{#if indicatorState.indicatorTrackNode}
	<Portal to={`#${indicatorState.indicatorTrackNode.id}`}>
		<PresenceLayer {id} present={forceMount || indicatorState.isVisible}>
			{#snippet presence()}
				{#if asChild}
					{@render child?.({ props: mergedProps })}
				{:else}
					<div bind:this={ref} {...mergedProps}>
						{@render children?.()}
					</div>
				{/if}
			{/snippet}
		</PresenceLayer>
	</Portal>
{/if}
