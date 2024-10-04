<script lang="ts">
	import { box } from "svelte-toolbelt";
	import type { ContextMenuContentProps } from "../types.js";
	import { CONTEXT_MENU_TRIGGER_ATTR, useMenuContent } from "$lib/bits/menu/menu.svelte.js";
	import { useId } from "$lib/internal/useId.js";
	import { mergeProps } from "$lib/internal/mergeProps.js";
	import { noop } from "$lib/internal/callbacks.js";
	import PopperLayer from "$lib/bits/utilities/popper-layer/popper-layer.svelte";
	import { isElement } from "$lib/internal/is.js";
	import type { InteractOutsideEvent } from "$lib/bits/utilities/dismissible-layer/types.js";
	import Mounted from "$lib/bits/utilities/mounted.svelte";
	import { getFloatingContentCSSVars } from "$lib/internal/floating-svelte/floating-utils.svelte.js";

	let {
		id = useId(),
		child,
		children,
		ref = $bindable(null),
		loop = true,
		onInteractOutside = noop,
		preventScroll = true,
		// we need to explicitly pass this prop to the PopperLayer to override
		// the default menu behavior of handling outside interactions on the trigger
		onEscapeKeydown = noop,
		forceMount = false,
		...restProps
	}: ContextMenuContentProps = $props();

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

	function handleInteractOutsideStart(e: InteractOutsideEvent) {
		if (!isElement(e.target)) return;
		if (e.target.id === contentState.parentMenu.triggerNode?.id) {
			e.preventDefault();
			return;
		}
		if (e.target.closest(`#${contentState.parentMenu.triggerNode?.id}`)) {
			e.preventDefault();
		}
	}

	const mergedProps = $derived(mergeProps(restProps, contentState.props));
</script>

<PopperLayer
	{...mergedProps}
	side="right"
	sideOffset={2}
	align="start"
	present={contentState.parentMenu.open.current || forceMount}
	{preventScroll}
	onInteractOutsideStart={handleInteractOutsideStart}
	onInteractOutside={(e) => {
		onInteractOutside(e);
		if (e.defaultPrevented) return;
		contentState.parentMenu.onClose();
	}}
	onEscapeKeydown={(e) => {
		onEscapeKeydown(e);
		if (e.defaultPrevented) return;
		contentState.parentMenu.onClose();
	}}
	isValidEvent={(e) => {
		if ("button" in e && e.button === 2) {
			const target = e.target as HTMLElement;
			if (!target) return false;
			const isAnotherContextTrigger =
				target.closest(`[${CONTEXT_MENU_TRIGGER_ATTR}]`) !==
				contentState.parentMenu.triggerNode;
			return isAnotherContextTrigger;
		}
		return false;
	}}
	trapFocus
	{loop}
>
	{#snippet popper({ props })}
		{@const finalProps = mergeProps(props, {
			style: getFloatingContentCSSVars("context-menu"),
		})}
		{#if child}
			{@render child({ props: finalProps, ...contentState.snippetProps })}
		{:else}
			<div {...finalProps}>
				{@render children?.(contentState.snippetProps)}
			</div>
		{/if}
		<Mounted bind:isMounted />
	{/snippet}
</PopperLayer>
