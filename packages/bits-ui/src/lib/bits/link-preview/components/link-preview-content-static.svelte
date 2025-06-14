<script lang="ts">
	import { box, mergeProps } from "svelte-toolbelt";
	import type { LinkPreviewContentStaticProps } from "../types.js";
	import { LinkPreviewContentState } from "../link-preview.svelte.js";
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
		onInteractOutside = noop,
		onEscapeKeydown = noop,
		forceMount = false,
		...restProps
	}: LinkPreviewContentStaticProps = $props();

	const contentState = LinkPreviewContentState.create({
		id: box.with(() => id),
		ref: box.with(
			() => ref,
			(v) => (ref = v)
		),
		onInteractOutside: box.with(() => onInteractOutside),
		onEscapeKeydown: box.with(() => onEscapeKeydown),
	});

	const mergedProps = $derived(mergeProps(restProps, contentState.props));
</script>

{#if forceMount}
	<PopperLayerForceMount
		{...mergedProps}
		{...contentState.popperProps}
		ref={contentState.opts.ref}
		enabled={contentState.root.opts.open.current}
		isStatic
		{id}
		trapFocus={false}
		loop={false}
		preventScroll={false}
		forceMount={true}
	>
		{#snippet popper({ props })}
			{@const mergedProps = mergeProps(props, {
				style: getFloatingContentCSSVars("link-preview"),
			})}
			{#if child}
				{@render child({ props: mergedProps, ...contentState.snippetProps })}
			{:else}
				<div {...mergedProps}>
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
		open={contentState.root.opts.open.current}
		isStatic
		{id}
		trapFocus={false}
		loop={false}
		preventScroll={false}
		forceMount={false}
	>
		{#snippet popper({ props })}
			{@const mergedProps = mergeProps(props, {
				style: getFloatingContentCSSVars("link-preview"),
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
{/if}
