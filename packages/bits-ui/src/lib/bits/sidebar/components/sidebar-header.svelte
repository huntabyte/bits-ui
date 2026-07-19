<script lang="ts">
	import { boxWith, mergeProps } from "svelte-toolbelt";
	import { SidebarPartState } from "../sidebar.svelte.js";
	import type { SidebarHeaderProps } from "../types.js";
	import { createId } from "$lib/internal/create-id.js";

	const uid = $props.id();
	let {
		id = createId(uid),
		ref = $bindable(null),
		child,
		children,
		...restProps
	}: SidebarHeaderProps = $props();
	const state = SidebarPartState.create(
		{
			id: boxWith(() => id),
			ref: boxWith(
				() => ref,
				(v) => (ref = v)
			),
		},
		"header"
	);
	const mergedProps = $derived(mergeProps(restProps, state.props));
</script>

{#if child}
	{@render child({ props: mergedProps })}
{:else}
	<div {...mergedProps}>{@render children?.()}</div>
{/if}
