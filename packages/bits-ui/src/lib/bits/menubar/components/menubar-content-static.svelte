<script lang="ts">
	import { box } from "svelte-toolbelt";
	import type { ContentStaticProps } from "../index.js";
	import { useMenubarContent } from "../menubar.svelte.js";
	import { useId } from "$lib/internal/useId.js";
	import { mergeProps } from "$lib/internal/mergeProps.js";
	import MenuContentStatic from "$lib/bits/menu/components/menu-content-static.svelte";

	let {
		ref = $bindable(null),
		interactOutsideBehavior = "close",
		id = useId(),
		...restProps
	}: ContentStaticProps = $props();

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

<MenuContentStatic
	bind:ref
	{...mergedProps}
	preventScroll={false}
	onInteractOutside={contentState.onInteractOutside}
	onFocusOutside={contentState.onFocusOutside}
	onDestroyAutoFocus={contentState.onDestroyAutoFocus}
	onMountAutoFocus={contentState.onMountAutoFocus}
/>
