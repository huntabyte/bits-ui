<script lang="ts">
	import type { Snippet } from "svelte";
	import { FloatingRootState } from "../use-floating-layer.svelte.js";

	let { children, tooltip = false }: { children?: Snippet; tooltip?: boolean } = $props();

	FloatingRootState.create(tooltip);
</script>

{@render children?.()}
