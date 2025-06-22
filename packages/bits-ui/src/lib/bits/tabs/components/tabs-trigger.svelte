<script lang="ts">
	import { box, mergeProps } from "svelte-toolbelt";
	import type { TabsTriggerProps } from "../types.js";
	import { TabsTriggerState } from "../tabs.svelte.js";
	import { createId } from "$lib/internal/create-id.js";

	const uid = $props.id();

	let {
		child,
		children,
		disabled = false,
		id = createId(uid),
		type = "button",
		value,
		ref = $bindable(null),
		...restProps
	}: TabsTriggerProps = $props();

	const triggerState = TabsTriggerState.create({
		id: box.with(() => id),
		disabled: box.with(() => disabled ?? false),
		value: box.with(() => value),
		ref: box.with(
			() => ref,
			(v) => (ref = v)
		),
	});

	const mergedProps = $derived(mergeProps(restProps, triggerState.props, { type }));
</script>

{#if child}
	{@render child({ props: mergedProps })}
{:else}
	<button {...mergedProps}>
		{@render children?.()}
	</button>
{/if}
