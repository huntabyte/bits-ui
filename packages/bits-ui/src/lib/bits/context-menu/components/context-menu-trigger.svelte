<script lang="ts">
	import { box, mergeProps } from "svelte-toolbelt";
	import type { ContextMenuTriggerProps } from "../types.js";
	import { useMenuContextTrigger } from "$lib/bits/menu/menu.svelte.js";
	import { createId } from "$lib/internal/create-id.js";
	import { FloatingLayer } from "$lib/bits/utilities/floating-layer/index.js";

	const uid = $props.id();

	let {
		id = createId(uid),
		ref = $bindable(null),
		child,
		children,
		disabled = false,
		...restProps
	}: ContextMenuTriggerProps = $props();

	const triggerState = useMenuContextTrigger({
		id: box.with(() => id),
		disabled: box.with(() => disabled),
		ref: box.with(
			() => ref,
			(v) => (ref = v)
		),
	});
</script>

<FloatingLayer.Anchor {id} virtualEl={triggerState.virtualElement}>
	{#snippet anchor({ props: anchorProps })}
		{@const mergedProps = mergeProps(restProps, triggerState.props, anchorProps, {
			style: { pointerEvents: "auto" },
		})}
		{#if child}
			{@render child({ props: mergedProps })}
		{:else}
			<div {...mergedProps}>
				{@render children?.()}
			</div>
		{/if}
	{/snippet}
</FloatingLayer.Anchor>
