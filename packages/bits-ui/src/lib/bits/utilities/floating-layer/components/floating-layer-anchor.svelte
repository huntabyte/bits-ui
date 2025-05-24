<script lang="ts">
	import { box } from "svelte-toolbelt";
	import { useFloatingAnchorState } from "../use-floating-layer.svelte.js";
	import type { AnchorProps } from "./index.js";
	import type { Measurable } from "$lib/internal/floating-svelte/types.js";

	let { id, children, virtualEl, ref }: AnchorProps = $props();

	useFloatingAnchorState({
		id: box.with(() => id),
		virtualEl: box.with(() => virtualEl as unknown as Measurable | null),
		ref,
	});
</script>

{@render children?.()}
