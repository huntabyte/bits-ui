<script lang="ts">
	import { useId } from "$lib/internal/useId.svelte.js";
	import { box } from "svelte-toolbelt";
	import { useCalendarHeader } from "../calendar.svelte.js";
	import type { HeaderProps } from "../index.js";
	import { mergeProps } from "$lib/internal/mergeProps.js";

	let {
		asChild,
		children,
		child,
		ref = $bindable(null),
		id = useId(),
		...restProps
	}: HeaderProps = $props();

	const headerState = useCalendarHeader({
		id: box.with(() => id),
		ref: box.with(
			() => ref,
			(v) => (ref = v)
		),
	});

	const mergedProps = $derived(mergeProps(restProps, headerState.props));
</script>

{#if asChild}
	{@render child?.({ props: mergedProps })}
{:else}
	<header {...mergedProps}>
		{@render children?.()}
	</header>
{/if}
