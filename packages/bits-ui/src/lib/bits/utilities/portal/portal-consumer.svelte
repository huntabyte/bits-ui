<script lang="ts">
	import type { Snippet } from "svelte";

	// `children` comes from a plain props object passed to `mount()`, so it never changes
	// and needs no `{#key}` block around it.
	const { children }: { children?: Snippet } = $props();
</script>

{@render children?.()}
