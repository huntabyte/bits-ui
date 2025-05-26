<script lang="ts">
	import { page } from "$app/state";
	import { cn } from "$lib/utils/styles.js";
	import type { Component } from "svelte";
	import Metadata from "./metadata.svelte";
	import Toc from "./toc/toc.svelte";
	import type { PostMetadata } from "$lib/utils/docs.js";
	import BlogPageHeader from "./blog-page-header.svelte";

	let {
		component,
		metadata,
	}: {
		component: Component;
		metadata: PostMetadata;
	} = $props();

	const PageComponent = $derived(component);
</script>

<Metadata {...metadata} />

<div
	class={cn(
		"relative flex flex-row-reverse pb-6 pl-4 pr-4 pt-16 md:pl-0 lg:gap-10 xl:grid-cols-[1fr_220px]",
		page.error ?? "xl:grid"
	)}
>
	{#if !page.error}
		<aside class="order-2 hidden text-sm xl:block">
			<div class="sticky top-16 -mt-10 h-[calc(100vh-3.5rem)] overflow-hidden pt-6">
				{#key metadata.title}
					<Toc toc={{ items: metadata.toc }} />
				{/key}
			</div>
		</aside>
	{/if}
	<div class="order-1 mx-auto w-full min-w-0 md:max-w-[760px]">
		<main class="markdown pb-24" id="main-content">
			<BlogPageHeader {metadata} />
			<PageComponent />
		</main>
	</div>
</div>
