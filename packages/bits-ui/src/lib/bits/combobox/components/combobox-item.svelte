<script lang="ts">
	import { box } from "svelte-toolbelt";
	import { useComboboxItem } from "../combobox.svelte.js";
	import type { ItemProps } from "../index.js";
	import { useId } from "$lib/internal/useId.svelte.js";
	import { mergeProps } from "$lib/internal/mergeProps.js";

	let {
		id = useId(),
		ref = $bindable(null),
		value,
		label = value,
		disabled = false,
		children,
		child,
		...restProps
	}: ItemProps = $props();

	const itemState = useComboboxItem({
		id: box.with(() => id),
		ref: box.with(
			() => ref,
			(v) => (ref = v)
		),
		value: box.with(() => value),
		disabled: box.with(() => disabled),
		label: box.with(() => label),
	});

	const mergedProps = $derived(mergeProps(restProps, itemState.props));
</script>

{#if child}
	{@render child({ props: mergedProps, ...itemState.snippetProps })}
{:else}
	<div {...mergedProps}>
		{@render children?.(itemState.snippetProps)}
	</div>
{/if}
