<script lang="ts">
	import { box } from "runed";
	import type { ContentProps } from "../index.js";
	import { useMenuContent } from "../menu.svelte.js";
	import { useId } from "$lib/internal/useId.svelte.js";
	import { mergeProps } from "$lib/internal/mergeProps.js";
	import { noop } from "$lib/internal/callbacks.js";
	import PopperLayer from "$lib/bits/utilities/popper-layer/popper-layer.svelte";

	let {
		id = useId(),
		asChild,
		child,
		children,
		el = $bindable(),
		loop = true,
		onInteractOutside = noop,
		onEscapeKeydown = noop,
		forceMount = false,
		...restProps
	}: ContentProps = $props();

	const state = useMenuContent({
		id: box.with(() => id),
		loop: box.with(() => loop),
	});

	const mergedProps = $derived(mergeProps(restProps, state.props));
</script>

<PopperLayer
	{...mergedProps}
	present={state.parentMenu.open.value || forceMount}
	onInteractOutside={(e) => {
		onInteractOutside(e);
		if (e.defaultPrevented) return;
		state.parentMenu.onClose();
	}}
	onEscapeKeydown={(e) => {
		// TODO: users should be able to cancel this
		onEscapeKeydown(e);
		state.parentMenu.onClose();
	}}
	trapped
	{loop}
>
	{#snippet popper({ props })}
		{@const finalProps = mergeProps(props, mergedProps)}
		{#if asChild}
			{@render child?.({ props: finalProps })}
		{:else}
			<div {...finalProps} bind:this={el}>
				{@render children?.()}
			</div>
		{/if}
	{/snippet}
</PopperLayer>
