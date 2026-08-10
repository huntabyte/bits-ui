<script lang="ts">
	import type { Snippet } from "svelte";
	import type { WritableBox } from "svelte-toolbelt";
	import { mergeProps } from "svelte-toolbelt";
	import EscapeLayer from "$lib/bits/utilities/escape-layer/escape-layer.svelte";
	import DismissibleLayer from "$lib/bits/utilities/dismissible-layer/dismissible-layer.svelte";
	import FocusScope from "$lib/bits/utilities/focus-scope/focus-scope.svelte";
	import TextSelectionLayer from "$lib/bits/utilities/text-selection-layer/text-selection-layer.svelte";
	import ScrollLock from "$lib/bits/utilities/scroll-lock/scroll-lock.svelte";
	import type { EscapeBehaviorType } from "$lib/bits/utilities/escape-layer/types.js";
	import type { InteractOutsideBehaviorType } from "$lib/bits/utilities/dismissible-layer/types.js";
	import { noop } from "$lib/internal/noop.js";

	let {
		id,
		ref,
		enabled,
		shouldRender,
		preventScroll = false,
		onEscapeKeydown = noop,
		escapeKeydownBehavior = "close",
		onInteractOutside = noop,
		onFocusOutside = noop,
		interactOutsideBehavior = "close",
		isValidEvent = () => false,
		preventOverflowTextSelection = true,
		onOpenAutoFocus = noop,
		onCloseAutoFocus = noop,
		trapFocus = false,
		loop = false,
		content,
	}: {
		id: string;
		ref: WritableBox<HTMLElement | null>;
		enabled: boolean;
		shouldRender: boolean;
		preventScroll?: boolean;
		onEscapeKeydown?: (e: KeyboardEvent) => void;
		escapeKeydownBehavior?: EscapeBehaviorType;
		onInteractOutside?: (e: PointerEvent) => void;
		onFocusOutside?: (e: FocusEvent) => void;
		interactOutsideBehavior?: InteractOutsideBehaviorType;
		isValidEvent?: (e: PointerEvent, target: HTMLElement) => boolean;
		preventOverflowTextSelection?: boolean;
		onOpenAutoFocus?: (e: Event) => void;
		onCloseAutoFocus?: (e: Event) => void;
		trapFocus?: boolean;
		loop?: boolean;
		content: Snippet<[{ props: Record<string, unknown> }]>;
	} = $props();
</script>

{#if shouldRender}
	<ScrollLock {preventScroll} />
	<FocusScope
		{onOpenAutoFocus}
		{onCloseAutoFocus}
		{loop}
		{enabled}
		{trapFocus}
		forceMount={false}
		{ref}
	>
		{#snippet focusScope({ props: focusScopeProps })}
			<EscapeLayer {onEscapeKeydown} {escapeKeydownBehavior} {enabled} {ref}>
				<DismissibleLayer
					{id}
					{onInteractOutside}
					{onFocusOutside}
					{interactOutsideBehavior}
					{isValidEvent}
					{enabled}
					{ref}
				>
					{#snippet children({ props: dismissibleProps })}
						<TextSelectionLayer
							{id}
							{preventOverflowTextSelection}
							{enabled}
							{ref}
						>
							{@render content({
								props: mergeProps(focusScopeProps, dismissibleProps),
							})}
						</TextSelectionLayer>
					{/snippet}
				</DismissibleLayer>
			</EscapeLayer>
		{/snippet}
	</FocusScope>
{/if}
