<script lang="ts">
	import { box } from "svelte-toolbelt";
	import type { ContentProps } from "../index.js";
	import { useMenuContent } from "$lib/bits/menu/menu.svelte.js";
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

	function handleInteractOutsideStart(e: InteractOutsideEvent) {
		if (!isElement(e.target)) return;
		if (e.target.id === state.parentMenu.triggerId.value) {
			e.preventDefault();
			return;
		}
		if (e.target.closest(`#${state.parentMenu.triggerId.value}`)) {
			e.preventDefault();
		}
	}

	const mergedProps = $derived(
		mergeProps(restProps, state.props, {
			onInteractOutsideStart: handleInteractOutsideStart,
			style: {
				outline: "none",
				"--bits-dropdown-menu-content-transform-origin":
					"var(--bits-floating-transform-origin)",
				"--bits-dropdown-menu-content-available-width":
					"var(--bits-floating-available-width)",
				"--bits-dropdown-menu-content-available-height":
					"var(--bits-floating-available-height)",
				"--bits-dropdown-menu-trigger-width": "var(--bits-floating-anchor-width)",
				"--bits-dropdown-menu-trigger-height": "var(--bits-floating-anchor-height)",
			},
		})
	);
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
