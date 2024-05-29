<script lang="ts">
	import { box } from "svelte-toolbelt";
	import type { TriggerProps } from "../index.js";
	import { useMenuContextTrigger } from "$lib/bits/menu/menu.svelte.js";
	import { useId } from "$lib/internal/useId.svelte.js";
	import { mergeProps } from "$lib/internal/mergeProps.js";
	import { FloatingLayer } from "$lib/bits/utilities/floating-layer/index.js";

	let {
		id = useId(),
		el = $bindable(),
		asChild,
		child,
		children,
		disabled = false,
		...restProps
	}: TriggerProps = $props();

	const state = useMenuContextTrigger({
		id: box.with(() => id),
		disabled: box.with(() => disabled),
	});

	const mergedProps = $derived(
		mergeProps(restProps, state.props, { style: { pointerEvents: "auto" } })
	);
</script>

<FloatingLayer.Anchor {id} virtualEl={state.virtualElement}>
	{#if asChild}
		{@render child?.({ props: mergedProps })}
	{:else}
		<div {...mergedProps} bind:this={el}>
			{@render children?.()}
		</div>
	{/if}
</FloatingLayer.Anchor>
