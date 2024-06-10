<script lang="ts">
	import { box } from "svelte-toolbelt";
	import type { ContentProps } from "../index.js";
	import { useMenuContent } from "$lib/bits/menu/menu.svelte.js";
	import { useId } from "$lib/internal/useId.svelte.js";
	import { mergeProps } from "$lib/internal/mergeProps.js";
	import { noop } from "$lib/internal/callbacks.js";
	import PopperLayer from "$lib/bits/utilities/popper-layer/popper-layer.svelte";
	import { isElementOrSVGElement } from "$lib/internal/is.js";

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

	const contentState = useMenuContent({
		id: box.with(() => id),
		loop: box.with(() => loop),
	});

	const mergedProps = $derived(
		mergeProps(restProps, contentState.props, {
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
	present={contentState.parentMenu.open.value || forceMount}
	enabled={contentState.parentMenu.open.value || forceMount}
	onInteractOutsideStart={(e) => {
		if (!isElementOrSVGElement(e.target)) return;
		if (e.target.id === contentState.parentMenu.triggerId.value) {
			console.log("start: is trigger, should not be closing");
			e.preventDefault();
			return;
		}
		if (e.target.closest(`#${contentState.parentMenu.triggerId.value}`)) {
			e.preventDefault();
			console.log("start: is within trigger, should not be closing");
		}
	}}
	onInteractOutside={(e) => {
		if (e.defaultPrevented) return;

		if (!isElementOrSVGElement(e.target)) return;
		if (e.target.id === contentState.parentMenu.triggerId.value) {
			console.log("is trigger, should not be closing");
			e.preventDefault();
			return;
		}
		if (e.target.closest(`#${contentState.parentMenu.triggerId.value}`)) {
			e.preventDefault();
			console.log("is within trigger, should not be closing");
			return;
		}

		console.log("target", e.target);

		console.log("it should not make it here!", e);
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
			<div {...finalProps} bind:this={el}>
				{@render children?.()}
			</div>
		{/if}
	{/snippet}
</PopperLayer>
