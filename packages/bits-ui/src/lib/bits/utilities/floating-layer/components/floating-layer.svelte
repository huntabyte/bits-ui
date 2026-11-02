<script lang="ts">
	import { untrack, type Snippet } from "svelte";
	import { FloatingRootState } from "../floating-root.svelte.js";

	let { children, tooltip = false }: { children?: Snippet; tooltip?: boolean } = $props();

	FloatingRootState.create(untrack(() => tooltip));
</script>

{@render children?.()}
