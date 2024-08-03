<script lang="ts">
	import PlugsConnected from "phosphor-svelte/lib/PlugsConnected";
	import AsteriskSimple from "phosphor-svelte/lib/AsteriskSimple";
	import { Popover, Tooltip } from "bits-ui";
	import PropTypeContent from "./prop-type-content.svelte";
	import { Code } from "$lib/components/index.js";
	import * as Table from "$lib/components/ui/table/index.js";
	import type { PropObj } from "$lib/types/index.js";
	import { parseMarkdown } from "$lib/utils/index.js";

	let {
		props: _props,
		slotted = false,
	}: { props: PropObj<Record<string, unknown>>; slotted?: boolean } = $props();

	const propData = $derived.by(() => {
		if (!_props) return [];
		return Object.entries(_props).map(([name, prop]) => {
			return {
				name,
				type: prop?.type,
				description: prop?.description,
				default: prop?.default,
				required: prop?.required,
				bindable: prop?.bindable,
				linked: prop?.linked,
				href: prop?.href,
				tooltipContent: prop?.tooltipContent,
			};
		});
	});
</script>

<Tooltip.Provider delayDuration={100}>
	<Table.Root>
		<Table.Header>
			<Table.Row class="w-1/4">
				<Table.Head class="w-[38%] whitespace-nowrap pr-1"
					>{slotted ? "Slot" : ""} Property</Table.Head
				>
				<Table.Head class="w-[22%] whitespace-nowrap pr-1">Type</Table.Head>
				<Table.Head class="w-[40%] whitespace-nowrap">Description</Table.Head>
			</Table.Row>
		</Table.Header>
		<Table.Body>
			{#each propData as p, i (p.name + i)}
				<Table.Row>
					<Table.Cell class="flex items-center gap-1 pr-1 align-baseline">
						<Code class="font-semibold text-foreground">{p?.name}</Code>
						{#if p?.required}
							<div class="pb-1 text-destructive" aria-hidden="true">
								<AsteriskSimple class="size-3" />
							</div>
							<span class="sr-only">Required</span>
						{/if}
						{#if p?.bindable}
							<Popover.Root>
								<Popover.Trigger aria-hidden="true">
									<div
										class="ml-2 flex items-center justify-center text-tertiary"
									>
										<PlugsConnected class="size-4" />
										<span class="sr-only">Bindable</span>
									</div>
								</Popover.Trigger>
								<Popover.Content
									preventScroll={false}
									class="z-50 max-h-[400px] overflow-auto rounded-input border border-border bg-background p-4 font-mono shadow-popover"
									side="top"
									sideOffset={10}>$bindable</Popover.Content
								>
							</Popover.Root>
							<span class="sr-only"> bindable prop </span>
						{/if}
					</Table.Cell>
					<Table.Cell class="pr-1 align-baseline">
						<PropTypeContent
							type={p?.type}
							linked={p?.linked}
							href={p?.href}
							tooltipContent={p?.tooltipContent}
						/>
					</Table.Cell>
					<Table.Cell class="align-baseline">
						<p class="text-sm leading-[1.5rem]">
							{@html parseMarkdown(p.description)}
						</p>
						{#if !slotted}
							<div class="mt-2">
								<Code class="h-auto bg-background px-0">
									Default:
									{#if p.default}
										{` ${p.default}`}
									{:else}
										<span aria-hidden="true"> &nbsp;—— </span>
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
</Tooltip.Provider>
