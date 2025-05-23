<script lang="ts">
	import { box, mergeProps } from "svelte-toolbelt";
	import type { MenuCheckboxItemProps } from "../types.js";
	import { MenuCheckboxGroupContext, useMenuCheckboxItem } from "../menu.svelte.js";
	import { useId } from "$lib/internal/use-id.js";
	import { noop } from "$lib/internal/noop.js";
	import { watch } from "runed";

	let {
		child,
		children,
		ref = $bindable(null),
		checked = $bindable(false),
		id = useId(),
		onCheckedChange = noop,
		disabled = false,
		onSelect = noop,
		closeOnSelect = true,
		indeterminate = $bindable(false),
		onIndeterminateChange = noop,
		value = "",
		...restProps
	}: MenuCheckboxItemProps = $props();

	const group = MenuCheckboxGroupContext.getOr(null);

	if (group && value) {
		if (group.opts.value.current.includes(value)) {
			checked = true;
		} else {
			checked = false;
		}
	}

	watch.pre(
		() => value,
		() => {
			if (group && value) {
				if (group.opts.value.current.includes(value)) {
					checked = true;
				} else {
					checked = false;
				}
			}
		}
	);

	const checkboxItemState = useMenuCheckboxItem(
		{
			checked: box.with(
				() => checked,
				(v) => {
					checked = v;
					onCheckedChange(v);
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
					indeterminate = v;
					onIndeterminateChange(v);
				}
			),
			value: box.with(() => value),
		},
		group
	);

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
