<script lang="ts">
	import type { ContentImplProps } from "../index.js";
	import { SelectContentState } from "../select.svelte.js";
	import SelectContentFloating from "./select-content-floating.svelte";
	import SelectContentItemAligned from "./select-content-item-aligned.svelte";
	import FocusScope from "$lib/bits/utilities/focus-scope/focus-scope.svelte";
	import { noop } from "$lib/internal/callbacks.js";
	import { useId } from "$lib/internal/useId.svelte.js";
	import EscapeLayer from "$lib/bits/utilities/escape-layer/escape-layer.svelte";
	import DismissableLayer from "$lib/bits/utilities/dismissable-layer/dismissable-layer.svelte";
	import TextSelectionLayer from "$lib/bits/utilities/text-selection-layer/text-selection-layer.svelte";
	import { mergeProps } from "$lib/internal/mergeProps.js";

	let {
		el = $bindable(),
		id = useId(),
		onMountAutoFocus = noop,
		onDestroyAutoFocus = noop,
		present,
		position = "item-aligned",
		context,
		onEscapeKeydown = noop,
		onInteractOutside = noop,
		...restProps
	}: ContentImplProps & { present: boolean; context: SelectContentState } = $props();

	const state = context;

	// eslint-disable-next-line unused-imports/no-unused-vars, ts/no-unused-vars
	const { children, child, asChild, ...restWithoutChildren } = restProps;
</script>

<FocusScope
	{id}
	trapped={present}
	onMountAutoFocus={(e) => {
		onMountAutoFocus(e);
		e.preventDefault();
	}}
	onDestroyAutoFocus={(e) => {
		onDestroyAutoFocus(e);
		if (e.defaultPrevented) return;
		state.root.focusTriggerNode();
	}}
>
	{#snippet focusScope({ props: focusScopeProps })}
		<EscapeLayer
			{...restWithoutChildren}
			enabled={present}
			onEscapeKeydown={(e) => {
				// TODO: users should be able to cancel this
				onEscapeKeydown(e);
				state.root.open.value = false;
			}}
		>
			<DismissableLayer
				{...restWithoutChildren}
				{id}
				enabled={present}
				onInteractOutside={(e) => {
					onInteractOutside(e);
					if (e.defaultPrevented) return;
					state.root.open.value = false;
				}}
			>
				{#snippet children({ props: dismissableProps })}
					<TextSelectionLayer {...restWithoutChildren} {id} enabled={present}>
						{@const mergedProps = mergeProps(
							restWithoutChildren,
							dismissableProps,
							focusScopeProps,
							state.props,
							{ style: { pointerEvents: "auto" } }
						) as any}
						{#if position === "floating"}
							<SelectContentFloating {...restProps} {...mergedProps} bind:el />
						{:else}
							<SelectContentItemAligned {...restProps} {...mergedProps} bind:el />
						{/if}
					</TextSelectionLayer>
				{/snippet}
			</DismissableLayer>
		</EscapeLayer>
	{/snippet}
</FocusScope>
