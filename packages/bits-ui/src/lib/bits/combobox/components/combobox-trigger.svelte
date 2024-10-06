<script lang="ts">
	import { box, mergeProps } from "svelte-toolbelt";
	import type { ComboboxTriggerProps } from "../types.js";
	import { useId } from "$lib/internal/use-id.js";
	import { useListboxComboTrigger } from "$lib/bits/listbox/listbox.svelte.js";

	let {
		id = useId(),
		ref = $bindable(null),
		child,
		children,
		...restProps
	}: ComboboxTriggerProps = $props();

	const triggerState = useListboxComboTrigger({
		id: box.with(() => id),
		ref: box.with(
			() => ref,
			(v) => (ref = v)
		),
	});

	const mergedProps = $derived(mergeProps(restProps, triggerState.props));
</script>

{#if child}
	{@render child({ props: mergedProps })}
{:else}
	<button {...mergedProps}>
		{@render children?.()}
	</button>
{/if}
