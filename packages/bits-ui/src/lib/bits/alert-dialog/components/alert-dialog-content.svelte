<script lang="ts">
	import { afterSleep } from "svelte-toolbelt";
	import { boxWith } from "$lib/internal/box.svelte.js";
	import { mergeProps } from "$lib/internal/merge-props.js";
	import type { AlertDialogContentProps } from "../types.js";
	import DismissibleLayer from "$lib/bits/utilities/dismissible-layer/dismissible-layer.svelte";
	import EscapeLayer from "$lib/bits/utilities/escape-layer/escape-layer.svelte";
	import FocusScope from "$lib/bits/utilities/focus-scope/focus-scope.svelte";
	import TextSelectionLayer from "$lib/bits/utilities/text-selection-layer/text-selection-layer.svelte";
	import { createId } from "$lib/internal/create-id.js";
	import { noop } from "$lib/internal/noop.js";
	import ScrollLock from "$lib/bits/utilities/scroll-lock/scroll-lock.svelte";
	import { DialogContentState } from "$lib/bits/dialog/dialog.svelte.js";

	const uid = $props.id();

	let {
		id = createId(uid),
		children,
		child,
		ref = $bindable(null),
		forceMount = false,
		interactOutsideBehavior = "ignore",
		onCloseAutoFocus = noop,
		onEscapeKeydown = noop,
		onOpenAutoFocus = noop,
		onInteractOutside = noop,
		preventScroll = true,
		trapFocus = true,
		restoreScrollDelay = null,
		...restProps
	}: AlertDialogContentProps = $props();

	const contentState = DialogContentState.create({
		id: boxWith(() => id),
		ref: boxWith(
			() => ref,
			(v) => (ref = v)
		),
	});

	const mergedProps = $derived(mergeProps(restProps, contentState.props));

	/**
	 * When an overlay is rendered it already blocks pointer interaction with the
	 * rest of the page, so the scroll lock can skip the expensive
	 * `pointer-events: none` body write (an inherited property — toggling it
	 * forces a style recalculation of every element on the page).
	 */
	function shouldBlockPointerEvents() {
		return contentState.root.overlayNode === null;
	}
</script>

{#if contentState.shouldRender || forceMount}
	<FocusScope
		ref={contentState.opts.ref}
		loop
		{trapFocus}
		enabled={contentState.root.opts.open.current}
		{onCloseAutoFocus}
		onOpenAutoFocus={(e) => {
			onOpenAutoFocus(e);
			if (e.defaultPrevented) return;
			e.preventDefault();
			afterSleep(0, () => contentState.opts.ref.current?.focus());
		}}
	>
		{#snippet focusScope({ props: focusScopeProps })}
			<EscapeLayer
				{...mergedProps}
				enabled={contentState.root.opts.open.current}
				ref={contentState.opts.ref}
				onEscapeKeydown={(e) => {
					onEscapeKeydown(e);
					if (e.defaultPrevented) return;
					contentState.root.handleClose();
				}}
			>
				<DismissibleLayer
					{...mergedProps}
					ref={contentState.opts.ref}
					enabled={contentState.root.opts.open.current}
					{interactOutsideBehavior}
					onInteractOutside={(e) => {
						onInteractOutside(e);
						if (e.defaultPrevented) return;
						contentState.root.handleClose();
					}}
				>
					<TextSelectionLayer
						{...mergedProps}
						ref={contentState.opts.ref}
						enabled={contentState.root.opts.open.current}
					>
						{#if child}
							{#if contentState.root.opts.open.current}
								<ScrollLock
									{preventScroll}
									{restoreScrollDelay}
									{shouldBlockPointerEvents}
								/>
							{/if}
							{@render child({
								props: mergeProps(mergedProps, focusScopeProps),
								...contentState.snippetProps,
							})}
						{:else}
							<ScrollLock {preventScroll} {shouldBlockPointerEvents} />
							<div {...mergeProps(mergedProps, focusScopeProps)}>
								{@render children?.()}
							</div>
						{/if}
					</TextSelectionLayer>
				</DismissibleLayer>
			</EscapeLayer>
		{/snippet}
	</FocusScope>
{/if}
