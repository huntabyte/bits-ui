<script lang="ts">
	import { box } from "svelte-toolbelt";
	import type { ListboxContentStaticProps } from "../types.js";
	import { useListboxContent } from "../listbox.svelte.js";
	import PopperLayer from "$lib/bits/utilities/popper-layer/popper-layer.svelte";
	import { useId } from "$lib/internal/use-id.js";
	import { mergeProps } from "$lib/internal/merge-props.js";
	import { noop } from "$lib/internal/callbacks.js";

	let {
		id = useId(),
		ref = $bindable(null),
		forceMount = false,
		onInteractOutside = noop,
		onEscapeKeydown = noop,
		children,
		child,
		...restProps
	}: ListboxContentStaticProps = $props();

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
	isStatic={true}
	{...mergedProps}
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
			style: contentState.props.style,
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
