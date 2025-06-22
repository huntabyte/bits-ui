<script lang="ts">
	import { box, mergeProps } from "svelte-toolbelt";
	import { CalendarNextButtonState } from "../calendar.svelte.js";
	import type { CalendarNextButtonProps } from "../types.js";
	import { createId } from "$lib/internal/create-id.js";

	const uid = $props.id();

	let {
		children,
		child,
		id = createId(uid),
		ref = $bindable(null),
		// for safari
		tabindex = 0,
		...restProps
	}: CalendarNextButtonProps = $props();

	const nextButtonState = CalendarNextButtonState.create({
		id: box.with(() => id),
		ref: box.with(
			() => ref,
			(v) => (ref = v)
		),
	});

	const mergedProps = $derived(mergeProps(restProps, nextButtonState.props, { tabindex }));
</script>

{#if child}
	{@render child({ props: mergedProps })}
{:else}
	<button {...mergedProps}>
		{@render children?.()}
	</button>
{/if}
