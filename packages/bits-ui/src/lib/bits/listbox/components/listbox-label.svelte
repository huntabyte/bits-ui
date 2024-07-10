<script lang="ts">
	import { useId } from "$lib/internal/useId.svelte.js";
	import { box } from "svelte-toolbelt";
	import type { LabelProps } from "../index.js";
	import { useListboxLabel } from "../listbox.svelte.js";
	import { mergeProps } from "$lib/internal/mergeProps.js";

	let {
		asChild,
		children,
		child,
		ref = $bindable(null),
		id = useId(),
		...restProps
	}: LabelProps = $props();

	const labelState = useListboxLabel({
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
