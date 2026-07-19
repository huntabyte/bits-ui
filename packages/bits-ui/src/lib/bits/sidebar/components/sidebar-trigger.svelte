<script lang="ts">
	import { boxWith, mergeProps } from "svelte-toolbelt";
	import { SidebarToggleState } from "../sidebar.svelte.js";
	import type { SidebarTriggerProps } from "../types.js";
	import { createId } from "$lib/internal/create-id.js";

	const uid = $props.id();

	let {
		id = createId(uid),
		ref = $bindable(null),
		disabled = false,
		"aria-label": ariaLabel = "Toggle sidebar",
		children,
		child,
		...restProps
	}: SidebarTriggerProps = $props();

	const triggerState = SidebarToggleState.create(
		{
			id: boxWith(() => id),
			ref: boxWith(
				() => ref,
				(v) => (ref = v)
			),
			disabled: boxWith(() => disabled),
		},
		"trigger"
	);

	const mergedProps = $derived(
		mergeProps(restProps, triggerState.props, { "aria-label": ariaLabel })
	);
</script>

{#if child}
	{@render child({ props: mergedProps, ...triggerState.snippetProps })}
{:else}
	<button {...mergedProps}>
		{@render children?.(triggerState.snippetProps)}
	</button>
{/if}
