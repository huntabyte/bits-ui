<script lang="ts">
	import { Popover, ScrollArea } from "bits-ui";
	import Info from "phosphor-svelte/lib/Info";
	import type { Component } from "svelte";
	import Code from "$lib/components/markdown/code.svelte";
	import type { PropType } from "$lib/types/index.js";
	import { parseTypeDef } from "$lib/utils/index.js";

	let {
		type,
		disablePopover = false,
	}: {
		type: PropType | string;
		disablePopover?: boolean;
	} = $props();
</script>

{#snippet StringType()}
	<Code class="bg-transparent px-0">{type}</Code>
{/snippet}

{#snippet TypeContent({ typeDef, typeString }: { typeDef: string | Component; typeString: string })}
	{#if typeof typeDef === "string"}
		<Popover.Content
			preventScroll={false}
			side="top"
			sideOffset={10}
			class="focus-override rounded-card border-border bg-background shadow-popover outline-hidden z-50 border"
		>
			<ScrollArea.Root>
				<ScrollArea.Viewport class="max-h-[400px] max-w-[800px] p-4">
					<Code class="text-foreground h-auto bg-transparent px-0 tracking-tight">
						<!-- eslint-disable-next-line svelte/no-at-html-tags -->
						{@html parseTypeDef(typeDef)}
					</Code>
				</ScrollArea.Viewport>
				<ScrollArea.Scrollbar
					orientation="vertical"
					class="hover:bg-dark-10 data-[state=visible]:animate-in data-[state=hidden]:animate-out data-[state=hidden]:fade-out-0 data-[state=visible]:fade-in-0 flex w-2.5 touch-none select-none rounded-full border-l border-l-transparent bg-transparent p-px transition-all duration-200 hover:w-3"
				>
					<ScrollArea.Thumb class="bg-muted-foreground flex-1 rounded-full" />
				</ScrollArea.Scrollbar>
				<ScrollArea.Scrollbar
					orientation="horizontal"
					class="hover:bg-dark-10 flex h-2.5 touch-none select-none rounded-full border-t border-t-transparent bg-transparent p-px transition-all duration-200 hover:h-3 "
				>
					<ScrollArea.Thumb class="bg-muted-foreground rounded-full" />
				</ScrollArea.Scrollbar>
				<ScrollArea.Corner />
			</ScrollArea.Root>
		</Popover.Content>
		<span aria-hidden="true" class="hidden">
			- {typeDef}
		</span>
	{:else}
		<Popover.Content
			preventScroll={false}
			side="top"
			sideOffset={10}
			class="rounded-card border-border bg-background shadow-popover z-50 border-2 py-1.5 pl-1.5 pr-0.5"
		>
			<ScrollArea.Root>
				<ScrollArea.Viewport class="max-h-[400px] max-w-[800px] py-3.5 pr-3.5">
					{@const TypeDef = typeDef}
					<div
						class="**:data-line:pr-2.5! [&_pre]:my-0! [&_pre]:mb-0! [&_pre]:overflow-x-visible! [&_pre]:pb-0! [&_pre]:pt-0! [&_pre]:outline-hidden! [&_pre]:ring-0! [&_pre]:ring-offset-0! [&_pre]:mt-0 [&_pre]:border-0 [&_pre]:p-0"
					>
						<TypeDef />
					</div>
				</ScrollArea.Viewport>
				<ScrollArea.Scrollbar
					orientation="vertical"
					class="hover:bg-dark-10 data-[state=visible]:animate-in data-[state=hidden]:animate-out data-[state=hidden]:fade-out-0 data-[state=visible]:fade-in-0 flex w-2.5 touch-none select-none rounded-full border-l border-l-transparent bg-transparent p-px transition-all duration-200 hover:w-3"
				>
					<ScrollArea.Thumb class="bg-muted-foreground flex-1 rounded-full" />
				</ScrollArea.Scrollbar>
				<ScrollArea.Scrollbar
					orientation="horizontal"
					class="hover:bg-dark-10 flex h-2.5 touch-none select-none rounded-full border-t border-t-transparent bg-transparent p-px transition-all duration-200 hover:h-3 "
				>
					<ScrollArea.Thumb class="bg-muted-foreground rounded-full" />
				</ScrollArea.Scrollbar>
				<ScrollArea.Corner />
			</ScrollArea.Root>
		</Popover.Content>
		<span aria-hidden="true" class="hidden">
			- {typeString}
		</span>
	{/if}
{/snippet}

<div class="flex items-center gap-1.5">
	{#if typeof type === "string"}
		{@render StringType()}
	{:else if disablePopover}
		<div class="flex flex-col gap-2">
			<Code class="bg-transparent px-0">{type.type}</Code>
			{#if typeof type.definition === "string"}
				<div class="max-h-[200px] overflow-auto">
					<Code
						class="text-foreground bg-muted/50 h-auto px-2 py-1 text-xs tracking-tight"
					>
						<!-- eslint-disable-next-line svelte/no-at-html-tags -->
						{@html parseTypeDef(type.definition)}
					</Code>
				</div>
			{:else}
				{@const TypeDef = type.definition}
				<div class="bg-muted/50 max-h-[200px] overflow-auto rounded border p-2">
					<div
						class="[&_pre]:my-0 [&_pre]:border-0 [&_pre]:bg-transparent [&_pre]:p-0 [&_pre]:text-xs"
					>
						<TypeDef />
					</div>
				</div>
			{/if}
		</div>
	{:else}
		<Code class="bg-transparent px-0">{type.type}</Code>
		<Popover.Root>
			<Popover.Trigger
				data-llm-ignore
				class="rounded-button text-muted-foreground focus-visible:ring-foreground focus-visible:ring-offset-background focus-visible:outline-hidden inline-flex items-center justify-center transition-colors focus-visible:ring-2 focus-visible:ring-offset-2"
			>
				<Info class="size-4" weight="bold" />
				<span class="sr-only">See type definition</span>
			</Popover.Trigger>
			{@render TypeContent({ typeDef: type.definition, typeString: type.stringDefinition })}
		</Popover.Root>
	{/if}
</div>
