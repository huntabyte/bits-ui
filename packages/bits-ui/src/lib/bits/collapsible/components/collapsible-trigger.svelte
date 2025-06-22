<script lang="ts">
	import { box, mergeProps } from "svelte-toolbelt";
	import type { CollapsibleTriggerProps } from "../types.js";
	import { CollapsibleTriggerState } from "../collapsible.svelte.js";
	import { createId } from "$lib/internal/create-id.js";

	const uid = $props.id();

	let {
		children,
		child,
		ref = $bindable(null),
		id = createId(uid),
		disabled = false,
		...restProps
	}: CollapsibleTriggerProps = $props();

	const triggerState = CollapsibleTriggerState.create({
		id: box.with(() => id),
		ref: box.with(
			() => ref,
			(v) => (ref = v)
		),
		disabled: box.with(() => disabled),
	});

	const mergedProps = $derived(mergeProps(restProps, triggerState.props));
</script>

{#if child}
	{@render child({ props: mergedProps })}
{:else}
	<button {...mergedProps}>
		{@render children?.()}
	</button>
{/if}
