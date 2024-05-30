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
		// we need to explicitly pass this prop to the PopperLayer to override
		// the default menu behavior of handling outside interactions on the trigger
		onInteractOutsideStart = noop,
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
				"--bits-context-menu-content-transform-origin":
					"var(--bits-floating-transform-origin)",
				"--bits-context-menu-content-available-width":
					"var(--bits-floating-available-width)",
				"--bits-context-menu-content-available-height":
					"var(--bits-floating-available-height)",
				"--bits-context-menu-trigger-width": "var(--bits-floating-anchor-width)",
				"--bits-context-menu-trigger-height": "var(--bits-floating-anchor-height)",
			},
		})
	);
</script>

<PopperLayer
	{...mergedProps}
	side="right"
	sideOffset={2}
	align="start"
	present={state.parentMenu.open.value || forceMount}
	{onInteractOutsideStart}
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
