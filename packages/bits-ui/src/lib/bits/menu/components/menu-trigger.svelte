<script lang="ts">
	import { box } from "svelte-toolbelt";
	import type { TriggerProps } from "../index.js";
	import { useMenuDropdownTrigger } from "../menu.svelte.js";
	import { useId } from "$lib/internal/useId.svelte.js";
	import { mergeProps } from "$lib/internal/mergeProps.js";
	import { FloatingLayer } from "$lib/bits/utilities/floating-layer/index.js";

	let {
		id = useId(),
		ref = $bindable(),
		asChild,
		child,
		children,
		disabled = false,
		...restProps
	}: TriggerProps = $props();

	const triggerState = useMenuDropdownTrigger({
		id: box.with(() => id),
		disabled: box.with(() => disabled),
	});

	const mergedProps = $derived(mergeProps(restProps, triggerState.props));
</script>

<FloatingLayer.Anchor {id}>
	{#if asChild}
		{@render child?.({ props: mergedProps })}
	{:else}
		<button {...mergedProps} bind:this={ref}>
			{@render children?.()}
		</button>
	{/if}
</FloatingLayer.Anchor>
