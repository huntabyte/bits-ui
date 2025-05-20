<script lang="ts">
	import { box, mergeProps } from "svelte-toolbelt";
	import { useCollapsibleContent } from "../collapsible.svelte.js";
	import type { CollapsibleContentProps } from "../types.js";
	import { PresenceLayer } from "$lib/bits/utilities/presence-layer/index.js";
	import { createId } from "$lib/internal/create-id.js";

	const uid = $props.id();

	let {
		child,
		ref = $bindable(null),
		forceMount = false,
		children,
		id = createId(uid),
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
				{@render children?.()}
			</div>
		{/if}
	{/snippet}
</PresenceLayer>
