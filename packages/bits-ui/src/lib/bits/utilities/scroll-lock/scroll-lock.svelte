<script lang="ts">
	import type { ScrollLockProps } from "./index.js";
	import { BodyScrollLock } from "$lib/internal/body-scroll-lock.svelte.js";

	type ScrollLockImplProps = ScrollLockProps & {
		shouldBlockPointerEvents?: () => boolean;
	};

	let {
		preventScroll = true,
		restoreScrollDelay = null,
		shouldBlockPointerEvents,
	}: ScrollLockImplProps = $props();

	// svelte-ignore state_referenced_locally
	if (preventScroll) {
		new BodyScrollLock(preventScroll, () => restoreScrollDelay, shouldBlockPointerEvents);
	}
</script>
