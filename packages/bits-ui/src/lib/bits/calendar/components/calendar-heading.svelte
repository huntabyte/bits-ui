<script lang="ts">
	import { box, mergeProps } from "svelte-toolbelt";
	import type { CalendarHeadingProps } from "../types.js";
	import { CalendarHeadingState } from "../calendar.svelte.js";
	import { createId } from "$lib/internal/create-id.js";

	const uid = $props.id();

	let {
		children,
		child,
		ref = $bindable(null),
		id = createId(uid),
		...restProps
	}: CalendarHeadingProps = $props();

	const headingState = CalendarHeadingState.create({
		id: box.with(() => id),
		ref: box.with(
			() => ref,
			(v) => (ref = v)
		),
	});

	const mergedProps = $derived(mergeProps(restProps, headingState.props));
</script>

{#if child}
	{@render child({ props: mergedProps, headingValue: headingState.root.headingValue })}
{:else}
	<div {...mergedProps}>
		{#if children}
			{@render children?.({ headingValue: headingState.root.headingValue })}
		{:else}
			{headingState.root.headingValue}
		{/if}
	</div>
{/if}
