<script lang="ts">
	import { box } from "svelte-toolbelt";
	import type { ContentProps } from "../index.js";
	import { useTooltipContent } from "../tooltip.svelte.js";
	import { useId } from "$lib/internal/useId.js";
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

	const mergedProps = $derived(mergeProps(restProps, floatingProps, contentState.props));
</script>

<PopperLayer
	{...mergedProps}
	present={contentState.root.open.current || forceMount}
	{id}
	onInteractOutside={(e) => {
		onInteractOutside?.(e);
		if (e.defaultPrevented) return;
		contentState.root.handleClose();
	}}
	onEscapeKeydown={(e) => {
		onEscapeKeydown?.(e);
		if (e.defaultPrevented) return;
		contentState.root.handleClose();
	}}
	onMountAutoFocus={(e) => e.preventDefault()}
	onDestroyAutoFocus={(e) => e.preventDefault()}
	trapped={false}
	loop={false}
	preventScroll={false}
>
	{#snippet popper({ props })}
		{@const mergedProps = mergeProps(props, {
			style: {
				"--bits-tooltip-content-transform-origin": "var(--bits-floating-transform-origin)",
				"--bits-tooltip-content-available-width": "var(--bits-floating-available-width)",
				"--bits-tooltip-content-available-height": "var(--bits-floating-available-height)",
				"--bits-tooltip-trigger-width": "var(--bits-floating-anchor-width)",
				"--bits-tooltip-trigger-height": "var(--bits-floating-anchor-height)",
			},
		})}
		{#if child}
			{@render child({ props: mergedProps })}
		{:else}
			<div {...mergedProps} bind:this={ref}>
				{@render children?.()}
			</div>
		{/if}
	{/snippet}
</PopperLayer>
