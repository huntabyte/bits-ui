<script lang="ts">
	import { box } from "svelte-toolbelt";
	import type { MenuCheckboxItemProps } from "../types.js";
	import { useMenuCheckboxItem } from "../menu.svelte.js";
	import { useId } from "$lib/internal/useId.js";
	import { mergeProps } from "$lib/internal/mergeProps.js";
	import { noop } from "$lib/internal/callbacks.js";

	let {
		child,
		children,
		ref = $bindable(null),
		checked = $bindable(false),
		id = useId(),
		onCheckedChange = noop,
		disabled = false,
		onSelect = noop,
		controlledChecked = false,
		...restProps
	}: MenuCheckboxItemProps = $props();

	const checkboxItemState = useMenuCheckboxItem({
		checked: box.with(
			() => checked,
			(v) => {
				if (controlledChecked) {
					onCheckedChange(v);
				} else {
					checked = v;
					onCheckedChange(v);
				}
			}
		),
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
		checkboxItemState.toggleChecked();
	}

	const mergedProps = $derived(mergeProps(restProps, checkboxItemState.props));
</script>

{#if child}
	{@render child({ props: mergedProps, checked })}
{:else}
	<div {...mergedProps}>
		{@render children?.({ checked })}
	</div>
{/if}
