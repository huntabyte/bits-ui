<script lang="ts">
	import type { Snippet } from "svelte";
	import { useFloatingRootState } from "../use-floating-layer.svelte.js";

	let { children, tooltip = false }: { children?: Snippet; tooltip?: boolean } = $props();

	useFloatingRootState(tooltip);
</script>

{@render children?.()}
