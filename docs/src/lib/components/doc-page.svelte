<script lang="ts">
	import { page } from "$app/state";
	import { cn } from "$lib/utils/styles.js";
	import type { Component } from "svelte";
	import Metadata from "./metadata.svelte";
	import type { TocItem } from "$lib/utils/use-toc.svelte.js";
	import Toc from "./toc/toc.svelte";
	import type { APISchema } from "$lib/types/api.js";
	import PageHeader from "./page-header/page-header.svelte";
	import PageHeaderHeading from "./page-header/page-header-heading.svelte";
	import PageHeaderDescription from "./page-header/page-header-description.svelte";
	import { Tooltip } from "bits-ui";

	let {
		component,
		title,
		description,
		toc,
		schemas = [],
	}: {
		component: Component;
		title: string;
		description?: string;
		toc: TocItem[];
		schemas?: APISchema[];
	} = $props();

	const PageComponent = $derived(component);

	const apiSchemaToc: TocItem | null = $derived.by(() => {
		if (!schemas.length) return null;

		return {
			title: "API Reference",
			url: "#api-reference",
			items: schemas.map((schema) => ({
				title: schema.title,
				url: `#${schema.title.toLowerCase()}`,
			})),
		};
	});

	const fullToc = $derived(apiSchemaToc ? [...toc, apiSchemaToc] : toc);
</script>

<Metadata {title} {description} />

<div
	class={cn(
		"relative flex flex-row-reverse pb-6 pl-4 pr-4 pt-16 md:pl-0 lg:gap-10 xl:grid-cols-[1fr_220px]",
		page.error ?? "xl:grid"
	)}
>
	{#if !page.error}
		<aside class="order-2 hidden text-sm xl:block">
			<div class="sticky top-16 -mt-10 h-[calc(100vh-3.5rem)] overflow-hidden pt-6">
				{#key title}
					<Toc toc={{ items: fullToc }} />
				{/key}
			</div>
		</aside>
	{/if}
	<div class="order-1 mx-auto w-full min-w-0 md:max-w-[760px]">
		<main class="markdown pb-24" id="main-content">
			<PageHeader>
				<PageHeaderHeading>{title}</PageHeaderHeading>
				<PageHeaderDescription>{description}</PageHeaderDescription>
				<div class="flex items-center gap-2">
					<Tooltip.Provider delayDuration={0} disableHoverableContent>
						<Tooltip.Root>
							<Tooltip.Trigger
								data-llm-ignore
								class="hover:bg-muted/50 mb-11 mt-3 rounded-[4px] border px-2 py-1.5 text-xs font-semibold leading-none no-underline group-hover:no-underline"
							>
								Copy Markdown
							</Tooltip.Trigger>
							<Tooltip.Content sideOffset={8} class="z-50">
								<div
									class="rounded-input border-dark-10 bg-background shadow-popover outline-hidden w-fit items-center justify-center text-balance border p-3 text-sm font-medium"
								>
									Copy this documentation page as markdown to your clipboard.
								</div>
							</Tooltip.Content>
						</Tooltip.Root>
						<Tooltip.Root>
							<Tooltip.Trigger
								data-llm-ignore
								class="hover:bg-muted/50 mb-11 mt-3 rounded-[4px] border px-2 py-1.5 text-xs font-semibold leading-none no-underline group-hover:no-underline"
							>
								{#snippet child({ props })}
									<a {...props} target="_blank" href="##"> llms.txt </a>
								{/snippet}
							</Tooltip.Trigger>
							<Tooltip.Content sideOffset={8} class="z-50">
								<div
									class="rounded-input border-dark-10 bg-background shadow-popover outline-hidden w-fit items-center justify-center text-balance border p-3 text-sm font-medium"
								>
									Visit the llms.txt file for this documentation page.
								</div>
							</Tooltip.Content>
						</Tooltip.Root>
					</Tooltip.Provider>
				</div>
			</PageHeader>
			<PageComponent {schemas} />
		</main>
	</div>
</div>
