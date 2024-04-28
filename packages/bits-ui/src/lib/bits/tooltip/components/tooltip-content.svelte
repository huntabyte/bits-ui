<script lang="ts">
	import { box } from "runed";
	import type { ContentProps } from "../index.js";
	import { useTooltipContent } from "../tooltip.svelte.js";
	import { useId } from "$lib/internal/useId.svelte.js";
	import { mergeProps } from "$lib/internal/mergeProps.js";
	import PopperLayer from "$lib/bits/utilities/popper-layer/popper-layer.svelte";

	let {
		asChild,
		children,
		child,
		id = useId(),
		el = $bindable(),
		side = "top",
		sideOffset = 0,
		align = "center",
		avoidCollisions = true,
		arrowPadding = 0,
		sticky = "partial",
		hideWhenDetached = false,
		collisionPadding = 0,
		onInteractOutside,
		onEscapeKeydown,
		forceMount = false,
		...restProps
	}: ContentProps = $props();

	const state = useTooltipContent({
		id: box.with(() => id),
	});

	const floatingProps = $derived({
		side,
		sideOffset,
		align,
		avoidCollisions,
		arrowPadding,
		sticky,
		hideWhenDetached,
		collisionPadding,
	});
</script>

<PopperLayer
	{...restProps}
	{...floatingProps}
	present={state.root.open.value || forceMount}
	{id}
	onInteractOutside={(e) => {
		onInteractOutside?.(e);
		if (e.defaultPrevented) return;
		state.root.handleClose();
	}}
	onEscapeKeydown={(e) => {
		// TODO: users should be able to cancel this
		onEscapeKeydown?.(e);
		state.root.handleClose();
	}}
	onDestroyAutoFocus={(e) => {
		e.preventDefault();
	}}
	trapped={false}
	loop={false}
>
	{#snippet popper({ props })}
		{@const mergedProps = mergeProps(restProps, state.props, props)}
		{#if asChild}
			{@render child?.({ props: mergedProps })}
		{:else}
			<div {...mergedProps} bind:this={el}>
				{@render children?.()}
			</div>
		{/if}
	{/snippet}
</PopperLayer>
