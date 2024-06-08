<script lang="ts">
	import { box } from "svelte-toolbelt";
	import type { ContentProps } from "../index.js";
	import { useSelectContent, useSelectContentImpl } from "../select.svelte.js";
	import { useId } from "$lib/internal/useId.svelte.js";
	import PopperLayer from "$lib/bits/utilities/popper-layer/popper-layer.svelte";
	import { mergeProps } from "$lib/internal/mergeProps.js";
	import { noop } from "$lib/internal/callbacks.js";

	let {
		id = useId(),
		el = $bindable(),
		forceMount = false,
		children,
		asChild,
		child,
		onInteractOutside = noop,
		onEscapeKeydown = noop,
		onMountAutoFocus = noop,
		onDestroyAutoFocus = noop,
		...restProps
	}: ContentProps = $props();

	useSelectContent();
	const state = useSelectContentImpl({
		id: box.with(() => id),
		position: box.with(() => "item-aligned"),
	});

	const mergedProps = $derived(mergeProps(restProps, state.props));
</script>

<PopperLayer
	{...mergedProps}
	present={state.root.open.value || forceMount}
	onInteractOutside={(e) => {
		onInteractOutside(e);
		if (e.defaultPrevented) return;
		state.root.open.value = false;
	}}
	onEscapeKeydown={(e) => {
		// TODO: users should be able to cancel this
		onEscapeKeydown(e);
		state.root.open.value = false;
	}}
	trapped
	onMountAutoFocus={(e) => {
		onMountAutoFocus(e);
		e.preventDefault();
	}}
	onDestroyAutoFocus={(e) => {
		onDestroyAutoFocus(e);
		if (e.defaultPrevented) return;
		state.root.triggerNode.value?.focus({ preventScroll: true });
		e.preventDefault();
	}}
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
