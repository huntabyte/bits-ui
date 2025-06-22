<script lang="ts">
	import { box, mergeProps } from "svelte-toolbelt";
	import { AccordionContentState } from "../accordion.svelte.js";
	import type { AccordionContentProps } from "../types.js";
	import { PresenceLayer } from "$lib/bits/utilities/presence-layer/index.js";
	import { createId } from "$lib/internal/create-id.js";

	const uid = $props.id();

	let {
		child,
		ref = $bindable(null),
		id = createId(uid),
		forceMount = false,
		children,
		...restProps
	}: AccordionContentProps = $props();

	const contentState = AccordionContentState.create({
		forceMount: box.with(() => forceMount),
		id: box.with(() => id),
		ref: box.with(
			() => ref,
			(v) => (ref = v)
		),
	});
</script>

<PresenceLayer forceMount={true} open={contentState.open} ref={contentState.opts.ref}>
	{#snippet presence({ present })}
		{@const mergedProps = mergeProps(restProps, contentState.props, {
			hidden: forceMount ? undefined : !present,
		})}
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
	{/snippet}
</PresenceLayer>
