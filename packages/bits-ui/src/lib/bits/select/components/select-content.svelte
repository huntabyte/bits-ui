<script lang="ts">
	import { boxWith, mergeProps } from "svelte-toolbelt";
	import type { SelectContentProps } from "../types.js";
	import { SelectContentState } from "../select.svelte.js";
	import PopperLayer from "$lib/bits/utilities/popper-layer/popper-layer.svelte";
	import { noop } from "$lib/internal/noop.js";
	import PopperLayerForceMount from "$lib/bits/utilities/popper-layer/popper-layer-force-mount.svelte";
	import { createId } from "$lib/internal/create-id.js";
	import SelectItemAlignedContent from "./select-item-aligned-content.svelte";

	const uid = $props.id();

	let {
		id = createId(uid),
		ref = $bindable(null),
		forceMount = false,
		side = "bottom",
		onInteractOutside = noop,
		onEscapeKeydown = noop,
		children,
		child,
		preventScroll = false,
		style,
		position = "popper",
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

	// Svelte action to register the fixed wrapper node. Using use: instead of ref={fn}
	// because the callback ref syntax doesn't trigger in this Svelte version.
	function mountWrapper(node: HTMLElement) {
		contentState.setContentWrapper(node);
		return { destroy: () => contentState.setContentWrapper(null) };
	}
</script>

{#if contentState.useItemAligned}
	<SelectItemAlignedContent
		{id}
		ref={contentState.opts.ref}
		enabled={contentState.root.opts.open.current}
		shouldRender={contentState.shouldRender}
		{preventScroll}
		onEscapeKeydown={contentState.onEscapeKeydown}
		onInteractOutside={contentState.onInteractOutside}
		onOpenAutoFocus={contentState.onOpenAutoFocus}
		onCloseAutoFocus={contentState.onCloseAutoFocus}
		trapFocus={false}
		loop={false}
	>
		{#snippet content({ props: layerProps })}
			{@const contentProps = mergeProps(restProps, layerProps, contentState.props, { style })}
			<!-- Radix-style two-div structure: fixed wrapper + content div that fills it -->
			<div use:mountWrapper data-select-content-wrapper style="position: fixed; display: flex; flex-direction: column;">
				{#if child}
					{@render child({
						props: contentProps,
						wrapperProps: {},
						...contentState.snippetProps,
					})}
				{:else}
					<div {...contentProps}>
						{@render children?.()}
					</div>
				{/if}
			</div>
		{/snippet}
	</SelectItemAlignedContent>
{:else if forceMount}
	<PopperLayerForceMount
		{...mergedProps}
		{...contentState.popperProps}
		ref={contentState.opts.ref}
		{side}
		enabled={contentState.root.opts.open.current}
		{id}
		{preventScroll}
		forceMount={true}
		shouldRender={contentState.shouldRender}
	>
		{#snippet popper({ props, wrapperProps })}
			{@const finalProps = mergeProps(props, { style: contentState.props.style }, { style })}
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
		{side}
		open={contentState.root.opts.open.current}
		{id}
		{preventScroll}
		forceMount={false}
		shouldRender={contentState.shouldRender}
	>
		{#snippet popper({ props, wrapperProps })}
			{@const finalProps = mergeProps(props, { style: contentState.props.style }, { style })}
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
