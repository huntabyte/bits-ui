<script lang="ts">
	import type { TriggerProps } from "../index.js";
	import { useCollapsibleTrigger } from "../collapsible.svelte.js";
	import { mergeProps } from "$lib/internal/mergeProps.js";
	import { useId } from "$lib/internal/useId.svelte.js";
	import { box } from "svelte-toolbelt";

	let {
		asChild,
		children,
		child,
		ref = $bindable(null),
		id = useId(),
		...restProps
	}: TriggerProps = $props();

	const triggerState = useCollapsibleTrigger({
		id: box.with(() => id),
		ref: box.with(
			() => ref,
			(v) => (ref = v)
		),
	});
	const mergedProps = $derived(mergeProps(restProps, triggerState.props));
</script>

{#if asChild}
	{@render child?.({ props: mergedProps })}
{:else}
	<button bind:this={ref} {...mergedProps}>
		{@render children?.()}
	</button>
{/if}
