<script lang="ts">
	import { box } from "svelte-toolbelt";
	import type { TooltipContentStaticProps } from "../types.js";
	import { useTooltipContent } from "../tooltip.svelte.js";
	import { useId } from "$lib/internal/useId.js";
	import { mergeProps } from "$lib/internal/mergeProps.js";
	import PopperLayer from "$lib/bits/utilities/popper-layer/popper-layer.svelte";

	let {
		children,
		child,
		id = useId(),
		ref = $bindable(null),
		onInteractOutside,
		onEscapeKeydown,
		forceMount = false,
		...restProps
	}: TooltipContentStaticProps = $props();

	const contentState = useTooltipContent({
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
		onInteractOutside?.(e);
		if (e.defaultPrevented) return;
		contentState.root.handleClose();
	}}
	onEscapeKeydown={(e) => {
		onEscapeKeydown?.(e);
		if (e.defaultPrevented) return;
		contentState.root.handleClose();
	}}
	onOpenAutoFocus={(e) => e.preventDefault()}
	onCloseAutoFocus={(e) => e.preventDefault()}
	trapFocus={false}
	loop={false}
	preventScroll={false}
>
	{#snippet popper({ props })}
		{@const mergedProps = mergeProps(props)}
		{#if child}
			{@render child({ props: mergedProps, ...contentState.snippetProps })}
		{:else}
			<div {...mergedProps}>
				{@render children?.(contentState.snippetProps)}
			</div>
		{/if}
	{/snippet}
</PopperLayer>
