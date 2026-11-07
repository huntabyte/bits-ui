<script lang="ts">
	import { untrack, type Snippet } from "svelte";
	import { FloatingRootState } from "../floating-root.svelte.js";

	let { children, tooltip = false }: { children?: Snippet; tooltip?: boolean } = $props();

	FloatingRootState.create(untrack(() => tooltip));

	// `children` is always the caller's own template block, which never changes, so it's
	// called directly instead of through an `{@render}` block (one less block per instance).
	const renderChildren = untrack(() => children);
</script>

{@render renderChildren?.()}
