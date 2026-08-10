<script lang="ts">
	import { boxWith } from "$lib/internal/box.svelte.js";
	import type { PresenceLayerImplProps } from "./types.js";
	import { Presence } from "./presence.svelte.js";

	let { open, forceMount, presence, ref }: PresenceLayerImplProps = $props();

	const presenceState = new Presence({
		open: boxWith(() => open),
		// svelte-ignore state_referenced_locally
		ref,
	});
</script>

{#if forceMount || open || presenceState.isPresent}
	{@render presence?.({
		present: presenceState.isPresent,
		transitionStatus: presenceState.transitionStatus,
	})}
{/if}
