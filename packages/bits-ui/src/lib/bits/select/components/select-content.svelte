<script lang="ts">
	import { boxWith, mergeProps } from "svelte-toolbelt";
	import type { SelectContentProps } from "../types.js";
	import { SelectContentState } from "../select.svelte.js";
	import PopperLayer from "$lib/bits/utilities/popper-layer/popper-layer.svelte";
	import { noop } from "$lib/internal/noop.js";
	import PopperLayerForceMount from "$lib/bits/utilities/popper-layer/popper-layer-force-mount.svelte";
	import { createId } from "$lib/internal/create-id.js";

	const uid = $props.id();

	let {
		id = createId(uid),
		ref = $bindable(null),
		forceMount = false,
		position = "popper",
		side = "bottom",
		align = "center",
		sideOffset = 0,
		alignOffset = 0,
		onInteractOutside = noop,
		onEscapeKeydown = noop,
		children,
		child,
		preventScroll = false,
		style,
		...restProps
	}: SelectContentProps = $props();

	const contentState = SelectContentState.create({
		id: boxWith(() => id),
		ref: boxWith(
			() => ref,
			(v) => (ref = v)
		),
		onInteractOutside: boxWith(() => onInteractOutside),
		onEscapeKeydown: boxWith(() => onEscapeKeydown),
		position: boxWith(() => position),
	});

	const mergedProps = $derived(mergeProps(restProps, contentState.props));
	const effectiveSide = $derived(contentState.useItemAlignedPositioning ? "bottom" : side);
	const effectiveAlign = $derived(contentState.useItemAlignedPositioning ? "center" : align);
	const effectiveAlignOffset = $derived(contentState.useItemAlignedPositioning ? 0 : alignOffset);
	const effectiveSideOffset = $derived(
		contentState.useItemAlignedPositioning ? contentState.itemAlignedSideOffset : sideOffset
	);
	const effectiveAvoidCollisions = $derived(
		contentState.useItemAlignedPositioning ? false : undefined
	);
</script>

{#if forceMount}
	<PopperLayerForceMount
		{...mergedProps}
		{...contentState.popperProps}
		ref={contentState.opts.ref}
		side={effectiveSide}
		align={effectiveAlign}
		alignOffset={effectiveAlignOffset}
		sideOffset={effectiveSideOffset}
		avoidCollisions={effectiveAvoidCollisions}
		enabled={contentState.root.opts.open.current}
		{id}
		{preventScroll}
		forceMount={true}
		shouldRender={contentState.shouldRender}
	>
		{#snippet popper({ props, wrapperProps })}
			{@const finalProps = mergeProps(
				props,
				{
					"data-side": contentState.useItemAlignedPositioning
						? "none"
						: (props["data-side"] as string | undefined),
				},
				{ style: contentState.props.style },
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
		ref={contentState.opts.ref}
		side={effectiveSide}
		align={effectiveAlign}
		alignOffset={effectiveAlignOffset}
		sideOffset={effectiveSideOffset}
		avoidCollisions={effectiveAvoidCollisions}
		open={contentState.root.opts.open.current}
		{id}
		{preventScroll}
		forceMount={false}
		shouldRender={contentState.shouldRender}
	>
		{#snippet popper({ props, wrapperProps })}
			{@const finalProps = mergeProps(
				props,
				{
					"data-side": contentState.useItemAlignedPositioning
						? "none"
						: (props["data-side"] as string | undefined),
				},
				{ style: contentState.props.style },
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
