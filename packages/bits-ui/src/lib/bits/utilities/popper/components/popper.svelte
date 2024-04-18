<script lang="ts">
	import type { Snippet } from "svelte";
	import { setPopperRootState } from "../popper.svelte.js";

	let { children }: { children?: Snippet } = $props();

	setPopperRootState();
</script>

{@render children?.()}
