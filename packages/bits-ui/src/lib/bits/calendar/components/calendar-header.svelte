<script lang="ts">
	import { box, mergeProps } from "svelte-toolbelt";
	import { CalendarHeaderState } from "../calendar.svelte.js";
	import type { CalendarHeaderProps } from "../types.js";
	import { createId } from "$lib/internal/create-id.js";

	const uid = $props.id();

	let {
		children,
		child,
		ref = $bindable(null),
		id = createId(uid),
		...restProps
	}: CalendarHeaderProps = $props();

	const headerState = CalendarHeaderState.create({
		id: box.with(() => id),
		ref: box.with(
			() => ref,
			(v) => (ref = v)
		),
	});

	const mergedProps = $derived(mergeProps(restProps, headerState.props));
</script>

{#if child}
	{@render child({ props: mergedProps })}
{:else}
	<header {...mergedProps}>
		{@render children?.()}
	</header>
{/if}
