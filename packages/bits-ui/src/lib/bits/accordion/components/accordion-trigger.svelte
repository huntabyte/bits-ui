<script lang="ts">
	import { boxWith, mergeProps } from "svelte-toolbelt";
	import type { AccordionTriggerProps } from "../types.js";
	import { AccordionTriggerState } from "../accordion.svelte.js";
	import { createId } from "$lib/internal/create-id.js";

	const uid = $props.id();

	let {
		disabled = false,
		ref = $bindable(null),
		id = createId(uid),
		children,
		child,
		...restProps
	}: AccordionTriggerProps = $props();

	const triggerState = AccordionTriggerState.create({
		disabled: boxWith(() => disabled),
		id: boxWith(() => id),
		ref: boxWith(
			() => ref,
			(v) => (ref = v)
		),
	});

	const mergedProps = $derived(mergeProps(restProps, triggerState.props));
</script>

{#if child}
	{@render child({ props: mergedProps })}
{:else}
	<button type="button" {...mergedProps}>
		{@render children?.()}
	</button>
{/if}
