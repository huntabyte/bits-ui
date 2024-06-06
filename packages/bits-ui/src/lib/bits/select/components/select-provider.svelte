<script lang="ts">
	import { type Snippet, setContext } from "svelte";
	import type { SelectRootState } from "../select.svelte.js";

	let { rootContext, children }: { rootContext: SelectRootState; children: Snippet } = $props();

	setContext("selectRootState", rootContext);
</script>

{@render children?.()}
