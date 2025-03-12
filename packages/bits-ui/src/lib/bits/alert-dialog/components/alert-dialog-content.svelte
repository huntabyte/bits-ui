<script lang="ts">
	import { afterTick, box, mergeProps } from "svelte-toolbelt";
	import type { AlertDialogContentProps } from "../types.js";
	import DismissibleLayer from "$lib/bits/utilities/dismissible-layer/dismissible-layer.svelte";
	import EscapeLayer from "$lib/bits/utilities/escape-layer/escape-layer.svelte";
	import FocusScope from "$lib/bits/utilities/focus-scope/focus-scope.svelte";
	import PresenceLayer from "$lib/bits/utilities/presence-layer/presence-layer.svelte";
	import TextSelectionLayer from "$lib/bits/utilities/text-selection-layer/text-selection-layer.svelte";
	import { useId } from "$lib/internal/use-id.js";
	import { noop } from "$lib/internal/noop.js";
	import ScrollLock from "$lib/bits/utilities/scroll-lock/scroll-lock.svelte";
	import { useDialogContent } from "$lib/bits/dialog/dialog.svelte.js";
	import { shouldTrapFocus } from "$lib/internal/should-trap-focus.js";

	let {
		id = useId(),
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

	const contentState = useDialogContent({
		id: box.with(() => id),
		ref: box.with(
			() => ref,
			(v) => (ref = v)
		),
	});

	const mergedProps = $derived(mergeProps(restProps, contentState.props));
</script>

<PresenceLayer
	{...mergedProps}
	{forceMount}
	present={contentState.root.opts.open.current || forceMount}
>
	{#snippet presence()}
		<FocusScope
			loop
			trapFocus={shouldTrapFocus({
				forceMount,
				present: contentState.root.opts.open.current,
				trapFocus,
				open: contentState.root.opts.open.current,
			})}
			{...mergedProps}
			onCloseAutoFocus={(e) => {
				onCloseAutoFocus(e);
				if (e.defaultPrevented) return;
				contentState.root.triggerNode?.focus();
			}}
			onOpenAutoFocus={(e) => {
				onOpenAutoFocus(e);
				if (e.defaultPrevented) return;
				e.preventDefault();
				afterTick(() => {
					contentState.opts.ref.current?.focus();
				});
			}}
		>
			{#snippet focusScope({ props: focusScopeProps })}
				<EscapeLayer
					{...mergedProps}
					enabled={contentState.root.opts.open.current}
					onEscapeKeydown={(e) => {
						onEscapeKeydown(e);
						if (e.defaultPrevented) return;
						contentState.root.handleClose();
					}}
				>
					<DismissibleLayer
						{...mergedProps}
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
							enabled={contentState.root.opts.open.current}
						>
							{#if child}
								{#if contentState.root.opts.open.current}
									<ScrollLock {preventScroll} {restoreScrollDelay} />
								{/if}
								{@render child({
									props: mergeProps(mergedProps, focusScopeProps),
									...contentState.snippetProps,
								})}
							{:else}
								<ScrollLock {preventScroll} />
								<div {...mergeProps(mergedProps, focusScopeProps)}>
									{@render children?.()}
								</div>
							{/if}
						</TextSelectionLayer>
					</DismissibleLayer>
				</EscapeLayer>
			{/snippet}
		</FocusScope>
	{/snippet}
</PresenceLayer>
