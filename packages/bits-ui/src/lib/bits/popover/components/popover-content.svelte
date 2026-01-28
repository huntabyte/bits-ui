<script lang="ts">
	import { boxWith, mergeProps } from "svelte-toolbelt";
	import type { PopoverContentProps } from "../types.js";
	import { PopoverContentState } from "../popover.svelte.js";
	import PopperLayer from "$lib/bits/utilities/popper-layer/popper-layer.svelte";
	import { noop } from "$lib/internal/noop.js";
	import { createId } from "$lib/internal/create-id.js";
	import { getFloatingContentCSSVars } from "$lib/internal/floating-svelte/floating-utils.svelte.js";
	import PopperLayerForceMount from "$lib/bits/utilities/popper-layer/popper-layer-force-mount.svelte";

	const uid = $props.id();

	let {
		child,
		children,
		ref = $bindable(null),
		id = createId(uid),
		forceMount = false,
		onOpenAutoFocus = noop,
		onCloseAutoFocus = noop,
		onEscapeKeydown = noop,
		onInteractOutside = noop,
		trapFocus = true,
		preventScroll = false,
		customAnchor = null,
		style,
		...restProps
	}: PopoverContentProps = $props();

	const contentState = PopoverContentState.create({
		id: boxWith(() => id),
		ref: boxWith(
			() => ref,
			(v) => (ref = v)
		),
		onInteractOutside: boxWith(() => onInteractOutside),
		onEscapeKeydown: boxWith(() => onEscapeKeydown),
		customAnchor: boxWith(() => customAnchor),
	});

	const mergedProps = $derived(mergeProps(restProps, contentState.props));

	// respect user's trapFocus setting, but disable when hover-opened without interaction
	const effectiveTrapFocus = $derived(trapFocus && contentState.shouldTrapFocus);

	// prevent auto-focus when opened via hover until user interacts
	function handleOpenAutoFocus(e: Event) {
		if (!contentState.shouldTrapFocus) {
			e.preventDefault();
		}
		onOpenAutoFocus(e);
	}
</script>

{#if forceMount}
	<PopperLayerForceMount
		{...mergedProps}
		{...contentState.popperProps}
		ref={contentState.opts.ref}
		enabled={contentState.root.opts.open.current}
		{id}
		trapFocus={effectiveTrapFocus}
		{preventScroll}
		loop
		forceMount={true}
		{customAnchor}
		onOpenAutoFocus={handleOpenAutoFocus}
		{onCloseAutoFocus}
		shouldRender={contentState.shouldRender}
	>
		{#snippet popper({ props, wrapperProps })}
			{@const finalProps = mergeProps(
				props,
				{ style: getFloatingContentCSSVars("popover") },
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
		open={contentState.root.opts.open.current}
		{id}
		trapFocus={effectiveTrapFocus}
		{preventScroll}
		loop
		forceMount={false}
		{customAnchor}
		onOpenAutoFocus={handleOpenAutoFocus}
		{onCloseAutoFocus}
		shouldRender={contentState.shouldRender}
	>
		{#snippet popper({ props, wrapperProps })}
			{@const finalProps = mergeProps(
				props,
				{ style: getFloatingContentCSSVars("popover") },
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
