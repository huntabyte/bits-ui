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
			<Table.Head class="w-1/2 whitespace-nowrap">Value/Description</Table.Head>
		</Table.Row>
	</Table.Header>
	<Table.Body>
		{#if dataAttrs.length}
			{#each dataAttrs as attr}
				<Table.Row>
					<Table.Cell class="align-baseline">
						<Code class="!text-secondary-foreground">data-{attr.name}</Code>
					</Table.Cell>
					<Table.Cell class="align-baseline">
						{#if attr.value}
							<Code neutral>{attr.value}</Code>
						{/if}
						{#if attr.description}
							<p class="text-sm leading-7 my-2">
								{@html parseMarkdown(attr.description)}
							</p>
						{/if}
					</Table.Cell>
				</Table.Row>
			{/each}
		{/if}
	</Table.Body>
</Table.Root>
