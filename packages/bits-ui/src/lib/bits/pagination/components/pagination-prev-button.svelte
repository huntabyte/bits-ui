<script lang="ts">
	import { box } from "svelte-toolbelt";
	import type { PrevButtonProps } from "../index.js";
	import { usePaginationButton } from "../pagination.svelte.js";
	import { mergeProps, useId } from "$lib/internal/index.js";

	let {
		id = useId(),
		asChild,
		child,
		children,
		el = $bindable(),
		type = "button",
		...restProps
	}: PrevButtonProps = $props();

	const prevButtonState = usePaginationButton({
		type: "prev",
		id: box.with(() => id),
	});

	const mergedProps = $derived(mergeProps(restProps, prevButtonState.props, { type }));
</script>

{#if asChild}
	{@render child?.({ props: mergedProps })}
{:else}
	<button bind:this={el} {...mergedProps}>
		{@render children?.()}
	</button>
{/if}
