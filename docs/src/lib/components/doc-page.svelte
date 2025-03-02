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
			</PageHeader>
			<PageComponent {schemas} />
		</main>
	</div>
</div>
