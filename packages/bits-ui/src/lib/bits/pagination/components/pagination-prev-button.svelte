<script lang="ts">
	import type { PrevButtonProps } from "../index.js";
	import { setPaginationButtonState } from "../pagination.svelte.js";
	import { mergeProps, readonlyBox, useId } from "$lib/internal/index.js";

	let {
		id = useId(),
		asChild,
		child,
		children,
		el = $bindable(),
		type = "button",
		...restProps
	}: PrevButtonProps = $props();

	const state = setPaginationButtonState({
		type: "prev",
		id: readonlyBox(() => id),
	});

	const mergedProps = $derived(mergeProps(restProps, state.props, { type }));
</script>

{#if asChild}
	{@render child?.({ props: mergedProps })}
{:else}
	<button bind:this={el} {...mergedProps}>
		{@render children?.()}
	</button>
{/if}
