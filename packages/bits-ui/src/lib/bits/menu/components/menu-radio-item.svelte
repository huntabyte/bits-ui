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
		el = $bindable(),
		value,
		onSelect = noop,
		id = useId(),
		disabled = false,
		...restProps
	}: RadioItemProps = $props();

	const state = useMenuRadioItem({
		value: box.with(() => value),
		id: box.with(() => id),
		disabled: box.with(() => disabled),
		onSelect: box.with(() => handleSelect),
	});

	function handleSelect(e: Event) {
		onSelect(e);
		if (e.defaultPrevented) return;
		state.selectValue();
	}

	const mergedProps = $derived(mergeProps(restProps, state.props));
</script>

{#if asChild}
	{@render child?.({ props: mergedProps })}
{:else}
	<div {...mergedProps} bind:this={el}>
		{@render children?.({ checked: state.isChecked })}
	</div>
{/if}
