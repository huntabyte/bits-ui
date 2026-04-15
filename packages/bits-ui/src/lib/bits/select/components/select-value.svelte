<script lang="ts">
	import { boxWith, mergeProps } from "svelte-toolbelt";
	import { SelectValueState } from "../select.svelte.js";
	import type { SelectValueProps } from "../types.js";
	import { createId } from "$lib/internal/create-id.js";

	const uid = $props.id();

	let {
		ref = $bindable(null),
		id = createId(uid),
		placeholder,
		child,
		...restProps
	}: SelectValueProps = $props();

	const valueState = SelectValueState.create({
		id: boxWith(() => id),
		ref: boxWith(
			() => ref,
			(v) => (ref = v)
		),
		placeholder: boxWith(() => placeholder),
	});

	const mergedProps = $derived(mergeProps(restProps, valueState.props));
</script>

{#if child}
	{@render child({ ...mergedProps, ...valueState.snippetProps })}
{:else}
	<span {...mergedProps}>
		{#if valueState.snippetProps.type === "single"}
			{valueState.snippetProps.selected?.label ?? placeholder}
		{:else if valueState.snippetProps.selected}
			{valueState.snippetProps.selected.map((selected) => selected.label).join(", ")}
		{:else}
			{placeholder}
		{/if}
	</span>
{/if}
