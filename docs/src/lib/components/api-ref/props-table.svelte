<script lang="ts">
	import { Tooltip } from "bits-ui";
	import Badge from "../ui/badge.svelte";
	import PropTypeContent from "./prop-type-content.svelte";
	import PropMobilePopover from "./prop-mobile-popover.svelte";
	import Code from "$lib/components/markdown/code.svelte";
	import * as Table from "$lib/components/ui/table/index.js";
	import type { PropObj } from "$lib/types/index.js";
	import { parseMarkdown } from "$lib/utils/index.js";

	let { props: _props }: { props: PropObj<Record<string, unknown>> } = $props();

	const propData = $derived.by(() => {
		if (!_props) return [];
		return Object.entries(_props).map(([name, prop]) => {
			return {
				name,
				type: prop.type,
				description: prop.description,
				default: prop.default,
				required: prop.required,
				bindable: prop.bindable,
			};
		});
	});
</script>

<Tooltip.Provider delayDuration={100}>
	<Table.Root>
		<Table.Header>
			<Table.Row class="w-1/4">
				<Table.Head class="w-full whitespace-nowrap pr-1 sm:w-[38%]">Property</Table.Head>
				<Table.Head class="hidden w-[22%] whitespace-nowrap pr-1 sm:table-cell">
					Type
				</Table.Head>
				<Table.Head class="hidden w-[40%] whitespace-nowrap sm:table-cell">
					Description
				</Table.Head>
				<Table.Head class="w-8 sm:hidden">Details</Table.Head>
			</Table.Row>
		</Table.Header>
		<Table.Body>
			{#each propData as p, i (p.name + i)}
				<Table.Row>
					<Table.Cell class="flex items-center gap-1 pr-1 align-baseline">
						<Code class="text-foreground font-semibold">{p?.name}</Code>
						{#if p.required}
							<Badge class="border-destructive bg-background text-destructive border">
								required
							</Badge>
						{/if}
						{#if p.bindable}
							<Badge
								class="bg-background border border-[#2A266B] text-[#2A266B] dark:border-[#FCDAFE] dark:text-[#FCDAFE]"
							>
								$bindable
							</Badge>
						{/if}
					</Table.Cell>
					<Table.Cell class="hidden pr-1 align-baseline sm:table-cell">
						<PropTypeContent type={p?.type} />
					</Table.Cell>
					<Table.Cell class="hidden align-baseline sm:table-cell">
						<p class="text-sm leading-[1.5rem]">
							<!-- eslint-disable-next-line svelte/no-at-html-tags -->
							{@html parseMarkdown(p.description)}
						</p>
						<div class="mt-2">
							<Code class="bg-background h-auto px-0">
								Default:
								{#if p.default}
									{` ${p.default}`}
								{:else}
									<span aria-hidden="true"> &nbsp;—— </span>
									<span class="sr-only"> undefined </span>
								{/if}
							</Code>
						</div>
					</Table.Cell>
					<Table.Cell class="text-center align-middle sm:hidden">
						<PropMobilePopover
							type={p?.type}
							description={p?.description}
							defaultValue={p?.default}
						/>
					</Table.Cell>
				</Table.Row>
			{/each}
		</Table.Body>
	</Table.Root>
</Tooltip.Provider>
