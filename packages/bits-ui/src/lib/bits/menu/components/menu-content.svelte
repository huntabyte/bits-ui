<script lang="ts">
	import { box, mergeProps } from "svelte-toolbelt";
	import type { MenuContentProps } from "../types.js";
	import { useMenuContent } from "../menu.svelte.js";
	import { useId } from "$lib/internal/use-id.js";
	import { noop } from "$lib/internal/noop.js";
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
		onEscapeKeydown = noop,
		forceMount = false,
		...restProps
	}: MenuContentProps = $props();

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

	const mergedProps = $derived(
		mergeProps(restProps, contentState.props, {
			onInteractOutsideStart: handleInteractOutsideStart,
			style: { outline: "none" },
		})
	);
</script>

<PopperLayer
	{...mergedProps}
	present={contentState.parentMenu.open.current || forceMount}
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
	trapFocus
	{loop}
>
	{#snippet popper({ props })}
		{@const finalProps = mergeProps(props, {
			style: {
				outline: "none",
				...getFloatingContentCSSVars("menu"),
			},
		})}
		{#if child}
			{@render child({ props: finalProps, ...contentState.snippetProps })}
		{:else}
			<div {...finalProps}>
				{@render children?.()}
			</div>
		{/if}
		<Mounted bind:isMounted />
	{/snippet}
</PopperLayer>
