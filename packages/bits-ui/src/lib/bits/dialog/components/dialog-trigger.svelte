<script lang="ts">
	import { box } from "svelte-toolbelt";
	import { useDialogTrigger } from "../dialog.svelte.js";
	import type { TriggerProps } from "../index.js";
	import { mergeProps } from "$lib/internal/mergeProps.js";
	import { useId } from "$lib/internal/useId.svelte.js";

	let {
		id = useId(),
		ref = $bindable(null),
		asChild,
		children,
		child,
		...restProps
	}: TriggerProps = $props();

	const triggerState = useDialogTrigger({
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
	<button {...mergedProps}>
		{@render children?.()}
	</button>
{/if}
