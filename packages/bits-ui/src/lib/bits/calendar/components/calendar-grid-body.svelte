<script lang="ts">
	import { box, mergeProps } from "svelte-toolbelt";
	import type { CalendarGridBodyProps } from "../types.js";
	import { CalendarGridBodyState } from "../calendar.svelte.js";
	import { createId } from "$lib/internal/create-id.js";

	const uid = $props.id();

	let {
		children,
		child,
		ref = $bindable(null),
		id = createId(uid),
		...restProps
	}: CalendarGridBodyProps = $props();

	const gridBodyState = CalendarGridBodyState.create({
		id: box.with(() => id),
		ref: box.with(
			() => ref,
			(v) => (ref = v)
		),
	});

	const mergedProps = $derived(mergeProps(restProps, gridBodyState.props));
</script>

{#if child}
	{@render child({ props: mergedProps })}
{:else}
	<tbody {...mergedProps}>
		{@render children?.()}
	</tbody>
{/if}
