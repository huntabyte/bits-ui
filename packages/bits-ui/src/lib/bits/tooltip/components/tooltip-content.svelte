<script lang="ts">
	import { boxWith, mergeProps } from "svelte-toolbelt";
	import type { TooltipContentProps } from "../types.js";
	import { TooltipContentState } from "../tooltip.svelte.js";
	import { createId } from "$lib/internal/create-id.js";
	import PopperLayer from "$lib/bits/utilities/popper-layer/popper-layer.svelte";
	import { getFloatingContentCSSVars } from "$lib/internal/floating-svelte/floating-utils.svelte.js";
	import PopperLayerForceMount from "$lib/bits/utilities/popper-layer/popper-layer-force-mount.svelte";
	import { noop } from "$lib/internal/noop.js";

	const uid = $props.id();

	let {
		children,
		child,
		id = createId(uid),
		ref = $bindable(null),
		side = "top",
		sideOffset = 0,
		align = "center",
		avoidCollisions = true,
		arrowPadding = 0,
		sticky = "partial",
		strategy,
		hideWhenDetached = false,
		customAnchor,
		collisionPadding = 0,
		onInteractOutside = noop,
		onEscapeKeydown = noop,
		forceMount = false,
		style,
		...restProps
	}: TooltipContentProps = $props();

	const contentState = TooltipContentState.create({
		id: boxWith(() => id),
		ref: boxWith(
			() => ref,
			(v) => (ref = v)
		),
		onInteractOutside: boxWith(() => onInteractOutside),
		onEscapeKeydown: boxWith(() => onEscapeKeydown),
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
		strategy,
		customAnchor: customAnchor ?? contentState.root.triggerNode,
	});

	const mergedProps = $derived(mergeProps(restProps, floatingProps, contentState.props));
</script>

{#if forceMount}
	<PopperLayerForceMount
		{...mergedProps}
		{...contentState.popperProps}
		enabled={contentState.root.opts.open.current}
		{id}
		trapFocus={false}
		loop={false}
		preventScroll={false}
		forceMount={true}
		ref={contentState.opts.ref}
		tooltip={true}
		shouldRender={contentState.shouldRender}
		contentPointerEvents={contentState.root.disableHoverableContent ? "none" : "auto"}
	>
		{#snippet popper({ props, wrapperProps })}
			{@const finalProps = mergeProps(
				props,
				{ style: getFloatingContentCSSVars("tooltip") },
				{ style }
			)}
			{#if child}
				{@render child({ props: finalProps, wrapperProps, ...contentState.snippetProps })}
			{:else}
				<div {...wrapperProps}>
					<div {...finalProps}>
						{@render children?.()}
					</div>
				</div>
			{/if}
		{/snippet}
	</PopperLayerForceMount>
{:else if !forceMount}
	<PopperLayer
		{...mergedProps}
		{...contentState.popperProps}
		open={contentState.root.opts.open.current}
		{id}
		trapFocus={false}
		loop={false}
		preventScroll={false}
		forceMount={false}
		ref={contentState.opts.ref}
		tooltip={true}
		shouldRender={contentState.shouldRender}
		contentPointerEvents={contentState.root.disableHoverableContent ? "none" : "auto"}
	>
		{#snippet popper({ props, wrapperProps })}
			{@const finalProps = mergeProps(
				props,
				{ style: getFloatingContentCSSVars("tooltip") },
				{ style }
			)}
			{#if child}
				{@render child({ props: finalProps, wrapperProps, ...contentState.snippetProps })}
			{:else}
				<div {...wrapperProps}>
					<div {...finalProps}>
						{@render children?.()}
					</div>
				</div>
			{/if}
		{/snippet}
	</PopperLayer>
{/if}
