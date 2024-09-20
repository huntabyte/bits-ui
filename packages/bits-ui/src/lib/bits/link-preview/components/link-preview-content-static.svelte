<script lang="ts">
	import { box } from "svelte-toolbelt";
	import type { ContentStaticProps } from "../index.js";
	import { useLinkPreviewContent } from "../link-preview.svelte.js";
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
	}: ContentStaticProps = $props();

	const contentState = useLinkPreviewContent({
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
		contentState.root.immediateClose();
	}}
	onEscapeKeydown={(e) => {
		onEscapeKeydown?.(e);
		if (e.defaultPrevented) return;
		contentState.root.immediateClose();
	}}
	onMountAutoFocus={(e) => e.preventDefault()}
	onDestroyAutoFocus={(e) => e.preventDefault()}
	trapFocus={false}
	loop={false}
	preventScroll={false}
>
	{#snippet popper({ props })}
		{#if child}
			{@render child({ props })}
		{:else}
			<div {...props} bind:this={ref}>
				{@render children?.()}
			</div>
		{/if}
	{/snippet}
</PopperLayer>
