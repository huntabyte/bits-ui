<script lang="ts">
	import * as Table from "@/components/ui/table";
	import { Code } from "@/components";
	import type { PropObj, PropSchema } from "@/types";
	import { parseMarkdown } from "@/utils";
	import PropTypeContent from "./prop-type-content.svelte";

	export let props: PropObj<Record<string, unknown>>;
	export let slot = false;

	$: propData = Object.entries(props).map(([name, prop]) => {
		const {
			type,
			description,
			default: defaultVal,
			required
		} = prop as PropSchema;
		return { name, type, description, default: defaultVal, required };
	});
</script>

<Table.Root>
	<Table.Header>
		<Table.Row class="w-1/4">
			<Table.Head class="w-[38%] whitespace-nowrap pr-1"
				>{slot ? "Slot" : ""} Property</Table.Head
			>
			<Table.Head class="w-[22%] whitespace-nowrap pr-1">Type</Table.Head>
			<Table.Head class="w-[40%] whitespace-nowrap">Description</Table.Head>
		</Table.Row>
	</Table.Header>
	<Table.Body>
		{#each propData as { type, name, description, default: defaultVal, required }}
			<Table.Row>
				<Table.Cell class="flex items-center gap-1 pr-1 align-baseline">
					<Code class="font-semibold text-foreground">{name}</Code>
					{#if required}
						<div class="pb-1 text-destructive">*</div>
						<span class="sr-only">Required</span>
					{/if}
				</Table.Cell>
				<Table.Cell class="pr-1 align-baseline">
					<PropTypeContent {type} />
				</Table.Cell>
				<Table.Cell class="align-baseline">
					<p class="text-sm leading-[1.3rem]">
						{@html parseMarkdown(description)}
					</p>
					{#if !slot}
						<div class="mt-2">
							<Code class="h-auto bg-background px-0">
								Default:
								{#if defaultVal}
									{` ${defaultVal}`}
								{:else}
									<span aria-hidden> &nbsp;—— </span>
									<span class="sr-only"> undefined </span>
								{/if}
							</Code>
						</div>
					{/if}
				</Table.Cell>
			</Table.Row>
		{/each}
	</Table.Body>
</Table.Root>
