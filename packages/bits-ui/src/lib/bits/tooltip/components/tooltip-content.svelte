<script lang="ts">
	import { box, mergeProps } from "svelte-toolbelt";
	import type { TooltipContentProps } from "../types.js";
	import { useTooltipContent } from "../tooltip.svelte.js";
	import { useId } from "$lib/internal/use-id.js";
	import PopperLayer from "$lib/bits/utilities/popper-layer/popper-layer.svelte";
	import { getFloatingContentCSSVars } from "$lib/internal/floating-svelte/floating-utils.svelte.js";

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
	}: TooltipContentProps = $props();

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
	onOpenAutoFocus={(e) => e.preventDefault()}
	onCloseAutoFocus={(e) => e.preventDefault()}
	trapFocus={false}
	loop={false}
	preventScroll={false}
>
	{#snippet popper({ props })}
		{@const mergedProps = mergeProps(props, {
			style: getFloatingContentCSSVars("tooltip"),
		})}
		{#if child}
			{@render child({ props: mergedProps, ...contentState.snippetProps })}
		{:else}
			<div {...mergedProps}>
				{@render children?.()}
			</div>
		{/if}
	{/snippet}
</PopperLayer>
