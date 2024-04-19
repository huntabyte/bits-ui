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

<FloatingLayer.Content {id} {style} {...restProps}>
	{#snippet content({ props })}
		<Presence forceMount={true} present={state.root.open.value || forceMount} node={state.node}>
			{#snippet presence({ present })}
				{@const mergedProps = {
					...state.props,
					...props,
					hidden: present.value ? undefined : true,
				}}
				{#if asChild}
					{@render child?.({ props: mergedProps })}
				{:else}
					<div {...mergedProps} bind:this={el}>
						{@render children?.()}
					</div>
				{/if}
			{/snippet}
		</Presence>
	{/snippet}
</FloatingLayer.Content>
