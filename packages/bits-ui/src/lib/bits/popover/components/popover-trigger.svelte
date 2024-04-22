<script lang="ts">
	import type { TriggerProps } from "../index.js";
	import { setPopoverTriggerState } from "../popover.svelte.js";
	import { mergeProps, readonlyBox, useId } from "$lib/internal/index.js";
	import { FloatingLayer } from "$lib/bits/utilities/floating-layer/index.js";

	let {
		asChild,
		children,
		child,
		id = useId(),
		el = $bindable(),
		type = "button",
		...restProps
	}: TriggerProps = $props();

	const state = setPopoverTriggerState({
		id: readonlyBox(() => id),
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
