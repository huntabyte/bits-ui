<script lang="ts">
	import { box } from "svelte-toolbelt";
	import type { ContentProps } from "../index.js";
	import DismissableLayer from "$lib/bits/utilities/dismissable-layer/dismissable-layer.svelte";
	import EscapeLayer from "$lib/bits/utilities/escape-layer/escape-layer.svelte";
	import FocusScope from "$lib/bits/utilities/focus-scope/focus-scope.svelte";
	import PresenceLayer from "$lib/bits/utilities/presence-layer/presence-layer.svelte";
	import TextSelectionLayer from "$lib/bits/utilities/text-selection-layer/text-selection-layer.svelte";
	import { mergeProps } from "$lib/internal/mergeProps.js";
	import { useId } from "$lib/internal/useId.js";
	import { noop } from "$lib/internal/callbacks.js";
	import ScrollLock from "$lib/bits/utilities/scroll-lock/scroll-lock.svelte";
	import { useDialogContent } from "$lib/bits/dialog/dialog.svelte.js";

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
		onInteractOutsideStart = noop,
		preventScroll = true,
		trapFocus = true,
		...restProps
	}: ContentProps = $props();

	const contentState = useDialogContent({
		id: box.with(() => id),
		ref: box.with(
			() => ref,
			(v) => (ref = v)
		),
	});

	const mergedProps = $derived(mergeProps(restProps, contentState.props));
</script>

<PresenceLayer {...mergedProps} present={contentState.root.open.current || forceMount}>
	{#snippet presence({ present })}
		<ScrollLock {preventScroll} />
		<FocusScope
			loop
			trapFocus={present.current && trapFocus}
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
				contentState.root.cancelNode?.focus();
			}}
		>
			{#snippet focusScope({ props: focusScopeProps })}
				<EscapeLayer
					{...mergedProps}
					enabled={present.current}
					onEscapeKeydown={(e) => {
						onEscapeKeydown(e);
						if (e.defaultPrevented) return;
						contentState.root.closeDialog();
					}}
				>
					<DismissableLayer
						{...mergedProps}
						enabled={present.current}
						{interactOutsideBehavior}
						onInteractOutside={(e) => {
							onInteractOutsideStart(e);
							if (e.defaultPrevented) return;
							contentState.root.closeDialog();
						}}
					>
						<TextSelectionLayer {...mergedProps} enabled={present.current}>
							{#if child}
								{@render child({
									props: mergeProps(mergedProps, focusScopeProps),
									...contentState.snippetProps,
								})}
							{:else}
								<div
									{...mergeProps(mergedProps, focusScopeProps, {
										style: {
											pointerEvents: "auto",
										},
									})}
								>
									{@render children?.(contentState.snippetProps)}
								</div>
							{/if}
						</TextSelectionLayer>
					</DismissableLayer>
				</EscapeLayer>
			{/snippet}
		</FocusScope>
	{/snippet}
</PresenceLayer>
