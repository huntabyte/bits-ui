<script lang="ts">
	import { box } from "svelte-toolbelt";
	import type { PrevButtonProps } from "../index.js";
	import { usePaginationButton } from "../pagination.svelte.js";
	import { mergeProps, useId } from "$lib/internal/index.js";

	let {
		id = useId(),
		child,
		children,
		ref = $bindable(null),
		type = "button",
		...restProps
	}: PrevButtonProps = $props();

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
