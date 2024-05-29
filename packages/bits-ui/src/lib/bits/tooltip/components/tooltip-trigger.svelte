<script lang="ts">
	import { box } from "svelte-toolbelt";
	import type { TriggerProps } from "../index.js";
	import { useTooltipTrigger } from "../tooltip.svelte.js";
	import { useId } from "$lib/internal/useId.svelte.js";
	import { mergeProps } from "$lib/internal/mergeProps.js";
	import { FloatingLayer } from "$lib/bits/utilities/floating-layer/index.js";

	let {
		asChild,
		children,
		child,
		id = useId(),
		disabled = false,
		type = "button",
		el = $bindable(),
		...restProps
	}: TriggerProps = $props();

	const state = useTooltipTrigger({
		id: box.with(() => id),
		disabled: box.with(() => disabled),
	});

	const mergedProps = $derived(mergeProps(restProps, state.props, { type }));
</script>

<FloatingLayer.Anchor {id}>
	{#if asChild}
		{@render child?.({ props: mergedProps })}
	{:else}
		<button {...mergedProps} bind:this={el}>
			{@render children?.()}
		</button>
	{/if}
</FloatingLayer.Anchor>
