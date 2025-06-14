<script lang="ts">
	import type { ScrollLockProps } from "./index.js";
	import { BodyScrollLock } from "$lib/internal/body-scroll-lock.svelte.js";

	let { preventScroll = true, restoreScrollDelay = null }: ScrollLockProps = $props();

	if (preventScroll) {
		new BodyScrollLock(preventScroll, () => restoreScrollDelay);
	}
</script>
