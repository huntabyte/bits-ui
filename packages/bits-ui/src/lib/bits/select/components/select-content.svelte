<script lang="ts">
	import { box, mergeProps } from "svelte-toolbelt";
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
		side = "bottom",
		onInteractOutside = noop,
		onEscapeKeydown = noop,
		children,
		child,
		preventScroll = false,
		...restProps
	}: SelectContentProps = $props();

	const contentState = SelectContentState.create({
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
		{side}
		enabled={contentState.root.opts.open.current}
		{id}
		{preventScroll}
		forceMount={true}
	>
		{#snippet popper({ props, wrapperProps })}
			{@const finalProps = mergeProps(props, { style: contentState.props.style })}
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
	>
		{#snippet popper({ props, wrapperProps })}
			{@const finalProps = mergeProps(props, { style: contentState.props.style })}
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
