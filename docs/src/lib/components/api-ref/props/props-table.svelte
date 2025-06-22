<script lang="ts">
	import type { PropObj, PropSchema } from "$lib/types/index.js";
	import * as Table from "$lib/components/ui/table/index.js";
	import Code from "$lib/components/markdown/code.svelte";
	import PropsRequiredBadge from "./props-required-badge.svelte";
	import PropsBindableBadge from "./props-bindable-badge.svelte";
	import { parseMarkdown } from "$lib/utils/markdown.js";
	import PropsTypeContent from "./props-type-content.svelte";
	import PropsTypeContentMobile from "./props-type-content-mobile.svelte";

	let { props: _props }: { props: PropObj<Record<string, unknown>> } = $props();

	const propData: Array<PropSchema & { name: string }> = $derived.by(() => {
		if (!_props) return [];
		return Object.entries(_props).map(([name, prop]) => {
			return {
				name,
				...prop,
			};
		});
	});
</script>

{#if propData.length}
	<Table.Root>
		<Table.Header>
			<Table.Row>
				<Table.Head class="w-[90%] whitespace-nowrap pr-1 sm:w-[38%]">Property</Table.Head>
				<Table.Head class="hidden w-[22%] whitespace-nowrap pr-1 sm:table-cell">
					Type
				</Table.Head>
				<Table.Head class="hidden w-[40%] whitespace-nowrap sm:table-cell">
					Description
				</Table.Head>
				<Table.Head class="sr-only w-[10%] sm:hidden">Details</Table.Head>
			</Table.Row>
		</Table.Header>
		<Table.Body>
			{#each propData as p, i (p.name + i)}
				<Table.Row>
					<Table.Cell class="flex items-center gap-1 pr-1 align-baseline">
						<Code class="text-foreground h-fit py-1.5 font-semibold sm:h-[27px] sm:py-0"
							>{p.name}</Code
						>
						{#if p.required}
							<PropsRequiredBadge class="hidden sm:block" />
						{/if}
						{#if p.bindable}
							<PropsBindableBadge class="hidden sm:block" />
						{/if}
					</Table.Cell>
					<Table.Cell class="hidden pr-1 align-baseline sm:table-cell">
						<PropsTypeContent prop={p} />
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
					<Table.Cell class="overflow-hidden py-0 sm:hidden">
						<PropsTypeContentMobile prop={p} />
					</Table.Cell>
				</Table.Row>
			{/each}
		</Table.Body>
	</Table.Root>
{/if}
