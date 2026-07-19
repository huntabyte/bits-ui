<script lang="ts">
	import { boxWith, mergeProps } from "svelte-toolbelt";
	import { SidebarRootState } from "../sidebar.svelte.js";
	import type { SidebarRootProps } from "../types.js";
	import { createId } from "$lib/internal/create-id.js";

	const uid = $props.id();

	let {
		id = createId(uid),
		ref = $bindable(null),
		side = "left",
		variant = "sidebar",
		collapsible = "offcanvas",
		children,
		child,
		...restProps
	}: SidebarRootProps = $props();

	const rootState = SidebarRootState.create({
		id: boxWith(() => id),
		ref: boxWith(
			() => ref,
			(v) => (ref = v)
		),
		side: boxWith(() => side),
		variant: boxWith(() => variant),
		collapsible: boxWith(() => collapsible),
	});

	const mergedProps = $derived(mergeProps(restProps, rootState.props));
</script>

{#if child}
	{@render child({ props: mergedProps, ...rootState.snippetProps })}
{:else}
	<div {...mergedProps}>
		{@render children?.(rootState.snippetProps)}
	</div>
{/if}
