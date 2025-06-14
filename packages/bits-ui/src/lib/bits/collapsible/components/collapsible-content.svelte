<script lang="ts">
	import { box, mergeProps } from "svelte-toolbelt";
	import { CollapsibleContentState } from "../collapsible.svelte.js";
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
	}: CollapsibleContentProps = $props();

	const contentState = CollapsibleContentState.create({
		id: box.with(() => id),
		forceMount: box.with(() => forceMount),
		ref: box.with(
			() => ref,
			(v) => (ref = v)
		),
	});
</script>

<PresenceLayer forceMount={true} open={contentState.present} ref={contentState.opts.ref}>
	{#snippet presence({ present })}
		{@const mergedProps = mergeProps(restProps, contentState.props, {
			hidden: forceMount ? undefined : !present,
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
