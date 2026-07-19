<script lang="ts">
	import { boxWith, mergeProps } from "svelte-toolbelt";
	import { SidebarPartState } from "../sidebar.svelte.js";
	import type { SidebarMenuSubProps } from "../types.js";
	import { createId } from "$lib/internal/create-id.js";

	const uid = $props.id();
	let {
		id = createId(uid),
		ref = $bindable(null),
		child,
		children,
		...restProps
	}: SidebarMenuSubProps = $props();
	const state = SidebarPartState.create(
		{
			id: boxWith(() => id),
			ref: boxWith(
				() => ref,
				(v) => (ref = v)
			),
		},
		"menu-sub"
	);
	const mergedProps = $derived(mergeProps(restProps, state.props));
</script>

{#if child}
	{@render child({ props: mergedProps })}
{:else}
	<ul {...mergedProps}>{@render children?.()}</ul>
{/if}
