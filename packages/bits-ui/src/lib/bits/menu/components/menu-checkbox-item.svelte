<script lang="ts">
	import { box, mergeProps } from "svelte-toolbelt";
	import type { MenuCheckboxItemProps } from "../types.js";
	import { useMenuCheckboxItem } from "../menu.svelte.js";
	import { useId } from "$lib/internal/use-id.js";
	import { noop } from "$lib/internal/noop.js";

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
		closeOnSelect = true,
		indeterminate = $bindable(false),
		controlledIndeterminate = false,
		onIndeterminateChange = noop,
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
		closeOnSelect: box.with(() => closeOnSelect),
		indeterminate: box.with(
			() => indeterminate,
			(v) => {
				if (controlledIndeterminate) {
					onIndeterminateChange(v);
				} else {
					indeterminate = v;
					onIndeterminateChange(v);
				}
			}
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
	{@render child({ props: mergedProps, ...checkboxItemState.snippetProps })}
{:else}
	<div {...mergedProps}>
		{@render children?.(checkboxItemState.snippetProps)}
	</div>
{/if}
