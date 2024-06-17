<script lang="ts">
	import { box } from "svelte-toolbelt";
	import type { TriggerProps } from "../index.js";
	import { useTabsTrigger } from "../tabs.svelte.js";
	import { mergeProps } from "$lib/internal/mergeProps.js";
	import { useId } from "$lib/internal/useId.svelte.js";

	let {
		asChild,
		child,
		children,
		disabled = false,
		id = useId(),
		type = "button",
		value,
		ref = $bindable(null),
		...restProps
	}: TriggerProps = $props();

	const triggerState = useTabsTrigger({
		id: box.with(() => id),
		disabled: box.with(() => disabled),
		value: box.with(() => value),
		ref: box.with(
			() => ref,
			(v) => (ref = v)
		),
	});

	const mergedProps = $derived(mergeProps(restProps, triggerState.props, { type }));
</script>

{#if asChild}
	{@render child?.({ props: mergedProps })}
{:else}
	<button {...mergedProps}>
		{@render children?.()}
	</button>
{/if}
