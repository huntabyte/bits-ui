<script lang="ts">
	import * as Table from "@/components/ui/table";
	import { Code } from "@/components";
	import { parseMarkdown } from "@/utils";
	import type { DataAttrSchema } from "@/types";

	export let dataAttrs: DataAttrSchema[] = [];
</script>

<Table.Root>
	<Table.Header>
		<Table.Row class="w-1/4">
			<Table.Head class="w-1/2 whitespace-nowrap">Data Attribute</Table.Head>
			<Table.Head class="w-1/2 whitespace-nowrap">Description/Value</Table.Head>
		</Table.Row>
	</Table.Header>
	<Table.Body>
		{#if dataAttrs.length}
			{#each dataAttrs as attr}
				<Table.Row>
					<Table.Cell class="align-baseline">
						<Code class="!text-foreground !font-semibold">data-{attr.name}</Code>
					</Table.Cell>
					<Table.Cell class="align-baseline">
						{#if attr.description}
							<p class="text-sm leading-7 my-2">
								{@html parseMarkdown(attr.description)}
							</p>
						{/if}
						{#if attr.value}
							<Code class="!bg-background !px-0 !h-0">Value: {attr.value}</Code>
						{:else}
							<Code class="!bg-background !px-0 !h-0">Value: ''</Code>
						{/if}
					</Table.Cell>
				</Table.Row>
			{/each}
		{/if}
	</Table.Body>
</Table.Root>
