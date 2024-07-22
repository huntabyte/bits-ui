<script lang="ts">
	import { box } from "svelte-toolbelt";
	import { useDialogDescription } from "../dialog.svelte.js";
	import type { DescriptionProps } from "../index.js";
	import { mergeProps } from "$lib/internal/mergeProps.js";
	import { useId } from "$lib/internal/useId.js";

	let {
		id = useId(),
		children,
		child,
		ref = $bindable(null),
		...restProps
	}: DescriptionProps = $props();

	const descriptionState = useDialogDescription({
		id: box.with(() => id),
		ref: box.with(
			() => ref,
			(v) => (ref = v)
		),
	});

	const mergedProps = $derived(mergeProps(restProps, descriptionState.props));
</script>

{#if child}
	{@render child?.({ props: mergedProps })}
{:else}
	<div {...mergedProps}>
		{@render children?.()}
	</div>
{/if}
