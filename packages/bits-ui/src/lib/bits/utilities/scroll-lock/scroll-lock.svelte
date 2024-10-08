<script lang="ts">
	import type { ScrollLockProps } from "./index.js";
	import { useBodyScrollLock } from "$lib/internal/use-body-scroll-lock.svelte.js";

	let { preventScroll = true }: ScrollLockProps = $props();

	useBodyScrollLock(preventScroll);
</script>
