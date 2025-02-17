<script lang="ts">
	import { box, mergeProps } from "svelte-toolbelt";
	import type { MenubarContentProps } from "../types.js";
	import { useMenubarContent } from "../menubar.svelte.js";
	import MenuContent from "$lib/bits/menu/components/menu-content.svelte";
	import { useId } from "$lib/internal/use-id.js";
	import { noop } from "$lib/internal/noop.js";

	let {
		ref = $bindable(null),
		interactOutsideBehavior = "close",
		id = useId(),
		onInteractOutside = noop,
		onFocusOutside = noop,
		onCloseAutoFocus = noop,
		onOpenAutoFocus = noop,
		...restProps
	}: MenubarContentProps = $props();

	const contentState = useMenubarContent({
		id: box.with(() => id),
		interactOutsideBehavior: box.with(() => interactOutsideBehavior),
		ref: box.with(
			() => ref,
			(v) => (ref = v)
		),
		onInteractOutside: box.with(() => onInteractOutside),
		onFocusOutside: box.with(() => onFocusOutside),
		onCloseAutoFocus: box.with(() => onCloseAutoFocus),
		onOpenAutoFocus: box.with(() => onOpenAutoFocus),
	});

	const mergedProps = $derived(mergeProps(restProps, contentState.props));
</script>

<MenuContent bind:ref {...mergedProps} {...contentState.popperProps} preventScroll={false} />
