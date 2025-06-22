<script lang="ts">
	import { box, mergeProps } from "svelte-toolbelt";
	import { SelectItemState } from "../select.svelte.js";
	import type { SelectItemProps } from "../types.js";
	import { createId } from "$lib/internal/create-id.js";
	import { noop } from "$lib/internal/noop.js";
	import Mounted from "$lib/bits/utilities/mounted.svelte";

	const uid = $props.id();

	let {
		id = createId(uid),
		ref = $bindable(null),
		value,
		label = value,
		disabled = false,
		children,
		child,
		onHighlight = noop,
		onUnhighlight = noop,
		...restProps
	}: SelectItemProps = $props();

	const itemState = SelectItemState.create({
		id: box.with(() => id),
		ref: box.with(
			() => ref,
			(v) => (ref = v)
		),
		value: box.with(() => value),
		disabled: box.with(() => disabled),
		label: box.with(() => label),
		onHighlight: box.with(() => onHighlight),
		onUnhighlight: box.with(() => onUnhighlight),
	});

	const mergedProps = $derived(mergeProps(restProps, itemState.props));
</script>

{#if child}
	{@render child({ props: mergedProps, ...itemState.snippetProps })}
{:else}
	<div {...mergedProps}>
		{@render children?.(itemState.snippetProps)}
	</div>
{/if}

<Mounted bind:mounted={itemState.mounted} />
