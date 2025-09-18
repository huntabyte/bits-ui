<script lang="ts">
	import { boxWith, mergeProps } from "svelte-toolbelt";
	import type { AccordionItemProps } from "../types.js";
	import { AccordionItemState } from "../accordion.svelte.js";
	import { createId } from "$lib/internal/create-id.js";

	const uid = $props.id();
	const defaultId = createId(uid);

	let {
		id = defaultId,
		disabled = false,
		value = defaultId,
		children,
		child,
		ref = $bindable(null),
		...restProps
	}: AccordionItemProps = $props();

	const itemState = AccordionItemState.create({
		value: boxWith(() => value),
		disabled: boxWith(() => disabled),
		id: boxWith(() => id),
		ref: boxWith(
			() => ref,
			(v) => (ref = v)
		),
	});

	const mergedProps = $derived(mergeProps(restProps, itemState.props));
</script>

{#if child}
	{@render child({ props: mergedProps })}
{:else}
	<div {...mergedProps}>
		{@render children?.()}
	</div>
{/if}
