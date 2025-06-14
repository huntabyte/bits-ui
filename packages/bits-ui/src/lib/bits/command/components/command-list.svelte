<script lang="ts">
	import { box, mergeProps } from "svelte-toolbelt";
	import type { CommandListProps } from "../types.js";
	import { CommandListState } from "../command.svelte.js";
	import { createId } from "$lib/internal/create-id.js";

	const uid = $props.id();

	let {
		id = createId(uid),
		ref = $bindable(null),
		child,
		children,
		"aria-label": ariaLabel,
		...restProps
	}: CommandListProps = $props();

	const listState = CommandListState.create({
		id: box.with(() => id),
		ref: box.with(
			() => ref,
			(v) => (ref = v)
		),
		ariaLabel: box.with(() => ariaLabel ?? "Suggestions..."),
	});

	const mergedProps = $derived(mergeProps(restProps, listState.props));
</script>

{#key listState.root._commandState.search === ""}
	{#if child}
		{@render child({ props: mergedProps })}
	{:else}
		<div {...mergedProps}>
			{@render children?.()}
		</div>
	{/if}
{/key}
