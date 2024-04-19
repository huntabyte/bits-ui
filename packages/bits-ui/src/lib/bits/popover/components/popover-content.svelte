<script lang="ts">
	import type { ContentProps } from "../index.js";
	import { setPopoverContentState } from "../popover.svelte.js";
	import { FloatingLayer } from "$lib/bits/utilities/index.js";
	import { readonlyBox } from "$lib/internal/box.svelte.js";
	import { generateId } from "$lib/internal/id.js";
	import Presence from "$lib/bits/utilities/presence.svelte";

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

<Presence forceMount={true} present={state.root.open.value || forceMount} node={state.node}>
	{#snippet presence({ present })}
		<FloatingLayer.Content {id} {style} {...restProps}>
			{#snippet content({ props })}
				{@const mergedProps = {
					...state.props,
					...props,
					hidden: present.value ? undefined : true,
					...restProps,
				}}
				{#if asChild}
					{@render child?.({ props: mergedProps })}
				{:else}
					<div {...mergedProps} bind:this={el}>
						{@render children?.()}
					</div>
				{/if}
			{/snippet}
		</FloatingLayer.Content>
	{/snippet}
</Presence>
