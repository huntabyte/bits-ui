<script lang="ts">
	import type { ContentImplProps } from "../index.js";
	import { SelectContentState } from "../select.svelte.js";
	import SelectContentFloating from "./select-content-floating.svelte";
	import SelectContentItemAligned from "./select-content-item-aligned.svelte";
	import FocusScope from "$lib/bits/utilities/focus-scope/focus-scope.svelte";
	import { noop } from "$lib/internal/callbacks.js";
	import { useId } from "$lib/internal/useId.js";
	import EscapeLayer from "$lib/bits/utilities/escape-layer/escape-layer.svelte";
	import DismissableLayer from "$lib/bits/utilities/dismissable-layer/dismissable-layer.svelte";
	import TextSelectionLayer from "$lib/bits/utilities/text-selection-layer/text-selection-layer.svelte";
	import { mergeProps } from "$lib/internal/mergeProps.js";

	let {
		ref: _ref = $bindable(null),
		id = useId(),
		onOpenAutoFocus = noop,
		onCloseAutoFocus = noop,
		present,
		position = "floating",
		context,
		onEscapeKeydown = noop,
		onInteractOutside = noop,
		...restProps
	}: ContentImplProps & { present: boolean; context: SelectContentState } = $props();

	const contentState = context;

	const { children: _c, child: _ch, ...restWithoutChildren } = restProps;
</script>

<FocusScope
	{id}
	trapFocus={present}
	onOpenAutoFocus={(e) => {
		onOpenAutoFocus(e);
		e.preventDefault();
	}}
	onCloseAutoFocus={(e) => {
		onCloseAutoFocus(e);
	}}
>
	{#snippet focusScope({ props: focusScopeProps })}
		<EscapeLayer
			{...restWithoutChildren}
			enabled={present}
			onEscapeKeydown={(e) => {
				onEscapeKeydown(e);
				if (e.defaultPrevented) return;
				contentState.root.handleClose();
			}}
		>
			<DismissableLayer
				{...restWithoutChildren}
				{id}
				enabled={present}
				onInteractOutside={(e) => {
					onInteractOutside(e);
					if (e.defaultPrevented) return;
					contentState.root.handleClose();
				}}
			>
				{#snippet children({ props: dismissableProps })}
					<TextSelectionLayer {...restWithoutChildren} {id} enabled={present}>
						{@const mergedProps = mergeProps(
							restWithoutChildren,
							dismissableProps,
							focusScopeProps,
							contentState.props,
							{ style: { pointerEvents: "auto" } }
						) as any}
						{#if position === "floating"}
							<SelectContentFloating
								{...restProps}
								{...mergedProps}
								onPlaced={() => (contentState.isPositioned.current = true)}
							/>
						{:else}
							<SelectContentItemAligned
								{...restProps}
								{...mergedProps}
								onPlaced={() => (contentState.isPositioned.current = true)}
							/>
						{/if}
					</TextSelectionLayer>
				{/snippet}
			</DismissableLayer>
		</EscapeLayer>
	{/snippet}
</FocusScope>
