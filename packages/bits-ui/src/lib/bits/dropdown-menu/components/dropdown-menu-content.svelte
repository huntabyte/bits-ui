<script lang="ts">
	import { box, mergeProps } from "svelte-toolbelt";
	import type { DropdownMenuContentProps } from "../types.js";
	import { useMenuContent } from "$lib/bits/menu/menu.svelte.js";
	import { useId } from "$lib/internal/use-id.js";
	import { noop } from "$lib/internal/noop.js";
	import PopperLayer from "$lib/bits/utilities/popper-layer/popper-layer.svelte";
	import Mounted from "$lib/bits/utilities/mounted.svelte";
	import { getFloatingContentCSSVars } from "$lib/internal/floating-svelte/floating-utils.svelte.js";
	import PopperLayerForceMount from "$lib/bits/utilities/popper-layer/popper-layer-force-mount.svelte";

	let {
		id = useId(),
		child,
		children,
		ref = $bindable(null),
		loop = true,
		onInteractOutside = noop,
		onEscapeKeydown = noop,
		onCloseAutoFocus = noop,
		forceMount = false,
		...restProps
	}: DropdownMenuContentProps = $props();

	const contentState = useMenuContent({
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
		contentState.handleInteractOutside(e);
		if (e.defaultPrevented) return;
		onInteractOutside(e);
		if (e.defaultPrevented) return;
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
		enabled={contentState.parentMenu.opts.open.current}
		onInteractOutside={handleInteractOutside}
		onEscapeKeydown={handleEscapeKeydown}
		trapFocus
		{loop}
		forceMount={true}
		{id}
	>
		{#snippet popper({ props, wrapperProps })}
			{@const finalProps = mergeProps(props, {
				style: getFloatingContentCSSVars("dropdown-menu"),
			})}
			{#if child}
				{@render child({ props: finalProps, wrapperProps, ...contentState.snippetProps })}
			{:else}
				<div {...wrapperProps}>
					<div {...finalProps}>
						{@render children?.()}
					</div>
				</div>
			{/if}
			<Mounted bind:mounted={contentState.mounted} />
		{/snippet}
	</PopperLayerForceMount>
{:else if !forceMount}
	<PopperLayer
		{...mergedProps}
		present={contentState.parentMenu.opts.open.current}
		onInteractOutside={handleInteractOutside}
		onEscapeKeydown={handleEscapeKeydown}
		trapFocus
		{loop}
		forceMount={false}
		{id}
	>
		{#snippet popper({ props, wrapperProps })}
			{@const finalProps = mergeProps(props, {
				style: getFloatingContentCSSVars("dropdown-menu"),
			})}
			{#if child}
				{@render child({ props: finalProps, wrapperProps, ...contentState.snippetProps })}
			{:else}
				<div {...wrapperProps}>
					<div {...finalProps}>
						{@render children?.()}
					</div>
				</div>
			{/if}
			<Mounted bind:mounted={contentState.mounted} />
		{/snippet}
	</PopperLayer>
{/if}
