<script lang="ts">
	import { box } from "svelte-toolbelt";
	import type { ItemProps } from "../index.js";
	import { useMenuSubTrigger } from "../menu.svelte.js";
	import { useId } from "$lib/internal/useId.svelte.js";
	import { mergeProps } from "$lib/internal/mergeProps.js";
	import { FloatingLayer } from "$lib/bits/utilities/floating-layer/index.js";
	let {
		id = useId(),
		disabled = false,
		ref = $bindable(),
		asChild,
		children,
		child,
		...restProps
	}: ItemProps = $props();

	const subTriggerState = useMenuSubTrigger({
		disabled: box.with(() => disabled),
		id: box.with(() => id),
	});

	const mergedProps = $derived(mergeProps(restProps, subTriggerState.props));
</script>

<FloatingLayer.Anchor {id}>
	{#if asChild}
		{@render child?.({ props: mergedProps })}
	{:else}
		<div {...mergedProps} bind:this={ref}>
			{@render children?.()}
		</div>
	{/if}
</FloatingLayer.Anchor>
