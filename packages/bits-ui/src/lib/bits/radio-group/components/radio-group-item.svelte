<script lang="ts">
	import { boxWith, mergeProps } from "svelte-toolbelt";
	import type { RadioGroupItemProps } from "../types.js";
	import { RadioGroupItemState } from "../radio-group.svelte.js";
	import { createId } from "$lib/internal/create-id.js";

	const uid = $props.id();

	let {
		id = createId(uid),
		children,
		child,
		value,
		disabled = false,
		ref = $bindable(null),
		...restProps
	}: RadioGroupItemProps = $props();

	const itemState = RadioGroupItemState.create({
		value: boxWith(() => value),
		disabled: boxWith(() => disabled ?? false),
		id: boxWith(() => id),
		ref: boxWith(
			() => ref,
			(v) => (ref = v)
		),
	});

	const mergedProps = $derived(mergeProps(restProps, itemState.props));
</script>

{#if child}
	{@render child({ props: mergedProps, ...itemState.snippetProps })}
{:else}
	<button {...mergedProps}>
		{@render children?.(itemState.snippetProps)}
	</button>
{/if}
