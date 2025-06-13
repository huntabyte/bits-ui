<script lang="ts">
	import { page } from "$app/state";
	import { cn } from "$lib/utils/styles.js";
	import type { Component } from "svelte";
	import Metadata from "./metadata.svelte";
	import type { TocItem } from "$lib/utils/use-toc.svelte.js";
	import Toc from "./toc/toc.svelte";
	import type { APISchema } from "$lib/content/types.js";
	import type { DocMetadata } from "$lib/utils/docs.js";
	import DocPageHeader from "./doc-page-header.svelte";
	import SidebarSponsor from "./sidebar-sponsor.svelte";

	let {
		component,
		metadata,
		schemas = [],
	}: {
		component: Component;
		metadata: DocMetadata;
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

	const fullToc = $derived(apiSchemaToc ? [...metadata.toc, apiSchemaToc] : metadata.toc);
</script>

<Metadata {...metadata} />

<div
	class={cn(
		"relative flex flex-row-reverse pb-6 pl-4 pr-4 pt-8 sm:pt-16 md:pl-0 lg:gap-10 xl:grid-cols-[1fr_220px]",
		page.error ?? "xl:grid"
	)}
>
	{#if !page.error}
		<aside class="order-2 hidden text-sm xl:block">
			<div
				class="-mt-13 sticky top-16 flex h-[calc(100vh-3.5rem)] flex-col gap-4 overflow-hidden pt-6"
			>
				<SidebarSponsor />
				{#key metadata.title}
					<Toc toc={{ items: fullToc }} />
				{/key}
			</div>
		</aside>
	{/if}
	<div class="order-1 mx-auto w-full min-w-0 md:max-w-[760px]">
		<main class="markdown pb-24" id="main-content">
			<DocPageHeader {metadata} />
			<PageComponent {schemas} />
		</main>
	</div>
</div>
