<script lang="ts">
	import { useId } from "$lib/internal/useId.svelte.js";
	import { box } from "svelte-toolbelt";
	import type { HeadingProps } from "../index.js";
	import { useCalendarHeading } from "../calendar.svelte.js";
	import { mergeProps } from "$lib/internal/mergeProps.js";

	let {
		asChild,
		children,
		child,
		ref = $bindable(null),
		id = useId(),
		...restProps
	}: HeadingProps = $props();

	const headingState = useCalendarHeading({
		id: box.with(() => id),
		ref: box.with(
			() => ref,
			(v) => (ref = v)
		),
	});

	const mergedProps = $derived(mergeProps(restProps, headingState.props));
</script>

{#if asChild}
	{@render child?.({ props: mergedProps, headingValue: headingState.headingValue })}
{:else}
	<div {...mergedProps}>
		{#if children}
			{@render children?.({ headingValue: headingState.headingValue })}
		{:else}
			{headingState.headingValue}
		{/if}
	</div>
{/if}
