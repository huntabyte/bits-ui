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
			<Table.Head class="w-1/4 whitespace-nowrap pr-1">Property</Table.Head>
			<Table.Head class="w-1/4 whitespace-nowrap pr-1">Type</Table.Head>
			<Table.Head class="w-1/2 whitespace-nowrap pl-6">Description</Table.Head>
		</Table.Row>
	</Table.Header>
	<Table.Body>
		{#each props as prop}
			<Table.Row>
				<Table.Cell class="align-baseline pr-1">
					<Code class="!text-foreground !font-semibold">{prop.name}</Code>
				</Table.Cell>
				<Table.Cell class="align-baseline pr-1">
					<Code>{prop.type}</Code>
				</Table.Cell>
				<Table.Cell class="align-baseline pl-6">
					<p class="text-sm leading-6">
						{@html parseMarkdown(prop.description)}
					</p>
					<div class="mt-4 mb-8">
						<Code class="!bg-background !px-0 !h-0">Default: {prop.default ?? "undefined"}</Code>
					</div>
				</Table.Cell>
			</Table.Row>
		{/each}
	</Table.Body>
</Table.Root>
