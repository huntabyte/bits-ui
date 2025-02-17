<script lang="ts">
	import { box, mergeProps } from "svelte-toolbelt";
	import type { TooltipContentStaticProps } from "../types.js";
	import { useTooltipContent } from "../tooltip.svelte.js";
	import { useId } from "$lib/internal/use-id.js";
	import PopperLayer from "$lib/bits/utilities/popper-layer/popper-layer.svelte";
	import { getFloatingContentCSSVars } from "$lib/internal/floating-svelte/floating-utils.svelte.js";
	import PopperLayerForceMount from "$lib/bits/utilities/popper-layer/popper-layer-force-mount.svelte";
	import { noop } from "$lib/internal/noop.js";

	let {
		children,
		child,
		id = useId(),
		ref = $bindable(null),
		onInteractOutside = noop,
		onEscapeKeydown = noop,
		forceMount = false,
		...restProps
	}: TooltipContentStaticProps = $props();

	const contentState = useTooltipContent({
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
		isStatic
		enabled={contentState.root.opts.open.current}
		{id}
		trapFocus={false}
		loop={false}
		preventScroll={false}
		forceMount={true}
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
	</PopperLayerForceMount>
{:else if !forceMount}
	<PopperLayer
		{...mergedProps}
		{...contentState.popperProps}
		isStatic
		present={contentState.root.opts.open.current}
		{id}
		trapFocus={false}
		loop={false}
		preventScroll={false}
		forceMount={false}
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
{/if}
