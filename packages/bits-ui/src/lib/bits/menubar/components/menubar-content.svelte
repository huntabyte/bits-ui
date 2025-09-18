<script lang="ts">
	import { boxWith, mergeProps } from "svelte-toolbelt";
	import type { MenubarContentProps } from "../types.js";
	import { MenubarContentState } from "../menubar.svelte.js";
	import MenuContent from "$lib/bits/menu/components/menu-content.svelte";
	import { createId } from "$lib/internal/create-id.js";
	import { noop } from "$lib/internal/noop.js";

	const uid = $props.id();

	let {
		ref = $bindable(null),
		interactOutsideBehavior = "close",
		id = createId(uid),
		onInteractOutside = noop,
		onFocusOutside = noop,
		onCloseAutoFocus = noop,
		onOpenAutoFocus = noop,
		...restProps
	}: MenubarContentProps = $props();

	const contentState = MenubarContentState.create({
		id: boxWith(() => id),
		interactOutsideBehavior: boxWith(() => interactOutsideBehavior),
		ref: boxWith(
			() => ref,
			(v) => (ref = v)
		),
		onInteractOutside: boxWith(() => onInteractOutside),
		onFocusOutside: boxWith(() => onFocusOutside),
		onCloseAutoFocus: boxWith(() => onCloseAutoFocus),
		onOpenAutoFocus: boxWith(() => onOpenAutoFocus),
	});

	const mergedProps = $derived(mergeProps(restProps, contentState.props));
</script>

<MenuContent bind:ref {...mergedProps} {...contentState.popperProps} preventScroll={false} />
