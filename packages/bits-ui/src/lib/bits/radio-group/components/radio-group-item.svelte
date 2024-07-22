<script lang="ts">
	import { box } from "svelte-toolbelt";
	import type { ItemProps } from "../index.js";
	import { useRadioGroupItem } from "../radio-group.svelte.js";
	import { mergeProps, useId } from "$lib/internal/index.js";

	let {
		id = useId(),
		children,
		child,
		value,
		disabled = false,
		ref = $bindable(null),
		...restProps
	}: ItemProps = $props();

	const itemState = useRadioGroupItem({
		value: box.with(() => value),
		disabled: box.with(() => disabled),
		id: box.with(() => id),
		ref: box.with(
			() => ref,
			(v) => (ref = v)
		),
	});

	const mergedProps = $derived(mergeProps(restProps, itemState.props));
</script>

{#if child}
	{@render child({ props: mergedProps, checked: itemState.checked })}
{:else}
	<button {...mergedProps}>
		{@render children?.({ checked: itemState.checked })}
	</button>
{/if}
