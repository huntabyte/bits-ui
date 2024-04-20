<script lang="ts">
	import { usePortal } from "./use-portal.svelte.js";
	import type { PortalProps } from "./types.js";
	import { readonlyBox } from "$lib/internal/box.svelte.js";
	import { generateId } from "$lib/internal/id.js";
	import { useMounted } from "$lib/internal/use-mounted.svelte.js";

	let { id = generateId(), to = "body", forceMount, children }: PortalProps = $props();

	usePortal(
		readonlyBox(() => id),
		readonlyBox(() => to)
	);

	const mounted = useMounted();
</script>

{#if forceMount || mounted.value}
	{@render children?.()}
{/if}
