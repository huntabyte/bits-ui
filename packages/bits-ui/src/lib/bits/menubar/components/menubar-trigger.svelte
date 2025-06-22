<script lang="ts">
	import { attachRef, box, mergeProps } from "svelte-toolbelt";
	import type { MenubarTriggerProps } from "../types.js";
	import { MenubarTriggerState } from "../menubar.svelte.js";
	import { createId } from "$lib/internal/create-id.js";
	import FloatingLayerAnchor from "$lib/bits/utilities/floating-layer/components/floating-layer-anchor.svelte";
	import { DropdownMenuTriggerState } from "$lib/bits/menu/menu.svelte.js";

	const uid = $props.id();

	let {
		id = createId(uid),
		disabled = false,
		children,
		child,
		ref = $bindable(null),
		...restProps
	}: MenubarTriggerProps = $props();

	const triggerState = MenubarTriggerState.create({
		id: box.with(() => id),
		disabled: box.with(() => disabled ?? false),
		ref: box.with(
			() => ref,
			(v) => (ref = v)
		),
	});

	const dropdownTriggerState = DropdownMenuTriggerState.create(triggerState.opts);
	const triggerAttachment = attachRef(
		(v: HTMLElement | null) => (dropdownTriggerState.parentMenu.triggerNode = v)
	);

	const mergedProps = $derived(
		mergeProps(restProps, triggerState.props, {
			...triggerAttachment,
		})
	);
</script>

<FloatingLayerAnchor {id} ref={triggerState.opts.ref}>
	{#if child}
		{@render child({ props: mergedProps })}
	{:else}
		<button {...mergedProps}>
			{@render children?.()}
		</button>
	{/if}
</FloatingLayerAnchor>
