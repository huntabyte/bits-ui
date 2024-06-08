<script lang="ts">
	import { CONTENT_MARGIN, useSelectFloatingPosition } from "../select.svelte.js";
	import type { ContentProps } from "../index.js";
	import { PopperLayer } from "$lib/bits/utilities/popper-layer/index.js";
	import { mergeProps } from "$lib/internal/mergeProps.js";
	import type { WithoutChildren } from "$lib/shared/index.js";
	import { noop } from "$lib/internal/callbacks.js";
	import type { WithAsChild } from "$lib/internal/types.js";
	import type { PopperLayerImplProps } from "$lib/bits/utilities/popper-layer/types.js";

	let {
		children,
		forceMount = false,
		onInteractOutside = noop,
		onEscapeKeydown = noop,
		onMountAutoFocus = noop,
		onDestroyAutoFocus = noop,
		asChild,
		child,
		align = "start",
		collisionPadding = CONTENT_MARGIN,
		el = $bindable(),
		enabled = false,
		...restProps
	}: WithoutChildren<PopperLayerImplProps> & WithAsChild<ContentProps> = $props();

	const state = useSelectFloatingPosition();

	const mergedProps = $derived(mergeProps(restProps, state.content.props, state.props));
</script>

<PopperLayer
	{...mergedProps}
	{enabled}
	{align}
	{collisionPadding}
	present={state.root.open.value || forceMount}
	onInteractOutside={(e) => {
		onInteractOutside(e);
		if (e.defaultPrevented) return;
		state.root.open.value = false;
	}}
	onEscapeKeydown={(e) => {
		// TODO: users should be able to cancel this
		onEscapeKeydown(e);
		state.root.open.value = false;
	}}
	trapped
	onMountAutoFocus={(e) => {
		onMountAutoFocus(e);
		e.preventDefault();
	}}
	onDestroyAutoFocus={(e) => {
		onDestroyAutoFocus(e);
		if (e.defaultPrevented) return;
		state.root.triggerNode.value?.focus({ preventScroll: true });
		e.preventDefault();
	}}
>
	{#snippet popper({ props })}
		{@const finalProps = mergeProps(props, mergedProps)}
		{#if asChild}
			{@render child?.({ props: finalProps })}
		{:else}
			<div {...finalProps} bind:this={el}>
				{@render children?.()}
			</div>
		{/if}
	{/snippet}
</PopperLayer>
