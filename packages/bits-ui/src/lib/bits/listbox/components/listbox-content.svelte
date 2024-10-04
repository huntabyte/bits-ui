<script lang="ts">
	import { box } from "svelte-toolbelt";
	import type { ListboxContentProps } from "../types.js";
	import { useListboxContent } from "../listbox.svelte.js";
	import PopperLayer from "$lib/bits/utilities/popper-layer/popper-layer.svelte";
	import { useId } from "$lib/internal/useId.js";
	import { mergeProps } from "$lib/internal/mergeProps.js";
	import { noop } from "$lib/internal/callbacks.js";

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
	}: ListboxContentProps = $props();

	const contentState = useListboxContent({
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
		contentState.root.closeMenu();
	}}
	onEscapeKeydown={(e) => {
		onEscapeKeydown(e);
		if (e.defaultPrevented) return;
		contentState.root.closeMenu();
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
				"--bits-listbox-content-transform-origin": "var(--bits-floating-transform-origin)",
				"--bits-listbox-content-available-width": "var(--bits-floating-available-width)",
				"--bits-listbox-content-available-height": "var(--bits-floating-available-height)",
				"--bits-listbox-anchor-width": "var(--bits-floating-anchor-width)",
				"--bits-listbox-anchor-height": "var(--bits-floating-anchor-height)",
				...contentState.props.style,
			},
		})}
		{#if child}
			{@render child({ props: finalProps, ...contentState.snippetProps })}
		{:else}
			<div {...finalProps}>
				{@render children?.(contentState.snippetProps)}
			</div>
		{/if}
	{/snippet}
</PopperLayer>
