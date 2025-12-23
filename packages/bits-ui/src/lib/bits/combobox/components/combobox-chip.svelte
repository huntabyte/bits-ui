<script lang="ts">
	import { boxWith, mergeProps } from "svelte-toolbelt";
	import type { ComboboxChipProps } from "../types.js";
	import { useId } from "$lib/internal/use-id.js";
	import { ComboboxChipState } from "$lib/bits/select/select.svelte.js";

	let {
		id = useId(),
		ref = $bindable(null),
		value,
		disabled = false,
		child,
		children,
		...restProps
	}: ComboboxChipProps = $props();

	const chipState = ComboboxChipState.create({
		id: boxWith(() => id),
		ref: boxWith(
			() => ref,
			(v) => (ref = v)
		),
		value: boxWith(() => value),
		disabled: boxWith(() => disabled),
	});

	const mergedProps = $derived(mergeProps(restProps, chipState.props));
</script>

{#if child}
	{@render child({ props: mergedProps, ...chipState.snippetProps })}
{:else}
	<div {...mergedProps}>
		{@render children?.(chipState.snippetProps)}
	</div>
{/if}
