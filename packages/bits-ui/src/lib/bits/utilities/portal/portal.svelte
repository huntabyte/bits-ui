<script lang="ts">
	import { usePortal } from "./use-portal.svelte.js";
	import type { PortalProps } from "./types.js";
	import { readonlyBox } from "$lib/internal/box.svelte.js";
	import { generateId } from "$lib/internal/id.js";

	let { id = generateId(), to = "body", forceMount, portal }: PortalProps = $props();

	const state = usePortal(
		readonlyBox(() => id),
		readonlyBox(() => to)
	);
</script>

{#if forceMount}
	{@render portal?.({ portalProps: state.props })}
{/if}
