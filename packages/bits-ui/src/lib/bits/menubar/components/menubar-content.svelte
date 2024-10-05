<script lang="ts">
	import { box } from "svelte-toolbelt";
	import type { MenubarContentProps } from "../types.js";
	import { useMenubarContent } from "../menubar.svelte.js";
	import MenuContent from "$lib/bits/menu/components/menu-content.svelte";
	import { useId } from "$lib/internal/use-id.js";
	import { mergeProps } from "$lib/internal/merge-props.js";

	let {
		ref = $bindable(null),
		interactOutsideBehavior = "close",
		id = useId(),
		...restProps
	}: MenubarContentProps = $props();

	const contentState = useMenubarContent({
		id: box.with(() => id),
		interactOutsideBehavior: box.with(() => interactOutsideBehavior),
		ref: box.with(
			() => ref,
			(v) => (ref = v)
		),
	});

	const mergedProps = $derived(mergeProps(restProps, contentState.props));
</script>

<MenuContent
	bind:ref
	{...mergedProps}
	preventScroll={false}
	onInteractOutside={contentState.onInteractOutside}
	onFocusOutside={contentState.onFocusOutside}
	onCloseAutoFocus={contentState.onCloseAutoFocus}
	onOpenAutoFocus={contentState.onOpenAutoFocus}
/>
