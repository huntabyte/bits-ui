<script lang="ts">
	import { boxWith, mergeProps } from "svelte-toolbelt";
	import type { MenubarContentStaticProps } from "../types.js";
	import { MenubarContentState } from "../menubar.svelte.js";
	import { createId } from "$lib/internal/create-id.js";
	import MenuContentStatic from "$lib/bits/menu/components/menu-content-static.svelte";
	import { noop } from "$lib/internal/noop.js";

	const uid = $props.id();

	let {
		ref = $bindable(null),
		interactOutsideBehavior = "close",
		id = createId(uid),
		onInteractOutside = noop,
		onCloseAutoFocus = noop,
		onFocusOutside = noop,
		onOpenAutoFocus = noop,
		...restProps
	}: MenubarContentStaticProps = $props();

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

<MenuContentStatic bind:ref {...mergedProps} {...contentState.popperProps} preventScroll={false} />
