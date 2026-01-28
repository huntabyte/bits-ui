<script lang="ts">
	import { boxWith, mergeProps } from "svelte-toolbelt";
	import type { PopoverContentStaticProps } from "../types.js";
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
		onCloseAutoFocus = noop,
		onEscapeKeydown = noop,
		onInteractOutside = noop,
		trapFocus = true,
		preventScroll = false,
		style,
		...restProps
	}: PopoverContentStaticProps = $props();

	const contentState = PopoverContentState.create({
		id: boxWith(() => id),
		ref: boxWith(
			() => ref,
			(v) => (ref = v)
		),
		onInteractOutside: boxWith(() => onInteractOutside),
		onEscapeKeydown: boxWith(() => onEscapeKeydown),
		customAnchor: boxWith(() => null),
	});

	const mergedProps = $derived(mergeProps(restProps, contentState.props));
</script>

{#if forceMount}
	<PopperLayerForceMount
		{...mergedProps}
		{...contentState.popperProps}
		ref={contentState.opts.ref}
		isStatic
		enabled={contentState.root.opts.open.current}
		{id}
		{trapFocus}
		{preventScroll}
		loop
		forceMount={true}
		{onCloseAutoFocus}
		shouldRender={contentState.shouldRender}
	>
		{#snippet popper({ props })}
			{@const finalProps = mergeProps(
				props,
				{
					style: getFloatingContentCSSVars("popover"),
				},
				{ style }
			)}
			{#if child}
				{@render child({ props: finalProps, ...contentState.snippetProps })}
			{:else}
				<div {...finalProps}>
					{@render children?.()}
				</div>
			{/if}
		{/snippet}
	</PopperLayerForceMount>
{:else if !forceMount}
	<PopperLayer
		{...mergedProps}
		{...contentState.popperProps}
		ref={contentState.opts.ref}
		isStatic
		open={contentState.root.opts.open.current}
		{id}
		{trapFocus}
		{preventScroll}
		loop
		forceMount={false}
		{onCloseAutoFocus}
		shouldRender={contentState.shouldRender}
	>
		{#snippet popper({ props })}
			{@const finalProps = mergeProps(
				props,
				{ style: getFloatingContentCSSVars("popover") },
				{ style }
			)}
			{#if child}
				{@render child({ props: finalProps, ...contentState.snippetProps })}
			{:else}
				<div {...finalProps}>
					{@render children?.()}
				</div>
			{/if}
		{/snippet}
	</PopperLayer>
{/if}
