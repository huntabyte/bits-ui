<script lang="ts">
	import { boxWith, mergeProps } from "svelte-toolbelt";
	import { boolToStrTrueOrUndef } from "$lib/internal/attrs.js";
	import { SidebarPartState } from "../sidebar.svelte.js";
	import type { SidebarSeparatorProps } from "../types.js";
	import { createId } from "$lib/internal/create-id.js";

	const uid = $props.id();
	let {
		id = createId(uid),
		ref = $bindable(null),
		decorative = true,
		child,
		children,
		...restProps
	}: SidebarSeparatorProps = $props();
	const state = SidebarPartState.create(
		{
			id: boxWith(() => id),
			ref: boxWith(
				() => ref,
				(v) => (ref = v)
			),
		},
		"separator"
	);
	const mergedProps = $derived(
		mergeProps(restProps, state.props, {
			role: decorative ? "none" : "separator",
			"aria-hidden": boolToStrTrueOrUndef(decorative),
			"aria-orientation": decorative ? undefined : "horizontal",
		})
	);
</script>

{#if child}
	{@render child({ props: mergedProps })}
{:else}
	<div {...mergedProps}>{@render children?.()}</div>
{/if}
