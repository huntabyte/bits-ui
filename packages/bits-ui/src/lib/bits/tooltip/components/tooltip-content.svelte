<script lang="ts">
	import { box } from "svelte-toolbelt";
	import type { ContentProps } from "../index.js";
	import { useTooltipContent } from "../tooltip.svelte.js";
	import { useId } from "$lib/internal/useId.svelte.js";
	import { mergeProps } from "$lib/internal/mergeProps.js";
	import PopperLayer from "$lib/bits/utilities/popper-layer/popper-layer.svelte";

	let {
		children,
		child,
		id = useId(),
		ref = $bindable(null),
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

	const contentState = useTooltipContent({
		id: box.with(() => id),
		ref: box.with(
			() => ref,
			(v) => (ref = v)
		),
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
	present={contentState.root.open.value || forceMount}
	{id}
	onInteractOutside={(e) => {
		onInteractOutside?.(e);
		if (e.defaultPrevented) return;
		contentState.root.handleClose();
	}}
	onEscapeKeydown={(e) => {
		// TODO: users should be able to cancel this
		onEscapeKeydown?.(e);
		contentState.root.handleClose();
	}}
	onMountAutoFocus={(e) => e.preventDefault()}
	onDestroyAutoFocus={(e) => e.preventDefault()}
	trapped={false}
	loop={false}
	preventScroll={false}
>
	{#snippet popper({ props })}
		{@const mergedProps = mergeProps(restProps, contentState.props, props)}
		{#if child}
			{@render child?.({ props: mergedProps })}
		{:else}
			<div {...mergedProps} bind:this={ref}>
				{@render children?.()}
			</div>
		{/if}
	{/snippet}
</PopperLayer>
