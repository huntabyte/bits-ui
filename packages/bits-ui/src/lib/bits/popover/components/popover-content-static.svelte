<script lang="ts">
	import { box } from "svelte-toolbelt";
	import type { ContentStaticProps } from "../index.js";
	import { usePopoverContent } from "../popover.svelte.js";
	import { PopperLayer } from "$lib/bits/utilities/popper-layer/index.js";
	import { mergeProps } from "$lib/internal/mergeProps.js";
	import { noop } from "$lib/internal/noop.js";
	import { useId } from "$lib/internal/useId.js";

	let {
		child,
		children,
		ref = $bindable(null),
		id = useId(),
		forceMount = false,
		onDestroyAutoFocus = noop,
		onEscapeKeydown = noop,
		onInteractOutside = noop,
		...restProps
	}: ContentStaticProps = $props();

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
	onDestroyAutoFocus={(e) => {
		onDestroyAutoFocus(e);
		if (e.defaultPrevented) return;
		e.preventDefault();
		contentState.root.triggerNode?.focus();
	}}
	trapFocus
	loop
	{forceMount}
>
	{#snippet popper({ props })}
		{@const finalProps = mergeProps(props)}
		{#if child}
			{@render child({ props: finalProps })}
		{:else}
			<div {...finalProps}>
				{@render children?.()}
			</div>
		{/if}
	{/snippet}
</PopperLayer>
