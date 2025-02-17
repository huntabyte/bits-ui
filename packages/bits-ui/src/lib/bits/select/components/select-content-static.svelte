<script lang="ts">
	import { box, mergeProps } from "svelte-toolbelt";
	import type { SelectContentStaticProps } from "../types.js";
	import { useSelectContent } from "../select.svelte.js";
	import PopperLayer from "$lib/bits/utilities/popper-layer/popper-layer.svelte";
	import { useId } from "$lib/internal/use-id.js";
	import { noop } from "$lib/internal/noop.js";
	import PopperLayerForceMount from "$lib/bits/utilities/popper-layer/popper-layer-force-mount.svelte";

	let {
		id = useId(),
		ref = $bindable(null),
		forceMount = false,
		onInteractOutside = noop,
		onEscapeKeydown = noop,
		children,
		child,
		preventScroll = false,
		...restProps
	}: SelectContentStaticProps = $props();

	const contentState = useSelectContent({
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
		{preventScroll}
		forceMount={true}
	>
		{#snippet popper({ props })}
			{@const finalProps = mergeProps(props, { style: contentState.props.style })}
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
		isStatic
		present={contentState.root.opts.open.current}
		{id}
		{preventScroll}
		forceMount={false}
	>
		{#snippet popper({ props })}
			{@const finalProps = mergeProps(props, { style: contentState.props.style })}
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
