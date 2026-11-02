<script lang="ts">
	import { boxWith } from "svelte-toolbelt";
	import { untrack } from "svelte";
	import { FloatingAnchorState } from "../floating-root.svelte.js";
	import type { AnchorProps } from "./index.js";
	import type { Measurable } from "$lib/internal/floating-svelte/types.js";

	let { id, children, virtualEl, ref, tooltip = false }: AnchorProps = $props();

	FloatingAnchorState.create(
		{
			id: boxWith(() => id),
			virtualEl: boxWith(() => virtualEl as unknown as Measurable | null),
			ref: untrack(() => ref),
		},
		untrack(() => tooltip)
	);
</script>

{@render children?.()}
