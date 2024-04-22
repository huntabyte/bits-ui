<script lang="ts">
	import type { ContentProps } from "../index.js";
	import { setPopoverContentState } from "../popover.svelte.js";
	import { PopperLayer } from "$lib/bits/utilities/popper-layer/index.js";
	import { readonlyBox, useId } from "$lib/internal/index.js";

	let {
		asChild,
		child,
		children,
		el = $bindable(),
		style = {},
		id = useId(),
		forceMount = false,
		...restProps
	}: ContentProps = $props();

	const state = setPopoverContentState({
		id: readonlyBox(() => id),
	});
</script>

<PopperLayer
	{...restProps}
	forceMount={true}
	present={state.root.open.value || forceMount}
	{id}
	{style}
	onInteractOutside={state.root.close}
	onEscape={state.root.close}
>
	{#snippet popper({ props })}
		{@const mergedProps = {
			...restProps,
			...state.props,
			...props,
		}}
		{#if asChild}
			{@render child?.({ props: mergedProps })}
		{:else}
			<div {...mergedProps} bind:this={el}>
				{@render children?.()}
			</div>
		{/if}
	{/snippet}
</PopperLayer>
