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
		children,
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
	{@render child({ props: mergedProps, ...valueState.snippetProps })}
{:else}
	<span {...mergedProps}>
		{#if children}
			{@render children?.(valueState.snippetProps)}
		{:else if valueState.snippetProps.selection.type === "single"}
			{valueState.snippetProps.selection.selected?.label ?? placeholder}
		{:else if valueState.snippetProps.selection.type === "multiple" && valueState.snippetProps.selection.selected}
			{valueState.snippetProps.selection.selected.length > 0
				? valueState.snippetProps.selection.selected
						.map((selected) => selected.label)
						.join(", ")
				: placeholder}
		{:else}
			{placeholder}
		{/if}
	</span>
{/if}
