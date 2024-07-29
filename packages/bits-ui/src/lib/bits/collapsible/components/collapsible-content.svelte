<script lang="ts">
	import { box } from "svelte-toolbelt";
	import { useCollapsibleContent } from "../collapsible.svelte.js";
	import type { CollapsibleContentProps } from "../types.js";
	import { PresenceLayer } from "$lib/bits/utilities/presence-layer/index.js";
	import { mergeProps } from "$lib/internal/mergeProps.js";
	import { useId } from "$lib/internal/useId.js";

	let {
		child,
		ref = $bindable(null),
		forceMount = false,
		children,
		id = useId(),
		...restProps
	}: CollapsibleContentProps & { forceMount?: boolean } = $props();

	const contentState = useCollapsibleContent({
		id: box.with(() => id),
		forceMount: box.with(() => forceMount),
		ref: box.with(
			() => ref,
			(v) => (ref = v)
		),
	});
</script>

<PresenceLayer forceMount={true} present={contentState.present} {id}>
	{#snippet presence({ present })}
		{@const mergedProps = mergeProps(restProps, contentState.props, {
			hidden: forceMount ? undefined : !present.current,
		})}
		{#if child}
			{@render child({
				...contentState.snippetProps,
				props: mergedProps,
			})}
		{:else}
			<div {...mergedProps}>
				{@render children?.(contentState.snippetProps)}
			</div>
		{/if}
	{/snippet}
</PresenceLayer>
