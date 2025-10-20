<script lang="ts">
	import { mergeProps, boxWith } from "svelte-toolbelt";
	import { AccordionContentState } from "../accordion.svelte.js";
	import type { AccordionContentProps } from "../types.js";
	import { createId } from "$lib/internal/create-id.js";

	const uid = $props.id();

	let {
		child,
		ref = $bindable(null),
		id = createId(uid),
		forceMount = false,
		children,
		hiddenUntilFound = false,
		...restProps
	}: AccordionContentProps = $props();

	const contentState = AccordionContentState.create({
		forceMount: boxWith(() => forceMount),
		id: boxWith(() => id),
		ref: boxWith(
			() => ref,
			(v) => (ref = v)
		),
		hiddenUntilFound: boxWith(() => hiddenUntilFound),
	});

	const mergedProps = $derived(mergeProps(restProps, contentState.props));
</script>

{#if child}
	{@render child({
		props: mergedProps,
		...contentState.snippetProps,
	})}
{:else}
	<div {...mergedProps}>
		{@render children?.()}
	</div>
{/if}
