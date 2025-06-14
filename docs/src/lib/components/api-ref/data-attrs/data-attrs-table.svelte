<script lang="ts">
	import Code from "$lib/components/markdown/code.svelte";
	import * as Table from "$lib/components/ui/table/index.js";
	import type { DataAttrSchema } from "$lib/types/index.js";
	import { parseMarkdown } from "$lib/utils/index.js";
	import DataAttrsValueContentMobile from "./data-attrs-value-content-mobile.svelte";
	import DataAttrValueContent from "./data-attrs-value-content.svelte";

	let { dataAttrs = [] }: { dataAttrs: DataAttrSchema[] } = $props();
</script>

<Table.Root>
	<Table.Header>
		<Table.Row>
			<Table.Head class="w-[90%] whitespace-nowrap sm:w-[38%]">Data Attribute</Table.Head>
			<Table.Head class="hidden w-[22%] whitespace-nowrap sm:table-cell">Value</Table.Head>
			<Table.Head class="hidden w-[40%] whitespace-nowrap sm:table-cell"
				>Description</Table.Head
			>
			<Table.Head class="sr-only w-[10%] whitespace-nowrap sm:hidden">Details</Table.Head>
		</Table.Row>
	</Table.Header>
	<Table.Body>
		{#each dataAttrs as attr (attr.name)}
			<Table.Row>
				<Table.Cell class="align-baseline">
					<Code
						class="text-foreground h-fit py-1.5 font-semibold md:py-1 lg:h-[27px] lg:py-0"
						>data-{attr.name}</Code
					>
				</Table.Cell>
				<Table.Cell class="hidden pr-1 align-baseline sm:table-cell">
					<DataAttrValueContent {attr} />
				</Table.Cell>
				<Table.Cell class="hidden align-baseline sm:table-cell">
					<p class="text-sm leading-[1.5rem]">
						{@html parseMarkdown(attr.description)}
					</p>
				</Table.Cell>
				<Table.Cell class="overflow-hidden py-0 sm:hidden">
					<DataAttrsValueContentMobile {attr} />
				</Table.Cell>
			</Table.Row>
		{/each}
	</Table.Body>
</Table.Root>
