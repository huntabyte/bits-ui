<script lang="ts">
	import { box } from "svelte-toolbelt";
	import { useDialogTitle } from "../dialog.svelte.js";
	import type { TitleProps } from "../index.js";
	import { mergeProps } from "$lib/internal/mergeProps.js";
	import { useId } from "$lib/internal/useId.svelte.js";

	let {
		id = useId(),
		ref = $bindable(null),
		asChild,
		child,
		children,
		level = 2,
		...restProps
	}: TitleProps = $props();

	const titleState = useDialogTitle({
		id: box.with(() => id),
		level: box.with(() => level),
		ref: box.with(
			() => ref,
			(v) => (ref = v)
		),
	});

	const mergedProps = $derived(mergeProps(restProps, titleState.props));
</script>

{#if asChild}
	{@render child?.({ props: mergedProps })}
{:else}
	<div {...mergedProps}>
		{@render children?.()}
	</div>
{/if}
