<script lang="ts">
	import type { ContentProps } from "../index.js";
	import { setPopoverContentState } from "../popover.svelte.js";
	import { FloatingLayer, PresenceLayer } from "$lib/bits/utilities/index.js";
	import { readonlyBox } from "$lib/internal/box.svelte.js";
	import { generateId } from "$lib/internal/id.js";

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

<PresenceLayer.Root forceMount={true} present={state.root.open.value || forceMount} {id}>
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
</PresenceLayer.Root>
