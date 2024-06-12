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
		ref = $bindable(),
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
	});
</script>

<PopperLayer
	{...restProps}
	present={contentState.root.open.value || forceMount}
	{id}
	onInteractOutside={(e) => {
		onInteractOutside(e);
		if (e.defaultPrevented) return;
		contentState.root.close();
	}}
	onEscapeKeydown={(e) => {
		// TODO: users should be able to cancel this
		onEscapeKeydown(e);
		contentState.root.close();
	}}
	onDestroyAutoFocus={(e) => {
		onDestroyAutoFocus(e);
		if (e.defaultPrevented) return;
		e.preventDefault();
		contentState.root.triggerNode?.value?.focus();
	}}
	trapped
	{loop}
>
	{#snippet popper({ props })}
		{@const mergedProps = mergeProps(restProps, contentState.props, props)}
		{#if asChild}
			{@render child?.({ props: mergedProps })}
		{:else}
			<div {...mergedProps} bind:this={ref}>
				{@render children?.()}
			</div>
		{/if}
	{/snippet}
</PopperLayer>
