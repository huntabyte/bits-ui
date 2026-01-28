<script lang="ts">
	import { boxWith, mergeProps } from "svelte-toolbelt";
	import type { MenuContentProps } from "../types.js";
	import { MenuContentState } from "../menu.svelte.js";
	import { createId } from "$lib/internal/create-id.js";
	import { noop } from "$lib/internal/noop.js";
	import PopperLayer from "$lib/bits/utilities/popper-layer/popper-layer.svelte";
	import { getFloatingContentCSSVars } from "$lib/internal/floating-svelte/floating-utils.svelte.js";
	import PopperLayerForceMount from "$lib/bits/utilities/popper-layer/popper-layer-force-mount.svelte";

	const uid = $props.id();

	let {
		id = createId(uid),
		child,
		children,
		ref = $bindable(null),
		loop = true,
		onInteractOutside = noop,
		onEscapeKeydown = noop,
		onCloseAutoFocus: onCloseAutoFocusProp = noop,
		forceMount = false,
		style,
		...restProps
	}: MenuContentProps = $props();

	const contentState = MenuContentState.create({
		id: boxWith(() => id),
		loop: boxWith(() => loop),
		ref: boxWith(
			() => ref,
			(v) => (ref = v)
		),
		onCloseAutoFocus: boxWith(() => onCloseAutoFocusProp),
	});

	const mergedProps = $derived(
		mergeProps(restProps, contentState.props, {
			style: { outline: "none" },
		})
	);

	function handleInteractOutside(e: PointerEvent) {
		onInteractOutside(e);
		if (e.defaultPrevented) return;
		// don't close if the interaction is with a submenu content or items
		if (e.target && e.target instanceof Element) {
			const subContentSelector = `[${contentState.parentMenu.root.getBitsAttr("sub-content")}]`;
			if (e.target.closest(subContentSelector)) return;
		}
		contentState.parentMenu.onClose();
	}

	function handleEscapeKeydown(e: KeyboardEvent) {
		onEscapeKeydown(e);
		if (e.defaultPrevented) return;
		contentState.parentMenu.onClose();
	}
</script>

{#if forceMount}
	<PopperLayerForceMount
		{...mergedProps}
		{...contentState.popperProps}
		ref={contentState.opts.ref}
		enabled={contentState.parentMenu.opts.open.current}
		onInteractOutside={handleInteractOutside}
		onEscapeKeydown={handleEscapeKeydown}
		trapFocus
		{loop}
		forceMount={true}
		{id}
		shouldRender={contentState.shouldRender}
	>
		{#snippet popper({ props, wrapperProps })}
			{@const finalProps = mergeProps(props, { style: { outline: "none", ...getFloatingContentCSSVars("menu") } }, { style })}
			{#if child}
				{@render child({ props: finalProps, wrapperProps, ...contentState.snippetProps })}
			{:else}
				<div {...wrapperProps}>
					<div {...finalProps}>
						{@render children?.()}
					</div>
				</div>
			{/if}
		{/snippet}
	</PopperLayerForceMount>
{:else if !forceMount}
	<PopperLayer
		{...mergedProps}
		{...contentState.popperProps}
		ref={contentState.opts.ref}
		open={contentState.parentMenu.opts.open.current}
		onInteractOutside={handleInteractOutside}
		onEscapeKeydown={handleEscapeKeydown}
		trapFocus
		{loop}
		forceMount={false}
		{id}
		shouldRender={contentState.shouldRender}
	>
		{#snippet popper({ props, wrapperProps })}
			{@const finalProps = mergeProps(props, { style: { outline: "none", ...getFloatingContentCSSVars("menu") } }, { style })}
			{#if child}
				{@render child({ props: finalProps, wrapperProps, ...contentState.snippetProps })}
			{:else}
				<div {...wrapperProps}>
					<div {...finalProps}>
						{@render children?.()}
					</div>
				</div>
			{/if}
		{/snippet}
	</PopperLayer>
{/if}
