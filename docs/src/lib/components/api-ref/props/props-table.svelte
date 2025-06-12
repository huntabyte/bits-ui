<script lang="ts">
	import type { PropObj } from "$lib/types/index.js";
	import * as Table from "$lib/components/ui/table/index.js";
	import Code from "$lib/components/markdown/code.svelte";
	import PropsRequiredBadge from "./props-required-badge.svelte";
	import PropsBindableBadge from "./props-bindable-badge.svelte";
	import { parseMarkdown } from "$lib/utils/markdown.js";
	import PropsTypeContent from "./props-type-content.svelte";

	let { props: _props }: { props: PropObj<Record<string, unknown>> } = $props();

	const propData = $derived.by(() => {
		if (!_props) return [];
		return Object.entries(_props).map(([name, prop]) => {
			return {
				name,
				...prop,
			};
		});
	});
</script>

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
						<PropsRequiredBadge class="hidden sm:block" />
					{/if}
					{#if p.bindable}
						<PropsBindableBadge class="hidden sm:block" />
					{/if}
				</Table.Cell>
				<Table.Cell class="hidden pr-1 align-baseline sm:table-cell">
					<PropsTypeContent type={p?.type} />
				</Table.Cell>
				<Table.Cell class="hidden align-baseline sm:table-cell">
					<p class="text-sm leading-[1.5rem]">
						{@html parseMarkdown(p.description)}
					</p>
					<div class="mt-2">
						<Code class="bg-background h-auto px-0">
							Default:
							{#if p.default}
								{` ${p.default.value}`}
							{:else}
								<span aria-hidden="true"> &nbsp;—— </span>
								<span class="sr-only"> undefined </span>
							{/if}
						</Code>
					</div>
				</Table.Cell>
				<Table.Cell class="text-center align-middle sm:hidden">
					<!-- <PropMobilePopover
						type={p?.type}
						description={p?.description}
						defaultValue={p?.default}
					/> -->
				</Table.Cell>
			</Table.Row>
		{/each}
	</Table.Body>
</Table.Root>
