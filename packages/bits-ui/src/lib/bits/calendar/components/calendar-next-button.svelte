<script lang="ts">
	import { box } from "svelte-toolbelt";
	import { useCalendarNextButton } from "../calendar.svelte.js";
	import type { NextButtonProps } from "../index.js";
	import { useId } from "$lib/internal/useId.js";
	import { mergeProps } from "$lib/internal/mergeProps.js";

	let {
		children,
		child,
		id = useId(),
		ref = $bindable(null),
		...restProps
	}: NextButtonProps = $props();

	const nextButtonState = useCalendarNextButton({
		id: box.with(() => id),
		ref: box.with(
			() => ref,
			(v) => (ref = v)
		),
	});

	const mergedProps = $derived(mergeProps(restProps, nextButtonState.props));
</script>

{#if child}
	{@render child({ props: mergedProps })}
{:else}
	<button {...mergedProps}>
		{@render children?.()}
	</button>
{/if}
