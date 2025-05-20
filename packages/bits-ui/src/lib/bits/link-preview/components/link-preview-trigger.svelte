<script lang="ts">
	import { box, mergeProps } from "svelte-toolbelt";
	import type { LinkPreviewTriggerProps } from "../types.js";
	import { useLinkPreviewTrigger } from "../link-preview.svelte.js";
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

	const triggerState = useLinkPreviewTrigger({
		id: box.with(() => id),
		ref: box.with(
			() => ref,
			(v) => (ref = v)
		),
	});
</script>

<FloatingLayer.Anchor {id}>
	{#snippet anchor({ props: anchorProps })}
		{@const mergedProps = mergeProps(restProps, triggerState.props, anchorProps)}
		{#if child}
			{@render child({ props: mergedProps })}
		{:else}
			<a {...mergedProps}>
				{@render children?.()}
			</a>
		{/if}
	{/snippet}
</FloatingLayer.Anchor>
