<script lang="ts">
	import { box } from "svelte-toolbelt";
	import type { RadioItemProps } from "../index.js";
	import { useMenuRadioItem } from "../menu.svelte.js";
	import { useId } from "$lib/internal/useId.svelte.js";
	import { noop } from "$lib/internal/callbacks.js";
	import { mergeProps } from "$lib/internal/mergeProps.js";

	let {
		asChild,
		children,
		child,
		ref = $bindable(null),
		value,
		onSelect = noop,
		id = useId(),
		disabled = false,
		...restProps
	}: RadioItemProps = $props();

	const radioItemState = useMenuRadioItem({
		value: box.with(() => value),
		id: box.with(() => id),
		disabled: box.with(() => disabled),
		onSelect: box.with(() => handleSelect),
		ref: box.with(
			() => ref,
			(v) => (ref = v)
		),
	});

	function handleSelect(e: Event) {
		onSelect(e);
		if (e.defaultPrevented) return;
		radioItemState.selectValue();
	}

	const mergedProps = $derived(mergeProps(restProps, radioItemState.props));
</script>

{#if asChild}
	{@render child?.({ props: mergedProps })}
{:else}
	<div {...mergedProps} bind:this={ref}>
		{@render children?.({ checked: radioItemState.isChecked })}
	</div>
{/if}
