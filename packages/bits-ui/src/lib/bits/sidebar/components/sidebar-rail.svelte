<script lang="ts">
	import { boxWith, mergeProps } from "svelte-toolbelt";
	import { SidebarToggleState } from "../sidebar.svelte.js";
	import type { SidebarRailProps } from "../types.js";
	import { createId } from "$lib/internal/create-id.js";

	const uid = $props.id();

	let {
		id = createId(uid),
		ref = $bindable(null),
		disabled = false,
		"aria-label": ariaLabel = "Toggle sidebar",
		title = "Toggle sidebar",
		tabindex = -1,
		children,
		child,
		...restProps
	}: SidebarRailProps = $props();

	const railState = SidebarToggleState.create(
		{
			id: boxWith(() => id),
			ref: boxWith(
				() => ref,
				(v) => (ref = v)
			),
			disabled: boxWith(() => disabled),
		},
		"rail"
	);

	const mergedProps = $derived(
		mergeProps(restProps, railState.props, { "aria-label": ariaLabel, title, tabindex })
	);
</script>

{#if child}
	{@render child({ props: mergedProps, ...railState.snippetProps })}
{:else}
	<button {...mergedProps}>
		{@render children?.(railState.snippetProps)}
	</button>
{/if}
