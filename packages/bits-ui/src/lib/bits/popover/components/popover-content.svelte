<script lang="ts">
	import { box } from "svelte-toolbelt";
	import type { ContentProps } from "../index.js";
	import { usePopoverContent } from "../popover.svelte.js";
	import { PopperLayer } from "$lib/bits/utilities/popper-layer/index.js";
	import { mergeProps, noop, useId } from "$lib/internal/index.js";

	let {
		asChild,
		child,
		children,
		ref = $bindable(null),
		id = useId(),
		forceMount = false,
		onDestroyAutoFocus = noop,
		onEscapeKeydown = noop,
		onInteractOutside = noop,
		loop = true,
		...restProps
	}: ContentProps = $props();

	const contentState = usePopoverContent({
		id: box.with(() => id),
		ref: box.with(
			() => ref,
			(v) => (ref = v)
		),
	});

	const mergedProps = $derived(mergeProps(restProps, contentState.props))

	$effect(() => {
		console.log("open", contentState.root.open.value);
	});
</script>

<PopperLayer
	{...mergedProps}
	present={contentState.root.open.value || forceMount}
	{id}
	onInteractOutside={(e) => {
		console.log("interactoutside");
		onInteractOutside(e);
		if (e.defaultPrevented) return;
		contentState.root.close();
	}}
	onEscapeKeydown={(e) => {
		console.log("escape keydown");
		// TODO: users should be able to cancel this
		onEscapeKeydown(e);
		contentState.root.close();
	}}
	onDestroyAutoFocus={(e) => {
		onDestroyAutoFocus(e);
		if (e.defaultPrevented) return;
		e.preventDefault();
		contentState.root.triggerNode?.focus();
	}}
	trapped
	{loop}
	{forceMount}
>
	{#snippet popper({ props })}
		{@const finalProps = mergeProps(props, mergedProps)}
		{#if asChild}
			{@render child?.({ props: finalProps })}
		{:else}
			<div {...finalProps}>
				{@render children?.()}
			</div>
		{/if}
	{/snippet}
</PopperLayer>
