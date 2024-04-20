<script lang="ts">
	import type { PresenceLayerProps } from "./types.js";
	import { readonlyBox } from "$lib/internal/box.svelte.js";
	import { usePresence } from "$lib/internal/use-presence.svelte.js";

	let {
		present: presentProp,
		forceMount: forceMountProp = false,
		presence,
		id,
	}: PresenceLayerProps = $props();

	const forceMount = readonlyBox(() => forceMountProp);

	const present = readonlyBox(() => presentProp);
	const isPresent = usePresence(
		present,
		readonlyBox(() => id)
	);
</script>

{#if forceMount.value || present.value || isPresent.value}
	{@render presence?.({ present: isPresent })}
{/if}
