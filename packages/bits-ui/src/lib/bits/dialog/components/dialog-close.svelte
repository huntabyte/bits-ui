<script lang="ts">
	import { box } from "svelte-toolbelt";
	import { useDialogClose } from "../dialog.svelte.js";
	import type { CloseProps } from "../index.js";
	import { mergeProps } from "$lib/internal/mergeProps.js";
	import { useId } from "$lib/internal/useId.js";

	let {
		children,
		child,
		id = useId(),
		ref = $bindable(null),
		...restProps
	}: CloseProps = $props();

	const closeState = useDialogClose({
		id: box.with(() => id),
		ref: box.with(
			() => ref,
			(v) => (ref = v)
		),
	});

	const mergedProps = $derived(mergeProps(restProps, closeState.props));
</script>

{#if child}
	{@render child?.({ props: mergedProps })}
{:else}
	<button {...mergedProps}>
		{@render children?.()}
	</button>
{/if}
