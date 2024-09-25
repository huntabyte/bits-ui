<script lang="ts">
	import { box } from "svelte-toolbelt";
	import type { ActionProps } from "../index.js";
	import { mergeProps } from "$lib/internal/mergeProps.js";
	import { useId } from "$lib/internal/useId.js";
	import { useDialogClose } from "$lib/bits/dialog/dialog.svelte.js";

	let {
		children,
		child,
		id = useId(),
		ref = $bindable(null),
		...restProps
	}: ActionProps = $props();

	const closeState = useDialogClose({
		variant: box.with(() => "action"),
		id: box.with(() => id),
		ref: box.with(
			() => ref,
			(v) => (ref = v)
		),
	});

	const mergedProps = $derived(mergeProps(restProps, closeState.props));
</script>

{#if child}
	{@render child({ props: mergedProps })}
{:else}
	<button {...mergedProps}>
		{@render children?.()}
	</button>
{/if}
