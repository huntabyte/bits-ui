<script lang="ts">
	import { box } from "svelte-toolbelt";
	import type { PresenceLayerImplProps } from "./types.js";
	import { usePresence } from "$lib/bits/utilities/presence-layer/use-presence.svelte.js";
	import { noop } from "$lib/internal/noop.js";

	let {
		present,
		forceMount,
		presence,
		ref,
		onOpenChangeComplete = noop,
	}: PresenceLayerImplProps = $props();

	const isPresent = usePresence({
		present: box.with(() => present),
		ref,
		onOpenChangeComplete: box.with(() => onOpenChangeComplete),
	});
</script>

{#if forceMount || present || isPresent.current}
	{@render presence?.({ present: isPresent })}
{/if}
