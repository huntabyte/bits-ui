<script lang="ts">
	import { type Snippet } from "svelte";
	import { type SelectRootState, setSelectRootContext } from "../select.svelte.js";

	let { rootContext, children }: { rootContext: SelectRootState; children: Snippet } = $props();

	setSelectRootContext(rootContext);
</script>

{@render children?.()}
