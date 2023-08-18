<script lang="ts">
	import * as Table from "@/components/ui/table";
	import { Code } from "@/components";
	import type { PropSchema } from "@/types";
	import { parseMarkdown } from "@/utils";

	export let props: PropSchema[] = [];
</script>

<Table.Root>
	<Table.Header>
		<Table.Row class="w-1/4">
			<Table.Head class="w-1/4 whitespace-nowrap">Prop</Table.Head>
			<Table.Head class="w-1/4 whitespace-nowrap">Default</Table.Head>
			<Table.Head class="w-1/2 whitespace-nowrap">Type/Description</Table.Head>
		</Table.Row>
	</Table.Header>
	<Table.Body>
		{#each props as prop}
			<Table.Row>
				<Table.Cell class="align-baseline">
					<Code>{prop.name}</Code>
				</Table.Cell>
				<Table.Cell class="align-baseline">
					{#if prop.default}
						<Code neutral>{prop.default}</Code>
					{:else}
						<p>-</p>
					{/if}
				</Table.Cell>
				<Table.Cell class="align-baseline">
					<Code neutral>{prop.type}</Code>
					<p class="text-sm leading-7 my-2">
						{@html parseMarkdown(prop.description)}
					</p>
				</Table.Cell>
			</Table.Row>
		{/each}
	</Table.Body>
</Table.Root>
