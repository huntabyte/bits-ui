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
	present={state.root.open.value || forceMount}
	{id}
	onInteractOutside={(e) => {
		onInteractOutside(e);
		if (e.defaultPrevented) return;
		state.root.onClose();
	}}
	onEscapeKeydown={(e) => {
		// TODO: users should be able to cancel this
		onEscapeKeydown(e);
		state.root.onClose();
	}}
	trapped
	{loop}
>
	{#snippet popper({ props })}
		{@const mergedProps = mergeProps(state.props, props)}
		{#if asChild}
			{@render child?.({ props: mergedProps })}
		{:else}
			<div {...mergedProps} bind:this={el}>
				{@render children?.()}
			</div>
		{/if}
	{/snippet}
</PopperLayer>
