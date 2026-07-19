<script lang="ts">
	import { boxWith, mergeProps } from "svelte-toolbelt";
	import { SidebarMenuButtonState } from "../sidebar.svelte.js";
	import type { SidebarMenuButtonProps } from "../types.js";
	import { createId } from "$lib/internal/create-id.js";

	const uid = $props.id();

	let {
		id = createId(uid),
		ref = $bindable(null),
		isActive = false,
		size = "default",
		variant = "default",
		disabled = false,
		children,
		child,
		...restProps
	}: SidebarMenuButtonProps = $props();

	const buttonState = SidebarMenuButtonState.create({
		id: boxWith(() => id),
		ref: boxWith(
			() => ref,
			(v) => (ref = v)
		),
		isActive: boxWith(() => isActive),
		size: boxWith(() => size),
		variant: boxWith(() => variant),
		disabled: boxWith(() => disabled),
	});

	const mergedProps = $derived(mergeProps(restProps, buttonState.props));
</script>

{#if child}
	{@render child({ props: mergedProps, ...buttonState.snippetProps })}
{:else}
	<button {...mergedProps}>
		{@render children?.(buttonState.snippetProps)}
	</button>
{/if}
