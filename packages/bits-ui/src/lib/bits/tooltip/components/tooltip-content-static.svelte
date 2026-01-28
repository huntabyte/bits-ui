<script lang="ts">
	import { boxWith, mergeProps } from "svelte-toolbelt";
	import type { TooltipContentStaticProps } from "../types.js";
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
		onInteractOutside = noop,
		onEscapeKeydown = noop,
		forceMount = false,
		style,
		...restProps
	}: TooltipContentStaticProps = $props();

	const contentState = TooltipContentState.create({
		id: boxWith(() => id),
		ref: boxWith(
			() => ref,
			(v) => (ref = v)
		),
		onInteractOutside: boxWith(() => onInteractOutside),
		onEscapeKeydown: boxWith(() => onEscapeKeydown),
	});

	const mergedProps = $derived(mergeProps(restProps, contentState.props));
</script>

{#if forceMount}
	<PopperLayerForceMount
		{...mergedProps}
		{...contentState.popperProps}
		isStatic
		enabled={contentState.root.opts.open.current}
		{id}
		trapFocus={false}
		loop={false}
		preventScroll={false}
		forceMount={true}
		ref={contentState.opts.ref}
		tooltip={true}
		shouldRender={contentState.shouldRender}
	>
		{#snippet popper({ props })}
			{@const finalProps = mergeProps(props, { style: getFloatingContentCSSVars("tooltip") }, { style })}
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
		tooltip={true}
		isStatic
		open={contentState.root.opts.open.current}
		{id}
		trapFocus={false}
		loop={false}
		preventScroll={false}
		forceMount={false}
		ref={contentState.opts.ref}
		shouldRender={contentState.shouldRender}
	>
		{#snippet popper({ props })}
			{@const finalProps = mergeProps(props, { style: getFloatingContentCSSVars("tooltip") }, { style })}
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
