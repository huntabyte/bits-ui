<script lang="ts">
	import { usePortal } from "./use-portal.svelte.js";
	import type { PortalProps } from "./types.js";
	import { readonlyBox } from "$lib/internal/box.svelte.js";

	let { id, to = "body", forceMount, children }: PortalProps = $props();

	usePortal(
		readonlyBox(() => id),
		readonlyBox(() => to)
	);
</script>

{#if forceMount}
	{@render children?.()}
{/if}
