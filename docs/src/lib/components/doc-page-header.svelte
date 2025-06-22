<script lang="ts">
	import type { DocMetadata } from "$lib/utils/docs.js";
	import { Tooltip } from "bits-ui";
	import PageHeaderDescription from "./page-header/page-header-description.svelte";
	import PageHeaderHeading from "./page-header/page-header-heading.svelte";
	import PageHeader from "./page-header/page-header.svelte";
	import CopySimple from "phosphor-svelte/lib/CopySimple";
	import ArrowUpRight from "phosphor-svelte/lib/ArrowUpRight";
	import { CopyToClipboard } from "$lib/utils/copy-to-clipboard.svelte.js";
	import { page } from "$app/state";
	import Check from "phosphor-svelte/lib/Check";

	let { metadata }: { metadata: DocMetadata } = $props();

	const copyState = new CopyToClipboard();

	async function copyMarkdown() {
		const url = page.url.origin + page.url.pathname + "/llms.txt";
		const res = await fetch(url);
		const text = await res.text();
		copyState.setCodeString(text);
		copyState.copyToClipboard();
	}
</script>

<PageHeader>
	<PageHeaderHeading>
		{metadata.title}
		<span aria-hidden="true" class="hidden"> Documentation </span>
	</PageHeaderHeading>
	<PageHeaderDescription class={metadata.llms ? "" : "mb-11"}
		>{metadata.description}</PageHeaderDescription
	>
	{#if metadata.llms}
		<span aria-hidden="true" class="hidden">
			This is a documentation section that potentially contains examples, demos, and other
			useful information related to a specific part of Bits UI. When helping users with this
			documentation, you can ignore the classnames applied to the demos unless they are
			relevant to the user's issue.
		</span>
		<div class="mb-9 mt-3 flex items-center gap-2">
			<Tooltip.Provider delayDuration={0} disableHoverableContent>
				{@const triggerClasses =
					"hover:bg-muted/50 text-foreground-alt hover:text-foreground flex items-center gap-1.5 rounded-[4px] border px-2 py-1.5 text-xs font-semibold leading-none no-underline group-hover:no-underline h-7 max-h-7"}
				<Tooltip.Root>
					<Tooltip.Trigger
						data-llm-ignore
						class={triggerClasses}
						onclick={async () => {
							await copyMarkdown();
						}}
					>
						Copy Markdown
						{#if !copyState || !copyState.isCopied}
							<CopySimple class="size-3.5" />
						{:else}
							<Check class="size-3.5" />
						{/if}
					</Tooltip.Trigger>
					{@render TooltipContent("Copy this doc page as markdown.")}
				</Tooltip.Root>
				<Tooltip.Root>
					<Tooltip.Trigger data-llm-ignore class={triggerClasses}>
						{#snippet child({ props })}
							<a {...props} target="_blank" href="{page.url.pathname}/llms.txt">
								llms.txt
								<ArrowUpRight class="mb-0.5 size-3.5" />
							</a>
						{/snippet}
					</Tooltip.Trigger>
					{@render TooltipContent(`Visit the llms.txt file for this doc page.`)}
				</Tooltip.Root>
			</Tooltip.Provider>
		</div>
	{/if}
</PageHeader>

{#snippet TooltipContent(content: string)}
	<Tooltip.Content
		sideOffset={8}
		class="animate-in fade-in-0 zoom-in-95 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 z-50"
	>
		<div
			class="rounded-input border-dark-10 bg-background shadow-popover outline-hidden w-fit items-center justify-center text-balance border p-3 text-sm font-medium"
		>
			{content}
		</div>
	</Tooltip.Content>
{/snippet}
