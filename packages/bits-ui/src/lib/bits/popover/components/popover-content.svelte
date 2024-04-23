<script lang="ts">
	import type { ContentProps } from "../index.js";
	import { setPopoverContentState } from "../popover.svelte.js";
	import { PopperLayer } from "$lib/bits/utilities/popper-layer/index.js";
	import { mergeProps, readonlyBox, useId } from "$lib/internal/index.js";

	let {
		asChild,
		child,
		children,
		el = $bindable(),
		style = {},
		id = useId(),
		forceMount = false,
		// eslint-disable-next-line ts/no-unused-vars, unused-imports/no-unused-vars
		hidden: hiddenProp = undefined,
		...restProps
	}: ContentProps = $props();

	const state = setPopoverContentState({
		id: readonlyBox(() => id),
	});
</script>

<PopperLayer
	{...restProps}
	present={state.root.open.value || forceMount}
	{id}
	{style}
	onInteractOutside={state.root.close}
	onEscape={state.root.close}
>
	{#snippet popper({ props })}
		{@const mergedProps = mergeProps(restProps, state.props, props)}
		{mergedProps.hidden}
		{#if asChild}
			{@render child?.({ props: mergedProps })}
		{:else}
			<div {...mergedProps} bind:this={el}>
				{@render children?.()}
			</div>
		{/if}
	{/snippet}
</PopperLayer>
