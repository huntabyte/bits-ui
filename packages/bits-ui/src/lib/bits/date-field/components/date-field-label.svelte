<script lang="ts">
	import { useId } from "$lib/internal/useId.svelte.js";
	import { box } from "svelte-toolbelt";
	import { useDateFieldLabel } from "../date-field.svelte.js";
	import type { LabelProps } from "../index.js";
	import { mergeProps } from "$lib/internal/mergeProps.js";

	let {
		id = useId(),
		ref = $bindable(null),
		asChild,
		children,
		child,
		...restProps
	}: LabelProps = $props();

	const labelState = useDateFieldLabel({
		id: box.with(() => id),
		ref: box.with(
			() => ref,
			(v) => (ref = v)
		),
	});

	const mergedProps = $derived(mergeProps(restProps, labelState.props));
</script>

{#if asChild}
	{@render child?.({ props: mergedProps })}
{:else}
	<div {...mergedProps}>
		{@render children?.()}
	</div>
{/if}
