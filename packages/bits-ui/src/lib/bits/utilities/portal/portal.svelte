<script lang="ts">
	import { usePortal } from "./use-portal.svelte.js";
	import type { PortalProps } from "./types.js";
	import { readonlyBox, useId } from "$lib/internal/index.js";

	let { id = useId(), to = "body", forceMount, portal }: PortalProps = $props();

	const state = usePortal(
		readonlyBox(() => id),
		readonlyBox(() => to)
	);
</script>

{#if forceMount}
	{@render portal?.({ portalProps: state.props })}
{/if}
