<script lang="ts">
	import { boxWith, mergeProps } from "svelte-toolbelt";
	import type { ComboboxChipRemoveButtonProps } from "../types.js";
	import { useId } from "$lib/internal/use-id.js";
	import { SelectComboChipRemoveState } from "$lib/bits/select/select.svelte.js";

	let {
		id = useId(),
		ref = $bindable(null),
		child,
		children,
		...restProps
	}: ComboboxChipRemoveButtonProps = $props();

	const removeState = SelectComboChipRemoveState.create({
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
