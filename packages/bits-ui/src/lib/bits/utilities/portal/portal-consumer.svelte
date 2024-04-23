<script lang="ts">
	import type { Snippet } from "svelte";

	const { children }: { children?: Snippet } = $props();
</script>

{@render children?.()}
