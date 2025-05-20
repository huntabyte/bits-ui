<script lang="ts">
	import { box, mergeProps } from "svelte-toolbelt";
	import type { ComboboxTriggerProps } from "../types.js";
	import { useSelectComboTrigger } from "$lib/bits/select/select.svelte.js";
	import { createId } from "$lib/internal/create-id.js";

	const uid = $props.id();

	let {
		id = createId(uid),
		ref = $bindable(null),
		child,
		children,
		type = "button",
		...restProps
	}: ComboboxTriggerProps = $props();

	const triggerState = useSelectComboTrigger({
		id: box.with(() => id),
		ref: box.with(
			() => ref,
			(v) => (ref = v)
		),
	});

	const mergedProps = $derived(mergeProps(restProps, triggerState.props, { type }));
</script>

{#if child}
	{@render child({ props: mergedProps })}
{:else}
	<button {...mergedProps}>
		{@render children?.()}
	</button>
{/if}
