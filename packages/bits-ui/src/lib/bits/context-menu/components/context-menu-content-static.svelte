<script lang="ts">
	import { box, mergeProps } from "svelte-toolbelt";
	import type { ContextMenuContentStaticProps } from "../types.js";
	import { CONTEXT_MENU_TRIGGER_ATTR, MenuContentState } from "$lib/bits/menu/menu.svelte.js";
	import { useId } from "$lib/internal/use-id.js";
	import { noop } from "$lib/internal/noop.js";
	import PopperLayer from "$lib/bits/utilities/popper-layer/popper-layer.svelte";
	import { getFloatingContentCSSVars } from "$lib/internal/floating-svelte/floating-utils.svelte.js";
	import PopperLayerForceMount from "$lib/bits/utilities/popper-layer/popper-layer-force-mount.svelte";

	let {
		id = useId(),
		child,
		children,
		ref = $bindable(null),
		loop = true,
		onInteractOutside = noop,
		onCloseAutoFocus = noop,
		preventScroll = true,
		// we need to explicitly pass this prop to the PopperLayer to override
		// the default menu behavior of handling outside interactions on the trigger
		onEscapeKeydown = noop,
		forceMount = false,
		...restProps
	}: ContextMenuContentStaticProps = $props();

	const contentState = MenuContentState.create({
		id: box.with(() => id),
		loop: box.with(() => loop),
		ref: box.with(
			() => ref,
			(v) => (ref = v)
		),
		onCloseAutoFocus: box.with(() => onCloseAutoFocus),
	});

	const mergedProps = $derived(mergeProps(restProps, contentState.props));

	function handleInteractOutside(e: PointerEvent) {
		onInteractOutside(e);
		if (e.defaultPrevented) return;
		contentState.parentMenu.onClose();
	}

	function handleEscapeKeydown(e: KeyboardEvent) {
		onEscapeKeydown(e);
		if (e.defaultPrevented) return;
		contentState.parentMenu.onClose();
	}

	function isValidEvent(e: PointerEvent) {
		if ("button" in e && e.button === 2) {
			const target = e.target as HTMLElement;
			if (!target) return false;
			const isAnotherContextTrigger =
				target.closest(`[${CONTEXT_MENU_TRIGGER_ATTR}]`) !==
				contentState.parentMenu.triggerNode;
			return isAnotherContextTrigger;
		}
		return false;
	}
</script>

{#if forceMount}
	<PopperLayerForceMount
		{...mergedProps}
		{...contentState.popperProps}
		ref={contentState.opts.ref}
		isStatic
		side="right"
		sideOffset={2}
		align="start"
		enabled={contentState.parentMenu.opts.open.current}
		{preventScroll}
		onInteractOutside={handleInteractOutside}
		onEscapeKeydown={handleEscapeKeydown}
		{isValidEvent}
		trapFocus
		{loop}
		{forceMount}
		{id}
	>
		{#snippet popper({ props })}
			{@const finalProps = mergeProps(props, {
				style: getFloatingContentCSSVars("context-menu"),
			})}
			{#if child}
				{@render child({ props: finalProps, ...contentState.snippetProps })}
			{:else}
				<div {...finalProps}>
					{@render children?.()}
				</div>
			{/if}
		{/snippet}
	</PopperLayerForceMount>
{:else if !forceMount}
	<PopperLayer
		{...mergedProps}
		{...contentState.popperProps}
		ref={contentState.opts.ref}
		isStatic
		side="right"
		sideOffset={2}
		align="start"
		open={contentState.parentMenu.opts.open.current}
		{preventScroll}
		onInteractOutside={handleInteractOutside}
		onEscapeKeydown={handleEscapeKeydown}
		{isValidEvent}
		trapFocus
		{loop}
		forceMount={false}
		{id}
	>
		{#snippet popper({ props })}
			{@const finalProps = mergeProps(props, {
				style: getFloatingContentCSSVars("context-menu"),
			})}
			{#if child}
				{@render child({ props: finalProps, ...contentState.snippetProps })}
			{:else}
				<div {...finalProps}>
					{@render children?.()}
				</div>
			{/if}
		{/snippet}
	</PopperLayer>
{/if}
