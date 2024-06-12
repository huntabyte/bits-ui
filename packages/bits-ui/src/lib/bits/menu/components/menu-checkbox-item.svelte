<script lang="ts">
	import { box } from "svelte-toolbelt";
	import type { CheckboxItemProps } from "../index.js";
	import { useMenuCheckboxItem } from "../menu.svelte.js";
	import { useId } from "$lib/internal/useId.svelte.js";
	import { mergeProps } from "$lib/internal/mergeProps.js";
	import { noop } from "$lib/internal/callbacks.js";

	let {
		asChild,
		child,
		children,
		ref = $bindable(),
		checked = $bindable(false),
		id = useId(),
		onCheckedChange = noop,
		disabled = false,
		onSelect = noop,
		...restProps
	}: CheckboxItemProps = $props();

	const checkboxItemState = useMenuCheckboxItem({
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

	function handleSelect(e: Event) {
		onSelect(e);
		if (e.defaultPrevented) return;
		checkboxItemState.toggleChecked();
	}

	const mergedProps = $derived(mergeProps(restProps, checkboxItemState.props));
</script>

{#if asChild}
	{@render child?.({ props: mergedProps })}
{:else}
	<div {...mergedProps} bind:this={ref}>
		{@render children?.({ checked })}
	</div>
{/if}
