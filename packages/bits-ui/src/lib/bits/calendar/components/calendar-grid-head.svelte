<script lang="ts">
	import { useId } from "$lib/internal/useId.svelte.js";
	import { box } from "svelte-toolbelt";
	import { useCalendarGridHead } from "../calendar.svelte.js";
	import type { GridHeadProps } from "../index.js";
	import { mergeProps } from "$lib/internal/mergeProps.js";

	let {
		asChild,
		children,
		child,
		ref = $bindable(null),
		id = useId(),
		...restProps
	}: GridHeadProps = $props();

	const gridHeadState = useCalendarGridHead({
		id: box.with(() => id),
		ref: box.with(
			() => ref,
			(v) => (ref = v)
		),
	});

	const mergedProps = $derived(mergeProps(restProps, gridHeadState.props));
</script>

{#if asChild}
	{@render child?.({ props: mergedProps })}
{:else}
	<thead {...mergedProps}>
		{@render children?.()}
	</thead>
{/if}
