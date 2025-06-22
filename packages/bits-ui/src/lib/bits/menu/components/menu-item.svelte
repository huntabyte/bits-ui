<script lang="ts">
	import { box, mergeProps } from "svelte-toolbelt";
	import type { MenuItemProps } from "../types.js";
	import { MenuItemState } from "../menu.svelte.js";
	import { createId } from "$lib/internal/create-id.js";
	import { noop } from "$lib/internal/noop.js";

	const uid = $props.id();

	let {
		child,
		children,
		ref = $bindable(null),
		id = createId(uid),
		disabled = false,
		onSelect = noop,
		closeOnSelect = true,
		...restProps
	}: MenuItemProps = $props();

	const itemState = MenuItemState.create({
		id: box.with(() => id),
		disabled: box.with(() => disabled),
		onSelect: box.with(() => onSelect),
		ref: box.with(
			() => ref,
			(v) => (ref = v)
		),
		closeOnSelect: box.with(() => closeOnSelect),
	});

	const mergedProps = $derived(mergeProps(restProps, itemState.props));
</script>

{#if child}
	{@render child({ props: mergedProps })}
{:else}
	<div {...mergedProps}>
		{@render children?.()}
	</div>
{/if}
