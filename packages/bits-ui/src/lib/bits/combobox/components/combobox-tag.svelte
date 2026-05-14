<script lang="ts">
	import { boxWith, mergeProps } from "svelte-toolbelt";
	import type { ComboboxTagProps } from "../types.js";
	import { useId } from "$lib/internal/use-id.js";
	import { SelectComboTagState } from "$lib/bits/select/select.svelte.js";

	let {
		id = useId(),
		ref = $bindable(null),
		child,
		children,
		value,
		...restProps
	}: ComboboxTagProps = $props();

	const tagState = SelectComboTagState.create({
		id: boxWith(() => id),
		ref: boxWith(
			() => ref,
			(v) => (ref = v)
		),
		value: boxWith(() => value),
	});

	const mergedProps = $derived(mergeProps(restProps, tagState.props));
</script>

{#if child}
	{@render child({ props: mergedProps, ...tagState.snippetProps })}
{:else}
	<div {...mergedProps}>
		{@render children?.(tagState.snippetProps)}
	</div>
{/if}
