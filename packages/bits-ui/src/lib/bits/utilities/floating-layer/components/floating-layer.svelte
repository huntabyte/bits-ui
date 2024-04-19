<script lang="ts">
	import type { Snippet } from "svelte";
	import { setFloatingRootState } from "../floating-layer.svelte.js";

	let { children }: { children?: Snippet } = $props();

	setFloatingRootState();
</script>

{@render children?.()}
