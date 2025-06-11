<script lang="ts">
	import Code from "$lib/components/markdown/code.svelte";
	import type { PropType } from "$lib/types/index.js";

	let { type }: { type: PropType } = $props();
</script>

<div class="flex items-center gap-1.5">
	<Code class="bg-transparent px-0">{type.type}</Code>
</div>
