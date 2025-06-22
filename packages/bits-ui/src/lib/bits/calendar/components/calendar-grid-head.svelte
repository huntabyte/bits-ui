<script lang="ts">
	import { box, mergeProps } from "svelte-toolbelt";
	import { CalendarGridHeadState } from "../calendar.svelte.js";
	import type { CalendarGridHeadProps } from "../types.js";
	import { createId } from "$lib/internal/create-id.js";

	const uid = $props.id();

	let {
		children,
		child,
		ref = $bindable(null),
		id = createId(uid),
		...restProps
	}: CalendarGridHeadProps = $props();

	const gridHeadState = CalendarGridHeadState.create({
		id: box.with(() => id),
		ref: box.with(
			() => ref,
			(v) => (ref = v)
		),
	});

	const mergedProps = $derived(mergeProps(restProps, gridHeadState.props));
</script>

{#if child}
	{@render child({ props: mergedProps })}
{:else}
	<thead {...mergedProps}>
		{@render children?.()}
	</thead>
{/if}
