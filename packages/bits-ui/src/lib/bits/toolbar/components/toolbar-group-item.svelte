<script lang="ts">
	import { boxWith, mergeProps } from "svelte-toolbelt";
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
		id: boxWith(() => id),
		value: boxWith(() => value),
		disabled: boxWith(() => disabled ?? false),
		ref: boxWith(
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
