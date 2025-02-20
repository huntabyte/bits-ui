<script lang="ts">
	import { Popover, Tooltip } from "bits-ui";
	import Info from "phosphor-svelte/lib/Info";
	import type { Component } from "svelte";
	import Code from "$lib/components/markdown/code.svelte";
	import type { PropType } from "$lib/types/index.js";
	import { parseTypeDef } from "$lib/utils/index.js";

	let {
		type,
		linked = false,
		href = "",
		tooltipContent = "",
	}: {
		type: PropType | string;
		linked?: boolean;
		href?: string;
		tooltipContent?: string;
	} = $props();
</script>

{#snippet StringType()}
	{#if tooltipContent && linked && href}
		<Tooltip.Root>
			<Tooltip.Trigger>
				{#snippet child({ props })}
					<a {href} {...props}>
						<Code class="bg-transparent px-0">{type}</Code>
					</a>
				{/snippet}
			</Tooltip.Trigger>
			<Tooltip.Portal>
				<Tooltip.Content side="top" sideOffset={8}>
					<div
						class="rounded-input border-dark-10 bg-background shadow-popover outline-hidden flex items-center justify-center border p-3 text-sm font-medium"
					>
						{tooltipContent}
					</div>
				</Tooltip.Content>
			</Tooltip.Portal>
		</Tooltip.Root>
	{:else if linked && href}
		<a {href}>
			<Code class="bg-transparent px-0">{type}</Code>
		</a>
	{:else}
		<Code class="bg-transparent px-0">{type}</Code>
	{/if}
{/snippet}

{#snippet TypeContent({ typeDef }: { typeDef: string | Component })}
	{#if typeof typeDef === "string"}
		<Popover.Content
			preventScroll={false}
			side="top"
			sideOffset={10}
			class="focus-override rounded-card border-border bg-background shadow-popover outline-hidden z-50 border p-4"
		>
			<div class="max-h-[400px] max-w-[700px] overflow-auto">
				<Code class="text-foreground h-auto bg-transparent px-0 tracking-tight">
					<!-- eslint-disable-next-line svelte/no-at-html-tags -->
					{@html parseTypeDef(typeDef)}
				</Code>
			</div>
		</Popover.Content>
	{:else}
		<Popover.Content
			preventScroll={false}
			side="top"
			sideOffset={10}
			class="rounded-card border-border bg-background shadow-popover z-50 max-h-[400px] max-w-[600px] overflow-auto border-2 py-4 pl-1.5 pr-4"
		>
			{@const TypeDef = typeDef}
			<div
				class="**:data-line:pr-2.5! [&_pre]:my-0! [&_pre]:mb-0! [&_pre]:overflow-x-visible! [&_pre]:pb-0! [&_pre]:pt-0! [&_pre]:outline-hidden! [&_pre]:ring-0! [&_pre]:ring-offset-0! [&_pre]:mt-0 [&_pre]:border-0 [&_pre]:p-0"
			>
				<TypeDef />
			</div>
		</Popover.Content>
	{/if}
{/snippet}

<div class="flex items-center gap-1.5">
	{#if typeof type === "string"}
		{@render StringType()}
	{:else}
		<Code class="bg-transparent px-0">{type.type}</Code>
		<Popover.Root>
			<Popover.Trigger
				class="rounded-button text-muted-foreground focus-visible:ring-foreground focus-visible:ring-offset-background focus-visible:outline-hidden inline-flex items-center justify-center transition-colors focus-visible:ring-2 focus-visible:ring-offset-2"
			>
				<Info class="size-4" weight="bold" />
				<span class="sr-only">See type definition</span>
			</Popover.Trigger>
			{@render TypeContent({ typeDef: type.definition })}
		</Popover.Root>
	{/if}
</div>
