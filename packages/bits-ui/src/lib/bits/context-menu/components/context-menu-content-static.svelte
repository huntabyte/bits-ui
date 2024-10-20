<script lang="ts">
	import { box, mergeProps } from "svelte-toolbelt";
	import type { ContextMenuContentStaticProps } from "../types.js";
	import { CONTEXT_MENU_TRIGGER_ATTR, useMenuContent } from "$lib/bits/menu/menu.svelte.js";
	import { useId } from "$lib/internal/use-id.js";
	import { noop } from "$lib/internal/noop.js";
	import PopperLayer from "$lib/bits/utilities/popper-layer/popper-layer.svelte";
	import Mounted from "$lib/bits/utilities/mounted.svelte";

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
	}: ContextMenuContentStaticProps = $props();

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

	const mergedProps = $derived(mergeProps(restProps, contentState.props));
</script>

<PopperLayer
	isStatic={true}
	{...mergedProps}
	present={contentState.parentMenu.open.current || forceMount}
	{preventScroll}
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
	{loop}
>
	{#snippet popper({ props })}
		{#if child}
			{@render child({ props, ...contentState.snippetProps })}
		{:else}
			<div {...props}>
				{@render children?.()}
			</div>
		{/if}
		<Mounted bind:isMounted />
	{/snippet}
</PopperLayer>
