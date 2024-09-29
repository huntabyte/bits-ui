<script lang="ts">
	import { untrack } from "svelte";
	import type { ScrollLockProps } from "./index.js";
	import { useBodyScrollLock } from "$lib/internal/useBodyScrollLock.svelte.js";

	let { preventScroll = true }: ScrollLockProps = $props();

	$effect(() => {
		if (preventScroll) {
			untrack(() => useBodyScrollLock(preventScroll))
		}
	})

</script>
