<script lang="ts">
	import { box, mergeProps } from "svelte-toolbelt";
	import type { SelectContentProps } from "../types.js";
	import { useSelectContent } from "../select.svelte.js";
	import PopperLayer from "$lib/bits/utilities/popper-layer/popper-layer.svelte";
	import { useId } from "$lib/internal/use-id.js";
	import { noop } from "$lib/internal/noop.js";

	let {
		id = useId(),
		ref = $bindable(null),
		forceMount = false,
		side = "bottom",
		onInteractOutside = noop,
		onEscapeKeydown = noop,
		children,
		child,
		...restProps
	}: SelectContentProps = $props();

	const contentState = useSelectContent({
		id: box.with(() => id),
		ref: box.with(
			() => ref,
			(v) => (ref = v)
		),
	});

	const mergedProps = $derived(mergeProps(restProps, contentState.props));
</script>

<PopperLayer
	{...mergedProps}
	{side}
	present={contentState.root.open.current || forceMount}
	{id}
	onInteractOutside={(e) => {
		contentState.handleInteractOutside(e);
		if (e.defaultPrevented) return;
		onInteractOutside(e);
		if (e.defaultPrevented) return;
		contentState.root.handleClose();
	}}
	onEscapeKeydown={(e) => {
		onEscapeKeydown(e);
		if (e.defaultPrevented) return;
		contentState.root.handleClose();
	}}
	onOpenAutoFocus={(e) => e.preventDefault()}
	onCloseAutoFocus={(e) => e.preventDefault()}
	trapFocus={false}
	loop={false}
	preventScroll={false}
	onPlaced={() => (contentState.isPositioned = true)}
	{forceMount}
>
	{#snippet popper({ props })}
		{@const finalProps = mergeProps(props, {
			style: {
				"--bits-select-content-transform-origin": "var(--bits-floating-transform-origin)",
				"--bits-select-content-available-width": "var(--bits-floating-available-width)",
				"--bits-select-content-available-height": "var(--bits-floating-available-height)",
				"--bits-select-anchor-width": "var(--bits-floating-anchor-width)",
				"--bits-select-anchor-height": "var(--bits-floating-anchor-height)",
				...contentState.props.style,
			},
		})}
		{#if child}
			{@render child({ props: finalProps, ...contentState.snippetProps })}
		{:else}
			<div {...finalProps}>
				{@render children?.()}
			</div>
		{/if}
	{/snippet}
</PopperLayer>
