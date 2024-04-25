<script lang="ts">
	import type { PresenceLayerImplProps } from "./types.js";
	import { readonlyBox } from "$lib/internal/box.svelte.js";
	import { usePresence } from "$lib/bits/utilities/presence-layer/usePresence.svelte.js";

	let { present, forceMount = false, presence, id }: PresenceLayerImplProps = $props();

	const isPresent = usePresence(
		readonlyBox(() => present),
		readonlyBox(() => id)
	);
</script>

{#if forceMount || present || isPresent.value}
	{@render presence?.({ present: isPresent })}
{/if}
