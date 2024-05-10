<script lang="ts">
	import { box } from "runed";
	import type { CheckboxItemProps } from "../index.js";
	import { useMenuCheckboxItem } from "../menu.svelte.js";
	import { useId } from "$lib/internal/useId.svelte.js";
	import { mergeProps } from "$lib/internal/mergeProps.js";
	import { noop } from "$lib/internal/callbacks.js";

	let {
		asChild,
		child,
		children,
		el = $bindable(),
		checked = $bindable(false),
		id = useId(),
		onCheckedChange = noop,
		disabled = false,
		onSelect = noop,
		...restProps
	}: CheckboxItemProps = $props();

	const state = useMenuCheckboxItem({
		checked: box.with(
			() => checked,
			(v) => {
				if (checked !== v) {
					checked = v;
					onCheckedChange(v);
				}
			}
		),
		id: box.with(() => id),
		disabled: box.with(() => disabled),
		onSelect: box.with(() => handleSelect),
	});

	function handleSelect() {
		onSelect();
		state.toggleChecked();
	}

	const mergedProps = $derived(mergeProps(restProps, state.props));
</script>

{#if asChild}
	{@render child?.({ props: mergedProps })}
{:else}
	<div {...mergedProps} bind:this={el}>
		{@render children?.({ checked })}
	</div>
{/if}
