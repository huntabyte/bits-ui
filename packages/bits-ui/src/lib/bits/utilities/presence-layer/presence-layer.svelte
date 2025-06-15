<script lang="ts">
	import { box } from "svelte-toolbelt";
	import type { PresenceLayerImplProps } from "./types.js";
	import { Presence } from "./presence.svelte.js";

	let { open, forceMount, presence, ref }: PresenceLayerImplProps = $props();

	const presenceState = new Presence({
		open: box.with(() => open),
		ref,
	});
</script>

{#if forceMount || open || presenceState.isPresent}
	{@render presence?.({ present: presenceState.isPresent })}
{/if}
