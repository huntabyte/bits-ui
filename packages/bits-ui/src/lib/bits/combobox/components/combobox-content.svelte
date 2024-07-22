<script lang="ts">
	import { box } from "svelte-toolbelt";
	import type { ContentProps } from "../index.js";
	import { useComboboxContent } from "../combobox.svelte.js";
	import PopperLayer from "$lib/bits/utilities/popper-layer/popper-layer.svelte";
	import { useId } from "$lib/internal/useId.js";
	import { mergeProps } from "$lib/internal/mergeProps.js";
	import { noop } from "$lib/internal/callbacks.js";

	let {
		id = useId(),
		ref = $bindable(null),
		forceMount = false,
		side = "bottom",
		onInteractOutside = noop,
		onEscapeKeydown = noop,
		children,
		child,
		...restProps
	}: ContentProps = $props();

	const contentState = useComboboxContent({
		id: box.with(() => id),
		ref: box.with(
			() => ref,
			(v) => (ref = v)
		),
	});

	const mergedProps = $derived(mergeProps(restProps, contentState.props));
</script>

<PopperLayer
	{...mergedProps}
	{side}
	present={contentState.root.open.current || forceMount}
	{id}
	onInteractOutside={(e) => {
		if (
			e.target === contentState.root.triggerNode ||
			e.target === contentState.root.inputNode
		) {
			e.preventDefault();
			return;
		}

		onInteractOutside(e);
		if (e.defaultPrevented) return;
		contentState.root.closeMenu();
	}}
	onEscapeKeydown={(e) => {
		onEscapeKeydown(e);
		if (e.defaultPrevented) return
		contentState.root.closeMenu();
	}}
	onMountAutoFocus={(e) => e.preventDefault()}
	onDestroyAutoFocus={(e) => e.preventDefault()}
	trapped={false}
	loop={false}
	preventScroll={false}
	{forceMount}
>
	{#snippet popper({ props })}
		{@const finalProps = mergeProps(props, {
			style: {
				"--bits-combobox-content-transform-origin": "var(--bits-floating-transform-origin)",
				"--bits-combobox-content-available-width": "var(--bits-floating-available-width)",
				"--bits-combobox-content-available-height": "var(--bits-floating-available-height)",
				"--bits-combobox-trigger-width": "var(--bits-floating-anchor-width)",
				"--bits-combobox-trigger-height": "var(--bits-floating-anchor-height)",
			},
		})}
		{#if child}
			{@render child({ props: finalProps })}
		{:else}
			<div {...finalProps}>
				{@render children?.()}
			</div>
		{/if}
	{/snippet}
</PopperLayer>
