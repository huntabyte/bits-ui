<script lang="ts">
	import { type SelectListProps } from "../types.js";
	import { SelectListState } from "../select.svelte.js";
	import { boxWith, mergeProps } from "svelte-toolbelt";
	import { createId } from "$lib/internal/create-id.js";

	const uid = $props.id();

	let {
		id = createId(uid),
		ref = $bindable(null),
		child,
		children,
		...restProps
	}: SelectListProps = $props();

	const listState = SelectListState.create({
		id: boxWith(() => id),
		ref: boxWith(
			() => ref,
			(v) => (ref = v)
		),
	});

	const mergedProps = $derived(mergeProps(restProps, listState.props));
</script>

{#if child}
	{@render child({ props: mergedProps })}
{:else}
	<div {...mergedProps}>
		{@render children?.()}
	</div>
{/if}
