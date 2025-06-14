<script lang="ts">
	import { box, mergeProps } from "svelte-toolbelt";
	import type { MenuRadioItemProps } from "../types.js";
	import { MenuRadioItemState } from "../menu.svelte.js";
	import { createId } from "$lib/internal/create-id.js";
	import { noop } from "$lib/internal/noop.js";

	const uid = $props.id();

	let {
		children,
		child,
		ref = $bindable(null),
		value,
		onSelect = noop,
		id = createId(uid),
		disabled = false,
		closeOnSelect = true,
		...restProps
	}: MenuRadioItemProps = $props();

	const radioItemState = MenuRadioItemState.create({
		value: box.with(() => value),
		id: box.with(() => id),
		disabled: box.with(() => disabled),
		onSelect: box.with(() => handleSelect),
		ref: box.with(
			() => ref,
			(v) => (ref = v)
		),
		closeOnSelect: box.with(() => closeOnSelect),
	});

	function handleSelect(e: Event) {
		onSelect(e);
		if (e.defaultPrevented) return;
		radioItemState.selectValue();
	}

	const mergedProps = $derived(mergeProps(restProps, radioItemState.props));
</script>

{#if child}
	{@render child({ props: mergedProps, checked: radioItemState.isChecked })}
{:else}
	<div {...mergedProps}>
		{@render children?.({ checked: radioItemState.isChecked })}
	</div>
{/if}
