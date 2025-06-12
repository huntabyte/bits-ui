<script lang="ts">
	import Code from "$lib/components/markdown/code.svelte";
	import * as Table from "$lib/components/ui/table/index.js";
	import type { CSSVarSchema } from "$lib/types/index.js";
	import { parseMarkdown } from "$lib/utils/index.js";

	let { cssVars = [] }: { cssVars: CSSVarSchema[] } = $props();
</script>

<Table.Root>
	<Table.Header>
		<Table.Row class="w-1/4">
			<Table.Head class="w-[60%] whitespace-nowrap">CSS Variable</Table.Head>
			<Table.Head class="w-[40%] whitespace-nowrap">Description</Table.Head>
		</Table.Row>
	</Table.Header>
	<Table.Body>
		{#if cssVars.length}
			{#each cssVars as attr (attr.name)}
				<Table.Row>
					<Table.Cell class="align-baseline">
						<Code class="text-foreground font-semibold">{attr.name}</Code>
					</Table.Cell>
					<Table.Cell class="align-baseline">
						{#if attr.description}
							<p class="my-2 text-sm leading-7">
								{@html parseMarkdown(attr.description)}
							</p>
						{/if}
					</Table.Cell>
				</Table.Row>
			{/each}
		{/if}
	</Table.Body>
</Table.Root>
