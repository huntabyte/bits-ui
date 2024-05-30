<script lang="ts">
	import { box } from "svelte-toolbelt";
	import type { SubContentProps } from "../index.js";
	import { useMenuContent } from "../menu.svelte.js";
	import { SUB_CLOSE_KEYS } from "../utils.js";
	import { useId } from "$lib/internal/useId.svelte.js";
	import { mergeProps } from "$lib/internal/mergeProps.js";
	import PopperLayer from "$lib/bits/utilities/popper-layer/popper-layer.svelte";
	import { noop } from "$lib/internal/callbacks.js";
	import { isHTMLElement } from "$lib/internal/is.js";
	import { afterTick } from "$lib/internal/afterTick.js";

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
		interactOutsideBehavior = "defer-otherwise-close",
		escapeKeydownBehavior = "defer-otherwise-close",
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
		mergeProps(restProps, state.props, {
			onMountAutoFocus,
			onDestroyAutoFocus,
			side,
			onkeydown,
			"data-menu-sub-content": "",
		})
	);

	function onMountAutoFocus(e: Event) {
		afterTick(() => {
			e.preventDefault();
			if (state.parentMenu.root.isUsingKeyboard.value) {
				const subContentEl = document.getElementById(id);
				subContentEl?.focus();
			}
		});
	}

	function onDestroyAutoFocus(e: Event) {
		e.preventDefault();
	}
</script>

<PopperLayer
	{...mergedProps}
	{interactOutsideBehavior}
	{escapeKeydownBehavior}
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
	onFocusOutside={(e) => {
		if (e.defaultPrevented) return;
		// We prevent closing when the trigger is focused to avoid triggering a re-open animation
		// on pointer interaction.
		if (!isHTMLElement(e.target)) return;

		if (e.target.id !== state.parentMenu.triggerId.value) {
			state.parentMenu.onClose();
		}
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
