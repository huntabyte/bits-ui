<script lang="ts">
	import { boxWith, mergeProps } from "svelte-toolbelt";
	import type { AccordionHeaderProps } from "../types.js";
	import { AccordionHeaderState } from "../accordion.svelte.js";
	import { createId } from "$lib/internal/create-id.js";

	const uid = $props.id();

	let {
		id = createId(uid),
		level = 2,
		children,
		child,
		ref = $bindable(null),
		...restProps
	}: AccordionHeaderProps = $props();

	const headerState = AccordionHeaderState.create({
		id: boxWith(() => id),
		level: boxWith(() => level),
		ref: boxWith(
			() => ref,
			(v) => (ref = v)
		),
	});

	const mergedProps = $derived(mergeProps(restProps, headerState.props));
</script>

{#if child}
	{@render child({ props: mergedProps })}
{:else}
	<div {...mergedProps}>
		{@render children?.()}
	</div>
{/if}
