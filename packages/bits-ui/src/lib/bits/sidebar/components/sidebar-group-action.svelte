<script lang="ts">
	import { boxWith, mergeProps } from "svelte-toolbelt";
	import { boolToEmptyStrOrUndef, boolToTrueOrUndef } from "$lib/internal/attrs.js";
	import { SidebarPartState } from "../sidebar.svelte.js";
	import type { SidebarGroupActionProps } from "../types.js";
	import { createId } from "$lib/internal/create-id.js";

	const uid = $props.id();
	let {
		id = createId(uid),
		ref = $bindable(null),
		disabled = false,
		child,
		children,
		...restProps
	}: SidebarGroupActionProps = $props();
	const state = SidebarPartState.create(
		{
			id: boxWith(() => id),
			ref: boxWith(
				() => ref,
				(v) => (ref = v)
			),
		},
		"group-action"
	);
	const mergedProps = $derived(
		mergeProps(restProps, state.props, {
			type: "button",
			disabled: boolToTrueOrUndef(disabled),
			"data-disabled": boolToEmptyStrOrUndef(disabled),
		})
	);
</script>

{#if child}
	{@render child({ props: mergedProps })}
{:else}
	<button {...mergedProps}>{@render children?.()}</button>
{/if}
