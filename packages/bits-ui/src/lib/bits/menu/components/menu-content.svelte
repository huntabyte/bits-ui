<script lang="ts">
	import { box } from "svelte-toolbelt";
	import type { ContentProps } from "../index.js";
	import { useMenuContent } from "../menu.svelte.js";
	import { useId } from "$lib/internal/useId.svelte.js";
	import { mergeProps } from "$lib/internal/mergeProps.js";
	import { noop } from "$lib/internal/callbacks.js";
	import PopperLayer from "$lib/bits/utilities/popper-layer/popper-layer.svelte";
	import { isElement } from "$lib/internal/is.js";
	import type { InteractOutsideEvent } from "$lib/bits/utilities/dismissable-layer/types.js";

	let {
		id = useId(),
		asChild,
		child,
		children,
		ref = $bindable(),
		loop = true,
		onInteractOutside = noop,
		onEscapeKeydown = noop,
		forceMount = false,
		...restProps
	}: ContentProps = $props();

	const contentState = useMenuContent({
		id: box.with(() => id),
		loop: box.with(() => loop),
	});

	function handleInteractOutsideStart(e: InteractOutsideEvent) {
		if (!isElement(e.target)) return;
		if (e.target.id === contentState.parentMenu.triggerId.value) {
			e.preventDefault();
			return;
		}
		if (e.target.closest(`#${contentState.parentMenu.triggerId.value}`)) {
			e.preventDefault();
		}
	}

	const mergedProps = $derived(
		mergeProps(restProps, contentState.props, {
			onInteractOutsideStart: handleInteractOutsideStart,
			style: { outline: "none" },
		})
	);
</script>

<PopperLayer
	{...mergedProps}
	present={contentState.parentMenu.open.value || forceMount}
	onInteractOutside={(e) => {
		onInteractOutside(e);
		if (e.defaultPrevented) return;
		contentState.parentMenu.onClose();
	}}
	onEscapeKeydown={(e) => {
		// TODO: users should be able to cancel this
		onEscapeKeydown(e);
		contentState.parentMenu.onClose();
	}}
	trapped
	{loop}
>
	{#snippet popper({ props })}
		{@const finalProps = mergeProps(props, mergedProps)}
		{#if asChild}
			{@render child?.({ props: finalProps })}
		{:else}
			<div {...finalProps} bind:this={ref}>
				{@render children?.()}
			</div>
		{/if}
	{/snippet}
</PopperLayer>
