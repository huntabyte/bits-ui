<script lang="ts">
	import { boxWith, mergeProps } from "svelte-toolbelt";
	import { CollapsibleContentState } from "../collapsible.svelte.js";
	import type { CollapsibleContentProps } from "../types.js";
	import { createId } from "$lib/internal/create-id.js";

	const uid = $props.id();

	let {
		child,
		ref = $bindable(null),
		forceMount = false,
		hiddenUntilFound = false,
		children,
		id = createId(uid),
		...restProps
	}: CollapsibleContentProps = $props();

	const contentState = CollapsibleContentState.create({
		id: boxWith(() => id),
		forceMount: boxWith(() => forceMount),
		hiddenUntilFound: boxWith(() => hiddenUntilFound),
		ref: boxWith(
			() => ref,
			(v) => (ref = v)
		),
	});

	const mergedProps = $derived(mergeProps(restProps, contentState.props));
</script>

{#if child}
	{@render child({
		...contentState.snippetProps,
		props: mergedProps,
	})}
{:else}
	<div {...mergedProps}>
		{@render children?.()}
	</div>
{/if}
