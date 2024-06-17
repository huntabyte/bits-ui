<script lang="ts">
	import { box } from "svelte-toolbelt";
	import type { NextButtonProps } from "../index.js";
	import { usePaginationButton } from "../pagination.svelte.js";
	import { mergeProps, useId } from "$lib/internal/index.js";

	let {
		id = useId(),
		asChild,
		child,
		children,
		ref = $bindable(null),
		type = "button",
		...restProps
	}: NextButtonProps = $props();

	const nextButtonState = usePaginationButton({
		type: "next",
		id: box.with(() => id),
		ref: box.with(
			() => ref,
			(v) => (ref = v)
		),
	});

	const mergedProps = $derived(mergeProps(restProps, nextButtonState.props, { type }));
</script>

{#if asChild}
	{@render child?.({ props: mergedProps })}
{:else}
	<button {...mergedProps}>
		{@render children?.()}
	</button>
{/if}
