<script lang="ts">
	import { box, mergeProps } from "svelte-toolbelt";
	import type { ToggleGroupItemProps } from "../types.js";
	import { ToggleGroupItemState } from "../toggle-group.svelte.js";
	import { createId } from "$lib/internal/create-id.js";

	const uid = $props.id();

	let {
		children,
		child,
		ref = $bindable(null),
		value,
		disabled = false,
		id = createId(uid),
		type = "button",
		...restProps
	}: ToggleGroupItemProps = $props();

	const itemState = ToggleGroupItemState.create({
		id: box.with(() => id),
		value: box.with(() => value),
		disabled: box.with(() => disabled ?? false),
		ref: box.with(
			() => ref,
			(v) => (ref = v)
		),
	});

	const mergedProps = $derived(mergeProps(restProps, itemState.props, { type }));
</script>

{#if child}
	{@render child({ props: mergedProps, ...itemState.snippetProps })}
{:else}
	<button {...mergedProps}>
		{@render children?.(itemState.snippetProps)}
	</button>
{/if}
