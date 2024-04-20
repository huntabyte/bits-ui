<script lang="ts">
	import type { ContentProps } from "../index.js";
	import { setPopoverContentState } from "../popover.svelte.js";
	import { PopperLayer } from "$lib/bits/utilities/index.js";
	import { readonlyBox } from "$lib/internal/box.svelte.js";
	import { generateId } from "$lib/internal/id.js";
	import Portal from "$lib/bits/utilities/portal/portal.svelte";

	let {
		asChild,
		child,
		children,
		el = $bindable(),
		style = {},
		id = generateId(),
		forceMount = false,
		...restProps
	}: ContentProps = $props();

	const state = setPopoverContentState({
		id: readonlyBox(() => id),
	});
</script>

<PopperLayer.Root
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
			<Portal {...mergedProps} forceMount={true}>
				<div {...mergedProps} bind:this={el}>
					{@render children?.()}
				</div>
			</Portal>
		{/if}
	{/snippet}
</PopperLayer.Root>
