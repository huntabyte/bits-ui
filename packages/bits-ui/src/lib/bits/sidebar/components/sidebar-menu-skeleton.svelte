<script lang="ts">
	import { boxWith, mergeProps } from "svelte-toolbelt";
	import { boolToEmptyStrOrUndef } from "$lib/internal/attrs.js";
	import { SidebarPartState } from "../sidebar.svelte.js";
	import type { SidebarMenuSkeletonProps } from "../types.js";
	import { createId } from "$lib/internal/create-id.js";

	const uid = $props.id();
	let {
		id = createId(uid),
		ref = $bindable(null),
		showIcon = false,
		child,
		children,
		...restProps
	}: SidebarMenuSkeletonProps = $props();
	const state = SidebarPartState.create(
		{
			id: boxWith(() => id),
			ref: boxWith(
				() => ref,
				(v) => (ref = v)
			),
		},
		"menu-skeleton"
	);
	const mergedProps = $derived(
		mergeProps(restProps, state.props, {
			"aria-hidden": "true",
			"data-icon": boolToEmptyStrOrUndef(showIcon),
		})
	);
</script>

{#if child}
	{@render child({ props: mergedProps })}
{:else}
	<div {...mergedProps}>{@render children?.()}</div>
{/if}
