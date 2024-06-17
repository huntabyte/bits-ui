<script lang="ts">
	import type { CloseProps } from "../index.js";
	import { usePopoverClose } from "../popover.svelte.js";
	import { mergeProps } from "$lib/internal/mergeProps.js";
	import { useId } from "$lib/internal/useId.svelte.js";
	import { box } from "svelte-toolbelt";

	let {
		asChild,
		child,
		children,
		id = useId(),
		ref = $bindable(null),
		...restProps
	}: CloseProps = $props();

	const closeState = usePopoverClose({
		id: box.with(() => id),
		ref: box.with(
			() => ref,
			(v) => (ref = v)
		),
	});
	const mergedProps = $derived(mergeProps(restProps, closeState.props));
</script>

{#if asChild}
	{@render child?.({ props: mergedProps })}
{:else}
	<button {...mergedProps}>
		{@render children?.()}
	</button>
{/if}
