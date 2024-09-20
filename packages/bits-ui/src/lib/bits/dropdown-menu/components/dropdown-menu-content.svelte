<script lang="ts">
	import { box } from "svelte-toolbelt";
	import type { ContentProps } from "../index.js";
	import { useMenuContent } from "$lib/bits/menu/menu.svelte.js";
	import { useId } from "$lib/internal/useId.js";
	import { mergeProps } from "$lib/internal/mergeProps.js";
	import { noop } from "$lib/internal/callbacks.js";
	import PopperLayer from "$lib/bits/utilities/popper-layer/popper-layer.svelte";
	import Mounted from "$lib/bits/utilities/mounted.svelte";

	let {
		id = useId(),
		child,
		children,
		ref = $bindable(null),
		loop = true,
		onInteractOutside = noop,
		onEscapeKeydown = noop,
		forceMount = false,
		...restProps
	}: ContentProps = $props();

	let isMounted = $state(false);

	const contentState = useMenuContent({
		id: box.with(() => id),
		loop: box.with(() => loop),
		ref: box.with(
			() => ref,
			(v) => (ref = v)
		),
		isMounted: box.with(() => isMounted),
	});

	const mergedProps = $derived(mergeProps(restProps, contentState.props));
</script>

<PopperLayer
	{...mergedProps}
	present={contentState.parentMenu.open.current || forceMount}
	onInteractOutsideStart={(e) => {
		contentState.handleInteractOutside(e);
	}}
	onInteractOutside={(e) => {
		contentState.handleInteractOutside(e);
		if (e.defaultPrevented) return;
		onInteractOutside(e);
		contentState.parentMenu.onClose();
	}}
	onEscapeKeydown={(e) => {
		onEscapeKeydown(e);
		if (e.defaultPrevented) return;
		contentState.parentMenu.onClose();
	}}
	trapFocus
	{loop}
>
	{#snippet popper({ props })}
		{@const finalProps = mergeProps(props, {
			style: {
				"--bits-dropdown-menu-content-transform-origin":
					"var(--bits-floating-transform-origin)",
				"--bits-dropdown-menu-content-available-width":
					"var(--bits-floating-available-width)",
				"--bits-dropdown-menu-content-available-height":
					"var(--bits-floating-available-height)",
				"--bits-dropdown-menu-trigger-width": "var(--bits-floating-anchor-width)",
				"--bits-dropdown-menu-trigger-height": "var(--bits-floating-anchor-height)",
			},
		})}
		{#if child}
			{@render child({ props: finalProps })}
		{:else}
			<div {...finalProps}>
				{@render children?.()}
			</div>
		{/if}
		<Mounted bind:isMounted />
	{/snippet}
</PopperLayer>
