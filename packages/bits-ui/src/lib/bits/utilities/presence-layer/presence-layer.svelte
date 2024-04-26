<script lang="ts">
	import { box } from "runed";
	import type { PresenceLayerImplProps } from "./types.js";
	import { usePresence } from "$lib/bits/utilities/presence-layer/usePresence.svelte.js";

	let { present, forceMount = false, presence, id }: PresenceLayerImplProps = $props();

	const isPresent = usePresence(
		box.with(() => present),
		box.with(() => id)
	);
</script>

{#if forceMount || present || isPresent.value}
	{@render presence?.({ present: isPresent })}
{/if}
