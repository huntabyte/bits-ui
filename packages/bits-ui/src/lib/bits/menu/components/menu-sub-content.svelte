<script lang="ts">
	import { box } from "runed";
	import type { SubContentProps } from "../index.js";
	import { useMenuContent } from "../menu.svelte.js";
	import { SUB_CLOSE_KEYS } from "../utils.js";
	import { useId } from "$lib/internal/useId.svelte.js";
	import { mergeProps } from "$lib/internal/mergeProps.js";
	import PopperLayer from "$lib/bits/utilities/popper-layer/popper-layer.svelte";
	import { noop } from "$lib/internal/callbacks.js";

	let {
		id = useId(),
		el = $bindable(),
		asChild,
		children,
		child,
		loop = true,
		onInteractOutside = noop,
		forceMount = false,
		onEscapeKeydown = noop,
		side = "right",
		...restProps
	}: SubContentProps = $props();

	const state = useMenuContent({
		id: box.with(() => id),
		loop: box.with(() => loop),
	});

	function onkeydown(e: KeyboardEvent) {
		const isKeyDownInside = (e.currentTarget as HTMLElement).contains(e.target as HTMLElement);
		const isCloseKey = SUB_CLOSE_KEYS[state.parentMenu.root.dir.value].includes(e.key);
		if (isKeyDownInside && isCloseKey) {
			state.parentMenu.onClose();
			const triggerNode = document.getElementById(state.parentMenu.triggerId.value ?? "");
			triggerNode?.focus();
			e.preventDefault();
		}
	}

	const mergedProps = $derived(
		mergeProps(restProps, state.props, { onOpenAutoFocus, onCloseAutoFocus, side, onkeydown })
	);

	function onOpenAutoFocus(e: Event) {
		e.preventDefault();
		if (state.parentMenu.root.isUsingKeyboard.value) {
			state.parentMenu.contentNode.value?.focus();
		}
	}

	function onCloseAutoFocus(e: Event) {
		e.preventDefault();
	}
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
	preventScroll={false}
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
