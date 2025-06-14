<script lang="ts">
	import { box, mergeProps } from "svelte-toolbelt";
	import type { MenuCheckboxItemProps } from "../types.js";
	import { MenuCheckboxGroupContext, MenuCheckboxItemState } from "../menu.svelte.js";
	import { createId } from "$lib/internal/create-id.js";
	import { noop } from "$lib/internal/noop.js";
	import { watch } from "runed";

	const uid = $props.id();

	let {
		child,
		children,
		ref = $bindable(null),
		checked = $bindable(false),
		id = createId(uid),
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

	const checkboxItemState = MenuCheckboxItemState.create(
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
	{@render child({ checked, indeterminate, props: mergedProps })}
{:else}
	<div {...mergedProps}>
		{@render children?.({ checked, indeterminate })}
	</div>
{/if}
