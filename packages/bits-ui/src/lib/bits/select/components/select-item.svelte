<script lang="ts">
	import { boxWith, mergeProps } from "svelte-toolbelt";
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
		id: boxWith(() => id),
		ref: boxWith(
			() => ref,
			(v) => (ref = v)
		),
		value: boxWith(() => value),
		disabled: boxWith(() => disabled),
		label: boxWith(() => label),
		onHighlight: boxWith(() => onHighlight),
		onUnhighlight: boxWith(() => onUnhighlight),
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
