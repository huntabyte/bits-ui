<script lang="ts">
	import type { ScrollLockProps } from "./index.js";
	import { useBodyScrollLock } from "$lib/internal/use-body-scroll-lock.svelte.js";

	let { preventScroll = true, restoreScrollDelay = null }: ScrollLockProps = $props();

	if (preventScroll) {
		useBodyScrollLock(preventScroll, () => restoreScrollDelay);
	}
</script>
