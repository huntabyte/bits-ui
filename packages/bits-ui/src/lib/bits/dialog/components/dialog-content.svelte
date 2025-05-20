<script lang="ts">
	import { box, mergeProps } from "svelte-toolbelt";
	import { useDialogContent } from "../dialog.svelte.js";
	import type { DialogContentProps } from "../types.js";
	import DismissibleLayer from "$lib/bits/utilities/dismissible-layer/dismissible-layer.svelte";
	import EscapeLayer from "$lib/bits/utilities/escape-layer/escape-layer.svelte";
	import FocusScope from "$lib/bits/utilities/focus-scope/focus-scope.svelte";
	import PresenceLayer from "$lib/bits/utilities/presence-layer/presence-layer.svelte";
	import TextSelectionLayer from "$lib/bits/utilities/text-selection-layer/text-selection-layer.svelte";
	import { createId } from "$lib/internal/create-id.js";
	import { noop } from "$lib/internal/noop.js";
	import ScrollLock from "$lib/bits/utilities/scroll-lock/scroll-lock.svelte";
	import { shouldTrapFocus } from "$lib/internal/should-trap-focus.js";

	const uid = $props.id();

	let {
		id = createId(uid),
		children,
		child,
		ref = $bindable(null),
		forceMount = false,
		onCloseAutoFocus = noop,
		onOpenAutoFocus = noop,
		onEscapeKeydown = noop,
		onInteractOutside = noop,
		trapFocus = true,
		preventScroll = true,
		restoreScrollDelay = null,
		...restProps
	}: DialogContentProps = $props();

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
			{onOpenAutoFocus}
			{id}
			onCloseAutoFocus={(e) => {
				onCloseAutoFocus(e);
				if (e.defaultPrevented) return;
				contentState.root.triggerNode?.focus();
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
						ref={contentState.opts.ref}
						enabled={contentState.root.opts.open.current}
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
