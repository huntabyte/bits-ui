<script lang="ts">
	import { untrack, type Snippet } from "svelte";

	// `children` comes from a plain props object passed to `mount()`, so it never changes:
	// it's called directly instead of through an `{@render}` block.
	const { children }: { children?: Snippet } = $props();
	const renderChildren = untrack(() => children);
</script>

{@render renderChildren?.()}
