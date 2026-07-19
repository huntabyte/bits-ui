<script lang="ts">
	import { boxWith, mergeProps } from "svelte-toolbelt";
	import { SidebarMenuSubButtonState } from "../sidebar.svelte.js";
	import type { SidebarMenuSubButtonProps } from "../types.js";
	import { createId } from "$lib/internal/create-id.js";

	const uid = $props.id();

	let {
		id = createId(uid),
		ref = $bindable(null),
		isActive = false,
		size = "md",
		children,
		child,
		...restProps
	}: SidebarMenuSubButtonProps = $props();

	const buttonState = SidebarMenuSubButtonState.create({
		id: boxWith(() => id),
		ref: boxWith(
			() => ref,
			(v) => (ref = v)
		),
		isActive: boxWith(() => isActive),
		size: boxWith(() => size),
	});

	const mergedProps = $derived(mergeProps(restProps, buttonState.props));
</script>

{#if child}
	{@render child({ props: mergedProps, ...buttonState.snippetProps })}
{:else}
	<a {...mergedProps}>
		{@render children?.(buttonState.snippetProps)}
	</a>
{/if}
