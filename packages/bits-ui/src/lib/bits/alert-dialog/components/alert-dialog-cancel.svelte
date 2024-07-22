<script lang="ts">
	import { box } from "svelte-toolbelt";
	import type { CancelProps } from "../index.js";
	import { useAlertDialogCancel } from "$lib/bits/dialog/dialog.svelte.js";
	import { useId } from "$lib/internal/useId.js";
	import { mergeProps } from "$lib/internal/mergeProps.js";

	let {
		id = useId(),
		ref = $bindable(null),
		children,
		child,
		...restProps
	}: CancelProps = $props();

	const cancelState = useAlertDialogCancel({
		id: box.with(() => id),
		ref: box.with(
			() => ref,
			(v) => (ref = v)
		),
	});

	const mergedProps = $derived(mergeProps(restProps, cancelState.props));
</script>

{#if child}
	{@render child({ props: mergedProps })}
{:else}
	<button {...mergedProps}>
		{@render children?.()}
	</button>
{/if}
