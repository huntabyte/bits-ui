<script lang="ts">
	import Code from "../markdown/code.svelte";
	import type { PropType } from "$lib/types/index.js";
	import { parseTypeDef } from "$lib/utils/markdown.js";

	let { type }: { type: PropType } = $props();
</script>

<div class="flex flex-col gap-2">
	<Code class="bg-transparent px-0">{type.type}</Code>
	{#if typeof type.definition === "string"}
		<div class="max-h-[200px] overflow-auto">
			<Code class="text-foreground bg-muted/50 h-auto px-2 py-1 text-xs tracking-tight">
				{@html parseTypeDef(type.definition)}
			</Code>
		</div>
	{:else}
		{@const TypeDef = type.definition}
		<div class="bg-muted/50 max-h-[200px] overflow-auto rounded border p-2">
			<div
				class="[&_pre]:my-0 [&_pre]:border-0 [&_pre]:bg-transparent [&_pre]:p-0 [&_pre]:text-xs"
			>
				<TypeDef />
			</div>
		</div>
	{/if}
</div>
