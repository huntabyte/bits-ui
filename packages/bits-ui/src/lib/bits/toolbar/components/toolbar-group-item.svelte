<script lang="ts">
	import { box, mergeProps } from "svelte-toolbelt";
	import type { ToolbarGroupItemProps } from "../types.js";
	import { ToolbarGroupItemState } from "../toolbar.svelte.js";
	import { createId } from "$lib/internal/create-id.js";

	const uid = $props.id();

	let {
		child,
		children,
		value,
		disabled = false,
		type = "button",
		id = createId(uid),
		ref = $bindable(null),
		...restProps
	}: ToolbarGroupItemProps = $props();

	const groupItemState = ToolbarGroupItemState.create({
		id: box.with(() => id),
		value: box.with(() => value),
		disabled: box.with(() => disabled ?? false),
		ref: box.with(
			() => ref,
			(v) => (ref = v)
		),
	});

	const mergedProps = $derived(mergeProps(restProps, groupItemState.props, { type }));
</script>

{#if child}
	{@render child({ props: mergedProps, pressed: groupItemState.isPressed })}
{:else}
	<button {...mergedProps}>
		{@render children?.({ pressed: groupItemState.isPressed })}
	</button>
{/if}
