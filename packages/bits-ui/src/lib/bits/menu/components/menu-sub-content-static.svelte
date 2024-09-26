<script lang="ts">
	import { box } from "svelte-toolbelt";
	import type { SubContentProps } from "../index.js";
	import { useMenuContent } from "../menu.svelte.js";
	import { SUB_CLOSE_KEYS } from "../utils.js";
	import { useId } from "$lib/internal/useId.js";
	import { mergeProps } from "$lib/internal/mergeProps.js";
	import PopperLayer from "$lib/bits/utilities/popper-layer/popper-layer.svelte";
	import { noop } from "$lib/internal/callbacks.js";
	import { isHTMLElement } from "$lib/internal/is.js";
	import { afterTick } from "$lib/internal/afterTick.js";
	import Mounted from "$lib/bits/utilities/mounted.svelte";

	let {
		id = useId(),
		ref = $bindable(null),
		children,
		child,
		loop = true,
		onInteractOutside = noop,
		forceMount = false,
		onEscapeKeydown = noop,
		interactOutsideBehavior = "defer-otherwise-close",
		escapeKeydownBehavior = "defer-otherwise-close",
		onOpenAutoFocus: onOpenAutoFocusProp = noop,
		onCloseAutoFocus: onCloseAutoFocusProp = noop,
		onFocusOutside: onFocusOutsideProp = noop,
		side = "right",
		...restProps
	}: SubContentProps = $props();

	let isMounted = $state(false);

	const subContentState = useMenuContent({
		id: box.with(() => id),
		loop: box.with(() => loop),
		ref: box.with(
			() => ref,
			(v) => (ref = v)
		),
		isMounted: box.with(() => isMounted),
	});

	function onkeydown(e: KeyboardEvent) {
		const isKeyDownInside = (e.currentTarget as HTMLElement).contains(e.target as HTMLElement);
		const isCloseKey = SUB_CLOSE_KEYS[subContentState.parentMenu.root.dir.current].includes(
			e.key
		);
		if (isKeyDownInside && isCloseKey) {
			subContentState.parentMenu.onClose();
			const triggerNode = subContentState.parentMenu.triggerNode;
			triggerNode?.focus();
			e.preventDefault();
		}
	}

	const mergedProps = $derived(
		mergeProps(restProps, subContentState.props, {
			side,
			onkeydown,
			"data-menu-sub-content": "",
		})
	);

	function onOpenAutoFocus(e: Event) {
		afterTick(() => {
			e.preventDefault();
			if (subContentState.parentMenu.root.isUsingKeyboard.current) {
				const subContentEl = subContentState.parentMenu.contentNode;
				subContentEl?.focus();
			}
		});
	}

	function onCloseAutoFocus(e: Event) {
		e.preventDefault();
	}
</script>

<PopperLayer
	isStatic={true}
	{...mergedProps}
	{interactOutsideBehavior}
	{escapeKeydownBehavior}
	onCloseAutoFocus={(e) => {
		onCloseAutoFocusProp(e);
		if (e.defaultPrevented) return;
		onCloseAutoFocus(e);
	}}
	onOpenAutoFocus={(e) => {
		onOpenAutoFocusProp(e);
		if (e.defaultPrevented) return;
		onOpenAutoFocus(e);
	}}
	present={subContentState.parentMenu.open.current || forceMount}
	onInteractOutside={(e) => {
		onInteractOutside(e);
		if (e.defaultPrevented) return;
		subContentState.parentMenu.onClose();
	}}
	onEscapeKeydown={(e) => {
		// TODO: users should be able to cancel this
		onEscapeKeydown(e);
		if (e.defaultPrevented) return;
		subContentState.parentMenu.onClose();
	}}
	onFocusOutside={(e) => {
		onFocusOutsideProp(e);
		if (e.defaultPrevented) return;
		// We prevent closing when the trigger is focused to avoid triggering a re-open animation
		// on pointer interaction.
		if (!isHTMLElement(e.target)) return;
		if (e.target.id !== subContentState.parentMenu.triggerNode?.id) {
			subContentState.parentMenu.onClose();
		}
	}}
	preventScroll={false}
	{loop}
>
	{#snippet popper({ props })}
		{@const finalProps = mergeProps(props, mergedProps)}
		{#if child}
			{@render child({ props: finalProps })}
		{:else}
			<div {...finalProps}>
				{@render children?.()}
			</div>
		{/if}
		<Mounted bind:isMounted />
	{/snippet}
</PopperLayer>
