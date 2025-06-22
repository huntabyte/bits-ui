<script lang="ts">
	import { box, mergeProps } from "svelte-toolbelt";
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
		id: box.with(() => id),
		level: box.with(() => level),
		ref: box.with(
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
