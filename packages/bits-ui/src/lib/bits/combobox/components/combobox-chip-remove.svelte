<script lang="ts">
	import { boxWith, mergeProps } from "svelte-toolbelt";
	import type { ComboboxChipRemoveProps } from "../types.js";
	import { useId } from "$lib/internal/use-id.js";
	import { ComboboxChipRemoveState } from "$lib/bits/select/select.svelte.js";

	let {
		id = useId(),
		ref = $bindable(null),
		child,
		children,
		...restProps
	}: ComboboxChipRemoveProps = $props();

	const removeState = ComboboxChipRemoveState.create({
		id: boxWith(() => id),
		ref: boxWith(
			() => ref,
			(v) => (ref = v)
		),
	});

	const mergedProps = $derived(mergeProps(restProps, removeState.props));
</script>

{#if child}
	{@render child({ props: mergedProps })}
{:else}
	<button {...mergedProps}>
		{@render children?.()}
	</button>
{/if}
