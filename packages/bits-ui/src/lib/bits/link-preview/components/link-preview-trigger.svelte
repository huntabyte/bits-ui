<script lang="ts">
	import { box, mergeProps } from "svelte-toolbelt";
	import type { LinkPreviewTriggerProps } from "../types.js";
	import { LinkPreviewTriggerState } from "../link-preview.svelte.js";
	import { createId } from "$lib/internal/create-id.js";
	import { FloatingLayer } from "$lib/bits/utilities/floating-layer/index.js";

	const uid = $props.id();

	let {
		ref = $bindable(null),
		id = createId(uid),
		child,
		children,
		...restProps
	}: LinkPreviewTriggerProps = $props();

	const triggerState = LinkPreviewTriggerState.create({
		id: box.with(() => id),
		ref: box.with(
			() => ref,
			(v) => (ref = v)
		),
	});

	const mergedProps = $derived(mergeProps(restProps, triggerState.props));
</script>

<FloatingLayer.Anchor {id} ref={triggerState.opts.ref}>
	{#if child}
		{@render child({ props: mergedProps })}
	{:else}
		<a {...mergedProps}>
			{@render children?.()}
		</a>
	{/if}
</FloatingLayer.Anchor>
