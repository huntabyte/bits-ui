<script lang="ts">
	import type { ContentProps } from "../index.js";
	import { usePopoverContent } from "../popover.svelte.js";
	import { PopperLayer } from "$lib/bits/utilities/popper-layer/index.js";
	import { mergeProps, noop, readonlyBox, useId } from "$lib/internal/index.js";

	let {
		asChild,
		child,
		children,
		el = $bindable(),
		id = useId(),
		forceMount = false,
		onDestroyAutoFocus = noop,
		onEscapeKeydown = noop,
		onInteractOutside = noop,
		loop = true,
		...restProps
	}: ContentProps = $props();

	const state = usePopoverContent({
		id: readonlyBox(() => id),
	});
</script>

<PopperLayer
	{...restProps}
	present={state.root.open.value || forceMount}
	{id}
	onInteractOutside={(e) => {
		onInteractOutside(e);
		if (e.defaultPrevented) return;
		state.root.close();
	}}
	onEscapeKeydown={(e) => {
		// TODO: users should be able to cancel this
		onEscapeKeydown(e);
		state.root.close();
	}}
	onDestroyAutoFocus={(e) => {
		onDestroyAutoFocus(e);
		if (e.defaultPrevented) return;
		e.preventDefault();
		state.root.triggerNode?.value?.focus();
	}}
	trapped
	{loop}
>
	{#snippet popper({ props })}
		{@const mergedProps = mergeProps(restProps, state.props, props)}
		{#if asChild}
			{@render child?.({ props: mergedProps })}
		{:else}
			<div {...mergedProps} bind:this={el}>
				{@render children?.()}
			</div>
		{/if}
	{/snippet}
</PopperLayer>
