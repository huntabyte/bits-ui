<script lang="ts">
	import { box, mergeProps } from "svelte-toolbelt";
	import type { MenubarTriggerProps } from "../types.js";
	import { useMenubarTrigger } from "../menubar.svelte.js";
	import { createId } from "$lib/internal/create-id.js";
	import FloatingLayerAnchor from "$lib/bits/utilities/floating-layer/components/floating-layer-anchor.svelte";
	import { useMenuDropdownTrigger } from "$lib/bits/menu/menu.svelte.js";

	const uid = $props.id();

	let {
		id = createId(uid),
		disabled = false,
		children,
		child,
		ref = $bindable(null),
		...restProps
	}: MenubarTriggerProps = $props();

	const triggerState = useMenubarTrigger({
		id: box.with(() => id),
		disabled: box.with(() => disabled ?? false),
		ref: box.with(
			() => ref,
			(v) => (ref = v)
		),
	});

	useMenuDropdownTrigger(triggerState.opts);

	const mergedProps = $derived(mergeProps(restProps, triggerState.props));
</script>

<FloatingLayerAnchor {id}>
	{#if child}
		{@render child({ props: mergedProps })}
	{:else}
		<button {...mergedProps}>
			{@render children?.()}
		</button>
	{/if}
</FloatingLayerAnchor>
