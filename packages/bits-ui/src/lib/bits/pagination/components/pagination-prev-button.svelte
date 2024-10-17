<script lang="ts">
	import { box, mergeProps } from "svelte-toolbelt";
	import type { PaginationPrevButtonProps } from "../types.js";
	import { usePaginationButton } from "../pagination.svelte.js";
	import { useId } from "$lib/internal/use-id.js";

	let {
		id = useId(),
		child,
		children,
		ref = $bindable(null),
		type = "button",
		...restProps
	}: PaginationPrevButtonProps = $props();

	const prevButtonState = usePaginationButton({
		type: "prev",
		id: box.with(() => id),
		ref: box.with(
			() => ref,
			(v) => (ref = v)
		),
	});

	const mergedProps = $derived(mergeProps(restProps, prevButtonState.props, { type }));
</script>

{#if child}
	{@render child({ props: mergedProps })}
{:else}
	<button {...mergedProps}>
		{@render children?.()}
	</button>
{/if}
