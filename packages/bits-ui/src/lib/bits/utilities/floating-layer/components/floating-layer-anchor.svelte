<script lang="ts">
	import { boxWith } from "#lib/internal/box.svelte.js";
	import { untrack } from "svelte";
	import { FloatingAnchorState } from "../floating-root.svelte.js";
	import type { AnchorProps } from "./index.js";
	import type { Measurable } from "#lib/internal/floating-svelte/types.js";

	let { id, children, virtualEl, ref, tooltip = false }: AnchorProps = $props();

	FloatingAnchorState.create(
		{
			id: boxWith(() => id),
			virtualEl: boxWith(() => virtualEl as unknown as Measurable | null),
			ref: untrack(() => ref),
		},
		untrack(() => tooltip)
	);

	// `children` is always the caller's own template block, which never changes, so it's
	// called directly instead of through an `{@render}` block (one less block per instance).
	const renderChildren = untrack(() => children);
</script>

{@render renderChildren?.()}
