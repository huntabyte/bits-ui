<script lang="ts">
	import { box, mergeProps } from "svelte-toolbelt";
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
		onCloseAutoFocus = noop,
		onEscapeKeydown = noop,
		onInteractOutside = noop,
		trapFocus = true,
		preventScroll = false,
		...restProps
	}: PopoverContentProps = $props();

	const contentState = PopoverContentState.create({
		id: box.with(() => id),
		ref: box.with(
			() => ref,
			(v) => (ref = v)
		),
		onInteractOutside: box.with(() => onInteractOutside),
		onEscapeKeydown: box.with(() => onEscapeKeydown),
		onCloseAutoFocus: box.with(() => onCloseAutoFocus),
	});

	const mergedProps = $derived(mergeProps(restProps, contentState.props));
</script>

{#if forceMount}
	<PopperLayerForceMount
		{...mergedProps}
		{...contentState.popperProps}
		ref={contentState.opts.ref}
		enabled={contentState.root.opts.open.current}
		{id}
		{trapFocus}
		{preventScroll}
		loop
		forceMount={true}
	>
		{#snippet popper({ props, wrapperProps })}
			{@const finalProps = mergeProps(props, {
				style: getFloatingContentCSSVars("popover"),
			})}
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
		{trapFocus}
		{preventScroll}
		loop
		forceMount={false}
	>
		{#snippet popper({ props, wrapperProps })}
			{@const finalProps = mergeProps(props, {
				style: getFloatingContentCSSVars("popover"),
			})}
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
