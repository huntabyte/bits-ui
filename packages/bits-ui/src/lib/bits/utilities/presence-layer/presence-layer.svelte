<script lang="ts">
	import type { PresenceLayerProps } from "./types.js";
	import { readonlyBox } from "$lib/internal/box.svelte.js";
	import { usePresence } from "$lib/bits/utilities/presence-layer/usePresence.svelte.js";

	let {
		present,
		forceMount: forceMountProp = false,
		presence,
		id,
	}: PresenceLayerProps = $props();

	const forceMount = readonlyBox(() => forceMountProp);

	const isPresent = usePresence(
		readonlyBox(() => present),
		readonlyBox(() => id)
	);
</script>

{#if forceMount.value || present || isPresent.value}
	{@render presence?.({ present: isPresent })}
{/if}
