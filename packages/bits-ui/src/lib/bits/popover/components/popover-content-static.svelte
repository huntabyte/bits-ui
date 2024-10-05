<script lang="ts">
	import { box } from "svelte-toolbelt";
	import type { PopoverContentStaticProps } from "../types.js";
	import { usePopoverContent } from "../popover.svelte.js";
	import PopperLayer from "$lib/bits/utilities/popper-layer/popper-layer.svelte";
	import { mergeProps } from "$lib/internal/merge-props.js";
	import { noop } from "$lib/internal/noop.js";
	import { useId } from "$lib/internal/use-id.js";

	let {
		child,
		children,
		ref = $bindable(null),
		id = useId(),
		forceMount = false,
		onCloseAutoFocus = noop,
		onEscapeKeydown = noop,
		onInteractOutside = noop,
		preventScroll = false,
		trapFocus = true,
		...restProps
	}: PopoverContentStaticProps = $props();

	const contentState = usePopoverContent({
		id: box.with(() => id),
		ref: box.with(
			() => ref,
			(v) => (ref = v)
		),
	});

	const mergedProps = $derived(mergeProps(restProps, contentState.props));
</script>

<PopperLayer
	isStatic={true}
	{...mergedProps}
	present={contentState.root.open.current || forceMount}
	{id}
	onInteractOutside={(e) => {
		onInteractOutside(e);
		if (e.defaultPrevented) return;
		contentState.root.close();
	}}
	onEscapeKeydown={(e) => {
		onEscapeKeydown(e);
		if (e.defaultPrevented) return;
		contentState.root.close();
	}}
	onCloseAutoFocus={(e) => {
		onCloseAutoFocus(e);
		if (e.defaultPrevented) return;
		e.preventDefault();
		contentState.root.triggerNode?.focus();
	}}
	{trapFocus}
	{preventScroll}
	loop
	{forceMount}
>
	{#snippet popper({ props })}
		{@const finalProps = mergeProps(props)}
		{#if child}
			{@render child({ props: finalProps, ...contentState.snippetProps })}
		{:else}
			<div {...finalProps}>
				{@render children?.(contentState.snippetProps)}
			</div>
		{/if}
	{/snippet}
</PopperLayer>
